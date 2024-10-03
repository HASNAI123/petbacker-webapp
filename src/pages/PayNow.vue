<template>
  <q-page padding style="margin-top: 10px;">
    <div>
        <div class="row">
            <div class="float-left">
                <img src="statics/images/logo-mid.jpg" alt="PetBacker Logo" class="col-2" width="60px" />
            </div>
            <div class="q-ml-sm headingText col" v-if="petsitterDetails">
                {{$t('bank.transfer.hired', {petsitterName: petsitterDetails.userServiceName})}}<br>
                {{petsitterDetails.amountInCurrencyText}}
            </div>
            <div class="q-ml-sm headingText col-9" v-else-if="premiumCarePackage">
                {{premiumCarePackage.title}}<br>
                {{currency + premiumCarePackage.price}}
            </div>
            <div class="q-ml-sm headingText col-9" v-else-if="drawingAmount">
                Personalised Pet Portrait<br>
                {{currency + drawingAmount}}
            </div>
        </div>
        <div class="cf"></div>
        <div class=" q-mt-md q-pa-md borderSelf">
            <div class="row justify-center text-center">
              <img :src="bankDetail[currency]" style="max-height: 250px;"/>
            </div>
        </div>
        <div class="q-pa-md">
            <p class="text-weight-medium text-justify" style="font-size: 16px;">{{$t('provide.screenshot.payment')}}</p>
        </div>
        <div class="full-width justify-center text-center">
            <q-btn class="q-mb-xl"
            :loading="pictureUploading"
            color="primary"
            size="md"
            @click="onFileSelection"
            >{{ $t('submit.wechat.payment') }}</q-btn>
            <input type="file" @change="onFileChange2($event)" accept=".jpg,.jpeg,.png" ref="selectedFile" style="display: none;">
        </div>
    </div>
  </q-page>
</template>

<script>
import chatMixin from '../mixins/chatMixin.js'
import ImageUploadMixin from '../mixins/imageUploadMixin.js'
export default {
  mixins: [chatMixin, ImageUploadMixin],
  data () {
    return {
      premiumCarePackage: this.$q.localStorage.getItem('premiumCarePackage'),
      petsitterDetails: this.$q.localStorage.getItem('petSitterDetails'),
      currency: null,
      currencyCode: ['SGD'],
      bankDetail: {
        'SGD': 'statics/images/paynow/pay_now_sg.jpg'
      },
      pictureUploading: false
    }
  },
  created () {
    if (this.$q.localStorage.has('petSitterDetails')) {
      this.currency = this.$q.localStorage.getItem('petSitterDetails').currencyText
    } else if (this.$q.localStorage.has('premiumCarePackage')) {
      this.currency = this.$q.localStorage.getItem('premiumCarePackage').currency
    }
  },
  mounted () {
    // listen to ImageUploadMixin callback (image processing)
    this.$on('image-data', (data) => {
      this.uploadImageData(data.blob)
    })
  },
  beforeDestroy () {
    this.$q.localStorage.remove('petSitterDetails')
    this.$q.localStorage.remove('premiumCarePackage')
    this.$off('image-data')
  },
  methods: {
    uploadImageData (imageBlobData) {
      let vm = this
      this.pictureUploading = true
      let formData = new FormData()
      formData.append('imagefile', imageBlobData, 'image.jpg')
      vm.$axios.post('imageupload?type=banktransfer', formData)
        .then((response) => {
          vm.imageLink = response.data.imageName
          vm.sendImage(true)
          if (this.premiumCarePackage) {
            this.paymentForPremiumCarePackage()
          } else if (this.petsitterDetails) {
            this.paymentToSitter()
          }
        }).catch(e => {
          console.error(e)
          vm.$q.notify(e.response.data.message)
        }).finally(() => {
          vm.pictureUploading = false
        })
    },
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
      this.messageBox = 'PayNow payment made for Premium Pet Care Package ' // user id here maybe?
      this.sendSupportMessage()
      let bookingConfirmed = this.$t('pending.approval')
      let paymentVerify = this.$t('thank.you.bank.slip')
      let ok = this.$t('ok')
      setTimeout(() => {
        this.$q.dialog({
          title: bookingConfirmed + '(Premium Care Package)',
          message: paymentVerify,
          ok: ok
        }).onOk(() => {
        })
      }, 400)
      this.$router.replace({name: 'SubscriptionPaymentSuccess', query: {currency: this.currency}})
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
.headingText
    font-size 24px
.borderSelf
    border 1px solid
.marginSelf
    margin 0 auto
</style>
