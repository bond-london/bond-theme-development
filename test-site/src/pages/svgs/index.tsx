import { graphql, HeadFC } from "gatsby";
import React from "react";
import { PageHead } from "../../components/PageHead";
import { SvgsLayout } from "../../layouts/SvgsLayout";

export default SvgsLayout;

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

export const Head: HeadFC = (props) => (
  <PageHead headProps={props} page={{ title: "All svgs" }} />
);
