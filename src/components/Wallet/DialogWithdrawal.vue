<template>
    <q-dialog v-model="modal" :maximized="$q.platform.is.mobile" @hide="onClose" transition-show="slide-left" transition-hide="slide-right">
      <q-card :style="{width: $q.platform.is.desktop ? '385px' : '', height: $q.platform.is.desktop ? '630px' : ''}" v-touch-pan.right.prevent.mouse="onSwipeRight">
        <q-toolbar class="q-pl-xs fixed-top bg-white" style="z-index: 3000;border-bottom: 1px solid lightgrey;">
          <q-btn flat round dense v-close-popup size="1.35em" icon="chevron_left"/>
          <q-toolbar-title v-close-popup @click="onClose">
            <h6 class="q-my-none withdrawal-title font-normal">{{$t('withdrawal.title')}}</h6>
          </q-toolbar-title>
        </q-toolbar>

        <q-card-section class="q-mt-xl">
          <h6 class="q-my-none text-weight-bold">{{$t('withdraw.balance.from.wallet')}}</h6>
          <p class="q-my-none text-grey-7" v-html="$t('withdrawals.help.center', {link: $t('link.href.help')})"></p>
        </q-card-section>

        <!-- Balance Bar -->
        <q-card-section>
          <div>
            <p class="q-my-none text-weight-bold font-normal">{{$t('withdrawalable.balance')}}<q-icon name="help_outline" class="q-ml-sm q-mb-xs" @click="openUrl(`${$t('link.href.help')}/pet-service-providers/what-is-withdrawable-and-non-withdrawable-balance`)"></q-icon></p>
            <p class="text-grey-7 q-mb-none" style="padding-right: 25%;">{{$t('withdrawable.balance.descriptions')}}</p>
            <h5 class="q-my-none text-weight-bold">{{currency}} {{transferrableAmount}}</h5>
            <div class="q-mt-xs vertical-line-primary" :style="{borderColor: transferrableAmount === 0 ? 'lightgrey' : ''}"></div>
          </div>
          <q-linear-progress size="25px" :value="truncateDecimals(transferrableAmount/balance)" color="primary" :track-color="nonTransferrableAmount > 0 ? 'orange-6' : 'grey-5'"></q-linear-progress>
          <div v-if="nonTransferrableAmount > 0">
            <div class="q-mb-xs vertical-line-secondary"></div>
            <p class="q-my-none text-weight-bold font-normal text-right"><q-icon name="help_outline" class="q-mr-xs q-mb-xs" @click="openUrl(`${$t('link.href.help')}/pet-service-providers/what-is-withdrawable-and-non-withdrawable-balance`)"></q-icon>{{$t('non.withdrawable.balance')}}</p>
            <h5 class="q-my-none text-weight-bold text-right">{{currency}} {{nonTransferrableAmount}}</h5>
            <p class="text-grey-7 text-right q-mb-none" style="padding-left: 25%;">{{$t('non.withdrawable.balance.descriptions')}}</p>
          </div>
        </q-card-section>

        <!-- Payout Account -->
        <q-card-section class="q-py-none q-mb-md q-mt-lg">
          <p class="q-my-none text-weight-bold font-normal">{{$t('payout.account')}}</p>
          <h6 v-if="payoutInfo" class="q-my-none anchor-link font-normal" style="white-space: pre-wrap;line-height: 1.3em;" @click="triggerPayoutModal(true)">{{parseInfo(payoutInfo.paymentAccountInfo)}}</h6>
          <h6 class="q-my-none anchor-link" @click="triggerPayoutModal(true)" v-else>{{$t('select.payout.account.here')}}</h6>
        </q-card-section>

        <!-- <q-card-section v-if="minimum">
          <p class="q-my-none text-grey">{{$t('withdrawal.note', {minimumAmount: minimum})}}</p>
        </q-card-section> -->

        <q-card-section>
          <p class="q-my-none text-negative">{{$t('days.to.verify.payout.details')}}</p>
        </q-card-section>

        <q-card-section v-if="$q.platform.is.desktop">
          <q-btn class="full-width" :loading="withdrawalLoading" color="primary" :label="$t('request.withdrawal')" @click="onRequestWithdrawal"></q-btn>
        </q-card-section>

        <div class="fixed-bottom" v-else-if="$q.platform.is.mobile">
          <q-btn class="full-width q-pb-lg q-pt-md" :disable="transferrableAmount === 0" :loading="withdrawalLoading" color="primary" :label="$t('button.next')" style="border-radius: 15px 15px 0px 0px;" @click="onRequestWithdrawal"></q-btn>
        </div>
        <p class="q-py-xl"></p>
      </q-card>

      <!-- Error Dialog -->
      <dialog-error :trigger="errorModal"  @on-ok="onErrorOk" :statusCode="errorStatusCode" :okButtonLabel="errorOkBtnLabel" :message="errorMessage" :learnMoreLink="learnMoreLink" @on-close="triggerErrorModal"></dialog-error>

      <!-- Payout Accounts Dialog -->
      <dialog-payout-accounts :trigger="payoutAccountModal" @payout-info="getPayoutInfo" @on-close="triggerPayoutModal"></dialog-payout-accounts>
    </q-dialog>
