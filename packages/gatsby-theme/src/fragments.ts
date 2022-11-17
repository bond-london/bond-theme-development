import { graphql } from "gatsby";

export const ConstrainedImageFragment = graphql`
  fragment ConstrainedImage on ImageSharp {
    id
    gatsbyImageData(layout: CONSTRAINED)
  }
`;

export const FixedImageFragment = graphql`
  fragment FixedImage on ImageSharp {
    id
    gatsbyImageData(layout: FIXED)
  }
`;

export const FullWidthImageFragment = graphql`
  fragment FullWidthImage on ImageSharp {
    id
    gatsbyImageData(layout: FULL_WIDTH)
  }
`;

export const ConstrainedImageFileFragment = graphql`
  fragment ConstrainedImageFile on File {
    id
    childImageSharp {
      ...ConstrainedImage
    }
  }
`;

export const FixedImageFileFragment = graphql`
  fragment FixedImageFile on File {
    id
    childImageSharp {
      ...FixedImage
    }
  }
`;

export const FullWidthImageFileFragment = graphql`
  fragment FullWidthImageFile on File {
    id
    childImageSharp {
      ...FullWidthImage
    }
  }
`;
