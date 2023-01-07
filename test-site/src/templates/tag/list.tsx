import { convertCmsAssetToBondVisual } from "@bond-london/gatsby-theme";
import { graphql, PageProps, Slice } from "gatsby";
import React, { useCallback } from "react";
import { CmsTagHead } from "../../cms/CmsTagLayout";
import { ArticleList } from "../../components/ArticleList";
import { Paginator } from "../../components/Paginator";
import { Hero } from "../../components/SectionHero";

const TagLayout: React.FC<PageProps<Queries.TagListQuery>> = (props) => {
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

  const { title, featuredImage, backgroundColour, textColour } = graphCmsTag;
  const buildLink = useCallback(
    (page: number) => {
      const pagePart = page === 1 ? "" : `${page}/`;
      return `/${graphCmsTag.slug}/${pagePart}`;
    },
    [graphCmsTag.slug]
  );

  return (
    <>
      <Slice alias="navigation-Menu" />
      <Slice alias="analytics" />
      <Hero
        heading={title}
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
export default TagLayout;

// eslint-disable-next-line import/no-unused-modules
export const TagListQuery = graphql`
  query TagList(
    $skip: Int!
    $articlesPerPage: Int!
    $id: String!
    $allowHidden: Boolean!
  ) {
    graphCmsTag(id: { eq: $id }) {
      ...CmsTag
    }
    allGraphCmsArticleType {
      nodes {
        ...CmsArticleTypeLink
      }
    }
    allGraphCmsArticle(
      filter: {
        tags: { elemMatch: { id: { eq: $id } } }
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
export const Head = CmsTagHead;
