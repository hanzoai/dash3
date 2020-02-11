module.exports = (api) => {
  api.cache(true)

  return {
    presets: [
      [
        'next/babel',
      ],
    ],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
    exclude: [],
    // ignore: [/node_modules\/(?!.*d3.*)/],
  }
}
