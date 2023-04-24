import { IBondVisual, Section } from "@bond-london/gatsby-theme";
import { IRichTextInformation } from "@bond-london/graphcms-rich-text";
import classNames from "classnames";
import React from "react";
import { ColourName, lookupColourClassNames } from "../colors";
import { SectionBodyClassName } from "../styles";
import { ILinkInformation } from "./LinkOrButton";
import { SectionBody } from "./SectionBody";
import { SectionHeading } from "./SectionHeading";
import { SectionIcon } from "./SectionIcon";
import { SectionLinks } from "./SectionLinks";
import { SectionVisual } from "./SectionVisual";

export interface IComponentInformation {
  id: string;
  name: string;
  anchor: string | null;
  preHeading?: string | null;
  heading?: string | null;
  postHeading?: string | null;
  body?: IRichTextInformation;
  backgroundColour?: ColourName | null;
  textColour?: ColourName | null;
  icon?: IBondVisual;
  visual?: IBondVisual;
  links?: ReadonlyArray<ILinkInformation>;
}

export const GenericComponentInside: React.FC<{
  information: IComponentInformation;
}> = ({
  information: { heading, preHeading, postHeading, body, links, visual, icon },
}) => {
  return (
    <>
      <SectionHeading
        preHeading={preHeading}
        heading={heading}
        postHeading={postHeading}
      />
      {body && <SectionBody content={body} />}
      {icon && <SectionIcon icon={icon} className={SectionBodyClassName} />}
      {visual && <SectionVisual visual={visual} autoPlay={true} />}
      {links && <SectionLinks links={links} vertical={false} />}
    </>
  );
};

export const GenericComponent: React.FC<{
  information: IComponentInformation;
  componentType: string;
  unknown?: boolean;
}> = ({ componentType, unknown, information }) => {
  const { anchor, backgroundColour, textColour } = information;
  return (
    <Section
      id={anchor || undefined}
      componentName={`${componentType} component`}
      sectionClassName={classNames(
        "overflow-hidden",
        lookupColourClassNames(backgroundColour, textColour),
        unknown && "unknown-component"
      )}
    >
      <GenericComponentInside information={information} />
    </Section>
  );
};
