import { Section } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import { Link } from "gatsby";
import React from "react";
import { calculateArticleLinkPath } from "@/cms/CmsArticle";
import { ColourName, lookupColourClassNames } from "@colors";
import { SectionSpacingClassName } from "@/styles";
import { DateElement } from "./Date";

const CustomArticleListEntry: React.FC<{
  article: Queries.CmsArticleLinkFragment;
}> = ({ article }) => {
  const { title, description, date } = article;
  const path = calculateArticleLinkPath(article)?.to;
  return (
    <div className="flex flex-col gap-y-xs">
      <p className="h3">/</p>
      <h3 className="h4">{title}</h3>
      <p className="p3">{description}</p>
      <p className="p3">
        <DateElement date={date} />
      </p>
      <Link className="button self-start" to={path}>
        Read more
      </Link>
    </div>
  );
};

export const CustomArticleList: React.FC<{
  customName: string;
  textColour?: ColourName | null;
  backgroundColour?: ColourName | null;
  articles: ReadonlyArray<Queries.CmsArticleLinkFragment>;
}> = ({ customName, backgroundColour, textColour, articles }) => {
  if (articles.length === 0) {
    return (
      <Section
        componentName="No articles"
        sectionClassName={lookupColourClassNames(backgroundColour, textColour)}
      >
        <h2>No {customName} articles found</h2>
      </Section>
    );
  }
  return (
    <Section
      sectionClassName={classNames(
        SectionSpacingClassName,
        lookupColourClassNames(backgroundColour, textColour),
      )}
      componentName={`Custom ${customName} Articles`}
      contentClassName="grid grid-cols-1 tablet:grid-cols-2 laptop:mx-laptop-1-gap-cols laptop:gap-x-laptop-2-gap-cols gap-y-s laptop:gap-y-l"
    >
      <h3 className="h2 col-span-full text-center">
        Custom articles for {customName}
      </h3>

      {articles.map((a) => (
        <CustomArticleListEntry key={a.id} article={a} />
      ))}
    </Section>
  );
};
