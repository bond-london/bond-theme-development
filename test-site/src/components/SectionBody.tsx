import {
  ClassNameOverrides,
  IRichTextInformation,
} from "@bond-london/graphcms-rich-text";
import classNames from "classnames";
import React from "react";
import { RTF } from "../components/RTF";
import { SectionBodyClassName } from "../styles";

export const SectionBody: React.FC<{
  content: IRichTextInformation;
  className?: string;
  contentClassName?: string;
  projectClassNameOverrides?: ClassNameOverrides;
}> = ({
  content,
  className,
  projectClassNameOverrides,
  contentClassName = "flex flex-col gap-y-xs",
}) => {
  return (
    <RTF
      content={content}
      projectClassNameOverrides={projectClassNameOverrides}
      className={classNames(
        className || SectionBodyClassName,
        contentClassName
      )}
    />
  );
};
