import { BondVisual, Section } from "@bond-london/gatsby-theme";
import { ClassNameOverrides } from "@bond-london/graphcms-rich-text";
import classNames from "classnames";
import React from "react";
import { lookupColourClassNames } from "../colors";
import { SectionSpacingClassName } from "../styles";
import { IComponentInformation } from "./GenericComponent";
import { defaultProjectClassNameOverrides } from "./RTF";
import { SectionBody } from "./SectionBody";
import { SectionHeading } from "./SectionHeading";
import { SectionLinks } from "./SectionLinks";

const projectClassNameOverrides: ClassNameOverrides = {
  ...defaultProjectClassNameOverrides,
  div: "p2",
};
export const Banner: React.FC<{
  information: IComponentInformation;
  isGrey?: boolean | null;
}> = ({
  information: {
    anchor,
    heading,
    body,
    visual,
    links,
    postHeading,
    preHeading,
    textColour,
    backgroundColour,
  },
  isGrey,
}) => {
  return (
    <Section
      id={anchor || undefined}
      componentName="Banner"
      sectionClassName={classNames(
        SectionSpacingClassName,
        lookupColourClassNames(backgroundColour, textColour)
      )}
      sectionColumnsClassName="relative col-start-2 col-span-1"
      contentClassName="flex flex-col gap-xs laptop:mx-laptop-2-gap-cols justify-center"
      preChildren={
        visual && (
          <BondVisual
            visual={visual}
            autoPlay={true}
            muted={true}
            loop={true}
            style={
              isGrey ? { filter: "saturate(0) brightness(50%)" } : undefined
            }
            className="relative col-span-full row-span-full aspect-w-4 aspect-h-5 tablet:aspect-w-16 tablet:aspect-h-7"
          />
        )
      }
    >
      <SectionHeading
        preHeading={preHeading}
        heading={heading}
        postHeading={postHeading}
        className="text-left"
      />
      {body && (
        <SectionBody
          content={body}
          projectClassNameOverrides={projectClassNameOverrides}
        />
      )}
      {links && <SectionLinks links={links} />}
    </Section>
  );
};
