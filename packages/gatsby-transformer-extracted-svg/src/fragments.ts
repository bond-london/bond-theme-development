import { graphql } from "gatsby";

export const ConstrainedSvgFragment = graphql`
  fragment ConstrainedSvg on GatsbySvg {
    id
    extracted(layout: CONSTRAINED)
  }
`;

export const FixedSvgFragment = graphql`
  fragment FixedSvg on GatsbySvg {
    id
    extracted(layout: FIXED)
  }
`;

export const FullWidthSvgFragment = graphql`
  fragment FullWidthSvg on GatsbySvg {
    id
    extracted(layout: FULL_WIDTH)
  }
`;

export const ConstrainedSvgFileFragment = graphql`
  fragment ConstrainedSvgFile on File {
    id
    childGatsbySvg {
      ...ConstrainedSvg
    }
  }
`;

export const FixedSvgFileFragment = graphql`
  fragment FixedSvgFile on File {
    id
    childGatsbySvg {
      ...FixedSvg
    }
  }
`;

export const FullWidthSvgFileFragment = graphql`
  fragment FullWidthSvgFile on File {
    id
    childGatsbySvg {
      ...FullWidthSvg
    }
  }
`;
