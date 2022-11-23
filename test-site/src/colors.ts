/* eslint-disable */import classNames from "classnames";export const colourTable = {  "Transparent": ["text-transparent", "bg-transparent"],  "Current": ["text-current", "bg-current"],  "Black": ["text-black", "bg-black"],  "Grey": ["text-grey", "bg-grey"],  "Gray": ["text-gray", "bg-gray"],  "White": ["text-white", "bg-white"],  "Green": ["text-green", "bg-green"],  "GreenHover": ["text-green-hover", "bg-green-hover"],  "Blue": ["text-blue", "bg-blue"],  "BlueHover": ["text-blue-hover", "bg-blue-hover"],  "Red": ["text-red", "bg-red"],  "Yellow": ["text-yellow", "bg-yellow"],  "Error": ["text-error", "bg-error"],};export type ColourName = keyof typeof colourTable;
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
export const colourOpposites= {  "Black": "White",  "White": "Black",  "Green": "Blue",  "Blue": "Green",  "Red": "Yellow",  "Yellow": "Red",};
export type OppositeName = keyof typeof colourOpposites;
export function lookupOpposite(colour: ColourName): ColourName {
  const entry = colourOpposites[colour as OppositeName];
  if (!entry) throw new Error("No opposite for " + colour);
  return entry as ColourName;      
}
    
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