</template>
<script>
export default {
  components: {
    'dialog-payout-accounts': () => import('components/Payout/DialogPayoutSelection.vue'),
    'dialog-error': () => import('components/DialogError.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      required: true,
      default: false
    },
    balance: {
      type: Number,
      required: true,
      default: 0
    },
    currency: {
      type: String,
      required: true,
      default: 'USD'
    },
    currencyId: {
      type: Number,
      required: true,
      default: 0
    },
    minimum: {
      type: String,
      required: true
    },
    transferrableAmount: {
      type: Number,
      required: true,
      default: 0
    },
    nonTransferrableAmount: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data () {
    return {
      modal: false,
      payoutAmount: this.balance,
      payoutInfo: null,
      payoutAccountModal: false,
      withdrawalLoading: false,
      errorModal: false,
      errorMessage: '',
      errorOkBtnLabel: null,
      errorStatusCode: 0,
      learnMoreLink: null,
      paypalFeesLink: {
        178: 'https://www.paypal.com/ph/webapps/mpp/paypal-seller-fees',
        219: 'https://www.paypal.com/th/webapps/mpp/paypal-seller-fees',
        106: 'https://www.paypal.com/id/webapps/mpp/paypal-seller-fees'
      }
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    }
  },
  methods: {
    onSwipeRight ({ evt, ...info }) {
      if (info.direction === 'right' && info.offset.x > 100) {
        this.onClose()
      }
    },
    truncateDecimals (floatValue) {
      if (floatValue === 1) {
        return 1
      }

      let floorValue = Math.min(Math.floor((floatValue) * 10) / 10, 0.9)
      let ceilValue = Math.min(Math.ceil(floatValue * 10) / 10, 0.1)

      return Math.max(floorValue, ceilValue)
    },
    triggerErrorModal (status) {
      this.errorModal = status
    },
    onErrorOk (code) {
      if (code === 20) {
        // prompt user to select payout account
        this.triggerPayoutModal(true)
      } else if (code === 11) {
        this.onWithdrawal(true)
      }
    },
    getPayoutInfo (accountInfo) {
      this.payoutInfo = accountInfo
      this.triggerPayoutModal(false)
    },
    triggerPayoutModal (status) {
      this.payoutAccountModal = status
    },
    onClose () {
      this.$emit('on-close', false)
    },
    onRequestWithdrawal () {
      this.errorStatusCode = 0
      if (!this.payoutInfo) {
        this.errorMessage = this.$t('select.payout.account.to.proceed')
        this.errorOkBtnLabel = this.$t('select.payout.account')
        this.errorStatusCode = 20
        this.triggerErrorModal(true)
        return
      }

      let minimumWithdrawal = parseInt(this.minimum.split(' ')[1])
      if (this.payoutAmount < minimumWithdrawal) {
        this.learnMoreLink = this.paypalFeesLink[this.$store.getters['user/getUserPrefferedCurrency']]
        this.errorMessage = this.$t('withdrawal.below.minimum.fees', {minimumAmount: this.minimum})
        this.errorOkBtnLabel = this.$t('proceed.with.withdrawal')
        this.errorStatusCode = 11
        this.triggerErrorModal(true)
        return
      }

      this.onWithdrawal()
    },
    onWithdrawal (override = false) {
      this.learnMoreLink = null
      this.withdrawalLoading = true
      let redeemInfo = {
        'redeemInfo': {
          'amount': this.transferrableAmount,
          'currencyId': this.currencyId,
          'payoutInfoId': this.payoutInfo.id
        }
      }

      this.$axios.post(`users/${this.$store.state.user.uuid}/redeem?v=6${override ? '&override=1' : ''}`, redeemInfo, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$q.notify({
          message: this.$t('withdrawal.requested'),
          type: 'positive',
          position: 'top'
        })
        this.$emit('on-close', false)
        this.$emit('refresh')
      }).catch((error) => {
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message
          this.errorStatusCode = error.response.data.code

          if (error.response.data.okBtnLabel) {
            this.errorOkBtnLabel = error.response.data.okBtnLabel
          } else {
            this.errorOkBtnLabel = this.$t('ok')
          }

          this.triggerErrorModal(true)
        }

        console.log(error)
      }).finally(_ => {
        this.withdrawalLoading = false
      })
    },
    parseInfo (accountInfo) {
      let info = accountInfo.split(',')
      if (info.length > 0) {
        return info.join('\n')
      } else {
        return info[0]
      }
    }
  }
}
</script>
<style lang="stylus">
.withdrawal-title
  margin-left: 29%;

.vertical-line-primary
  border-left: 3px solid $primary
  height: 25px
  margin-left: 7%

.vertical-line-secondary
  border-right: 3px solid $orange
  height: 25px
  margin-right: 7%
</style>
