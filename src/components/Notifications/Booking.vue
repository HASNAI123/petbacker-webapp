<template>
  <div>
    <div v-if="bLoadingFinished">
      <div v-if="notificationType === NOTIFICATION_TYPE.PAYMENT_CONFIRMED_WITH_NAMESERVICE" class="row justify-center column">
        <request-status :forcesmall="revert" :responseInfo="responseInfo" :priceInfo="priceInfo" :requestInfo="requestInfo" @onGetResponseInfo="getResponseInfo()"></request-status>
        <chat-content-small v-if="!revert" :responseInfo="responseInfo" :messageInfo="messageInfo"  @sendMessage="getChatContents()"></chat-content-small>
        <chat-content v-else :responseInfo="responseInfo" :messageInfo="messageInfo"  @sendMessage="getChatContents()"></chat-content>
      </div>
      <div v-else-if="notificationType === NOTIFICATION_TYPE.PAYMENT_CONFIRMED_WITH_NAMEPARENT" class="row justify-center column">
        <link-to-mobile/>
      </div>
      <div v-else-if="notificationType === NOTIFICATION_TYPE.PAYOUT" class="row justify-center column">
        <link-to-mobile/>
      </div>
      <div v-else-if="notificationType === NOTIFICATION_TYPE.BOOKING_PARENT" class="row justify-center column">
        <link-to-mobile/>
      </div>
      <div v-else-if="notificationType === NOTIFICATION_TYPE.BOOKING_SITTER" class="row justify-center column">
        <link-to-mobile/>
      </div>
      <div v-else-if="notificationType === NOTIFICATION_TYPE.REMINDER_JOB_MISSED" class="row justify-center column">
        <link-to-mobile/>
      </div>
      <div v-else-if="notificationType === NOTIFICATION_TYPE.REMINDER_REQUEST_MESSAGE_MISSED" class="row justify-center column">
        <!-- <message-inbox/> -->
        <request-status :forcesmall="revert" :responseInfo="responseInfo" :priceInfo="priceInfo" :requestInfo="requestInfo" @onGetResponseInfo="getResponseInfo()"></request-status>
        <chat-content-small v-if="!revert" :responseInfo="responseInfo" :messageInfo="messageInfo"  @sendMessage="getChatContents()"></chat-content-small>
        <chat-content v-else :responseInfo="responseInfo" :messageInfo="messageInfo"  @sendMessage="getChatContents()"></chat-content>
      </div>
      <div v-else-if="notificationType === NOTIFICATION_TYPE.REMINDER_JOB_MESSAGE_MISSED" class="row justify-center column">
        <link-to-mobile/>
      </div>
      <div v-else-if="notificationType === NOTIFICATION_TYPE.BOOKING_CANCELLATION_WITH_NAMESERVICE" class="row justify-center column">
        <link-to-mobile/>
      </div>
      <div v-else-if="notificationType === NOTIFICATION_TYPE.BOOKING_CANCELLATION_WITH_NAMEPARENT" class="row justify-center column">
        <link-to-mobile/>
      </div>
    </div>
    <div v-else-if="!bLoadingFinished" class="row justify-center q-py-lg">
      <ComponentPreLoader></ComponentPreLoader>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import ChatContentSmall from 'components/ChatContentSmall'
import ChatContent from 'components/ChatContent'
import RequestStatus from 'components/RequestStatus'
import MessageInbox from 'components/MessageInbox'
import LinkToMobile from 'components/Notifications/LinkToMobile'

