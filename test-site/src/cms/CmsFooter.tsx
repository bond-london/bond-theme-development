import { graphql, SliceComponentProps } from "gatsby";
import React from "react";

const CmsFooter: React.FC<SliceComponentProps<Queries.FooterQuery>> = ({
  data: { graphCmsNavigation },
}) => {
  if (!graphCmsNavigation) throw new Error("No navigation for footer");
  return (
    <>
      <h1>Footer - {graphCmsNavigation.name}</h1>
    </>
  );
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
