import { IBondVisual, Section } from "@bond-london/gatsby-theme";
import { IRichTextInformation } from "@bond-london/graphcms-rich-text";
import { ColourName, lookupColourClassNames } from "@colors";
import classNames from "classnames";
import React from "react";
import { ILinkInformation } from "./LinkOrButton";
import { SectionBody } from "./SectionBody";
import { SectionHeading } from "./SectionHeading";
import { SectionIcon } from "./SectionIcon";
import { SectionLinks } from "./SectionLinks";
import { SectionVisual } from "./SectionVisual";

export interface ICoreComponent {
  id: string;
  name: string;
  preHeading?: string | null;
  heading?: string | null;
  postHeading?: string | null;
  backgroundColour?: ColourName | null;
  textColour?: ColourName | null;
  visual?: IBondVisual;
}
export interface IContentComponent extends ICoreComponent {
  anchor: string | null;
  body?: IRichTextInformation;
  icon?: IBondVisual;
  links?: ReadonlyArray<ILinkInformation>;
  internalReferences?: ReadonlyArray<ILinkInformation>;
  index: number;
  isFirst: boolean;
  isLast: boolean;
}
export interface IComponentInformation extends IContentComponent {
  contents?: ReadonlyArray<IContentComponent>;
}

export const GenericComponentInside: React.FC<{
  information: IComponentInformation;
}> = ({
  information: {
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
    <>
      <SectionHeading
        preHeading={preHeading}
        heading={heading}
        postHeading={postHeading}
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
        <SectionLinks links={internalReferences} vertical={false} />
      )}
    </>
  );
};

export const GenericComponent: React.FC<{
  information: IComponentInformation;
  componentType: string;
  unknown?: boolean;
}> = ({ componentType, unknown, information }) => {
  const { backgroundColour, textColour } = information;
  return (
    <Section
      information={information}
      componentName={`${componentType} component`}
      sectionClassName={classNames(
        "overflow-hidden",
        lookupColourClassNames(backgroundColour, textColour),
        unknown && "unknown-component",
      )}
    >
      <GenericComponentInside information={information} />
    </Section>
  );
};
