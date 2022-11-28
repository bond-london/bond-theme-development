import React from "react";
import { LinkOrButton } from "../LinkOrButton";
import { INavigationItem } from "./NavigationMenu";
import { NestedMenu } from "./NestedMenu";

export const MenuItem: React.FC<{
  item: INavigationItem;
  closeMenu: () => void;
  active: boolean;
  activateMenu: (
    timeStamp: number,
    item?: INavigationItem,
    from?: INavigationItem
  ) => void;
}> = ({ item, active, closeMenu, activateMenu }) => {
  if (item.entries && item.entries.length > 0) {
    return (
      <NestedMenu
        item={item}
        active={active}
        closeMenu={closeMenu}
        activateMenu={activateMenu}
      />
    );
  }
  return <LinkOrButton information={item} onClick={closeMenu} />;
};
