import { BondVisual, Section } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import React from "react";
import { lookupColourClassNames } from "../colors";
import { SectionSpacingClassName } from "../styles";
import { IComponentInformation } from "./GenericComponent";
import { SectionBody } from "./SectionBody";
import { SectionHeading } from "./SectionHeading";
import { SectionLinks } from "./SectionLinks";
import {
  PlayButton,
  PauseButton,
  MuteButton,
  UnmuteButton,
} from "./VideoControls";

export const ImageCard: React.FC<{
  information: IComponentInformation;
  assetLeft?: boolean;
}> = ({ information, assetLeft }) => {
  const {
    anchor,
    backgroundColour,
    textColour,
    preHeading,
    heading,
    postHeading,
    body,
    visual,
    links,
  } = information;

  return (
    <Section
      id={anchor || undefined}
      componentName="Image Card"
      contentClassName="grid grid-cols-1 tablet:grid-cols-2 desktop:mx-desktop-1-gap-cols laptop:gap-x-laptop-1-gap-cols gap-y-s laptop:gap-y-m grid-flow-row-dense"
      sectionClassName={classNames(
        lookupColourClassNames(backgroundColour, textColour),
        SectionSpacingClassName
      )}
    >
      <SectionHeading
        heading={heading}
        preHeading={preHeading}
        postHeading={postHeading}
        className="col-span-full text-center"
      />
      {visual && (
        <BondVisual
          visual={visual}
          showControls={true}
          playButton={PlayButton}
          pauseButton={PauseButton}
          muteButton={MuteButton}
          unmuteButton={UnmuteButton}
          className={classNames(
            "self-center rounded-polly overflow-hidden",
            !visual.dontCrop && "h-full",
            assetLeft ? "tablet:col-start-1" : "tablet:col-start-2"
          )}
        />
      )}
      <div
        className={classNames(
          "flex flex-col self-center gap-y-xs",
          assetLeft ? "tablet:col-start-2" : "tablet:col-start-1"
        )}
      >
        {body && <SectionBody content={body} />}
        {links && <SectionLinks links={links} />}
      </div>
    </Section>
  );
};
