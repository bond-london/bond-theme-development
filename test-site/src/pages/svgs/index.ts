import { graphql } from "gatsby";
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
