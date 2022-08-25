import { graphql } from "gatsby";
import { AnimationsLayout } from "../../layouts/AnimationsLayout";

export default AnimationsLayout;

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
