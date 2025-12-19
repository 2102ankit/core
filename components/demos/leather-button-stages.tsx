"use client";
import { motion } from "motion/react";

const LeatherButtonStage = ({ stage = 6 }) => {
  const background =
    stage >= 2
      ? "linear-gradient(135deg, #6d5447 0%, #5d4037 30%, #4a342a 70%, #3e2723 100%)"
      : undefined;

  const boxShadow =
    stage >= 3
      ? `
          inset 0 1px 2px rgba(255, 255, 255, 0.15),
          inset 0 -3px 6px rgba(0, 0, 0, 0.5),
          0 6px 12px rgba(0, 0, 0, 0.6),
          0 1px 3px rgba(0, 0, 0, 0.4)
        `
      : undefined;

  const whileTap = {
    scale: 0.98,
    ...(stage >= 3
      ? {
          boxShadow: `
            inset 0 1px 2px rgba(255, 255, 255, 0.15),
            inset 0 -3px 6px rgba(0, 0, 0, 0.5),
            0 3px 6px rgba(0, 0, 0, 0.6),
            0 1px 2px rgba(0, 0, 0, 0.4)
          `,
        }
      : {}),
  };

  const textStyle =
    stage >= 5
      ? {
          backgroundImage:
            "linear-gradient(180deg, #f5e6d3 0%, #e8d4b0 30%, #d4af87 60%, #c19a6b 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontWeight: "700",
        }
      : { fontWeight: "bold" };

  const textClass =
    stage == 1
      ? "relative z-10 block text-3xl tracking-normal text-black dark:text-white"
      : "relative z-10 block text-3xl tracking-normal text-white";

  return (
    <motion.button
      className="relative px-12 py-6 rounded-full overflow-hidden focus:outline-none"
      style={{
        background,
        boxShadow,
        'border': stage == 1 ? "solid 1px grey" : "",
      }}
      whileTap={whileTap}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {/* Noise Texture */}
      {stage >= 4 && (
        <>
          <div
            className="absolute inset-0 opacity-25 pointer-events-none rounded-full"
            style={{
              backgroundImage: `url(
                "data:image/svg+xml,%3Csvg viewBox='0 0 200 200'
                xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter
                id='noiseFilter'%3E%3CfeTurbulence
                type='fractalNoise'
                baseFrequency='1.5'
                numOctaves='3'
                stitchTiles='stitch'/%3E%3C/filter%3E%3Crect
                width='100%25'
                height='100%25'
                filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundSize: "150px 150px",
            }}
          />
          {/* Sheen */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none rounded-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(0, 0, 0, 0.3) 100%)",
            }}
          />
        </>
      )}
      {/* Stitching */}
      {stage >= 6 && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            top: "4px",
            left: "4px",
            right: "4px",
            bottom: "4px",
            border: "1.5px dashed rgba(139, 107, 83, 0.8)",
            borderRadius: "9999px",
            boxShadow: "inset 0 1px 1px rgba(0,0,0,0.2)",
          }}
        />
      )}
      {/* Text */}
      <span className={textClass} style={textStyle}>
        Leather Button
      </span>
    </motion.button>
  );
};

export default LeatherButtonStage;
