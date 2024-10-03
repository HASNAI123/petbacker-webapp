<template>
  <q-page padding class="row justify-center">
    <div class="col-xs-12 col-sm-8 col-lg-6 text-center" v-if="referralUserInfo">
      <div class="q-my-lg font-xx-large" v-if="!isUserOld">{{ $t('you.got.referral', {'referralAmount': referralUserInfo.referralAmount}) }}</div>
      <div class="q-my-lg font-xx-large" v-else>{{ $t('would.you.like.earn') }}</div>
      <div class="q-pb-lg">
        <img src="statics/images/referral-round.png" alt="logo">
      </div>
      <div class="q-mt-md" v-if="isUserOld">{{ $t('you.have.registered.referral', {'referralAmount': referralUserInfo.referralTarget}) }}</div>
      <div class="q-mt-md" v-else>{{ $t('want.to.earn.more', {'referralTarget': referralUserInfo.referralTarget}) }}</div>
      <div class="max-width q-mt-md text-center margin-auto">
        <q-btn class="full-width q-my-sm" size="lg" color="primary" @click="$router.replace('/referrals')">{{ $t('invite.friends.to.earn') }}</q-btn>
        <q-btn class="full-width q-my-sm" flat size="lg" color="primary" @click="onLater">{{ $t('chat.later') }}</q-btn>
      </div>
    </div>
    <div class="col-xs-12 text-center" v-else>
      <ComponentPreLoader></ComponentPreLoader>
    </div>
  </q-page>
</template>

<script>
import authFlowMixin from '../mixins/authFlowMixin'
import moment from 'moment'

export default {
  mixins: [authFlowMixin],
  data () {
    return {
      ONE_DAY_IN_MINS: 1440,
      referralUserInfo: this.$q.localStorage.getItem('globalStorageReferralUserInfo'),
      isUserOld: false
    }
  },
  mounted () {
    this.setIsUserOld()
  },
  beforeDestroy () {
    this.$q.localStorage.remove('globalStorageReferralUserInfo')
  },
  methods: {
    setIsUserOld () {
      let now = moment(new Date())
      let end = moment(this.$store.state.user.createdDate)
      let duration = moment.duration(now.diff(end))
      let diffInMinutes = duration.asMinutes()

      if (diffInMinutes > this.ONE_DAY_IN_MINS) {
        this.isUserOld = true
      }
    },
    onLater () {
      if (this.$store.state.user.backUrl) {
        let backUrl = this.$store.state.user.backUrl
        this.$router.replace(backUrl)
        this.$store.commit('user/updateUserBackUrlState', null)
      } else {
        this.$router.replace({name: 'MobileDashboard'})
      }
    }
  }
}
</script>
