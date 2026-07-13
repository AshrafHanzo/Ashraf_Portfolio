// Serverless mailer for the portfolio — sends via Gmail SMTP (app password).
// Works on Vercel (/api/send-email) AND in local `npm run dev` (see vite.config.ts).
//
// SECURITY: the Gmail app password is read from environment variables ONLY.
// Never hard-code it here. Set GMAIL_USER / GMAIL_APP_PASSWORD in:
//   • Vercel → Project → Settings → Environment Variables
//   • local .env file (git-ignored)
import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER || "ashrafali.offic@gmail.com";
// Gmail shows app passwords with spaces; SMTP wants them without.
const GMAIL_APP_PASSWORD = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
const CONTACT_TO = process.env.CONTACT_TO || GMAIL_USER;

let transporter = null;
function getTransporter() {
    if (!GMAIL_APP_PASSWORD) {
        throw new Error("Email is not configured (missing GMAIL_APP_PASSWORD env var).");
    }
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
        });
    }
    return transporter;
}

const esc = (s) =>
    String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

// ── Comic-book Spider-Man email shell ────────────────────────────────────────
function shell({ eyebrow, title, bodyHtml, accent = "#e11d2a" }) {
    return `<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#07070c;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(eyebrow)} — ${esc(title)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#07070c;padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111119;border:1px solid rgba(225,29,42,0.28);border-radius:18px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.6);">

        <!-- Header -->
        <tr><td style="background:${accent};background-image:linear-gradient(135deg,${accent} 0%,#2563eb 100%);padding:26px 28px;">
          <table role="presentation" width="100%"><tr>
            <td style="font-size:30px;line-height:1;">🕸️</td>
            <td align="right" style="color:#ffffff;font-size:12px;letter-spacing:3px;text-transform:uppercase;opacity:0.9;font-weight:700;">${esc(eyebrow)}</td>
          </tr></table>
          <div style="color:#ffffff;font-size:26px;font-weight:800;margin-top:14px;letter-spacing:0.3px;">${esc(title)}</div>
        </td></tr>

        <!-- Halftone divider -->
        <tr><td style="height:6px;background:#07070c;background-image:radial-gradient(#e11d2a 1px,transparent 1.4px);background-size:8px 8px;opacity:0.5;"></td></tr>

        <!-- Body -->
        <tr><td style="padding:30px 28px;color:#e9e9f2;font-size:15px;line-height:1.65;">
          ${bodyHtml}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 28px;border-top:1px solid rgba(255,255,255,0.08);background:#0c0c14;">
          <table role="presentation" width="100%"><tr>
            <td style="color:#8a8a9c;font-size:12px;">Ashraf Ali · AI Automation Engineer</td>
            <td align="right" style="color:#8a8a9c;font-size:12px;">Chennai, India</td>
          </tr></table>
          <div style="color:#5a5a6a;font-size:11px;margin-top:8px;">Sent from your portfolio · “With great code comes great responsibility.”</div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

function pill(label, value, color = "#e11d2a") {
    return `<tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#9a9ab0;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:130px;vertical-align:top;">${esc(label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#f2f2f7;font-size:14px;font-weight:600;">${value}</td>
    </tr>`;
}

// ── Templates ────────────────────────────────────────────────────────────────
function contactTemplate(p) {
    const name = esc(p.name || "Someone");
    const email = esc(p.email || "");
    const message = esc(p.message || "").replace(/\n/g, "<br>");
    const when = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const body = `
      <p style="margin:0 0 18px;color:#c9c9d6;">You just caught a new message in your web 🕸️</p>
      <table role="presentation" width="100%" style="margin-bottom:22px;">
        ${pill("From", name)}
        ${pill("Email", `<a href="mailto:${email}" style="color:#5b8cff;text-decoration:none;">${email}</a>`)}
        ${pill("Received", esc(when))}
      </table>
      <div style="background:#0c0c14;border:1px solid rgba(225,29,42,0.25);border-left:4px solid #e11d2a;border-radius:12px;padding:18px 20px;color:#eaeaf2;font-size:15px;line-height:1.7;">
        ${message || "<em style='color:#8a8a9c;'>(no message)</em>"}
      </div>
      <div style="text-align:center;margin-top:26px;">
        <a href="mailto:${email}" style="display:inline-block;background:#e11d2a;background-image:linear-gradient(135deg,#e11d2a,#2563eb);color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:13px 28px;border-radius:999px;">Reply to ${name} →</a>
      </div>`;
    return {
        subject: `🕷️ New message from ${p.name || "your portfolio"}`,
        html: shell({ eyebrow: "New Contact", title: `${p.name || "New message"}`, bodyHtml: body }),
        replyTo: p.email || undefined,
    };
}

function visitorTemplate(p) {
    const body = `
      <p style="margin:0 0 18px;color:#c9c9d6;">Your spider-sense is tingling — someone is exploring your portfolio 🕸️</p>
      <table role="presentation" width="100%">
        ${pill("Time", esc(p.time))}
        ${pill("Location", esc(p.location))}
        ${pill("IP", esc(p.ip))}
        ${pill("Organization", esc(p.organization))}
        ${pill("ASN", esc(p.asn))}
        ${pill("Device", `${esc(p.device)} · ${esc(p.os)}`)}
      </table>
      ${p.ipinfo_url ? `<div style="text-align:center;margin-top:24px;"><a href="${esc(p.ipinfo_url)}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:11px 24px;border-radius:999px;">Inspect on IPinfo →</a></div>` : ""}`;
    return {
        subject: `🕸️ New visitor · ${p.location || "Unknown location"}`,
        html: shell({ eyebrow: "Visitor Alert", title: "Someone visited your portfolio", bodyHtml: body, accent: "#2563eb" }),
    };
}

function otpTemplate(p) {
    const otp = esc(p.otp || "");
    const body = `
      <p style="margin:0 0 20px;color:#c9c9d6;">Use this code to reset your admin password. It expires in <strong style="color:#fff;">5 minutes</strong>.</p>
      <div style="text-align:center;margin:10px 0 24px;">
        <div style="display:inline-block;background:#0c0c14;border:1px solid rgba(225,29,42,0.35);border-radius:14px;padding:20px 34px;font-size:40px;font-weight:800;letter-spacing:12px;color:#fff;font-family:'Courier New',monospace;">${otp}</div>
      </div>
      <p style="margin:0;color:#8a8a9c;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>`;
    return {
        subject: `🔐 Your admin reset code: ${otp}`,
        html: shell({ eyebrow: "Security", title: "Password Reset Code", bodyHtml: body }),
    };
}

// ── Core send ────────────────────────────────────────────────────────────────
export async function sendPortfolioEmail({ type, payload = {} }) {
    let tpl;
    if (type === "contact") tpl = contactTemplate(payload);
    else if (type === "visitor") tpl = visitorTemplate(payload);
    else if (type === "otp") tpl = otpTemplate(payload);
    else throw new Error(`Unknown email type: ${type}`);

    await getTransporter().sendMail({
        from: `"Ashraf Portfolio 🕸️" <${GMAIL_USER}>`,
        to: CONTACT_TO,
        subject: tpl.subject,
        html: tpl.html,
        replyTo: tpl.replyTo,
    });
    return { ok: true };
}

// ── Vercel serverless handler ────────────────────────────────────────────────
export default async function handler(req, res) {
    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        return res.status(204).end();
    }
    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }
    try {
        const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
        await sendPortfolioEmail(body);
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error("send-email error:", err);
        return res.status(500).json({ ok: false, error: err.message || "Failed to send" });
    }
}
