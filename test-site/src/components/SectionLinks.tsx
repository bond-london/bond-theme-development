import classNames from "classnames";
import React, { Fragment } from "react";
import { SectionBodyClassName } from "../styles";
import { ILinkInformation, LinkOrButton } from "./LinkOrButton";

export const SectionLinks: React.FC<{
  links: ReadonlyArray<ILinkInformation>;
  vertical?: boolean;
  separator?: boolean;
}> = ({ links, vertical, separator = true }) => {
  if (links.length === 0) return null;

  return (
    <div
      className={classNames(
        SectionBodyClassName,
        "flex pointer-events-auto",
        vertical ? "flex-col items-start gap-y-x" : "items-center gap-x-xs"
      )}
    >
      {links.map((link, index) => (
        <Fragment key={link.name}>
          {separator && index > 0 && vertical ? (
            <p className="border-r-2 border-current" />
          ) : (
            <p className="border-b-2 border-current" />
          )}
          <LinkOrButton information={link} />
        </Fragment>
      ))}
    </div>
  );
};
