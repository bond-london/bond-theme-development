import { IRichTextInformation } from "@bond-london/graphcms-rich-text";
import classNames from "classnames";
import React from "react";
import { RTF } from "../components/RTF";
import { SectionBodyClassName } from "../styles";

export const SectionBody: React.FC<{
  content: IRichTextInformation;
  className?: string;
}> = ({ content, className }) => {
  return (
    <RTF
      content={content}
      className={classNames(
        className || SectionBodyClassName,
        "flex flex-col gap-y-xs"
      )}
    />
  );
};
