export type AnimationLayout = "constrained" | "fixed" | "fullWidth";
export interface ITransformArgs {
  layout: AnimationLayout;
}

export interface IGatsbyExtractedAnimation {
  width: number;
  height: number;
  layout: AnimationLayout;
  encoded?: string;
  encodedUrl?: string;
  animationUrl: string;
}

export function getExtractedAnimation(entry: {
  extracted: Record<string, unknown>;
}): IGatsbyExtractedAnimation | undefined {
  if (entry.extracted) {
    return entry.extracted as unknown as IGatsbyExtractedAnimation;
  }
  return undefined;
}
