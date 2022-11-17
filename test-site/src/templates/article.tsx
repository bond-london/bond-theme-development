import { HeadFC } from "gatsby";
import React from "react";
import { PageHead } from "../components/PageHead";

const Article: React.FC = () => <h1>Article would go here</h1>;

// eslint-disable-next-line import/no-unused-modules
export default Article;

export const Head: HeadFC = (props) => (
  <PageHead headProps={props} page={{ title: "Missing article" }} />
);
