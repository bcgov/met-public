const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const moduleFileExtensions = [
    'web.mjs',
    'mjs',
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
  ];

  // Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
    const extension = moduleFileExtensions.find(extension =>
      fs.existsSync(resolveFn(`${filePath}.${extension}`))
    );
  
    if (extension) {
      return resolveFn(`${filePath}.${extension}`);
    }
  
    return resolveFn(`${filePath}.js`);
  };

  const config = {
    entry: resolveModule(resolveApp,'src/web-components/index'),
    output: {
        path: resolveApp('wc-lib'),
        filename: `static/js/met-web-component.${require(resolveApp('package.json')).version}.js`
    }
  }

  module.exports = config;