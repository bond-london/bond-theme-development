export type SvgLayout = "constrained" | "fixed" | "fullWidth";
export interface ITransformArgs {
  layout: SvgLayout;
}

export interface IGatsbyExtractedSvg {
  width: number;
  height: number;
  layout: SvgLayout;
  encoded?: string;
  encodedUrl?: string;
}

export function GetExtractedSvg(entry: {
  id: string;
  extracted: Record<string, unknown>;
}): IGatsbyExtractedSvg | undefined {
  if (entry.extracted) {
    return entry.extracted as unknown as IGatsbyExtractedSvg;
  }
  return undefined;
}
