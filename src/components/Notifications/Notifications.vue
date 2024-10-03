<template>
  <q-page>
    <div v-if="totalNotificationsCount == null" class="row justify-center q-py-lg">
      <ComponentPreLoader></ComponentPreLoader>
    </div>
    <div v-else-if="totalNotificationsCount == 0" class="text-center q-py-md">
      <img class="image-upload" :src="'statics/images/no_notification.png'" width="80%"/>
      <p class="text-center text-label font-normal">{{ $t('no.notification') }}</p>
    </div>
    <div v-else class="row justify-center q-pb-lg" padding>
      <div class="col-12 q-mb-md">
        <div v-for="(notification, index) in desktopNotificationInfo" :key="notification.id">
          <q-item style="padding-left: 16px;" class="q-py-md" :class="!notification.read ? 'unread-notification' : 'read-notification' " clickable @click="handleClickOneNotification(index)">
            <q-item-section avatar class="q-pr-sm">
              <q-avatar style="height: 40px; width: 40px;">
                <img :src="notification.icon" class="image-upload"/>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label><strong>{{notification.title}}</strong></q-item-label>
              <q-item-label lines="2" caption v-if="notification.detail">{{notification.detail}}</q-item-label>
              <!-- <q-item-label>{{calculateOffsetData(notification.createdTime)}}</q-item-label> -->
            </q-item-section>
            <q-item-section style="padding-left: 0px;" side>
              <q-btn class="no-border" flat color="grey-5" icon="navigate_next" padding="0px"></q-btn>
            </q-item-section>
          </q-item>
          <q-separator inset="item"></q-separator>
        </div>
        <template v-if="loader">
          <div class="row justify-center">
            <ComponentPreLoader></ComponentPreLoader>
          </div>
        </template>
      </div>
    </div>

    <!-- Pop up use app instead -->
    <q-dialog v-model="bShowunacceptableDlg" persistent>
      <q-card style="width: 330px; height: fit-content">
        <q-card-section>
          <div class="text-h6" style="text-align: center"> Alert </div>
          <div style="text-align: center"> This Notification can only be viewed in the app. </div>
        </q-card-section >
        <q-card-section class="row justify-center">
          <div class="col-12 text-center" @click="redirectToAppStoreLink">
            <img id="yBtn" style="height: 350px" src="https://storage.googleapis.com/petbacker/images/cms/articles/pet-sitter-dog-walker-app.png" alt="Pet Sitting and Dog Walking app on phone">
          </div>
          <a href="https://play.google.com/store/apps/details?id=com.petbacker.android" target="blank" class="q-mr-md" rel="noreferrer noopener">
            <img src="https://storage.googleapis.com/petbacker/images/cms/icons/playstore-badge.png" alt="appstore" >
          </a>
          <a href="https://itunes.apple.com/us/app/petbacker-book-pet-boarding/id1168037472?mt=8" target="blank" rel="noreferrer noopener">
            <img src="https://storage.googleapis.com/petbacker/images/cms/icons/appstore-badge.png" alt="playstore" >
          </a>
        </q-card-section>
        <q-card-section class="row justify-center q-py-lg q-mx-auto">
          <q-btn color="primary" :label="'CLOSE'" v-close-popup/>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import moment from 'moment'
import { debounce } from 'quasar'

