"use client"

import { motion } from "framer-motion";

const LeatherButton = () => {
  return (
    <div
      className="
    flex items-center justify-center"
      style={{
        fontFamily: "sans-serif",
      }}
    >
      <motion.button
        className="relative px-12 py-6 rounded-full overflow-hidden focus:outline-none dark:[&]:bg-linear-to-br dark:[&]:from-amber-800 dark:[&]:via-amber-900 dark:[&]:to-amber-950 [&:not(.dark)]:bg-linear-to-br [&:not(.dark)]:from-amber-600 [&:not(.dark)]:via-amber-700 [&:not(.dark)]:to-amber-800 [&:not(.dark)]:shadow-lg [&:not(.dark)]:shadow-amber-900/50 [&:not(.dark)]:while-tap:shadow-md [&:not(.dark)]:while-tap:shadow-amber-800/40"
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
        <div
          className="absolute inset-0 opacity-75 pointer-events-none mix-blend-overlay rounded-full"
          style={{
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
          className="absolute inset-0 rounded-full pointer-events-none border-2 border-dashed border-amber-900/60 dark:border-amber-800/40"
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
          className="relative z-10 block text-3xl tracking-normal [&:not(.dark)]:bg-linear-to-b [&:not(.dark)]:from-amber-200 [&:not(.dark)]:to-amber-400"
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
