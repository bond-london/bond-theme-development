/* eslint-disable @typescript-eslint/naming-convention */
import { CSSRuleObject, PluginAPI } from "tailwindcss/types/config";
import { IBondConfigurationOptions } from ".";
import { calculateRemSize, forEachObject } from "./utils";

function calculateFontAndLineSizePixels(info: string): {
  pixels: number;
  lineHeightPixels: number;
  name: string;
} {
  const slashSplit = info.split("/");
  if (slashSplit.length === 2) {
    const pixels = parseInt(slashSplit[0]);
    const lineHeightProportion = parseInt(slashSplit[1]);
    const lineHeightPixels = pixels * (lineHeightProportion / 100);
    return {
      pixels,
      lineHeightPixels,
      name: `${pixels}\\/${lineHeightProportion}`,
    };
  }
  const dashSplit = info.split("-");
  if (dashSplit.length === 2) {
    const pixels = parseInt(dashSplit[0]);
    const lineHeightPixels = parseInt(dashSplit[1]);
    return { pixels, lineHeightPixels, name: info };
  }
  const pixels = parseInt(info);
  return { pixels, lineHeightPixels: pixels, name: info };
}
export function addFontSizes(
  { addUtilities }: PluginAPI,
  config: IBondConfigurationOptions
): void {
  const results: CSSRuleObject = {};
  const fontRatios = new Set<string>();
  const fontSizes = new Set<number>();
  const sizes = ["default", ...Object.keys(config.sizes)];
  forEachObject(config.fontTable, ({ value: entry }) => {
    for (const size of sizes) {
      const value = entry[size];
      switch (typeof value) {
        case "string":
          fontRatios.add(value);
          break;
        case "number":
          fontSizes.add(value);
          break;
      }
    }
  });
  fontRatios.forEach(fontSize => {
    const { pixels, lineHeightPixels, name } =
      calculateFontAndLineSizePixels(fontSize);
    const sizeRem = calculateRemSize(pixels);
    const lineHeightRem = calculateRemSize(lineHeightPixels);
    const bottomFontOffsetRem = calculateRemSize(
      (lineHeightPixels - pixels) / 2
    );
    results[`.text-${name}`] = {
      "font-size": sizeRem,
      "line-height": lineHeightRem,
      "--bond-line-height": lineHeightRem,
      "--bond-font-size": sizeRem,
      "--bond-bottom-font-offset": bottomFontOffsetRem,
    };
  });

  const lineHeight = config.lineHeight || 1;
  fontSizes.forEach(size => {
    const sizeRem = calculateRemSize(size);
    const lineHeightRem = calculateRemSize(size * lineHeight);
    const bottomFontOffsetRem = calculateRemSize(
      (size * lineHeight - size) / 2
    );
    results[`.text-${size}`] = {
      "font-size": sizeRem,
      "line-height": lineHeightRem,
      "--bond-line-height": lineHeightRem,
      "--bond-font-size": sizeRem,
      "--bond-bottom-font-offset": bottomFontOffsetRem,
    };
  });
  addUtilities(results);
}
