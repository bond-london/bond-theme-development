import React from "react";
import {
  defaultShowError,
  IHubspotFormFieldDefinition,
  IHubspotFormOptions,
} from "./shared";

export interface IFieldProps {
  formName: string;
  field: IHubspotFormFieldDefinition;
  value?: string | number;
  onInteracted: () => void;
  onChange?: (ev: React.ChangeEvent<HTMLElement>) => void;
  options: IHubspotFormOptions;
}

const handlers: Record<string, React.FC<IFieldProps>> = {};

export function registerFieldTypeHandler(
  type: string,
  component: React.FC<IFieldProps>,
): void {
  handlers[type] = component;
}
export const FieldFactory: React.FC<{ type: string; field: IFieldProps }> = ({
  type,
  field,
}) => {
  const C = handlers[type];
  if (C) {
    return <C {...field} />;
  }

  const { options } = field;
  const showError = options.showError ?? defaultShowError;
  return showError(`No field of type ${type}`);
};
