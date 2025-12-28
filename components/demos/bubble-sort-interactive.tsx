"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Play, Pause, SkipBack, SkipForward, Dice6 } from "lucide-react";

interface SortStep {
  array: number[];
  comparing?: [number, number];
  swapping?: [number, number];
}

const MAX_LEN = 10;

export default function BubbleSortVisualizer() {
  const [input, setInput] = useState("50, -20, 80, -10, 90, 30, -70, 40, 60");
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  const generateSteps = (arr: number[]) => {
    const allSteps: SortStep[] = [];
    const temp = arr.map((value, idx) => ({ key: `${value}-${idx}`, value }));
    allSteps.push({ array: temp.map((item) => item.value) });

    for (let i = 0; i < temp.length - 1; i++) {
      for (let j = 0; j < temp.length - i - 1; j++) {
        allSteps.push({
          array: temp.map((item) => item.value),
          comparing: [j, j + 1],
        });

        if (temp[j].value > temp[j + 1].value) {
          [temp[j], temp[j + 1]] = [temp[j + 1], temp[j]];
          allSteps.push({
            array: temp.map((item) => item.value),
            swapping: [j, j + 1],
          });
        }
      }
    }
    allSteps.push({ array: temp.map((item) => item.value) });
    return allSteps;
  };

  const handleSort = () => {
    const nums = input
      .split(",")
      .map((s) => parseInt(s.trim(), MAX_LEN))
      .filter((n) => !isNaN(n));

    if (nums.length === 0) return;

    const sortSteps = generateSteps(nums);
    setSteps(sortSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const generateRandomArray = () => {
    const values = [
      -90, -80, -70, -60, -50, -40, -30, -20, -10, 10, 20, 30, 40, 50, 60, 70,
      80, 90,
    ];
    const randomArray: number[] = [];

    // Generate exactly 10 values
    for (let i = 0; i < MAX_LEN; i++) {
      const randomIndex = Math.floor(Math.random() * values.length);
      randomArray.push(values[randomIndex]);
    }

    // Shuffle to avoid any bias
    for (let i = randomArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomArray[i], randomArray[j]] = [randomArray[j], randomArray[i]];
    }
    setInput(randomArray.join(", "));
    handleSort();
  };

  const [elementKeys] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    if (steps.length > 0 && steps[0]) {
      elementKeys.clear();
      steps[0].array.forEach((value, idx) => {
        elementKeys.set(idx, `elem-${value}-${idx}-${Date.now()}`);
      });
    }
  }, [steps]);

  useEffect(() => {
    handleSort();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  useEffect(() => {
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [currentStep, steps.length]);

  // Auto-scroll to center active bars
  useEffect(() => {
    if (!scrollContainerRef.current || steps.length === 0) return;

    const comparing = steps[currentStep]?.comparing;
    const swapping = steps[currentStep]?.swapping;
    const activeIndices = comparing ?? swapping; // Use nullish coalescing

    if (!activeIndices || activeIndices.length < 2) return;

    const midIndex = Math.floor((activeIndices[0] + activeIndices[1]) / 2);
    const barElement = barRefs.current[midIndex];

    if (barElement) {
      barElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentStep, steps]);

  const goPrevious = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const goNext = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const togglePlay = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const currentArray = steps[currentStep]?.array || [];
  const comparing = steps[currentStep]?.comparing;
  const swapping = steps[currentStep]?.swapping;
  const isFinalStep = currentStep === steps.length - 1;

  const values = currentArray.length > 0 ? currentArray : [0];
  const maxPositive = Math.max(...values.filter((v) => v >= 0), 0);
  const maxNegative = Math.abs(Math.min(...values.filter((v) => v < 0), 0));
  const hasPositive = maxPositive > 0;
  const hasNegative = maxNegative > 0;

  const totalRange = maxPositive + maxNegative;
  const positiveRatio = totalRange > 0 ? maxPositive / totalRange : 0.5;
  const negativeRatio = totalRange > 0 ? maxNegative / totalRange : 0.5;

  const getHeightPercentage = (value: number) => {
    if (value >= 0) {
      return maxPositive > 0
        ? (value / maxPositive) * (positiveRatio * 200)
        : 0;
    } else {
      return maxNegative > 0
        ? (Math.abs(value) / maxNegative) * (negativeRatio * 200)
        : 0;
    }
  };

  const getBarColor = (index: number) => {
    if (isFinalStep) return "bg-green-500";
    if (swapping?.includes(index)) return "bg-red-500";
    if (comparing?.includes(index)) return "bg-yellow-500";
    return "bg-blue-600 dark:bg-blue-400";
  };

  return (
    <Card className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 bg-background text-foreground">
      <div className="space-y-2">
        <Label htmlFor="input">Enter numbers (comma separated)</Label>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 50, -20, 80"
            className="flex-1"
          />
          <div className="flex gap-3">
            <Button onClick={handleSort} className="flex-1 sm:flex-initial">
              Sort Array
            </Button>
            <Button onClick={generateRandomArray} variant="outline">
              <Dice6 className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Random</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="w-full rounded-xl bg-muted/40 p-6 sm:p-8 border relative overflow-hidden">
          <span
            className="absolute left-2 sm:left-4 text-xs text-muted-foreground bg-muted/40 px-2 rounded z-20"
            style={{
              top: `${positiveRatio * 200 + 32}px`,
              transform: "translateY(-50%)",
            }}
          >
            0
          </span>

          {hasPositive && (
            <span className="absolute left-2 sm:left-4 top-4 text-xs text-muted-foreground">
              +{maxPositive}
            </span>
          )}
          {hasNegative && (
            <span className="absolute left-2 sm:left-4 bottom-4 text-xs text-muted-foreground">
              -{maxNegative}
            </span>
          )}

          <div
            ref={scrollContainerRef}
            className={`relative h-64 w-full flex items-center px-10 ${
              currentArray.length <= MAX_LEN ? "justify-center" : "justify-start"
            } gap-2 ${
              currentArray.length > MAX_LEN
                ? "overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/30 px-2 sm:px-4"
                : ""
            } py-2`}
          >
            {currentArray.map((value, index) => {
              const heightPct = getHeightPercentage(value);
              const isNegative = value < 0;

              // Dynamic width logic
              const barWidth =
                currentArray.length <= MAX_LEN
                  ? `${100 / currentArray.length}%`
                  : `max(40px, ${100 / currentArray.length}%)`;
              return (
                <motion.div
                  key={elementKeys.get(index) ?? `fallback-${index}`}
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  ref={(el) => {barRefs.current[index] = el;}}
                  className="flex flex-col items-center shrink-0"
                  style={{
                    width: barWidth,
                    minWidth: currentArray.length > MAX_LEN ? "40px" : undefined,
                    maxWidth: currentArray.length <= MAX_LEN ? "120px" : undefined, // Optional: prevent too-wide bars
                  }}
                >
                  <div className="relative w-full" style={{ height: "200px" }}>
                    <div
                      className={`absolute w-full ${getBarColor(
                        index
                      )} rounded-md transition-colors duration-300`}
                      style={{
                        height: `${Math.abs(heightPct)}px`,
                        left: 0,
                        right: 0,
                        ...(isNegative
                          ? {
                              top: `${positiveRatio * 200}px`,
                            }
                          : {
                              bottom: `${negativeRatio * 200}px`,
                            }),
                      }}
                    />
                  </div>

                  <span className="mt-2 text-sm font-semibold whitespace-nowrap">
                    {value}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {steps.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-sm font-medium">
                Step {currentStep + 1} of {steps.length}
              </span>
              <div className="flex flex-wrap gap-4 text-sm justify-center sm:justify-end">
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-blue-600 dark:bg-blue-400" />
                  Unsorted
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-yellow-500" />
                  Comparing
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-red-500" />
                  Swapping
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-green-500" />
                  Sorted
                </span>
              </div>
            </div>

            <Slider
              value={[currentStep]}
              onValueChange={([val]) => {
                setIsPlaying(false);
                setCurrentStep(val);
              }}
              max={steps.length - 1}
              step={1}
              className="w-full"
            />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center justify-center gap-4 sm:gap-8 order-2 sm:order-1">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={goPrevious}
                  disabled={currentStep === 0}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button size="lg" onClick={togglePlay} className="w-36">
                  {isPlaying ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      {currentStep >= steps.length - 1 ? "Replay" : "Play"}
                    </>
                  )}
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={goNext}
                  disabled={currentStep >= steps.length - 1}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              <Button
                size="lg"
                onClick={() => {
                  setSpeed((prev) => (prev === 4 ? 1 : prev + 1));
                }}
                className="order-1 sm:order-2"
              >
                {speed}x Speed
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
