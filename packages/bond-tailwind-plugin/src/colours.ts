import { BondConfigurationOptions } from ".";
import { ConfigurationObj } from "./plugin";
import { forEachObject } from "./utils";
import { pascalCase } from "pascal-case";
import { writeFileSync } from "fs-extra";

export function buildColours(config: BondConfigurationOptions) {
  const colors: ConfigurationObj = {
    transparent: "transparent",
    current: "currentColor",
  };

  forEachObject(
    config.colorOptions,
    ({ key: colorName, value: colorValue }) => {
      colors[colorName] = colorValue;
    }
  );
  return colors;
}

export function buildColorTable(config: BondConfigurationOptions) {
  const { colorFile, colorOpposites } = config;
  if (!colorFile) return;

  const colors = buildColours(config);

  const code: Array<string> = [
    `import classNames from "classnames";`,
    "export const colourTable = {",
  ];
  forEachObject(colors, ({ key: color }) => {
    const colorName = pascalCase(color);
    code.push(
      `  "${colorName}": ["text-${color}", "bg-${color}", "button-${color}"],`
    );
  });
  code.push("};");
  code.push(`export type ColourName = keyof typeof colourTable;
export type ColourType = "text" | "bg" | "button";
export function lookupColourString(colour: ColourName, type:ColourType): string {
  const entry = colourTable[colour];
  if (!entry) throw new Error("No colour for " + colour);
  switch (type) {
    case "text": return entry[0];
    case "bg": return entry[1];
    case "button": return entry[2];
  }
}  
`);

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
export function lookupColourClassNames(backgroundColour?: ColourName | null, textColour?: ColourName | null): string|undefined {
  if (backgroundColour) {
    const backgroundColourClassName = lookupColourString(backgroundColour, "bg");
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
export function lookupColourClassNames(backgroundColour?: ColourName | null, textColour?: ColourName | null): string|undefined {
  if (backgroundColour) {
    const backgroundColourClassName = lookupColourString(backgroundColour, "bg");
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

  try {
    writeFileSync(colorFile, code.join("\r"));
  } catch {
    // ignore as this could be in linting
  }
}
