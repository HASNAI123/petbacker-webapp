<template>
  <q-page padding style="margin-top: 10px;">
    <div class="centerBox width40">
        <div>
            <div class="float-left">
                <img src="statics/images/logo-mid.jpg" alt="" class="col-2 logoImage" />
            </div>
            <div class="float-left q-ml-md headingText" v-if="petsitterDetails">
                {{$t('bank.transfer.hired', {petsitterName: petsitterDetails.userServiceName})}}<br>
                {{petsitterDetails.amountInCurrencyText}}
            </div>
            <div class="float-left q-ml-md headingText" v-else-if="premiumCarePackage">
                {{premiumCarePackage.title}}<br>
                {{currency + premiumCarePackage.price}}
            </div>
        </div>
        <div class="cf"></div>
        <div class=" q-mt-md q-pa-md borderSelf">
            <div class="row justify-center text-center">
                <img :src="bankDetail[currency]" style="max-height: 400px;"/>
            </div>
        </div>
        <div class="q-pa-md">
            <p class="text-weight-medium text-justify" style="font-size: 16px;">{{$t('provide.screenshot.payment')}}</p>
        </div>
        <div class="full-width justify-center text-center">
            <q-btn class="q-mb-xl"
            color="primary"
            size="md"
            @click="onUpload"
            >{{ $t('submit.wechat.payment') }}</q-btn>
            <input type="file" @change="onFileChange2($event)" ref="selectedFile" accept=".jpg,.jpeg,.png" style="display: none;">
        </div>
    </div>
  </q-page>
</template>

<script>
import chatMixin from '../mixins/chatMixin.js'
export default {
  mixins: [chatMixin],
  data () {
    return {
      premiumCarePackage: this.$q.localStorage.getItem('premiumCarePackage'),
      petsitterDetails: this.$q.localStorage.getItem('petSitterDetails'),
      currency: 'CNY',
      currencyCode: ['CNY', 'HKD'],
      bankDetail: {
        'CNY': 'statics/images/wechat/wechat_pay.jpg',
        'HKD': 'statics/images/wechat/wechat_pay_HK.jpg'
      }
    }
  },
  created () {
    if (this.$q.localStorage.has('premiumCarePackage')) {
      this.currency = this.$q.localStorage.getItem('premiumCarePackage').currency
    } else if (this.$q.localStorage.has('petSitterDetails')) {
      this.currency = this.$q.localStorage.getItem('petSitterDetails').currencyText
    }
  },
  beforeDestroy () {
    this.$q.localStorage.remove('petSitterDetails')
  },
  methods: {
    onFileSelection () {
      this.$refs['selectedFile'].click()

      if (this.$q.platform.is.cordova) {
        this.$refs['selectedFile'].click()
      }
    },
    onFileChange2 ($event) {
      this.onFileChange($event, true)
      if (this.premiumCarePackage) {
        this.paymentForPremiumCarePackage()
      } else if (this.petsitterDetails) {
        this.paymentForSitter()
      }
    },
    paymentForPremiumCarePackage () {
      this.messageBox = 'WeChat payment made for BankTransfer payment made for PetBacker Premium Protection Subscription ' // user id here maybe?
      this.sendSupportMessage()
      let bookingConfirmed = this.$t('pending.approval')
      let paymentVerify = this.$t('thank.you.bank.slip')
      let ok = this.$t('ok')
      setTimeout(() => {
        this.$q.dialog({
          title: bookingConfirmed + '(PetBacker Premium Protection Subscription)',
          message: paymentVerify,
          ok: ok
        }).onOk(() => {
        })
      }, 400)
      this.$router.replace({name: 'SubscriptionPaymentSuccess', query: {currency: this.currency}})
    },
    paymentForSitter () {
      this.messageBox = this.$t('wechat.reference') + this.petsitterDetails.jobReference
      this.sendSupportMessage()
      let bookingConfirmed = this.$t('pending.approval')
      let paymentVerify = this.$t('payment.verify')
      let ok = this.$t('ok')
      setTimeout(() => {
        this.$q.dialog({
          title: bookingConfirmed + '(' + this.petsitterDetails.jobReference + ')',
          message: paymentVerify,
          ok: ok
        }).onOk(() => {
        })
      }, 400)
      this.$router.replace({ name: 'Chat', params: {request: this.petsitterDetails.requestId, response: this.petsitterDetails.id} })
    }
  }
}
</script>

<style lang="stylus" scoped>
.cf
    clear both
.logoImage
    width 60px
.headingText
    font-size 24px
.borderSelf
    border 1px solid
.marginSelf
    margin 0 auto
@media screen and (min-width: 601px)
  .width40
    width 40%
  .centerBox
    margin 0 auto
</style>
