import { graphql } from "gatsby";
import { VideosLayout } from "../../layouts/VideosLayout";

// eslint-disable-next-line import/no-unused-modules
export default VideosLayout;

// eslint-disable-next-line import/no-unused-modules
export const VideosQuery = graphql`
  query AllVideos {
    allGatsbyVideo(sort: { fields: base___name }) {
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
