import { graphql } from "gatsby";

export const MutedConstrainedVideoFragment = graphql`
  fragment MutedConstrainedVideo on GatsbyVideo {
    id
    transformed(layout: CONSTRAINED, muted: true)
  }
`;

export const MutedFixedVideoFragment = graphql`
  fragment MutedFixedVideo on GatsbyVideo {
    id
    transformed(layout: FIXED, muted: true)
  }
`;

export const MutedFullWidthVideoFragment = graphql`
  fragment MutedFullWidthVideo on GatsbyVideo {
    id
    transformed(layout: FULL_WIDTH, muted: true)
  }
`;

export const ConstrainedVideoFragment = graphql`
  fragment ConstrainedVideo on GatsbyVideo {
    id
    transformed(layout: CONSTRAINED, muted: false)
  }
`;

export const FixedVideoFragment = graphql`
  fragment FixedVideo on GatsbyVideo {
    id
    transformed(layout: FIXED, muted: false)
  }
`;

export const FullWidthVideoFragment = graphql`
  fragment FullWidthVideo on GatsbyVideo {
    id
    transformed(layout: FULL_WIDTH, muted: false)
  }
`;

export const MutedConstrainedVideoFileFragment = graphql`
  fragment MutedConstrainedVideoFile on File {
    id
    childGatsbyVideo {
      ...MutedConstrainedVideo
    }
  }
`;

export const MutedFixedVideoFileFragment = graphql`
  fragment MutedFixedVideoFile on File {
    id
    childGatsbyVideo {
      ...MutedFixedVideo
    }
  }
`;

export const MutedFullWidthVideoFileFragment = graphql`
  fragment MutedFullWidthVideoFile on File {
    id
    childGatsbyVideo {
      ...MutedFullWidthVideo
    }
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
