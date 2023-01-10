import React from "react";
import { HubspotFormField } from "./HubspotFormField";
import { IHubspotFormFieldGroup, IHubspotFormOptions } from "./shared";

export const HubspotFormGroup: React.FC<{
  group: IHubspotFormFieldGroup;
  options: IHubspotFormOptions;
  values?: { [name: string]: string | number | undefined };
  onInteracted: () => void;
  onChange?: (ev: React.ChangeEvent<HTMLElement>) => void;
}> = ({ group, options, values, onInteracted, onChange }) => (
  <div className={options.fieldGroupClassName}>
    {group.map(field => (
      <HubspotFormField
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
