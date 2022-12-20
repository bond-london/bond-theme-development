import { Section } from "@bond-london/gatsby-theme";
import { Link, Slice } from "gatsby";
import React, { PropsWithChildren } from "react";

const pages: { title: string; path: string }[] = [
  { title: "Development", path: "/dev" },
  { title: "Colours", path: "/dev/colours" },
  { title: "Fonts", path: "/dev/fonts" },
];

// eslint-disable-next-line import/no-unused-modules
export const DevPageLayout: React.FC<PropsWithChildren<{ name?: string }>> = ({
  children,
  name,
}) => {
  return (
    <>
      <Slice alias="navigation-Menu" />
      <Slice alias="analytics" />

      <Section componentName="Dev Page Header" contentClassName="gap-s">
        <h1 className="h1 col-span-full">{name}</h1>
        <ul className="content-grid col-span-full pl-xs">
          {pages.map(({ title, path }) => (
            <li key={title} className="col-span-2">
              <Link activeClassName="underline" to={path}>
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      {children}

      <Slice alias="footer-Footer" />
    </>
  );
};
