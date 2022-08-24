export type SvgLayout = "constrained" | "fixed" | "fullWidth";
export interface TransformArgs {
  layout: SvgLayout;
}

export interface GatsbyExtractedSvg {
  width: number;
  height: number;
  layout: SvgLayout;
  encoded?: string;
  encodedUrl?: string;
}

export function GetExtractedSvg(entry: {
  id: string;
  extracted: Record<string, unknown>;
}) {
  if (entry.extracted) {
    return entry.extracted as unknown as GatsbyExtractedSvg;
  }
  return undefined;
}
