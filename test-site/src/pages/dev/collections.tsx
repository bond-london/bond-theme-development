import { Section } from "@bond-london/gatsby-theme";
import slugify from "@sindresorhus/slugify";
import { graphql, Link, PageProps } from "gatsby";
import React from "react";
import { SectionHeading } from "../../components/SectionHeading";
import { DevPageLayout } from "../../layouts/DevPageLayout";

const CollectionsPage: React.FC<PageProps<Queries.CollectionsQuery>> = (
  props
) => {
  const collections = props.data.allGraphCmsCollection.distinct;

  return (
    <DevPageLayout name="All collections">
      <Section componentName="Introduction">
        <SectionHeading heading="All collection types" />
        <ul className="col-span-full my-m flex gap-x-l gap-y-m">
          {collections.map((collection) => (
            <li key={collection}>
              <Link to={`../collection/${slugify(collection)}`}>
                {collection}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </DevPageLayout>
  );
};

// eslint-disable-next-line import/no-unused-modules
export default CollectionsPage;

// eslint-disable-next-line import/no-unused-modules
export const CollectionsQuery = graphql`
  query Collections {
    allGraphCmsCollection {
      distinct(field: { collectionType: SELECT })
    }
  }
`;
