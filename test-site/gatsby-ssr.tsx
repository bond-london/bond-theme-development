import type { RenderBodyArgs } from "gatsby";
import React from "react";

const fontsToPreload: { [path: string]: string } = {
  //  "/fonts/heldane/test-heldane-display-bold.woff2": "woff2",
  //  "/fonts/tusker/TuskerGrotesk-5500Medium.otf": "otf",
};

const domainsToConnect: string[] = ["media.graphassets.com"];

// eslint-disable-next-line import/no-unused-modules
export function onRenderBody({
  setHtmlAttributes,
  setBodyAttributes,
  setHeadComponents,
}: RenderBodyArgs) {
  setHtmlAttributes({ lang: `en` });
  if (process.env.GATSBY_DEBUG_TAILWIND) {
    setBodyAttributes({ className: "debug-screens" });
  }
  setHeadComponents(
    domainsToConnect.map((domain) => (
      <link rel="preconnect" key={`preconnect-${domain}`} href={domain} />
    ))
  );
  setHeadComponents(
    domainsToConnect.map((domain) => (
      <link rel="dns-prefetch" key={`dns-prefetch-${domain}`} href={domain} />
    ))
  );
  setHeadComponents(
    Object.entries(fontsToPreload).map(([path, type]) => (
      <link
        rel="preload"
        href={path}
        as="font"
        type={`font/${type}`}
        crossOrigin="anonymous"
        key={path}
      />
    ))
  );
}
