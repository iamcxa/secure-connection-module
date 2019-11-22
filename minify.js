const minifyPreset = require('babel-preset-minify');
const babel = require('@babel/core');
const fs = require('fs');
const args = process.argv.slice(2);
if (args.length !== 2) {
  throw new Error('Must pass two arguments, input and output filename');
}

const { code } = babel.transformSync(fs.readFileSync(args[0]), {
  minified: true,
  sourceType: 'module',
  configFile: false,
  presets: [['@babel/preset-env', { modules: false }], [minifyPreset]],
  plugins: [
    'add-module-exports',
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-modules-commonjs',
  ],
});

fs.writeFileSync(args[1], code);
