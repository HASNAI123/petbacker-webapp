import VueGtm from 'vue-gtm'

export default ({ router, Vue }) => {
  Vue.use(VueGtm, {
    id: 'GTM-TB8CVVH',
    vueRouter: router // Pass the router instance to automatically sync with router (optional)
  })
}
