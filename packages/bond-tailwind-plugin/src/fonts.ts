/* eslint-disable @typescript-eslint/naming-convention */
import { CSSRuleObject, PluginAPI } from "tailwindcss/types/config";
import {
  FontTable,
  IBondConfigurationOptions,
  IFontEntry,
  IFontTableEntry,
} from ".";
import { calculateRemSize, round } from "./utils";

function calculateFontAndLineSizePixels(info: string): {
  pixels: number;
  lineHeight: number;
  name: string;
} {
  const slashSplit = info.split("/");
  if (slashSplit.length > 1) {
    const pixels = parseInt(slashSplit[0]);
    const lineHeightProportion = parseInt(slashSplit[1]);
    const lineHeight = lineHeightProportion / 100;
    return {
      pixels,
      lineHeight,
      name: info.replaceAll("/", `\\/`),
    };
  }
  const dashSplit = info.split("-");
  if (dashSplit.length > 1) {
    const pixels = parseInt(dashSplit[0]);
    const lineHeightPixels = parseInt(dashSplit[1]);
    const lineHeight = lineHeightPixels / pixels;
    return { pixels, lineHeight, name: info };
  }
  const pixels = parseInt(info);
  return { pixels, lineHeight: 1, name: info };
}

function parseFontEntry(
  baseValues: Omit<IFontTableEntry, "default">,
  value: string | number | IFontEntry,
): IFontEntry {
  switch (typeof value) {
    case "string": {
      const { pixels, lineHeight } = calculateFontAndLineSizePixels(value);
      return { ...baseValues, sizePixels: pixels, lineHeight };
    }
    case "number":
      return { ...baseValues, sizePixels: value };

    case "object": {
      return { ...baseValues, ...value };
    }

    default:
      return { ...baseValues };
  }
}

export function parseFontTable(fontTable: FontTable) {
  const results: Record<string, Record<string, IFontEntry>> = {};
  const {
    style: defaultStyle,
    font: defaultFont,
    weight: defaultWeight,
    lineHeight: defaultLineHeight,
    letterSpacing: defaultLetterSpacing,
    additional: defaultAdditional,
    styles,
  } = fontTable;

  Object.entries(styles).forEach(([name, information]) => {
    const {
      weight,
      font,
      style,
      lineHeight,
      letterSpacing,
      additional,
      default: defaultSize,
      ...sizes
    } = information;

    const baseValues = {
      weight: weight ?? defaultWeight,
      font: font ?? defaultFont,
      style: style ?? defaultStyle,
      lineHeight: lineHeight ?? defaultLineHeight,
      letterSpacing: letterSpacing ?? defaultLetterSpacing,
      additional: additional ?? defaultAdditional,
    };
    const parsed = parseFontEntry(baseValues, defaultSize);
    const nameSizes: Record<string, IFontEntry> = {
      default: parsed,
    };

    Object.entries(sizes).forEach(([size, information]) => {
      const parsed = parseFontEntry(baseValues, information);
      nameSizes[size] = parsed;
    });
    results[name] = nameSizes;
  });
  return results;
}

function newAddFontEntry(
  results: CSSRuleObject,
  name: string,
  entry: IFontEntry,
  screenWidthPixels?: number,
): void {
  const fixedSize: CSSRuleObject = {};
  const { sizePixels, style, weight, lineHeight, letterSpacing, additional } =
    entry;
  if (sizePixels) {
    fixedSize["font-size"] = calculateRemSize(sizePixels);
  }
  if (lineHeight) {
    fixedSize["line-height"] = `${lineHeight}`;
  }
  if (style) {
    fixedSize["font-style"] = style;
  }
  if (weight) {
    fixedSize["font-weight"] = `${weight}`;
  }
  if (letterSpacing) {
    if (typeof letterSpacing === "string") {
      fixedSize["letter-spacing"] = `${letterSpacing}px`;
    } else {
      const letterSpacingString = sizePixels
        ? `${letterSpacing / sizePixels}em`
        : `${letterSpacing}px`;
      fixedSize["letter-spacing"] = letterSpacingString;
    }
  }
  if (additional) {
    Object.entries(additional).forEach(([name, value]) => {
      fixedSize[name] = value;
    });
  }
  results[`.text-${name}`] = fixedSize;
  if (screenWidthPixels) {
    const maxSize: CSSRuleObject = { ...fixedSize };
    if (sizePixels) {
      const ratio = (sizePixels / screenWidthPixels) * 100;
      maxSize["font-size"] = `${round(ratio)}vw`;
    }

    results[`.text-max-${name}`] = maxSize;
  }
}

export function addFontSizes(
  { addUtilities }: PluginAPI,
  config: IBondConfigurationOptions,
) {
  const noMax = !Object.values(config.sizes).find(v => v.max);
  const parsed = parseFontTable(config.fontTable);

  const results: CSSRuleObject = {};
  Object.entries(parsed).forEach(([name, information]) => {
    Object.entries(information).forEach(([size, entry]) => {
      const screenWidthPixels = noMax
        ? config.sizes[size]?.breakpoint
        : undefined;
      const fullName = `${name}-${size}`;
      newAddFontEntry(results, fullName, entry, screenWidthPixels);
    });
  });
  addUtilities(results);
}
