import { Section } from "@bond-london/gatsby-theme";
import { ClassNameOverrides } from "@bond-london/graphcms-rich-text";
import classNames from "classnames";
import React from "react";
import { lookupColourClassNames } from "@colors";
import { SectionBodyClassName, SectionSpacingClassName } from "@/styles";
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
  },
};

const Text: React.FC<{
  information: IComponentInformation;
  format: TextFormatNames;
  index?: number;
}> = ({ information, format, index }) => {
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
        SectionSpacingClassName,
      )}
    >
      <div className="col-span-full grid grid-cols-1 gap-y-xs tablet:col-span-6 tablet:col-start-2 laptop:col-span-6 laptop:col-start-4 laptop:gap-y-s">
        <SectionHeading
          preHeading={preHeading}
          heading={heading}
          postHeading={postHeading}
          className="col-span-full text-left"
          headingElement={index === 0 ? "h1" : "h2"}
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
      </div>{" "}
    </Section>
  );
};

export default Text;
