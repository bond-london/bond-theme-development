import { graphql } from "gatsby";

// eslint-disable-next-line import/no-unused-modules
export const ConstrainedSvgFragment = graphql`
  fragment ConstrainedSvg on GatsbySvg {
    id
    extracted(layout: CONSTRAINED)
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FixedSvgFragment = graphql`
  fragment FixedSvg on GatsbySvg {
    id
    extracted(layout: FIXED)
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FullWidthSvgFragment = graphql`
  fragment FullWidthSvg on GatsbySvg {
    id
    extracted(layout: FULL_WIDTH)
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const ConstrainedSvgFileFragment = graphql`
  fragment ConstrainedSvgFile on File {
    id
    childGatsbySvg {
      ...ConstrainedSvg
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FixedSvgFileFragment = graphql`
  fragment FixedSvgFile on File {
    id
    childGatsbySvg {
      ...FixedSvg
    }
  }
`;

// eslint-disable-next-line import/no-unused-modules
export const FullWidthSvgFileFragment = graphql`
  fragment FullWidthSvgFile on File {
    id
    childGatsbySvg {
      ...FullWidthSvg
    }
  }
`;