export default {
  data () {
    return {
      desktopNotificationInfo: [],
      desktop_page_count: 2,
      mobile_page_count: 0,
      totalNotificationsCount: null,
      loadedNotifications: false,
      bLoadingMore: false,
      currentNotification: {},
      oneNotificationSelected: false,
      contentCountPerPage: 20,
      bShowunacceptableDlg: false,
      bInitialized: false,
      loader: true,
      emptyContent: false,
      loading: false
    }
  },
  created () {
    this.bInitialized = false

    if (this.desktopNotificationInfo.length === 0) {
      this.getNotifications()
    }

    this.loadMoreNotifications = debounce(this.loadMoreNotifications, 350)
  },
  mounted () {
    window.addEventListener('scroll', debounce(() => {
      this.onScroll()
    }, 200))
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  },
  activated () {
    window.scrollTo(0, 0)
    this.getNotifications()
  },
  methods: {
    refresh () {
      this.desktop_page_count = 1
      this.loadMoreNotifications(this.desktop_page_count)
    },
    onScroll (info) {
      this.previousScroll = document.documentElement.scrollTop

      if (this.$route.name === 'Messages' && this.$store.getters['user/getMessageTabIndex'] === 'tab-notifications' && this.loadedNotifications) {
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 250) && this.loading === false && this.emptyContent === false) {
          this.loadMoreNotifications(this.desktop_page_count++)
        }
      }
    },
    loadMoreNotifications (index) {
      this.loading = true
      this.$axios.get(`/users/${this.$store.state.user.uuid}/notifications?page=${index}&per_page=${this.contentCountPerPage}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status !== 204 && response.data.notificationInfo.length > 0) {
          if (index === 1) {
            this.desktopNotificationInfo = response.data.notificationInfo
          } else {
            this.desktopNotificationInfo = this.desktopNotificationInfo.concat(response.data.notificationInfo)
          }

          if (response.data.notificationInfo.length < this.contentCountPerPage) {
            this.loader = false
            this.emptyContent = true
          }
        } else {
          this.emptyContent = true
          this.loader = false
        }
      }).catch(error => {
        console.error(error)
      }).finally(_ => {
        this.loading = false
      })
    },
    confirmNotificationReadState (notificationID) {
      this.$axios.get(`/users/${this.$store.state.user.uuid}/notifications/${notificationID}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        //  console.log('Notification confirmed Successfully :', response)
      }).catch(error => {
        // vm.forceLogout(error)
        console.log('Error occured while confirming :', error)
      })
    },
    handleClickOneNotification (notificationIndex = null) {
      if (notificationIndex === null) {
        return
      }

      let selection = this.desktopNotificationInfo[notificationIndex]
      let notificationID = selection.id

      if (!selection) return
      if (selection.read === 0) {
        this.confirmNotificationReadState(notificationID)
        this.$store.commit('user/decreaseUserUnreadNotificationState')
        selection.read = 1
      }

      this.currentNotification = {
        id: notificationID,
        requestURL: selection.href,
        type: selection.type,
        destinationId: selection.destinationId,
        icon: selection.icon,
        title: selection.title,
        detail: selection.detail
      }

      this.processSelectedNotification()
    },
    calculateOffsetData (timestamp) {
      return moment(timestamp).fromNow()
    },
    getNotifications (pagination = false) {
      let vm = this
      vm.loadedNotifications = false
      this.$axios.get(`/users/${this.$store.state.user.uuid}/notifications?page=1&per_page=${vm.contentCountPerPage}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        vm.totalNotificationsCount = response.data['_meta'].totalCount
        vm.desktopNotificationInfo = Object.assign([], response.data['notificationInfo'])
        vm.bInitialized = true

        if (response.data.notificationInfo.length < vm.contentCountPerPage) {
          this.loader = false
          this.emptyContent = true
        }
      }).catch(error => {
        vm.forceLogout(error)
        console.log(error)
      }).finally(_ => {
        vm.loadedNotifications = true
      })
    },
    processSelectedNotification () {
      this.oneNotificationSelected = true
      if (this.currentNotification.type === 1 || this.currentNotification.type === 5) {
        this.$router.push({name: 'Notification', params: {id: this.currentNotification.id}})
      } else if (this.currentNotification.type === 2 || this.currentNotification.type === 6) {
        this.handleActivityRouting()
      } else if (this.currentNotification.type === 3) {
        this.handleRatingRouting()
      } else if (this.currentNotification.type === 4) {
        this.handleBookingRouting()
      } else if (this.currentNotification.type === 7) {
        this.handleSupportRouting()
      } else if (this.currentNotification.type === 9) {
        this.handleCheckoutRouting()
      } else if (this.currentNotification.type === 10) {
        console.log(this.currentNotification.destinationId)
        this.handleUrl()
      }
    },

    handleUrl () {
    this.openUrl(this.currentNotification.destinationId)
    },
    handleSupportRouting () {
      if (this.currentNotification.destinationId) {
        this.$router.push({name: 'ChatSupport', params: {ticketId: this.currentNotification.destinationId}})
      } else {
        this.$router.push({name: 'ChatSupportHelp'})
      }
    },
    handleRatingRouting () {
      var arrDestinationIds = []
      if (this.currentNotification.destinationId) arrDestinationIds = this.currentNotification.destinationId.split(',')
      if (arrDestinationIds.length > 1) {
        if (arrDestinationIds[1].includes('-')) {
          this.$router.push({name: 'Listing', params: {listingId: arrDestinationIds[0]}, query: {id: arrDestinationIds[1], reviews: 1}})
        } else {
          this.$router.push({name: 'Chat', params: {request: arrDestinationIds[0], response: arrDestinationIds[1]}})
        }
      } else if (arrDestinationIds.length > 0) {
        //  this.openUnacceptableNotificationDlg()
        this.$router.push({name: 'JobChat', params: {taskId: arrDestinationIds[0]}})
      }
    },
    handleBookingRouting () {
      var arrDestinationIds = []

      if (this.currentNotification.destinationId) {
        arrDestinationIds = this.currentNotification.destinationId.split(',')
      }

      if (arrDestinationIds.length > 1 && parseInt(arrDestinationIds[0]) > 0 && parseInt(arrDestinationIds[1]) > 0) {
        this.$router.push({name: 'RequestSummary', params: {requestId: arrDestinationIds[0]}})
      } else if (arrDestinationIds.length > 0 && parseInt(arrDestinationIds[0]) > 0) {
        this.$router.push({name: 'JobSummary', params: {taskId: arrDestinationIds[0]}})
      } else if (arrDestinationIds.length > 0 && arrDestinationIds[0].includes('jobs')) {
        // this.$q.notify('Reminder Job Missed Notification is not completed yet...')
        this.$router.replace({name: 'Jobs'})
      } else if (arrDestinationIds.length > 0 && arrDestinationIds[0].includes('wallet')) {
        // this.$q.notify('Payout Notification is not completed yet...')
        this.$router.push({name: 'AccountHistory'})
      } else if (arrDestinationIds.length > 1 && arrDestinationIds[0].includes('inbox')) {
        if (arrDestinationIds[1].includes('request')) {
          this.$store.commit('user/updateMessageTabIndexState', 'tab-requests')
          //  this.$router.push('/messages')
          this.$emit('change-tab')
        } else if (arrDestinationIds[1].includes('jobs')) {
          this.$store.commit('user/updateMessageTabIndexState', 'tab-jobs')
          //  this.$router.push('/messages')
          this.$emit('change-tab')
          // this.$q.notify('Reminder Job Message Missed Notification is not completed yet...')
          // this.openUnacceptableNotificationDlg()
        }
      }
    },
    handleActivityRouting () {
      if (this.currentNotification.type === 2) {
        let arrDestinationIds = this.currentNotification.destinationId.split(',')
        if (arrDestinationIds.length > 1) {
          // redirect to profile instead
          this.$router.push({name: 'PublicProfile', params: {userId: arrDestinationIds[0]}})
        } else {
          // redirect to moment post
          this.$router.push({name: 'MomentPost', params: {momentId: this.currentNotification.destinationId}})
        }
      } else if (this.currentNotification.type === 6) {
        this.$router.push({name: 'MomentPost', params: {momentId: this.currentNotification.destinationId}})
      }
    },
    handleCheckoutRouting () {
      let arrDestinationIds = this.currentNotification.destinationId.split(',')

      if (arrDestinationIds.length > 1) {
        // redirect to chechout
        this.$router.push({name: 'Checkout', params: {request: arrDestinationIds[0], response: arrDestinationIds[1]}})
      } else {
        // redirect to product checkout
        this.$router.push({name: 'ProductCheckout', params: {productId: arrDestinationIds[0]}})
      }
    },
    openUnacceptableNotificationDlg () {
      this.bShowunacceptableDlg = true
      // this.$q.dialog({ title: 'Alert', message: 'This Notification can only be view in the app.' })
    },
    redirectToAppStoreLink () {
      this.bShowunacceptableDlg = false
      this.openUrl(this.$t('link.href.mobile'))
    }
  }
}
</script>
