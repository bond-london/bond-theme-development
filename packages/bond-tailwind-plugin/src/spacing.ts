import { CSSRuleObject } from "tailwindcss/types/config";
import { IBondConfigurationOptions } from ".";
import { defaultKeyFn, mapObject, remValueFn } from "./utils";

export function buildSpacing(config: IBondConfigurationOptions): CSSRuleObject {
  const results = mapObject(config.spacing, defaultKeyFn, remValueFn);
  return results;
}
