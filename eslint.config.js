const { defineConfig } = require('eslint/config');
const expo = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expo,
  { ignores: ['dist/*', '.expo/*'] },
  {
    rules: {
      // Reanimated shared values are mutated via `.value` by design; the React Compiler lint can't know that.
      'react-hooks/immutability': 'off',
    },
  },
]);
