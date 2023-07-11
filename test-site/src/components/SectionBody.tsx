import {
  ClassNameOverrides,
  IRichTextInformation,
} from "@bond-london/graphcms-rich-text";
import classNames from "classnames";
import React from "react";
import { RTF } from "@/components/RTF";

export const SectionBody: React.FC<{
  content: IRichTextInformation;
  className?: string;
  contentClassName?: string;
  projectClassNameOverrides?: ClassNameOverrides;
  fontClassName?: string;
}> = ({
  content,
  className,
  projectClassNameOverrides,
  contentClassName = "grid grid-flow-row wrap-anywhere",
  fontClassName = "p2",
}) => {
  return (
    <RTF
      content={content}
      projectClassNameOverrides={projectClassNameOverrides}
      className={classNames(className, contentClassName, fontClassName)}
    />
  );
};
