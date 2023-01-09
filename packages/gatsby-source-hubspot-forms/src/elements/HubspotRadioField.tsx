import React, { useCallback, useEffect, useState } from "react";
import { HubspotDependentFields } from "./HubspotDependentFields";
import {
  IFieldProps,
  registerFieldTypeHandler,
} from "./HubspotFormFieldFactory";
import { IHubspotFormFormFieldOptionsDefinition } from "./shared";

const HubspotRadioField: React.FC<IFieldProps> = ({
  field,
  onInteracted,
  onChange,
  value,
  options,
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  useEffect(() => setCurrentValue(value), [value]);
  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentValue(ev.currentTarget.value);
      onChange?.(ev);
    },
    [onChange]
  );

  const { options: fieldOptions } = field;
  if (!fieldOptions) {
    return null;
  }

  return (
    <>
      <div className={options.radioContainerClassName}>
        {(
          fieldOptions.filter(
            o => o
          ) as ReadonlyArray<IHubspotFormFormFieldOptionsDefinition>
        ).map(option => {
          const checked = option.value === currentValue;
          return (
            <label key={option.value} className={options.radioLabelClassName}>
              <input
                className={options.radioFieldClassName}
                type="radio"
                name={field.name || undefined}
                checked={checked}
                value={option.value || undefined}
                onInput={onInteracted}
                onChange={handleChange}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
      {field.__typename === "HubspotFormFormFieldGroupsFields" &&
        field.dependentFieldFilters && (
          <HubspotDependentFields
            fields={field.dependentFieldFilters}
            parentValue={currentValue as string}
            options={options}
            onInteracted={onInteracted}
          />
        )}
    </>
  );
};

export function registerRadioField(): void {
  registerFieldTypeHandler("radio", HubspotRadioField);
}
