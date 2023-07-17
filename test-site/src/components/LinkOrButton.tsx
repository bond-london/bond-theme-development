"use client";
import { IBondImage, IBondVisual } from "@bond-london/gatsby-theme";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import classNames from "classnames";
import { Link } from "gatsby";
import React, { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { ColourName, lookupColourClassNames } from "@colors";
import { SectionIcon } from "./SectionIcon";
import { ICoreComponent } from "./GenericComponent";

// eslint-disable-next-line import/no-unused-modules
export interface ILinkInformation {
  id: string;
  internal?: string;
  external?: string;
  text?: string;
  name: string;
  textColour?: ColourName | null;
  backgroundColour?: ColourName | null;
  isButton?: boolean;
  isOutlined?: boolean;
  icon?: IBondImage;
  visual?: IBondVisual;
  slugPrefix?: string;
  slug?: string;
  topContent?: ICoreComponent;
}

const LinkOrButtonInside: React.FC<
  PropsWithChildren<{
    text?: string;
    icon?: IBondVisual;
    iconHeightClassName?: string;
    iconFirst?: boolean;
    className?: string;
    label: string;
  }>
> = ({
  children,
  text,
  icon,
  iconHeightClassName,
  iconFirst,
  className = "items-center",
  label,
}) => {
  if (children) {
    return <>{children}</>;
  }
  return (
    <div className={classNames("inline-grid grid-flow-col", className)}>
      {icon && iconFirst && (
        <SectionIcon
          icon={icon}
          iconHeightClassName={iconHeightClassName}
          alt={label}
        />
      )}
      {text && <>{text}</>}
      {icon && !iconFirst && (
        <SectionIcon
          icon={icon}
          iconHeightClassName={iconHeightClassName}
          alt={label}
        />
      )}
    </div>
  );
};

export const LinkOrButton: React.FC<{
  information: ILinkInformation;
  onClick?: () => void;
  className?: string;
  iconHeightClassName?: string;
  contentClassName?: string;
  linkClassName?: string;
  buttonClassName?: string;
  outlinedClassName?: string;
  outlinedButtonClassName?: string;
  allowEmpty?: boolean;
  isButton?: boolean;
  isOutlined?: boolean;
  iconFirst?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  sameTab?: boolean;
}> = ({
  information: {
    internal,
    external,
    text,
    name,
    textColour,
    backgroundColour,
    isButton: informationIsButton,
    isOutlined: informationIsOutlined,
    icon,
  },
  onClick,
  className,
  iconHeightClassName,
  contentClassName,
  buttonClassName = "button",
  outlinedClassName = "outlined",
  outlinedButtonClassName = "outlined-button",
  allowEmpty,
  isButton: setIsButton,
  isOutlined: setIsOutlined,
  linkClassName,
  iconFirst,
  type,
  sameTab,
}) => {
  const isButton = setIsButton ?? informationIsButton;
  const isOutlined = setIsOutlined ?? informationIsOutlined;
  const label = text ?? name;
  const realText = icon ? text : text ?? name;
  const outerClassName = classNames(
    className,
    textColour && `text-colour-${textColour}`,
    backgroundColour && `background-colour-${backgroundColour}`,
    lookupColourClassNames(backgroundColour, textColour),
    isButton && isOutlined
      ? outlinedButtonClassName
      : isButton
      ? buttonClassName
      : isOutlined
      ? outlinedClassName
      : linkClassName,
  );
  const realInternal = external?.startsWith("/") ? external : internal;
  if (realInternal) {
    return (
      <Link
        className={outerClassName}
        onClick={onClick}
        to={realInternal}
        aria-label={label}
      >
        <LinkOrButtonInside
          label={label}
          text={realText}
          icon={icon}
          iconHeightClassName={iconHeightClassName}
          iconFirst={iconFirst}
          className={contentClassName}
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
          className={outerClassName}
        >
          <LinkOrButtonInside
            label={label}
            text={realText}
            icon={icon}
            iconHeightClassName={iconHeightClassName}
            iconFirst={iconFirst}
            className={contentClassName}
          />
        </a>
      );
    }
    if (sameTab) {
      return (
        <a
          aria-label={label}
          onClick={onClick}
          href={external}
          className={outerClassName}
        >
          <LinkOrButtonInside
            label={label}
            text={realText}
            icon={icon}
            iconHeightClassName={iconHeightClassName}
            iconFirst={iconFirst}
            className={contentClassName}
          />
        </a>
      );
    }
    return (
      <a
        aria-label={label}
        onClick={onClick}
        href={external}
        className={outerClassName}
        target="_blank"
        rel="noreferrer"
      >
        <LinkOrButtonInside
          label={label}
          text={realText}
          icon={icon}
          iconHeightClassName={iconHeightClassName}
          iconFirst={iconFirst}
          className={contentClassName}
        />
      </a>
    );
  }

  if (isButton) {
    return (
      <button
        aria-label={label}
        onClick={onClick}
        className={outerClassName}
        type={type}
      >
        <LinkOrButtonInside
          label={label}
          text={realText}
          icon={icon}
          iconHeightClassName={iconHeightClassName}
          iconFirst={iconFirst}
          className={contentClassName}
        />
      </button>
    );
  }

  if (allowEmpty) {
    return (
      <div className={outerClassName}>
        <LinkOrButtonInside
          label={label}
          text={realText}
          icon={icon}
          iconHeightClassName={iconHeightClassName}
          iconFirst={iconFirst}
          className={contentClassName}
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
  ILinkInformation & {
    onClick?: () => void;
    className?: string;
    buttonClassName?: string;
  }
> = (information) => {
  const { onClick, className, buttonClassName, ...props } = information;
  return (
    <LinkOrButton
      information={props}
      onClick={onClick}
      className={className}
      buttonClassName={buttonClassName}
    />
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
