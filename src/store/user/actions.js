import { Platform } from 'quasar'
import axios from 'axios'

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Below are local functions to use internally here  *
 * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
// local function to check location permission
async function checkPermision () {
  console.log('chekc ig Diagnostic plugin working for location permission', window.cordova.plugins.diagnostic)
  return new Promise((resolve, reject) => {
    if (Platform.is.cordova) {
      cordova.plugins.diagnostic.getLocationAuthorizationStatus(function (status) {
        switch (status) {
          case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
            console.log('Permission not requested')
            break
          case cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE:
            console.log('Permission denied')
            break
          case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
            console.log('Permission permanently denied')
            break
          case cordova.plugins.diagnostic.permissionStatus.GRANTED:
            console.log('Permission granted always')
            break
          case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
            console.log('Permission granted only when in use (Android >= 10)')
            break
        }
      }, function (error) {
        console.error(error)
      })
      window.cordova.plugins.diagnostic.getLocationAuthorizationStatus((status) => {
        console.log('location service status: ' + status)
        if (status === 'not_determined' || status === cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED || status === cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE) {
          requestPermission().then(() => {
            resolve()
          }, (error) => {
            reject(error)
          })
        } else {
          resolve()
        }
      }, (error) => {
        console.error(error)
        return true
      })
    } else {
      resolve()
    }
  })
}

// local function to get request location permission
async function requestPermission () {
  console.log('rqeust for permission started')
  return new Promise((resolve, reject) => {
    console.log()
    window.cordova.plugins.diagnostic.requestLocationAuthorization((status) => {
      switch (status) {
        case window.cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
          reject(window.cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED)
          console.log('Permission not requested')
          break
        case window.cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
          reject(window.cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS)
          console.log('Permission denied')
          break
        case window.cordova.plugins.diagnostic.permissionStatus.GRANTED:
          resolve(window.cordova.plugins.diagnostic.permissionStatus.GRANTED)
          console.log('Permission granted always')
          break
        case window.cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
          resolve(window.cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE)
          console.log('Permission granted only when in use')
          break
      }
    }, (error) => {
      reject(error)
      console.error(error)
    }, window.cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS)
  })
}

function updateStates (commit, payload) {
  commit('updateUserAvatarImageState', payload.data.accountInfo.avatarImage)
  commit('updateUserEmailState', payload.data.accountInfo.email)
  commit('updateUserPreferredCurrencyState', payload.data.accountInfo.preferredCurrency)
  commit('updateUserMobileCountryIdState', payload.data.accountInfo.mobileCountryId)
  commit('updateUserMobileNumState', payload.data.accountInfo.mobileNum)
  commit('updateuserMobileVerifiedState', parseInt(payload.data.accountInfo.mobileVerified))
  commit('updateUserUsernameState', payload.data.accountInfo.username)
  commit('updateUserReferralCodeState', payload.data.accountInfo.referralCode)
  commit('updateIdVerified', parseInt(payload.data.accountInfo.idVerified))
  commit('updateSelfieVerified', parseInt(payload.data.accountInfo.selfieVerified))
  commit('updateEmailVerified', parseInt(payload.data.accountInfo.emailVerified))
  commit('updateFacebookVerified', parseInt(payload.data.accountInfo.facebookVerified))
  commit('updateGoogleVerified', parseInt(payload.data.accountInfo.googleVerified))
  commit('updateCredits', payload.data.accountInfo.credits)
  commit('updateBusinessVerified', parseInt(payload.data.accountInfo.businessVerified))
  commit('updateContactLine', payload.data.accountInfo.contactLine)
  commit('updateContactWechat', payload.data.accountInfo.contactWechat)
  commit('updateContactWhatsapp', payload.data.accountInfo.contactWhatsapp)
  commit('updateProVerified', payload.data.accountInfo.proVerified)
  commit('updateServiceProvider', Boolean(payload.data.accountInfo.serviceProvider))
  commit('updateUserExamCertified', Boolean(payload.data.accountInfo.examCertified))
  commit('updateSitterIntroVerified', Boolean(payload.data.accountInfo.sitterIntroVerified))
  commit('updateStrictJobAssignments', Boolean(payload.data.accountInfo.strictJobAssignments))
  commit('updateAlwaysRebroadcastPrivate', Boolean(payload.data.accountInfo.alwaysRebroadcastPrivate))
  commit('updatePoliceVerified', parseInt(payload.data.accountInfo.policeVerified))
  commit('updateNotificationSound', payload.data.accountInfo.notificationSound)
  commit('updateAboutMe', payload.data.accountInfo.aboutMe)
  commit('updateListingApprovalStatus', parseInt(payload.data.accountInfo.listingsApprovalStatus))
  commit('updateThirdPartyVerified', parseInt(payload.data.accountInfo.thirdPartyVerified))
  commit('updateTrainingCertified', parseInt(payload.data.accountInfo.trainingCertified))
  commit('updateGroomingCertified', parseInt(payload.data.accountInfo.groomingCertified))
  commit('updateVetCertified', parseInt(payload.data.accountInfo.vetCertified))
  commit('updatePoints', parseInt(payload.data.accountInfo.pointsBalance))

  if (payload.data.accountInfo.reviewInfo) {
    commit('updateReviewCount', payload.data.accountInfo.reviewInfo.reviewCount)
  }
}

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *           Below are global functions              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
// refresh all user's state
export const refreshState = async ({commit, getters}) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://api.petbacker.com/v5/account/${getters['getUserUuidState']}`, {
      headers: {
        'Authorization': getters['authorizationHeader']
      }
    }).then((response) => {
      updateStates(commit, response)
      resolve()
    }).catch((error) => {
      console.error(error)
      reject(error)
    })
  })
}

