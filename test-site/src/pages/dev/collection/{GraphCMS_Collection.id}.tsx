import React from "react";
import { graphql, PageProps } from "gatsby";
import { CmsCollection } from "../../../cms/CmsCollection";

const SingleCollectionPage: React.FC<
  PageProps<
    Queries.SingleCollectionQuery,
    {
      collectionType: Queries.CmsCollectionFragment["collectionType"];
      id: string;
    }
  >
> = (props) => {
  const collection = props.data.graphCmsCollection;
  if (!collection) throw new Error("No collection");
  return <CmsCollection fragment={collection} />;
};

// eslint-disable-next-line import/no-unused-modules
export default SingleCollectionPage;

// eslint-disable-next-line import/no-unused-modules
export const SingleCollectionQuery = graphql`
  query SingleCollection($id: String!) {
    graphCmsCollection(id: { eq: $id }) {
      ...CmsCollection
    }
  }
`;
