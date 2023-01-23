import React from "react";
import { ICollectionInformation } from "../collections/GenericCollection";
import { HalfCollection } from "../collections/HalfCollection";
import { LogoGrid } from "../collections/LogoGrid";
import { SmallCollection } from "../collections/SmallCollection";

export function tryHandleCustomCollection(
  converted: ICollectionInformation,
  collectionType: Queries.CmsCollectionFragment["collectionType"]
) {
  // Fill this in
  switch (collectionType) {
    case "HalfLeft":
    case "HalfRight":
      return (
        <HalfCollection
          collection={converted}
          isLeft={collectionType === "HalfLeft"}
        />
      );
    case "SmallLeft":
    case "SmallRight":
      return (
        <SmallCollection
          collection={converted}
          isLeft={collectionType === "SmallLeft"}
        />
      );

    case "LogoGrid":
      return <LogoGrid collection={converted} />;
  }
}
