import React from "react";

import ArticleTextComponent from "@/components/ArticleText";
import CenteredTextComponent from "@/components/CenteredText";
import { IComponentInformation } from "@/components/GenericComponent";
import TextAndImageComponent from "@/components/TextAndImage";
import TextComponent from "@/components/Text";
import HeroComponent from "@/components/Hero";
import GridComponent from "@/components/Grid";
import ArticleLinksComponent from "@/components/ArticleLinks";
import ArticleGridComponent from "@/components/ArticleGrid";
import TagLinksComponent from "@/components/TagLinks";
import ArticleInfoComponent from "@/components/ArticleInfo";
import LogoParadeComponent from "@/components/LogoParade";
import SplitComponent from "@/components/Split";
import SpacerComponent from "@/components/Spacer";

export function tryHandleCustomComponent(
  converted: IComponentInformation,
  componentType: Queries.CmsComponentFragment["componentType"],
  index: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isFirst: boolean,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isLast: boolean,
) {
  switch (componentType) {
    case "SpacerS":
    case "SpacerM":
    case "SpacerL":
      return (
        <SpacerComponent information={converted} spacing={componentType} />
      );

    case "Gridx3":
      return (
        <GridComponent information={converted} index={index} columns={3} />
      );

    case "Gridx2":
      return (
        <GridComponent information={converted} index={index} columns={2} />
      );

    case "Single":
      return (
        <GridComponent information={converted} index={index} columns={1} />
      );

    case "ArticleLinks":
      return <ArticleLinksComponent information={converted} />;

    case "ArticleGrid":
      return <ArticleGridComponent information={converted} />;

    case "OneThird":
      return (
        <SplitComponent information={converted} leftCols={1} rightCols={2} />
      );
    case "TwoThirds":
      return (
        <SplitComponent information={converted} leftCols={2} rightCols={1} />
      );

    case "Hero":
    case "HeroGrey":
      return (
        <HeroComponent
          information={converted}
          isGrey={componentType === "HeroGrey"}
        />
      );

    case "TextAndImageLeft":
    case "TextAndImageRight":
      return (
        <TextAndImageComponent
          information={converted}
          isLeft={componentType === "TextAndImageLeft"}
          index={index}
        />
      );

    case "FormattedText":
      return <TextComponent information={converted} format={componentType} />;

    case "CenteredText":
      return <CenteredTextComponent information={converted} />;

    case "ArticleText":
      return <ArticleTextComponent information={converted} />;

    case "ArticleInfo":
      return <ArticleInfoComponent information={converted} />;

    case "TagLinks":
      return <TagLinksComponent information={converted} />;

    case "LogoParade":
      return <LogoParadeComponent information={converted} />;
  }

  return undefined;
}
