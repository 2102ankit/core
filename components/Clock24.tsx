"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

type DigitFlipProps = { value: string };

const DigitFlip: React.FC<DigitFlipProps> = ({ value }) => {
  const [displayed, setDisplayed] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== displayed) {
      setIsFlipping(true);

      // Small delay so the flip out starts visibly
      const timeout = setTimeout(() => {
        setDisplayed(value);
        setIsFlipping(false);
      }, 100); // Half of total animation time

      return () => clearTimeout(timeout);
    }
  }, [value, displayed]);

  return (
    <div className="relative inline-block w-[1ch] h-[1.4em] perspective-distant">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={displayed}
          initial={{ rotateX: isFlipping ? 0 : 90 }}
          animate={{ rotateX: 0 }}
          exit={{ rotateX: -90 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center origin-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          {displayed}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const Clock24: React.FC = () => {
  const [timeStr, setTimeStr] = useState("000000");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const newTime =
        String(now.getHours()).padStart(2, "0") +
        String(now.getMinutes()).padStart(2, "0") +
        String(now.getSeconds()).padStart(2, "0");

      setTimeStr(newTime);
    };

    update(); // immediate first render
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, []);

  const digits = timeStr.split("");

  if (timeStr === "00000") return;

  return (
    <>
      {timeStr === "000000" ? null : (
        <div className="flex items-center text-blue-600 dark:text-yellow-300 gap-px tracking-tighter">
          <DigitFlip value={digits[0]} />
          <DigitFlip value={digits[1]} />
          <span className="opacity-60 font-bold">:</span>
          <DigitFlip value={digits[2]} />
          <DigitFlip value={digits[3]} />
          {/* <span className="opacity-60 font-bold">:</span>
          <DigitFlip value={digits[4]} />
          <DigitFlip value={digits[5]} /> */}
        </div>
      )}
    </>
  );
};

export default Clock24;
