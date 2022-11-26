import { Section } from "@bond-london/gatsby-theme";
import React from "react";

export const NavigationBar: React.FC = () => {
  return (
    <Section collapse={true} element="nav" componentName="Navigation Bar">
      <p>Menu goes here</p>
    </Section>
  );
};
