import { CSSRuleObject } from "tailwindcss/types/config";
import { IBondConfigurationOptions } from ".";
import { mapObject, defaultKeyFn, remValueFn } from "./utils";

export function buildSpacing(config: IBondConfigurationOptions): CSSRuleObject {
  const results = mapObject(config.spacing, defaultKeyFn, remValueFn);
  return results;
}
