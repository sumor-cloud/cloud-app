import * as esbuild from 'esbuild'

export default async (options) => {
  const external = Object.keys(options.pkg.dependencies || {})
  await esbuild.build({
    format: 'esm',
    entryPoints: [options.entry],
    minify: options.mode === 'production',
    keepNames: options.mode === 'development',
    bundle: true,
    platform: 'node',
    outfile: `${options.output}/index.es.js`,
    external,
    sourcemap: options.mode === 'development' ? 'inline' : false
  })
}
