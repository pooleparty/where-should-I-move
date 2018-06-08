module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    browser: true,
    jest: true,
  },
  rules: {
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],

    // git will switch LF based on OS, so rule should switch also
    'linebreak-style': ['error', (require('os').EOL === '\r\n' ? 'windows' : 'unix')],

    // ignore 'next' argument that denotes middleware in express
    // ( https://expressjs.com/en/guide/using-middleware.html )
    // ( https://github.com/eslint/eslint/issues/1494 )
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],

    // use '.js' extension for all JS files (including ones that contain JSX)
    // we deviate from the airbnb styleguide on this rule
    // ( https://github.com/airbnb/javascript/pull/985 )
    'react/jsx-filename-extension': ['error', { extensions: ['.js'] }],

    // we specify some components as PureComponents over
    // stateless fuctional components for performance reasons
    'react/prefer-stateless-function': ['error', { ignorePureComponents: true }],
  },
};
