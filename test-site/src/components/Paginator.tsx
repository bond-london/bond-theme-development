import { Section, usePaginatorEntries } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import { Link } from "gatsby";
import React from "react";

export const Paginator: React.FC<{
  totalPages: number;
  currentPage: number;
  buildLink: (page: number) => string;
}> = ({ totalPages, currentPage, buildLink }) => {
  const entries = usePaginatorEntries(totalPages, currentPage);

  return (
    <Section componentName="Paginator">
      <div className="col-span-full flex justify-center gap-x-xs">
        {entries.map((entry, index) => {
          if (entry) {
            return (
              <Link
                key={index}
                to={buildLink(entry)}
                className={classNames(
                  entry === currentPage
                    ? "rounded-full bg-red text-gray"
                    : "text-black",
                  "flex h-s w-s items-center justify-center tabular-nums"
                )}
              >
                {entry}
              </Link>
            );
          }
          return (
            <span key={index} className="text-black">
              ...
            </span>
          );
        })}
      </div>
    </Section>
  );
};