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
          "h-icon flex icon-container justify-center"
        )}
        dangerouslySetInnerHTML={{ __html: raw }}
      />
    );
  }

  return (
    <BondImage
      image={{ ...icon, dontCrop: true }}
      className={classNames(className, "relative h-icon flex justify-center")}
      imgStyle={{ height: "100%" }}
    />
  );
};
