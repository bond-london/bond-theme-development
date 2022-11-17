import { graphql, HeadFC } from "gatsby";
import React from "react";
import { PageHead } from "../../components/PageHead";
import { ImagesLayout } from "../../layouts/ImagesLayout";

export default ImagesLayout;

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

export const Head: HeadFC = (props) => (
  <PageHead headProps={props} page={{ title: "All images" }} />
);
