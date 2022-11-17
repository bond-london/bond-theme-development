import React from "react";
import { CmsCollection } from "./CmsCollection";
import { CmsComponent } from "./CmsComponent";

export type ContentFragment =
  | Queries.CmsComponentFragment
  | Queries.CmsCollectionFragment;

const SingleCmsContent: React.FC<{ fragment: ContentFragment }> = ({
  fragment,
}) => {
  switch (fragment.__typename) {
    case "GraphCMS_Collection":
      return <CmsCollection fragment={fragment} />;
    case "GraphCMS_Component":
      return <CmsComponent fragment={fragment} />;
  }
};

export const CmsContent: React.FC<{
  fragment: ReadonlyArray<ContentFragment>;
}> = ({ fragment }) => {
  return (
    <>
      {fragment.map((f) => (
        <SingleCmsContent key={f.id} fragment={f} />
      ))}
    </>
  );
};
