"use client";
import { useBodyScrollLock } from "@bond-london/gatsby-theme";
import { ColourName, lookupColourClassNames } from "@colors";
import classNames from "classnames";
import React, { useCallback, useState } from "react";
import { HamburgerButton } from "./HamburgerButton";
import { MenuItem } from "./MenuItem";
import { INavigationItem, NavigationMenu } from "./NavigationMenu";

export interface INavigation {
  id: string;
  name: string;
  entries: ReadonlyArray<INavigationItem>;
  textColour?: ColourName | null;
  backgroundColour?: ColourName | null;
}

export const NavigationBar: React.FC<{
  menu: INavigation;
}> = ({ menu }) => {
  const { entries, textColour, backgroundColour } = menu;
  const [isOpen, setIsOpen] = useState(false);
  const { ref } = useBodyScrollLock(isOpen);
  const toggleMenu = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);
  const closeMenu = useCallback(() => setIsOpen(false), []);
  const [firstMenu, ...otherMenu] = entries;

  return (
    <>
      <nav
        ref={ref}
        className={classNames(
          lookupColourClassNames(backgroundColour, textColour),
          isOpen ? "h-screen" : "h-mobile-nav",
          "container-cols-grid p3 fixed left-0 right-0 top-0 z-50 transition-all transition-duration-300 laptop:h-laptop-nav",
        )}
      >
        <div className="relative col-span-1 col-start-2 grid grid-cols-2 content-start justify-between laptop:content-center">
          <MenuItem
            item={firstMenu}
            className="col-start-1 row-start-1 justify-start self-center"
          />
          <div
            className={classNames(
              !isOpen && "hidden laptop:flex",
              "col-span-full col-start-1 row-start-2 mb-l mt-s laptop:col-span-1 laptop:col-start-2 laptop:row-start-1 laptop:my-0 laptop:justify-end",
            )}
          >
            <NavigationMenu
              menu={otherMenu}
              closeMenu={closeMenu}
              backgroundColour={backgroundColour}
              textColour={textColour}
            />
          </div>
          <HamburgerButton
            toggleMenu={toggleMenu}
            isOpen={isOpen}
            className="col-start-2 row-start-1 self-center justify-self-end laptop:hidden"
          />
        </div>
      </nav>
      <div
        data-component="Nav spacer"
        className="h-mobile-nav laptop:h-laptop-nav"
      />
    </>
  );
};
