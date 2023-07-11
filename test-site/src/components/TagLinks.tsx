import React from "react";
import { Section } from "@bond-london/gatsby-theme";
import {
  GenericComponentInside,
  IComponentInformation,
} from "./GenericComponent";
import { lookupColourClassNames } from "@colors";
import { SectionBody } from "./SectionBody";
import { SectionHeading } from "./SectionHeading";
import { SectionIcon } from "./SectionIcon";
import { SectionLinks } from "./SectionLinks";
import { SectionVisual } from "./SectionVisual";
import { Link } from "gatsby";

const TagLinksComponent: React.FC<{ information: IComponentInformation }> = ({
  information: {
    anchor,
    backgroundColour,
    textColour,
    heading,
    preHeading,
    postHeading,
    body,
    links,
    internalReferences,
    contents,
    visual,
    icon,
  },
}) => {
  return (
    <Section
      componentName="Tag links"
      id={anchor ?? undefined}
      sectionClassName={lookupColourClassNames(backgroundColour, textColour)}
      sectionColumnsClassName="grid col-start-2 laptop:columns-3 grid-gap"
      contentClassName="my-l laptop:my-3xl"
    >
      <SectionHeading
        className="mb-s laptop:mb-unset"
        preHeading={preHeading}
        heading={heading}
        postHeading={postHeading}
        headingFontClassName="h2"
      />
      {body && <SectionBody content={body} />}
      {icon && <SectionIcon icon={icon} />}
      {visual && <SectionVisual visual={visual} />}
      {links && <SectionLinks links={links} vertical={false} />}
      {contents && (
        <div className="col-span-full grid grid-cols-1 laptop:grid-cols-2">
          {contents.map((content) => (
            <div key={content.id}>
              <GenericComponentInside information={content} />
            </div>
          ))}
        </div>
      )}

      {internalReferences && (
        <ul className="laptop:columns-2 grid-gap laptop:col-start-2 laptop:col-span-2 em-dash h2 list-inside laptop:list-outside">
          {internalReferences.map((ir) => (
            <li key={ir.id} className="lighter">
              <Link to={ir.internal!}>{ir.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
};

export default TagLinksComponent;
