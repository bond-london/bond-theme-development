import { BondVisual, IBondVisual, Section } from "@bond-london/gatsby-theme";
import { IRichTextInformation } from "@bond-london/graphcms-rich-text";
import classNames from "classnames";
import React from "react";
import { ColourName, lookupColourClassNames } from "../colors";
import { IComponentInformation } from "./GenericComponent";
import { ILinkInformation } from "./LinkOrButton";
import { RTF } from "./RTF";
import { SectionLinks } from "./SectionLinks";

const HeroBackground: React.FC<{ visual: IBondVisual }> = ({ visual }) => {
  return (
    <BondVisual
      visual={visual}
      autoPlay={true}
      muted={true}
      loop={true}
      className="relative col-span-full row-span-full"
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
    <div className="col-span-full flex flex-col gap-y-xs tablet:col-span-4 tablet:col-start-2 laptop:col-span-6 laptop:col-start-2 self-center">
      {preHeading && <p className="h3">{preHeading}</p>}
      {heading && <h1 className="h1">{heading}</h1>}
      {postHeading && <p className="h4">{postHeading}</p>}
      {links && <SectionLinks links={links} />}
      {body && <RTF content={body} />}
    </div>
  );
};

export const Hero: React.FC<{
  preHeading?: string | null;
  heading?: string | null;
  postHeading?: string | null;
  body?: IRichTextInformation;
  links?: ReadonlyArray<ILinkInformation>;
  visual?: IBondVisual | undefined;
  backgroundColour?: ColourName | null;
  textColour?: ColourName | null;
}> = ({
  visual,
  preHeading,
  heading,
  postHeading,
  body,
  links,
  backgroundColour,
  textColour,
}) => (
  <Section
    sectionClassName={classNames(
      "h-[80vh] tablet:h-[70vh] laptop:h-[60vh] w-full pointer-events-none",
      lookupColourClassNames(backgroundColour, textColour),
      "bond-row-1-l bond-row-6-l"
    )}
    componentName="Section Hero"
    preChildren={visual && <HeroBackground visual={visual} />}
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

// eslint-disable-next-line import/no-unused-modules
export const SectionHero: React.FC<{
  information: IComponentInformation;
}> = ({
  information: {
    visual,
    preHeading,
    heading,
    postHeading,
    body,
    links,
    backgroundColour,
    textColour,
  },
}) => (
  <Hero
    visual={visual}
    preHeading={preHeading}
    heading={heading}
    postHeading={postHeading}
    body={body}
    links={links}
    textColour={textColour}
    backgroundColour={backgroundColour}
  />
);
