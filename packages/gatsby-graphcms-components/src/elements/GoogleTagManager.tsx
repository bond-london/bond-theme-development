"use client";
import { Script, ScriptStrategy } from "gatsby";
import React, { useCallback, useEffect } from "react";
import { getCookieConsentValue } from "react-cookie-consent";

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    bondHadCookie?: boolean;
    dataLayer: Array<unknown>;
  }
}

export function useBondCookie(
  cookieName: string | undefined | null
): () => void {
  const onAccept = useCallback(() => {
    if (!cookieName) return;
    if (!window.bondHadCookie) {
      window.localStorage.setItem(cookieName, "true");
      window.dataLayer.push("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
      });
    }
  }, [cookieName]);

  useEffect(() => {
    if (!cookieName) return;
    const cookieValue = getCookieConsentValue(cookieName);
    if (cookieValue) {
      onAccept();
    }
  }, [cookieName, onAccept]);

  return onAccept;
}

export const GoogleTagManager: React.FC<{
  cookieName: string;
  gtm: string;
  strategy?: ScriptStrategy;
}> = ({ cookieName, gtm, strategy = ScriptStrategy.postHydrate }) => (
  <Script id="gtm-init" strategy={strategy}>{`
          window.dataLayer = window.dataLayer || [];
          const hasCookie = window.localStorage.getItem("${cookieName}");
          const status = hasCookie ? "granted": "denied";
          if (hasCookie) {
            window.bondHadCookie = true;
          }
       
          window.dataLayer.push('consent', 'default', {
            'ad_storage': status,
            'analytics_storage': status
          });

          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtm}');          
          `}</Script>
);
