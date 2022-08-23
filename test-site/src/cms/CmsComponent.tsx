import React from "react";
import { CmsHero } from "./CmsHero";
import { CmsHeroExperiment } from "./CmsHeroExperiment";

export type ComponentFragment = Queries.CmsHeroExperimentFragment;

export const CmsComponent: React.FC<{ fragment: ComponentFragment }> = ({
  fragment,
}) => {
  switch (fragment.__typename) {
    case "GraphCMS_Hero":
      return <CmsHeroExperiment fragment={fragment} />;
  }
  return null;
};
