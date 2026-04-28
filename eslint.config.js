import { defineConfig } from "@fullstacksjs/eslint-config";

export default defineConfig({
  ignores: [
    ".husky/*",
    "auth_info_baileys/*",
    "node_modules/*",
    "migrations/*",
  ],
});
