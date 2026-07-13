import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Download, FileText, Sparkles, CheckCircle } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { RESUME_PUBLIC_URL } from "@/lib/supabase";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
};

const ResumeDownloadButton = () => {
  const { data: portfolioData } = usePortfolio();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  
  // Big Bang Animation State
  const [particlePhase, setParticlePhase] = useState<"idle" | "bang" | "implode">("idle");
  const [particles, setParticles] = useState<Particle[]>([]);

  const resume = portfolioData?.resume || null;
  // Fall back to the resume stored in Supabase storage so the button always works
  const resumeUrl = resume?.url || RESUME_PUBLIC_URL;
  const uploadedAt = resume?.uploadedAt || null;

  // Check if resume was uploaded within the last 30 days
  const isRecentlyUpdated = uploadedAt
    ? Date.now() - uploadedAt < 30 * 24 * 60 * 60 * 1000
    : false;

  const handleDownload = async () => {
    if (!resumeUrl || isDownloading) return;

    setIsDownloading(true);
    window.dispatchEvent(new CustomEvent('resume-download-start'));

    // 1. Big Bang Phase: Spawn particles shooting outwards
    setParticlePhase("bang");
    const newParticles = Array.from({ length: 45 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 70 + Math.random() * 130; // Float between 70px to 200px away
      return {
        id: Date.now() + i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: Math.random() * 5 + 2, // 2px to 7px size
        color: ["bg-primary", "bg-accent", "bg-purple-400", "bg-cyan-400", "bg-blue-400", "bg-emerald-400", "bg-pink-400"][Math.floor(Math.random() * 7)],
        delay: Math.random() * 0.2, // Staggered explosion
      };
    });
    setParticles(newParticles);

    try {
      // Fetch the resume PDF from Supabase public storage as a blob
      const res = await fetch(resumeUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Trigger clean named download — viewer only sees "Ashraf_Ali_Resume.pdf"
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "Ashraf_Ali_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL immediately
      setTimeout(() => URL.revokeObjectURL(blobUrl), 500);

      // 2. Implode Phase: Gravity sucks particles back in
      setParticlePhase("implode");
      
      setTimeout(() => {
        setIsDownloading(false);
        setDownloaded(true);
        window.dispatchEvent(new CustomEvent('resume-download-end'));
        
        setTimeout(() => setDownloaded(false), 3000);
        setParticlePhase("idle");
        setParticles([]);
      }, 700); // Wait 700ms for particles to zip back in

    } catch (err) {
      console.error("Resume download failed:", err);
      // Even on error, suck particles back
      setParticlePhase("implode");
      setTimeout(() => {
        setIsDownloading(false);
        window.dispatchEvent(new CustomEvent('resume-download-end'));
        setParticlePhase("idle");
        setParticles([]);
      }, 700);
    }
  };

  if (!resumeUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative inline-flex items-center mt-6"
    >
      {/* Big Bang Particle Container (outside hidden overflow so they can float anywhere) */}
      <div className="absolute top-1/2 left-1/2 pointer-events-none z-50">
        <AnimatePresence>
          {particlePhase !== "idle" && particles.map((p) => (
            <motion.div
              key={p.id}
              className={`absolute rounded-full ${p.color} shadow-[0_0_12px_currentColor]`}
              style={{ width: p.size, height: p.size, marginTop: -p.size/2, marginLeft: -p.size/2 }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
              animate={
                particlePhase === "bang"
                  ? {
                      x: [0, p.x, p.x + (Math.random() * 20 - 10)],
                      y: [0, p.y, p.y + (Math.random() * 20 - 10)],
                      scale: [0, 1.2, 0.8 + Math.random() * 0.4],
                      opacity: [0, 1, 0.6 + Math.random() * 0.4],
                      transition: {
                        duration: 2 + Math.random() * 1.5,
                        times: [0, 0.15, 1], // Very quick pop out, then slow drifting float
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: p.delay,
                      },
                    }
                  : particlePhase === "implode"
                  ? {
                      x: 0,
                      y: 0,
                      scale: 0,
                      opacity: 0,
                      transition: {
                        duration: 0.6,
                        ease: "backIn", // Snaps back like a rubber band / black hole gravity
                      },
                    }
                  : {}
              }
              exit={{ opacity: 0, scale: 0 }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-2xl blur-xl opacity-40 bg-gradient-to-r from-primary via-accent to-primary animate-pulse z-0" />

      {/* Shimmer border wrapper */}
      <div
        className="relative p-[2px] rounded-2xl overflow-hidden z-10"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))",
          backgroundSize: "200% 200%",
          animation: "shimmer-border 3s linear infinite",
        }}
      >
        {/* Button body */}
        <motion.button
          id="resume-download-btn"
          onClick={handleDownload}
          disabled={isDownloading}
          className="relative flex items-center gap-3 px-6 py-3.5 rounded-[14px] bg-background/95 backdrop-blur-sm overflow-hidden group cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {/* Hover sweep background */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--accent) / 0.12))",
            }}
          />

          {/* Icon */}
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30">
            <AnimatePresence mode="wait">
              {downloaded ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <CheckCircle className="w-4 h-4 text-background" />
                </motion.div>
              ) : isDownloading ? (
                <motion.div
                  key="spinner"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <div className="w-4 h-4 rounded-full border-2 border-background/30 border-t-background animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  key="file"
                  className="group-hover:hidden"
                  initial={{ scale: 1 }}
                >
                  <FileText className="w-4 h-4 text-background" />
                </motion.div>
              )}
              {!isDownloading && !downloaded && (
                <motion.div
                  key="download-hover"
                  className="hidden group-hover:block"
                  initial={{ y: -4, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <Download className="w-4 h-4 text-background" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Text */}
          <div className="relative text-left">
            <AnimatePresence mode="wait">
              {downloaded ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <p className="text-sm font-semibold text-primary leading-none">Downloaded!</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Check your downloads</p>
                </motion.div>
              ) : isDownloading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <p className="text-sm font-semibold text-foreground leading-none">Downloading…</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Gathering data particles</p>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <p className="text-sm font-bold text-foreground leading-none group-hover:text-primary transition-colors">
                    Download Resume
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">PDF · Latest version</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sparkle icon on right */}
          {!isDownloading && !downloaded && (
            <Sparkles className="relative w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity ml-1 flex-shrink-0" />
          )}
        </motion.button>
      </div>

      {/* "Recently Updated" badge */}
      {isRecentlyUpdated && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 1.8, type: "spring", stiffness: 300 }}
          className="absolute -top-3 -right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-primary to-accent text-background text-[10px] font-bold shadow-lg shadow-primary/40 whitespace-nowrap z-20"
        >
          <Sparkles className="w-2.5 h-2.5" />
          Updated
        </motion.div>
      )}

      {/* Inline keyframes for shimmer border */}
      <style>{`
        @keyframes shimmer-border {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </motion.div>
  );
};

export default ResumeDownloadButton;
