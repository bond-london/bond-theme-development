export type AnimationLayout = "constrained" | "fixed" | "fullWidth";
export interface TransformArgs {
  layout: AnimationLayout;
}

export interface GatsbyExtractedAnimation {
  width: string;
  height: string;
  layout: AnimationLayout;
  encoded?: string;
  encodedUrl?: string;
  animationUrl: string;
}
