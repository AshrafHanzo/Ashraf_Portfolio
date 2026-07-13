import { motion } from "framer-motion";

// A single corner spider-web (drawn from the top-left origin, rotated per corner)
const CornerWeb = ({ className, rotate = 0 }: { className?: string; rotate?: number }) => (
    <svg
        viewBox="0 0 200 200"
        className={className}
        style={{ transform: `rotate(${rotate}deg)` }}
        fill="none"
        stroke="hsl(var(--primary) / 0.9)"
        strokeWidth="0.8"
    >
        {/* radial threads fanning out from the corner */}
        {[0, 15, 30, 45, 60, 75, 90].map((a) => {
            const rad = (a * Math.PI) / 180;
            return (
                <line
                    key={a}
                    x1="0"
                    y1="0"
                    x2={Math.cos(rad) * 210}
                    y2={Math.sin(rad) * 210}
                />
            );
        })}
        {/* concentric web arcs */}
        {[30, 62, 96, 132, 172].map((r) => (
            <path key={r} d={`M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`} />
        ))}
    </svg>
);

/**
 * Global comic-book atmosphere layer:
 *  - Spider-webs strung across the top corners
 *  - Faint halftone dots at the edges
 * Sits behind the page content (z-[2]) and never blocks clicks.
 */
const ComicOverlay = () => {
    return (
        <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
            {/* Top-left web */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.22, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -top-6 -left-6 w-40 h-40 md:w-56 md:h-56 origin-top-left animate-web-swing"
            >
                <CornerWeb className="w-full h-full" rotate={0} />
            </motion.div>

            {/* Top-right web (mirrored) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.22, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -top-6 -right-6 w-40 h-40 md:w-56 md:h-56 origin-top-right"
            >
                <div className="w-full h-full" style={{ transform: "scaleX(-1)" }}>
                    <CornerWeb className="w-full h-full" rotate={0} />
                </div>
            </motion.div>

            {/* Bottom-right web (mirrored + flipped) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.14 }}
                transition={{ duration: 1.2, delay: 0.9 }}
                className="absolute -bottom-8 -right-8 w-32 h-32 md:w-44 md:h-44 hidden md:block"
            >
                <div className="w-full h-full" style={{ transform: "scale(-1,-1)" }}>
                    <CornerWeb className="w-full h-full" rotate={0} />
                </div>
            </motion.div>

            {/* Halftone edge vignette (comic print texture) */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage:
                        "radial-gradient(hsl(var(--primary) / 0.16) 1px, transparent 1.6px)",
                    backgroundSize: "9px 9px",
                    maskImage:
                        "radial-gradient(120% 80% at 50% 50%, transparent 55%, black 100%)",
                    WebkitMaskImage:
                        "radial-gradient(120% 80% at 50% 50%, transparent 55%, black 100%)",
                    opacity: 0.5,
                }}
            />
        </div>
    );
};

export default ComicOverlay;
