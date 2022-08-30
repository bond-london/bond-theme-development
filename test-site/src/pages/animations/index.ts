import { graphql } from "gatsby";
import { AnimationsLayout } from "../../layouts/AnimationsLayout";

// eslint-disable-next-line import/no-unused-modules
export default AnimationsLayout;

// eslint-disable-next-line import/no-unused-modules
export const AnimationsQuery = graphql`
  query AllAnimations {
    allGatsbyAnimation {
      constrained: nodes {
        ...ConstrainedAnimation
      }
      fixed: nodes {
        ...FixedAnimation
      }
      fullWidth: nodes {
        ...FullWidthAnimation
      }
    }
  }
`;
