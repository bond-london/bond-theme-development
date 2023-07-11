import {
  convertCmsAssetToBondImage,
  convertCmsAssetToBondVisual,
  IPageMetadata,
} from "@bond-london/gatsby-theme";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import { graphql, HeadFC, Slice } from "gatsby";
import React, { PropsWithChildren } from "react";
import { lookupColourClassNames } from "@colors";
import { PageHead } from "@/components/PageHead";
import { Paginator } from "@/components/Paginator";
import { SimpleHero } from "@/components/SimpleHero";
import { combineComponents } from "@/utils";
import { CmsContent } from "./CmsContent";
import { CmsFooter } from "./CmsFooter";
import { CmsNavigationMenu } from "./CmsNavigationMenu";
import { PageContext } from "@/components/PageContext";

export const CmsTagHead: HeadFC<Queries.TagListQuery> = (props) => {
  const {
    data: { graphCmsTag },
  } = props;
  if (!graphCmsTag) {
    return <Unsupported component="Cms tag head" message="No tag" />;
  }

  const pageMetadata: IPageMetadata = {
    title: graphCmsTag.title,
    description: graphCmsTag.description,
    image: graphCmsTag.seoImage?.gatsbyImageData,
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
  PropsWithChildren<{ data: Queries.TagListQuery; noHero?: boolean }>
> = (props) => {
  const {
    graphCmsTag,
    allGraphCmsArticle: {
      pageInfo: { currentPage, pageCount },
    },
  } = props.data;
  if (!graphCmsTag) {
    return <Unsupported component="Cms tag layout" message="No tag" />;
  }

  const {
    title,
    description,
    featuredImage,
    backgroundColour,
    textColour,
    topContent,
    template,
    menu,
    footer,
  } = graphCmsTag;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const buildLink = (page: number) => {
    const pagePart = page === 1 ? "" : `${page}/`;
    return `/${graphCmsTag.slug}/${pagePart}`;
  };

  const noDefaultHero =
    props.noHero ||
    (topContent && topContent.length) ||
    (template?.preContent && template.preContent.length);

  return (
    <div
      className={lookupColourClassNames(
        backgroundColour || template?.backgroundColour,
        textColour || template?.textColour,
      )}
    >
      <PageContext.Provider
        value={{
          title,
          description,
          featuredImage: convertCmsAssetToBondImage(featuredImage),
        }}
      >
        <CmsNavigationMenu page={menu || template?.menu} />
        <Slice alias="analytics" />
        {noDefaultHero ? (
          <>
            <CmsContent
              fragment={combineComponents(topContent, template?.preContent)}
              isLast={false}
            />
          </>
        ) : (
          <SimpleHero
            heading={title}
            visual={convertCmsAssetToBondVisual(featuredImage)}
            backgroundColour={backgroundColour}
            textColour={textColour}
          />
        )}
        {props.children || (
          <Unsupported
            message="Need to pass in children - maybe ArticleList"
            component="Article type layout"
          />
        )}

        <Paginator
          totalPages={pageCount}
          currentPage={currentPage}
          buildLink={buildLink}
        />
        <CmsContent fragment={template?.postContent} offset={1} />

        <CmsFooter page={footer || template?.footer} />
      </PageContext.Provider>
    </div>
  );
};
