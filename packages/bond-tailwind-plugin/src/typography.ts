import { CSSRuleObject, PluginAPI } from "tailwindcss/types/config";
import { IBondConfigurationOptions } from ".";
import { createApplyEntry, forEachObject } from "./utils";

export function buildTypography(
  { addComponents }: PluginAPI,
  config: IBondConfigurationOptions
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
      if (noMax) {
        const last = classes.pop() as string;
        const max = last.replace(":text-", ":text-max-");
        classes.push(max);
      }
      components[`.${name}`] = createApplyEntry(classes);
    }
  );
  addComponents(components);
}
