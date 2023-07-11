import { Section } from "@bond-london/gatsby-theme";
import { IComponentInformation } from "./GenericComponent";
import React, { useContext } from "react";
import { lookupColourClassNames } from "@colors";
import { ArticleContext } from "@/cms/CmsArticleLayout";
import { Link } from "gatsby";
import { getTagPath } from "@/cms/CmsTag";
import { IRichTextInformation } from "@bond-london/graphcms-rich-text";
import { RTF } from "./RTF";
import classNames from "classnames";

const ArticleDetails: React.FC<{
  client: string;
  body?: IRichTextInformation;
}> = ({ client, body }) => {
  const { article } = useContext(ArticleContext);
  if (!article) return null;
  const tags = article?.tags;
  const hasTags = tags && tags.length > 0;
  return (
    <div
      className={classNames(
        "col-span-full border-t border-t-current grid grid-cols-1 mt-xs pt-xxs grid-gap gap-y-s",
        body ? "laptop:grid-cols-[1fr_1fr]" : "laptop:grid-cols-[1fr_2fr]",
      )}
    >
      <div className="col-start-1">
        <h3 className="p2">{body ? "Project description" : "Client"}</h3>
        {body ? (
          <RTF
            content={body}
            className="p2 lighter laptop:mr-laptop-half-col"
          />
        ) : (
          <p className="p2 lighter">{client}</p>
        )}
      </div>
      {hasTags && (
        <div className="laptop:col-start-2">
          <h3 className="p2">Contributions</h3>
          <ul className="laptop:columns-2 laptop:grid-gap p2 no-underline">
            {tags.map((tag) => {
              const { to } = getTagPath(tag);
              return (
                <li key={tag.id} className="lighter">
                  <Link to={to}>{tag.title}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

const ArticleInfoComponent: React.FC<{
  information: IComponentInformation;
}> = ({
  information: {
    name,
    heading,
    postHeading,
    textColour,
    backgroundColour,
    body,
  },
}) => {
  return (
    <Section
      componentName="Article info"
      sectionClassName={lookupColourClassNames(backgroundColour, textColour)}
      contentClassName="my-m laptop:my-xl"
    >
      {heading && <h1 className="h1 col-span-full">{heading}</h1>}
      {postHeading && (
        <h2 className="h1 lighter col-span-full">{postHeading}</h2>
      )}
      <ArticleDetails client={name} body={body} />
    </Section>
  );
};

export default ArticleInfoComponent;
