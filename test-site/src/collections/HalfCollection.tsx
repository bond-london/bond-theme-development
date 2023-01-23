import { BondVisual, Section } from "@bond-london/gatsby-theme";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import classNames from "classnames";
import React, { Fragment } from "react";
import { lookupColourClassNames } from "../colors";
import { SectionBody } from "../components/SectionBody";
import { SectionHeading } from "../components/SectionHeading";
import { SectionIcon } from "../components/SectionIcon";
import { SectionLinks } from "../components/SectionLinks";
import { SectionVisual } from "../components/SectionVisual";
import { SectionSpacingClassName } from "../styles";
import {
  ICollectionContent,
  ICollectionInformation,
  isContentComponent,
} from "./GenericCollection";

const HalfCollectionInside: React.FC<{
  contents: ReadonlyArray<ICollectionContent>;
  className: string;
}> = ({ contents, className }) => {
  return (
    <div
      className={classNames(
        className,
        "grid gap-x-xs laptop:gap-x-m gap-y-s w-full"
      )}
    >
      {contents.map((content) =>
        isContentComponent(content) ? (
          <Fragment key={content.id}>
            {content.icon && (
              <SectionIcon
                icon={content.icon}
                className="col-start-1 w-mobile-icon laptop:w-laptop-icon"
              />
            )}
            <div className="col-start-2 flex flex-col">
              <SectionHeading
                className="text-left"
                heading={content.heading}
                preHeading={content.preHeading}
                postHeading={content.postHeading}
                headingFontClassName="h4"
              />
              {content.body && <SectionBody content={content.body} />}
              {content.visual && <SectionVisual visual={content.visual} />}
              {content.links && <SectionLinks links={content.links} />}
            </div>
          </Fragment>
        ) : (
          <Unsupported
            key={content.id}
            component="Image Card Collection Inside"
            message="Image card collection doesn't take nested collections"
          />
        )
      )}
    </div>
  );
};
export const HalfCollection: React.FC<{
  collection: ICollectionInformation;
  isLeft: boolean;
}> = ({ collection, isLeft }) => {
  const {
    anchor,
    backgroundColour,
    textColour,
    backgroundVisual,
    contents,
    heading,
    preHeading,
    postHeading,
  } = collection;
  if (!backgroundVisual && !contents) {
    return null;
  }

  return (
    <Section
      id={anchor || undefined}
      componentName="Half Collection"
      sectionClassName={classNames(
        lookupColourClassNames(backgroundColour, textColour),
        SectionSpacingClassName
      )}
      contentClassName="grid grid-cols-1 tablet:grid-cols-2 desktop:mx-desktop-1-gap-cols laptop:gap-x-laptop-1-gap-cols gap-y-s laptop:gap-y-m grid-flow-row-dense"
    >
      <SectionHeading
        className="col-span-full text-center"
        heading={heading}
        preHeading={preHeading}
        postHeading={postHeading}
      />
      {backgroundVisual && (
        <BondVisual
          visual={backgroundVisual}
          className={classNames(
            "self-center",
            isLeft ? "tablet:col-start-1" : "tablet:col-start-2"
          )}
        />
      )}
      {contents.length > 0 && (
        <HalfCollectionInside
          contents={contents}
          className={classNames(
            "self-center",
            isLeft ? "tablet:col-start-2" : "tablet:col-start-1"
          )}
        />
      )}
    </Section>
  );
};
