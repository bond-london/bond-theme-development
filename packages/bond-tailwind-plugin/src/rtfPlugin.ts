import { withOptions } from "tailwindcss/plugin";
import { Config, PluginAPI } from "tailwindcss/types/config";

const defaultName = "rtf";
const variants = [
  ["headings", "h1", "h2", "h3", "h4", "h5", "h6", "th"],
  ["body", "div"],
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
  "p",
  "blockquote",
  "figure",
  "figcaption",
  "strong",
  "b",
  "i",
  "u",
  "em",
  "code",
  "pre",
  "table",
  "thead",
  "tbody",
  "th",
  "tr",
  "td",
  "img",
  "video",
  "hr",
];

export interface RtfPluginConfig {
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function rtfPlugin(_config: RtfPluginConfig) {
  const result: Partial<Config> = {};
  return result;
}
function expandVariant(variant: string | Array<string>) {
  if (Array.isArray(variant)) {
    const [variantName, ...selectors] = variant;
    return { variantName, selectors };
  }
  return { variantName: variant, selectors: [variant] };
}
function build({ addVariant }: PluginAPI, { name }: RtfPluginConfig) {
  for (const variant of variants) {
    const { variantName, selectors } = expandVariant(variant);
    for (const selector of selectors) {
      addVariant(`${name}-${variantName}`, `& :is(${selector})`);
    }
  }
}

const configure = withOptions(
  ({ name = defaultName }: RtfPluginConfig) =>
    (helpers: PluginAPI) => {
      build(helpers, { name });
    },
  ({ name = defaultName }: RtfPluginConfig) => rtfPlugin({ name }),
);

export default configure;
