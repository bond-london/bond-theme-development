/* eslint-disable react/display-name */
import React, { useMemo } from "react";
import { defaultRenderers } from "./Renderers";
import { RichText } from "./RichText";
import { ClassNameOverrides, RealRTFProps, INodeRenderer } from "./types";

const headingClasses: Array<keyof ClassNameOverrides> = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
];

export const RealRTF: React.FC<RealRTFProps> = ({
  projectClassNameOverrides,
  projectRenderers,
  classNameOverrides,
  className,
  fixedParagraphClassName,
  fixedHeadingClassName,
  renderers,
  ...rest
}) => {
  const realClassNameOverrides = useMemo(() => {
    const result: ClassNameOverrides = {
      ...projectClassNameOverrides,
      ...classNameOverrides,
    };
    const defaultHeadingClassName =
      fixedHeadingClassName || fixedParagraphClassName;
    if (defaultHeadingClassName) {
      headingClasses.forEach(h => (result[h] = defaultHeadingClassName));
    }
    if (fixedParagraphClassName) {
      result.p = fixedParagraphClassName;
    }
    return result;
  }, [
    projectClassNameOverrides,
    classNameOverrides,
    fixedParagraphClassName,
    fixedHeadingClassName,
  ]);

  const realRenderers: INodeRenderer = useMemo(() => {
    return { ...defaultRenderers, ...projectRenderers, ...renderers };
  }, [projectRenderers, renderers]);

  return (
    <div className={className}>
      <RichText
        {...rest}
        classNameOverrides={realClassNameOverrides}
        renderers={realRenderers}
      />
    </div>
  );
};
