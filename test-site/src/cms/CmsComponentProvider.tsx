import { IComponentInformation } from "@/components/GenericComponent";
import React, { createContext, PropsWithChildren } from "react";

// eslint-disable-next-line import/no-unused-modules
export const CmsComponentContext = createContext<
  IComponentInformation | undefined
>(undefined);

/* eslint-disable import/no-unused-modules */
export const CmsComponentContextProvider: React.FC<
  PropsWithChildren<{ component: IComponentInformation }>
> = ({ component, children }) => (
  <CmsComponentContext.Provider value={component}>
    {children}
  </CmsComponentContext.Provider>
);
