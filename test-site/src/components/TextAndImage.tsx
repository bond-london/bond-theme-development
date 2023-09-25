import { CmsComponentContextProvider } from "@/cms/CmsComponentProvider";
import { BondVisual, Section } from "@bond-london/gatsby-theme";
import { lookupColourClassNames } from "@colors";
import classNames from "classnames";
import React from "react";
import { IComponentInformation } from "./GenericComponent";
import { SectionBody } from "./SectionBody";
import { SectionHeading } from "./SectionHeading";
import { SectionIcon } from "./SectionIcon";
import { SectionLinks } from "./SectionLinks";

const TextAndImage: React.FC<{
  information: IComponentInformation;
  isLeft: boolean;
}> = ({ information, isLeft }) => {
  const {
    heading,
    preHeading,
    postHeading,
    body,
    links,
    icon,
    visual,
    backgroundColour,
    textColour,
    index,
  } = information;
  const positionClassName = classNames(
    "col-span-full laptop:col-span-6",
    isLeft
      ? "laptop:col-start-7 laptop:ml-l"
      : "laptop:col-start-1 laptop:mr-l",
  );

  return (
    <Section
      componentName="Text and Image"
      information={information}
      sectionClassName={classNames(
        lookupColourClassNames(backgroundColour, textColour),
      )}
      sectionGridClassName="relative dynamic-width container-cols-grid "
      sectionRowsClassName="laptop:row-start-1 laptop:row-span-1"
      preChildren={
        visual && (
          <div className="col-start-2 row-start-2 laptop:row-start-1 laptop:grid laptop:grid-cols-2">
            <BondVisual
              className={isLeft ? "laptop:col-start-1" : "laptop:col-start-2"}
              visual={visual}
              autoPlay={true}
              simple={true}
            />
          </div>
        )
      }
    >
      <div
        className={classNames(
          positionClassName,
          "flex h-full flex-col justify-center",
        )}
      >
        <SectionHeading
          className=""
          preHeading={preHeading}
          heading={heading}
          postHeading={postHeading}
          headingFontClassName="h2"
          headingElement={index === 0 ? "h1" : "h2"}
          postHeadingElement={index === 0 ? "h2" : "h3"}
          postHeadingFontClassName="h2 lighter"
          preHeadingElement={index === 0 ? "h2" : "h3"}
          preHeadingFontClassName="h2 lighter"
        />
        {body ? (
          <CmsComponentContextProvider component={information}>
            <div className="mt-xs laptop:mt-s">
              <SectionBody content={body} />
            </div>
          </CmsComponentContextProvider>
        ) : (
          <div aria-hidden={true} className="flex-grow" />
        )}
        {icon && <SectionIcon icon={icon} className="" />}
        {links && <SectionLinks links={links} />}
      </div>
    </Section>
  );
};

export default TextAndImage;
