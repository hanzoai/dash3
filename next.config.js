const withCSS      = require('@zeit/next-css')
const withStylus   = require('@zeit/next-stylus')
const postcss      = require('poststylus')
const autoprefixer = require('autoprefixer')
const comments     = require('postcss-discard-comments')
const rupture      = require('rupture')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(
  withCSS(
    withStylus({
      stylusLoaderOptions: {
        use: [
          rupture(),
          postcss([
            autoprefixer(),
            'rucksack-css',
            comments({ removeAll: true })
          ])
        ]
      },
      webpack: (config, { defaultLoaders, isServer }) => {
        resolve = {
          mainFields: ['module', 'browser', 'main']
        }

        config.module.rules.push({
          test: /\.mjs$/,
          type: "javascript/auto"
        })

        config.module.rules.push({
          test: /\.(eot|woff|woff2|ttf|webp|txt|jpg|png|jpeg|svg|gif)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                context: "",
                outputPath: "static",
                publicPath: "/_next/static",
                name: "[path][name].[hash].[ext]"
              }
            }
          ]
        })

        return config
      },
    })
  )
)

// module.exports = withCss({
//   webpack(config, options) {
//     const { dev } = options
//     config.plugins = config.plugins.filter(plugin => {
//       return plugin.constructor.name !== 'UglifyJsPlugin';
//     });

//     if (!dev) {
//       // add Babili plugin
//       config.plugins.push(
//         new BabiliPlugin()
//       );
//     }
//     return config
//   }
// });
