"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

type DigitFlipProps = {
  value: string;
};

const DigitFlip: React.FC<DigitFlipProps> = ({ value }) => {
  return (
    <div className="relative inline-block w-[0.95ch] h-[1.35em] perspective-[300px]">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ rotateX: 80, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -80, opacity: 0 }}
          transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0 flex items-center justify-center origin-center tabular-nums"
          style={{
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
          }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const Separator = () => (
  <span className="mx-[3px] opacity-40 select-none">:</span>
);

const Clock24: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      // Uncomment the next line if you want seconds in the header
      const ss = String(now.getSeconds()).padStart(2, "0");
      setTimeStr(hh + mm + ss);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeStr) return null;

  const digits = timeStr.split("");

  return (
    <div
      className="
        inline-flex items-center
        text-[13px] leading-none
        text-muted-foreground
        tabular-nums
        tracking-tight
        select-none
      "
      aria-label="Current time"
    >
      <DigitFlip value={digits[0]} />
      <DigitFlip value={digits[1]} />
      <Separator />
      <DigitFlip value={digits[2]} />
      <DigitFlip value={digits[3]} />
      {/* Uncomment if you want seconds: */}
      <Separator />
      <DigitFlip value={digits[4]} />
      <DigitFlip value={digits[5]} />
    </div>
  );
};

export default Clock24;
