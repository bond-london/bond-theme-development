import { CSSRuleObject, PluginAPI } from "tailwindcss/types/config";
import { IBondConfigurationOptions } from ".";
import { buildLetterSpacingName } from "./theme";
import { createApplyEntry, forEachObject } from "./utils";

function getFontName(size: string | number): string | undefined {
  if (typeof size === "string") {
    let split = size.split("/");
    if (split.length === 1) {
      split = size.split("-");
    }
    if (split.length > 2) {
      const fontName = split[2];
      return fontName;
    }
  }
  return undefined;
}

export function buildTypography(
  { addComponents }: PluginAPI,
  config: IBondConfigurationOptions,
): void {
  const components: CSSRuleObject = {};
  const noMax = !Object.values(config.sizes).find(v => v.max);
  forEachObject(
    config.fontTable,
    ({
      key: name,
      value: {
        font,
        weight,
        default: defaults,
        letterSpacing,
        additional,
        ...other
      },
    }) => {
      const classes = [`font-${weight}`, `text-${defaults}`];
      if (font) {
        classes.push(`font-${font}`);
      } else {
        const fontName = getFontName(defaults);
        if (fontName) {
          classes.push(`font-${fontName}`);
        }
      }
      if (letterSpacing) {
        classes.push(`tracking-${buildLetterSpacingName(`${letterSpacing}`)}`);
      }
      if (additional) {
        classes.push(additional);
      }
      forEachObject(config.sizes, ({ key }) => {
        const size = other[key];
        if (size) {
          classes.push(`${key}:text-${size}`);
          const fontName = getFontName(size);
          if (fontName) {
            classes.push(`${key}:font-${fontName}`);
          }
        }
      });
      if (noMax) {
        const last = classes.pop()!;
        const max = last.replace(":text-", ":text-max-");
        classes.push(max);
      }
      components[`.${name}`] = createApplyEntry(classes);
    },
  );
  addComponents(components);
}
