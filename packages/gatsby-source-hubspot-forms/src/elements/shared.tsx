import React from "react";
export function defaultShowError(message: string): JSX.Element {
  return <pre>{message}</pre>;
}
export interface IHubspotFormOptions {
  radioContainerClassName?: string;
  radioLabelClassName?: string;
  radioFieldClassName?: string;
  checkboxContainerClassName?: string;
  checkboxLabelClassName?: string;
  checkboxFieldClassName?: string;
  fieldContainerClassName?: string;
  labelClassName?: string;
  requiredClassName?: string;
  requiredText?: string;
  selectText?: string;
  fieldClassName?: string;
  textAreaRows?: number;
  showLabels?: boolean;
  submitButton?: boolean;
  successClassName?: string;
  failureClassName?: string;
  defaultSuccessMessage?: string;
  defaultFailureMessage?: string;
  showFormResponseOutside?: boolean;
  responseClassName?: string;
  formClassName?: string;
  submitClassName?: string;
  defaultSubmitText?: string;
  hideSubmitButton?: boolean;
  renderSubmitButton?: (text: string) => React.ReactElement;
  showError?: (message: string) => React.ReactElement;
  renderCheckbox?: (value: string, label?: string) => React.ReactElement;
}

export type EventReporter = (
  eventName: string,
  eventData: { [key: string]: unknown }
) => void;

export interface IHubspotFormDefinition {
  readonly __typename?: "HubspotForm";
  readonly id: string;
  readonly portalId?: string;
  readonly guid?: string;
  readonly name?: string;
  readonly action?: string;
  readonly method?: string;
  readonly cssClass?: string;
  readonly redirect?: string;
  readonly submitText?: string;
  readonly followUpId?: string;
  readonly notifyRecipients?: string;
  readonly leadNurturingCampaignId?: string;
  readonly formFieldGroups?: ReadonlyArray<IHubspotFormFieldGroupsDefinition>;
  readonly metaData?: ReadonlyArray<IHubspotFormMetaDataDefinition>;
  readonly inlineMessage?: string;
  readonly isPublished?: boolean;
  readonly thankYouMessageJson?: string;
}

export interface IHubspotFormMetaDataDefinition {
  readonly __typename?: "HubspotFormMetaData";
  readonly name?: string;
  readonly value?: string;
}

export interface IHubspotFormFieldGroupsDefinition {
  readonly __typename?: "HubspotFormFormFieldGroups";
  readonly fields?: ReadonlyArray<IHubspotFormFieldDefinition>;
  readonly default?: boolean;
  readonly isSmartGroup?: boolean;
  readonly richText?: IHubspotFormRichTextDefinition;
  readonly isPageBreak?: boolean;
}

export interface IHubspotFormRichTextDefinition {
  readonly __typename?: "HubspotFormFormFieldGroupsRichText";
  readonly content?: string;
  readonly type?: string;
}

export interface IHubspotFormFieldDefinition {
  readonly __typename?: "HubspotFormFormFieldGroupsFields";
  readonly name?: string;
  readonly label?: string;
  readonly type?: string;
  readonly fieldType?: string;
  readonly description?: string;
  readonly groupName?: string;
  readonly displayOrder?: number;
  readonly required?: boolean;
  readonly options?: ReadonlyArray<IHubspotFormFormFieldOptionsDefinition>;
  readonly validation?: IHubspotFormFormFieldValidationDefinition;
  readonly enabled?: boolean;
  readonly hidden?: boolean;
  readonly defaultValue?: string;
  readonly isSmartField?: boolean;
  readonly unselectedLabel?: string;
  readonly placeholder?: string;
  readonly dependentFieldFilters?: ReadonlyArray<IHubspotFormFormDependentFieldDefinition>;
  readonly labelHidden?: boolean;
  readonly propertyObjectType?: string;
  readonly objectTypeId?: string;
}

export interface IHubspotFormFormFieldOptionsDefinition {
  readonly __typename?: "HubspotFormFormFieldGroupsFieldsOptions";
  readonly label?: string;
  readonly value?: string;
  readonly displayOrder?: number;
  readonly doubleData?: number;
  readonly hidden?: boolean;
  readonly description?: string;
  readonly readOnly?: boolean;
}

export interface IHubspotFormFormFieldValidationDefinition {
  readonly __typename?: "HubspotFormFormFieldGroupsFieldsValidation";
  readonly name?: string;
  readonly message?: string;
  readonly data?: string;
  readonly useDefaultBlockList?: boolean;
}

export interface IHubspotFormFormDependentFieldDefinition {
  readonly __typename?: "HubspotFormFormFieldGroupsFieldsDependentFieldFilters";
  readonly filters?: ReadonlyArray<IHubspotFormFormDependentFieldFiltersDefinition>;
  readonly dependentFormField?: Omit<
    IHubspotFormFieldDefinition,
    "dependentFieldFilters"
  >;
  readonly formFieldAction?: string;
}

export interface IHubspotFormFormDependentFieldFiltersDefinition {
  readonly __typename?: "HubspotFormFormFieldGroupsFieldsDependentFieldFiltersFilters";
  readonly operator?: string;
  readonly strValue?: string;
  readonly boolValue?: boolean;
  readonly numberValue?: number;
  readonly strValues?: ReadonlyArray<string>;
}
