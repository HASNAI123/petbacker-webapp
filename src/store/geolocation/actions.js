/* global bugsnagClient */
import axios from 'axios'
import underscore from 'underscore'
import countryLists from 'assets/countries.json'
import { Cookies, Platform, uid } from 'quasar'

export const cacheGeoLocation = async ({state, commit, getters, rootGetters}) => {
  // check cookies
  if (!Cookies.has('device-uuid')) {
    let deviceId = uid()
    Cookies.set('device-uuid', deviceId, {expires: 'Mon, 06 Jan 2030 12:52:55 GMT'})
  }

  if (rootGetters['user/getUserAccessState'] && rootGetters['user/getUserUuidState'] !== null) {
    let info = {
      'accountInfo': {
        'deviceId': Platform.is.cordova ? window.device.uuid : Cookies.get('device-uuid'),
        'vendor': Platform.is.cordova ? (Platform.is.ios ? 7 : 6) : 5,
        'osVersion': Platform.is.cordova ? window.device.version : Platform.is.versionNumber,
        'platform': Platform.is.cordova ? window.device.platform : 'WEB',
        'model': Platform.is.cordova ? window.device.model : Platform.is.name,
        'screenWidth': screen.width,
        'screenHeight': screen.height,
        'appVersion': process.env.APP_VERSION,
        'pushId': rootGetters['user/getUserPushIdState']
      }
    }

    axios.put(`https://api.petbacker.com/v5/account/${rootGetters['user/getUserUuidState']}`, info, {
      headers: {
        'Authorization': rootGetters['user/authorizationHeader']
      }
    }).catch((error) => {
      console.error(error)
    })
  }

  if (state.data !== null && state.data.geoplugin_status) {
    //  update current country id
    let country = underscore.findWhere(countryLists, {'countryName': getters['geopluginCountryCode']})
    if (country) {
      commit('user/updateUserMobileCountryIdState', parseInt(country.id), { root: true })
    }
    return
  }

  axios.get('https://ssl.geoplugin.net/json.gp?k=13674c3b66275a11')
    .then(response => {
      if (response.data) {
        console.log('Geolocation Cached!')
        commit('updateDataState', response.data)
      } else {
        console.log('Unable to get user location')
        let data = {
          geoplugin_countryCode: 'SG'
        }
        commit('updateDataState', data)
      }

      //  update current country id
      let country = underscore.findWhere(countryLists, {'countryName': getters['geopluginCountryCode']})
      if (country) {
        commit('user/updateUserMobileCountryIdState', parseInt(country.id), { root: true })
      }
    }).catch(err => {
      console.error(err)
      console.log('Unable to get user location')
      let data = {
        geoplugin_countryCode: 'SG'
      }
      commit('updateDataState', data)
      let lang = rootGetters['user/getCurrentLanguage']
      bugsnagClient.notify(new Error(err), {
        beforeSend: function (report) {
          report.metaData = {
            accountInfo: {
              language: lang
            },
            error: {
              error: err
            }
          }
        }
      })
    })
}
