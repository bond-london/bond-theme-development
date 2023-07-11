import React, {
  HTMLInputTypeAttribute,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  IFieldProps,
  registerFieldTypeHandler,
} from "./HubspotFormFieldFactory";
import { IHubspotFormFieldDefinition, makeInputId } from "./shared";

function calculateInputType(
  field: IHubspotFormFieldDefinition,
): HTMLInputTypeAttribute | undefined | null {
  const { name, type } = field;
  switch (type) {
    case "string":
      if (name === "email") {
        return "email";
      }
      break;

    case "phonenumber":
      return "tel";

    case "number":
      return "number";
  }

  return type;
}

const HubspotTextField: React.FC<IFieldProps> = ({
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
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentValue(ev.currentTarget.value);
      onChange?.(ev);
    },
    [onChange],
  );

  return (
    <input
      value={currentValue}
      id={makeInputId(formName, field.name)}
      name={field.name ?? undefined}
      placeholder={field.placeholder ?? undefined}
      type={calculateInputType(field) ?? undefined}
      hidden={field.hidden ?? undefined}
      required={field.required ?? undefined}
      className={options.fieldClassName}
      onInput={onInteracted}
      onChange={handleChange}
    />
  );
};

export function registerHubspotTextField(): void {
  registerFieldTypeHandler("text", HubspotTextField);
  registerFieldTypeHandler("number", HubspotTextField);
  registerFieldTypeHandler("phonenumber", HubspotTextField);
}
