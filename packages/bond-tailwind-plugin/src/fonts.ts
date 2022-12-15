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
  const fontRatios = new Set<{ size: string; value: string }>();
  const fontSizes = new Set<{ size: string; value: number }>();
  const sizes = ["default", ...Object.keys(config.sizes)];
  const noMax = !Object.values(config.sizes).find(v => v.max);

  forEachObject(config.fontTable, ({ value: entry }) => {
    for (const size of sizes) {
      const value = entry[size];
      switch (typeof value) {
        case "string":
          fontRatios.add({ size, value });
          break;
        case "number":
          fontSizes.add({ size, value });
          break;
      }
    }
  });
  fontRatios.forEach(({ size, value: fontRatio }) => {
    const { pixels, lineHeightPixels, name } =
      calculateFontAndLineSizePixels(fontRatio);
    addFontEntry(
      results,
      name,
      pixels,
      lineHeightPixels,
      noMax ? config.sizes[size]?.breakpoint : undefined
    );
  });

  const lineHeight = config.lineHeight || 1;
  fontSizes.forEach(({ size, value: fontSize }) => {
    addFontEntry(
      results,
      `${fontSize}`,
      fontSize,
      fontSize * lineHeight,
      noMax ? config.sizes[size]?.breakpoint : undefined
    );
  });
  addUtilities(results);
}

function addFontEntry(
  results: CSSRuleObject,
  name: string,
  fontSizePixels: number,
  lineHeightPixels: number,
  screenWidthPixels?: number
): void {
  const sizeRem = calculateRemSize(fontSizePixels);
  const lineHeightRem = calculateRemSize(lineHeightPixels);
  const bottomFontOffsetRem = calculateRemSize(
    (lineHeightPixels - fontSizePixels) / 2
  );
  results[`.text-${name}`] = {
    "font-size": sizeRem,
    "line-height": lineHeightRem,
    "--bond-line-height": lineHeightRem,
    "--bond-font-size": sizeRem,
    "--bond-bottom-font-offset": bottomFontOffsetRem,
  };
  if (screenWidthPixels) {
    const ratio = (fontSizePixels / screenWidthPixels) * 100;
    const lineHeightRatio = (lineHeightPixels / screenWidthPixels) * 100;
    const bottomFontOffsetRatio =
      ((lineHeightPixels - fontSizePixels) / 2 / screenWidthPixels) * 100;
    results[`.text-max-${name}`] = {
      "font-size": `${Math.floor(ratio)}vw`,
      "line-height": `${Math.floor(lineHeightRatio)}vw`,
      "--bond-line-height": `${Math.floor(ratio)}vw`,
      "--bond-font-size": `${Math.floor(ratio)}vw`,
      "--bond-bottom-font-offset": `${Math.floor(bottomFontOffsetRatio)}vw`,
    };
  }
}
