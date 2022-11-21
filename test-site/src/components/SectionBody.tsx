import { getRTFInformation } from "@bond-london/graphcms-rich-text";
import classNames from "classnames";
import React from "react";
import { RTF } from "../elements/RTF";
import { SectionBodyClassName, SectionBodyGridClassName } from "../styles";

export const SectionBody: React.FC<{
  body: Queries.CmsComponentFragment["body"];
}> = ({ body }) => {
  const content = getRTFInformation(body);
  if (content) {
    return (
      <RTF
        content={content}
        className={classNames(SectionBodyClassName, "flex flex-col gap-y-xs")}
      />
    );
  }
  return null;
};
