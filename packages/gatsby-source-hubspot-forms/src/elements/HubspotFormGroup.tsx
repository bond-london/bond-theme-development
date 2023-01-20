import React from "react";
import { HubspotFormField } from "./HubspotFormField";
import { IHubspotFormFieldGroup, IHubspotFormOptions } from "./shared";

export const HubspotFormGroup: React.FC<{
  formName: string;
  group: IHubspotFormFieldGroup;
  options: IHubspotFormOptions;
  values?: { [name: string]: string | number | undefined };
  onInteracted: () => void;
  onChange?: (ev: React.ChangeEvent<HTMLElement>) => void;
}> = ({ formName, group, options, values, onInteracted, onChange }) => {
  const allHiddenFields = group.every(f => f.hidden);

  return (
    <div
      className={
        allHiddenFields
          ? options.hiddenFieldGroupClassName
          : options.fieldGroupClassName
      }
    >
      {group.map(field => (
        <HubspotFormField
          formName={formName}
          key={field.name}
          options={options}
          field={field}
          onInteracted={onInteracted}
          onChange={onChange}
          value={values && field.name ? values[field.name] : ""}
        />
      ))}
    </div>
  );
};
