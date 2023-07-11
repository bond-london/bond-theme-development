import { IBondVisual } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import React from "react";
import { SimpleLink } from "./LinkOrButton";
import { SectionHeading } from "./SectionHeading";
import { SectionIcon } from "./SectionIcon";

export const HeadingAndIcon: React.FC<{
  id: string;
  heading?: string | null;
  preHeading?: string | null;
  postHeading?: string | null;
  icon?: IBondVisual;
  to?: string;
  dynamic?: boolean;
  className?: string;
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
  icon,
  to,
  id,
  dynamic = true,
  className,
  preHeadingFontClassName = "p1",
  headingFontClassName = "h2",
  postHeadingFontClassName = "p1",
  preHeadingElement,
  headingElement,
  postHeadingElement,
}) => {
  if (heading || icon) {
    return (
      <>
        {icon && (
          <SectionIcon
            className={classNames(
              className,
              "col-start-1 row-start-1 self-end laptop:justify-self-end",
              dynamic &&
                "mx-mobile-margin tablet:mx-tablet-margin laptop:mx-laptop-margin"
            )}
            icon={icon}
          />
        )}

        {heading && (
          <SimpleLink
            link={to ? { id, internal: to, name: heading } : undefined}
            className={classNames(
              className,
              "col-start-1 flex flex-col justify-end no-underline",
              dynamic &&
                "mx-mobile-margin tablet:mx-tablet-margin laptop:mx-laptop-margin"
            )}
          >
            <SectionHeading
              headingFontClassName={headingFontClassName}
              preHeadingFontClassName={preHeadingFontClassName}
              postHeadingFontClassName={postHeadingFontClassName}
              heading={heading}
              preHeading={preHeading}
              postHeading={postHeading}
              preHeadingElement={preHeadingElement}
              headingElement={headingElement}
              postHeadingElement={postHeadingElement}
            />
          </SimpleLink>
        )}
      </>
    );
  }
  return null;
};
