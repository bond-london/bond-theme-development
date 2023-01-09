import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  IFieldProps,
  registerFieldTypeHandler,
} from "./HubspotFormFieldFactory";

function buildSet(value?: string): ReadonlyArray<string> {
  if (!value || value.length === 0) {
    return [];
  }
  return value?.split(";") || [];
}

function addValue(
  current: ReadonlyArray<string>,
  value: string
): ReadonlyArray<string> {
  if (current.includes(value)) return current;
  return [...current, value];
}

function removeValue(
  current: ReadonlyArray<string>,
  value: string
): ReadonlyArray<string> {
  const index = current.indexOf(value);
  if (index < 0) return current;
  return current.filter((_, i) => i !== index);
}

const HubspotCheckboxField: React.FC<IFieldProps> = ({
  field,
  onInteracted,
  onChange,
  value,
  options,
}) => {
  const [currentValue, setCurrentValue] = useState(() =>
    buildSet(value as string)
  );
  useEffect(() => setCurrentValue(buildSet(value as string)), [value]);
  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const input = ev.currentTarget;
      const { checked, value } = input;
      setCurrentValue(current => {
        const newValue = checked
          ? addValue(current, value)
          : removeValue(current, value);
        return newValue;
      });
      onChange?.(ev);
    },
    [onChange]
  );

  const currentStringValue = useMemo(
    () => currentValue.join(";"),
    [currentValue]
  );

  const { options: fieldOptions } = field;
  if (!fieldOptions) {
    return null;
  }

  return (
    <>
      <div className={options.checkboxContainerClassName}>
        <input type="hidden" name={field.name} value={currentStringValue} />
        {fieldOptions
          .filter(o => o.value)
          .map(option => {
            const value = option.value as string;
            const checked = currentValue.includes(value);
            return (
              <label key={value} className={options.checkboxLabelClassName}>
                <input
                  className={options.checkboxFieldClassName}
                  type="checkbox"
                  checked={checked}
                  id={option.value}
                  value={option.value}
                  onInput={onInteracted}
                  onChange={handleChange}
                />
                {options.renderCheckbox &&
                  options.renderCheckbox(value, option.label)}
                <span>{option.label}</span>
              </label>
            );
          })}
      </div>
    </>
  );
};

export function registerCheckboxField(): void {
  registerFieldTypeHandler("checkbox", HubspotCheckboxField);
}
