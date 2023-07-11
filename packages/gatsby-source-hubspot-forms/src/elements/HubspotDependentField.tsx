import React, { useMemo } from "react";
import {
  IHubspotFormOptions,
  IHubspotFormFormDependentFieldDefinition,
} from "./shared";
import { HubspotFormField } from "./HubspotFormField";

export const HubspotDependentField: React.FC<{
  formName: string;
  field: IHubspotFormFormDependentFieldDefinition;
  parentValue?: string;
  onInteracted: () => void;
  options: IHubspotFormOptions;
}> = ({ formName, field, parentValue, options, onInteracted }) => {
  const { filters, dependentFormField } = field;

  const isDisplayed = useMemo(() => {
    if (filters && parentValue) {
      const valid = filters.find(filter => {
        switch (filter?.operator) {
          case "SET_ANY":
            if (parentValue === filter.strValue) {
              return true;
            }
            if (filter.strValues) {
              if (filter.strValues.includes(parentValue)) {
                return true;
              }
            }
            break;

          default:
            throw new Error(
              `Don't support filter operator ${filter?.operator ?? "??"}`,
            );
        }
        return false;
      });
      if (valid) {
        return true;
      }
    }
    return false;
  }, [filters, parentValue]);

  if (isDisplayed && dependentFormField) {
    return (
      <HubspotFormField
        formName={formName}
        field={dependentFormField}
        options={options}
        onInteracted={onInteracted}
      />
    );
  }
  return null;
};
