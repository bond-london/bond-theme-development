import { PageProps, Slice } from "gatsby";
import React from "react";
import { CmsContent } from "./CmsContents";

export const CmsArticleLayout: React.FC<
  PageProps<Queries.SingleArticleQuery>
> = (props) => {
  const article = props.data.graphCmsArticle;
  if (!article) {
    throw new Error("Article does not exist");
  }

  const template = article.template;
  return (
    <>
      <Slice alias="navigation-Menu" />
      <Slice alias="analytics" />

      {template?.preContent && <CmsContent fragment={template.preContent} />}
      <CmsContent fragment={article.content} />
      {template?.postContent && <CmsContent fragment={template.postContent} />}

      <Slice alias="footer-Footer" />
    </>
  );
};
