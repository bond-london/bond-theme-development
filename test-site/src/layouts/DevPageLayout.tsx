import { Section } from "@bond-london/gatsby-theme";
import { Link, Slice } from "gatsby";
import React, { PropsWithChildren } from "react";
import { SectionHeading } from "../components/SectionHeading";

const pages: { title: string; path: string }[] = [
  { title: "Development", path: "/dev" },
  { title: "Colours", path: "/dev/colours" },
  { title: "Fonts", path: "/dev/fonts" },
  { title: "Components", path: "/dev/components" },
  { title: "Collections", path: "/dev/collections" },
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

      <Section
        componentName="Dev Page Header"
        contentClassName="gap-s"
        sectionClassName="bond-row-1-xl"
      >
        <SectionHeading heading={name} />
        <ul className="col-span-full my-m flex gap-x-l gap-y-m">
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
