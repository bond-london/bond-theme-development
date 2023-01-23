import { Section } from "@bond-london/gatsby-theme";
import { ClassNameOverrides } from "@bond-london/graphcms-rich-text";
import classNames from "classnames";
import React from "react";
import { lookupColourClassNames } from "../colors";
import { SectionBodyClassName, SectionSpacingClassName } from "../styles";
import { IComponentInformation } from "./GenericComponent";
import { defaultProjectClassNameOverrides } from "./RTF";
import { SectionBody } from "./SectionBody";
import { SectionHeading } from "./SectionHeading";
import { SectionIcon } from "./SectionIcon";
import { SectionLinks } from "./SectionLinks";
import { SectionVisual } from "./SectionVisual";

// eslint-disable-next-line camelcase
type TextFormatNames = Queries.GraphCMS_ComponentType;

type TextFormatLookup = {
  [Name in TextFormatNames]?: ClassNameOverrides;
};

const textFormatClassNameOverrides: TextFormatLookup = {
  FormattedText: {
    ...defaultProjectClassNameOverrides,
    h2: "h2 mb-xs",
    h3: "h3 mb-xs",
    h4: "h4 mb-xs",
    div: "p2",
  },
};

export const TextComponent: React.FC<{
  information: IComponentInformation;
  format: TextFormatNames;
}> = ({ information, format }) => {
  const {
    anchor,
    backgroundColour,
    textColour,
    preHeading,
    heading,
    postHeading,
    body,
    icon,
    visual,
    links,
  } = information;
  const projectClassNameOverrides = textFormatClassNameOverrides[format];
  return (
    <Section
      id={anchor || undefined}
      componentName={`Text Component: ${format}`}
      sectionClassName={classNames(
        lookupColourClassNames(backgroundColour, textColour),
        SectionSpacingClassName
      )}
      contentClassName="grid grid-cols-1 laptop:mx-laptop-1-gap-cols gap-y-xs laptop:gap-y-s"
    >
      <SectionHeading
        preHeading={preHeading}
        heading={heading}
        postHeading={postHeading}
      />
      {visual && <SectionVisual visual={visual} />}
      {body && (
        <SectionBody
          content={body}
          projectClassNameOverrides={projectClassNameOverrides}
        />
      )}
      {icon && <SectionIcon icon={icon} className={SectionBodyClassName} />}
      {links && <SectionLinks links={links} />}
    </Section>
  );
};
