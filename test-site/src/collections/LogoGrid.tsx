import { Section } from "@bond-london/gatsby-theme";
import classNames from "classnames";
import React from "react";
import { lookupColourClassNames } from "../colors";
import { LinkOrButton } from "../components/LinkOrButton";
import { SectionSpacingClassName } from "../styles";
import { ICollectionInformation } from "./GenericCollection";

export const LogoGrid: React.FC<{
  collection: ICollectionInformation;
}> = ({ collection: { anchor, backgroundColour, textColour, links } }) => {
  return (
    <Section
      id={anchor || undefined}
      componentName="Logo Grid"
      sectionClassName={classNames(
        lookupColourClassNames(backgroundColour, textColour),
        SectionSpacingClassName
      )}
      contentClassName="grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 desktop:grid-cols-5 grid-gap laptop:mx-laptop-1-gap-cols gap-y-mobile-gap tablet:gap-y-tablet-gap laptop:gap-y-laptop-gap"
    >
      {links?.map((link) => (
        <div
          key={link.id}
          className="relative px-s py-xs drop-shadow-card bg-white rounded-polly flex"
        >
          <LinkOrButton
            information={link}
            className="h-mobile-logo tablet:h-tablet-logo laptop:h-laptop-logo w-full justify-center"
            iconHeightClassName="h-full w-full justify-center"
            allowEmpty={true}
          />
        </div>
      ))}
    </Section>
  );
};
