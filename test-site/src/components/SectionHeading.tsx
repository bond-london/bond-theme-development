import classNames from "classnames";
import React from "react";
import { SectionHeadingClassName } from "../styles";

export const SectionHeading: React.FC<{
  className?: string;
  heading?: string | null;
  preHeading?: string | null;
  postHeading?: string | null;
}> = ({
  heading,
  preHeading,
  postHeading,
  className = SectionHeadingClassName,
}) => {
  if (!(heading || preHeading || postHeading)) return null;
  return (
    <>
      {preHeading && (
        <h3 className={classNames("h3", className)}>{preHeading}</h3>
      )}
      {heading && <h2 className={classNames("h2", className)}>{heading}</h2>}
      {postHeading && (
        <h3 className={classNames("h3", className)}>{postHeading}</h3>
      )}
    </>
  );
};
