import { convertCmsAssetToBondImage } from "@bond-london/gatsby-theme";
import { graphql, PageProps, Slice } from "gatsby";
import React, { useCallback } from "react";
import { CmsArticleTypeHead } from "../../../cms/CmsArticleTypeLayout";
import { ArticleList } from "../../../components/ArticleList";
import { Paginator } from "../../../components/Paginator";
import { SectionHero } from "../../../components/SectionHero";

const BlogCommercialLayout: React.FC<
  PageProps<Queries.BlogCommercialListQuery>
> = (props) => {
  const {
    graphCmsArticleType,
    graphCmsTag,
    allGraphCmsArticle: {
      edges,
      pageInfo: { currentPage, pageCount },
    },
  } = props.data;
  if (!graphCmsArticleType) {
    throw new Error("Article Type does not exist");
  }
  if (!graphCmsTag) {
    throw new Error("Tag does not exist");
  }

  const buildLink = useCallback(
    (page: number) => {
      const pagePart = page === 1 ? "" : `${page}/`;
      return `/${graphCmsArticleType.slug}/${graphCmsTag.slug}/${pagePart}`;
    },
    [graphCmsArticleType.slug, graphCmsTag.slug]
  );

  return (
    <>
      <Slice alias="navigation-Menu" />
      <Slice alias="analytics" />
      <h1 className="h1">Blog/Commercial list page</h1>
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
export default BlogCommercialLayout;

// eslint-disable-next-line import/no-unused-modules
export const BlogCommercialListQuery = graphql`
  query BlogCommercialList(
    $skip: Int!
    $articlesPerPage: Int!
    $articleTypeId: String!
    $tagId: String!
    $allowHidden: Boolean!
  ) {
    graphCmsArticleType(id: { eq: $articleTypeId }) {
      ...CmsArticleType
    }
    graphCmsTag(id: { eq: $tagId }) {
      ...CmsTag
    }
    allGraphCmsArticle(
      filter: {
        articleType: { id: { eq: $articleTypeId } }
        tags: { elemMatch: { id: { eq: $tagId } } }
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
