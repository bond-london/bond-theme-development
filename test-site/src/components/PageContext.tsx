import { IBondImage } from "@bond-london/gatsby-theme";
import { createContext, useCallback, useContext } from "react";

interface IPageContext {
  title: string;
  description: string;
  featuredImage?: IBondImage;
}

const defaultContext: IPageContext = {
  title: "Unknown",
  description: "Unknown",
};

export const PageContext = createContext<IPageContext>(defaultContext);

export type TextConverter = (text: string | null) => string | null;

export function defaultTextConverter(text: string | null) {
  return text;
}

export function usePageContext() {
  const context = useContext(PageContext);

  const convertText: TextConverter = useCallback(
    (text: string | null) => {
      if (context === defaultContext) return text;
      if (!text) return null;
      const converted = text
        .replaceAll("{title}", context.title)
        .replaceAll("{description}", context.description);
      return converted;
    },
    [context]
  );

  return { convertText, featuredImage: context.featuredImage };
}
