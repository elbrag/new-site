const tailwindConfig = require("./tailwind.config.js");
const resolveConfig = require("tailwindcss/resolveConfig");
const fullConfig = resolveConfig(tailwindConfig);

module.exports = fullConfig;
