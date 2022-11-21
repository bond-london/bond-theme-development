import React from "react";
import { IGatsbyImageData, GatsbyImage } from "gatsby-plugin-image";
import classNames from "classnames";
import { Link } from "gatsby";
import { LinkClassName } from "../../styles";

export const EmbedLink: React.FC<{
  className?: string;
  image: IGatsbyImageData;
  title: string;
  to: string;
}> = ({ className, image, title, to }) => {
  return (
    <div className={classNames(className, "flex flex-col gap-y-xxs")}>
      <GatsbyImage image={image} alt={title} />
      <Link className={LinkClassName} to={to}>
        {title}
      </Link>
    </div>
  );
};
