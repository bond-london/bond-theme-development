import { graphql } from "gatsby";
import { VideosLayout } from "../../layouts/VideosLayout";

// eslint-disable-next-line import/no-unused-modules
export default VideosLayout;

// eslint-disable-next-line import/no-unused-modules
export const VideosQuery = graphql`
  query AllVideos {
    allGatsbyVideo(limit: 2) {
      constrained: nodes {
        ...ConstrainedVideo
      }
      fixed: nodes {
        ...FixedVideo
      }
      fullWidth: nodes {
        ...FullWidthVideo
      }
      mutedConstrained: nodes {
        ...MutedConstrainedVideo
      }
      mutedFixed: nodes {
        ...MutedFixedVideo
      }
      mutedFullWidth: nodes {
        ...MutedFullWidthVideo
      }
    }
  }
`;
