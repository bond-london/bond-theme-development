import { Link } from "gatsby";
import React, { PropsWithChildren } from "react";
import { RenderEmbedProps } from "../RenderEmbed";
import { RenderLinkTo, RenderLinkToProps } from "../RenderLinkTo";
import { ILinkNodeRendererProps } from "../types";

const BasicLinkRenderer: React.FC<
  PropsWithChildren<ILinkNodeRendererProps>
> = ({
  href,
  rel,
  id,
  title,
  openInNewTab,
  className,
  classNameOverrides,
  style,
  role,
  children,
}) => {
  const aProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    rel,
    id,
    title,
    style,
    role,
  };

  const realClassName = className || classNameOverrides?.["a"];

  if (realClassName) aProps.className = realClassName;
  if (openInNewTab) {
    aProps.target = "_blank";
    aProps.rel = "noreferrer";
  }

  if (href?.startsWith("/")) {
    return (
      <Link to={href} {...aProps}>
        {children}
      </Link>
    );
  }

  if (href) aProps.href = encodeURI(href);
  return <a {...aProps}>{children}</a>;
};

export const LinkRenderer: React.FC<
  ILinkNodeRendererProps | RenderEmbedProps
> = props => {
  if (props.nodeType) {
    return <RenderLinkTo {...(props as RenderLinkToProps)} />;
  }
  return <BasicLinkRenderer {...(props as ILinkNodeRendererProps)} />;
};
