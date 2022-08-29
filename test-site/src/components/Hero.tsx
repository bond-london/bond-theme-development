import {
  IBondImage,
  IBondVideo,
  BondVideo,
  BondImage,
  Section,
} from "@bond-london/gatsby-theme";
import React from "react";
import { ColourName, lookupColourClassNames } from "../colors";


const HeroBackground: React.FC<{ video?: IBondVideo; image?: IBondImage }> = ({
  video,
  image,
}) => {
  const className = "relative col-span-full row-span-full";
  if (video) {
    return <BondVideo className={className} {...video} />;
  }
  if (image) {
    return <BondImage className={className} {...image} />;
  }
  return null;
};

const HeroText: React.FC<{
  preHeader?: string;
  header?: string;
  postHeader?: string;
}> = ({ preHeader, header, postHeader }) => {
  if (preHeader || header || postHeader) {
    return (
      <div className="col-span-full flex flex-col gap-y-xs self-end tablet:col-span-4 tablet:col-start-2 laptop:col-span-6 laptop:col-start-3">
        {preHeader && <p className="h3 text-center">{preHeader}</p>}
        {header && <h1 className="h1 text-center">{header}</h1>}
        {postHeader && <p className="h4 text-center">{postHeader}</p>}
      </div>
    );
  }
  return null;
};

export const Hero: React.FC<{
  video?: IBondVideo;
  image?: IBondImage;
  // animation?: IBondAnimation;
  preHeader?: string;
  header?: string;
  postHeader?: string;
  backgroundColour?: ColourName | null;
  textColour?: ColourName | null;
}> = ({
  video,
  image,
  // animation,
  preHeader,
  header,
  postHeader,
  backgroundColour,
  textColour,
}) => {

  

  return (
    <Section
    className={lookupColourClassNames(backgroundColour, textColour)}
      componentName="Hero"
      preChildren={<HeroBackground video={video} image={image} />}
    >
      <HeroText preHeader={preHeader} header={header} postHeader={postHeader} />
    </Section>
  );
};
