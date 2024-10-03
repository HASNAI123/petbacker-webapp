import _ from 'underscore'

export default ({ Vue }) => {
  // Set underscore instance on app
  Object.defineProperty(Vue.prototype, '$_', { value: _ })
}
