import React from "react";
import { graphql, PageProps } from "gatsby";
import { CmsComponent } from "../../../cms/CmsComponent";

const SingleComponentPage: React.FC<
  PageProps<
    Queries.SingleComponentQuery,
    {
      componentType: Queries.CmsComponentFragment["componentType"];
      id: string;
    }
  >
> = (props) => {
  const component = props.data.graphCmsComponent;
  if (!component) throw new Error("No component");
  return <CmsComponent fragment={component} />;
};

// eslint-disable-next-line import/no-unused-modules
export default SingleComponentPage;

// eslint-disable-next-line import/no-unused-modules
export const SingleComponentQuery = graphql`
  query SingleComponent($id: String!) {
    graphCmsComponent(id: { eq: $id }) {
      ...CmsComponent
    }
  }
`;
