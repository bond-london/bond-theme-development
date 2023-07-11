/* eslint-disable @typescript-eslint/naming-convention */
import { PluginAPI } from "tailwindcss/types/config";
import { calculateNumbersMap } from "./utils";

export function addAnimationUtilities({ addUtilities }: PluginAPI): void {
  addUtilities(
    calculateNumbersMap(
      100,
      10000,
      v => `.animation-delay-${v}`,
      v => {
        return { "animation-delay": `${v}ms` };
      },
      100,
    ),
  );

  addUtilities({
    ".animation-running": { "animation-play-state": "running" },
    ".animation-paused": { "animation-play-state": "paused" },
    ".animation-paused *": { "animation-play-state": "paused" },
  });

  addUtilities(
    calculateNumbersMap(
      100,
      10000,
      v => `.animation-duration-${v}`,
      v => {
        return { "animation-duration": `${v}ms` };
      },
      100,
    ),
  );
  addUtilities(
    calculateNumbersMap(
      100,
      10000,
      v => `.transition-duration-${v}`,
      v => {
        return { "transition-duration": `${v}ms` };
      },
      100,
    ),
  );
}
