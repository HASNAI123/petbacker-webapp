import axios from 'axios'
import { createConcatHashedSignature } from '../assets/signatureHashing.js'

export default ({ Vue }) => {
  Vue.prototype.$axios = axios.create({
     baseURL: process.env.PETBACKER_API_V5,
    // baseURL: process.env.PETBACKER_API_STAGING_V5,
    // baseURL: process.env.PETBACKER_API_STAGING_DEV,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  // ensure production origin will always use production API
  if (window.location.origin === 'https://web.petbacker.com') {
    Vue.prototype.$axios.defaults.baseURL = process.env.PETBACKER_API_V5
    // Vue.prototype.$axios.defaults.baseURL = process.env.PETBACKER_API_STAGING_V5
  }

  // ensure petbacker-demo2 origin will always use new staging dev API
  if (window.location.origin === 'https://petbacker-demo2.web.app') {
    Vue.prototype.$axios.defaults.baseURL = process.env.PETBACKER_API_STAGING_DEV
    // Vue.prototype.$axios.defaults.baseURL = process.env.PETBACKER_API_STAGING_V5
  }
  axios.interceptors.request.use((config) => {
    // Check if the request URL contains a specific parameter
    if (!config.url || !config.url.includes('k=13674c3b66275a11')) {
      var sig = createConcatHashedSignature(config.url)
      config.headers['X-Signature'] = sig
    }
    return config
  })

  Vue.prototype.$axios.interceptors.request.use((config) => {
    // Check if the request URL contains a specific parameter
    if (!config.url || !config.url.includes('k=13674c3b66275a11')) {
      var sig = createConcatHashedSignature(config.url)
      config.headers['X-Signature'] = sig
    }
    return config
  })
}
