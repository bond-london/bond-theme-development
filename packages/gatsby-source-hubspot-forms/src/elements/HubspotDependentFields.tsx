import React from "react";
import { HubspotDependentField } from "./HubspotDependentField";
import {
  IHubspotFormOptions,
  IHubspotFormFormDependentFieldDefinition,
} from "./shared";

export const HubspotDependentFields: React.FC<{
  formName: string;
  fields: ReadonlyArray<IHubspotFormFormDependentFieldDefinition | null>;
  parentValue?: string;
  options: IHubspotFormOptions;
  onInteracted: () => void;
}> = ({ formName, fields, parentValue, options, onInteracted }) => (
  <>
    {(
      fields.filter(
        field => field?.dependentFormField?.enabled,
      ) as ReadonlyArray<IHubspotFormFormDependentFieldDefinition>
    ).map(field => (
      <HubspotDependentField
        formName={formName}
        key={field.dependentFormField?.label}
        field={field}
        parentValue={parentValue}
        options={options}
        onInteracted={onInteracted}
      />
    ))}
  </>
);
