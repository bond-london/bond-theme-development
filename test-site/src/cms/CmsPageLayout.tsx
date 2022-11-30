import { PageProps, Slice } from "gatsby";
import React from "react";
import { CmsContent } from "./CmsContents";

export const CmsPageLayout: React.FC<PageProps<Queries.SinglePageQuery>> = (
  props
) => {
  const page = props.data.graphCmsPage;
  if (!page) {
    throw new Error("Page does not exist");
  }

  const template = page.template;
  return (
    <>
      <Slice alias="navigation-Menu" />
      <Slice alias="analytics" />

      <CmsContent fragment={page.topContent} />
      {template?.preContent && <CmsContent fragment={template.preContent} />}
      <CmsContent fragment={page.content} />
      {template?.postContent && <CmsContent fragment={template.postContent} />}
      <CmsContent fragment={page.bottomContent} />

      <Slice alias="footer-Footer" />
    </>
  );
};
