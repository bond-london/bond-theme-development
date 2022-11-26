import { HeadFC } from "gatsby";
import React from "react";
import { PageHead } from "../../components/PageHead";

const PageTypeList: React.FC = () => <h1>Page type list</h1>;
// eslint-disable-next-line import/no-unused-modules
export default PageTypeList;

// eslint-disable-next-line import/no-unused-modules
export const Head: HeadFC = (props) => (
  <PageHead headProps={props} page={{ title: "Missing tag" }} />
);
