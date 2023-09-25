import React from "react";
import { CmsComponent } from "./CmsComponent";

export const CmsContent: React.FC<{
  fragment?: ReadonlyArray<Queries.CmsComponentFragment>;
  offset: number;
  isFirst: boolean;
  isLast: boolean;
}> = ({ fragment, offset, isFirst, isLast }) => {
  if (!fragment) return null;
  return (
    <>
      {fragment.map((f, index, array) => (
        <CmsComponent
          key={f.id}
          fragment={f}
          index={offset + index}
          isFirst={isFirst && offset + index === 0}
          isLast={isLast && index === array.length - 1}
        />
      ))}
    </>
  );
};
