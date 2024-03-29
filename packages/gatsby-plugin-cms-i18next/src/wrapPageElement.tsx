import { WrapPageElementBrowserArgs } from "gatsby";
import i18next, { InitOptions, Resource } from "i18next";
import React, { PropsWithChildren, useMemo } from "react";
import { I18nextProvider } from "react-i18next";
import { I18nextContext } from "./components/i18nextContext";
import {
  I18NextContext,
  ILocaleNode,
  IPluginOptions,
  PageContext,
} from "./types";

interface ILocalesInformation {
  _locales: {
    edges: Array<{ node: ILocaleNode }>;
  };
}

const PageElementWrapper: React.FC<
  PropsWithChildren<{
    i18nextOptions: InitOptions;
    i18nextContext: I18NextContext;
    pageContext: PageContext;
  }>
> = ({ i18nextOptions, i18nextContext, pageContext, children }) => {
  const { resourcesJson } = pageContext;
  const value = useMemo(() => {
    const options: InitOptions = {
      ...i18nextOptions,
      lng: i18nextContext.currentLanguage,
      react: {
        useSuspense: false,
      },
    };
    const i18n = i18next.createInstance();

    i18n
      .init({
        ...options,
        resources: JSON.parse(resourcesJson) as Resource,
      })
      .then(() => {
        // console.log("initialised i18n with ns", i18n);
      })
      .catch(error => console.warn(`failed to initialise i18n with ns`, error));

    return i18n;
  }, [resourcesJson, i18nextContext.currentLanguage, i18nextOptions]);

  return (
    <I18nextProvider i18n={value}>
      <I18nextContext.Provider value={i18nextContext}>
        {children}
      </I18nextContext.Provider>
    </I18nextProvider>
  );
};

export const wrapPageElement = (
  {
    element,
    props,
  }: WrapPageElementBrowserArgs<ILocalesInformation, PageContext>,
  { i18nextOptions }: IPluginOptions,
): JSX.Element | null | undefined => {
  const { pageContext } = props;
  const i18nextContext = pageContext.i18n;
  if (!i18nextContext || !pageContext.resourcesJson) {
    // eslint-disable-next-line node/no-process-env
    if (process.env.NODE_ENV === "development") {
      console.warn("Page has no i18n or resources");
    }
    return element;
  }

  return (
    <PageElementWrapper
      i18nextOptions={i18nextOptions}
      i18nextContext={i18nextContext}
      pageContext={pageContext}
    >
      {element}
    </PageElementWrapper>
  );
};
