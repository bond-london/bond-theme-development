import { IBondImage } from "@bond-london/gatsby-theme";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ColourName } from "../../colors";
import { MenuItem } from "./MenuItem";
import { useMenuInformation } from "./MenuUtils";

export interface INavigationItem {
  internal?: string;
  external?: string;
  text?: string;
  name: string;
  colour?: ColourName;
  isButton?: boolean;
  icon?: IBondImage;
  entries?: ReadonlyArray<INavigationItem>;
}

export const NavigationMenu: React.FC<{
  menu: ReadonlyArray<INavigationItem>;
  closeMenu: () => void;
}> = ({ menu, closeMenu }) => {
  const { containerRef, handleActive, handleClose, activeItem } =
    useMenuInformation(closeMenu);
  return (
    <ul ref={containerRef} className="flex flex-col laptop:flex-row gap-s">
      {menu.map((m) => (
        <li
          key={m.name}
          className="flex border-b border-blue py-xs laptop:border-b-0"
        >
          <MenuItem
            item={m}
            closeMenu={handleClose}
            activateMenu={handleActive}
            active={activeItem?.link === m}
          />
        </li>
      ))}
    </ul>
  );
};
