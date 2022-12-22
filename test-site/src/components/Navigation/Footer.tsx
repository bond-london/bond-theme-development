import { Section } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import React from "react";
import { lookupColourClassNames } from "../../colors";
import { INavigation } from "./NavigationBar";
import { NavigationMenu } from "./NavigationMenu";

export const Footer: React.FC<{ menu: INavigation }> = ({
  menu: { entries, textColour, backgroundColour },
}) => {
  const firstRow = entries[0];
  const lastRow = entries.length > 1 ? entries[entries.length - 1] : undefined;

  return (
    <Section
      componentName="Footer"
      sectionClassName={classNames(
        lookupColourClassNames(backgroundColour, textColour)
      )}
    >
      {firstRow.entries && (
        <NavigationMenu
          menu={firstRow.entries}
          className="col-span-full justify-between"
        />
      )}
      {lastRow?.entries && (
        <NavigationMenu
          menu={lastRow.entries}
          className="col-span-full justify-between"
        />
      )}
    </Section>
  );
};
