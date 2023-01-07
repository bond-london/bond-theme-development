import { convertCmsAssetToBondVisual } from "@bond-london/gatsby-theme";
import { graphql, PageProps, Slice } from "gatsby";
import React, { useCallback } from "react";
import { CmsArticleTypeHead } from "../../cms/CmsArticleTypeLayout";
import { ArticleList } from "../../components/ArticleList";
import { Paginator } from "../../components/Paginator";
import { Hero } from "../../components/SectionHero";

const CaseStudyArticleTypeLayout: React.FC<
  PageProps<Queries.CaseStudyArticleTypeListQuery>
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

  const { featuredImage, backgroundColour, textColour } = graphCmsArticleType;

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
      <Hero
        heading="Case studies"
        visual={convertCmsAssetToBondVisual(featuredImage)}
        backgroundColour={backgroundColour}
        textColour={textColour}
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
export default CaseStudyArticleTypeLayout;

// eslint-disable-next-line import/no-unused-modules
export const CaseStudyArticleTypeListQuery = graphql`
  query CaseStudyArticleTypeList(
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
