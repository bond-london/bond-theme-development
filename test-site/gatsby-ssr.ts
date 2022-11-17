import { RenderBodyArgs } from "gatsby";

export function onRenderBody({ setHtmlAttributes }: RenderBodyArgs) {
  setHtmlAttributes({ lang: `en` });
}
