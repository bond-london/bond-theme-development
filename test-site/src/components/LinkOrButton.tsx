import { IBondImage } from "@bond-london/gatsby-theme";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import classNames from "classnames";
import { Link } from "gatsby";
import React, { PropsWithChildren } from "react";
import {
  ColourName,
  lookupColourClassNames,
  lookupColourString,
} from "../colors";
import { LinkClassName } from "../styles";
import { SectionIcon } from "./SectionIcon";

export interface ILinkInformation {
  internal?: string;
  external?: string;
  text?: string;
  name: string;
  colour?: ColourName;
  isButton?: boolean;
  icon?: IBondImage;
}

const LinkOrButtonInside: React.FC<
  PropsWithChildren<{ text?: string; icon?: IBondImage }>
> = ({ children, text, icon }) => {
  if (children) {
    return <>{children}</>;
  }
  return (
    <>
      {text && <>{text}</>}
      {icon && <SectionIcon icon={icon} />}
    </>
  );
};

export const LinkOrButton: React.FC<{ information: ILinkInformation }> = ({
  information: { internal, external, text, name, colour, isButton, icon },
}) => {
  const label = text || name;
  const outerClassName = classNames(
    isButton
      ? ["button", colour && lookupColourClassNames(colour || "yellow")]
      : [LinkClassName, colour && lookupColourString(colour, "text")]
  );
  if (internal) {
    return (
      <Link
        className={classNames(outerClassName, "inline-flex items-center")}
        to={internal}
        aria-label={name}
      >
        <LinkOrButtonInside text={text} icon={icon} />
      </Link>
    );
  }

  if (external) {
    if (external.startsWith("#")) {
      return (
        <a
          aria-label={label}
          href={external}
          className={classNames(outerClassName, "inline-flex items-center")}
        >
          <LinkOrButtonInside text={text} icon={icon} />
        </a>
      );
    }
    return (
      <a
        aria-label={label}
        href={external}
        className={classNames(outerClassName, "inline-flex items-center")}
        target="_blank"
        rel="noreferrer"
      >
        <LinkOrButtonInside text={text} icon={icon} />
      </a>
    );
  }

  return (
    <Unsupported
      component="LinkOrButton"
      message={`Link or button "${name}" needs somewhere to link to`}
    />
  );
};
