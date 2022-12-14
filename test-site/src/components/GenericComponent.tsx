import { IBondImage, IBondVisual, Section } from "@bond-london/gatsby-theme";
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
  name: string;
  preHeading?: string | null;
  heading?: string | null;
  postHeading?: string | null;
  body?: IRichTextInformation;
  backgroundColour?: ColourName | null;
  textColour?: ColourName | null;
  icon?: IBondImage;
  visual?: IBondVisual;
  links?: ReadonlyArray<ILinkInformation>;
}

export const GenericComponent: React.FC<{
  information: IComponentInformation;
  componentType: string;
  unknown?: boolean;
}> = ({
  componentType,
  unknown,
  information: {
    heading,
    preHeading,
    postHeading,
    body,
    links,
    visual,
    backgroundColour,
    textColour,
    icon,
  },
}) => {
  return (
    <Section
      componentName={`${componentType} component`}
      sectionClassName={classNames(
        lookupColourClassNames(backgroundColour, textColour),
        unknown && "border-2 border-yellow"
      )}
    >
      <SectionHeading
        preHeading={preHeading}
        heading={heading}
        postHeading={postHeading}
      />
      {body && <SectionBody content={body} />}
      {icon && <SectionIcon icon={icon} className={SectionBodyClassName} />}
      {visual && <SectionVisual visual={visual} />}
      {links && <SectionLinks links={links} />}
    </Section>
  );
};
