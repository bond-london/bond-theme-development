import { graphql, HeadFC } from "gatsby";
import React from "react";
import { PageHead } from "../../components/PageHead";
import { AnimationsLayout } from "../../layouts/AnimationsLayout";

// eslint-disable-next-line import/no-unused-modules
export default AnimationsLayout;

// eslint-disable-next-line import/no-unused-modules
export const AnimationsQuery = graphql`
  query AllAnimations {
    allGatsbyAnimation(limit: 2) {
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

// eslint-disable-next-line import/no-unused-modules
export const Head: HeadFC = (props) => (
  <PageHead headProps={props} page={{ title: "All animations" }} />
);
