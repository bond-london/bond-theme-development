import { SimpleSection, getVisualSize } from "@bond-london/gatsby-theme";
import { lookupColourClassNames } from "@colors";
import classNames from "classnames";
import React from "react";
import { IComponentInformation } from "./GenericComponent";
import { HeroBackground } from "./HeroBackground";
import { HeroText } from "./HeroText";

export const VisualHero: React.FC<{
  information: IComponentInformation;
  isGrey?: boolean | null;
}> = ({ information, isGrey }) => {
  const {
    visual,
    preHeading,
    heading,
    postHeading,
    body,
    links,
    backgroundColour,
    textColour,
  } = information;
  if (!visual) return null;
  const size = getVisualSize(visual);
  if (!size) return null;
  return (
    <SimpleSection
      componentName="Visual Hero"
      information={information}
      className={classNames(
        lookupColourClassNames(backgroundColour, textColour),
        "container-cols-grid relative h-0 w-full",
      )}
      style={{
        paddingBottom: `${Math.floor(100 * (size.height / size.width))}%`,
      }}
    >
      <div className="container-cols-grid absolute bottom-0 left-0 right-0 top-0 grid">
        {visual && <HeroBackground visual={visual} isGrey={isGrey} />}
        <div className="relative col-start-2 flex flex-col justify-center gap-y-s laptop:gap-y-m">
          <HeroText
            preHeading={preHeading}
            heading={heading}
            postHeading={postHeading}
            body={body}
            links={links}
          />
        </div>
      </div>
    </SimpleSection>
  );
};
