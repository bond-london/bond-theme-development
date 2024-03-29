import { RenderBodyArgs } from "gatsby";
import React from "react";

export function onRenderBody({ setHeadComponents }: RenderBodyArgs): void {
  setHeadComponents([
    <style
      key="gatsby-video-style"
      dangerouslySetInnerHTML={{
        __html: `
.gatsby-video-wrapper {
    position: relative;
    overflow: hidden;
}      
.gatsby-video-wrapper video, .gatsby-video-wrapper .inside {
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

.gatsby-video-wrapper-constrained {
    display: inline-block;
    vertical-align: top;
}
      `,
      }}
    />,
  ]);
}
