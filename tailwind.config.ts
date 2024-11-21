import type { Config } from "tailwindcss";

const svgToDataUri = require("mini-svg-data-uri");

const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        emerald: {
          "50": "#eafff5",
          "100": "#cbffe5",
          "200": "#9dfdd1",
          "300": "#5ef7ba",
          "400": "#16db93", // Main
          "500": "#00d089",
          "600": "#00aa70",
          "700": "#00885e",
          "800": "#006b4b",
          "900": "#005840",
          "950": "#003225",
        },
        "antique-brass": {
          "50": "#f9f4f1",
          "100": "#ede2d8",
          "200": "#d8c2af",
          "300": "#c4a085",
          "400": "#b98a6d", // Main
          "500": "#ab6e55",
          "600": "#965849",
          "700": "#7e453f",
          "800": "#683a38",
          "900": "#573130",
          "950": "#301818",
        },
        givry: {
          "50": "#fcf8f0",
          "100": "#f9efdb",
          "200": "#f4e1c1", // Main
          "300": "#e9c388",
          "400": "#e0a257",
          "500": "#d98836",
          "600": "#ca702c",
          "700": "#a85826",
          "800": "#874725",
          "900": "#6d3b21",
          "950": "#3a1d10",
        },
        "selective-yellow": {
          "50": "#fffbeb",
          "100": "#fff2c6",
          "200": "#fee589",
          "300": "#fed14b",
          "400": "#fdb813", // Main
          "500": "#f79b09",
          "600": "#db7404",
          "700": "#b65007",
          "800": "#933e0d",
          "900": "#79330e",
          "950": "#461902",
        },
        woodsmoke: {
          "50": "#f7f7f8",
          "100": "#eeeef0",
          "200": "#d9d9de",
          "300": "#b7b7c2",
          "400": "#9091a0",
          "500": "#727485",
          "600": "#5c5d6d",
          "700": "#4b4c59",
          "800": "#41424b",
          "900": "#393941",
          "950": "#0e0e10", // Main
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-grid-small": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-dot": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    },
  ],
};
export default config;
