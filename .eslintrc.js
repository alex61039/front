module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb-typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    createDefaultProgram: true,
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'default-param-last': 'off',
    '@typescript-eslint/default-param-last': ['off'],
    '@typescript-eslint/no-throw-literal': ['off'],
    'react/function-component-definition': 'off',
    'jsx-a11y/label-has-associated-control': ['error', {
      required: {
        some: ['nesting', 'id'],
      },
    }],
    'react/jsx-no-bind': [1, {
      allowFunctions: true,
      allowArrowFunctions: true,
    }],
    'react/require-default-props': [0],
    'jsx-a11y/click-events-have-key-events': [0],
    'jsx-a11y/no-noninteractive-element-interactions': [0],
    'jsx-a11y/no-static-element-interactions': [0],
    'jsx-a11y/control-has-associated-label': [0],
  },
};
