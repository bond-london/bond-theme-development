/* eslint-disable @typescript-eslint/naming-convention */
import { CSSRuleObject, PluginAPI } from "tailwindcss/types/config";
import { IBondConfigurationOptions } from ".";
import {
  calculateNumbers,
  calculateRemSize,
  createApplyEntry,
  forEachObject,
} from "./utils";

function addContainerGrid(
  helpers: PluginAPI,
  config: IBondConfigurationOptions
): void {
  const { addUtilities, addComponents } = helpers;
  addUtilities({
    ".container-rows-grid": {
      "--bond-container-row-1": calculateRemSize(config.spacing.s),
      "--bond-container-row-2": "1fr",
      "--bond-container-row-3": "1fr",
      "--bond-container-row-4": "1fr",
      "--bond-container-row-5": "1fr",
      "--bond-container-row-6": calculateRemSize(config.spacing.s),
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
    if (gap) {
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

export function buildGridSpacing(
  config: IBondConfigurationOptions
): CSSRuleObject {
  const results: CSSRuleObject = {};
  const maximumWidth = Math.max(
    ...Object.values(config.sizes)
      .filter(v => v.max)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map(v => v.max!)
  );

  const maxWidthRem = calculateRemSize(maximumWidth);

  let lastMargin = 0;
  let lastCols = 0;
  let lastGap = 0;

  forEachObject(
    config.sizes,
    ({
      key: name,
      value: { margin: possibleMargin, gap: possibleGap, cols: possibleCols },
    }) => {
      const margin = possibleMargin || lastMargin;
      lastMargin = margin;
      const cols = (lastCols = possibleCols || lastCols);
      const gap = (lastGap = possibleGap || lastGap);

      const gapRem = calculateRemSize(gap);
      const totalGapRem = calculateRemSize(gap * (cols - 1));
      const marginRem = calculateRemSize(margin);
      const totalMarginRem = calculateRemSize(2 * margin);
      const calculateColSize = `((min((100 * var(--bond-vw)) - ${totalMarginRem}, ${maxWidthRem}) - ${totalGapRem}) / ${cols})`;

      results[`${name}-gap`] = gapRem;

      results[`${name}-margin`] = marginRem;

      results[`${name}-half-col`] = `calc(${calculateColSize} * 0.5)`;

      for (let i = 1; i <= cols; i++) {
        results[
          `${name}-${i}-cols`
        ] = `calc((${calculateColSize} * ${i}) + (${gapRem} * ${i - 1}))`;

        results[
          `${name}-${i}-gap-cols`
        ] = `calc((${calculateColSize} * ${i}) + (${gapRem} * ${i}))`;
      }
    }
  );
  return results;
}

export function createGridCols(
  config: IBondConfigurationOptions
): CSSRuleObject {
  const grids: CSSRuleObject = {};
  let lastMargin: number | undefined;
  forEachObject(
    config.sizes,
    ({ key: name, value: { margin: possibleMargin, cols, max: maxWidth } }) => {
      const margin = possibleMargin || lastMargin || 0;
      const marginRem = calculateRemSize(margin);
      lastMargin = margin;
      if (cols) {
        Object.assign(
          grids,
          calculateNumbers(
            1,
            cols,
            v => `${name}-left-${v}`,
            v => `${marginRem} repeat(${v}, 1fr)`
          )
        );
        Object.assign(
          grids,
          calculateNumbers(
            1,
            cols,
            v => `${name}-right-${v}`,
            v => `repeat(${v}, 1fr) ${marginRem}`
          )
        );

        grids[
          `${name}-full`
        ] = `${marginRem} repeat(${cols}, 1fr) ${marginRem}`;
        grids[`${name}-content`] = `repeat(${cols}, 1fr)`;
      }
      if (maxWidth) {
        grids[
          `${name}-container`
        ] = `minmax(${marginRem},1fr) minmax(auto, ${calculateRemSize(
          maxWidth
        )}) minmax(${marginRem},1fr)`;
      } else {
        grids[`${name}-container`] = `${marginRem} auto ${marginRem}`;
      }
    }
  );

  return grids;
}
