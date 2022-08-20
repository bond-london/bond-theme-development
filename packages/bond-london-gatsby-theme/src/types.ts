export type Maybe<T> = T | null;
export type Vertical = "Top" | "Middle" | "Bottom";
export type Horizontal = "Left" | "Middle" | "Right";

export interface VisualCommon {
  className?: string;
  dontCrop: Maybe<boolean>;
  horizontalCropPosition: Maybe<Horizontal>;
  verticalCropPosition: Maybe<Vertical>;
  onLoad?: () => void;
  onError?: () => void;
}
