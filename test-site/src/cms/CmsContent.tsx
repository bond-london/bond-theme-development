import React from "react";
import { CmsComponent } from "./CmsComponent";

export const CmsContent: React.FC<{
  fragment?: ReadonlyArray<Queries.CmsComponentFragment>;
  offset?: number;
  isLast?: boolean;
}> = ({ fragment, offset = 0, isLast = true }) => {
  if (!fragment) return null;
  return (
    <>
      {fragment.map((f, index, array) => (
        <CmsComponent
          key={f.id}
          fragment={f}
          index={offset + index}
          isFirst={offset + index === 0}
          isLast={isLast && index === array.length - 1}
        />
      ))}
    </>
  );
};
