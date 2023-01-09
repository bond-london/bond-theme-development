import React from "react";
import { IHubspotFormFieldDefinition } from "./shared";
import { IHubspotFormOptions } from "./shared";
import { FieldFactory } from "./HubspotFormFieldFactory";

export const HubspotFormField: React.FC<{
  field: IHubspotFormFieldDefinition;
  options: IHubspotFormOptions;
  value?: string | number | undefined;
  onInteracted: () => void;
  onChange?: (ev: React.ChangeEvent<HTMLElement>) => void;
}> = ({ field, value, onInteracted, onChange, options }) => (
  <div className={options.fieldContainerClassName}>
    {options.showLabels && field.label && !field.hidden && (
      <label className={options.labelClassName} htmlFor={field.name}>
        <p dangerouslySetInnerHTML={{ __html: field.label }} />
        {field.required && options.requiredText && (
          <span className={options.requiredClassName}>
            <span>{options.requiredText}</span>
          </span>
        )}
      </label>
    )}
    <FieldFactory
      type={field.fieldType as string}
      field={{ field, value, onInteracted, onChange, options }}
    />
  </div>
);
