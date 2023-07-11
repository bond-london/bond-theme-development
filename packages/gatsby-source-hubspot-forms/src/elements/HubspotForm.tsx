import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  EventReporter,
  IHubspotFormDefinition,
  IHubspotFormFieldDefinition,
  IHubspotFormFieldGroup,
  IHubspotFormFieldGroupsDefinition,
} from "./shared";
import { defaultShowError, IHubspotFormOptions } from "./shared";
import { registerHubspotTextField } from "./HubspotTextField";
import { registerTextAreaField } from "./HubspotTextAreaField";
import { registerSelectField } from "./HubspotSelectField";
import { registerRadioField } from "./HubspotRadioField";
import { registerCheckboxField } from "./HubspotCheckboxField";
import { useFirstVisibleToUser } from "@bond-london/gatsby-theme";
import { HubspotFormGroup } from "./HubspotFormGroup";

function register(): void {
  registerHubspotTextField();
  registerTextAreaField();
  registerSelectField();
  registerRadioField();
  registerCheckboxField();
}

interface IHubspotFormResponse {
  message: string;
  status: string;
  errors: ReadonlyArray<{ message: string }>;
}

function getCookieValue(name: string): string | undefined {
  return (
    document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() ||
    undefined
  );
}

export function useFormHandler(
  formDefinition: IHubspotFormDefinition,
  handleFormData?: (formData: FormData) => void,
  reportEvent?: EventReporter,
  pageName?: string,
  ipAddress?: string,
): {
  submitForm: (form: HTMLFormElement, onSuccess?: () => void) => void;
  allGroups: ReadonlyArray<IHubspotFormFieldGroup>;
  status: "Idle" | "Success" | "Failed";
  formResponse: IHubspotFormResponse | undefined;
  formRef: React.Ref<HTMLFormElement>;
  handleFormInteracted: () => void;
} {
  const [formRef, formVisible] = useFirstVisibleToUser<HTMLFormElement>(
    0.1,
    0.1,
  );

  const formState = useRef<IDynamicFormState>({ isDirty: false });
  const handleFinished = useCallback(() => {
    const { isDirty, form } = formState.current;

    if (form && formDefinition && isDirty) {
      handleFormAbandoned(form, formDefinition);
    }
  }, [formDefinition]);

  useEffect(() => handleFinished, [handleFinished]);

  const [status, setStatus] = useState<"Idle" | "Success" | "Failed">("Idle");
  const handleFormInteracted = useCallback(() => {
    formState.current.isDirty = true;
    setStatus("Idle");
  }, []);

  useEffect(() => {
    if (formVisible && formDefinition) {
      formState.current.form = formRef.current;
      reportEvent?.("hubspot_form_view", {
        formId: formDefinition.id,
        formName: formDefinition.name?.trim(),
      });
    }
  }, [formVisible, formDefinition, formRef, reportEvent]);
  const { allGroups, fieldMapping } = useMemo(
    () => buildHubspotFormInformation(formDefinition),
    [formDefinition],
  );
  const [formResponse, setFormResponse] = useState<IHubspotFormResponse>();
  const submitForm = useCallback(
    (form: HTMLFormElement, onSuccess?: () => void) => {
      if (formDefinition.portalId && formDefinition.guid) {
        reportEvent?.("hubspot_form_submit", {
          formId: formDefinition.id,
          formName: formDefinition.name?.trim(),
        });
        const formData = new FormData(form);
        handleFormData?.(formData);
        const fields: Array<{
          objectTypeId: string | undefined;
          name: string;
          value: string;
        }> = [];
        const request = {
          fields,
          context: {
            pageName,
            pageUri: window.location.pathname,
            hutk: getCookieValue("hubspotutk"),
            ipAddress,
          },
        };
        formData.forEach((v, k) => {
          const field = fieldMapping[k];
          if (field) {
            fields.push({
              objectTypeId: field.objectTypeId || undefined,
              name: k,
              value: Array.isArray(v) ? v.join(";") : v.toString(),
            });
          }
        });

        formState.current.isDirty = false;
        const url = `https://api.hsforms.com/submissions/v3/integration/submit/${formDefinition.portalId}/${formDefinition.guid}`;
        const payload = JSON.stringify(request);
        fetch(url, {
          method: "POST",
          body: payload,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          headers: { "Content-Type": "application/json" },
        })
          .then(response => {
            if (response.ok) {
              setFormResponse(undefined);
              reportEvent?.("hubspot_form_success", {
                formId: formDefinition.id,
                formName: formDefinition.name?.trim(),
              });

              setStatus(formState.current.isDirty ? "Idle" : "Success");
              const element = document.getElementById("success-response");
              if (element) {
                element.scrollIntoView();
              }
              onSuccess?.();
            } else {
              console.log("error:", response);
              response
                .json()
                .then((t: IHubspotFormResponse) => {
                  console.log("response text", t);
                  reportEvent?.("hubspot_form_failure", {
                    formName: formDefinition.name?.trim(),
                    formId: formDefinition.id,
                    formResponse: t,
                  });
                  setFormResponse(t);
                })
                .catch(error => {
                  console.log("getting response error:", error);
                  reportEvent?.("hubspot_form_failure", {
                    formId: formDefinition.id,
                    formName: formDefinition.name?.trim(),
                  });
                })
                .finally(() => {
                  setStatus("Failed");
                });
            }
          })
          .catch(error => {
            console.log("Failed", error);
            reportEvent?.("hubspot_form_error", {
              formId: formDefinition.id,
              formName: formDefinition.name?.trim(),
            });
            setStatus("Failed");
          });
      }
    },
    [
      formDefinition.portalId,
      formDefinition.guid,
      formDefinition.id,
      formDefinition.name,
      reportEvent,
      handleFormData,
      pageName,
      ipAddress,
      fieldMapping,
    ],
  );

  return {
    submitForm,
    allGroups,
    status,
    formResponse,
    formRef,
    handleFormInteracted,
  };
}

