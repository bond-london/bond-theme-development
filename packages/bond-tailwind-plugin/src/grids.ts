/* eslint-disable @typescript-eslint/naming-convention */
import { CSSRuleObject } from "tailwindcss/types/config";
import { ExtendedPluginAPI, IBondConfigurationOptions } from ".";
import {
  calculateNumbers,
  calculateRemSize,
  calculateVwSize,
  createApplyEntry,
  forEachObject,
} from "./utils";

function addContainerGrid(
  helpers: ExtendedPluginAPI,
  config: IBondConfigurationOptions,
): void {
  const noMax = !Object.values(config.sizes).find(v => v.max);
  const largest = Math.max(
    ...(Object.values(config.sizes)
      .map(v => v.breakpoint)
      .filter(v => v) as ReadonlyArray<number>),
  );
  helpers.addDefaults("container-rows", {
    "--bond-container-row-1": "0fr",
    "--bond-container-row-2": "1fr",
    "--bond-container-row-3": "1fr",
    "--bond-container-row-4": "1fr",
    "--bond-container-row-5": "1fr",
    "--bond-container-row-6": "0fr",
  });
  helpers.addUtilities({
    ".container-rows-grid": {
      "@defaults container-rows": {},
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
  const wideContainerGrid = ["grid"];
  const wideContentGrid = ["grid"];
  const wideInnerFull: Array<string> = [];
  const gridGap: Array<string> = [];
  forEachObject(
    config.sizes,
    ({ key, value: { breakpoint, cols, gap, max }, index }) => {
      const isLargest = breakpoint === largest;
      const prefix = index === 0 ? "" : `${key}:`;
      if (cols ?? max ?? isLargest) {
        containerGrid.push(`${prefix}grid-cols-${key}-container`);
        wideContainerGrid.push(`${prefix}grid-cols-${key}-wide-container`);
      }

      if (cols) {
        contentGrid.push(`${prefix}grid-cols-${key}-content`);
        wideContentGrid.push(`${prefix}grid-cols-${key}-wide-content`);
        wideInnerFull.push(`${prefix}col-start-2 ${prefix}col-span-${cols}`);
      }
      if (gap ?? noMax) {
        const gapClassName = `${prefix}gap-x-${key}-gap`;
        contentGrid.push(gapClassName);
        wideContentGrid.push(gapClassName);
        gridGap.push(gapClassName);
      }
    },
  );
  components[`.container-cols-grid`] = createApplyEntry(containerGrid);
  components[".content-cols-grid"] = createApplyEntry(contentGrid);
  components[".grid-gap"] = createApplyEntry(gridGap);
  components[`.wide-container-cols-grid`] = createApplyEntry(wideContainerGrid);
  components[".wide-content-cols-grid"] = createApplyEntry(wideContentGrid);
  components[".wide-inner-full"] = createApplyEntry(wideInnerFull);

  helpers.addUtilities(utilities);
  helpers.addComponents(components);
}

export function buildGrid(
  helpers: ExtendedPluginAPI,
  config: IBondConfigurationOptions,
): void {
  addContainerGrid(helpers, config);
}

function calculateSize(
  breakpoint: number | undefined,
  pixels: number,
  useVw: boolean,
): string {
  if (useVw) {
    return calculateVwSize(breakpoint ?? 375, pixels);
  }
  return calculateRemSize(pixels);
}

export function buildGridSpacing(
  config: IBondConfigurationOptions,
): CSSRuleObject {
  const results: CSSRuleObject = {};
  const maximumWidth = Math.max(
    ...(Object.values(config.sizes)
      .map(v => v.max)
      .filter(v => v) as Array<number>),
  );
  const noMax = !Object.values(config.sizes).find(v => v.max);
  const largest = Math.max(
    ...(Object.values(config.sizes)
      .map(v => v.breakpoint)
      .filter(v => v) as ReadonlyArray<number>),
  );

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
      const margin = possibleMargin ?? lastMargin;
      lastMargin = margin;
      const cols = possibleCols ?? lastCols;
      lastCols = cols;
      const gap = possibleGap ?? lastGap;
      lastGap = gap;

      const isLargest = breakpoint === largest;
      const useVw = noMax && isLargest;

      // console.log({
      //   isLargest,
      //   largest,
      //   breakpoint,
      //   margin,
      //   cols,
      //   gap,
      //   noMax,
      //   useVw,
      // });

      const gapSize = calculateSize(breakpoint, gap, useVw);
      const totalGapSize = calculateSize(breakpoint, gap * (cols - 1), useVw);
      const marginSize = calculateSize(breakpoint, margin, useVw);
      const totalMarginSize = calculateSize(breakpoint, 2 * margin, useVw);
      const calculateColSize =
        maximumWidth > 0
          ? `((min(100dvw - ${totalMarginSize}, ${maxWidthRem}) - ${totalGapSize}) / ${cols})`
          : `((100dvw - ${totalMarginSize} - ${totalGapSize}) / ${cols})`;

      results[`${name}-gap`] = gapSize;

      results[`${name}-margin`] = marginSize;

      results[`${name}-half-col`] = `calc(${calculateColSize} * 0.5)`;

      for (let i = 1; i <= cols; i++) {
        results[`${name}-${i}-cols`] =
          `calc((${calculateColSize} * ${i}) + (${gapSize} * ${i - 1}))`;

        results[`${name}-${i}-gap-cols`] =
          `calc((${calculateColSize} * ${i}) + (${gapSize} * ${i}))`;
      }
    },
  );
  return results;
}

export function createGridCols(
  config: IBondConfigurationOptions,
): CSSRuleObject {
  const grids: CSSRuleObject = {};
  const noMax = !Object.values(config.sizes).find(v => v.max);
  const largest = Math.max(
    ...(Object.values(config.sizes)
      .map(v => v.breakpoint)
      .filter(v => v) as ReadonlyArray<number>),
  );
  let lastMargin: number | undefined;
  let lastGap: number | undefined;
  forEachObject(
    config.sizes,
    ({
      key: name,
      value: {
        breakpoint,
        margin: possibleMargin,
        cols,
        max: maxWidth,
        gap: possibleGap,
      },
    }) => {
      const margin = possibleMargin ?? lastMargin ?? 0;
      const gap = possibleGap ?? lastGap ?? 0;
      const isLargest = breakpoint === largest;
      const useVw = noMax && isLargest;
      const marginSize = calculateSize(breakpoint, margin, useVw);
      const marginLessGapSize = calculateSize(breakpoint, margin - gap, useVw);
      // console.log({
      //   name,
      //   breakpoint,
      //   margin,
      //   marginSize,
      //   cols,
      //   maxWidth,
      //   noMax,
      //   isLargest,
      //   useVw,
      // });
      lastMargin = margin;
      lastGap = gap;
      if (cols) {
        Object.assign(
          grids,
          calculateNumbers(
            1,
            cols,
            v => `${name}-left-${v}`,
            v => `${marginSize} repeat(${v}, 1fr)`,
          ),
        );
        Object.assign(
          grids,
          calculateNumbers(
            1,
            cols,
            v => `${name}-right-${v}`,
            v => `repeat(${v}, 1fr) ${marginSize}`,
          ),
        );

        grids[`${name}-full`] =
          `${marginSize} repeat(${cols}, 1fr) ${marginSize}`;
        grids[`${name}-content`] = `repeat(${cols}, 1fr)`;
        grids[`${name}-wide-content`] =
          `${marginLessGapSize} repeat(${cols}, 1fr) ${marginLessGapSize}`;
      }
      if (maxWidth) {
        grids[`${name}-container`] =
          `minmax(${marginSize},1fr) minmax(auto, ${calculateRemSize(
            maxWidth,
          )}) minmax(${marginSize},1fr)`;
        grids[`${name}-wide-container`] =
          `1fr ${marginSize} minmax(auto, ${calculateRemSize(
            maxWidth,
          )}) ${marginSize} 1fr`;
      } else {
        grids[`${name}-container`] = `${marginSize} auto ${marginSize}`;
        grids[`${name}-wide-container`] =
          `0 ${marginSize} auto ${marginSize} 0`;
      }
    },
  );

  return grids;
}
