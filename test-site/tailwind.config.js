const path = require("path");
const config = require("./tailwind.config.json");

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
    extend: {},
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-debug-screens"),
    require("@tailwindcss/forms"),
    require("@bond-london/bond-tailwind-plugin")(config),
  ],
};
