import { graphql } from "gatsby";

export const ConstrainedVideoFragment = graphql`
  fragment ConstrainedVideo on GatsbyVideo {
    id
    transformed(layout: CONSTRAINED)
  }
`;

export const FixedVideoFragment = graphql`
  fragment FixedVideo on GatsbyVideo {
    id
    transformed(layout: FIXED)
  }
`;

export const FullWidthVideoFragment = graphql`
  fragment FullWidthVideo on GatsbyVideo {
    id
    transformed(layout: FULL_WIDTH)
  }
`;

export const ConstrainedVideoFileFragment = graphql`
  fragment ConstrainedVideoFile on File {
    id
    childGatsbyVideo {
      ...ConstrainedVideo
    }
  }
`;

export const FixedVideoFileFragment = graphql`
  fragment FixedVideoFile on File {
    id
    childGatsbyVideo {
      ...FixedVideo
    }
  }
`;

export const FullWidthVideoFileFragment = graphql`
  fragment FullWidthVideoFile on File {
    id
    childGatsbyVideo {
      ...FullWidthVideo
    }
  }
`;
