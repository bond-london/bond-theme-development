import React, { Fragment } from "react";
import { graphql, Link, PageProps } from "gatsby";
import { DevPageLayout } from "../../../layouts/DevPageLayout";
import { Section } from "@bond-london/gatsby-theme";
import { SectionHeading } from "../../../components/SectionHeading";
import { CmsCollection } from "../../../cms/CmsCollection";
import slugify from "@sindresorhus/slugify";

const CollectionTypePage: React.FC<
  PageProps<
    Queries.CollectionTypeQuery,
    { collectionType: Queries.CmsCollectionFragment["collectionType"] }
  >
> = (props) => {
  const collections = props.data.allGraphCmsCollection.nodes;
  return (
    <DevPageLayout name={props.pageContext.collectionType}>
      <Section componentName="Introduction">
        <SectionHeading
          heading={`All collections of type: "${props.pageContext.collectionType}"`}
        />
      </Section>
      {collections.map((collection) => (
        <Fragment key={collection.id}>
          <Link
            to={`/dev/collection/${slugify(collection.id)}`}
            className="block mb-m mt-xl w-full h3h text-center underline"
          >
            {collection.heading} ({collection.id})
          </Link>
          <CmsCollection fragment={collection} />
        </Fragment>
      ))}
    </DevPageLayout>
  );
};

// eslint-disable-next-line import/no-unused-modules
export default CollectionTypePage;

// eslint-disable-next-line import/no-unused-modules
export const CollectionTypeQuery = graphql`
  query CollectionType($collectionType: GraphCMS_CollectionType!) {
    allGraphCmsCollection(filter: { collectionType: { eq: $collectionType } }) {
      nodes {
        ...CmsCollection
      }
    }
  }
`;
