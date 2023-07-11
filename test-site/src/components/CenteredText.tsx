import { BondVisual, Section } from "@bond-london/gatsby-theme";
import { ClassNameOverrides } from "@bond-london/graphcms-rich-text";
import classNames from "classnames";
import React, { useContext } from "react";
import { ArticleContext } from "@/cms/CmsArticleLayout";
import { lookupColourClassNames } from "@colors";
import { SectionBodyClassName, SectionSpacingClassName } from "@/styles";
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
};

const CenteredText: React.FC<{
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
    visual,
  } = information;
  const { article } = useContext(ArticleContext);
  return (
    <Section
      componentName={`Centered Text`}
      sectionClassName={classNames(
        lookupColourClassNames(backgroundColour, textColour),
        SectionSpacingClassName,
      )}
      sectionGridClassName="relative w-full container-cols-grid auto-rows-auto"
      sectionRowsClassName="laptop:row-start-1 laptop:row-span-1"
      contentClassName="mt-xxl mb-m"
    >
      <SectionHeading
        className="text-right"
        preHeading={preHeading}
        preHeadingFontClassName="p3"
        headingFontClassName="h2"
        postHeading={postHeading}
      />

      <div className="flex flex-col gap-xs text-right laptop:col-start-4">
        {heading && <h1 className="h1">{heading}</h1>}
        {article?.date && (
          <p className="p3">
            <DateElement date={article.date} />
          </p>
        )}
      </div>
      {visual && (
        <div className="laptop:col-start-5">
          <BondVisual
            className="aspect-w-3 tablet:h-mobile-1-cols tablet:w-mobile-1-cols"
            visual={visual}
            simple={true}
          />
        </div>
      )}
      {body && (
        <SectionBody
          className="col-span-full self-end laptop:col-span-5 laptop:col-start-6"
          content={body}
          projectClassNameOverrides={projectClassNameOverrides}
        />
      )}

      {icon && <SectionIcon icon={icon} className={SectionBodyClassName} />}
      {links && <SectionLinks links={links} />}
    </Section>
  );
};

export default CenteredText;
