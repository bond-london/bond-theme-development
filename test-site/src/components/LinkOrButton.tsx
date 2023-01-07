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
  PropsWithChildren<{
    text?: string;
    icon?: IBondImage;
    iconHeightClassName?: string;
  }>
> = ({ children, text, icon, iconHeightClassName }) => {
  if (children) {
    return <>{children}</>;
  }
  return (
    <>
      {text && <>{text}</>}
      {icon && (
        <SectionIcon icon={icon} iconHeightClassName={iconHeightClassName} />
      )}
    </>
  );
};

export const LinkOrButton: React.FC<{
  information: ILinkInformation;
  onClick?: () => void;
  className?: string;
  iconHeightClassName?: string;
  buttonClassName?: string;
  allowEmpty?: boolean;
}> = ({
  information: { internal, external, text, name, colour, isButton, icon },
  onClick,
  className,
  iconHeightClassName,
  buttonClassName = "button",
  allowEmpty,
}) => {
  const label = text || name;
  const realText = icon ? text : name;
  const outerClassName = classNames(
    className,
    isButton
      ? [buttonClassName, colour && lookupColourClassNames(colour || "yellow")]
      : [LinkClassName, colour && lookupColourString(colour, "text")]
  );
  if (internal) {
    return (
      <Link
        className={classNames(outerClassName, "inline-flex items-center")}
        onClick={onClick}
        to={internal}
        aria-label={name}
      >
        <LinkOrButtonInside
          text={realText}
          icon={icon}
          iconHeightClassName={iconHeightClassName}
        />
      </Link>
    );
  }

  if (external) {
    if (external.startsWith("#")) {
      return (
        <a
          aria-label={label}
          href={external}
          onClick={onClick}
          className={classNames(outerClassName, "inline-flex items-center")}
        >
          <LinkOrButtonInside
            text={realText}
            icon={icon}
            iconHeightClassName={iconHeightClassName}
          />
        </a>
      );
    }
    return (
      <a
        aria-label={label}
        onClick={onClick}
        href={external}
        className={classNames(outerClassName, "inline-flex items-center")}
        target="_blank"
        rel="noreferrer"
      >
        <LinkOrButtonInside
          text={realText}
          icon={icon}
          iconHeightClassName={iconHeightClassName}
        />
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        aria-label={label}
        onClick={onClick}
        className={classNames(
          outerClassName,
          "inline-flex items-center justify-center"
        )}
      >
        <LinkOrButtonInside
          text={realText}
          icon={icon}
          iconHeightClassName={iconHeightClassName}
        />
      </button>
    );
  }

  if (allowEmpty) {
    return (
      <div className={classNames(outerClassName, "inline-flex items-center")}>
        <LinkOrButtonInside
          text={realText}
          icon={icon}
          iconHeightClassName={iconHeightClassName}
        />
      </div>
    );
  }

  return (
    <Unsupported
      component="LinkOrButton"
      message={`Link or button "${name}" needs somewhere to link to`}
    />
  );
};

// eslint-disable-next-line import/no-unused-modules
export const LinkOrButtonComponent: React.FC<
  ILinkInformation & { onClick?: () => void; className?: string }
> = (information) => {
  const { onClick, className, ...props } = information;
  return (
    <LinkOrButton information={props} onClick={onClick} className={className} />
  );
};

// eslint-disable-next-line import/no-unused-modules
export const SimpleLink: React.FC<
  PropsWithChildren<{ link?: ILinkInformation; className?: string }>
> = ({ link, className, children }) => {
  if (link) {
    const { internal, external, name } = link;
    if (internal) {
      return (
        <Link to={internal} className={className} aria-label={name}>
          {children}
        </Link>
      );
    }
    if (external) {
      return (
        <a href={external} aria-label={name} className={className}>
          {children}
        </a>
      );
    }
  }

  return <div className={className}>{children}</div>;
};
