const path = require("path");
const config = require("./tailwind.config.json");
const animationTiming = "cubic-bezier(0.22, 1, 0.36, 1)";
const animationDuration = "0.5s";
const bondPlugin = require("@bond-london/bond-tailwind-plugin/dist/utils");

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./src/**/*.{tsx,ts}",
    "./gatsby-ssr.tsx",
    path.join(
      path.dirname(require.resolve("@bond-london/gatsby-theme/package.json")),
      "src",
      "**",
      "*.{tsx,ts}"
    ),
  ],
  theme: {
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
  ],
};
