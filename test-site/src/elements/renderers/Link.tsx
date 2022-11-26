import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import classNames from "classnames";
import React from "react";
import { lookupColourClassNames } from "../../colors";
import { ArticleLink } from "./ArticleLink";
import { ArticleTypeLink } from "./ArticleTypeLink";
import { PageLink } from "./PageLink";
import { TagLink } from "./TagLink";

export const Link: React.FC<{ fragment: Queries.CmsLinkFragment }> = ({
  fragment: {
    name,
    useName,
    linkText,
    remoteInternal,
    external,
    isButton,
    colour,
    // icon,
  },
}) => {
  const realText = useName ? name : linkText;
  if (external) {
    if (isButton) {
      return (
        <a
          href={external}
          target="_blank"
          rel="noreferrer"
          className={classNames(
            "button",
            lookupColourClassNames(colour || "White")
          )}
        >
          {realText}
        </a>
      );
    }
    return (
      <a href={external} className={lookupColourClassNames(undefined, colour)}>
        {realText}
      </a>
    );
  }

  if (remoteInternal) {
    const typename = remoteInternal.__typename;
    switch (typename) {
      case "GraphCMS_Article":
        return <ArticleLink fragment={remoteInternal} />;
      case "GraphCMS_ArticleType":
        return <ArticleTypeLink fragment={remoteInternal} />;
      case "GraphCMS_Page":
        return <PageLink fragment={remoteInternal} />;
      case "GraphCMS_Tag":
        return <TagLink fragment={remoteInternal} />;
    }
    return (
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      <Unsupported component="Link" message={`Cannot link to ${typename}`} />
    );
  }

  if (realText) {
    return (
      <Unsupported
        component="Link"
        message={`Link "${realText}" has no link`}
      />
    );
  }
  return <Unsupported component="Link" message="No link" />;
};
