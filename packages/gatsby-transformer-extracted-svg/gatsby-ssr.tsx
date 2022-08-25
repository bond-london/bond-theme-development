import React from "react";
import { RenderBodyArgs } from "gatsby";

console.log("Got tsx svg ssr");

export function onRenderBody({ setHeadComponents }: RenderBodyArgs) {
  console.log("rendering body from svg tsx");
  setHeadComponents([
    <style
      key="gatsby-svg-style"
      dangerouslySetInnerHTML={{
        __html: `
.gatsby-svg-wrapper {
    position: relative;
    overflow: hidden;
}      
.gatsby-svg-wrapper img {
    bottom: 0;
    height: 100%;
    left:0;
    margin: 0;
    max-width: none;
    padding: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    object-fit: cover;
}

.gatsby-svg-wrapper-constrained {
    display: inline-block;
    vertical-align: top;
}
      `,
      }}
    />,
  ]);
}
