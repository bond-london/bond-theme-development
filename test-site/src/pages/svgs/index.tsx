import { graphql, HeadFC } from "gatsby";
import React from "react";
import { PageHead } from "../../components/PageHead";
import { SvgsLayout } from "../../layouts/SvgsLayout";

// eslint-disable-next-line import/no-unused-modules
export default SvgsLayout;

// eslint-disable-next-line import/no-unused-modules
export const SvgsQuery = graphql`
  query AllSvgs {
    allGatsbySvg(limit: 2) {
      constrained: nodes {
        ...ConstrainedSvg
      }
      fixed: nodes {
        ...FixedSvg
      }
      fullWidth: nodes {
        ...FullWidthSvg
      }
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const Head: HeadFC = (props) => (
  <PageHead headProps={props} page={{ title: "All svgs" }} />
);
