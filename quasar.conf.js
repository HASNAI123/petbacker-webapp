/* eslint-env node */
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = function (ctx) { // ctx will help in accessing dev/prod mode settings
  return {
    supportTS: false,
    boot: ['i18n', 'axios'],
    css: [],
    extras: ['roboto-font', 'material-icons'],

    build: {
      vueRouterMode: 'hash', // 'hash' or 'history'

      // Add the following settings:
       // true when in production mode

      mode: { spa: true }, // Specify SPA mode
      modeName: 'spa', // Give the mode a name

      target: {}, // Customize target if needed (e.g., web)
      targetName: undefined, // Define target name if necessary
      arch: {}, // Define architecture if necessary
      archName: undefined, // Define architecture name if needed

      // Use debug option
      debug: ctx.debug || false, // true if in debug mode

      chainWebpack (chain) {
        chain.plugin('eslint-webpack-plugin')
          .use(ESLintPlugin, [{ extensions: ['js', 'vue'] }]);
      }
    },

    devServer: {
      https: false,
      port: 8080,
      open: true // opens browser window automatically
    },

    framework: {
      iconSet: 'material-icons',
      lang: 'en-us',
      config: {},
      importStrategy: 'auto',
      plugins: []
    },

    animations: [],
    ssr: { pwa: false },
    pwa: {
      workboxPluginMode: 'GenerateSW',
      manifest: {
        name: `app.petbacker.com`,
        short_name: `app.petbacker.com`,
        description: `Sitter app`,
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    capacitor: {
      hideSplashscreen: false
    },

    electron: {
      bundler: 'packager',
      packager: {
        // Configure packager if necessary
      },
      builder: {
        appId: 'petbacker'
      },
      nodeIntegration: true,
      extendWebpack (/* cfg */) {
        // Extend electron Webpack config here if necessary
      }
    }
  };
};