// refresh user's states on resume
export const onResume = async ({commit}, resumeInfo) => {
  commit('updateUserUnreadNotificationState', resumeInfo.unreadNotifications)
  commit('updateUserUnreadRequestsMessageState', resumeInfo.unreadRequestsMessage)
  commit('updateUserUnreadJobsMessageState', resumeInfo.unreadJobsMessage)
  commit('updateUnreadSupportMessage', resumeInfo.unreadSupportMessage)
  commit('updateuserMobileVerifiedState', resumeInfo.mobileVerified)
  commit('updateReviewCount', resumeInfo.reviewCount)
  commit('updateSitterIntroVerified', Boolean(resumeInfo.sitterIntroVerified))
  commit('updateListingApprovalStatus', parseInt(resumeInfo.listingsApprovalStatus))
  commit('updateCachedVersion', resumeInfo.cacheVersion)
}

// refresh user wallet on currency change
export const refreshWallet = async ({getters, dispatch}) => {
  if (getters['getUserUuidState'] === null) {
    return
  }

  axios.get(`https://api.petbacker.com/v5/users/${getters['getUserUuidState']}/accountstatement?per-page=20&page=1`, {
    headers: {
      'Authorization': getters['authorizationHeader']
    }
  }).then((response) => {
    dispatch('cached/cacheTransactionHistory', response.data.accountStatementInfo, { root: true })
  }).catch((error) => {
    console.error(error)
  })
}

// update all user's state
export const updateUserStates = async ({commit}, payload) => {
  updateStates(commit, payload)
}

// cache current location after requesting permission
export const cacheGeoLocation = async ({commit}) => {
  return new Promise((resolve, reject) => {
    checkPermision().then(() => {
      var config = {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 50000
      }

      if (navigator.geolocation) {
        if (Platform.is.cordova && !window.db) {
          let error = 'DB not ready!'
          reject(error)
        }
        console.log('check if location plugin working', navigator.geolocation)
        var onSuccess = function (position) {
          commit('updateUserLongitude', position.coords.longitude)
          commit('updateUserLatitude', position.coords.latitude)
        }

        var onError = function (error) {
          console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n +plugin eror')
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError)
        navigator.geolocation.getCurrentPosition((position) => {
          commit('updateUserLongitude', position.coords.longitude)
          console.log('check if its getting long', position.coords.longitude)
          commit('updateUserLatitude', position.coords.latitude)
          console.log('User Geolocation Cached!')
          console.log(position.coords)
          resolve(position.coords)
        }, (error) => {
          console.error(error)
          reject(error)
        }, config)
      } else {
        reject(new Error('Geolocation is not supported by this browser/device.'))
      }
    }).catch((error) => {
      console.log(error)
      reject(error)
    })
  })
}

// log user out when token expired
// * required user to relogin
export const forceRelogin = ({commit}) => {
  commit('updateClearAllState')
}

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Below methods are specifically to handle SQLite   *
 * cache locally                                     *
 * NOTE: Only works when compiled to app             *
 * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
// initialized sqlite storage for mobile application
export const init = async ({dispatch, rootState}) => {
  return new Promise((resolve, reject) => {
    if (Platform.is.cordova) {
      // open DB (if none then will create)
      window.db = window.sqlitePlugin.openDatabase({
        name: 'petbacker.db',
        location: 'default',
        androidDatabaseProvider: 'system'
      }, (db) => {
        console.log('DB OPENED')

        // try to open existing table from db
        db.readTransaction((txn) => {
          console.log('QUERYING.... ')
          txn.executeSql('SELECT text FROM vuex', [], (transaction, results) => {
            // get previous state
            let previousState = JSON.parse(results.rows._array[0].text)
            rootState.user = previousState.user
            rootState.banners = previousState.banners
            rootState.cached = previousState.cached
            rootState.geolocation = previousState.geolocation
            rootState.request = previousState.request
            console.log('RESTORED STATE')
            resolve()
          }, (transaction, error) => {
            console.error(error)

            // create table and prepopulate if do not exist
            if (error.message) {
              console.log('create table: vuex')
              dispatch('createTable').then(() => {
                resolve()
              }).catch((error) => {
                console.error(error)
                reject(error)
              })
            }
          })
        })
      }, (error) => {
        console.error(error)
        reject(error)
      })
    } else {
      resolve()
    }
  })
}

// create vuex table
export const createTable = async ({rootState}) => {
  return new Promise((resolve, reject) => {
    window.db.transaction((txn) => {
      txn.executeSql('CREATE TABLE IF NOT EXISTS vuex (id unique, text)', [], (transaction, results) => {
        // save
        txn.executeSql('INSERT INTO vuex (id, text) VALUES (1, ?)', [JSON.stringify(rootState)])
        console.log('table created')
        resolve()
      }, (transaction, error) => {
        reject(error)
      })
    })
  })
}

// update state in db
export const update = async ({rootState}) => {
  window.db.transaction((txn) => {
    // save
    txn.executeSql('UPDATE vuex SET text=? WHERE id=1', [JSON.stringify(rootState)])
  }, (transaction, error) => {
    console.error(error)
  })
}
