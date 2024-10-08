import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nadeshiko: {
          50: "#fffcfd",
          100: "#fff7fa",
          200: "#fff0f5",
          300: "#fddce6", // FC で使われている色
          400: "#fccada",
          500: "#fcb9ce", // 公式サイトで使われている色
          600: "#fa9dbb",
          700: "#f783aa",
          800: "#f26894",
          900: "#ed4f81", // FC で使われている色
          950: "#d63668",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          // "system-ui" は使わない Windows 11 で Meiryo UI になるため。
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
  },
  plugins: [typography()],
} satisfies Config;
