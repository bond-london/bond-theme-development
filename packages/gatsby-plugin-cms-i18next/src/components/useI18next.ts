import { i18n, KeyPrefix, Namespace, TFunction, TypeOptions } from "i18next";
import { useContext } from "react";
import { useTranslation, UseTranslationOptions } from "react-i18next";
import { I18NextContext } from "../types";
import { I18nextContext } from "./i18nextContext";

type DefaultNamespace = TypeOptions["defaultNS"];

export function useI18next<
  N extends Namespace = DefaultNamespace,
  TKPrefix extends KeyPrefix<N> = undefined,
>(
  ns?: Namespace,
  options?: UseTranslationOptions<TKPrefix>,
): I18NextContext & {
  i18n: i18n;
  t: TFunction<string | ReadonlyArray<string>, TKPrefix>;
  ready: boolean;
} {
  const { i18n, t, ready } = useTranslation(ns, options);
  const context = useContext(I18nextContext);

  return {
    ...context,
    i18n,
    t,
    ready,
  };
}
