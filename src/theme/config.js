import { defineConfig, createSystem, defaultConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: "#1D4ED8", //blue
          100: "#9D9D9D", //dark grey
          200: "#000000", //black
          300: "#D9D9D9", //light grey (logo)
          400: "#FFFFFF", //white
          500: "#EF5D60", //primary
        },
      },
      fonts: {
        body: {
          value: "Inter, sans-serif",
        },
        heading: {
          value: "Inter, sans-serif",
        },
      },
      breakpoints: {
        base: "0em", // 0px
        sm: "30em", // 480px
        md: "48em", // 768px
        lg: "64em", // 1024px
        lgx: "70em",
        xl: "75em", // 1200px
        "2xl": "90em", // 1440px
      },
    },
  },
  globalCss: {
    "*": {
      margin: 0,
      padding: 0,
    },
    body: {
      fontFamily: "Inter, sans-serif",
    },
    "#root": {
      height: "100%",
    },
  },
});

const system = createSystem(defaultConfig, config);

export default system;