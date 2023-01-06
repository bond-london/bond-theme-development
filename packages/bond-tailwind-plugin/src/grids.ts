/* eslint-disable @typescript-eslint/naming-convention */
import { CSSRuleObject, PluginAPI } from "tailwindcss/types/config";
import { IBondConfigurationOptions } from ".";
import {
  calculateNumbers,
  calculateRemSize,
  calculateVwSize,
  createApplyEntry,
  forEachObject,
} from "./utils";

function addContainerGrid(
  helpers: PluginAPI,
  config: IBondConfigurationOptions
): void {
  const noMax = !Object.values(config.sizes).find(v => v.max);
  const { addUtilities, addComponents } = helpers;
  if (typeof config.spacing.section === undefined) {
    throw new Error("Need a config spacing section defined");
  }
  addUtilities({
    ".container-rows-grid": {
      "--bond-container-row-1": calculateRemSize(config.spacing.section),
      "--bond-container-row-2": "1fr",
      "--bond-container-row-3": "1fr",
      "--bond-container-row-4": "1fr",
      "--bond-container-row-5": "1fr",
      "--bond-container-row-6": calculateRemSize(config.spacing.section),
      "grid-template-rows": `var(--bond-container-row-1) var(--bond-container-row-2) var(--bond-container-row-3) var(--bond-container-row-4) var(--bond-container-row-5) var(--bond-container-row-6)`,
    },
  });

  const utilities: CSSRuleObject = {};
  const components: CSSRuleObject = {};

  for (let row = 1; row <= 6; row++) {
    Object.entries(config.spacing).forEach(([name, value]) => {
      const properties: CSSRuleObject = {};
      properties[`--bond-container-row-${row}`] = calculateRemSize(value);
      utilities[`.bond-row-${row}-${name}`] = properties;
    });

    utilities[`.bond-row-${row}-0`] = {
      [`--bond-container-row-${row}`]: "0px",
    };
  }

  const containerGrid = ["grid"];
  const contentGrid = ["grid"];
  const gridGap: Array<string> = [];
  forEachObject(config.sizes, ({ key, value: { cols, gap, max }, index }) => {
    const prefix = index === 0 ? "" : `${key}:`;
    if (cols || max) {
      containerGrid.push(`${prefix}grid-cols-${key}-container`);
    }

    if (cols) {
      contentGrid.push(`${prefix}grid-cols-${key}-content`);
    }
    if (gap || noMax) {
      const gapClassName = `${prefix}gap-x-${key}-gap`;
      contentGrid.push(gapClassName);
      gridGap.push(gapClassName);
    }
  });
  components[`.container-cols-grid`] = createApplyEntry(containerGrid);
  components[".content-cols-grid"] = createApplyEntry(contentGrid);
  components[".grid-gap"] = createApplyEntry(gridGap);

  addUtilities(utilities);
  addComponents(components);
}

export function buildGrid(
  helpers: PluginAPI,
  config: IBondConfigurationOptions
): void {
  addContainerGrid(helpers, config);
}

function calculateSize(
  noMax: boolean,
  breakpoint: number | undefined,
  pixels: number
): string {
  if (!noMax) {
    return calculateRemSize(pixels);
  }
  return calculateVwSize(breakpoint || 375, pixels);
}

export function buildGridSpacing(
  config: IBondConfigurationOptions
): CSSRuleObject {
  const results: CSSRuleObject = {};
  const maximumWidth = Math.max(
    ...(Object.values(config.sizes)
      .map(v => v.max)
      .filter(v => v) as Array<number>)
  );
  const noMax = !Object.values(config.sizes).find(v => v.max);

  const maxWidthRem = calculateRemSize(maximumWidth);

  let lastMargin = 0;
  let lastCols = 0;
  let lastGap = 0;

  forEachObject(
    config.sizes,
    ({
      key: name,
      value: {
        breakpoint,
        margin: possibleMargin,
        gap: possibleGap,
        cols: possibleCols,
      },
    }) => {
      const margin = possibleMargin || lastMargin;
      lastMargin = margin;
      const cols = (lastCols = possibleCols || lastCols);
      const gap = (lastGap = possibleGap || lastGap);

      const gapSize = calculateSize(noMax, breakpoint, gap);
      const totalGapSize = calculateSize(noMax, breakpoint, gap * (cols - 1));
      const marginSize = calculateSize(noMax, breakpoint, margin);
      const totalMarginSize = calculateSize(noMax, breakpoint, 2 * margin);
      const calculateColSize =
        maximumWidth > 0
          ? `((min((100 * var(--bond-vw)) - ${totalMarginSize}, ${maxWidthRem}) - ${totalGapSize}) / ${cols})`
          : `(((100 * var(--bond-vw)) - ${totalMarginSize}) / ${cols})`;

      results[`${name}-gap`] = gapSize;

      results[`${name}-margin`] = marginSize;

      results[`${name}-half-col`] = `calc(${calculateColSize} * 0.5)`;

      for (let i = 1; i <= cols; i++) {
        results[
          `${name}-${i}-cols`
        ] = `calc((${calculateColSize} * ${i}) + (${gapSize} * ${i - 1}))`;

        results[
          `${name}-${i}-gap-cols`
        ] = `calc((${calculateColSize} * ${i}) + (${gapSize} * ${i}))`;
      }
    }
  );
  return results;
}

export function createGridCols(
  config: IBondConfigurationOptions
): CSSRuleObject {
  const grids: CSSRuleObject = {};
  const noMax = !Object.values(config.sizes).find(v => v.max);
  let lastMargin: number | undefined;
  forEachObject(
    config.sizes,
    ({
      key: name,
      value: { breakpoint, margin: possibleMargin, cols, max: maxWidth },
    }) => {
      const margin = possibleMargin || lastMargin || 0;
      const marginSize = calculateSize(noMax, breakpoint, margin);
      lastMargin = margin;
      if (cols) {
        Object.assign(
          grids,
          calculateNumbers(
            1,
            cols,
            v => `${name}-left-${v}`,
            v => `${marginSize} repeat(${v}, 1fr)`
          )
        );
        Object.assign(
          grids,
          calculateNumbers(
            1,
            cols,
            v => `${name}-right-${v}`,
            v => `repeat(${v}, 1fr) ${marginSize}`
          )
        );

        grids[
          `${name}-full`
        ] = `${marginSize} repeat(${cols}, 1fr) ${marginSize}`;
        grids[`${name}-content`] = `repeat(${cols}, 1fr)`;
      }
      if (maxWidth) {
        grids[
          `${name}-container`
        ] = `minmax(${marginSize},1fr) minmax(auto, ${calculateRemSize(
          maxWidth
        )}) minmax(${marginSize},1fr)`;
      } else {
        grids[`${name}-container`] = `${marginSize} auto ${marginSize}`;
      }
    }
  );

  return grids;
}
