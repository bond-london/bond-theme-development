import { BondVisual, IBondVisual } from "@bond-london/gatsby-theme";
import React from "react";

export const HeroBackground: React.FC<{
  visual: IBondVisual;
  isGrey?: boolean | null;
}> = ({ visual, isGrey }) => {
  return (
    <BondVisual
      visual={visual}
      autoPlay={true}
      muted={true}
      loop={true}
      className="pointer-events-none !absolute bottom-0 left-0 right-0 top-0 select-none"
      style={isGrey ? { filter: "saturate(0) brightness(50%)" } : undefined}
      simple={true}
    />
  );
};
