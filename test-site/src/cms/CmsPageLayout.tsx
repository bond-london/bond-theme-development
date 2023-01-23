import classNames from "classnames";
import { PageProps, Slice } from "gatsby";
import React from "react";
import { lookupColourClassNames } from "../colors";
import { CmsContent } from "./CmsContent";
import { CmsFooter } from "./CmsFooter";
import { CmsNavigationMenu } from "./CmsNavigationMenu";

export const CmsPageLayout: React.FC<PageProps<Queries.SinglePageQuery>> = (
  props
) => {
  const page = props.data.graphCmsPage;
  if (!page) {
    throw new Error("Page does not exist");
  }

  const template = page.template;

  return (
    <div
      className={classNames(
        "overflow-hidden",
        lookupColourClassNames(
          page.backgroundColour || template?.backgroundColour,
          page.textColour || template?.textColour
        )
      )}
    >
      <CmsNavigationMenu page={page.menu} template={template?.menu} />
      <Slice alias="analytics" />

      <CmsContent fragment={page.topContent} />
      {template?.preContent && <CmsContent fragment={template.preContent} />}
      <CmsContent fragment={page.content} />
      {template?.postContent && <CmsContent fragment={template.postContent} />}
      <CmsContent fragment={page.bottomContent} />

      <CmsFooter page={page.footer} template={template?.footer} />
    </div>
  );
};
