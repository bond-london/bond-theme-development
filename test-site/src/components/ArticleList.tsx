import { calculateArticleLinkPath } from "@/cms/CmsArticle";
import { BondVisual, Section } from "@bond-london/gatsby-theme";
import { ColourName, lookupColourClassNames } from "@colors";
import React from "react";
import { SimpleLink } from "./LinkOrButton";

const ArticleListEntry: React.FC<{
  article: Queries.CmsArticleLinkFragment;
}> = ({ article }) => {
  const { id, title } = article;
  const { to, visual, heading, postHeading } =
    calculateArticleLinkPath(article);
  return (
    <SimpleLink
      link={{ id, name: title, internal: to }}
      className="flex flex-col gap-y-xs my-xxs"
    >
      {visual && (
        <BondVisual visual={visual} simple={true} imgClassName="w-full" />
      )}
      {(heading ?? title) && (
        <h3 className="p2">
          {heading ?? title}
          {postHeading && <span className="lighter">&nbsp;{postHeading}</span>}
        </h3>
      )}
    </SimpleLink>
  );
};

export const ArticleList: React.FC<{
  textColour?: ColourName | null;
  backgroundColour?: ColourName | null;
  articles: ReadonlyArray<Queries.CmsArticleLinkFragment>;
  showNoArticles?: boolean;
}> = ({ backgroundColour, textColour, articles, showNoArticles = true }) => {
  if (articles.length === 0) {
    if (!showNoArticles) return null;
    return (
      <Section
        componentName="Article List (Empty)"
        sectionClassName={lookupColourClassNames(backgroundColour, textColour)}
      >
        <h2 className="h2 col-span-full">No articles found</h2>
      </Section>
    );
  }
  return (
    <Section
      componentName="Article List"
      contentClassName="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-x-mobile-gap gap-y-xs my-xs"
      sectionClassName={lookupColourClassNames(backgroundColour, textColour)}
    >
      {articles.map((a) => (
        <ArticleListEntry key={a.id} article={a} />
      ))}
    </Section>
  );
};
