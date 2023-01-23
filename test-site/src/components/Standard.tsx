import { Section } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import React from "react";
import { lookupColourClassNames } from "../colors";
import { SectionSpacingClassName } from "../styles";
import { IComponentInformation } from "./GenericComponent";
import { SectionBody } from "./SectionBody";
import { SectionHeading } from "./SectionHeading";
import { SectionIcon } from "./SectionIcon";
import { SectionLinks } from "./SectionLinks";
import { SectionVisual } from "./SectionVisual";

export const Standard: React.FC<{
  information: IComponentInformation;
}> = ({ information }) => {
  const {
    anchor,
    backgroundColour,
    textColour,
    preHeading,
    heading,
    postHeading,
    body,
    icon,
    visual,
    links,
  } = information;
  return (
    <Section
      id={anchor || undefined}
      componentName="Standard"
      sectionClassName={classNames(
        lookupColourClassNames(backgroundColour, textColour),
        SectionSpacingClassName
      )}
      sectionColumnsClassName="col-start-2 col-span-1 grid grid-cols-1 gap-y-xs justify-items-center"
    >
      <SectionHeading
        preHeading={preHeading}
        heading={heading}
        postHeading={postHeading}
      />
      {body && (
        <SectionBody
          content={body}
          className="laptop:mx-laptop-1-gap-cols gap-y-xs text-center"
        />
      )}
      {icon && <SectionIcon icon={icon} />}
      {visual && <SectionVisual visual={visual} />}
      {links && <SectionLinks links={links} vertical={false} />}
    </Section>
  );
};
