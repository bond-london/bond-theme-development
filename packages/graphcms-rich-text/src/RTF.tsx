/* eslint-disable react/display-name */
import React from "react";
import { defaultRenderers } from "./Renderers";
import { InternalRichText } from "./RichText";
import { ClassNameOverrides, RealRTFProps } from "./types";

const headingClasses: Array<keyof ClassNameOverrides> = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
];

function calculateClassNameOverrides(
  projectClassNameOverrides: ClassNameOverrides | undefined,
  classNameOverrides: ClassNameOverrides | undefined,
  fixedHeadingClassName: string | undefined,
  fixedParagraphClassName: string | undefined,
): ClassNameOverrides {
  const result: ClassNameOverrides = {
    ...projectClassNameOverrides,
    ...classNameOverrides,
  };
  const defaultHeadingClassName =
    fixedHeadingClassName ?? fixedParagraphClassName;
  if (defaultHeadingClassName) {
    headingClasses.forEach(h => (result[h] = defaultHeadingClassName));
  }
  if (fixedParagraphClassName) {
    result.p = fixedParagraphClassName;
  }
  return result;
}

export const RealRTF: React.FC<RealRTFProps> = ({
  projectClassNameOverrides,
  projectRenderers,
  classNameOverrides,
  className,
  fixedParagraphClassName,
  fixedHeadingClassName,
  renderers,
  style,
  ...rest
}) => {
  const realClassNameOverrides = calculateClassNameOverrides(
    projectClassNameOverrides,
    classNameOverrides,
    fixedHeadingClassName,
    fixedParagraphClassName,
  );
  const realRenderers = {
    ...defaultRenderers,
    ...projectRenderers,
    ...renderers,
  };

  return (
    <div className={className} style={style}>
      <InternalRichText
        {...rest}
        classNameOverrides={realClassNameOverrides}
        renderers={realRenderers}
      />
    </div>
  );
};
