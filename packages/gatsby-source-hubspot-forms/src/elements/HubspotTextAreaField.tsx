import React, { useCallback, useEffect, useState } from "react";
import {
  IFieldProps,
  registerFieldTypeHandler,
} from "./HubspotFormFieldFactory";
import { makeInputId } from "./shared";

const HubspotTextareaField: React.FC<IFieldProps> = ({
  formName,
  field,
  onInteracted,
  onChange,
  value,
  options,
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  useEffect(() => setCurrentValue(value), [value]);
  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentValue(ev.currentTarget.value);
      onChange?.(ev);
    },
    [onChange],
  );

  return (
    <textarea
      value={currentValue}
      id={makeInputId(formName, field.name)}
      name={field.name ?? undefined}
      placeholder={field.placeholder ?? undefined}
      hidden={field.hidden ?? undefined}
      required={field.required ?? undefined}
      className={options.fieldClassName}
      rows={options.textAreaRows ?? 3}
      onInput={onInteracted}
      onChange={handleChange}
    />
  );
};

export function registerTextAreaField(): void {
  registerFieldTypeHandler("textarea", HubspotTextareaField);
}
