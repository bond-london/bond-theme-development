import { createHash } from "crypto";
import { readFileSync, writeFileSync } from "fs";

import { pascalCase } from "change-case";
import {
  CSSRuleObject,
  KeyValuePair,
  PluginAPI,
} from "tailwindcss/types/config";
import { IBondConfigurationOptions } from ".";
import { forEachObject } from "./utils";

let cachedContents = "";

export function buildGradients(
  { addUtilities }: PluginAPI,
  config: IBondConfigurationOptions,
): void {
  if (config.gradients) {
    const utilities: CSSRuleObject = {};

    forEachObject(config.gradients, ({ key: gradient, value: definition }) => {
      utilities[`.gradient-${gradient}`] = {
        [`@apply ${definition}`]: {},
      };
    });

    addUtilities(utilities);
  }
}

export function buildColours(
  config: IBondConfigurationOptions,
): KeyValuePair<string, string> {
  const colors: KeyValuePair<string, string> = {
    transparent: "transparent",
    current: "currentColor",
  };

  forEachObject(
    config.colorOptions,
    ({ key: colorName, value: colorValue }) => {
      colors[pascalCase(colorName)] = colorValue;
    },
  );
  return colors;
}

export function buildColorTable(config: IBondConfigurationOptions): void {
  const { colorFile, colorOpposites } = config;
  if (!colorFile) return undefined;

  const colors = buildColours(config);
  const gradients = config.gradients;

  const code: Array<string> = [
    `/* eslint-disable */`,
    `// This file is automatically generated - do not edit`,
    `import classNames from "classnames";`,
    `import { pascalCase } from "change-case";`,
    "export const colourTable = {",
  ];
  forEachObject(colors, ({ key: color }) => {
    const colorName = pascalCase(color);
    code.push(`  "${colorName}": ["text-${colorName}", "bg-${colorName}"],`);
  });
  code.push("};");
  code.push(`export type ColourName = keyof typeof colourTable;
export type ColourType = "text" | "bg";
export function lookupColourString(colour: ColourName, type:ColourType): string {
  const entry = colourTable[colour];
  if (!entry) throw new Error("No colour for " + colour);
  switch (type) {
    case "text": return entry[0];
    case "bg": return entry[1];
  }
  throw new Error("Unsupported colour type " + type);
}  
`);

  if (gradients) {
    code.push("export const gradientTable = {");
    forEachObject(gradients, ({ key: gradient }) => {
      code.push(`  "${gradient}": "gradient-${gradient}",`);
    });
    code.push("};");
    code.push(`
export type GradientName = keyof typeof gradientTable;
export function lookupGradientString(gradient: GradientName): string {
  const entry = gradientTable[gradient];
  if (!entry) throw new Error("No gradient for " + gradient);
  return entry;
}
function isGradientName(
  value: ColourName | GradientName,
): value is GradientName {
  return gradientTable[value as GradientName] !== undefined;
}
function isColourName(value: ColourName | GradientName): value is ColourName {
  return colourTable[value as ColourName] !== undefined;
}

export function lookupGradientOrColourString(
  key: ColourName | GradientName,
  type: ColourType,
): string {
  if (type === "bg" && isGradientName(key)) return lookupGradientString(key);
  if (isColourName(key)) return lookupColourString(key, type);
  throw new Error(
    "Failed to find gradient or colour string '" + key + "' for '" + type + "'",
  );
}
        `);
  } else {
    code.push(`
export type GradientName = "Transparent";
export const lookupGradientOrColourString = lookupColourString;
`);
  }

  if (colorOpposites) {
    code.push("export const colourOpposites= {");
    forEachObject(colorOpposites, ({ key: color, value: opposite }) => {
      const colourName = pascalCase(color);
      const oppositeName = pascalCase(opposite);
      code.push(`  "${colourName}": "${oppositeName}",`);
      const reverse = colorOpposites[opposite];
      if (!reverse) {
        code.push(`  "${oppositeName}": "${colourName}",`);
      }
    });
    code.push("};");

    code.push(`
export type OppositeName = keyof typeof colourOpposites;
export function lookupOpposite(colour: ColourName): ColourName {
  const entry = colourOpposites[colour as OppositeName];
  if (!entry) throw new Error("No opposite for " + colour);
  return entry as ColourName;      
}
    `);

    code.push(`
export function lookupColourClassNames(backgroundColour?: ColourName | GradientName | null, textColour?: ColourName | null): string|undefined {
  if (backgroundColour) {
    const backgroundColourClassName = lookupGradientOrColourString(backgroundColour, "bg");
    if (textColour) {
      const textColourClassName = lookupColourString(textColour, "text");
      return classNames(backgroundColourClassName, textColourClassName);
    }
    const opposite = lookupOpposite(backgroundColour as OppositeName);
    const textColourClassName = lookupColourString(opposite, "text");
    return classNames(backgroundColourClassName, textColourClassName);
  }
  if (textColour) {
    const textColourClassName = lookupColourString(textColour, "text");
    return textColourClassName;
  }
  return undefined;
}
`);
  } else {
    code.push(`
export function lookupColourClassNames(backgroundColour?: ColourName | GradientName | null, textColour?: ColourName | null): string|undefined {
  if (backgroundColour) {
    const backgroundColourClassName = lookupGradientOrColourString(backgroundColour, "bg");
    if (textColour) {
      const textColourClassName = lookupColourString(textColour, "text");
      return classNames(backgroundColourClassName, textColourClassName);
    }
    return backgroundColourClassName;
  }
  if (textColour) {
    const textColourClassName = lookupColourString(textColour, "text");
    return textColourClassName;
  }
  return undefined;
}
`);
  }

  code.push(`
  
export function convertCmsColourName(
  colour: string | undefined | null,
): ColourName | undefined {
  if (colour) {
    return pascalCase(colour) as ColourName;
  }
  return undefined;
}
`);

  const newContents = code.join("\r");
  if (newContents !== cachedContents) {
    cachedContents = newContents;
    writeColorsIfRequired(newContents, colorFile);
  }

  return undefined;
}

function calculateMd5(content: string | Buffer): string {
  const hash = createHash("md5");
  hash.update(content);
  return hash.digest("hex");
}
function writeColorsIfRequired(contents: string, colorFile: string): void {
  const newHash = calculateMd5(contents);
  let oldHash = "";
  try {
    const oldContents = readFileSync(colorFile);
    oldHash = calculateMd5(oldContents);
  } catch (error) {
    // ignore this
  }
  if (oldHash === newHash) {
    return;
  }

  console.log("Writing out new color file");
  writeFileSync(colorFile, contents);
}
