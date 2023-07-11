import React from "react";
import { ColourName } from "@colors";
import { LinkOrButton } from "@/components/LinkOrButton";
import { INavigationItem } from "./NavigationMenu";
import { NestedMenu } from "./NestedMenu";

export const MenuItem: React.FC<{
  item: INavigationItem;
  backgroundColour?: ColourName | null;
  textColour?: ColourName | null;
  className?: string;
  iconFirst?: boolean;
  contentClassName?: string;
  closeMenu?: () => void;
  active?: boolean;
  activateMenu?: (
    timeStamp: number,
    item?: INavigationItem,
    from?: INavigationItem,
  ) => void;
}> = ({
  item,
  backgroundColour,
  textColour,
  className,
  active,
  closeMenu,
  activateMenu,
  iconFirst,
  contentClassName,
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
      iconHeightClassName="h-mobile-nav-logo laptop:h-laptop-nav-logo"
      allowEmpty={true}
      iconFirst={iconFirst}
      contentClassName={contentClassName}
    />
  );
};
