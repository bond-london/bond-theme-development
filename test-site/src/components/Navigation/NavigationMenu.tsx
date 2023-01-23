import { IBondVisual } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import React from "react";
import { ColourName } from "../../colors";
import { MenuItem } from "./MenuItem";
import { useMenuInformation } from "./MenuUtils";

export interface INavigationItem {
  id: string;
  internal?: string;
  external?: string;
  text?: string;
  name: string;
  colour?: ColourName;
  isButton?: boolean;
  icon?: IBondVisual;
  entries?: ReadonlyArray<INavigationItem>;
}

export const NavigationMenu: React.FC<{
  menu: ReadonlyArray<INavigationItem>;
  backgroundColour?: ColourName | null;
  textColour?: ColourName | null;
  className?: string;
  closeMenu?: () => void;
}> = ({ menu, backgroundColour, textColour, className, closeMenu }) => {
  const { containerRef, handleActive, handleClose, activeItem } =
    useMenuInformation(closeMenu);
  return (
    <ul
      ref={containerRef}
      className={classNames("flex flex-col laptop:flex-row gap-s", className)}
    >
      {menu.map((m) => (
        <li key={m.id} className="flex">
          <MenuItem
            item={m}
            backgroundColour={backgroundColour}
            textColour={textColour}
            closeMenu={handleClose}
            activateMenu={handleActive}
            active={activeItem?.link === m}
          />
        </li>
      ))}
    </ul>
  );
};
