import React from "react";
import { CmsHero } from "./CmsHero";
import { CmsTextBlock } from "./CmsTextBlock";

export type ComponentFragment =
  | Queries.CmsHeroFragment
  | Queries.CmsTextBlockFragment
  | Queries.FullWidthCmsAnimationComponentFragment
  | Queries.FullWidthCmsImageComponentFragment
  | Queries.FullWidthCmsVideoComponentFragment;

export const CmsComponent: React.FC<{ fragment: ComponentFragment }> = ({
  fragment,
}) => {
  const typename = fragment.__typename;
  switch (typename) {
    case "GraphCMS_Hero":
      return <CmsHero fragment={fragment} />;
    case "GraphCMS_TextBlock":
      return <CmsTextBlock fragment={fragment.richText} />;
  }
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error(`Component type ${typename} is not handled`);
};
