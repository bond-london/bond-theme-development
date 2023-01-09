import React from "react";
import { HubspotDependentField } from "./HubspotDependentField";
import {
  IHubspotFormOptions,
  IHubspotFormFormDependentFieldDefinition,
} from "./shared";

export const HubspotDependentFields: React.FC<{
  fields: ReadonlyArray<IHubspotFormFormDependentFieldDefinition>;
  parentValue?: string;
  options: IHubspotFormOptions;
  onInteracted: () => void;
}> = ({ fields, parentValue, options, onInteracted }) => (
  <>
    {fields
      .filter(field => field.dependentFormField?.enabled)
      .map(field => (
        <HubspotDependentField
          key={field.dependentFormField?.label}
          field={field}
          parentValue={parentValue}
          options={options}
          onInteracted={onInteracted}
        />
      ))}
  </>
);
