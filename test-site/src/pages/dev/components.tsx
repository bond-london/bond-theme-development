import { Section } from "@bond-london/gatsby-theme";
import slugify from "@sindresorhus/slugify";
import { graphql, Link, PageProps } from "gatsby";
import React from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { DevPageLayout } from "@/layouts/DevPageLayout";

const ComponentsPage: React.FC<PageProps<Queries.ComponentsQuery>> = (
  props,
) => {
  const components = props.data.allGraphCmsComponent.distinct;

  return (
    <DevPageLayout name="All components">
      <Section componentName="Introduction">
        <SectionHeading heading="All component types" />
        <ul className="col-span-full my-m flex gap-x-l gap-y-m">
          {components.map((component) => (
            <li key={component}>
              <Link to={`../component/${slugify(component)}`}>{component}</Link>
            </li>
          ))}
        </ul>
      </Section>
    </DevPageLayout>
  );
};

// eslint-disable-next-line import/no-unused-modules
export default ComponentsPage;

// eslint-disable-next-line import/no-unused-modules
export const ComponentsQuery = graphql`
  query Components {
    allGraphCmsComponent {
      distinct(field: { componentType: SELECT })
    }
  }
`;
