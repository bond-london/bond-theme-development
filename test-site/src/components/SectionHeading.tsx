import classNames from "classnames";
import React from "react";
import { convertText } from "@/utils";

export const SectionHeading: React.FC<{
  className?: string;
  heading?: string | null;
  preHeading?: string | null;
  postHeading?: string | null;
  preHeadingFontClassName?: string;
  headingFontClassName?: string;
  postHeadingFontClassName?: string;
  preHeadingElement?: keyof JSX.IntrinsicElements;
  headingElement?: keyof JSX.IntrinsicElements;
  postHeadingElement?: keyof JSX.IntrinsicElements;
}> = ({
  heading,
  preHeading,
  postHeading,
  className,
  preHeadingFontClassName = "h2",
  headingFontClassName = "h1",
  postHeadingFontClassName = "h2",
  headingElement: HeadingElement = "h2",
  preHeadingElement: PreHeadingElement = "h3",
  postHeadingElement: PostHeadingElement = "h3",
}) => {
  if (!(heading || preHeading || postHeading)) return null;
  return (
    <>
      {preHeading && (
        <PreHeadingElement
          className={classNames(preHeadingFontClassName, className)}
        >
          {convertText(preHeading)}
        </PreHeadingElement>
      )}
      {heading && (
        <HeadingElement className={classNames(headingFontClassName, className)}>
          {convertText(heading)}
        </HeadingElement>
      )}
      {postHeading && (
        <PostHeadingElement
          className={classNames(postHeadingFontClassName, className)}
        >
          {convertText(postHeading)}
        </PostHeadingElement>
      )}
    </>
  );
};
