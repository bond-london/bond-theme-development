/* eslint-disable @typescript-eslint/naming-convention */

import { PluginAPI } from "tailwindcss/types/config";

export function addBorderSpacing({ addUtilities }: PluginAPI): void {
  addUtilities({
    ".border-spacing-0": { "border-spacing": "0" },
  });
}
