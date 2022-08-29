import { graphql, PageProps } from "gatsby";
import React, { useEffect, useState } from "react";
import { CmsComponents } from "./CmsComponents";
import { useClientOnly } from "@bond-london/gatsby-graphcms-components";

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
      <CmsComponents fragments={page.topComponents as any} />
      <CmsComponents fragments={page.content as any} />
      {isClient && <pre>{JSON.stringify(props, undefined, 2)}</pre>}
    </div>
  );
};

export const PageFragment = graphql`
  fragment Page on GraphCMS_Page {
    id
    slug
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
