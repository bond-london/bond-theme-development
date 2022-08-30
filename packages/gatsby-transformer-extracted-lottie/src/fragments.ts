import { graphql } from "gatsby";

export const ConstrainedAnimationFragment = graphql`
  fragment ConstrainedAnimation on GatsbyAnimation {
    id
    extracted(layout: CONSTRAINED)
  }
`;

export const FixedAnimationFragment = graphql`
  fragment FixedAnimation on GatsbyAnimation {
    id
    extracted(layout: FIXED)
  }
`;

export const FullWidthAnimationFragment = graphql`
  fragment FullWidthAnimation on GatsbyAnimation {
    id
    extracted(layout: FULL_WIDTH)
  }
`;

export const ConstrainedAnimationFileFragment = graphql`
  fragment ConstrainedAnimationFile on File {
    id
    childGatsbyAnimation {
      ...ConstrainedAnimation
    }
  }
`;

export const FixedAnimationFileFragment = graphql`
  fragment FixedAnimationFile on File {
    id
    childGatsbyAnimation {
      ...FixedAnimation
    }
  }
`;

export const FullWidthAnimationFileFragment = graphql`
  fragment FullWidthAnimationFile on File {
    id
    childGatsbyAnimation {
      ...FullWidthAnimation
    }
  }
`;
