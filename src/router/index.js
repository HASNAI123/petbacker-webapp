import Vue from 'vue'
import VueRouter from 'vue-router'
import vueHeadful from 'vue-headful'

import routes from './routes'
import store from '../store'

Vue.use(VueRouter)
Vue.component('vue-headful', vueHeadful)

const Router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * When going with "history" mode, please also make sure "build.publicPath"
   * is set to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes
})

Router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user.access) {
      store.commit('user/updateUserBackUrlState', to.fullPath)
      let appendQuery = []

      if (to.query.rc) {
        appendQuery.push(`rc=${to.query.rc}`)
      }

      if (to.query._ga) {
        appendQuery.push(`_ga=${to.query._ga}`)
      }

      if (to.query.lang) {
        appendQuery.push(`lang=${to.query.lang}`)
      }

      if (to.query.fullscreen) {
        appendQuery.push(`fullscreen=${to.query.fullscreen}`)
      }

      if (to.query.jobref) {
        appendQuery.push(`jobref=${to.query.jobref}&country=${to.query.country}`)
      }

      let nextPath = appendQuery.length > 0
        ? `/?${appendQuery.join('&')}`
        : `/`

      next({
        path: nextPath
      })
    } else {
      // ensure query persistent to document page
      if (from.query.jobref && !to.query.jobref && to.name === 'DocumentDisplay') {
        if (to.path !== from.path) {
          next({path: to.path, query: from.query})
        }
      }
    }
  }
  next()
})

export default Router
