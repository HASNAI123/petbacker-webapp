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
              <img :src="bankDetail[currency]" style="max-height: 350px;"/>
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
            <input type="file" @change="onFileChange2($event)" accept=".jpg,.jpeg,.png" ref="selectedFile" style="display: none;">
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
      currency: this.$q.localStorage.getItem('premiumCarePackage').currency || this.$q.localStorage.getItem('petSitterDetails').currencyText,
      currencyCode: ['INR'],
      bankDetail: {
        'INR': 'statics/images/bharatpe/bharat_pe.jpg'
      }
    }
  },
  beforeDestroy () {
    this.$q.localStorage.remove('petSitterDetails')
    this.$q.localStorage.remove('premiumCarePackage')
  },
  methods: {
    onUpload () {
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
        this.paymentToSitter()
      }
    },
    paymentForPremiumCarePackage () {
      this.messageBox = 'Bharat payment made for BankTransfer payment made for PetBacker Premium Protection Subscription' // user id here maybe?
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
      if (this.$q.platform.is.mobile) {
        this.$router.replace({name: 'MobileDashboard'})
      } else {
        this.$router.replace({name: 'Requests'})
      }
    },
    paymentToSitter () {
      this.messageBox = this.$t('paynow.reference') + this.petsitterDetails.jobReference
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
