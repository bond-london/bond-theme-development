import { graphql } from "gatsby";
import { SvgsLayout } from "../../layouts/SvgsLayout";

export default SvgsLayout;

export const SvgsQuery = graphql`
  query AllSvgs {
    allGatsbySvg {
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
