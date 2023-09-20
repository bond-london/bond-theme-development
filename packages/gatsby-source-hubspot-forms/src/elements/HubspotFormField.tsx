import React from "react";
import { FieldFactory } from "./HubspotFormFieldFactory";
import {
  IHubspotFormFieldDefinition,
  IHubspotFormOptions,
  makeInputId,
} from "./shared";

export const HubspotFormField: React.FC<{
  formName: string;
  field: IHubspotFormFieldDefinition;
  options: IHubspotFormOptions;
  value?: string | number | undefined;
  onInteracted: () => void;
  onChange?: (ev: React.ChangeEvent<HTMLElement>) => void;
}> = ({ formName, field, value, onInteracted, onChange, options }) => (
  <div className={options.fieldContainerClassName}>
    {options.showLabels && field.label && !field.hidden && (
      <label
        className={options.labelClassName}
        htmlFor={makeInputId(formName, field.name)}
      >
        <p dangerouslySetInnerHTML={{ __html: field.label }} />
        {field.required && options.requiredText && (
          <span className={options.requiredClassName}>
            <span>{options.requiredText}</span>
          </span>
        )}
      </label>
    )}
    <FieldFactory
      type={field.fieldType!}
      field={{ formName, field, value, onInteracted, onChange, options }}
    />
  </div>
);