export default {
  props: {
    destinationId: {
      type: String,
      required: true
    },
    revert: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'chat-content': ChatContent,
    'chat-content-small': ChatContentSmall,
    'request-status': RequestStatus,
    'message-inbox': MessageInbox,
    'link-to-mobile': LinkToMobile
  },
  watch: {
    destinationId: function () {
      this.bLoadingFinished = false
      this.getNotificationInfo()
    }
  },
  data () {
    const NOTIFICATION_TYPE = {
      UNDEFINED: 0,
      PAYMENT_CONFIRMED_WITH_NAMESERVICE: 11,
      PAYMENT_CONFIRMED_WITH_NAMEPARENT: 12,
      PAYOUT: 21,
      BOOKING_PARENT: 31,
      BOOKING_SITTER: 32,
      REMINDER_JOB_MISSED: 41,
      REMINDER_REQUEST_MESSAGE_MISSED: 42,
      REMINDER_JOB_MESSAGE_MISSED: 43,
      BOOKING_CANCELLATION_WITH_NAMESERVICE: 51,
      BOOKING_CANCELLATION_WITH_NAMEPARENT: 52
    }

    return {
      selectedNotification: null,
      chatInterval: null,
      requestId: null,
      responseId: null,
      priceInfo: null,
      responseInfo: null,
      requestInfo: null,
      messageInfo: null,
      responseServiceInfo: null,
      responseUserInfo: null,
      bLoadingFinished: false,
      notificationType: NOTIFICATION_TYPE.UNDEFINED,
      NOTIFICATION_TYPE: NOTIFICATION_TYPE
    }
  },
  mounted () {
    this.getNotificationInfo()
  },
  beforeDestroy () {
    clearInterval(this.chatInterval)
  },
  methods: {
    getNotificationInfo () {
      var arrDestinationIds = []
      if (this.destinationId) arrDestinationIds = this.destinationId.split(',')
      if (arrDestinationIds.length > 1 && parseInt(arrDestinationIds[0]) > 0 && parseInt(arrDestinationIds[1]) > 0) {
        this.requestId = arrDestinationIds[0]
        this.responseId = arrDestinationIds[1] // JobId
        this.notificationType = this.NOTIFICATION_TYPE.PAYMENT_CONFIRMED_WITH_NAMESERVICE // according to user's permission?
        this.handleDoAsChatComponent()
      } else if (arrDestinationIds.length > 0 && parseInt(arrDestinationIds[0]) > 0) {
        this.notificationType = this.NOTIFICATION_TYPE.BOOKING_PARENT
        this.$q.notify('Booking Parent Notification is not completed yet...')
        this.bLoadingFinished = true
        // act according to this http://gl.forwen.com/petbacker-vue/webapp/issues/76#note_2345
      } else if (arrDestinationIds.length > 0 && arrDestinationIds[0].includes('jobs')) {
        this.notificationType = this.NOTIFICATION_TYPE.REMINDER_JOB_MISSED
        this.$q.notify('Reminder Job Missed Notification is not completed yet...')
        this.bLoadingFinished = true
        // act according to this http://gl.forwen.com/petbacker-vue/webapp/issues/76#note_2345
      } else if (arrDestinationIds.length > 0 && arrDestinationIds[0].includes('wallet')) {
        this.notificationType = this.NOTIFICATION_TYPE.PAYOUT
        this.$q.notify('Payout Notification is not completed yet...')
        this.bLoadingFinished = true
        // act according to this http://gl.forwen.com/petbacker-vue/webapp/issues/76#note_2345
      } else if (arrDestinationIds.length > 1 && arrDestinationIds[0].includes('inbox')) {
        if (arrDestinationIds[1].includes('request')) {
          this.notificationType = this.NOTIFICATION_TYPE.REMINDER_REQUEST_MESSAGE_MISSED
          this.handleDoAsChatComponent()
          // this.bLoadingFinished = true
        } else if (arrDestinationIds[1].includes('job')) {
          this.notificationType = this.NOTIFICATION_TYPE.REMINDER_JOB_MESSAGE_MISSED
          this.$q.notify('Reminder Job Message Missed Notification is not completed yet...')
          this.bLoadingFinished = true
          // act according to this http://gl.forwen.com/petbacker-vue/webapp/issues/76#note_2345
        }
      }
      this.getJobInbox()
    },
    handleDoAsChatComponent () {
      // this.$q.localStorage.set('expressCheckoutLinkSuccess', this.$route.fullPath) // used in EpressCheckout.vue
      this.getRequestInfo()
      this.getResponseInfo()
      this.getPriceInfo()
      this.getChatContents()
      this.chatInterval = setInterval(() => {
        this.getChatContents()
      }, 5000)
    },
    getResponseInfo () {
      this.$axios.get('users/' + this.$store.state.user.uuid + '/requests/' + this.requestId + '/responses/' + this.responseId, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.responseInfo = response.data.responseInfo
        this.responseServiceInfo = this.responseInfo.serviceInfo
        this.responseUserInfo = this.responseServiceInfo.userInfo
        this.bLoadingFinished = this.responseInfo && this.priceInfo && this.requestInfo && this.messageInfo !== null && this.messageInfo !== 'empty'
      }).catch(error => {
        this.forceLogout(error)
        console.log(error)
      })
    },
    getPriceInfo () {
      this.$axios.get('users/' + this.$store.state.user.uuid + '/tasks/' + this.responseId + '/checkprice', {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.priceInfo = response.data.priceInfo
        this.bLoadingFinished = this.responseInfo && this.priceInfo && this.requestInfo && this.messageInfo !== null && this.messageInfo !== 'empty'
      }).catch(error => {
        this.forceLogout(error)
        console.log(error)
      })
    },
    getRequestInfo () {
      this.$axios.get('users/' + this.$store.state.user.uuid + '/requests/' + this.requestId, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.requestInfo = response.data.requestInfo
        this.bLoadingFinished = this.responseInfo && this.priceInfo && this.requestInfo && this.messageInfo !== null && this.messageInfo !== 'empty'
      }).catch(e => {
        this.forceLogout(e)
        console.log(e)
      })
    },
    getChatContents () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/requests/${this.requestId}/responses/${this.responseId}/messages?page=1&per_page=40`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.messageInfo = response.data.messageInfo
        let clientWidth = document.documentElement.clientWidth
        if (clientWidth < 558) {
          this.messageInfo.items = this.messageInfo.items.reverse()
        }
        this.bLoadingFinished = this.responseInfo && this.priceInfo && this.requestInfo && this.messageInfo !== null && this.messageInfo !== 'empty'
      }).catch(e => {
        this.messageInfo = 'empty'
        clearInterval(this.chatInterval)
        this.forceLogout(e)
        console.log(e)
      })
    },
    getJobInbox () {
      // this.$axios.get(`users/${this.$store.state.user.uuid}/requestinbox`, {
      //   headers: {
      //     Authorization: this.$store.getters['user/authorizationHeader']
      //   }
      // }).then(response => {
      //   console.log(response.data, '-=-=-=-=-=-=-=-=-%%%%%%%%%')
      // }).catch(error => {
      //   // this.forceLogout(error)
      //   console.log(error)
      // })
    },
    handleClickButtonOfDetailedNotification () {
      if (this.selectedNotification.buttonType === 1) {
        this.openUrl(this.selectedNotification.destinationUrl)
      } else if (this.selectedNotification.buttonType === 2) {
        this.$router.push('/referrals')
      }
    }
  }
}
</script>
