import classNames from "classnames";
import React from "react";
import { SectionHeadingClassName } from "../styles";

export const SectionHeading: React.FC<{
  heading?: string | null;
  preHeading?: string | null;
  postHeading?: string | null;
}> = ({ heading, preHeading, postHeading }) => {
  return (
    <>
      {preHeading && (
        <h3 className={classNames("h3", SectionHeadingClassName)}>
          {preHeading}
        </h3>
      )}
      {heading && (
        <h2 className={classNames("h2", SectionHeadingClassName)}>{heading}</h2>
      )}
      {postHeading && (
        <h3 className={classNames("h3", SectionHeadingClassName)}>
          {postHeading}
        </h3>
      )}
    </>
  );
};
