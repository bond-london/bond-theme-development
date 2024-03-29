import { CSSRuleObject, KeyValuePair } from "tailwindcss/types/config";

export const remSize = 16;

export const rounding = 1000;

export function round(value: number): number {
  const rounded = Math.floor(value * rounding) / rounding;
  return rounded;
}

export function calculateRemSize(pixels: number): string {
  const rems = pixels / remSize;
  const rounded = round(rems);
  return `${rounded}rem`;
}

export function calculateVwSize(widthPixels: number, pixels: number): string {
  const vw = (pixels / widthPixels) * 100;
  const rounded = round(vw);
  return `${rounded}vw`;
}

export function defaultKeyFn(value: string | number): string {
  return `${value}`;
}

export function remValueFn(value: number): string {
  return `${calculateRemSize(value)}`;
}

export type KeyFunction<T> = (key: T) => string;
export type ValueFunction<V, R = string> = (value: V) => R;
export type ConfigurationFunction<V> = (value: V) => CSSRuleObject;
export type FilterFunction<V> = (entry: { key: string; value: V }) => boolean;
export type EntryFunction<V, R> = (entry: {
  key: string;
  value: V;
  index: number;
}) => R;

export function mapNumbers(
  numbers: Array<number>,
  keyFn: KeyFunction<number>,
  valueFn: ValueFunction<number>,
): CSSRuleObject {
  const result: CSSRuleObject = {};
  numbers.forEach(i => {
    result[keyFn(i)] = valueFn(i);
  });
  return result;
}

export function mapObject<V>(
  obj: Record<string, V>,
  keyFn: KeyFunction<string>,
  valueFn: ValueFunction<V>,
  filterFn?: FilterFunction<V>,
): KeyValuePair<string, string> {
  const results: KeyValuePair<string, string> = {};
  forEachObject(
    obj,
    ({ key, value }) => {
      results[keyFn(key)] = valueFn(value);
    },
    filterFn,
  );
  return results;
}

export function forEachObject<V, R>(
  obj: Record<string, V>,
  entryFn: EntryFunction<V, R>,
  filterFn?: FilterFunction<V>,
): void {
  Object.entries(obj).forEach(([key, value], index) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const entry = { key, value, index };
    if (!filterFn || filterFn(entry)) {
      entryFn(entry);
    }
  });
}

export function createApplyEntry(classes: Array<string>): CSSRuleObject {
  const nameEntry: CSSRuleObject = {};
  nameEntry[`@apply ${classes.join(" ")}`] = {};
  return nameEntry;
}

export function calculateNumbers(
  min: number,
  max: number,
  keyFn: KeyFunction<number>,
  valueFn: ValueFunction<number>,
  by = 1,
): CSSRuleObject {
  const result: CSSRuleObject = {};
  for (let i = min; i <= max; i += by) {
    result[keyFn(i)] = valueFn(i);
  }
  return result;
}

export function calculateNumbersMap(
  min: number,
  max: number,
  keyFn: KeyFunction<number>,
  valueFn: ValueFunction<number, CSSRuleObject>,
  by = 1,
): CSSRuleObject {
  const result: CSSRuleObject = {};
  for (let i = min; i <= max; i += by) {
    result[keyFn(i)] = valueFn(i);
  }
  return result;
}

export function unique<T>(values: Array<T>): Set<T> {
  const result = new Set<T>();
  values.forEach(v => result.add(v));
  return result;
}

export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  if (value === null || value === undefined) return false;
  return true;
}
