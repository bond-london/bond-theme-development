import tailwindConfig from "../tailwind.config.json";

type SizeName = keyof typeof tailwindConfig.sizes;
type SizeMap = Partial<Record<SizeName, string | number>>;

interface SizeInformation {
  breakpoint?: number;
  margin?: number;
  gap?: number;
  cols?: number;
  max?: number;
}

interface FontTableEntry extends SizeMap {
  font?: string;
  default: number | string;
  weight: string;
}

function mapObject<T, K = string>(o: Record<string, T>) {
  return Object.entries(o).map(([key, value]) => ({
    key: key as unknown as K,
    value,
  }));
}

export const sizes = mapObject<SizeInformation, SizeName>(tailwindConfig.sizes);
export const fontTable = mapObject<FontTableEntry>(tailwindConfig.fontTable);
export const colours = mapObject(tailwindConfig.colorOptions);
