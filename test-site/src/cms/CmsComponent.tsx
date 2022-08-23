import React from "react";
import { CmsHero } from "./CmsHero";

export type ComponentFragment = Queries.CmsHeroFragment;

export const CmsComponent: React.FC<{ fragment: ComponentFragment }> = ({
  fragment,
}) => {
  switch (fragment.__typename) {
    case "GraphCMS_Hero":
      return <CmsHero fragment={fragment} />;
  }
  return null;
};
