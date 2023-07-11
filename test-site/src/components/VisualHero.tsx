import React from "react";
import { IComponentInformation } from "./GenericComponent";
import { getVisualSize } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import { lookupColourClassNames } from "@colors";
import { HeroBackground } from "./HeroBackground";
import { HeroText } from "./HeroText";

export const VisualHero: React.FC<{
  information: IComponentInformation;
  isGrey?: boolean | null;
}> = ({
  information: {
    anchor,
    visual,
    preHeading,
    heading,
    postHeading,
    body,
    links,
    backgroundColour,
    textColour,
  },
  isGrey,
}) => {
  if (!visual) return null;
  const size = getVisualSize(visual);
  if (!size) return null;
  return (
    <section
      className={classNames(
        lookupColourClassNames(backgroundColour, textColour),
        "h-0 relative w-full container-cols-grid",
      )}
      style={{
        paddingBottom: `${Math.floor(100 * (size.height / size.width))}%`,
      }}
      id={anchor || undefined}
      data-component="Visual Hero"
    >
      <div className="absolute top-0 left-0 bottom-0 right-0 grid container-cols-grid">
        {visual && <HeroBackground visual={visual} isGrey={isGrey} />}
        <div className="relative flex flex-col gap-y-s laptop:gap-y-m col-start-2 justify-center">
          <HeroText
            preHeading={preHeading}
            heading={heading}
            postHeading={postHeading}
            body={body}
            links={links}
          />
        </div>
      </div>
    </section>
  );
};
