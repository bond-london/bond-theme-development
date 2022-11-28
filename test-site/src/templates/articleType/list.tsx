import { convertCmsAssetToBondImage } from "@bond-london/gatsby-theme";
import { graphql, PageProps, Slice } from "gatsby";
import React, { useCallback } from "react";
import { CmsArticleTypeHead } from "../../cms/CmsArticleTypeLayout";
import { ArticleList } from "../../components/ArticleList";
import { Paginator } from "../../components/Paginator";
import { SectionHero } from "../../components/SectionHero";

const ArticleTypeLayout: React.FC<PageProps<Queries.ArticleTypeListQuery>> = (
  props
) => {
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

  const buildLink = useCallback(
    (page: number) => {
      const pagePart = page === 1 ? "" : `${page}/`;
      return `/${graphCmsArticleType.slug}/${pagePart}`;
    },
    [graphCmsArticleType.slug]
  );

  return (
    <>
      <Slice alias="navigation-Menu" />
      <Slice alias="analytics" />
      <h1 className="h1">Generic ArticleType page</h1>
      <SectionHero
        header={graphCmsArticleType.title}
        visual={convertCmsAssetToBondImage(graphCmsArticleType.featuredImage)}
        textColour={graphCmsArticleType.textColour}
        backgroundColour={graphCmsArticleType.backgroundColour}
      />
      <ArticleList articles={edges.map((e) => e.node)} />
      <Paginator
        totalPages={pageCount}
        currentPage={currentPage}
        buildLink={buildLink}
      />

      <Slice alias="footer-Footer" />
    </>
  );
};

// eslint-disable-next-line import/no-unused-modules
export default ArticleTypeLayout;

// eslint-disable-next-line import/no-unused-modules
export const ArticleTypeListQuery = graphql`
  query ArticleTypeList(
    $skip: Int!
    $articlesPerPage: Int!
    $id: String!
    $allowHidden: Boolean!
  ) {
    graphCmsArticleType(id: { eq: $id }) {
      ...CmsArticleType
    }
    allGraphCmsTag {
      nodes {
        ...CmsTagLink
      }
    }
    allGraphCmsArticle(
      filter: {
        articleType: { id: { eq: $id } }
        hidden: { in: [false, $allowHidden] }
      }
      skip: $skip
      limit: $articlesPerPage
      sort: { date: DESC }
    ) {
      ...PagedArticleList
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const Head = CmsArticleTypeHead;
