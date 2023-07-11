/* eslint-disable @typescript-eslint/naming-convention */
import { Config, KeyValuePair, ThemeConfig } from "tailwindcss/types/config";
import { IBondConfigurationOptions } from ".";
import { buildColorTable, buildColours } from "./colours";
import { buildGridSpacing, createGridCols } from "./grids";
import { buildSpacing } from "./spacing";
import {
  mapObject,
  defaultKeyFn,
  calculateNumbers,
  calculateRemSize,
  remValueFn,
  forEachObject,
  mapNumbers,
} from "./utils";

export const defaultNumbers = {
  0: "0",
  full: "100%",
  unset: "unset",
};

export function buildLetterSpacingName(name: string): string {
  return name.replace("-", "minus");
}

function buildLetterSpacing(
  config: IBondConfigurationOptions,
): KeyValuePair<string, string> | undefined {
  const letterSpacingsValues = new Set<number>();
  const letterSpacingNames = new Set<string>();
  forEachObject(config.fontTable, ({ value: { letterSpacing } }) => {
    if (letterSpacing) {
      if (typeof letterSpacing === "string") {
        letterSpacingNames.add(letterSpacing);
      } else if (typeof letterSpacing === "number") {
        letterSpacingsValues.add(letterSpacing);
      }
    }
  });
  if (letterSpacingsValues.size + letterSpacingNames.size > 0) {
    const results: KeyValuePair<string, string> = {};
    letterSpacingsValues.forEach(value => {
      results[buildLetterSpacingName(`${value}`)] = calculateRemSize(value);
    });
    letterSpacingNames.forEach(
      value => (results[buildLetterSpacingName(value)] = value),
    );
    return results;
  }
  return undefined;
}

export function configureTheme(
  config: IBondConfigurationOptions,
): Partial<Config> {
  buildColorTable(config);
  const maximumWidth = Math.max(
    ...Object.values(config.sizes)
      .filter(v => v.max)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map(v => v.max!),
  );
  const maximumColumns = Math.max(
    ...Object.values(config.sizes)
      .map(v => v.cols)
      .filter(v => v),
  );

  const theme: Partial<ThemeConfig> = {
    screens: {
      ...mapObject(
        config.sizes,
        defaultKeyFn,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        v => `${v.breakpoint!}px`,
        ({ value }) => !!value.breakpoint,
      ),
    },
    colors: buildColours(config),
    spacing: {
      ...defaultNumbers,
      ...buildSpacing(config),
      ...buildGridSpacing(config),
      "line-height": "var(--bond-line-height)",
      "font-size": "var(--bond-font-size)",
      "bottom-font-offset": "var(--bond-bottom-font-offset)",
    },
    minHeight: {
      icon: calculateRemSize(48),
    },
    minWidth: {
      icon: calculateRemSize(48),
    },
    borderRadius: {
      0: "0",
      full: "9999px",
    },
    gridTemplateColumns: {
      none: "none",
      ...calculateNumbers(
        1,
        maximumColumns,
        defaultKeyFn,
        v => `repeat(${v}, minmax(0, 1fr))`,
      ),
      ...createGridCols(config),
    },
    gridColumn: {
      ...calculateNumbers(
        1,
        maximumColumns,
        v => `span-${v}`,
        v => `span ${v} / span ${v}`,
      ),
      "span-full": "1/-1",
      auto: "auto",
      ...mapObject(
        config.sizes,
        name => `central-${name}`,
        ({ cols }) => `2 / span ${cols}`,
      ),
    },
    gridColumnStart: {
      ...calculateNumbers(1, maximumColumns, defaultKeyFn, defaultKeyFn),
      auto: "auto",
    },
    gridColumnEnd: {
      ...calculateNumbers(1, maximumColumns, defaultKeyFn, defaultKeyFn),
      auto: "auto",
    },
    extend: {
      maxWidth: {
        maxWidth: calculateRemSize(maximumWidth),
      },
      borderWidth: {
        ...mapObject(config.spacing, defaultKeyFn, remValueFn),
      },
      fontWeight: {
        ...mapNumbers(
          [100, 200, 300, 400, 500, 600, 700, 800, 900],
          defaultKeyFn,
          defaultKeyFn,
        ),
        regular: "400",
      },
    },
  };

  const letterSpacing = buildLetterSpacing(config);
  if (letterSpacing) {
    theme.letterSpacing = letterSpacing;
  }

  const result: Partial<Config> = {
    theme,
  };
  return result;
}
