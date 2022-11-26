import { convertCmsAssetToBondImage } from "@bond-london/gatsby-theme";
import { PageProps, Slice } from "gatsby";
import React from "react";
import { ArticleList } from "../components/ArticleList";
import { SectionHero } from "../components/SectionHero";
import { PropsDump } from "./PropsDump";

export const CmsTagLayout: React.FC<PageProps<Queries.FirstTagListQuery>> = (
  props
) => {
  const {
    graphCmsTag,
    allGraphCmsArticle: { edges },
  } = props.data;
  if (!graphCmsTag) {
    throw new Error("Tag does not exist");
  }

  return (
    <>
      <Slice alias="navigation-Menu" />
      <Slice alias="analytics" />
      <SectionHero
        header={graphCmsTag.title}
        visual={convertCmsAssetToBondImage(graphCmsTag.featuredImage)}
        textColour={graphCmsTag.textColour}
        backgroundColour={graphCmsTag.backgroundColour}
      />
      <ArticleList articles={edges.map((e) => e.node)} />

      <PropsDump props={props} />

      <Slice alias="footer-Footer" />
    </>
  );
};
