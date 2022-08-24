import { graphql } from "gatsby";
import { ImagesLayout } from "../../layouts/ImagesLayout";

export default ImagesLayout;

export const AllImagesQuery = graphql`
  query AllImages {
    allImageSharp {
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
