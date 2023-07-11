import React, { ChangeEvent, useCallback, useState } from "react";
import { HubspotDependentFields } from "./HubspotDependentFields";
import {
  IFieldProps,
  registerFieldTypeHandler,
} from "./HubspotFormFieldFactory";
import { IHubspotFormFormFieldOptionsDefinition, makeInputId } from "./shared";

const HubspotSelectField: React.FC<IFieldProps> = ({
  formName,
  field,
  onInteracted,
  onChange,
  value,
  options,
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      const element = ev.currentTarget;
      setCurrentValue(element.value);
      onInteracted();
      onChange?.(ev);
    },
    [onInteracted, onChange],
  );
  return (
    <>
      <select
        id={makeInputId(formName, field.name)}
        name={field.name ?? undefined}
        placeholder={field.placeholder ? field.placeholder : undefined}
        hidden={field.hidden ?? undefined}
        required={field.required ?? undefined}
        className={options.fieldClassName}
        onChange={handleChange}
        value={currentValue}
      >
        {options.selectText && (
          <option label={options.selectText} disabled={true} value="">
            {options.selectText}
          </option>
        )}
        {(
          field.options?.filter(
            o => o,
          ) as ReadonlyArray<IHubspotFormFormFieldOptionsDefinition>
        ).map(o => (
          <option
            key={o.label}
            label={o.label ?? undefined}
            value={o.value ?? undefined}
          >
            {o.label}
          </option>
        ))}
      </select>
      {field.__typename === "HubspotFormFormFieldGroupsFields" &&
        field.dependentFieldFilters && (
          <HubspotDependentFields
            formName={formName}
            fields={field.dependentFieldFilters}
            parentValue={currentValue as string}
            options={options}
            onInteracted={onInteracted}
          />
        )}
    </>
  );
};

export function registerSelectField(): void {
  registerFieldTypeHandler("select", HubspotSelectField);
}
