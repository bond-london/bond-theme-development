import { BondVisual, IBondVisual } from "@bond-london/gatsby-theme";
import React from "react";
import { SectionBodyClassName } from "../styles";

export const SectionVisual: React.FC<{ visual: IBondVisual }> = ({
  visual,
}) => {
  return (
    <BondVisual
      visual={visual}
      autoPlay={true}
      muted={true}
      className={SectionBodyClassName}
    />
  );
};
