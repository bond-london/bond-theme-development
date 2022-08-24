import { graphql, PageProps } from "gatsby";
import { VideosLayout } from "../../layouts/VideosLayout";

export default VideosLayout;

export const VideosQuery = graphql`
  query AllVideos {
    allGatsbyVideo {
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
