import { BondConfigurationOptions } from ".";
import { ConfigurationObj } from "./plugin";
import { mapObject, defaultKeyFn, remValueFn } from "./utils";

export function buildSpacing(
  config: BondConfigurationOptions
): ConfigurationObj {
  const results = mapObject(config.spacing, defaultKeyFn, remValueFn);
  return results;
}
