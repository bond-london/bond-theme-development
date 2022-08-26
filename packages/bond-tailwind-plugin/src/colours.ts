import { BondConfigurationOptions } from ".";
import { ConfigurationObj } from "./plugin";
import { forEachObject } from "./utils";

export function buildColours(config: BondConfigurationOptions) {
  const colors: ConfigurationObj = {
    transparent: "transparent",
    current: "currentColor",
  };

  forEachObject(
    config.colorOptions,
    ({ key: colorName, value: colorValue }) => {
      colors[colorName] = colorValue;
    }
  );
  return colors;
}
