import React from "react";
import { ArticleText } from "../components/ArticleText";
import { Banner } from "../components/Banner";
import { IComponentInformation } from "../components/GenericComponent";
import { ImageCard } from "../components/ImageCard";
import { SectionHero } from "../components/SectionHero";
import { Standard } from "../components/Standard";
import { TextComponent } from "../components/TextComponent";

export function tryHandleCustomComponent(
  converted: IComponentInformation,
  componentType: Queries.CmsComponentFragment["componentType"]
) {
  switch (componentType) {
    case "Hero":
    case "HeroGrey":
      return (
        <SectionHero
          information={converted}
          isGrey={componentType === "HeroGrey"}
        />
      );
    case "ImageLeft":
    case "ImageRight":
      return (
        <ImageCard
          information={converted}
          assetLeft={componentType === "ImageLeft"}
        />
      );
    case "Banner":
    case "BannerGrey":
      return (
        <Banner
          information={converted}
          isGrey={componentType === "BannerGrey"}
        />
      );

    case "FormattedText":
      return <TextComponent information={converted} format={componentType} />;

    case "ArticleText":
      return <ArticleText information={converted} />;

    case "Standard":
      return <Standard information={converted} />;
  }
}
