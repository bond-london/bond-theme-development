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
      className="!absolute left-0 top-0 right-0 bottom-0 pointer-events-none select-none"
      style={isGrey ? { filter: "saturate(0) brightness(50%)" } : undefined}
      simple={true}
    />
  );
};
