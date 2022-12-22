import { graphql, SliceComponentProps } from "gatsby";
import React from "react";
import { Footer } from "../components/Navigation/Footer";
import { convertCmsNavigation } from "./CmsNavigation";

const CmsFooter: React.FC<SliceComponentProps<Queries.FooterQuery>> = ({
  data: { graphCmsNavigation },
}) => {
  if (!graphCmsNavigation) throw new Error("No navigation for footer");
  return <Footer menu={convertCmsNavigation(graphCmsNavigation)} />;
};

// eslint-disable-next-line import/no-unused-modules
export default CmsFooter;

// eslint-disable-next-line import/no-unused-modules
export const query = graphql`
  query Footer($name: String) {
    graphCmsNavigation(name: { eq: $name }) {
      ...CmsNavigation
    }
  }
`;
