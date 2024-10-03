<template>
  <div class="row" style="height: 100%">
    <div v-if="bLoadingFinished && notificationType === NOTIFICATION_TYPE.RATE_PER_SITTER" class="col-12 justify-center">
      <q-toolbar slot="header">
        <q-toolbar-title v-close-popup style="text-align:center">
          {{ $t('rate.this.service') }}
        </q-toolbar-title>
      </q-toolbar>
      <div class="q-pa-lg row justify-center text-center">
        <div class="col-xs-12">
          <h4 class="q-my-lg">{{ responseServiceInfo.userServiceName }}</h4>
        </div>
        <div class="col-xs-12 q-my-md">
          <img class="responsive avatar" style="min-height: 100px; min-width: 100px;" :src="responseUserInfo.avatarImage" alt="">
        </div>
        <div class="col-xs-12 q-py-md">
            <q-rating v-model="userRating" :max="5" size="40px"/>
        </div>
        <div class="col-xs-12 q-py-md">
          <textarea v-model="userReview" class="full-width rating-input" rows="10"></textarea>
        </div>
        <div class="col-xs-12 text-right">
          <q-btn :loading="saveReviewLoading" :disabled="saveReviewLoading" :label="$t('button.submit')" color="primary" @click.native="sendReview()"></q-btn>
        </div>
      </div>
    </div>
    <div v-else-if="bLoadingFinished && notificationType === NOTIFICATION_TYPE.GET_REVIEW" class="col-12 justify-center">
      <link-to-mobile/>
    </div>
    <div v-else-if="bLoadingFinished && notificationType === NOTIFICATION_TYPE.REVIEW_LISTING" class="col-12 justify-center">
      <link-to-mobile/>
    </div>
    <div v-else class="row col-12 justify-center">
      <ComponentPreLoader></ComponentPreLoader>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'

export default {
  props: ['destinationId'],
  components: {
    'link-to-mobile': () => import('components/Notifications/LinkToMobile')
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
      RATE_PER_SITTER: 1,
      GET_REVIEW: 2,
      REVIEW_LISTING: 3
    }

    return {
      userRating: 4,
      userReview: null,
      saveReviewLoading: false,
      responseInfo: null,
      responseServiceInfo: null,
      responseUserInfo: null,
      requestId: null,
      responseId: null,
      bLoadingFinished: false,
      notificationType: NOTIFICATION_TYPE.UNDEFINED,
      NOTIFICATION_TYPE: NOTIFICATION_TYPE
    }
  },
  mounted () {
    this.getNotificationInfo()
  },
  methods: {
    getNotificationInfo () {
      let vm = this
      var arrDestinationIds = []
      if (vm.destinationId) arrDestinationIds = vm.destinationId.split(',')
      if (arrDestinationIds.length > 1) {
        if (arrDestinationIds[1].includes('-')) {
          vm.notificationType = vm.NOTIFICATION_TYPE.REVIEW_LISTING
          vm.$q.notify('Review Listing Notification is not completed yet...')
          vm.bLoadingFinished = true
          // act
        } else {
          // vm.$router.push('/chat/request/' + arrDestinationIds[0] + '/response/' + arrDestinationIds[1])
          vm.requestId = arrDestinationIds[0]
          vm.responseId = arrDestinationIds[1]
          vm.notificationType = vm.NOTIFICATION_TYPE.RATE_PER_SITTER
          vm.getResponseInfo(arrDestinationIds[0], arrDestinationIds[1])
        }
      } else if (arrDestinationIds.length > 0) {
        this.notificationType = this.NOTIFICATION_TYPE.GET_REVIEW
        this.$q.notify('Get Review Notification is not completed yet...')
        this.bLoadingFinished = true
      }
    },
    getResponseInfo (requestId, responseId) {
      this.$axios.get('users/' + this.$store.state.user.uuid + '/requests/' + requestId + '/responses/' + responseId, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.responseInfo = response.data.responseInfo
        this.responseServiceInfo = this.responseInfo.serviceInfo
        this.responseUserInfo = this.responseServiceInfo.userInfo
        this.bLoadingFinished = true
      }).catch(error => {
        this.forceLogout(error)
        console.log(error)
      })
    },
    sendReview () {
      this.saveReviewLoading = true
      if (!this.userReview) {
        this.saveReviewLoading = false
        this.$q.notify({
          message: 'Please write your review',
          type: 'negative'
        })
        return
      }
      let info = JSON.stringify({
        'responseInfo': {
          'userReview': this.userReview,
          'userRating': this.userRating
        }
      })
      this.$axios.put(`users/${this.$store.state.user.uuid}/requests/${this.requestId}/responses/${this.responseId}`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.saveReviewLoading = false
        this.$q.notify({
          message: 'Review sent',
          type: 'positive'
        })
        this.$emit('onGetResponseInfo')
      }).catch(e => {
        console.log(e)
        let errorMessage = 'Failed to send the review'
        if (e.response.data.message) {
          errorMessage = e.response.data.message
        }
        this.saveReviewLoading = false
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      })
    },
    handleGotoPrevious () {
      this.$router.go(-1)
    }
  }
}
</script>
