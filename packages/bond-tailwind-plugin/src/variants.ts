import { PluginHelpers } from "./plugin";

export function addExtraVariants({ addVariant, e }: PluginHelpers): void {
  addVariant("not-first", ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => {
      return `.${e(`not-first${separator}${className}`)}:not(:first-child)`;
    });
  });
  addVariant("not-last", ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => {
      return `.${e(`not-last${separator}${className}`)}:not(:last-child)`;
    });
  });
}
