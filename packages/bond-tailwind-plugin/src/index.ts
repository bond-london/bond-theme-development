/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */

import { addAnimationUtilities } from "./animations";
import { addBorderSpacing } from "./borders";
import { addFontSizes } from "./fonts";
import { buildGrid } from "./grids";
import { PluginHelpers } from "./plugin";
import { buildTypography } from "./typography";
import { addExtraVariants } from "./variants";
import { configureTheme } from "./theme";

export interface SizeInformation {
  breakpoint?: number;
  margin: number;
  gap: number;
  cols: number;
  max?: number;
}

export interface FontTableEntry {
  default: number;
  weight: string;
  font?: string;
  letterSpacing?: number;
  additional?: string;
}

export interface BondConfigurationOptions {
  colorFile?: string;
  colorOptions: { [color: string]: string };
  colorOpposites?: { [color: string]: string };
  sizes: { [size: string]: SizeInformation };
  fontTable: {
    [font: string]: FontTableEntry & { [key: string]: string | number };
  };
  spacing: { [spacing: string]: number };
  lineHeight?: number;
}

const plugin = require("tailwindcss/plugin");

module.exports = plugin.withOptions(
  (config: BondConfigurationOptions) => (helpers: PluginHelpers) => {
    const { addBase } = helpers;
    addBase({ ":root": { "--bond-vw": "1vw" } });
    buildGrid(helpers, config);
    addFontSizes(helpers, config);
    addAnimationUtilities(helpers);
    addBorderSpacing(helpers);
    addExtraVariants(helpers);
    buildTypography(helpers, config);
  },
  (config: BondConfigurationOptions) => {
    return configureTheme(config);
  }
);
