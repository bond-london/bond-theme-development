import { Section } from "@bond-london/gatsby-theme";
import { IComponentInformation } from "./GenericComponent";
import { lookupColourClassNames } from "@colors";
import classNames from "classnames";
import React from "react";
import { HeadingAndIcon } from "./HeadingAndIcon";
import { SectionBody } from "./SectionBody";
import { SectionVisual } from "./SectionVisual";
import { SectionLinks } from "./SectionLinks";
import { SectionHeading } from "./SectionHeading";
import { SectionIcon } from "./SectionIcon";

function calculateColumnClassName(columns: number) {
  switch (columns) {
    case 0:
    case 1:
      return undefined;
    case 2:
      return "tablet:grid-cols-2";
    case 3:
      return "tablet:grid-cols-2 laptop:grid-cols-3";
    default:
      return "tablet:grid-cols-2 laptop:grid-cols-4";
  }
}

const Grid: React.FC<{
  information: IComponentInformation;
  columns: number;
  index: number;
}> = ({ information, columns, index }) => {
  const {
    id,
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
    contents,
  } = information;

  return (
    <Section
      id={anchor || undefined}
      componentName={`Grid ${columns} columns`}
      sectionClassName={lookupColourClassNames(backgroundColour, textColour)}
      sectionColumnsClassName="col-start-2 col-span-1 grid grid-cols-1"
    >
      <HeadingAndIcon
        id={id}
        heading={heading}
        icon={icon}
        preHeading={preHeading}
        postHeading={postHeading}
        dynamic={false}
        className={index === 0 ? "my-m laptop:my-xl" : "mt-m laptop:mt-xl"}
        preHeadingFontClassName="h1 lighter"
        headingFontClassName="h1"
        postHeadingFontClassName="h1 lighter"
        preHeadingElement={index === 0 ? "h2" : "h3"}
        headingElement={index === 0 ? "h1" : "h2"}
        postHeadingElement={index === 0 ? "h2" : "h3"}
      />
      {body && <SectionBody content={body} className="gap-y-xs mt-xxs mb-xl" />}
      {links && (
        <SectionLinks
          links={links}
          vertical={false}
          className="col-span-full h2 mt-s laptop:mt-l mb-m laptop:mb-xl"
        />
      )}
      {visual && (
        <SectionVisual
          visual={visual}
          className="w-full my-xs laptop:my-s"
          sizes="(max-width: 640px) 100vw, (max-width:1024px) 60vw, 60vw"
          loading="eager"
          autoPlay={true}
        />
      )}
      {contents && contents.length && (
        <div
          className={classNames(
            "col-span-full grid grid-cols-1 gap-s",
            calculateColumnClassName(columns),
          )}
        >
          {contents.map(
            ({
              id,
              preHeading,
              heading,
              postHeading,
              body,
              icon,
              links,
              backgroundColour,
              textColour,
              visual,
            }) => (
              <div
                key={id}
                className={classNames(
                  "relative overflow-hidden tablet:aspect-w-4 tablet:aspect-h-5",
                  lookupColourClassNames(backgroundColour, textColour),
                )}
              >
                <div
                  className={classNames(
                    "flex flex-col",
                    !visual && "my-l laptop:my-xxxl",
                  )}
                >
                  {icon && <SectionIcon icon={icon} />}
                  <SectionHeading
                    className="laptop:w-laptop-4-cols laptop:mr-laptop-half-col"
                    preHeading={preHeading}
                    heading={heading}
                    postHeading={postHeading}
                    preHeadingFontClassName="p1 lighter"
                    headingFontClassName="p1"
                    postHeadingFontClassName="p1 lighter"
                    preHeadingElement="p"
                    headingElement="h3"
                    postHeadingElement="p"
                  />
                  {body && (
                    <SectionBody
                      content={body}
                      className="gap-y-xs lighter laptop:w-laptop-4-cols laptop:mr-laptop-half-col"
                      fontClassName="p2"
                    />
                  )}
                  {visual && (
                    <SectionVisual
                      visual={visual}
                      autoPlay={true}
                      className="tablet:h-full"
                    />
                  )}
                  {links && <SectionLinks links={links} vertical={false} />}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </Section>
  );
};

export default Grid;
