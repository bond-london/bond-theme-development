import React from "react";
import { PageContext } from "../types";

function createUrlWithLang(
  siteUrl: string,
  corePath: string,
  otherLanguage: string
): string {
  const newPath = `/${otherLanguage}${corePath}`;
  const url = `${siteUrl}${newPath}`;
  if (url.endsWith("/")) {
    return url;
  }
  return `${url}/`;
}
export const I18Head: React.FC<{ pageContext: PageContext }> = ({
  pageContext: {
    corePath,
    i18n: { languages, currentLanguage, defaultLanguage, siteUrl },
  },
}) => (
  <>
    <html lang={currentLanguage} />
    <link
      rel="canonical"
      href={createUrlWithLang(siteUrl, corePath, currentLanguage)}
    />
    {languages.map(lng => (
      <link
        rel="alternate"
        key={lng}
        href={createUrlWithLang(siteUrl, corePath, lng)}
        hrefLang={lng}
      />
    ))}
    {/* adding a fallback page for unmatched languages */}
    <link
      rel="alternate"
      href={createUrlWithLang(siteUrl, corePath, defaultLanguage)}
      hrefLang="x-default"
    />
  </>
);
