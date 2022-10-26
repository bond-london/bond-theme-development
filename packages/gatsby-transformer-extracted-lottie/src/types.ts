export type AnimationLayout = "constrained" | "fixed" | "fullWidth";
export interface ITransformArgs {
  layout: AnimationLayout;
}

export interface IGatsbyAnimation {
  width?: number;
  height?: number;
  layout: AnimationLayout;
  encoded?: string;
  encodedUrl?: string;
  animationUrl: string;
}
