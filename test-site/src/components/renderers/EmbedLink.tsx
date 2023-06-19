import React from "react";
import { IGatsbyImageData, GatsbyImage } from "gatsby-plugin-image";
import classNames from "classnames";
import { Link } from "gatsby";
import { LinkClassName } from "../../styles";
import { SimpleGatsbyImage } from "@bond-london/gatsby-theme/src/components/SimpleGatsbyImage";

export const EmbedLink: React.FC<{
  className?: string;
  image: IGatsbyImageData;
  title: string;
  to: string;
}> = ({ className, image, title, to }) => {
  return (
    <div className={classNames(className, "flex flex-col gap-y-xxs")}>
      <SimpleGatsbyImage image={image} alt={title} />
      <Link className={LinkClassName} to={to}>
        {title}
      </Link>
    </div>
  );
};
