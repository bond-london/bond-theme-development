import { IPageMetadata } from "@bond-london/gatsby-theme";
import { HeadFC } from "gatsby";
import React from "react";
import { PageHead } from "@/components/PageHead";
import { DevPageLayout } from "@/layouts/DevPageLayout";

const DevIndex: React.FC = () => {
  return (
    <>
      <DevPageLayout name="Dev Page Index" />
    </>
  );
};

// eslint-disable-next-line import/no-unused-modules
export default DevIndex;

// eslint-disable-next-line import/no-unused-modules
export const Head: HeadFC = (props) => {
  const pageMetadata: IPageMetadata = {
    title: "Dev page",
    noIndex: true,
    description: "Main development page",
  };

  return <PageHead headProps={props} page={pageMetadata} />;
};
