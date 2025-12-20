import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
      import: importPlugin,
    },

    extends: [
      js.configs.recommended,
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
      "plugin:react-hooks/recommended",
      "plugin:import/errors",
      "plugin:import/warnings",
    ],

    settings: {
      react: { version: "detect" },
    },

    rules: {
      //-----------------------------
      // 🔥 IMPORT RULES
      //-----------------------------
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/no-named-as-default": "warn",

      //-----------------------------
      // 🔥 REACT + JSX RULES
      //-----------------------------
      // báo lỗi khi dùng component JSX mà chưa import
      "react/jsx-uses-vars": "error",

      // đảm bảo JSX dùng đúng biến
      "react/jsx-uses-react": "error",

      // tắt cảnh báo về thuộc tính DOM lạ (ví dụ className vs class)
      "react/no-unknown-property": "off",

      //-----------------------------
      // 🔥 HOOK RULES (khuyên dùng)
      //-----------------------------
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
