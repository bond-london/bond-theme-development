import { CSSProperties } from "react";
import { Horizontal, Maybe, Vertical, IVisualCommon } from "./types";

function caclulateVertical(
  position: Maybe<Vertical>
): "bottom" | "center" | "top" {
  switch (position) {
    case "Bottom":
      return "bottom";
    case "Top":
      return "top";
    default:
      return "center";
  }
}

function calculateHorizontal(
  position: Maybe<Horizontal>
): "left" | "right" | "center" {
  switch (position) {
    case "Left":
      return "left";
    case "Right":
      return "right";
    default:
      return "center";
  }
}

export function calculateCropDetails(
  details: IVisualCommon
): Pick<CSSProperties, "objectFit" | "objectPosition"> {
  const { verticalCropPosition, horizontalCropPosition, dontCrop } = details;

  if (dontCrop) {
    return { objectFit: "contain" };
  }

  return {
    objectFit: "cover",
    objectPosition: `${calculateHorizontal(
      horizontalCropPosition
    )} ${caclulateVertical(verticalCropPosition)}`,
  };
}
