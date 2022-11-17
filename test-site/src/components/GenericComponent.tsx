import React from "react";

export const GenericComponent: React.FC<{
  fragment: Queries.CmsComponentFragment;
}> = ({ fragment }) => {
  return (
    <pre>
      Component: {fragment.heading} ({fragment.componentType})
    </pre>
  );
};
