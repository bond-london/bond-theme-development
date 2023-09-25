import { RTF } from "@/components/RTF";
import {
  ClassNameOverrides,
  IRichTextInformation,
} from "@bond-london/graphcms-rich-text";
import classNames from "classnames";
import React from "react";

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
      className={classNames(
        className ?? "col-span-full",
        contentClassName,
        fontClassName,
      )}
    />
  );
};
