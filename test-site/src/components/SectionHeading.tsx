import classNames from "classnames";
import React from "react";

export const SectionHeading: React.FC<{
  className?: string;
  heading?: string | null;
  preHeading?: string | null;
  postHeading?: string | null;
  preHeadingFontClassName?: string;
  headingFontClassName?: string;
  postHeadingFontClassName?: string;
}> = ({
  heading,
  preHeading,
  postHeading,
  className = "text-center col-span-full",
  preHeadingFontClassName = "h3",
  headingFontClassName = "h3",
  postHeadingFontClassName = "h3",
}) => {
  if (!(heading || preHeading || postHeading)) return null;
  return (
    <>
      {preHeading && (
        <h3 className={classNames(preHeadingFontClassName, className)}>
          {preHeading}
        </h3>
      )}
      {heading && (
        <h2 className={classNames(headingFontClassName, className)}>
          {heading}
        </h2>
      )}
      {postHeading && (
        <h3 className={classNames(postHeadingFontClassName, className)}>
          {postHeading}
        </h3>
      )}
    </>
  );
};
