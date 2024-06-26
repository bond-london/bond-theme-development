/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */

import { withOptions } from "tailwindcss/plugin";
import { PluginAPI } from "tailwindcss/types/config";
import { addAnimationUtilities } from "./animations";
import { addBorderSpacing } from "./borders";
import { buildColourVariables, buildGradients } from "./colours";
import { addFontSizes } from "./fonts";
import { buildGrid } from "./grids";
import { configureTheme } from "./theme";
import { buildTypography } from "./typography";
import { addExtraVariants } from "./variants";

export type ExtendedPluginAPI = PluginAPI & {
  addDefaults: (
    group: string,
    declarations: Record<string, string | Array<string>>,
  ) => void;
};

export interface ISizeInformation {
  breakpoint?: number;
  margin?: number;
  gap?: number;
  cols?: number;
  max?: number;
}

export interface IFontTableEntry extends IFontEntry {
  default: string | number | IFontEntry;
}

export interface IFontEntry extends IFontTableBase {
  sizePixels?: number;
}

export interface IFontTableBase {
  font?: string;
  style?: string;
  weight?: string | number;
  lineHeight?: string | number;
  letterSpacing?: string | number;
  additional?: Record<string, string>;
}

export type FontTable = IFontTableBase & {
  styles: Record<
    string,
    IFontTableEntry & Record<string, string | number | IFontEntry>
  >;
};

export interface IBondConfigurationOptions {
  extendOnly?: boolean;
  enableDarkColors?: boolean;
  colorFile?: string;
  colorOptions: Record<string, string>;
  darkLightColors?: Record<string, string>;
  gradients?: Record<string, string>;
  colorOpposites?: Record<string, string>;
  sizes: Record<string, ISizeInformation>;
  fontTable: FontTable;
  spacing: Record<string, number>;
  lineHeight?: number;
}

const configure = withOptions(
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  (config: IBondConfigurationOptions) => (helpers: PluginAPI) => {
    /* eslint-disable @typescript-eslint/naming-convention */
    helpers.addBase({
      ".icon-container > :first-child": { width: "auto", height: "100%" },
    });
    (helpers as ExtendedPluginAPI).addDefaults("bond-spacing", {
      "--bond-line-height": "1rem",
      "--bond-font-size": "1rem",
      "--bond-bottom-font-offset": "0.1rem",
    });
    /* eslint-enable @typescript-eslint/naming-convention */
    buildGrid(helpers as ExtendedPluginAPI, config);
    addFontSizes(helpers, config);
    addAnimationUtilities(helpers);
    addBorderSpacing(helpers);
    addExtraVariants(helpers);
    buildTypography(helpers, config);
    buildGradients(helpers, config);
    buildColourVariables(helpers, config);
  },
  (config: IBondConfigurationOptions) => configureTheme(config),
);

export default configure;
