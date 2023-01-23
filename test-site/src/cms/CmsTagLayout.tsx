import {
  convertCmsAssetToBondVisual,
  IPageMetadata,
} from "@bond-london/gatsby-theme";
import classNames from "classnames";
import { graphql, HeadFC, PageProps, Slice } from "gatsby";
import React, { useCallback } from "react";
import { ColourName, lookupColourClassNames } from "../colors";
import { ArticleList } from "../components/ArticleList";
import { PageHead } from "../components/PageHead";
import { Paginator } from "../components/Paginator";
import { Hero } from "../components/SectionHero";
import { CmsContent } from "./CmsContent";
import { CmsFooter } from "./CmsFooter";
import { CmsNavigationMenu } from "./CmsNavigationMenu";

export const CmsTagHead: HeadFC<Queries.TagListQuery> = (props) => {
  const {
    data: { graphCmsTag },
  } = props;
  if (!graphCmsTag) throw new Error("No page");

  const pageMetadata: IPageMetadata = {
    title: graphCmsTag.title,
    description: graphCmsTag.description,
    image: graphCmsTag.seoImage?.localFile?.childImageSharp?.gatsbyImageData,
  };

  return <PageHead headProps={props} page={pageMetadata} />;
};

// eslint-disable-next-line import/no-unused-modules
export const PagedArticleListFragment = graphql`
  fragment PagedArticleList on GraphCMS_ArticleConnection {
    edges {
      node {
        ...CmsArticleLink
      }
    }
    pageInfo {
      currentPage
      hasNextPage
      hasPreviousPage
      itemCount
      pageCount
      perPage
      totalCount
    }
  }
`;

export const CmsTagLayout: React.FC<
  PageProps<Queries.TagListQuery> & {
    articleListElement?: React.FC<{
      textColour?: ColourName | null;
      backgroundColour?: ColourName | null;
      articles: ReadonlyArray<Queries.CmsArticleLinkFragment>;
    }>;
  }
> = (props) => {
  const {
    graphCmsTag,
    allGraphCmsArticle: {
      edges,
      pageInfo: { currentPage, pageCount },
    },
  } = props.data;
  if (!graphCmsTag) {
    throw new Error("Tag does not exist");
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
  } = graphCmsTag;
  const buildLink = useCallback(
    (page: number) => {
      const pagePart = page === 1 ? "" : `${page}/`;
      return `/${graphCmsTag.slug}/${pagePart}`;
    },
    [graphCmsTag.slug]
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
