import React, { useCallback, useEffect, useState } from "react";
import {
  IFieldProps,
  registerFieldTypeHandler,
} from "./HubspotFormFieldFactory";

const HubspotTextareaField: React.FC<IFieldProps> = ({
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
    [onChange]
  );

  return (
    <textarea
      value={currentValue}
      id={field.name}
      name={field.name}
      placeholder={field.placeholder}
      hidden={field.hidden}
      required={field.required}
      className={options.fieldClassName}
      rows={options.textAreaRows || 3}
      onInput={onInteracted}
      onChange={handleChange}
    />
  );
};

export function registerTextAreaField(): void {
  registerFieldTypeHandler("textarea", HubspotTextareaField);
}
