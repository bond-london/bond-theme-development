import { ArticleContext } from "@/cms/CmsArticleLayout";
import { getTagPath } from "@/cms/CmsTag";
import { Section } from "@bond-london/gatsby-theme";
import { IRichTextInformation } from "@bond-london/graphcms-rich-text";
import { lookupColourClassNames } from "@colors";
import classNames from "classnames";
import { Link } from "gatsby";
import React, { useContext } from "react";
import { IComponentInformation } from "./GenericComponent";
import { RTF } from "./RTF";

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
        "grid-gap col-span-full mt-xs grid grid-cols-1 gap-y-s border-t border-t-current pt-xxs",
        body ? "laptop:grid-cols-[1fr_1fr]" : "laptop:grid-cols-[1fr_2fr]",
      )}
    >
      <div className="col-start-1">
        <h3 className="p2">{body ? "Project description" : "Client"}</h3>
        {body ? (
          <RTF
            content={body}
            className="lighter p2 laptop:mr-laptop-half-col"
          />
        ) : (
          <p className="lighter p2">{client}</p>
        )}
      </div>
      {hasTags && (
        <div className="laptop:col-start-2">
          <h3 className="p2">Contributions</h3>
          <ul className="p2 no-underline laptop:grid-gap laptop:columns-2">
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
}> = ({ information }) => {
  const { name, heading, postHeading, textColour, backgroundColour, body } =
    information;
  return (
    <Section
      componentName="Article info"
      information={information}
      sectionClassName={lookupColourClassNames(backgroundColour, textColour)}
      contentClassName="my-m laptop:my-xl"
    >
      {heading && <h1 className="h1 col-span-full">{heading}</h1>}
      {postHeading && (
        <h2 className="lighter h1 col-span-full">{postHeading}</h2>
      )}
      <ArticleDetails client={name} body={body} />
    </Section>
  );
};

export default ArticleInfoComponent;
