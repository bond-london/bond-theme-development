import React from "react";
import { RenderBodyArgs } from "gatsby";

export function onRenderBody({ setHeadComponents }: RenderBodyArgs) {
  setHeadComponents([
    <style
      key="gatsby-animation-style"
      dangerouslySetInnerHTML={{
        __html: `
.gatsby-animation-wrapper {
    position: relative;
    overflow: hidden;
}      
.gatsby-animation-wrapper img, .gatsby-animation-wrapper svg {
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

.gatsby-animation-wrapper-constrained {
    display: inline-block;
    vertical-align: top;
}
      `,
      }}
    />,
  ]);
}
