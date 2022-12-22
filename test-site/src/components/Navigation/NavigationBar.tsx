import { useBodyScrollLock } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import React, { useCallback, useState } from "react";
import { ColourName, lookupColourClassNames } from "../../colors";
import { HamburgerButton } from "./HamburgerButton";
import { MenuItem } from "./MenuItem";
import { INavigationItem, NavigationMenu } from "./NavigationMenu";

export interface INavigation {
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
    <nav
      ref={ref}
      className={classNames(
        lookupColourClassNames(backgroundColour, textColour),
        isOpen ? "opacity-100" : "opacity-75",
        "fixed top-0 left-0 right-0 z-50 container-cols-grid"
      )}
    >
      <div className="row-start-1 row-span-6 col-start-2 col-span-1 relative content-cols-grid">
        <MenuItem item={firstMenu} className="col-start-1 row-start-1" />
        <div
          className={classNames(
            !isOpen && "hidden laptop:flex",
            "row-start-2 col-span-4 col-start-1 tablet:col-start-1 tablet:col-span-8 laptop:row-start-1 laptop:col-span-12 laptop:col-start-1 laptop:justify-end"
          )}
        >
          <NavigationMenu menu={otherMenu} closeMenu={closeMenu} />
        </div>
        <HamburgerButton toggleMenu={toggleMenu} isOpen={isOpen} />
      </div>
    </nav>
  );
};
