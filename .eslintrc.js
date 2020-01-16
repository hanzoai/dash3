module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  extends: ['airbnb', 'prettier/react'],
  plugins: ['autofix', 'import-order-alphabetical'],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true
  },
  rules: {
    'jsx-a11y/href-no-hash': ['off'],
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-plusplus': 'off',
    'jsx-quotes': ['warn', 'prefer-single'],
    'import-order-alphabetical/order': 'warn',
    'no-param-reassign': ['error', { props: false }],
    'import/no-extraneous-dependencies': ['error', {
      'devDependencies': true,
      'optionalDependencies': false,
      'peerDependencies': false
    }],
    'sort-imports': ['warn', {
        'ignoreCase': false,
        'ignoreDeclarationSort': true,
        'ignoreMemberSort': false,
        'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single']
    }],
    'max-len': [
      'warn',
      {
        code: 80,
        tabWidth: 2,
        comments: 80,
        ignoreComments: false,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true
      },
    ],
    'semi': ['error', 'never'],
    'autofix/no-debugger': 'error',
  }
};
