import { graphql } from "gatsby";

// eslint-disable-next-line import/no-unused-modules
export const MutedConstrainedVideoFragment = graphql`
  fragment MutedConstrainedVideo on GatsbyVideo {
    id
    transformed(layout: CONSTRAINED, muted: true)
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const MutedFixedVideoFragment = graphql`
  fragment MutedFixedVideo on GatsbyVideo {
    id
    transformed(layout: FIXED, muted: true)
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const MutedFullWidthVideoFragment = graphql`
  fragment MutedFullWidthVideo on GatsbyVideo {
    id
    transformed(layout: FULL_WIDTH, muted: true)
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const ConstrainedVideoFragment = graphql`
  fragment ConstrainedVideo on GatsbyVideo {
    id
    transformed(layout: CONSTRAINED, muted: false)
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FixedVideoFragment = graphql`
  fragment FixedVideo on GatsbyVideo {
    id
    transformed(layout: FIXED, muted: false)
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FullWidthVideoFragment = graphql`
  fragment FullWidthVideo on GatsbyVideo {
    id
    transformed(layout: FULL_WIDTH, muted: false)
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const MutedConstrainedVideoFileFragment = graphql`
  fragment MutedConstrainedVideoFile on File {
    id
    childGatsbyVideo {
      ...MutedConstrainedVideo
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const MutedFixedVideoFileFragment = graphql`
  fragment MutedFixedVideoFile on File {
    id
    childGatsbyVideo {
      ...MutedFixedVideo
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const MutedFullWidthVideoFileFragment = graphql`
  fragment MutedFullWidthVideoFile on File {
    id
    childGatsbyVideo {
      ...MutedFullWidthVideo
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const ConstrainedVideoFileFragment = graphql`
  fragment ConstrainedVideoFile on File {
    id
    childGatsbyVideo {
      ...ConstrainedVideo
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FixedVideoFileFragment = graphql`
  fragment FixedVideoFile on File {
    id
    childGatsbyVideo {
      ...FixedVideo
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FullWidthVideoFileFragment = graphql`
  fragment FullWidthVideoFile on File {
    id
    childGatsbyVideo {
      ...FullWidthVideo
    }
  }
`;
