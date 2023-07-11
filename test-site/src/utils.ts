import { IBondImage } from "@bond-london/gatsby-theme";
import { FormEvent, useCallback, useState } from "react";

/* eslint-disable import/no-unused-modules */
export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  if (value === null || value === undefined) return false;
  return true;
}

export function convertText(text?: string) {
  if (text) {
    const replaced = text.replace(/&nbsp;/g, "\u00a0");
    return replaced;
  }
}

export function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function stringToUTF8Bytes(string: string) {
  return new TextEncoder().encode(string);
}

export function removeImagePlacholder(image?: IBondImage) {
  if (image) {
    return {
      ...image,
      image: image.image
        ? { ...image.image, placeholder: undefined, backgroundColor: undefined }
        : undefined,
    };
  }
}

export function combineComponents(
  ...components: ReadonlyArray<
    ReadonlyArray<Queries.CmsComponentFragment | null> | null | undefined
  >
): ReadonlyArray<Queries.CmsComponentFragment> {
  const result: Array<Queries.CmsComponentFragment> = [];
  components?.forEach((c) => {
    c?.forEach((i) => {
      if (i) {
        result.push(i);
      }
    });
  });
  return result;
}

export interface IFormState<T = unknown> {
  submitting?: boolean;
  success?: boolean;
  failure?: boolean;
  error?: unknown;
  response?: T;
}
export function useFormSubmit<T = unknown>(endpoint: string) {
  const [state, setState] = useState<IFormState<T>>({});
  const handleSubmit = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      const form = ev.target as HTMLFormElement;
      const formData = new FormData(form);
      const body: Record<string, unknown> = {};
      formData.forEach((v, k) => (body[k] = v));

      setState({ submitting: true });
      fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { Accept: "application/json" },
      })
        .then((response) => {
          response
            .json()
            .then((data: unknown) => {
              if (response.ok) {
                setState({ success: true, response: data as T });
              } else {
                setState({ failure: true, error: data });
              }
            })
            .catch((error: unknown) => setState({ failure: true, error }));
        })
        .catch((error: unknown) => setState({ failure: true, error }));
    },
    [endpoint],
  );

  return { state, handleSubmit };
}
