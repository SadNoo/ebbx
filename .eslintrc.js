// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['test/unit/index.js']
    }],
    // allow debugger during development
    'object-shorthand': ['error', 'always'],
    'object-curly-newline': ['error', { consistent: true }],
    'import/prefer-default-export': 0,
    'arrow-parens': ['error', 'always'],
    'no-unused-vars': [2, { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
    'no-bitwise': 0,
    'no-alert': 0,
    'no-console': 0,
    'no-shadow': 0,
    'no-lonely-if': 0,
    'no-continue': 0,
    'no-param-reassign': 0,
    'no-else-return': 0,
    'no-irregular-whitespace': 0,
    'linebreak-style': 0,
    'semi': ['error', 'never']
  }
}
