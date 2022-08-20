import { ClassNameOverrides } from "../types";

export function calculateClassName(
  key: keyof JSX.IntrinsicElements,
  classNameOverrides?: ClassNameOverrides,
  additionalClassName?: string,
  className?: string
): string | undefined {
  const overridden = classNameOverrides?.[key];
  if (overridden) {
    return overridden;
  }

  if (additionalClassName && className) {
    return `${additionalClassName} ${className}`;
  }
  if (additionalClassName) {
    return additionalClassName;
  }
  return className;
}
