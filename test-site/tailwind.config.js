const plugin = require(`tailwindcss/plugin`);
const path = require("path");
const config = require("./tailwind.config.json");
const animationTiming = "cubic-bezier(0.22, 1, 0.36, 1)";
const animationDuration = "0.5s";
const bondPlugin = require("@bond-london/bond-tailwind-plugin/dist/utils");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
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
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": {
            transform: "translateY(0)",
            opacity: 1,
          },
        },
      },
      height: {
        "mobile-icon": bondPlugin.calculateRemSize(32),
        "laptop-icon": bondPlugin.calculateRemSize(52),
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
    require("@bond-london/bond-tailwind-plugin")(config),
    plugin(({ addBase, addComponents, addUtilities, theme }) => {
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
