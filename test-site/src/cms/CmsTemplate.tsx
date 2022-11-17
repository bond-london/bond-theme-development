import { graphql } from "gatsby";

// eslint-disable-next-line import/no-unused-modules
export const TemplateFragment = graphql`
  fragment Template on GraphCMS_Template {
    __typename
    id
    name
    preContent {
      __typename
      ...CmsComponent
      ...CmsCollection
    }
    postContent {
      __typename
      ...CmsComponent
      ...CmsCollection
    }
    backgroundColour
    textColour
  }
`;
