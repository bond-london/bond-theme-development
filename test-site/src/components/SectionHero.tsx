import { BondVisual, IBondVisual, Section } from "@bond-london/gatsby-theme";
import { IRichTextInformation } from "@bond-london/graphcms-rich-text";
import classNames from "classnames";
import React from "react";
import { ColourName, lookupColourClassNames } from "../colors";
import { IComponentInformation } from "./GenericComponent";
import { ILinkInformation } from "./LinkOrButton";
import { RTF } from "./RTF";
import { SectionLinks } from "./SectionLinks";

const HeroBackground: React.FC<{
  visual: IBondVisual;
  isGrey?: boolean | null;
}> = ({ visual, isGrey }) => {
  return (
    <BondVisual
      visual={visual}
      autoPlay={true}
      muted={true}
      loop={true}
      className="!absolute left-0 top-0 right-0 bottom-0"
      style={isGrey ? { filter: "saturate(0) brightness(50%)" } : undefined}
    />
  );
};

const HeroText: React.FC<{
  preHeading?: string | null;
  heading?: string | null;
  postHeading?: string | null;
  body?: IRichTextInformation;
  links?: ReadonlyArray<ILinkInformation>;
}> = ({ preHeading, heading, postHeading, body, links }) => {
  if (!(preHeading || heading || postHeading || links || body)) {
    return null;
  }

  return (
    <>
      {preHeading && <p className="h3">{preHeading}</p>}
      {heading && <h1 className="h1">{heading}</h1>}
      {postHeading && <p className="h4">{postHeading}</p>}
      {links && <SectionLinks links={links} />}
      {body && <RTF content={body} />}
    </>
  );
};

export const Hero: React.FC<{
  anchor?: string | null;
  preHeading?: string | null;
  heading?: string | null;
  postHeading?: string | null;
  body?: IRichTextInformation;
  links?: ReadonlyArray<ILinkInformation>;
  visual?: IBondVisual | undefined;
  backgroundColour?: ColourName | null;
  textColour?: ColourName | null;
  isGrey?: boolean | null;
}> = ({
  anchor,
  visual,
  preHeading,
  heading,
  postHeading,
  body,
  links,
  backgroundColour,
  textColour,
  isGrey,
}) => (
  <Section
    sectionClassName={classNames(
      "h-[80vh] tablet:h-[70vh] laptop:h-auto w-full pointer-events-none",
      lookupColourClassNames(backgroundColour, textColour),
      "laptop:bond-row-1-xl laptop:bond-row-6-xl"
    )}
    id={anchor || undefined}
    componentName="Section Hero"
    preChildren={visual && <HeroBackground visual={visual} isGrey={isGrey} />}
    sectionColumnsClassName="col-start-2 col-span-1 laptop:ml-laptop-1-gap-cols laptop:mr-laptop-5-gap-cols"
    contentClassName="relative flex flex-col gap-y-xs self-center"
  >
    <HeroText
      preHeading={preHeading}
      heading={heading}
      postHeading={postHeading}
      body={body}
      links={links}
    />
  </Section>
);

export const SectionHero: React.FC<{
  information: IComponentInformation;
  isGrey?: boolean | null;
}> = ({
  information: {
    anchor,
    visual,
    preHeading,
    heading,
    postHeading,
    body,
    links,
    backgroundColour,
    textColour,
  },
  isGrey,
}) => (
  <Hero
    anchor={anchor}
    visual={visual}
    preHeading={preHeading}
    heading={heading}
    postHeading={postHeading}
    body={body}
    links={links}
    textColour={textColour}
    backgroundColour={backgroundColour}
    isGrey={isGrey}
  />
);
