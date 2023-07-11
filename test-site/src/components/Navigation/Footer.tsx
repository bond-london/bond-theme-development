import { Section } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import React from "react";
import { lookupColourClassNames } from "@colors";
import { LinkOrButton } from "@/components/LinkOrButton";
import { INavigation } from "./NavigationBar";
import { INavigationItem } from "./NavigationMenu";

const FooterItem: React.FC<{ item: INavigationItem }> = ({ item }) => {
  return (
    <LinkOrButton
      information={item}
      className="footer-entry"
      iconHeightClassName="h-mobile-menu-logo laptop:h-laptop-menu-logo"
      buttonClassName="menu-button"
      allowEmpty={true}
    />
  );
};

const FooterContainer: React.FC<{
  entries: ReadonlyArray<INavigationItem>;
}> = ({ entries }) => {
  return (
    <div className="footer-container footer-spacing">
      {entries.map((entry) =>
        entry.entries ? (
          <FooterContainer key={entry.id} entries={entry.entries} />
        ) : (
          <FooterItem key={entry.id} item={entry} />
        ),
      )}
    </div>
  );
};

export const Footer: React.FC<{
  menu: INavigation;
  buildYear: string | null;
}> = ({ menu: { entries, textColour, backgroundColour } }) => {
  const isMultiple = entries[0]?.entries;

  return (
    <Section
      element="footer"
      componentName="Footer"
      sectionClassName={classNames(
        lookupColourClassNames(backgroundColour, textColour),
      )}
      contentClassName="footer-spacing p3"
    >
      {isMultiple ? (
        entries.map((entry) =>
          entry.entries ? (
            <FooterContainer key={entry.id} entries={entry.entries} />
          ) : (
            <FooterItem key={entry.id} item={entry} />
          ),
        )
      ) : (
        <FooterContainer entries={entries} />
      )}
    </Section>
  );
};
