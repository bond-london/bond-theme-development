import React from "react";
import {
  GenericCollection,
  ICollectionInformation,
} from "../collections/GenericCollection";

export function tryHandleCustomCollection(
  converted: ICollectionInformation,
  collectionType: Queries.CmsCollectionFragment["collectionType"]
) {
  // Fill this in
  switch (collectionType) {
    case "Generic":
      return (
        <GenericCollection
          information={converted}
          collectionType={collectionType}
        />
      );
  }
}
