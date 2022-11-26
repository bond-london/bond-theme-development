import { graphql, HeadFC } from "gatsby";
import React from "react";
import { PageHead } from "../../components/PageHead";
import { ImagesLayout } from "../../layouts/ImagesLayout";

// eslint-disable-next-line import/no-unused-modules
export default ImagesLayout;

// eslint-disable-next-line import/no-unused-modules
export const AllImagesQuery = graphql`
  query AllImages {
    allImageSharp(limit: 2) {
      constrained: nodes {
        ...ConstrainedImage
      }
      fixed: nodes {
        ...FixedImage
      }
      fullWidth: nodes {
        ...FullWidthImage
      }
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const Head: HeadFC = (props) => (
  <PageHead headProps={props} page={{ title: "All images" }} />
);
