import { Unsupported } from "@bond-london/graphcms-rich-text/src/Unsupported";
import { PageProps, Slice } from "gatsby";
import React from "react";
import { combineComponents } from "@/utils";
import { CmsContent } from "./CmsContent";
import { CmsFooter } from "./CmsFooter";
import { CmsNavigationMenu } from "./CmsNavigationMenu";

export const CmsPageLayout: React.FC<PageProps<Queries.SinglePageQuery>> = (
  props,
) => {
  const page = props.data.graphCmsPage;
  if (!page) {
    return <Unsupported component="Cms page layout" message="No page" />;
  }
  const { template, menu, footer, topContent, content } = page;

  return (
    <>
      <CmsNavigationMenu page={menu || template?.menu} />
      <Slice alias="analytics" />

      <CmsContent
        fragment={combineComponents(
          topContent,
          template?.preContent,
          content,
          template?.postContent,
        )}
      />

      <CmsFooter page={footer || template?.footer} />
    </>
  );
};
