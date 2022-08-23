const bondPlugin = require("@bond-london/bond-tailwind-plugin/dist/utils");
const config = require("./tailwind.config.json");
const defaulttheme = require("tailwindcss/defaultTheme");
const animationTiming = "cubic-bezier(0.22, 1, 0.36, 1)";
const animationDuration = "0.5s";

const navHeight = config.spacing.xxxs + config.spacing.m + config.spacing.xxs;

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{tsx,ts}", "./gatsby-ssr.tsx"],
  theme: {
    fontFamily: {
      poppins: ["Poppins", ...defaulttheme.fontFamily.sans],
    },
    extend: {
      gridTemplateColumns: {
        "icon-button": `${bondPlugin.calculateRemSize(config.spacing.xxs)} 1fr`,
      },
      gridTemplateRows: {
        "nav-closed": `${bondPlugin.calculateRemSize(navHeight)} 1fr`,
        "nav-open": `${bondPlugin.calculateRemSize(
          navHeight
        )} ${bondPlugin.calculateRemSize(
          config.spacing.s
        )} 1fr ${bondPlugin.calculateRemSize(config.spacing.s)}`,
      },
      spacing: {
        ...bondPlugin.mapNumbers(
          [1, 2, 3],
          bondPlugin.defaultKeyFn,
          bondPlugin.remValueFn
        ),
        nav: bondPlugin.calculateRemSize(navHeight),
        icon: bondPlugin.calculateRemSize(6),
      },
      borderRadius: {
        normal: bondPlugin.calculateRemSize(24),
      },
      zIndex: {
        cookies: "1000",
        modal: "500",
      },
      maxHeight: {
        navClosed: bondPlugin.calculateRemSize(88),
        navOpen: bondPlugin.calculateRemSize(2000),
        modal: "80vh",
      },
      keyframes: {
        "enter-from-top": {
          "0%": { transform: "translateY(-20px)", opacity: 0 },
          "100%": {
            transform: "translateY(0)",
            opacity: 1,
          },
        },
        "enter-from-bottom": {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": {
            transform: "translateY(0)",
            opacity: 1,
          },
        },
        "enter-from-left": {
          "0%": { transform: "translateX(-20px)", opacity: 0 },
          "100%": {
            transform: "translateX(0)",
            opacity: 1,
          },
        },
        "enter-from-right": {
          "0%": { transform: "translateX(20px)", opacity: 0 },
          "100%": {
            transform: "translateX(0)",
            opacity: 1,
          },
        },
        appear: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        "enter-from-top": `enter-from-top ${animationDuration} ${animationTiming} both`,
        "enter-from-bottom": `enter-from-bottom ${animationDuration} ${animationTiming} both`,
        "enter-from-left": `enter-from-left ${animationDuration} ${animationTiming} both`,
        "enter-from-right": `enter-from-right ${animationDuration} ${animationTiming} both`,
        appear: `appear ${animationDuration} ${animationTiming} both`,
      },
      borderWidth: {
        6: "6px",
      },
      transitionTimingFunction: {
        bond: animationTiming,
      },
    },
    outline: {
      error: ["4px solid red", "2px"],
      "debug-white": "1px dashed white",
      "debug-black": "1px dashed black",
    },
  },
  variants: {
    extend: {
      borderRadius: ["last", "first"],
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-debug-screens"),
    require("@tailwindcss/forms"),
    require("@bond-london/bond-tailwind-plugin")(config),
  ],
};
