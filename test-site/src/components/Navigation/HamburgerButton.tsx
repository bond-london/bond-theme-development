import classNames from "classnames";
import React from "react";

const SingleHamburgerLine: React.FC<{ className: string }> = ({
  className,
}) => {
  return (
    <svg
      viewBox="0 0 26 2"
      className={classNames(
        "absolute block w-[30px] transform fill-current transition duration-500 ease-in-out",
        className,
      )}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="26" height="2" />
    </svg>
  );
};

// eslint-disable-next-line import/no-unused-modules
export const HamburgerButton: React.FC<{
  toggleMenu: () => void;
  className?: string;
  isOpen: boolean;
}> = ({ toggleMenu, className, isOpen }) => {
  return (
    <button
      aria-label="Toggle menu"
      className={classNames("relative h-[30px] w-[30px]", className)}
      onClick={toggleMenu}
    >
      <div className="absolute block">
        <SingleHamburgerLine
          className={isOpen ? "rotate-45" : "-translate-y-[12px]"}
        />
        <SingleHamburgerLine
          className={isOpen ? "opacity-0" : "-translate-y-[1px]"}
        />
        <SingleHamburgerLine
          className={isOpen ? "-rotate-45" : "translate-y-[10px]"}
        />
      </div>
    </button>
  );
};
