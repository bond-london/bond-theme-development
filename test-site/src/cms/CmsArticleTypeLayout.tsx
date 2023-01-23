import {
  convertCmsAssetToBondVisual,
  IPageMetadata,
} from "@bond-london/gatsby-theme";
import classNames from "classnames";
import { HeadFC, PageProps, Slice } from "gatsby";
import React, { useCallback } from "react";
import { ColourName, lookupColourClassNames } from "../colors";
import { ArticleList } from "../components/ArticleList";
import { PageHead } from "../components/PageHead";
import { Paginator } from "../components/Paginator";
import { Hero } from "../components/SectionHero";
import { CmsContent } from "./CmsContent";
import { CmsFooter } from "./CmsFooter";
import { CmsNavigationMenu } from "./CmsNavigationMenu";

export const CmsArticleTypeHead: HeadFC<Queries.ArticleTypeListQuery> = (
  props
) => {
  const {
    data: { graphCmsArticleType },
  } = props;
  if (!graphCmsArticleType) throw new Error("No page");

  const pageMetadata: IPageMetadata = {
    title: graphCmsArticleType.title,
    description: graphCmsArticleType.description,
    image:
      graphCmsArticleType.seoImage?.localFile?.childImageSharp?.gatsbyImageData,
  };

  return <PageHead headProps={props} page={pageMetadata} />;
};

export const CmsArticleTypeLayout: React.FC<
  PageProps<Queries.ArticleTypeListQuery> & {
    articleListElement?: React.FC<{
      textColour?: ColourName | null;
      backgroundColour?: ColourName | null;
      articles: ReadonlyArray<Queries.CmsArticleLinkFragment>;
    }>;
  }
> = (props) => {
  const {
    graphCmsArticleType,
    allGraphCmsArticle: {
      edges,
      pageInfo: { currentPage, pageCount },
    },
  } = props.data;
  if (!graphCmsArticleType) {
    throw new Error("Article Type does not exist");
  }

  const {
    title,
    featuredImage,
    backgroundColour,
    textColour,
    topContent,
    template,
    menu,
    footer,
  } = graphCmsArticleType;

  const buildLink = useCallback(
    (page: number) => {
      const pagePart = page === 1 ? "" : `${page}/`;
      return `/${graphCmsArticleType.slug}/${pagePart}`;
    },
    [graphCmsArticleType.slug]
  );

  const ArticleListElement = props.articleListElement || ArticleList;

  return (
    <div
      className={classNames(
        "overflow-hidden",
        lookupColourClassNames(
          backgroundColour || template?.backgroundColour,
          textColour || template?.textColour
        )
      )}
    >
      <CmsNavigationMenu page={menu} template={template?.menu} />
      <Slice alias="analytics" />
      {topContent && topContent.length > 0 ? (
        <CmsContent fragment={topContent} />
      ) : (
        <Hero
          heading={title}
          visual={convertCmsAssetToBondVisual(featuredImage)}
          backgroundColour={backgroundColour}
          textColour={textColour}
        />
      )}
      {template?.preContent && <CmsContent fragment={template.preContent} />}

      <ArticleListElement
        articles={edges.map((e) => e.node)}
        backgroundColour={backgroundColour}
        textColour={textColour}
      />
      <Paginator
        totalPages={pageCount}
        currentPage={currentPage}
        buildLink={buildLink}
      />
      {template?.postContent && <CmsContent fragment={template.postContent} />}

      <CmsFooter page={footer} template={template?.footer} />
    </div>
  );
};
