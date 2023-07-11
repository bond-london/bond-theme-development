import { PluginAPI } from "tailwindcss/types/config";

type variantFunction = (
  name: string,
  definition: (a: {
    separator: string;
    modifySelectors: (a: (a: { className: string }) => string) => string;
  }) => string,
) => void;

export function addExtraVariants({ addVariant, e }: PluginAPI): void {
  (addVariant as variantFunction)(
    "not-first",
    ({ separator, modifySelectors }) =>
      modifySelectors(
        ({ className }) =>
          `.${e(`not-first${separator}${className}`)}:not(:first-child)`,
      ),
  );
  (addVariant as variantFunction)(
    "not-last",
    ({ modifySelectors, separator }) =>
      modifySelectors(
        ({ className }) =>
          `.${e(`not-last${separator}${className}`)}:not(:last-child)`,
      ),
  );
}
