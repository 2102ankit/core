"use client";

import ColorPicker, { type ColorValue } from "@/components/color-picker";
import { useCallback, useState } from "react";

export function ColorPickerDemo() {
  const [color, setColor] = useState<ColorValue | null>(null);
  const handleChange = useCallback((next: ColorValue) => {
    setColor(next);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-center min-h-[28rem] overflow-visible">
        <ColorPicker defaultHex="#007AFF" onChange={handleChange} />
      </div>

      {color ? (
        <p className="text-caption text-muted-foreground text-center font-mono tabular-nums">
          {color.hex}
          <span className="mx-2 text-border">·</span>
          {color.rgba}
        </p>
      ) : null}

      <p className="text-caption text-muted-foreground text-center max-w-md mx-auto">
        Tap the swatch to bloom the petal ring. Petals set hue; the ruler
        sliders mix lightness and opacity. Copy the hex when you land on a
        colour.
      </p>
    </div>
  );
}

export default ColorPickerDemo;
