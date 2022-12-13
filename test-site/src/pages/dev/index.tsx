import { IPageMetadata } from "@bond-london/gatsby-theme";
import { HeadFC, Slice } from "gatsby";
import React from "react";
import { PageHead } from "../../components/PageHead";

const DevIndex: React.FC = () => {
  return (
    <>
      <Slice alias="navigation-Menu" />
      <Slice alias="analytics" />
      <Slice alias="footer-Footer" />
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
