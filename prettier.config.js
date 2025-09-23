/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  endOfLine: "auto",
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],
  printWidth: 100,

  tailwindFunctions: ["clsx"],
  tailwindStylesheets: ["./app/tailwind.css"],
};

export default config;
