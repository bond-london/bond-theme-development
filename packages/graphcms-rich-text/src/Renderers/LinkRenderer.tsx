import { LinkProps } from "@graphcms/rich-text-types";
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
  renderers,
  children,
}) => {
  const aProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    rel,
    id,
    title,
    style,
    role,
  };

  const realClassName = className ?? classNameOverrides?.a;

  if (realClassName) aProps.className = realClassName;
  if (openInNewTab) {
    aProps.target = "_blank";
    aProps.rel = "noreferrer";
  }

  if (href?.startsWith("/")) {
    return renderers.internalLink({
      href,
      className,
      rel,
      id,
      title,
      openInNewTab,
      children,
    });
  }

  if (href) aProps.href = encodeURI(href);
  return <a {...aProps}>{children}</a>;
};

export const DefaultInternalLinkRenderer: React.FC<
  PropsWithChildren<LinkProps>
> = ({ children, ...props }) => <a {...props}>{children}</a>;

export const LinkRenderer: React.FC<
  ILinkNodeRendererProps | RenderEmbedProps
> = props => {
  if (props.nodeType) {
    return <RenderLinkTo {...(props as RenderLinkToProps)} />;
  }
  return <BasicLinkRenderer {...(props as ILinkNodeRendererProps)} />;
};
