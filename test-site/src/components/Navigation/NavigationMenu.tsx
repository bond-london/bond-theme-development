import { IBondImage } from "@bond-london/gatsby-theme";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ColourName } from "../../colors";
import { MenuItem } from "./MenuItem";

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
  const [activeItem, setActiveItem] = useState<{
    timeStamp: number;
    link: INavigationItem;
  }>();
  const containerRef = useRef<HTMLUListElement>(null);
  const handleActive = useCallback(
    (timeStamp: number, to?: INavigationItem, from?: INavigationItem) => {
      setActiveItem((current) => {
        if (current && timeStamp === current.timeStamp) {
          return current;
        }
        const currentLink = current?.link;
        if (from) {
          if (currentLink === from) {
            return to ? { timeStamp, link: to } : undefined;
          }
          return currentLink ? { timeStamp, link: currentLink } : undefined;
        }
        if (currentLink === to) {
          return undefined;
        }
        return to ? { timeStamp, link: to } : undefined;
      });
    },
    []
  );
  const handleClose = useCallback(() => {
    setActiveItem(undefined);
    closeMenu();
  }, [closeMenu]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setActiveItem(undefined);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

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
