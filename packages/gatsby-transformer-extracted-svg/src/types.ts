export type SvgLayout = "constrained" | "fixed" | "fullWidth";
export interface ITransformArgs {
  layout: SvgLayout;
}

export interface IGatsbySvg {
  width: number;
  height: number;
  layout: SvgLayout;
  encoded?: string;
  raw?: string;
  encodedUrl?: string;
}
