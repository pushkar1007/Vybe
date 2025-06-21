import { defineConfig, createSystem, defaultConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: "#1D4ED8", //blue
          100: "#9D9D9D", //dark grey
          200: "#000000", //black
          300: "#D9D9D9", //light grey
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
    },
  },
  globalCss: {
    body: {
      fontFamily: "Inter, sans-serif",
    },
  },
});

const system = createSystem(defaultConfig, config);

export default system;