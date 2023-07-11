import React, { createContext, PropsWithChildren } from "react";
import { IComponentInformation } from "@/components/GenericComponent";

// eslint-disable-next-line import/no-unused-modules
export const CmsComponentContext = createContext<
  IComponentInformation | undefined
>(undefined);

export const CmsComponentContextProvider: React.FC<
  PropsWithChildren<{ component: IComponentInformation }>
> = ({ component, children }) => (
  <CmsComponentContext.Provider value={component}>
    {children}
  </CmsComponentContext.Provider>
);
