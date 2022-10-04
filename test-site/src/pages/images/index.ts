import { graphql } from "gatsby";
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
