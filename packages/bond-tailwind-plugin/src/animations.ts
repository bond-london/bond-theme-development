import { PluginHelpers } from "./plugin";
import { calculateNumbersMap } from "./utils";

export function addAnimationUtilities({ addUtilities }: PluginHelpers): void {
  addUtilities(
    calculateNumbersMap(
      100,
      10000,
      (v) => `.animation-delay-${v}`,
      (v) => ({ "animation-delay": `${v}ms` }),
      100
    )
  );

  addUtilities({
    ".animation-running": { "animation-play-state": "running" },
    ".animation-paused": { "animation-play-state": "paused" },
  });

  addUtilities(
    calculateNumbersMap(
      100,
      10000,
      (v) => `.animation-duration-${v}`,
      (v) => ({ "animation-duration": `${v}ms` }),
      100
    )
  );
  addUtilities(
    calculateNumbersMap(
      100,
      10000,
      (v) => `.transition-duration-${v}`,
      (v) => ({ "transition-duration": `${v}ms` }),
      100
    )
  );
}
