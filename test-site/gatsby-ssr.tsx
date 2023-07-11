import type { RenderBodyArgs } from "gatsby";
import React from "react";

const fontsToPreload: { [path: string]: string } = {
  "/fonts/merriweather-latin-400-normal.woff2": "woff2",
  "/fonts/merriweather-latin-400-italic.woff2": "woff2",
};

const domainsToConnect: string[] = ["media.graphassets.com"];

// eslint-disable-next-line import/no-unused-modules
export function onRenderBody({ setHeadComponents }: RenderBodyArgs) {
  setHeadComponents(
    domainsToConnect.map((domain) => (
      <link rel="preconnect" key={`preconnect-${domain}`} href={domain} />
    )),
  );
  setHeadComponents(
    domainsToConnect.map((domain) => (
      <link rel="dns-prefetch" key={`dns-prefetch-${domain}`} href={domain} />
    )),
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
    )),
  );
}
