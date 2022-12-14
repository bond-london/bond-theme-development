import { BondVisual, IBondVisual, Section } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import React from "react";
import { ColourName, lookupColourClassNames } from "../colors";
import { ILinkInformation } from "./LinkOrButton";
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
  preHeader?: string;
  header?: string;
  postHeader?: string;
  links?: ReadonlyArray<ILinkInformation>;
}> = ({ preHeader, header, postHeader, links }) => {
  if (preHeader || header || postHeader || links) {
    return (
      <div className="col-span-full flex flex-col gap-y-xs self-end tablet:col-span-4 tablet:col-start-2 laptop:col-span-6 laptop:col-start-3">
        {preHeader && <p className="h3 text-center">{preHeader}</p>}
        {header && <h1 className="h1 text-center">{header}</h1>}
        {postHeader && <p className="h4 text-center">{postHeader}</p>}
        {links && <SectionLinks links={links} />}
      </div>
    );
  }
  return null;
};

export const SectionHero: React.FC<{
  visual?: IBondVisual;
  preHeader?: string;
  header?: string;
  postHeader?: string;
  links?: ReadonlyArray<ILinkInformation>;
  backgroundColour: ColourName | null;
  textColour: ColourName | null;
}> = ({
  visual,
  preHeader,
  header,
  postHeader,
  links,
  backgroundColour,
  textColour,
}) => {
  return (
    <Section
      sectionClassName={classNames(
        "h-[80vh] tablet:h-[70vh] laptop:h-[60vh] w-full pointer-events-none",
        lookupColourClassNames(backgroundColour, textColour)
      )}
      componentName="Section Hero"
      preChildren={visual && <HeroBackground visual={visual} />}
    >
      <HeroText
        preHeader={preHeader}
        header={header}
        postHeader={postHeader}
        links={links}
      />
    </Section>
  );
};
