module.exports = {
  extends: ["stylelint-config-standard-scss"],
  plugins: ["stylelint-scss"],
  ignoreFiles: ["**/node_modules/**", "**/.next/**", "public/**"],
  rules: {
    // Disallow legacy color helpers and deprecated Sass functions in our codebase.
    // We'll enforce these to prevent new usage; Bootstrap will still warn from node_modules.
    "function-disallowed-list": [
      "darken",
      "lighten",
      "shade-color",
      "tint-color",
      "mix",
      "red",
      "green",
      "blue"
    ],
    // Warn if @import is used (prefer @use/@forward for project files)
    "at-rule-disallowed-list": ["import"],
    // Keep standard rules from config otherwise
  }
};