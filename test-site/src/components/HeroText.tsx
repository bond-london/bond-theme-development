import { IRichTextInformation } from "@bond-london/graphcms-rich-text";
import React from "react";
import { ILinkInformation } from "./LinkOrButton";
import { RTF } from "./RTF";
import { SectionLinks } from "./SectionLinks";

export const HeroText: React.FC<{
  preHeading?: string | null;
  heading?: string | null;
  postHeading?: string | null;
  body?: IRichTextInformation;
  links?: ReadonlyArray<ILinkInformation>;
}> = ({ preHeading, heading, postHeading, body, links }) => {
  if (!(preHeading || heading || postHeading || links || body)) {
    return null;
  }

  return (
    <>
      {preHeading && <p className="h3">{preHeading}</p>}
      {heading && <h1 className="h1">{heading}</h1>}
      {postHeading && <p className="h4">{postHeading}</p>}
      {links && <SectionLinks links={links} />}
      {body && <RTF content={body} className="p2" />}
    </>
  );
};
