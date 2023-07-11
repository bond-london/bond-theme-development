import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import { PageProps, Slice } from "gatsby";
import React, { createContext } from "react";
import { CmsContent } from "./CmsContent";
import { CmsFooter } from "./CmsFooter";
import { CmsNavigationMenu } from "./CmsNavigationMenu";
import { lookupColourClassNames } from "@colors";
import { combineComponents } from "@/utils";

interface IArticleContext {
  article?: Queries.CmsArticleFragment;
}

export const ArticleContext = createContext<IArticleContext>({
  article: undefined,
});

export const CmsArticleLayout: React.FC<
  PageProps<Queries.SingleArticleQuery>
> = (props) => {
  const article = props.data.graphCmsArticle;
  if (!article) {
    return (
      <Unsupported
        component="Cms article layout"
        message="Article does not exist"
      />
    );
  }

  const articleType = article.articleType;
  if (!articleType) {
    return (
      <Unsupported
        component="Cms article layout"
        message={`Article ${article.slug} has no article type`}
      />
    );
  }

  const template =
    article.template ?? articleType.articleTemplate ?? articleType.template;
  return (
    <ArticleContext.Provider value={{ article }}>
      <div
        className={lookupColourClassNames(
          article.backgroundColour ??
            articleType.backgroundColour ??
            template?.backgroundColour,
          article.textColour ?? articleType.textColour ?? template?.textColour,
        )}
      >
        <CmsNavigationMenu
          page={article.menu ?? articleType.menu ?? template?.menu}
        />
        <Slice alias="analytics" />
        <CmsContent
          fragment={combineComponents(
            article.topContent || articleType.articleTopContent,
            template?.preContent,
            article.content,
            template?.postContent,
          )}
        />

        <CmsFooter
          page={article.footer ?? articleType.footer ?? template?.footer}
        />
      </div>
    </ArticleContext.Provider>
  );
};
