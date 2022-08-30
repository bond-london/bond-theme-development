import React from "react";
import { CmsComponent, ComponentFragment } from "./CmsComponent";

export const CmsComponents: React.FC<{
  readonly fragments: ReadonlyArray<ComponentFragment> | null;
}> = ({ fragments }) => {
  if (!fragments) return null;
  return (
    <>
      {fragments.map((f) => (
        <CmsComponent key={f.id} fragment={f} />
      ))}
    </>
  );
};
