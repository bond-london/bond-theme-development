"use client";
import { useBodyScrollLock } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import React, { useCallback, useState } from "react";
import { ColourName, lookupColourClassNames } from "@colors";
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
          "p3 fixed top-0 left-0 right-0 z-50 container-cols-grid laptop:h-laptop-nav transition-all transition-duration-300",
        )}
      >
        <div className="col-start-2 col-span-1 relative grid grid-cols-3 grid-rows-mobile-nav laptop:grid-rows-laptop-nav">
          <MenuItem
            item={firstMenu}
            className="col-start-1 row-start-1 justify-start self-center"
          />
          <div
            className={classNames(
              !isOpen && "hidden laptop:flex",
              "row-start-2 col-start-1 col-span-full laptop:row-start-1 laptop:justify-end mt-s mb-l laptop:my-0",
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
            className="laptop:hidden justify-self-end col-start-3 row-start-1 self-center"
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
