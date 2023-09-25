"use client";
import { GoogleTagManager, useBondCookie } from "@bond-london/gatsby-theme";
import React from "react";
import ReactCookieConsent from "react-cookie-consent";

const Analytics: React.FC = () => {
  /* eslint-disable node/no-process-env */
  const cookieName = process.env.GATSBY_COOKIE_NAME;
  const declinedCookieName = process.env.GATSBY_DECLINED_COOKIE_NAME;
  const googleTag = process.env.GATSBY_GOOGLE_TAG;
  /* eslint-enable node/no-process-env */

  const onAccept = useBondCookie(cookieName);

  if (!cookieName || !googleTag) return null;

  return (
    <>
      <GoogleTagManager cookieName={cookieName} gtm={googleTag} />
      <ReactCookieConsent
        cookieName={cookieName}
        declineCookieValue={declinedCookieName ?? undefined}
        containerClasses="bg-Blue h4 text-White container-cols-grid fixed left-0 right-0 w-full z-[100] items-center py-xs gap-y-xs"
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
