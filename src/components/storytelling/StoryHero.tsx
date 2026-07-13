import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { personalInfo as defaultPersonalInfo } from "@/data/storytellingData";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { useAdaptiveAnimation } from "@/hooks/useAdaptiveAnimation";
import ResumeDownloadButton from "@/components/storytelling/ResumeDownloadButton";

const SuckableTechItem = ({ children, className, delay, style, isDownloading, floating = false }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState({ x: [0, 0, 0], y: [0, 0, 0], rotate: 0 });

  useEffect(() => {
    if (isDownloading) {
      const btn = document.getElementById("resume-download-btn");
      if (btn && ref.current) {
        const btnRect = btn.getBoundingClientRect();
        const elRect = ref.current.getBoundingClientRect();
        
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;
        
        const elCenterX = elRect.left + elRect.width / 2;
        const elCenterY = elRect.top + elRect.height / 2;
        
        const dx = btnCenterX - elCenterX;
        const dy = btnCenterY - elCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate perpendicular vector for curved path (Whirlpool arc)
        const perpX = -dy / dist;
        const perpY = dx / dist;
        
        // Direction of whirlpool curve based on whether it's left or right of button
        const direction = elCenterX > btnCenterX ? 1 : -1;
        const curveOffset = dist * 0.5 * direction; 
        
        // Midpoint of the curve
        const midX = dx * 0.5 + perpX * curveOffset;
        const midY = dy * 0.5 + perpY * curveOffset;

        // Spin 720 degrees
        const rotateAmount = direction * (720 + Math.random() * 360);

        setTarget({
          x: [0, midX, dx],
          y: [0, midY, dy],
          rotate: rotateAmount
        });
      }
    }
  }, [isDownloading]);

  const idleAnimate = floating 
    ? { opacity: 1, scale: 1, x: 0, y: [0, -8, 0], rotate: 0 }
    : { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 };
    
  const idleTransition = floating
    ? {
        opacity: { delay: 1.5 + delay, duration: 0.5 },
        scale: { delay: 1.5 + delay, duration: 0.5 },
        y: { delay: 2 + delay, duration: 3, repeat: Infinity, ease: "easeInOut" },
        x: { duration: 0.6, type: "spring", bounce: 0.5 },
        scale: { duration: 0.6, type: "spring", bounce: 0.5 },
        rotate: { duration: 0.6, type: "spring", bounce: 0.5 }
      }
    : { delay: 1.2 + delay, type: "spring", bounce: 0.4 };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, scale: floating ? 0 : 0.8 }}
      whileHover={!isDownloading && !floating ? { scale: 1.1, y: -2 } : {}}
      animate={
        isDownloading
          ? {
              opacity: [1, 1, 0],
              scale: [1, 0.5, 0.05],
              x: target.x,
              y: target.y,
              rotate: target.rotate,
              transition: { 
                duration: 0.8 + Math.random() * 0.2, 
                ease: "easeInOut",
                times: [0, 0.6, 1] // Follow the 3 keyframes
              }
            }
          : idleAnimate
      }
      transition={isDownloading ? undefined : idleTransition as any}
    >
      {children}
    </motion.div>
  );
};

