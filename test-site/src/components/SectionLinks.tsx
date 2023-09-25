import classNames from "classnames";
import React, { Fragment } from "react";
import { ILinkInformation, LinkOrButton } from "./LinkOrButton";

export const SectionLinks: React.FC<{
  links: ReadonlyArray<ILinkInformation>;
  vertical?: boolean;
  separator?: boolean;
  iconHeightClassName?: string;
  className?: string;
}> = ({
  links,
  vertical,
  separator,
  iconHeightClassName,
  className = "col-span-full",
}) => {
  if (links.length === 0) return null;

  return (
    <div
      className={classNames(
        className,
        "pointer-events-auto flex",
        vertical ? "gap-y-x flex-col items-start" : "items-center gap-x-xs",
      )}
    >
      {links.map((link, index) => (
        <Fragment key={link.name}>
          {index > 0 &&
            (separator && index > 0 && vertical ? (
              <p className="border-r-2 border-current" />
            ) : (
              <p className="border-b-2 border-current" />
            ))}
          <LinkOrButton
            information={link}
            iconHeightClassName={iconHeightClassName}
            buttonClassName="button buttonSmall no-underline flex items-center"
          />
        </Fragment>
      ))}
    </div>
  );
};
