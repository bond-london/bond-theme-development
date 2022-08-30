import { IGatsbyImageData } from "gatsby-plugin-image";

export type Maybe<T> = T | null;
export type Vertical = "Top" | "Middle" | "Bottom";
export type Horizontal = "Left" | "Middle" | "Right";

export interface IVisualCommon {
  className?: string;
  dontCrop: Maybe<boolean>;
  horizontalCropPosition: Maybe<Horizontal>;
  verticalCropPosition: Maybe<Vertical>;
}

export function GetGatsbyImage(entry: {
  id: string;
  gatsbyImageData: Record<string, unknown> | IGatsbyImageData;
}): IGatsbyImageData | undefined {
  if (entry.gatsbyImageData) {
    return entry.gatsbyImageData as unknown as IGatsbyImageData;
  }
  return undefined;
}
