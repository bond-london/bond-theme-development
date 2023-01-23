"use client";
import React from "react";
import { graphql, SliceComponentProps } from "gatsby";
import ReactCookieConsent from "react-cookie-consent";
import { GoogleTagManager, useBondCookie } from "@bond-london/gatsby-theme";

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
        containerClasses="bg-blue h4 text-black container-cols-grid fixed left-0 right-0 w-full z-[100] items-center py-xs gap-y-xs"
        disableStyles={true}
        disableButtonStyles={true}
        location="bottom"
        buttonWrapperClasses="flex row-start-2 laptop:row-start-1 col-start-2 col-span-1 justify-self-center laptop:justify-self-end gap-x-xs"
        buttonClasses="button uppercase"
        buttonText="Accept"
        enableDeclineButton={!!declinedCookieName}
        declineButtonText="Decline"
        declineButtonClasses="button uppercase"
        contentClasses="col-start-2 col-span-1 row-start-1 text-center laptop:text-left"
        onAccept={onAccept}
      >
        We use cookies to make this site awesome.
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
