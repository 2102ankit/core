import React, { ComponentType } from "react";

// Generates a proper React component from a public folder SVG path
export const localIcon = (path: string): ComponentType<{ size?: number }> => {
  return function GeneratedIcon({ size = 24 }) {
    return <img src={path} alt="icon" width={size} height={size} />;
  };
};

export const localIcon2 = (
  path: string,
  size: number = 24,
): React.JSX.Element => {
  return <img src={path} alt="icon" width={size} height={size} />;
};

