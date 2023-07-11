import { graphql } from "gatsby";

// eslint-disable-next-line import/no-unused-modules
export const TemplateFragment = graphql`
  fragment Template on GraphCMS_Template {
    __typename
    id
    name
    preContent {
      ...CmsComponent
    }
    postContent {
      ...CmsComponent
    }
    backgroundColour
    textColour
    menu {
      ...CmsNavigation
    }
    footer {
      ...CmsNavigation
    }
  }
`;
