export type AnimationLayout = "constrained" | "fixed" | "fullWidth";
export interface TransformArgs {
  layout: AnimationLayout;
}

export interface GatsbyExtractedAnimation {
  width: number;
  height: number;
  layout: AnimationLayout;
  encoded?: string;
  encodedUrl?: string;
  animationUrl: string;
}

export function GetExtractedAnimation(entry: {
  id: string;
  extracted: Record<string, unknown>;
}) {
  if (entry.extracted) {
    return entry.extracted as unknown as GatsbyExtractedAnimation;
  }
  return undefined;
}
