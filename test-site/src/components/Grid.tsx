import { Section } from "@bond-london/gatsby-theme";
import { lookupColourClassNames } from "@colors";
import classNames from "classnames";
import React from "react";
import { IComponentInformation } from "./GenericComponent";
import { HeadingAndIcon } from "./HeadingAndIcon";
import { SectionBody } from "./SectionBody";
import { SectionHeading } from "./SectionHeading";
import { SectionIcon } from "./SectionIcon";
import { SectionLinks } from "./SectionLinks";
import { SectionVisual } from "./SectionVisual";

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
}> = ({ information, columns }) => {
  const {
    id,
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
    index,
  } = information;

  return (
    <Section
      information={information}
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
      {body && <SectionBody content={body} className="mb-xl mt-xxs gap-y-xs" />}
      {links && (
        <SectionLinks
          links={links}
          vertical={false}
          className="h2 col-span-full mb-m mt-s laptop:mb-xl laptop:mt-l"
        />
      )}
      {visual && (
        <SectionVisual
          visual={visual}
          className="my-xs w-full laptop:my-s"
          sizes="(max-width: 640px) 100vw, (max-width:1024px) 60vw, 60vw"
          loading="eager"
          autoPlay={true}
        />
      )}
      {contents?.length && (
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
                  "relative overflow-hidden tablet:aspect-h-5 tablet:aspect-w-4",
                  lookupColourClassNames(backgroundColour, textColour),
                )}
              >
                <div
                  className={classNames(
                    "flex flex-col",
                    !visual && "laptop:my-xxxl my-l",
                  )}
                >
                  {icon && <SectionIcon icon={icon} />}
                  <SectionHeading
                    className="laptop:mr-laptop-half-col laptop:w-laptop-4-cols"
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
                      className="lighter gap-y-xs laptop:mr-laptop-half-col laptop:w-laptop-4-cols"
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
