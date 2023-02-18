/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */

import { addAnimationUtilities } from "./animations";
import { addBorderSpacing } from "./borders";
import { addFontSizes } from "./fonts";
import { buildGrid } from "./grids";
import { buildTypography } from "./typography";
import { addExtraVariants } from "./variants";
import { configureTheme } from "./theme";
import { PluginAPI } from "tailwindcss/types/config";

export interface ISizeInformation {
  breakpoint?: number;
  margin: number;
  gap: number;
  cols: number;
  max?: number;
}

export interface IFontTableEntry {
  default: number;
  weight: string;
  font?: string;
  letterSpacing?: number;
  additional?: string;
}

export interface IBondConfigurationOptions {
  colorFile?: string;
  colorOptions: { [color: string]: string };
  colorOpposites?: { [color: string]: string };
  sizes: { [size: string]: ISizeInformation };
  fontTable: {
    [font: string]: IFontTableEntry & { [key: string]: string | number };
  };
  spacing: { section: number; [spacing: string]: number };
  lineHeight?: number;
}

const plugin = require("tailwindcss/plugin");

module.exports = plugin.withOptions(
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  (config: IBondConfigurationOptions) => (helpers: PluginAPI) => {
    const { addBase } = helpers;
    /* eslint-disable @typescript-eslint/naming-convention */
    addBase({
      ".icon-container > :first-child": { width: "auto", height: "100%" },
    });
    /* eslint-enable @typescript-eslint/naming-convention */
    buildGrid(helpers, config);
    addFontSizes(helpers, config);
    addAnimationUtilities(helpers);
    addBorderSpacing(helpers);
    addExtraVariants(helpers);
    buildTypography(helpers, config);
  },
  (config: IBondConfigurationOptions) => configureTheme(config)
);
