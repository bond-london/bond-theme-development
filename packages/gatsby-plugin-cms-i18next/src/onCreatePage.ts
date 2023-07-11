import { CreatePageArgs, Page } from "gatsby";
import { IInputPageContext, PageContext, IPluginOptions } from "./types";

function generatePage(
  page: Page<IInputPageContext>,
  { languages, siteUrl, defaultLanguage }: IPluginOptions,
): Page<PageContext> {
  return {
    ...page,
    context: {
      ...page.context!,
      i18n: {
        currentLanguage: page.context?.language || defaultLanguage,
        defaultLanguage: page.context?.defaultLanguage || defaultLanguage,
        languages,
        siteUrl,
      },
    },
  };
}
export function onCreatePage(
  { page, actions, reporter }: CreatePageArgs<IInputPageContext>,
  pluginOptions: IPluginOptions,
): void {
  // Exit if the page has already been processed.
  if (typeof (page.context as unknown as PageContext).i18n === "object") {
    reporter.panic(`On create page for ${page.path} has been called twice`);
    return;
  }

  const { createPage, deletePage } = actions;

  const newPage = generatePage(page, pluginOptions);

  try {
    deletePage(page);
  } catch (error) {
    console.error("Failed to delete page", error);
  }
  createPage(newPage);
}
