import { BondConfigurationOptions } from ".";
import { ConfigurationMap, PluginHelpers } from "./plugin";
import { calculateRemSize, forEachObject } from "./utils";

export function addFontSizes(
  { addUtilities }: PluginHelpers,
  config: BondConfigurationOptions
): void {
  const results: ConfigurationMap = {};
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
    const split = fontSize.split("-");
    const pixels = parseInt(split[0]);
    const lineHeight = parseInt(split[1]) || pixels;
    const sizeRem = calculateRemSize(pixels);
    const lineHeightRem = calculateRemSize(lineHeight);
    const bottomFontOffsetRem = calculateRemSize((lineHeight - pixels) / 2);
    results[`.text-${pixels}-${lineHeight}`] = {
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
