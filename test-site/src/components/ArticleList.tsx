import {
  BondImage,
  convertCmsAssetToBondImage,
  Section,
} from "@bond-london/gatsby-theme";
import { Link } from "gatsby";
import React from "react";
import { calculateArticleLinkPath } from "../cms/CmsArticle";
import { ColourName, lookupColourClassNames } from "../colors";

const ArticleListEntry: React.FC<{
  article: Queries.CmsArticleLinkFragment;
}> = ({ article }) => {
  const { title, embedImage } = article;
  const bondImage = convertCmsAssetToBondImage(embedImage, {
    dontCropPng: true,
  });
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
  textColour?: ColourName | null;
  backgroundColour?: ColourName | null;
  articles: ReadonlyArray<Queries.CmsArticleLinkFragment>;
}> = ({ backgroundColour, textColour, articles }) => {
  if (articles.length === 0) {
    return (
      <Section
        componentName="No articles"
        sectionClassName={lookupColourClassNames(backgroundColour, textColour)}
      >
        <h2>No articles found</h2>
      </Section>
    );
  }
  return (
    <Section
      componentName="Articles"
      contentClassName="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-x-mobile-gap"
      sectionClassName={lookupColourClassNames(backgroundColour, textColour)}
    >
      {articles.map((a) => (
        <ArticleListEntry key={a.id} article={a} />
      ))}
    </Section>
  );
};
