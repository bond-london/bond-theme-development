import React from "react";

import classNames from "classnames";
import { HeadFC, Slice } from "gatsby";
import { colours } from "../../design";
import { IPageMetadata, Section } from "@bond-london/gatsby-theme";
import { PageHead } from "../../components/PageHead";

const name = "Website Color Palette";

const Colours: React.FC = () => {
  return (
    <>
      <Slice alias="navigation-Menu" />
      <Slice alias="analytics" />
      <Section componentName={name} contentClassName="gap-y-s">
        {colours.map(({ key, value }) => (
          <div
            key={key}
            className={classNames(
              "aspect-w-1 aspect-h-1 col-span-2",
              key === "grey-900" && "text-gray-100"
            )}
            style={{ backgroundColor: value }}
          >
            <div className="m-m flex flex-col">
              <h3 className="p4">{key}</h3>
              <p className="p4">{value}</p>
            </div>
          </div>
        ))}
      </Section>
      <Slice alias="footer-Footer" />
    </>
  );
};
// eslint-disable-next-line import/no-unused-modules
export default Colours;

// eslint-disable-next-line import/no-unused-modules
export const Head: HeadFC = (props) => {
  const pageMetadata: IPageMetadata = {
    title: "Colours test page",
    noIndex: true,
    description: "Test page for colours",
  };

  return <PageHead headProps={props} page={pageMetadata} />;
};
