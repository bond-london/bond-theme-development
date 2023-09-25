import { IBondVisual, Section } from "@bond-london/gatsby-theme";
import { IRichTextInformation } from "@bond-london/graphcms-rich-text";
import { ColourName, lookupColourClassNames } from "@colors";
import classNames from "classnames";
import React from "react";
import { HeroBackground } from "./HeroBackground";
import { HeroText } from "./HeroText";
import { ILinkInformation } from "./LinkOrButton";

export const SimpleHero: React.FC<{
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
  index: number;
  isFirst: boolean;
  isLast: boolean;
}> = (props) => {
  const {
    visual,
    preHeading,
    heading,
    postHeading,
    body,
    links,
    backgroundColour,
    textColour,
    isGrey,
  } = props;
  return (
    <Section
      sectionClassName={classNames(
        lookupColourClassNames(backgroundColour, textColour),
        "h-[80vh] tablet:h-[70vh] laptop:h-auto w-full laptop:bond-row-1-xl laptop:bond-row-6-xl",
      )}
      componentName="Section Hero"
      information={props}
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
};
