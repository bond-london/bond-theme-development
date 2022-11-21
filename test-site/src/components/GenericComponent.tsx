import { Section } from "@bond-london/gatsby-theme";
import React from "react";
import { lookupColourClassNames } from "../colors";
import { Icon } from "../elements/Icon";
import { SectionBody } from "./SectionBody";
import { SectionHeading } from "./SectionHeading";

export const GenericComponent: React.FC<{
  fragment: Queries.CmsComponentFragment;
  unknown?: boolean;
}> = ({
  fragment: {
    heading,
    componentType,
    showHeading,
    preHeading,
    postHeading,
    body,
    links,
    backgroundColour,
    textColour,
    image,
    icon,
    animation,
    video,
  },
}) => {
  return (
    <Section
      componentName={componentType}
      className={lookupColourClassNames(backgroundColour, textColour)}
    >
      {showHeading && (
        <SectionHeading
          preHeading={preHeading}
          heading={heading}
          postHeading={postHeading}
        />
      )}
      {body && <SectionBody body={body} />}
    </Section>
  );
};
