import bondPlugin from "@bond-london/bond-tailwind-plugin";

import { calculateRemSize } from "@bond-london/bond-tailwind-plugin/dist/utils";
import path from "path";
import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";
import { Config } from "tailwindcss/types/config";
import configuration from "./tailwind.config.json";

const animationTiming = "cubic-bezier(0.22, 1, 0.36, 1)";
const animationDuration = "0.5s";

const config: Config = {
  mode: "jit",
  content: [
    "./src/**/*.{tsx,ts}",
    "./gatsby-ssr.tsx",
    "./colors.ts",
    path.join(
      path.dirname(require.resolve("@bond-london/gatsby-theme/package.json")),
      "src",
      "**",
      "*.{tsx,ts}",
    ),
  ],
  theme: {
    fontFamily: {
      sans: ["Open Sans Variable", ...defaultTheme.fontFamily.sans],
      monospace: ["IBM Plex Mono", ...defaultTheme.fontFamily.mono],
      serif: ["Merriweather", ...defaultTheme.fontFamily.serif],
    },

    extend: {
      keyframes: {
        "enter-from-bottom": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
      height: {
        "mobile-icon": calculateRemSize(32),
        "laptop-icon": calculateRemSize(52),
        "mobile-nav": calculateRemSize(32),
        "laptop-nav": calculateRemSize(64),
      },
      animation: {
        "enter-from-bottom": `enter-from-bottom ${animationDuration} ${animationTiming} both`,
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-debug-screens"),
    require("@tailwindcss/forms"),
    bondPlugin(configuration),
    plugin(({ addUtilities }) => {
      addUtilities({
        ".mobile-gradient": {
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 30% 100%)",
        },
        ".laptop-gradient": {
          background:
            "linear-gradient(140deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 30% 100%)",
        },
        ".h-2-line-height": {
          height: "calc(2 * var(--bond-line-height))",
        },
        ".wrap-anywhere": {
          "overflow-wrap": "anywhere",
          "word-break": "break-word",
        },
      });
    }),
  ],
};

export default config;
