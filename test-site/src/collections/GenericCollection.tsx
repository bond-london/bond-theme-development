import React from "react";

export const GenericCollection: React.FC<{
  fragment: Queries.CmsCollectionFragment;
}> = ({ fragment }) => {
  return (
    <pre>
      Collection: {fragment.heading} ({fragment.collectionType})
    </pre>
  );
};
