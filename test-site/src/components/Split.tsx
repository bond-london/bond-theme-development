import { Section } from "@bond-london/gatsby-theme";
import { lookupColourClassNames } from "@colors";
import classNames from "classnames";
import React from "react";
import { IComponentInformation, IContentComponent } from "./GenericComponent";
import { SectionBody } from "./SectionBody";
import { SectionHeading } from "./SectionHeading";
import { SectionIcon } from "./SectionIcon";
import { SectionLinks } from "./SectionLinks";
import { SectionVisual } from "./SectionVisual";

function calculateColumnClassName(cols: number) {
  switch (cols) {
    case 2:
      return "laptop:grid-cols-2";
    case 3:
      return "laptop:grid-cols-3";
    case 4:
      return "laptop:grid-cols-4";
    case 5:
      return "laptop:grid-cols-5";
    case 6:
      return "laptop:grid-cols-6";
    default:
      return "laptop:grid-cols-1";
  }
}

function calculateColumnSpanClassName(cols: number) {
  switch (cols) {
    case 2:
      return "laptop:col-span-2";
    case 3:
      return "laptop:col-span-3";
    case 4:
      return "laptop:col-span-4";
    case 5:
      return "laptop:col-span-5";
    default:
      return "laptop:col-span-1";
  }
}

const SplitInside: React.FC<{
  information: IContentComponent;
  className?: string;
}> = ({
  information: { body, icon, visual, links, preHeading, heading, postHeading },
  className,
}) => {
  return (
    <div className={classNames("relative flex flex-col", className)}>
      <SectionHeading
        preHeading={preHeading}
        heading={heading}
        postHeading={postHeading}
      />
      {body && <SectionBody content={body} />}
      {icon && <SectionIcon icon={icon} />}
      {visual && <SectionVisual visual={visual} />}
      {links && <SectionLinks links={links} vertical={false} />}
    </div>
  );
};

const Split: React.FC<{
  information: IComponentInformation;
  leftCols: number;
  rightCols: number;
}> = ({ information, leftCols, rightCols }) => {
  const {
    backgroundColour,
    textColour,
    body,
    icon,
    visual,
    links,
    internalReferences,
    contents,
    preHeading,
    heading,
    postHeading,
  } = information;
  return (
    <Section
      componentName="Split"
      information={information}
      sectionClassName={lookupColourClassNames(backgroundColour, textColour)}
      contentClassName="my-s laptop:my-xxxl"
      sectionColumnsClassName={classNames(
        "col-start-2 grid grid-cols-1 grid-gap gap-y-xs",
        calculateColumnClassName(leftCols + rightCols),
      )}
    >
      <SectionHeading
        preHeading={preHeading}
        heading={heading}
        postHeading={postHeading}
      />
      {body && <SectionBody content={body} />}
      {icon && <SectionIcon icon={icon} />}
      {visual && <SectionVisual visual={visual} />}
      {links && <SectionLinks links={links} vertical={false} />}
      {contents?.map((content, index) => (
        <SplitInside
          key={content.id}
          information={content}
          className={calculateColumnSpanClassName(
            index % 2 === 0 ? leftCols : rightCols,
          )}
        />
      ))}
      {internalReferences && (
        <SectionLinks links={internalReferences} vertical={false} />
      )}
    </Section>
  );
};

export default Split;
