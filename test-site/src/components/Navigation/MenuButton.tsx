import classNames from "classnames";
import React, { PropsWithChildren } from "react";

// eslint-disable-next-line import/no-unused-modules
export const MenuButton: React.FC<
  PropsWithChildren<{
    toggleMenu: () => void;
    isOpen: boolean;
    className?: string;
  }>
> = ({ toggleMenu, className, children }) => {
  return (
    <button
      aria-label="Toggle menu"
      className={classNames(
        "relative row-start-1 col-span-1 col-start-4 justify-self-end tablet:col-span-1 tablet:col-start-8 laptop:hidden w-full",
        className,
      )}
      onClick={toggleMenu}
    >
      {children}
    </button>
  );
};
