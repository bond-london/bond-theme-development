import { convertCmsAssetToBondImage } from "@bond-london/gatsby-theme";
import { PageProps, Slice } from "gatsby";
import React from "react";
import { ArticleList } from "../components/ArticleList";
import { SectionHero } from "../components/SectionHero";

export const CmsArticleTypeLayout: React.FC<
  PageProps<Queries.FirstArticleTypeListQuery>
> = (props) => {
  const {
    graphCmsArticleType,
    allGraphCmsArticle: { edges },
  } = props.data;
  if (!graphCmsArticleType) {
    throw new Error("Article type does not exist");
  }

  return (
    <>
      <Slice alias="navigation-Menu" />
      <Slice alias="analytics" />
      <SectionHero
        header={graphCmsArticleType.title}
        visual={convertCmsAssetToBondImage(graphCmsArticleType.featuredImage)}
        textColour={graphCmsArticleType.textColour}
        backgroundColour={graphCmsArticleType.backgroundColour}
      />
      <ArticleList articles={edges.map((e) => e.node)} />

      <Slice alias="footer-Footer" />
    </>
  );
};
