import { TailwindConfig, TailwindValues } from "tailwindcss/tailwind-config";
import { BondConfigurationOptions } from ".";
import { buildColours } from "./colours";
import { buildGridSpacing, createGridCols } from "./grids";
import { ConfigurationObj } from "./plugin";
import { buildSpacing } from "./spacing";
import {
  mapObject,
  defaultKeyFn,
  calculateNumbers,
  calculateRemSize,
  remValueFn,
  forEachObject,
} from "./utils";

export const defaultNumbers = {
  0: "0",
  full: "100%",
  unset: "unset",
};

function buildLetterSpacing(config: BondConfigurationOptions) {
  const letterSpacings = new Set<number>();
  forEachObject(config.fontTable, ({ value: { letterSpacing } }) => {
    if (letterSpacing) {
      letterSpacings.add(letterSpacing);
    }
  });
  const results: ConfigurationObj = {};
  if (letterSpacings.size > 0) {
    letterSpacings.forEach((value) => {
      results[`${value}`] = calculateRemSize(value);
    });
  }
  return results;
}

export function configureTheme(
  config: BondConfigurationOptions
): Partial<TailwindConfig> {
  const maximumWidth = Math.max(
    ...Object.values(config.sizes)
      .filter((v) => v.max)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map((v) => v.max!)
  );
  const maximumColumns = Math.max(
    ...Object.values(config.sizes)
      .map((v) => v.cols)
      .filter((v) => v)
  );

  const theme = {
    theme: {
      screens: {
        ...(mapObject(
          config.sizes,
          defaultKeyFn,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (v) => `${v.breakpoint!}px`,
          ({ value }) => !!value.breakpoint
        ) as TailwindValues),
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
        ...calculateNumbers(
          1,
          maximumColumns,
          defaultKeyFn,
          (v) => `repeat(${v}, minmax(0, 1fr))`
        ),
        ...createGridCols(config),
      },
      gridColumn: {
        ...calculateNumbers(
          1,
          maximumColumns,
          (v) => `span-${v}`,
          (v) => `span ${v} / span ${v}`
        ),
        "span-full": "1/-1",
        auto: "auto",
        ...mapObject(
          config.sizes,
          (name) => `central-${name}`,
          ({ cols }) => `2 / span ${cols}`
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
      letterSpacing: { ...buildLetterSpacing(config) },
      extend: {
        maxWidth: {
          maxWidth: calculateRemSize(maximumWidth),
        },
        borderWidth: {
          ...mapObject(config.spacing, defaultKeyFn, remValueFn),
        },
        fontWeight: {
          regular: "400",
        },
      },
    },
  };
  return theme;
}
