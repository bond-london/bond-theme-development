import { ClassNameOverrides } from "../types";

function simpleClassNames(...classNames: Array<unknown>): string | undefined {
  const result = classNames.filter(c => typeof c === "string").join(" ");
  if (result) return result;
  return undefined;
}

export function calculateClassName(
  key: keyof JSX.IntrinsicElements,
  classNameOverrides?: ClassNameOverrides,
  additionalClassName?: string,
  className?: string
): string | undefined {
  const overridden = classNameOverrides?.[key];
  return simpleClassNames(overridden, additionalClassName, className);
}
