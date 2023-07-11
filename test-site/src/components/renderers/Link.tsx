import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import classNames from "classnames";
import React from "react";
import { lookupColourClassNames } from "@colors";
import { ArticleLink } from "./ArticleLink";
import { ArticleTypeLink } from "./ArticleTypeLink";
import { PageLink } from "./PageLink";
import { TagLink } from "./TagLink";

export const Link: React.FC<{ fragment: Queries.CmsLinkFragment }> = ({
  fragment: {
    name,
    useName,
    linkText,
    internal,
    external,
    isButton,
    textColour,
    backgroundColour,
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
            lookupColourClassNames(backgroundColour, textColour),
          )}
        >
          {realText}
        </a>
      );
    }
    return (
      <a
        href={external}
        className={lookupColourClassNames(backgroundColour, textColour)}
      >
        {realText}
      </a>
    );
  }

  if (internal) {
    const typename = internal.__typename;
    switch (typename) {
      case "GraphCMS_Article":
        return <ArticleLink fragment={internal} />;
      case "GraphCMS_ArticleType":
        return <ArticleTypeLink fragment={internal} />;
      case "GraphCMS_Page":
        return <PageLink fragment={internal} />;
      case "GraphCMS_Tag":
        return <TagLink fragment={internal} />;
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
