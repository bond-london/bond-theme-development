import classNames from "classnames";
import React, { MouseEvent, useCallback } from "react";
import { LinkOrButton } from "../LinkOrButton";
import { SectionIcon } from "../SectionIcon";
import { useNestedMenu } from "./MenuUtils";
import { INavigationItem } from "./NavigationMenu";

export const NestedMenu: React.FC<{
  item: INavigationItem;
  closeMenu: () => void;
  active: boolean;
  activateMenu: (
    timeStamp: number,
    item?: INavigationItem,
    from?: INavigationItem
  ) => void;
}> = ({ item, active, closeMenu, activateMenu }) => {
  const entries = item.entries!;

  const { handleButtonClick, handleMouseEnter, handleMouseLeave } =
    useNestedMenu(item, activateMenu);

  return (
    <div
      className="inline-flex"
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
            active ? "max-h-screen" : "max-h-0"
          )}
        >
          <div className="bg-white pt-xxs">
            <ul className="flex flex-col divide-y divide-gray">
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
