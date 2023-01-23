import classNames from "classnames";
import { PageProps, Slice } from "gatsby";
import React, { createContext } from "react";
import { lookupColourClassNames } from "../colors";
import { CmsContent } from "./CmsContent";
import { CmsFooter } from "./CmsFooter";
import { CmsNavigationMenu } from "./CmsNavigationMenu";

interface IArticleContext {
  article?: Queries.SingleArticleQuery["graphCmsArticle"];
}

export const ArticleContext = createContext<IArticleContext>({
  article: undefined,
});

export const CmsArticleLayout: React.FC<
  PageProps<Queries.SingleArticleQuery>
> = (props) => {
  const article = props.data.graphCmsArticle;
  if (!article) {
    throw new Error("Article does not exist");
  }

  const articleType = article.articleType;
  if (!articleType) {
    throw new Error(`Article ${article.slug} has no article type`);
  }

  const template = article.template || articleType.template;
  return (
    <ArticleContext.Provider value={{ article }}>
      <div
        className={classNames(
          "overflow-hidden",
          lookupColourClassNames(
            article.backgroundColour || template?.backgroundColour,
            article.textColour || template?.textColour
          )
        )}
      >
        <CmsNavigationMenu
          page={article.menu || articleType.menu}
          template={template?.menu}
        />
        <Slice alias="analytics" />

        {template?.preContent && <CmsContent fragment={template.preContent} />}
        <CmsContent fragment={article.content} />
        {template?.postContent && (
          <CmsContent fragment={template.postContent} />
        )}

        <CmsFooter
          page={article.footer || articleType.footer}
          template={template?.footer}
        />
      </div>
    </ArticleContext.Provider>
  );
};
