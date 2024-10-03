import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import localForage from 'localforage'
import customPlugin from './custom-vuex-plugin.js'
import { Platform } from 'quasar'

import user from './user'
import geolocation from './geolocation'
import request from './request'
import banners from './banners'
import cached from './cached'
import chat from './chat'
import search from './search'
import bookings from './bookings'

Vue.use(Vuex)
var vuexLocal = ''
if (Platform.is.cordova) {
  vuexLocal = new VuexPersistence({
    storage: localForage,
    asyncStorage: true
  })
} else {
  vuexLocal = new VuexPersistence({
    storage: window.localStorage
  })
}

const store = new Vuex.Store({
  modules: {
    user,
    geolocation,
    request,
    banners,
    cached,
    chat,
    search,
    bookings
  },
  plugins: [vuexLocal.plugin, customPlugin]
})

export default store
