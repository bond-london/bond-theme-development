import { Section, useBodyScrollLock } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import React, { useCallback, useState } from "react";
import { HamburgerButton } from "./HamburgerButton";
import { INavigationItem, NavigationMenu } from "./NavigationMenu";

export const NavigationBar: React.FC<{
  menu: ReadonlyArray<INavigationItem>;
}> = ({ menu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { ref } = useBodyScrollLock(isOpen);
  const toggleMenu = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <nav
      data-component="Navigation Bar"
      ref={ref}
      className={classNames(
        isOpen ? "opacity-100" : "opacity-75",
        "fixed top-0 left-0 right-0 container-cols-grid container-rows-grid relative z-50 bg-gray laptop:relative laptop:bg-transparent laptop:opacity-100"
      )}
    >
      <div className="row-start-2 row-span-4 col-start-2 col-span-1 relative content-cols-grid">
        <div
          className={classNames(
            !isOpen && "hidden laptop:block",
            "row-start-1 col-span-4 col-start-1 tablet:col-start-1 tablet:col-span-8 laptop:col-span-10 laptop:col-start-3 laptop:ml-laptop-half-col desktop:col-span-9 desktop:col-start-4 desktop:ml-0"
          )}
        >
          <NavigationMenu menu={menu} closeMenu={closeMenu} />
        </div>
        <HamburgerButton toggleMenu={toggleMenu} isOpen={isOpen} />
      </div>
    </nav>
  );
};
