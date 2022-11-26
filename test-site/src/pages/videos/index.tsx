import { graphql, HeadFC } from "gatsby";
import React from "react";
import { PageHead } from "../../components/PageHead";
import { VideosLayout } from "../../layouts/VideosLayout";

// eslint-disable-next-line import/no-unused-modules
export default VideosLayout;

// eslint-disable-next-line import/no-unused-modules
export const VideosQuery = graphql`
  query AllVideos {
    allGatsbyVideo(sort: { base: { name: ASC } }) {
      constrained: nodes {
        ...ConstrainedVideo
      }
      fixed: nodes {
        ...FixedVideo
      }
      fullWidth: nodes {
        ...FullWidthVideo
      }
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const Head: HeadFC = (props) => (
  <PageHead headProps={props} page={{ title: "All videos" }} />
);
