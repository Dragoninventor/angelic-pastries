/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */

const config = {
	tailwindConfig: "./tailwind.config.ts",
	plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
