import { Section } from "@bond-london/gatsby-theme";
import { IComponentInformation } from "./GenericComponent";
import React from "react";
import { lookupColourClassNames } from "@colors";
import { LinkOrButton } from "./LinkOrButton";

const LogoParadeComponent: React.FC<{ information: IComponentInformation }> = ({
  information: { backgroundColour, textColour, links },
}) => {
  return (
    <Section
      componentName="Logo parade"
      sectionClassName={lookupColourClassNames(backgroundColour, textColour)}
      sectionColumnsClassName="col-start-2 col-span-1"
      contentClassName="my-l laptop:my-xxxl grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 grid-gap items-center justify-items-center  laptop:gap-y-xl"
    >
      {links?.map((l) => (
        <LinkOrButton
          key={l.id}
          information={l}
          allowEmpty={true}
          iconHeightClassName=""
        />
      ))}
    </Section>
  );
};

export default LogoParadeComponent;
