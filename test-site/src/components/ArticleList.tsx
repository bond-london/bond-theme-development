import {
  BondImage,
  convertCmsAssetToBondImage,
  Section,
} from "@bond-london/gatsby-theme";
import { Link } from "gatsby";
import React from "react";
import { calculateArticleLinkPath } from "../cms/CmsArticle";

const ArticleListEntry: React.FC<{
  article: Queries.CmsArticleLinkFragment;
}> = ({ article }) => {
  const { title, embedImage } = article;
  const bondImage = convertCmsAssetToBondImage(embedImage);
  const path = calculateArticleLinkPath(article);
  return (
    <div className="flex flex-col gap-y-xs">
      {path ? (
        <Link to={path}>
          <h3 className="h3 text-center">{title}</h3>
        </Link>
      ) : (
        <h3 className="h3 text-center">{title}</h3>
      )}
      {bondImage && <BondImage image={bondImage} />}
    </div>
  );
};

export const ArticleList: React.FC<{
  articles: ReadonlyArray<Queries.CmsArticleLinkFragment>;
}> = ({ articles }) => {
  if (articles.length === 0) {
    return (
      <Section componentName="No articles">
        <h2>No articles found</h2>
      </Section>
    );
  }
  return (
    <Section
      componentName="Articles"
      contentClassName="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-x-mobile-gap"
    >
      {articles.map((a) => (
        <ArticleListEntry key={a.id} article={a} />
      ))}
    </Section>
  );
};
