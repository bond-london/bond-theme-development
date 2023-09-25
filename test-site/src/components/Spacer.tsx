import { SimpleSection } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import React from "react";
import { lookupColourClassNames } from "../../colors";
import { IComponentInformation } from "./GenericComponent";

type Spacing = "SpacerS" | "SpacerM" | "SpacerL" | "SpacerXL";
function lookupSpacingClassNames(spacing: Spacing) {
  switch (spacing) {
    case "SpacerM":
      return "h-m";
    case "SpacerL":
      return "h-l";
    case "SpacerXL":
      return "h-xl";
    default:
      return "h-s";
  }
}

const SpacerComponent: React.FC<{
  spacing: Spacing;
  information: IComponentInformation;
}> = ({ spacing, information }) => {
  const { backgroundColour, textColour } = information;
  return (
    <SimpleSection
      componentName={`Spacer ${spacing}`}
      information={information}
      className={classNames(
        "w-full",
        lookupColourClassNames(backgroundColour, textColour),
        lookupSpacingClassNames(spacing),
      )}
    />
  );
};
export default SpacerComponent;
