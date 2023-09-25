import classNames from "classnames";
import { Link } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";

export const EmbedLink: React.FC<{
  className?: string;
  image: IGatsbyImageData;
  title: string;
  to: string;
}> = ({ className, image, title, to }) => {
  return (
    <div className={classNames(className, "gap-y-xxs flex flex-col")}>
      <GatsbyImage image={image} alt={title} />
      <Link className="link" to={to}>
        {title}
      </Link>
    </div>
  );
};
