import { CSSRuleObject, PluginAPI } from "tailwindcss/types/config";
import { IBondConfigurationOptions } from ".";
import { parseFontTable } from "./fonts";
import { createApplyEntry } from "./utils";

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// function getFontName(size: string | number): string | undefined {
//   if (typeof size === "string") {
//     let split = size.split("/");
//     if (split.length === 1) {
//       split = size.split("-");
//     }
//     if (split.length > 2) {
//       const fontName = split[2];
//       return fontName;
//     }
//   }
//   return undefined;
// }

export function buildTypography(
  { addComponents }: PluginAPI,
  config: IBondConfigurationOptions,
) {
  const components: CSSRuleObject = {};
  const noMax = !Object.values(config.sizes).find(v => v.max);
  const parsed = parseFontTable(config.fontTable);
  Object.entries(parsed).forEach(([name, information]) => {
    const classes: Array<string> = [];
    let currentFont: string | undefined;
    Object.entries(information).forEach(([size, entry], index, array) => {
      const font = entry.font;
      const isFirst = index === 0;
      const isLast = index === array.length - 1;
      const prefix = isFirst ? "" : `${size}:`;
      const baseName = `${name}-${size}`;
      const fullName =
        noMax && isLast ? `text-max-${baseName}` : `text-${baseName}`;
      classes.push(`${prefix}${fullName}`);
      if (font && font !== currentFont) {
        currentFont = font;
        classes.push(`${prefix}font-${font}`);
      }
    });
    components[`.${name}`] = createApplyEntry(classes);
  });
  addComponents(components);
}
