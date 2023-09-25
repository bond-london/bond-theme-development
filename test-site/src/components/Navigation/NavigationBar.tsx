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
          "p3 fixed top-0 left-0 right-0 z-50 container-cols-grid laptop:h-laptop-nav transition-all transition-duration-300",
        )}
      >
        <div className="col-start-2 col-span-1 relative grid grid-cols-2 content-start laptop:content-center justify-between">
          <MenuItem
            item={firstMenu}
            className="col-start-1 row-start-1 justify-start self-center"
          />
          <div
            className={classNames(
              !isOpen && "hidden laptop:flex",
              "row-start-2 col-start-1 col-span-full laptop:col-start-2 laptop:col-span-1 laptop:row-start-1 laptop:justify-end mt-s mb-l laptop:my-0",
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
            className="laptop:hidden justify-self-end col-start-2 row-start-1 self-center"
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
