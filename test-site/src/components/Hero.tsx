import React from "react";
import { IComponentInformation } from "./GenericComponent";
import { SimpleHero } from "./SimpleHero";
import { VisualHero } from "./VisualHero";

const Hero: React.FC<{
  information: IComponentInformation;
  isGrey?: boolean | null;
}> = ({ information, isGrey }) => {
  const {
    anchor,
    visual,
    preHeading,
    heading,
    postHeading,
    body,
    links,
    backgroundColour,
    textColour,
    index,
    isFirst,
    isLast,
  } = information;
  if (information.visual) {
    return <VisualHero information={information} isGrey={isGrey} />;
  }
  return (
    <SimpleHero
      anchor={anchor}
      visual={visual}
      preHeading={preHeading}
      heading={heading}
      postHeading={postHeading}
      body={body}
      links={links}
      textColour={textColour}
      backgroundColour={backgroundColour}
      isGrey={isGrey}
      index={index}
      isFirst={isFirst}
      isLast={isLast}
    />
  );
};

export default Hero;