const StoryHero = () => {
  const { data: portfolioData } = usePortfolio();
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Use data from portfolio context
  const personalInfo = portfolioData?.personal || defaultPersonalInfo;
  const { config, adjustTransition } = useAdaptiveAnimation();

  // Reset image error when profileImage changes
  useEffect(() => {
    setImageError(false);
  }, [personalInfo.profileImage]);

  useEffect(() => {
    const handleStart = () => setIsDownloading(true);
    const handleEnd = () => setIsDownloading(false);
    window.addEventListener('resume-download-start', handleStart);
    window.addEventListener('resume-download-end', handleEnd);
    return () => {
      window.removeEventListener('resume-download-start', handleStart);
      window.removeEventListener('resume-download-end', handleEnd);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms - Disabled on low-performance devices
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Full name for animation
  const fullName = personalInfo.name || defaultPersonalInfo.name;
  const firstName = personalInfo.firstName || defaultPersonalInfo.firstName || "Ashraf";
  const nameLetters = fullName.split("");

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background orbs */}

      {/* Gradient orbs - Only show on desktop/systems */}
      {config.enableComplexAnimations && (
        <>
          <motion.div
            className="absolute top-1/4 -left-32 w-[400px] h-[400px] rounded-full blur-[128px] opacity-10 hidden md:block" // Reduced from 0.3
            style={{ background: "var(--gradient-primary)" }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }} // Drastic reduction
            transition={{ duration: 8 * config.animationDuration, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-32 w-[350px] h-[350px] rounded-full blur-[128px] opacity-10 hidden md:block" // Reduced from 0.2
            style={{ background: "var(--gradient-accent)" }}
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.03, 0.1, 0.03] }} // Drastic reduction
            transition={{ duration: 10 * config.animationDuration, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* Main content */}
      <motion.div style={{ opacity, scale }} className="container-custom relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Text content - 3 columns */}
          <div className="lg:col-span-3 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={adjustTransition({ delay: 0.1 })}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border ${personalInfo.badgeColor === 'accent' ? 'border-accent/30' : 'border-primary/30'} mb-8 relative z-10`}
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${personalInfo.badgeColor === 'accent' ? 'bg-accent' : 'bg-primary'}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${personalInfo.badgeColor === 'accent' ? 'bg-accent' : 'bg-primary'}`} />
              </span>
              <span className={`text-sm font-medium ${personalInfo.badgeColor === 'accent' ? 'text-accent' : 'text-primary'}`}>
                {personalInfo.badgeText || "AI Automation Expert @"} {personalInfo.currentCompany || "WorkBooster AI"}
              </span>
            </motion.div>

            {/* Animated name with letter-by-letter reveal */}
            <motion.div
              initial={{ opacity: 0, y: config.enableComplexAnimations ? 30 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={adjustTransition({ duration: 0.8, delay: 0.2 })}
              style={{ y: textY }}
            >
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-foreground">Hi, I'm </span>
                <span className="text-gradient inline-flex flex-wrap">
                  {/* Mobile: Split name into two lines */}
                  <span className="block md:hidden w-full">
                    <span className="block">{firstName}</span>
                    <span className="block">{fullName.replace(firstName, "").trim()}</span>
                  </span>
                  {/* Desktop: Animated letter by letter */}
                  <span className="hidden md:inline-flex md:flex-wrap">
                    {nameLetters.map((letter, index) => (
                      <motion.span
                        key={index}
                        initial={config.enableComplexAnimations ? { opacity: 0, y: 50, rotateX: -90 } : { opacity: 0 }}
                        animate={config.enableComplexAnimations ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 1 }}
                        transition={adjustTransition({
                          duration: 0.5,
                          delay: 0.5 + index * 0.05,
                          ease: [0.215, 0.61, 0.355, 1],
                        })}
                        className="inline-block"
                        style={{
                          transformOrigin: "bottom",
                          marginRight: letter === " " ? "0.3em" : "0"
                        }}
                      >
                        {letter === " " ? "\u00A0" : letter}
                      </motion.span>
                    ))}
                  </span>
                </span>
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: config.enableComplexAnimations ? 30 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={adjustTransition({ duration: 0.8, delay: 0.8 })}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed"
            >
              AI Automation Engineer crafting{" "}
              <span className="text-primary font-medium">production SaaS platforms</span>,{" "}
              <span className="text-accent font-medium">browser & AI automation</span>, and{" "}
              <span className="text-foreground font-medium">real-time systems</span>{" "}
              that transform how businesses operate.
            </motion.p>

            {/* Tech pills */}
            <motion.div
              initial={{ opacity: 0, y: config.enableComplexAnimations ? 20 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={adjustTransition({ duration: 0.8, delay: 1 })}
              className="flex flex-wrap justify-center lg:justify-start gap-3"
            >
              {["FastAPI", "React", "Python", "Playwright", "AI Agents"].map((tech, index) => (
                <SuckableTechItem
                  key={tech}
                  delay={index * 0.1}
                  isDownloading={isDownloading}
                  className="px-4 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm font-medium text-foreground/80 hover:border-primary/50 hover:text-primary transition-all cursor-default block"
                >
                  {tech}
                </SuckableTechItem>
              ))}
            </motion.div>

            {/* Resume Download Button */}
            <ResumeDownloadButton />
          </div>

          {/* Profile image - 2 columns */}
          <motion.div
            className="lg:col-span-2 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: config.enableComplexAnimations ? 0.8 : 1, x: config.enableComplexAnimations ? 50 : 0 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={config.enableComplexAnimations
              ? { delay: 0.5 * config.animationDuration, duration: 1 * config.animationDuration, type: "spring", bounce: 0.3 }
              : adjustTransition({ delay: 0.5, duration: 0.8 })
            }
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Glow ring - Only animate on desktop */}
              {config.enableComplexAnimations ? (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "var(--gradient-primary)",
                    filter: "blur(25px)",
                  }}
                  animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              ) : (
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "var(--gradient-primary)",
                    filter: "blur(25px)",
                    opacity: 0.4
                  }}
                />
              )}

              {/* Profile image container */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-primary/40 bg-gradient-to-b from-primary/25 via-background to-accent/25">
                {imageError ? (
                  <div
                    className="w-full h-full flex items-center justify-center text-5xl font-bold text-white"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {personalInfo.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                ) : (
                  <img
                    src={personalInfo.profileImage}
                    alt={personalInfo.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                )}
              </div>

              {/* Floating tech bubbles around profile - Only on desktop */}
              {config.enableComplexAnimations && [
                { name: "Python", top: "-12%", left: "20%", delay: 0 },
                { name: "React", top: "8%", right: "-15%", delay: 0.5 },
                { name: "FastAPI", bottom: "5%", right: "-8%", delay: 1 },
              ].map((tech) => (
                <SuckableTechItem
                  key={tech.name}
                  delay={tech.delay}
                  floating={true}
                  isDownloading={isDownloading}
                  className="absolute px-3 py-1.5 rounded-full bg-secondary/80 border border-primary/30 text-xs font-medium text-primary backdrop-blur-sm"
                  style={{
                    top: tech.top,
                    bottom: tech.bottom,
                    left: tech.left,
                    right: tech.right,
                  }}
                >
                  {tech.name}
                </SuckableTechItem>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator - positioned at very bottom */}
      {config.enableComplexAnimations && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default StoryHero;
