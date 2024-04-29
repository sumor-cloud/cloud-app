export default (pkg, isNode) => {
  const result = {
    name: pkg.name,
    type: 'module',
    bin: pkg.bin,
    main: './index.umd.cjs',
    module: './index.es.js',
    exports: {
      '.': {
        import: './index.es.js',
        require: './index.umd.cjs'
      }
    },
    dependencies: pkg.dependencies
  }

  if (isNode) {
    result.main = './index.es.js'
    delete result.exports['.'].require // = './index.es.js';
  }

  return result
}
