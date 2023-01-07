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
      <button
        className="p3 inline-flex w-full items-center laptop:p4"
        onClick={handleButtonClick}
      >
        {item.text && <>{item.text}</>}
        {item.icon && <SectionIcon icon={item.icon} />}
      </button>
      <div className="relative">
        <div
          className={classNames(
            "absolute z-[1000] flex w-menu overflow-hidden transition-all laptop:top-xs laptop:-left-m",
            lookupColourClassNames(backgroundColour, textColour),
            active ? "max-h-screen" : "max-h-0"
          )}
        >
          <div className="pt-xxs">
            <ul className="flex flex-col">
              {item.entries?.map((i) => (
                <li key={i.name} className="px-s py-xs">
                  <LinkOrButton onClick={closeMenu} information={i} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
