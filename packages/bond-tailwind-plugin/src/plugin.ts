export type ConfigurationMap = { [key: string]: ConfigurationMap | string };
export type ConfigurationObj = { [key: string]: string };

export interface PluginHelpers {
  addUtilities: (map: ConfigurationMap) => void;
  addComponents: (map: ConfigurationMap) => void;
  addBase: (map: ConfigurationMap) => void;
  addDefaults: (
    group: string,
    declarations: Record<string, string | string[]>
  ) => void;
  addVariant: (
    name: string,
    fn: (helpers: {
      separator: string;
      modifySelectors: (fn: (args: { className: string }) => void) => void;
    }) => void
  ) => void;
  e: (value: string) => string;
  // prefix: any;
  // theme: any;
  // variants: any;
  // config: any;
  // postcss: any;
}
