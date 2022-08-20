import { PluginHelpers } from "./plugin";

export function addBorderSpacing({ addUtilities }: PluginHelpers): void {
  addUtilities({
    ".border-spacing-0": { "border-spacing": "0" },
  });
}
