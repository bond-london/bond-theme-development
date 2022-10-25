import { HeadProps, PageProps } from "gatsby";
import React from "react";
import { CmsComponents } from "./CmsComponents";
import { CMSHead } from "./CMSHead";
import { CmsTextBlock } from "./CmsTextBlock";
// import { Analytics } from "../components/Analytics";
import { PropsDump } from "./PropsDump";

export const CmsPageLayout: React.FC<PageProps<Queries.SinglePageQuery>> = (
  props
) => {
  const page = props.data.graphCmsPage;
  if (!page) {
    throw new Error("Page does not exist");
  }

  const template = page.template;
  return (
    <>
      <pre>The heading</pre>
      {/* <Analytics /> */}

      {/* <div>
        <CmsComponents fragments={page.topComponents} />
        {template?.preContent && (
          <CmsComponents fragments={template.preContent} />
        )}
        <CmsComponents fragments={page.content} />
        <CmsTextBlock fragment={page.richText} />
        {template?.postContent && (
          <CmsComponents fragments={template.postContent} />
        )}
        <CmsComponents fragments={page.bottomComponents} />
        <PropsDump {...props} />
      </div> */}
    </>
  );
};

// eslint-disable-next-line import/no-unused-modules
export const CmsPageHead: React.FC<HeadProps<Queries.SinglePageQuery>> = (
  props
) => (
  <CMSHead
    headProps={props}
    site={props.data.site}
    title={props.data.graphCmsPage?.title}
  />
);
