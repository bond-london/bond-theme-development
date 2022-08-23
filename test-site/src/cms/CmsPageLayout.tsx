import { graphql, PageProps } from "gatsby";
import React from "react";
import { CmsComponents } from "./CmsComponents";

export const CmsPageLayout: React.FC<PageProps<Queries.SinglePageQuery>> = (
  props
) => {
  const page = props.data.graphCmsPage;
  if (!page) {
    throw new Error("Page does not exist");
  }
  return (
    <div>
      <CmsComponents fragments={page.topComponents as any} />
      <CmsComponents fragments={page.content as any} />
      <pre>{JSON.stringify(props, undefined, 2)}</pre>
    </div>
  );
};

export const PageFragment = graphql`
  fragment Page on GraphCMS_Page {
    id
    slug
    topComponents {
      __typename
      ...CmsHeroExperiment
    }
    content {
      __typename
      ...CmsHeroExperiment
    }
  }
`;
