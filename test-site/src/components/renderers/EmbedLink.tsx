import React from "react";
import { IGatsbyImageData, GatsbyImage } from "gatsby-plugin-image";
import classNames from "classnames";
import { Link } from "gatsby";

export const EmbedLink: React.FC<{
  className?: string;
  image: IGatsbyImageData;
  title: string;
  to: string;
}> = ({ className, image, title, to }) => {
  return (
    <div className={classNames(className, "gap-y-xxs flex flex-col")}>
      <GatsbyImage image={image} alt={title} />
      <Link to={to}>{title}</Link>
    </div>
  );
};
