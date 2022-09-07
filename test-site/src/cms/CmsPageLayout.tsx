import { graphql, HeadProps, PageProps } from "gatsby";
import React from "react";
import { CmsComponents } from "./CmsComponents";
import { useClientOnly } from "@bond-london/gatsby-graphcms-components";
import { CMSHead } from "./CMSHead";

export const CmsPageLayout: React.FC<PageProps<Queries.SinglePageQuery>> = (
  props
) => {
  const page = props.data.graphCmsPage;
  const isClient = useClientOnly();
  if (!page) {
    throw new Error("Page does not exist");
  }
  return (
    <div>
      <CmsComponents
        fragments={
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
          page.topComponents as any
        }
      />
      <CmsComponents
        fragments={
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
          page.content as any
        }
      />
      {isClient && <pre>{JSON.stringify(props, undefined, 2)}</pre>}
    </div>
  );
};

// eslint-disable-next-line import/no-unused-modules
export const PageFragment = graphql`
  fragment Page on GraphCMS_Page {
    id
    slug
    title
    topComponents {
      __typename
      ...CmsHero
    }
    content {
      __typename
      ...CmsHero
    }
  }
`;

export const CmsPageHead: React.FC<HeadProps<Queries.SinglePageQuery>> = (
  props
) => (
  <CMSHead
    headProps={props}
    site={props.data.site}
    title={props.data.graphCmsPage?.title}
  />
);
