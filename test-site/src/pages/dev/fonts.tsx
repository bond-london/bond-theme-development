import { IPageMetadata, Section } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import { HeadFC } from "gatsby";
import React, { Fragment } from "react";
import { PageHead } from "@/components/PageHead";
import { fontTable, sizes } from "@/design";
import { DevPageLayout } from "@/layouts/DevPageLayout";

const head = classNames("font-bold text-34-44");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const retain = "h1 h2 h3 h4 h5 h6 p1 p2 p3 p4 mono";

const styles = ["", "italic"];

const name = "Typography";
const Fonts: React.FC = () => {
  return (
    <DevPageLayout name="Fonts">
      <Section
        componentName={name}
        sectionClassName="hidden laptop:grid"
        contentClassName="gap-y-s"
      >
        <h1 className={classNames(head, "col-span-2 uppercase")}>Font Info</h1>
        {sizes.map(({ key, value }) => {
          const breakpoint = value.breakpoint ? `${value.breakpoint}px` : "";
          return (
            <div key={key} className={classNames(head, "col-span-2")}>
              <h2>{key}</h2>
              <h3>{breakpoint}</h3>
            </div>
          );
        })}
        <div className="col-span-full border-b border-Blue" />
        {fontTable.map(({ key: name, value }) => {
          {
            return styles.map((style) => {
              const prefix = name.startsWith("h") ? "Headline" : "Paragraph";
              const { font, weight, default: initialSize, ...others } = value;
              let currentSize = initialSize;
              return (
                <Fragment key={name + style}>
                  <div className="col-span-2">
                    <h3 className={classNames(name, style)}>
                      {prefix} {name.toUpperCase()}
                    </h3>
                    <p className="capitalize" style={{ fontWeight: weight }}>
                      {font} {weight} {style}
                    </p>
                  </div>
                  {sizes.map(({ key }) => {
                    const newSize = others[key] ?? currentSize;
                    currentSize = newSize;

                    return (
                      <div
                        key={key}
                        className="col-span-2"
                        style={{
                          fontWeight: weight,
                          fontSize: `${currentSize}px`,
                        }}
                      >
                        <p>
                          {prefix} {name.substring(1)} - {newSize}px
                        </p>
                        <p>Line height 125%</p>
                      </div>
                    );
                  })}
                  <div className="col-span-full border-b border-Blue" />
                </Fragment>
              );
            });
          }
        })}
      </Section>
      <Section componentName={name} sectionClassName="laptop:hidden">
        Please view on a larger screen
      </Section>
    </DevPageLayout>
  );
};

// eslint-disable-next-line import/no-unused-modules
export default Fonts;

// eslint-disable-next-line import/no-unused-modules
export const Head: HeadFC = (props) => {
  const pageMetadata: IPageMetadata = {
    title: "Fonts test page",
    noIndex: true,
    description: "Test page for fonts",
  };

  return <PageHead headProps={props} page={pageMetadata} />;
};
