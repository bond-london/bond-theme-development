import { BondImage, IBondImage } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import React from "react";

export const SectionIcon: React.FC<{
  icon: IBondImage;
  className?: string;
}> = ({ icon, className }) => {
  const raw = icon.svg?.raw as string;
  if (raw) {
    return (
      <div
        className={classNames(
          className,
          "h-icon flex section-icon justify-center"
        )}
        dangerouslySetInnerHTML={{ __html: raw }}
      />
    );
  }

  return (
    <BondImage
      image={{ ...icon, dontCrop: true }}
      className={classNames("h-icon flex-shrink-0", className)}
      imgStyle={{ height: "100%" }}
    />
  );
};
