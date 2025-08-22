

// ESLint configuration for TypeScript and React projects
// This file is adapted from .eslintrc.js with comments for clarity.
// Uses @typescript-eslint for TypeScript linting and Prettier for formatting.


// Specifies the ESLint parser for TypeScript
const tsParser = require("@typescript-eslint/parser");
const js = require("@eslint/js");


// For compatibility with legacy ESLint config (extends, etc.)
const {
    FlatCompat,
} = require("@eslint/eslintrc");


const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

/**
 * ESLint 9.x+ does not support require('eslint/config').
 * Export the config array directly.
 */
module.exports = [
    {
        // General config for all files
        languageOptions: {
            parser: tsParser, // Specifies the ESLint parser
            ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
            sourceType: "module", // Allows for the use of imports
            parserOptions: {
                project: "tsconfig.json",
                tsconfigRootDir: __dirname,
                ecmaFeatures: {
                    jsx: true, // Allows for the parsing of JSX
                },
            },
        },
        rules: {
            // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
            // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
            "prettier/prettier": ["error", { endOfLine: "auto" }],
            "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
            "@typescript-eslint/no-unused-expressions": ['error', { allowShortCircuit: true, allowTernary: true }]
        },
        settings: {
            react: {
                version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
            },
        },
    },
    // Spread the recommended configs for TypeScript and Prettier directly into the array
    ...compat.extends(
        "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        "plugin:prettier/recommended" // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ),
    {
        files: ["**/*.ts", "**/*.tsx"], // TypeScript file extension(s)
        languageOptions: {
            parserOptions: {
                project: ["./tsconfig.json"], // Specify it only for TypeScript files
            },
        },
    },
];
