import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      primary: "#092361",
      state: {
        red: "#EE4700",
        green: "#00BB2A",
      },
      gray: {
        50: "#FBFBFD",
        100: "#F3F5F9",
        200: "#E9EFF9",
        300: "#C6D0DC",
        400: "#8F97A9",
        500: "#69717D",
        600: "#4F535C",
        700: "#31343D",
        800: "#24292F",
        900: "#131418",
      },
    },
  },
  plugins: [],
};
export default config;
