import React from "react";
import { ColourName } from "../../colors";
import { LinkOrButton } from "../LinkOrButton";
import { INavigationItem } from "./NavigationMenu";
import { NestedMenu } from "./NestedMenu";

export const MenuItem: React.FC<{
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
  if (item.entries && item.entries.length > 0) {
    return (
      <NestedMenu
        className={className}
        item={item}
        backgroundColour={backgroundColour}
        textColour={textColour}
        active={active}
        closeMenu={closeMenu}
        activateMenu={activateMenu}
      />
    );
  }
  return (
    <LinkOrButton
      information={item}
      onClick={closeMenu}
      className={className}
      iconHeightClassName="h-mobile-menu-logo laptop:h-laptop-menu-logo menu-item"
      buttonClassName={
        item.icon
          ? "menu-icon"
          : item.isButton
          ? "filled-menu-button"
          : "menu-button"
      }
      allowEmpty={true}
      colourIsBackground={item.isButton}
      isButton={true}
    />
  );
};
