import React from "react";
import {
  GenericComponent,
  IComponentInformation,
} from "../components/GenericComponent";

export function tryHandleCustomComponent(
  converted: IComponentInformation,
  componentType: Queries.CmsComponentFragment["componentType"]
) {
  switch (componentType) {
    case "Generic":
      return (
        <GenericComponent
          information={converted}
          componentType={componentType}
        />
      );
  }
}
