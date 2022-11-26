"use client";
import React from "react";
import { graphql, SliceComponentProps } from "gatsby";
import ReactCookieConsent from "react-cookie-consent";
import {
  GoogleTagManager,
  useBondCookie,
} from "@bond-london/gatsby-graphcms-components";

const Analytics: React.FC<SliceComponentProps<Queries.AnalyticsQuery>> = ({
  data: { site },
}) => {
  if (!site?.siteMetadata) throw new Error("No site");

  const { cookieName, googleTag, declinedCookieName } = site.siteMetadata;

  const onAccept = useBondCookie(cookieName);

  if (!cookieName || !googleTag) return null;

  return (
    <>
      <GoogleTagManager cookieName={cookieName} gtm={googleTag} />
      <ReactCookieConsent
        cookieName={cookieName}
        declineCookieValue={declinedCookieName || undefined}
        containerClasses="bg-error container-grid w-full z-cookies items-center py-xxxs"
        disableStyles={true}
        disableButtonStyles={true}
        location={"top"}
        buttonWrapperClasses="flex col-start-2 col-span-1 justify-self-end row-start-1 gap-x-xs"
        buttonClasses="bg-blue text-white px-xxxs"
        buttonText="Accept"
        enableDeclineButton={!!declinedCookieName}
        declineButtonText="Decline"
        declineButtonClasses="border border-blue text-blue px-xxs "
        contentClasses="col-start-2 col-span-1 row-start-1"
        onAccept={onAccept}
      >
        We use cookies to make this site awesome
      </ReactCookieConsent>
    </>
  );
};

// eslint-disable-next-line import/no-unused-modules
export default Analytics;

// eslint-disable-next-line import/no-unused-modules
export const query = graphql`
  query Analytics {
    site {
      siteMetadata {
        cookieName
        googleTag
        declinedCookieName
      }
    }
  }
`;
