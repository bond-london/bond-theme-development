import { Section } from "@bond-london/gatsby-theme";
import { IRichTextInformation } from "@bond-london/graphcms-rich-text";
import React from "react";
import { RTF } from "../elements/RTF";

export const TextBlock: React.FC<{ content: IRichTextInformation }> = ({
  content,
}) => {
  return (
    <Section componentName="Text Block">
      <RTF content={content} className="col-span-full" />
    </Section>
  );
};
