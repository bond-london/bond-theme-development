import { BondImage, IBondImage } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import React from "react";

export const SectionIcon: React.FC<{
  icon: IBondImage;
  className?: string;
  iconHeightClassName?: string;
}> = ({
  icon,
  className,
  iconHeightClassName = "h-mobile-icon laptop:h-laptop-icon",
}) => {
  const raw = icon.svg?.raw as string;
  if (raw) {
    return (
      <div
        className={classNames(
          className,
          iconHeightClassName,
          "relative flex icon-container"
        )}
        dangerouslySetInnerHTML={{ __html: raw }}
      />
    );
  }

  return (
    <BondImage
      image={{ ...icon, dontCrop: true }}
      className={classNames(className, iconHeightClassName, "relative flex")}
      imgStyle={{ height: "100%" }}
    />
  );
};
