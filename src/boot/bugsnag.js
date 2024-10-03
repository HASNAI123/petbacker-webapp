const bugsnag = require('bugsnag-js')
const bugsnagVue = require('bugsnag-vue')

export default ({ Vue }) => {
  let bugsnagClient = bugsnag({
    apiKey: '56c8830592c7bfd63333288a4c0fcc8a',
    appVersion: process.env.APP_VERSION
  })

  if (process.env.NODE_ENV === 'production') {
    bugsnagClient.use(bugsnagVue(Vue))
    window.bugsnagClient = bugsnagClient
    if (window.location.origin === 'https://web-petbacker-com-tw.firebaseapp.com') {
      bugsnagClient.config.releaseStage = 'staging'
    } else if (window.location.origin === 'https://web.petbacker.com') {
      bugsnagClient.config.releaseStage = 'production'
    }
  } else {
    let BugsnagClient = function () {}
    BugsnagClient.prototype.notify = function (error) {
      console.info(error)
    }
    window.bugsnagClient = new BugsnagClient()
  }
}
