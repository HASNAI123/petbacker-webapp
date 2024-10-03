<template>
  <div>
    <q-dialog v-model="showDialog" seamless position="top">
      <q-card style="width: 100%; border-radius: 11px;" class="bg-grey-4 q-mx-md" v-touch-swipe.mouse="onSwipe" @click="onClick(info.type, info.id, info.jobId, info.requestId, info.url)">
        <q-card-section class="row no-wrap">
          <q-item class="text-white q-px-none q-py-none" dense>
            <q-item-section avatar v-if="info.icon">
                <q-avatar style="width: 55px;height: 55px;">
                  <q-img v-if="info.icon" :src="info.icon" class="image-upload"></q-img>
                </q-avatar>
            </q-item-section>

            <q-item-section class="text-black font-normal">
              <q-item-label class="text-weight-bold text-capitalize">{{info.title}}</q-item-label>
              <q-item-label lines="2" caption>{{info.message}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Prompt notification before initialization -->
    <dialog-permission :trigger="promptPermission" :promptOptions="promptOptions" @on-close="closePrompt" @on-ok="onPermissionPromptOK"></dialog-permission>
  </div>
</template>
<script>
import CONFIG from 'assets/global_constant.js'
export default {
  components: {
    'dialog-permission': () => import('components/DialogPermission.vue')
  },
  data () {
    return {
      info: {
        title: null,
        message: null,
        icon: null,
        type: null,
        id: null,
        requestId: null,
        jobId: null
      },
      pushNotification: null,
      showDialog: false,
      promptPermission: false,
      promptOptions: {}
    }
  },
  created () {
    /* this.initializedNotification() */
    document.addEventListener('deviceready', this.onDeviceReady)
  },
  beforeDestroy () {
    document.removeEventListener('deviceready', this.onDeviceReady)
  },
  methods: {
    closePrompt (status) {
      console.log('check status', status)
      // prompt native app permission after showing user's prompt
      if (status === false) {
        this.promptPermission = false
        localStorage.setItem('notificationsStatus', 'false')
        // this.initializedNotification()
      }
    },
    async onPermissionPromptOK (type) {
      this.promptOptions = {}
      this.promptPermission = false
      this.initializedNotification()
      /*  cordova.plugins.diagnostic.switchToNotificationSettings() */
    },
    onDeviceReady () {
      console.log('device ready for ntogications intiated')
      let permissionStatus
      let notificationsStatus = localStorage.getItem('notificationsStatus')

      if (notificationsStatus === 'false') {
        return
      }

      if (this.$q.platform.is.ios) {
        cordova.plugins.diagnostic.getRemoteNotificationsAuthorizationStatus((status) => {
          permissionStatus = status // Store the status in a variable
        }, function (error) {
          console.error('The following error occurred: ' + error)
        })

        window.cordova.plugins.diagnostic.isRemoteNotificationsEnabled((enable) => {
          if (enable) {
            console.log('is it enabled ?', enable)
            this.initializedNotification()
          } else if (permissionStatus !== cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS) {
            // Only show the dialog if permission is not always denied
            this.promptOptions.text1 = this.$t('notification.permission.prompt.text1')
            this.promptOptions.text2 = this.$t('notification.permission.prompt.text2')
            this.promptOptions.image = 'statics/images/new-messages.png'
            this.promptOptions.tip_image = 'statics/images/notification-icon.png'
            this.promptOptions.ok_btn_text = this.$t('allow.notifications')
            this.promptOptions.type = 'notification'
            setTimeout(() => {
              this.promptPermission = true
            }, 4000)
          }
        }, (error) => {
          console.error('The following error occurred: ' + error)
        })
      } else {
        console.log('check plugin scene', window.cordova.plugins.diagnostic.isRemoteNotificationsEnabled)
        window.cordova.plugins.diagnostic.isRemoteNotificationsEnabled((enable) => {
          if (enable) {
            console.log('is it enabled ?', enable)
            this.initializedNotification()
          } else {
            this.promptOptions.text1 = this.$t('notification.permission.prompt.text1')
            this.promptOptions.text2 = this.$t('notification.permission.prompt.text2')
            this.promptOptions.image = 'statics/images/new-messages.png'
            this.promptOptions.tip_image = 'statics/images/notification-icon.png'
            this.promptOptions.ok_btn_text = this.$t('allow.notifications')
            this.promptOptions.type = 'notification'
            this.promptPermission = true
          }
        }, (error) => {
          console.error('The following error occurred: ' + error)
        })
      }
    },
    checkNotificationsChannel () {
      console.log('check channel ', window.PushNotification)
      return new Promise((resolve, reject) => {
        if (this.$q.platform.is.android && parseInt(window.device.version) >= 8) {
          window.PushNotification.listChannels(channels => {
            let status = this.$_.findWhere(channels, {'id': 'notification_woof_petbacker_android'})

            if (status === undefined) {
              // woof sound channel
              window.PushNotification.createChannel(() => {
                console.log('notificatiosn channel notification_woof_petbacker_android created!')
              }, () => {
                console.log('error')
                resolve()
              }, {
                id: 'notification_woof_petbacker_android',
                description: 'Android Channel For Woof Notification Sound',
                importance: 4,
                sound: 'woof',
                vibration: true
              })

              // meow sound channel
              window.PushNotification.createChannel(() => {
                console.log('notificatiosn channel notification_meow_petbacker_android created!')
              }, () => {
                console.log('error')
                resolve()
              }, {
                id: 'notification_meow_petbacker_android',
                description: 'Android Channel For Meow Notification Sound',
                importance: 4,
                sound: 'meow',
                vibration: true
              })

              // silent sound channel
              window.PushNotification.createChannel(() => {
                console.log('notificatiosn channel notification_silent_petbacker_android created!')
                resolve()
              }, () => {
                console.log('error')
                resolve()
              }, {
                id: 'notification_silent_petbacker_android',
                description: 'Android Channel For Silent Notification Sound',
                importance: 4,
                sound: 'silent',
                vibration: true
              })
            } else {
              resolve()
            }
          })
        } else {
          resolve()
        }
      })
    },
    initializedNotification () {
      console.log('intialzie started for chceking')
      if (this.pushNotification) {
        return
      }

      // create channel for Android Version 8.0 above
      this.checkNotificationsChannel().then(() => {
        if (window.PushNotification) {
          console.log('PushNotification is installed correctly.')
        } else {
          console.log('PushNotification is not installed or not loaded correctly.')
        }
        console.log('check', cordova.plugins.permissions)
        var permissions = cordova.plugins.permissions
        permissions.requestPermission(permissions.POST_NOTIFICATIONS, success, error)

        function error () {
          console.warn('notificaiton permission is not turned on')
        }

        function success (status) {
          if (!status.hasPermission) error()
        }
        console.log('check the notification channle', window.PushNotification)
        this.pushNotification = window.PushNotification.init({
          android: {
            sound: true,
            vibrate: true,
            clearBadge: true,
            forceShow: true
          },
          ios: {
            voip: false,
            alert: true,
            badge: true,
            sound: true,
            vibrate: true,
            clearBadge: true
          }
        })
      }).then(() => {
        if (window.PushNotification) {
          console.log('PushNotification is installed correctly.')
        } else {
          console.log('PushNotification is not installed or not loaded correctly.')
        }
        // on push registration
        this.pushNotification.on('registration', (data) => {
          console.log(data)
          if (data.registrationId !== this.$store.getters['user/getUserPushIdState']) {
            this.$store.commit('user/updateUserPushIdState', data.registrationId)
          }
        })
        console.log('check push notfication prop', this.pushNotification)
        console.dir(this.pushNotification)
        console.log(JSON.stringify(this.pushNotification, null, 2))
        // on push notifications
        this.pushNotification.on('notification', this.onNotified)

        // on push notifications error
        this.pushNotification.on('error', (e) => {
          // e.message
          console.error(e)
          console.log('error coming and ther eerror is :', e)
        })
      }).catch((error) => {
        console.error(error)
      })
    },
    onClick (type, id = null, jobId = null, requestId = null, url = null) {
      console.log('type: ' + type)
      this.showDialog = false
      switch (type) {
        // to job list
        case CONFIG.get('NOTIFICATION_TYPE', 'NEW_TASK'): this.handleDeepLinkUrl('petbacker://job'); break

        // to help center
        case CONFIG.get('NOTIFICATION_TYPE', 'SUPPORT_CENTER'): this.handleDeepLinkUrl('petbacker://help'); break

        // to support chat
        case CONFIG.get('NOTIFICATION_TYPE', 'SUPPORT_MESSAGE'):
          if (id) {
            this.handleDeepLinkUrl(`petbacker://support?id=${id}`)
          } else {
            this.handleDeepLinkUrl('petbacker://support')
          }
          break

        // to open web links
        case CONFIG.get('NOTIFICATION_TYPE', 'LINK'): this.openUrl(url); break

        // to job chat
        case CONFIG.get('NOTIFICATION_TYPE', 'TASK_REVIEW'):
        case CONFIG.get('NOTIFICATION_TYPE', 'TASK_MESSAGE'):
          if (jobId) {
            this.handleDeepLinkUrl(`petbacker://chat?jobId=${jobId}`)
          }
          break

        // to job summary
        case CONFIG.get('NOTIFICATION_TYPE', 'OFFER_ACCEPTED'):
        case CONFIG.get('NOTIFICATION_TYPE', 'OFFER_CANCELLED'):
        case CONFIG.get('NOTIFICATION_TYPE', 'OFFER_REJECTED'):
          if (jobId) {
            this.handleDeepLinkUrl(`petbacker://job?jobId=${jobId}`)
          }
          break

        // to request chat
        case CONFIG.get('NOTIFICATION_TYPE', 'REQUEST_MESSAGE'):
        case CONFIG.get('NOTIFICATION_TYPE', 'REQUEST_REVIEW'):
          if (requestId && jobId) {
            this.handleDeepLinkUrl(`petbacker://chat?requestId=${requestId}&jobId=${jobId}`)
          }
          break

        // to request summary
        case CONFIG.get('NOTIFICATION_TYPE', 'NEW_OFFER'):
        case CONFIG.get('NOTIFICATION_TYPE', 'REQUEST_JOB_CLOSED'):
          if (requestId) {
            this.handleDeepLinkUrl(`petbacker://request?requestId=${requestId}`)
          }
          break

        // to notification list
        case CONFIG.get('NOTIFICATION_TYPE', 'MOMENT_ACTIVITY'):
        case CONFIG.get('NOTIFICATION_TYPE', 'MOMENTS_ACTIVITY'):
        case CONFIG.get('NOTIFICATION_TYPE', 'WALL_LIKE'):
        case CONFIG.get('NOTIFICATION_TYPE', 'WALL_COMMENT'):
        case CONFIG.get('NOTIFICATION_TYPE', 'NOTIFICATIONS_LIST'):
        case CONFIG.get('NOTIFICATION_TYPE', 'NOTIFICATION_DETAIL'):
          this.handleDeepLinkUrl(`petbacker://notifications`)
          break

        // to voucher list
        case CONFIG.get('NOTIFICATION_TYPE', 'VOUCHER_PROMOTION'): this.handleDeepLinkUrl(`petbacker://voucher`); break
      }
    },
    onNotified (data) {
      // data.message,
      // data.title,
      // data.count,
      // data.sound,
      // data.image,
      // data.additionalData
      console.table(data)
      console.log('check notification', data)
      if (data.additionalData.coldstart) {
        console.log('open from outside app')

        this.onClick(parseInt(data.additionalData.type), data.additionalData.id, data.additionalData.convId, data.additionalData.reqId, data.additionalData.url)
      } else {
        // in app notification
        if (this.$q.platform.is.ios) {
          // prevent showing in app notification if user already at the chat
          if (((parseInt(data.additionalData.type) === 7) && (this.$route.name === 'Chat' && parseInt(this.$route.params.response) === parseInt(data.additionalData.convId))) || ((parseInt(data.additionalData.type) === 6) && (this.$route.name === 'JobChat' && parseInt(this.$route.params.taskId) === parseInt(data.additionalData.convId)))) {
            return
          }

          this.showDialog = true
        } else {
          // android quirks
          // bring app from foreground to front
          window.plugins.bringtofront()
          this.onClick(parseInt(data.additionalData.type), data.additionalData.id, data.additionalData.convId, data.additionalData.reqId, data.additionalData.url)
          return
        }

        this.info = {
          title: data.additionalData.username || data.title,
          message: data.message,
          icon: data.additionalData.avatarPath || '',
          type: parseInt(data.additionalData.type),
          id: data.additionalData.id || null,
          requestId: data.additionalData.reqId || null,
          jobId: data.additionalData.convId || null,
          url: data.additionalData.url || null
        }

        setTimeout(() => {
          this.showDialog = false
        }, 3500)
      }
    },
    onSwipe ({ evt, ...info }) {
      if (info.direction === 'up') {
        this.showDialog = false
      }
    }
  }
}
</script>
