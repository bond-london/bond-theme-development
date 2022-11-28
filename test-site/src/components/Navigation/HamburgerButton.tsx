import { useBodyScrollLock } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import React, { useCallback, useState } from "react";

const SingleHamburgerLine: React.FC<{ className: string }> = ({
  className,
}) => {
  return (
    <svg
      viewBox="0 0 27 3"
      className={classNames(
        "fill-current absolute block transform transition duration-500 ease-in-out w-[48px]",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.6745 1.19434C22.3727 1.41271 18.0698 1.52589 13.7669 1.695C9.46397 1.79487 5.16105 1.95066 0.858131 1.99993C0.388845 2.00658 0.00457471 1.56318 4.05445e-05 1.01192C-0.00449362 0.460656 0.371842 0.00926078 0.841128 0.00260303H0.846795C5.14972 -0.0160386 9.45377 0.070512 13.7578 0.101138C18.0619 0.202335 22.3659 0.246276 26.67 0.39541C26.8581 0.402068 27.0055 0.585821 26.9998 0.806858C26.9942 1.01724 26.8502 1.18502 26.6745 1.19434Z"
      />
    </svg>
  );
};

export const HamburgerButton: React.FC<{
  toggleMenu: () => void;
  isOpen: boolean;
}> = ({ toggleMenu, isOpen }) => {
  return (
    <button
      aria-label="Toggle menu"
      className="relative row-start-1 col-span-1 col-start-4 h-[48px] justify-self-end tablet:col-span-1 tablet:col-start-8 laptop:hidden w-[48px]"
      onClick={toggleMenu}
    >
      <div className="absolute block">
        <SingleHamburgerLine
          className={isOpen ? "rotate-45" : "-translate-y-[20px]"}
        />
        <SingleHamburgerLine className={isOpen ? "opacity-0" : ""} />
        <SingleHamburgerLine
          className={isOpen ? "-rotate-45" : "translate-y-[20px]"}
        />
      </div>
    </button>
  );
};
