"use client"

import { motion } from "framer-motion";

const LeatherButton = () => {
  return (
    <div
      className="
    flex items-center justify-center p-8"
      style={{
        fontFamily: "sans-serif",
      }}
    >
      <motion.button
        className="relative px-12 py-6 rounded-full overflow-hidden focus:outline-none"
        style={{
          background:
            "linear-gradient(135deg, #6d5447 0%, #5d4037 30%, #4a342a 70%, #3e2723 100%)",
          boxShadow: `
            inset 0 1px 2px rgba(255, 255, 255, 0.15),
            inset 0 -3px 6px rgba(0, 0, 0, 0.5),
            0 6px 12px rgba(0, 0, 0, 0.6),
            0 1px 3px rgba(0, 0, 0, 0.4)
          `,
        }}
        whileTap={{
          scale: 0.98,
          boxShadow: `
            inset 0 1px 2px rgba(255, 255, 255, 0.15),
            inset 0 -3px 6px rgba(0, 0, 0, 0.5),
            0 3px 6px rgba(0, 0, 0, 0.6),
            0 1px 2px rgba(0, 0, 0, 0.4)
          `,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {/* Realistic premium dark shiny leather grain texture - deeper with subtle red warmth and gloss */}
        <div
          className="absolute inset-0 opacity-75 pointer-events-none mix-blend-overlay rounded-full"
          style={{
            backgroundImage: `
      linear-gradient(180deg, #5a4636 0%, #584335 30%, #4d392b 60%, #443225 100%),
      radial-gradient(circle at 20% 30%, transparent 0%, rgba(0, 0, 0, 0.35) 100%),
      radial-gradient(circle at 80% 70%, transparent 0%, rgba(0, 0, 0, 0.32) 100%),
      radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.18) 0%, transparent 40%),
      radial-gradient(ellipse at 70% 60%, rgba(255, 255, 255, 0.15) 0%, transparent 45%),
      radial-gradient(ellipse at 50% 40%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
      url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.40'/%3E%3C/svg%3E")
    `,
            backgroundSize:
              "100% 100%, 100% 100%, 100% 100%, 120% 120%, 110% 110%, 100% 100%, 200px 200px",
            backgroundPosition:
              "center, center, center, center, center, center, center",
            backgroundBlendMode:
              "normal, overlay, overlay, screen, screen, screen, overlay",
          }}
        />

        <div
          className="absolute inset-0 opacity-25 pointer-events-none rounded-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: "150px 150px",
          }}
        />

        <div
          className="absolute inset-0 opacity-20 pointer-events-none rounded-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(0, 0, 0, 0.3) 100%)",
          }}
        />

        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: "4px",
            left: "4px",
            right: "4px",
            bottom: "4px",
            border: "1.5px dashed rgba(139, 107, 83, 1)",
            borderRadius: "9999px",
          }}
        />

        <span
          className="relative z-10 block text-3xl tracking-normal font-normal"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #f5e6d3 0%, #e8d4b0 30%, #d4af87 60%, #c19a6b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: "700",
          }}
        >
          Leather Button
        </span>

        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow:
              "inset 0 2px 4px rgba(255, 255, 255, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.4)",
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 40%)",
          }}
        />
      </motion.button>
    </div>
  );
};

export default LeatherButton;
