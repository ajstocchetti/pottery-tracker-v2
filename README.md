# TODOs

- [ ] refresh data from dbx when page gains focus (from other tab, etc)
- [ ] make piece status an enum (and clay, form?)
- [ ] style nav bar (for full screen)
- [ ] button styling
- [ ] image order drag-and-drop
- [x] if savePiece is debounced, call it when page unmounts
- [x] make added piece the first (add to front of array)
- [x] get cloudfront non "/" urls to work (or use hash based routing? gross)
- [x] 404 page
- [x] delete piece functionality
- [x] image load retry
- [x] image -> piece (image <-> piece) reference
- [x] file name standardization: multi-word.tsx vs multiWord.tsx

# Dropbox API Resources

https://developers.dropbox.com/error-handling-guide
https://www.dropbox.com/developers/documentation/http/overview
https://dropbox.github.io/dropbox-api-v2-explorer
https://github.com/dropbox/dropbox-sdk-js/blob/13053183b349d312600f0b943b95a1be8e8c75ba/lib/routes.js

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```
