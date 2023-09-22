import { PageHead } from "@/components/PageHead";
import { Paginator } from "@/components/Paginator";
import { SimpleHero } from "@/components/SimpleHero";
import { combineComponents } from "@/utils";
import {
  convertCmsAssetToBondVisual,
  convertCmsImageToImageData,
  IPageMetadata,
} from "@bond-london/gatsby-theme";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import { lookupColourClassNames } from "@colors";
import { HeadFC, Slice } from "gatsby";
import React, { PropsWithChildren } from "react";
import { CmsContent } from "./CmsContent";
import { CmsFooter } from "./CmsFooter";
import { CmsNavigationMenu } from "./CmsNavigationMenu";

export const CmsArticleTypeHead: HeadFC<Queries.ArticleTypeListQuery> = (
  props,
) => {
  const {
    data: { graphCmsArticleType },
  } = props;
  if (!graphCmsArticleType) {
    return <Unsupported component="Cms article type head" message="No data" />;
  }

  const pageMetadata: IPageMetadata = {
    title: graphCmsArticleType.title,
    description: graphCmsArticleType.description,
    image: convertCmsImageToImageData(graphCmsArticleType.seoImage),
  };

  return <PageHead headProps={props} page={pageMetadata} />;
};

export const CmsArticleTypeLayout: React.FC<
  PropsWithChildren<{
    data: Queries.ArticleTypeListQuery;
    noHero?: boolean;
  }>
> = (props) => {
  const {
    graphCmsArticleType,
    allGraphCmsArticle: {
      pageInfo: { currentPage, pageCount },
    },
  } = props.data;
  if (!graphCmsArticleType) {
    return (
      <Unsupported
        component="Cms article type layout"
        message="Article type does not exist"
      />
    );
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const buildLink = (page: number) => {
    const pagePart = page === 1 ? "" : `${page}/`;
    return `/${graphCmsArticleType.indexPageSlug}/${pagePart}`;
  };
  const noDefaultHero =
    (props.noHero ?? topContent?.length) || template?.preContent?.length;

  return (
    <div
      className={lookupColourClassNames(
        backgroundColour ?? template?.backgroundColour,
        textColour ?? template?.textColour,
      )}
    >
      <CmsNavigationMenu page={menu ?? template?.menu} />
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

      {props.children ?? (
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

      <CmsFooter page={footer ?? template?.footer} />
    </div>
  );
};
