/* eslint-env node */
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = function (ctx) {
  return {
    supportTS: false,
    boot: [
      'i18n',
      'axios',
      'global-components',
      'global-mixin',
      'google-maps',
      'gtm',
      'vue-clipboard',
      'lightbox',
      'underscore',
      'vue-notifications',
    ],
    css: [],
    extras: ['roboto-font', 'material-icons'],

    build: {
      rtl: false,
      scopeHoisting: true,
      vueRouterMode: 'history',

      target: {}, // Customize target if needed (e.g., web)
      targetName: undefined, // Define target name if necessary
      arch: {}, // Define architecture if necessary
      archName: undefined, // Define architecture name if needed

      // Use debug option
      debug: ctx.debug || false, // true if in debug mode

      chainWebpack(chain) {
        chain.plugin('eslint-webpack-plugin')
          .use(ESLintPlugin, [{ extensions: ['js', 'vue'] }]);
      },
    },
    env: ctx.dev
      ? {
          APP_VERSION: "'1.9.43'",
          PETBACKER_LOCAL: "'https://pbapidev.forwen.com/v5'",
          PETBACKER_LOCAL_A: "'http://192.168.0.202/yii2-api/api/web/v5'",
          PETBACKER_LOCAL_B: "'http://192.168.0.68/yii2-api/api/web/v5'",
          PETBACKER_API_V5: "'https://api.petbacker.com/v5'",
          PETBACKER_API_STAGING_V5: "'https://pbapistaging.forwen.com/v5'",
          PETBACKER_API_STAGING_DEV: "'https://pbapidev.forwen.com/v5'",
          FB_APP_KEY: "'1966773486968223'",
          GOOGLE_MAPS_KEY: "'AIzaSyD8T0A1xZTGF1I7lcqxg8TNH5MrmalNZsI'",
          VUE_ROUTER_MODE: "'history'",
          GOOGLE_AUTH2_CLIENT_ID: "'589322981525-5de6v8dat603v01icvu4isipm5tj7qsq.apps.googleusercontent.com'",
          GOOGLE_AUTH2_IOS_ID: "'589322981525-ucln80tpbv0cgatou0ptb48qccif4mb8.apps.googleusercontent.com'",
          GOOGLE_AUTH2_ANDROID_ID: "'589322981525-8jmotd4ss8lu5mepa4e7tf3nfjuhu9qq.apps.googleusercontent.com'",
          TAZAPAY_API_KEY: "'2G1KWV1P5JFOX5F4G96V'",
          TAZAPAY_SIGNATURE_SECRET: "'sandbox_TPc4kpIyPLr9Q0t19RQWmCiZNbAGNtTfAyHEPzGBBm6qqLWynV2gSBWWwTlDQTh4dJyhfug9I74oxl7fyfjqTTUAi9pErzTwF9gyIFUPbeJZKMRWgYNhbeyjaRiLfEAU'",
          TAZAPAY_API_URL: "'https://api-sandbox.tazapay.com/v1/'",
          IOS_APP_ID: "'1168037472'",
          ANDROID_APP_ID: "'com.petbacker.android'",
        }
      : {
          APP_VERSION: "'1.9.43'",
          PETBACKER_LOCAL: "'https://pbapidev.forwen.com/v5'",
          PETBACKER_LOCAL_A: "'http://192.168.0.202/yii2-api/api/web/v5'",
          PETBACKER_LOCAL_B: "'http://192.168.0.68/yii2-api/api/web/v5'",
          PETBACKER_API_V5: "'https://api.petbacker.com/v5'",
          PETBACKER_API_STAGING_V5: "'https://pbapistaging.forwen.com/v5'",
          PETBACKER_API_STAGING_DEV: "'https://pbapidev.forwen.com/v5'",
          FB_APP_KEY: "'1441906625823904'",
          GOOGLE_MAPS_KEY: "'AIzaSyD8T0A1xZTGF1I7lcqxg8TNH5MrmalNZsI'",
          VUE_ROUTER_MODE: "'history'",
          GOOGLE_AUTH2_CLIENT_ID: "'589322981525-8j6bslqjhooekrjelq9uv09dd8n8cugn.apps.googleusercontent.com'",
          GOOGLE_AUTH2_IOS_ID: "'589322981525-ucln80tpbv0cgatou0ptb48qccif4mb8.apps.googleusercontent.com'",
          GOOGLE_AUTH2_ANDROID_ID: "'589322981525-8jmotd4ss8lu5mepa4e7tf3nfjuhu9qq.apps.googleusercontent.com'",
          TAZAPAY_API_KEY: "'2G1KWV1P5JFOX5F4G96V'",
          TAZAPAY_SIGNATURE_SECRET: "'sandbox_TPc4kpIyPLr9Q0t19RQWmCiZNbAGNtTfAyHEPzGBBm6qqLWynV2gSBWWwTlDQTh4dJyhfug9I74oxl7fyfjqTTUAi9pErzTwF9gyIFUPbeJZKMRWgYNhbeyjaRiLfEAU'",
          TAZAPAY_API_URL: "'https://api-sandbox.tazapay.com/v1/'",
          IOS_APP_ID: "'1168037472'",
          ANDROID_APP_ID: "'com.petbacker.android'",
        },

    devServer: {
      https: false,
      port: 8080,
      open: true, // opens browser window automatically
    },

    framework: {
      components: [
        'QPageSticky',
        'QPageScroller',
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QTooltip',
        'QBtn',
        'QBtnToggle',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QImg',
        'QItemLabel',
        'QBtnDropdown',
        'QSeparator',
        'QExpansionItem',
        'QSpinner',
        'QField',
        'QInput',
        'QMenu',
        'QSpinnerFacebook',
        'QFooter',
        'QDialog',
        'QBtnGroup',
        'QBtnToggle',
        'QSelect',
        'QBanner',
        'QImg',
        'QVideo',
        'QInfiniteScroll',
        'QSpinnerDots',
        'QSpinnerBall',
        'QChip',
        'QLinearProgress',
        'QCheckbox',
        'QRadio',
        'QDate',
        'QTime',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QChatMessage',
        'QUploader',
        'QCarousel',
        'QCarouselSlide',
        'QCarouselControl',
        'QRating',
        'QSelect',
        'QTabs',
        'QTab',
        'QTabPanel',
        'QTabPanels',
        'QPagination',
        'QAvatar',
        'QPopupProxy',
        'QPullToRefresh',
        'QEditor',
        'QScrollObserver',
        'QScrollArea',
        'QBadge',
        'QSlideItem',
        'QSkeleton',
        'QToggle',
        'QFab',
        'QFabAction'
      ],
      directives: [
        'Ripple', 'Scroll', 'ClosePopup', 'GoBack', 'TouchSwipe', 'TouchRepeat', 'TouchPan', 'TouchHold'
      ],
      // Quasar plugins
      plugins: [
        'Loading',
        'Notify',
        'LocalStorage',
        'Dialog',
        'Cookies'
      ],
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
            type: 'image/png',
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    },

    capacitor: {
      hideSplashscreen: false,
    },

    electron: {
      bundler: 'packager',
      packager: {
        // Configure packager if necessary
      },
      builder: {
        appId: 'petbacker',
      },
      nodeIntegration: true,
      extendWebpack(/* cfg */) {
        // Extend electron Webpack config here if necessary
      },
    },
  };
};
