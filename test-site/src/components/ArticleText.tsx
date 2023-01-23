import { Section } from "@bond-london/gatsby-theme";
import { ClassNameOverrides } from "@bond-london/graphcms-rich-text";
import classNames from "classnames";
import React, { useContext } from "react";
import { ArticleContext } from "../cms/CmsArticleLayout";
import { lookupColourClassNames } from "../colors";
import { SectionBodyClassName, SectionSpacingClassName } from "../styles";
import { DateElement } from "./Date";
import { IComponentInformation } from "./GenericComponent";
import { defaultProjectClassNameOverrides } from "./RTF";
import { SectionBody } from "./SectionBody";
import { SectionHeading } from "./SectionHeading";
import { SectionIcon } from "./SectionIcon";
import { SectionLinks } from "./SectionLinks";

const projectClassNameOverrides: ClassNameOverrides = {
  ...defaultProjectClassNameOverrides,
  h2: "h2 mb-xs",
  h3: "h3 mb-xs",
  h4: "h4 mb-xs",
  div: "p2",
};

export const ArticleText: React.FC<{
  information: IComponentInformation;
}> = ({ information }) => {
  const {
    backgroundColour,
    textColour,
    preHeading,
    heading,
    postHeading,
    body,
    icon,
    links,
  } = information;
  const { article } = useContext(ArticleContext);
  return (
    <Section
      componentName={`Article Text`}
      sectionClassName={classNames(
        lookupColourClassNames(backgroundColour, textColour),
        SectionSpacingClassName
      )}
      contentClassName="grid grid-cols-1 laptop:mx-laptop-1-gap-cols gap-y-xs laptop:gap-y-s"
    >
      <SectionHeading
        className="text-left"
        preHeading={preHeading}
        preHeadingFontClassName="text-blue p3"
        heading={heading}
        headingFontClassName="h2"
        postHeading={postHeading}
      />
      {article?.date && (
        <p className="p3 text-blue">
          <DateElement date={article.date} />
        </p>
      )}
      {body && (
        <SectionBody
          content={body}
          projectClassNameOverrides={projectClassNameOverrides}
        />
      )}
      {icon && <SectionIcon icon={icon} className={SectionBodyClassName} />}
      {links && <SectionLinks links={links} />}
    </Section>
  );
};
