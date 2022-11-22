import { IRichTextInformation } from "@bond-london/graphcms-rich-text";
import classNames from "classnames";
import React from "react";
import { RTF } from "../elements/RTF";
import { SectionBodyClassName, SectionBodyGridClassName } from "../styles";

export const SectionBody: React.FC<{
  content: IRichTextInformation;
}> = ({ content }) => {
  return (
    <RTF
      content={content}
      className={classNames(SectionBodyClassName, "flex flex-col gap-y-xs")}
    />
  );
};
