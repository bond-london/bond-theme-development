import { BondVisual, Section } from "@bond-london/gatsby-theme";
import { IComponentInformation } from "./GenericComponent";
import { lookupColourClassNames } from "@colors";
import React from "react";
import { SectionBody } from "./SectionBody";
import { SectionHeading } from "./SectionHeading";
import { SectionIcon } from "./SectionIcon";
import { SectionVisual } from "./SectionVisual";
import { ILinkInformation, SimpleLink } from "./LinkOrButton";

const LinkSummary: React.FC<{ link: ILinkInformation }> = ({ link }) => {
  const { topContent, name } = link;

  return (
    <SimpleLink link={link} className="flex flex-col gap-y-xs laptop:gap-y-s">
      {topContent?.visual && (
        <BondVisual
          visual={topContent.visual}
          sizes="(max-width: 1023px): 90vw, 45vw"
          simple={true}
        />
      )}
      <h3 className="p2">
        {topContent?.heading ?? name}&nbsp;
        {topContent?.postHeading && (
          <span className="lighter">{topContent.postHeading}</span>
        )}
      </h3>
    </SimpleLink>
  );
};

// eslint-disable-next-line import/no-unused-modules
const ArticleLinks: React.FC<{ information: IComponentInformation }> = ({
  information: {
    backgroundColour,
    textColour,
    links,
    internalReferences,
    heading,
    preHeading,
    postHeading,
    body,
    icon,
    visual,
  },
}) => {
  return (
    <Section
      componentName="Article links"
      contentClassName="grid grid-cols-1 mb-s"
      sectionClassName={lookupColourClassNames(backgroundColour, textColour)}
    >
      <SectionHeading
        className="col-span-full my-xxs"
        preHeading={preHeading}
        headingFontClassName="h2"
        heading={heading}
        postHeading={postHeading}
      />
      {body && <SectionBody content={body} className="col-span-full" />}
      {icon && <SectionIcon icon={icon} />}
      {visual && <SectionVisual visual={visual} className="col-span-full" />}
      <div className="grid grid-cols-1 tablet:grid-cols-2 grid-gap gap-y-s mt-s">
        {links?.map((link) => <LinkSummary key={link.id} link={link} />)}
        {internalReferences?.map((link) => (
          <LinkSummary key={link.id} link={link} />
        ))}
      </div>
    </Section>
  );
};

export default ArticleLinks;