export function handleFormAbandoned(
  form: HTMLFormElement,
  formDefinition: IHubspotFormDefinition,
  reportEvent?: EventReporter,
): void {
  const data = new FormData(form);
  const nonEmptyFields: Array<string> = [];
  data.forEach((value, key) => {
    if (value.toString()) {
      nonEmptyFields.push(key);
    }
  });
  reportEvent?.("hubspot_form_abandoned", {
    formId: formDefinition.id,
    formName: formDefinition.name?.trim(),
    formNonEmptyFields: nonEmptyFields.length ? nonEmptyFields : undefined,
  });
}

export function buildHubspotFormInformation(
  formDefinition?: IHubspotFormDefinition,
): {
  allGroups: ReadonlyArray<IHubspotFormFieldGroup>;
  fieldMapping: { [name: string]: IHubspotFormFieldDefinition };
} {
  const fieldMapping: { [name: string]: IHubspotFormFieldDefinition } = {};
  const allGroups: Array<IHubspotFormFieldGroup> = [];
  if (formDefinition) {
    (
      formDefinition.formFieldGroups?.filter(
        ffg => ffg && ffg.default,
      ) as ReadonlyArray<IHubspotFormFieldGroupsDefinition>
    ).forEach(ffg => {
      const groupFields: Array<IHubspotFormFieldDefinition> = [];
      ffg.fields?.forEach(field => {
        if (field?.name) {
          groupFields.push(field);
          fieldMapping[field.name] = field;
        }
        if (field?.dependentFieldFilters) {
          field.dependentFieldFilters.forEach(dff => {
            if (dff?.dependentFormField?.name) {
              fieldMapping[dff.dependentFormField.name] =
                dff.dependentFormField;
            }
          });
        }
      });
      if (groupFields.length > 0) {
        allGroups.push(groupFields);
      }
    });
  }
  return { allGroups, fieldMapping };
}

export interface IDynamicFormState {
  isDirty: boolean;
  form?: HTMLFormElement | null;
}

export const HubspotForm: React.FC<{
  form: IHubspotFormDefinition;
  options?: IHubspotFormOptions;
  values?: { [name: string]: string | number | undefined };
  handleFormData?: (formData: FormData) => void;
  reportEvent?: EventReporter;
  pageName?: string;
  formAnchor?: string;
  ipAddress?: string;
}> = ({
  form: formDefinition,
  values,
  options = {},
  handleFormData,
  reportEvent,
  pageName,
  ipAddress,
  formAnchor,
}) => {
  const {
    status,
    formResponse,
    submitForm,
    allGroups,
    formRef,
    handleFormInteracted,
  } = useFormHandler(
    formDefinition,
    handleFormData,
    reportEvent,
    pageName,
    ipAddress,
  );

  const showError = options.showError || defaultShowError;

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      submitForm(e.currentTarget);
    },
    [submitForm],
  );
  if (!formDefinition) {
    return showError("Form does not exist");
  }
  if (!formDefinition.portalId || !formDefinition.guid) {
    return showError("Invalid form configuration");
  }

  if (status === "Success") {
    if (formDefinition?.redirect) {
      const link = document.createElement("a");
      link.href = formDefinition.redirect;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
    }
    return (
      <div id="success-response" className={options.successClassName}>
        {formDefinition.inlineMessage ? (
          <div
            dangerouslySetInnerHTML={{ __html: formDefinition.inlineMessage }}
          />
        ) : (
          <p>{options.defaultSuccessMessage || ""}</p>
        )}
      </div>
    );
  }

  if (status === "Failed") {
    if (!formResponse) {
      return (
        <div className={options.failureClassName}>
          <p>{options.defaultFailureMessage || ""}</p>
        </div>
      );
    }
  }

  const name =
    formAnchor ||
    (formDefinition.name || formDefinition.id).replace(/\s+/g, "");
  const submitText =
    formDefinition.submitText || options.defaultSubmitText || "Submit";

  return (
    <>
      {formResponse && options.showFormResponseOutside && (
        <div className={options.responseClassName}>
          <h3>{formResponse.message}</h3>
          {formResponse.errors.map(error => (
            <p key={error.message}>{error.message}</p>
          ))}
        </div>
      )}
      <form
        id={name}
        className={options.formClassName}
        method="POST"
        onSubmit={onSubmit}
        ref={formRef}
      >
        {formResponse && !options.showFormResponseOutside && (
          <div className={options.responseClassName}>
            <h3>{formResponse.message}</h3>
            {formResponse.errors.map(error => (
              <p key={error.message}>{error.message}</p>
            ))}
          </div>
        )}
        {allGroups.map((group, index) => (
          <HubspotFormGroup
            formName={name}
            key={index}
            group={group}
            options={options}
            onInteracted={handleFormInteracted}
            values={values}
          />
        ))}
        {!options.hideSubmitButton && (
          <button
            id={`Submit ${name}`}
            type="submit"
            className={options.submitClassName}
          >
            {options.renderSubmitButton ? (
              options.renderSubmitButton(submitText)
            ) : (
              <span>{submitText}</span>
            )}
          </button>
        )}
      </form>
    </>
  );
};

register();
