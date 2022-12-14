import { RenderBodyArgs } from "gatsby";
import React from "react";

const fontsToPreload = {
//  "/fonts/heldane/test-heldane-display-bold.woff2": "woff2",
//  "/fonts/tusker/TuskerGrotesk-5500Medium.otf": "otf",
};
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
