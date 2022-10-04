import { getRTFInformation } from "@bond-london/graphcms-rich-text";
import { graphql } from "gatsby";
import React from "react";
import { TextBlock } from "../components/TextBlock";

type CmsTextBlockFragment =
  | Queries.CmsTextBlockFragment["richText"]
  | Queries.CmsPageFragment["richText"]
  | null;

export const CmsTextBlock: React.FC<{
  fragment: CmsTextBlockFragment;
}> = ({ fragment }) => {
  if (!fragment) return null;
  const content = getRTFInformation(fragment);
  if (!content) {
    throw new Error("Failed to find rich text content");
  }

  return <TextBlock content={content} />;
};

// eslint-disable-next-line import/no-unused-modules
export const CmsTextBlockFragment = graphql`
  fragment CmsTextBlock on GraphCMS_TextBlock {
    __typename
    id
    richText {
      cleaned
    }
  }
`;
