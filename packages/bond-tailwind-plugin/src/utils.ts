import { ConfigurationMap, ConfigurationObj } from "./plugin";

export const remSize = 16;

export const rounding = 1000;

export function calculateRemSize(pixels: number): string {
  const rems = pixels / remSize;
  const rounded = Math.floor(rems * rounding) / rounding;
  return `${rounded}rem`;
}

export function defaultKeyFn(value: string | number): string {
  return `${value}`;
}

export function remValueFn(value: number): string {
  return `${calculateRemSize(value)}`;
}

export type KeyFunction<T> = (key: T) => string;
export type ValueFunction<V, R = string> = (value: V) => R;
export type ConfigurationFunction<V> = (value: V) => ConfigurationMap;
export type FilterFunction<V> = (entry: { key: string; value: V }) => boolean;
export type EntryFunction<V, R> = (entry: {
  key: string;
  value: V;
  index: number;
}) => R;

export function mapNumbers(
  numbers: Array<number>,
  keyFn: KeyFunction<number>,
  valueFn: ValueFunction<number>
) {
  const result: ConfigurationObj = {};
  numbers.forEach(i => {
    result[keyFn(i)] = valueFn(i);
  });
  return result;
}

export function mapObject<V>(
  obj: { [key: string]: V },
  keyFn: KeyFunction<string>,
  valueFn: ValueFunction<V>,
  filterFn?: FilterFunction<V>
) {
  const results: ConfigurationObj = {};
  forEachObject(
    obj,
    ({ key, value }) => {
      results[keyFn(key)] = valueFn(value);
    },
    filterFn
  );
  return results;
}

export function forEachObject<V, R>(
  obj: { [key: string]: V },
  entryFn: EntryFunction<V, R>,
  filterFn?: FilterFunction<V>
) {
  Object.entries(obj).forEach(([key, value], index) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const entry = { key, value, index };
    if (!filterFn || filterFn(entry)) {
      entryFn(entry);
    }
  });
}

export function createApplyEntry(classes: Array<string>): ConfigurationMap {
  const nameEntry: ConfigurationMap = {};
  nameEntry[`@apply ${classes.join(" ")}`] = {};
  return nameEntry;
}

export function calculateNumbers(
  min: number,
  max: number,
  keyFn: KeyFunction<number>,
  valueFn: ValueFunction<number>,
  by = 1
) {
  const result: ConfigurationObj = {};
  for (let i = min; i <= max; i += by) {
    result[keyFn(i)] = valueFn(i);
  }
  return result;
}

export function calculateNumbersMap(
  min: number,
  max: number,
  keyFn: KeyFunction<number>,
  valueFn: ValueFunction<number, ConfigurationObj>,
  by = 1
) {
  const result: ConfigurationMap = {};
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
