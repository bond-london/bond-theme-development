export interface ConfigurationMap {
  [key: string]: ConfigurationMap | string;
}
export interface ConfigurationObj {
  [key: string]: string;
}

export interface PluginHelpers {
  addUtilities: (map: ConfigurationMap) => void;
  addComponents: (map: ConfigurationMap) => void;
  addBase: (map: ConfigurationMap) => void;
  addDefaults: (
    group: string,
    declarations: Record<string, string | Array<string>>
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
