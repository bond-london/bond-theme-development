import { BondVisual, Section } from "@bond-london/gatsby-theme";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import classNames from "classnames";
import React from "react";
import { lookupColourClassNames } from "../colors";
import { IComponentInformation } from "../components/GenericComponent";
import { SectionBody } from "../components/SectionBody";
import { SectionHeading } from "../components/SectionHeading";
import { SectionIcon } from "../components/SectionIcon";
import { SectionLinks } from "../components/SectionLinks";
import { SectionVisual } from "../components/SectionVisual";
import { SectionBodyClassName, SectionSpacingClassName } from "../styles";
import {
  ICollectionInformation,
  isContentComponent,
} from "./GenericCollection";

const SmallCollectionInside: React.FC<{
  information: IComponentInformation;
}> = ({
  information: {
    backgroundColour,
    textColour,
    body,
    preHeading,
    heading,
    postHeading,
    icon,
    visual,
    links,
  },
}) => {
  return (
    <div
      className={classNames(
        lookupColourClassNames(backgroundColour, textColour),
        "flex flex-col gap-xxs self-start"
      )}
    >
      <SectionHeading
        preHeading={preHeading}
        heading={heading}
        postHeading={postHeading}
        className="text-left"
      />
      {body && <SectionBody content={body} contentClassName="flex flex-col" />}
      {icon && <SectionIcon icon={icon} className={SectionBodyClassName} />}
      {visual && <SectionVisual visual={visual} />}
      {links && <SectionLinks links={links} />}
    </div>
  );
};

export const SmallCollection: React.FC<{
  collection: ICollectionInformation;
  isLeft: boolean;
}> = ({
  collection: {
    anchor,
    preHeading,
    heading,
    postHeading,
    contents,
    backgroundColour,
    textColour,
    backgroundVisual,
  },
  isLeft,
}) => {
  return (
    <Section
      id={anchor || undefined}
      componentName={`Small ${isLeft ? "left" : "right"}`}
      sectionClassName={classNames(
        lookupColourClassNames(backgroundColour, textColour),
        SectionSpacingClassName
      )}
      sectionColumnsClassName={classNames(
        "grid col-start-2 col-span-1 grid-cols-1",
        isLeft ? "laptop:grid-cols-small-left" : "laptop:grid-cols-small-right"
      )}
      contentClassName="gap-y-s"
      preChildren={backgroundVisual && <BondVisual visual={backgroundVisual} />}
    >
      <SectionHeading
        className="col-span-full text-left"
        preHeading={preHeading}
        postHeading={postHeading}
        heading={heading}
      />
      {contents?.map((content) =>
        isContentComponent(content) ? (
          <SmallCollectionInside key={content.id} information={content} />
        ) : (
          <Unsupported
            key={content.id}
            component="SmallCollectionContent"
            message="Only components supported"
          />
        )
      )}
    </Section>
  );
};
