import React, { Fragment } from "react";
import { graphql, Link, PageProps } from "gatsby";
import { DevPageLayout } from "@/layouts/DevPageLayout";
import { CmsComponent } from "@/cms/CmsComponent";
import { Section } from "@bond-london/gatsby-theme";
import { SectionHeading } from "@/components/SectionHeading";
import slugify from "@sindresorhus/slugify";

const ComponentTypePage: React.FC<
  PageProps<
    Queries.ComponentQuery,
    { componentType: Queries.CmsComponentFragment["componentType"] }
  >
> = (props) => {
  const components = props.data.allGraphCmsComponent.nodes;
  return (
    <DevPageLayout name={props.pageContext.componentType}>
      <Section componentName="Introduction">
        <SectionHeading
          heading={`All components of type: "${props.pageContext.componentType}"`}
        />
      </Section>
      {components.map((component) => (
        <Fragment key={component.id}>
          <Link
            to={`/dev/component/${slugify(component.id)}`}
            className="h3 mb-m mt-xl block w-full text-center"
          >
            {component.heading} ({component.id})
          </Link>
          <CmsComponent
            fragment={component}
            index={0}
            isFirst={true}
            isLast={true}
          />
        </Fragment>
      ))}
    </DevPageLayout>
  );
};

// eslint-disable-next-line import/no-unused-modules
export default ComponentTypePage;

// eslint-disable-next-line import/no-unused-modules
export const ComponentQuery = graphql`
  query Component($componentType: GraphCMS_ComponentType!) {
    allGraphCmsComponent(filter: { componentType: { eq: $componentType } }) {
      nodes {
        ...CmsComponent
      }
    }
  }
`;
