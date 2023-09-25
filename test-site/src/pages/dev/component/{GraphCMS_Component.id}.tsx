import { CmsComponent } from "@/cms/CmsComponent";
import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import { graphql, PageProps } from "gatsby";
import React from "react";

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
  if (!component) {
    return (
      <Unsupported
        component="Single component"
        message="Component does not exist"
      />
    );
  }
  return (
    <CmsComponent fragment={component} index={0} isFirst={true} isLast={true} />
  );
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
