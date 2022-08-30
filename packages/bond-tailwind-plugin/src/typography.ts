import { CSSRuleObject, PluginAPI } from "tailwindcss/types/config";
import { IBondConfigurationOptions } from ".";
import { createApplyEntry, forEachObject } from "./utils";

export function buildTypography(
  { addComponents }: PluginAPI,
  config: IBondConfigurationOptions
): void {
  const components: CSSRuleObject = {};
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
      }
      if (letterSpacing) {
        classes.push(`tracking-${letterSpacing}`);
      }
      if (additional) {
        classes.push(additional);
      }
      forEachObject(config.sizes, ({ key }) => {
        const size = other[key];
        if (size) {
          classes.push(`${key}:text-${size}`);
        }
      });
      components[`.${name}`] = createApplyEntry(classes);
    }
  );
  addComponents(components);
}
