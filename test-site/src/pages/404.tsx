import { IPageMetadata, Section } from "@bond-london/gatsby-theme";
import { HeadFC, Slice } from "gatsby";
import React from "react";
import { CmsFooter } from "../cms/CmsFooter";
import { CmsNavigationMenu } from "../cms/CmsNavigationMenu";
import { PageHead } from "../components/PageHead";

const Page404: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <CmsNavigationMenu />
      <Slice alias="analytics" />

      <Section componentName="Main">
        <h1 className="h1 col-span-full">Page not found</h1>
      </Section>

      <CmsFooter />
    </div>
  );
};

// eslint-disable-next-line import/no-unused-modules
export default Page404;

// eslint-disable-next-line import/no-unused-modules
export const Head: HeadFC = (props) => {
  const pageMetadata: IPageMetadata = {
    title: "Page not found",
    noIndex: true,
    description: "Missing page",
  };

  return <PageHead headProps={props} page={pageMetadata} />;
};
