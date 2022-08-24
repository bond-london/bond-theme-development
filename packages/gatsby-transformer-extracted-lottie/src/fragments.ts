import { graphql } from "gatsby";

// eslint-disable-next-line import/no-unused-modules
export const ConstrainedAnimationFragment = graphql`
  fragment ConstrainedAnimation on GatsbyAnimation {
    id
    extracted(layout: CONSTRAINED)
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FixedAnimationFragment = graphql`
  fragment FixedAnimation on GatsbyAnimation {
    id
    extracted(layout: FIXED)
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FullWidthAnimationFragment = graphql`
  fragment FullWidthAnimation on GatsbyAnimation {
    id
    extracted(layout: FULL_WIDTH)
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const ConstrainedAnimationFileFragment = graphql`
  fragment ConstrainedAnimationFile on File {
    id
    childGatsbyAnimation {
      ...ConstrainedAnimation
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FixedAnimationFileFragment = graphql`
  fragment FixedAnimationFile on File {
    id
    childGatsbyAnimation {
      ...FixedAnimation
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FullWidthAnimationFileFragment = graphql`
  fragment FullWidthAnimationFile on File {
    id
    childGatsbyAnimation {
      ...FullWidthAnimation
    }
  }
`;
