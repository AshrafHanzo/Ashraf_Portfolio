import { db } from './firebase';
import { ref, get, set, remove } from 'firebase/database';
import { sendEmail } from './sendEmail';

// IPinfo Lite API token — used ONLY to fetch Organization + ASN
// All other data (IP, city, country etc.) still comes from ipapi.co
const IPINFO_TOKEN = "c8a0adb359417e";

const COOLDOWN_HOURS = 12;

// ── Helpers ──────────────────────────────────────────────────────────────────

const getOS = () => {
  const ua = window.navigator.userAgent;
  if (ua.indexOf("like Mac") !== -1) return "iOS";
  if (ua.indexOf("Android") !== -1) return "Android";
  if (ua.indexOf("Win") !== -1) return "Windows";
  if (ua.indexOf("Mac") !== -1) return "MacOS";
  if (ua.indexOf("Linux") !== -1) return "Linux";
  if (ua.indexOf("X11") !== -1) return "UNIX";
  return "Unknown OS";
};

const getDevice = () => {
  const ua = window.navigator.userAgent;
  if (/mobile/i.test(ua)) return "Mobile";
  if (/tablet/i.test(ua)) return "Tablet";
  return "Desktop";
};

// Background task: remove IP records older than 24 hours from Firebase
// Note: Uses client-side filtering to avoid requiring a Firebase .indexOn rule
const clearOldCache = async () => {
  try {
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    const allVisitorsRef = ref(db, 'tracked_visitors');
    const snapshot = await get(allVisitorsRef);
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        const data = child.val();
        if (data?.lastVisit && data.lastVisit < twentyFourHoursAgo) {
          remove(child.ref);
        }
      });
    }
  } catch (err) {
    console.warn("Could not clear old visitor cache:", err);
  }
};

// ── Step 1: Get full location data from ipapi.co (same as before) ─────────

interface IpapiData {
  ip: string;
  city: string;
  region: string;
  country_name: string;
}

const fetchLocationData = async (): Promise<IpapiData> => {
  const res = await fetch('https://ipapi.co/json/');
  const data = await res.json();
  return {
    ip:           data.ip           || 'Unknown',
    city:         data.city         || '',
    region:       data.region       || '',
    country_name: data.country_name || '',
  };
};

// ── Step 2: Get ONLY org + ASN from IPinfo Lite using the known IP ────────

interface OrgData {
  organization: string;
  asn: string;
}

const fetchOrgFromIPInfo = async (ip: string): Promise<OrgData> => {
  try {
    // v2 — CORS-safe: ipinfo.io/{ip}?token= (browser compatible, not api.ipinfo.io/lite)
    const res = await fetch(`https://ipinfo.io/${ip}?token=${IPINFO_TOKEN}`);
    const data = await res.json();

    // `org` field looks like: "AS2639 Zoho Corporation Pvt. Ltd."
    const rawOrg: string = data.org || '';
    const parts = rawOrg.match(/^(AS\d+)\s+(.+)$/);
    return {
      asn:          parts ? parts[1] : (rawOrg || 'Unknown ASN'),
      organization: parts ? parts[2] : (rawOrg || 'Unknown Organization'),
    };
  } catch {
    // If IPinfo fails, silently fallback — rest of the email still sends
    return { asn: 'Unknown ASN', organization: 'Unknown Organization' };
  }
};

// ── Main export ───────────────────────────────────────────────────────────

export const trackVisitor = async () => {
  // Fire-and-forget: clean up IPs older than 24h in background
  clearOldCache();

  try {
    // 1. Get visitor IP + full location from ipapi.co (city, region, country)
    const { ip, city, region, country_name } = await fetchLocationData();

    if (!ip || ip === 'Unknown') return;

    // Sanitize IP for use as a Firebase key
    const safeIp = ip.replace(/[.:#$[\]]/g, '_');

    // 2. Firebase cooldown check — skip if same IP visited within 12 hours
    const visitorRef = ref(db, `tracked_visitors/${safeIp}`);
    const snapshot = await get(visitorRef);

    if (snapshot.exists()) {
      const hoursSince = (Date.now() - snapshot.val().lastVisit) / (1000 * 60 * 60);
      if (hoursSince < COOLDOWN_HOURS) return;
    }

    // 3. Get Organization + ASN from IPinfo Lite using the IP we already know
    const { organization, asn } = await fetchOrgFromIPInfo(ip);

    // 4. Collect browser/device info from the system (unchanged from before)
    const os     = getOS();
    const device = getDevice();
    const time   = new Date().toLocaleString();

    // Build location string the same way as before: "City, Region, Country"
    const location = [city, region, country_name]
      .filter(Boolean)
      .join(', ') || 'Unknown Location';

    // 5. Send enriched email — combines ipapi.co location + IPinfo org/ASN
    await sendEmail("visitor", {
      time,
      ip,
      location,                                                 // City, Region, Country (ipapi.co)
      country: [city, country_name].filter(Boolean).join(', '), // City, Country (ipapi.co)
      organization,                                             // Company / ISP name (IPinfo)
      asn,                                                      // e.g. AS2639 (IPinfo)
      ipinfo_url: `https://ipinfo.io/${ip}`,
      device,
      os,
    });

    // 6. Save to Firebase with full data
    await set(visitorRef, {
      lastVisit:    Date.now(),
      ip:           ip,
      location:     location,
      country:      country_name,
      organization: organization,
      asn:          asn,
    });

  } catch (error) {
    console.error("Failed to track visitor:", error);
  }
};
