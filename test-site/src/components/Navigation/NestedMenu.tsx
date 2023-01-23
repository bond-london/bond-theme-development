import classNames from "classnames";
import React from "react";
import { ColourName, lookupColourClassNames } from "../../colors";
import { LinkOrButton } from "../LinkOrButton";
import { SectionIcon } from "../SectionIcon";
import { useNestedMenu } from "./MenuUtils";
import { INavigationItem } from "./NavigationMenu";

export const NestedMenu: React.FC<{
  item: INavigationItem;
  backgroundColour?: ColourName | null;
  textColour?: ColourName | null;
  className?: string;
  closeMenu?: () => void;
  active?: boolean;
  activateMenu?: (
    timeStamp: number,
    item?: INavigationItem,
    from?: INavigationItem
  ) => void;
}> = ({
  item,
  backgroundColour,
  textColour,
  className,
  active,
  closeMenu,
  activateMenu,
}) => {
  const { handleButtonClick, handleMouseEnter, handleMouseLeave } =
    useNestedMenu(item, activateMenu);

  return (
    <div
      data-component="Nested menu"
      className={classNames("inline-flex", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="menu-button" onClick={handleButtonClick}>
        {item.text && <>{item.text}</>}
        {item.icon && <SectionIcon icon={item.icon} />}
      </button>
      <div className="relative">
        <div
          className={classNames(
            "absolute laptop:fixed -left-l z-[1000] flex transition-all laptop:top-laptop-nav laptop:left-0 laptop:right-0 laptop:h-laptop-nav laptop:justify-center overflow-hidden w-menu laptop:w-auto ",
            lookupColourClassNames(backgroundColour, textColour),
            active ? "max-h-screen" : "max-h-0"
          )}
        >
          <ul className="pt-xxs laptop:pt-0 flex flex-col laptop:flex-row">
            {item.entries?.map((i) => (
              <li key={i.name} className="px-s py-xs">
                <LinkOrButton onClick={closeMenu} information={i} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
