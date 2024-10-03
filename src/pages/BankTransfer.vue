<template>
  <q-page padding style="margin-top: 30px;">
    <div class="centerBox width40">
        <div class="row">
            <div class="float-left">
                <img src="statics/images/logo-mid.jpg" alt="" class="col-2 logoImage" />
            </div>
            <div class="float-left q-ml-sm headingText col-9" v-if="drawingAmount">
                Personalised Pet Portrait<br>
                USD {{drawingAmount}}
            </div>
            <div class="float-left q-ml-sm headingText col-9" v-else-if="premiumCarePackage">
                {{premiumCarePackage.title}}<br>
                {{currency + premiumCarePackage.price}}
            </div>
            <div class="float-left q-ml-sm headingText col-9" v-else-if="petsitterDetails && petsitterDetails.id === '16'">
                {{petsitterDetails.userServiceName}}<br>
                {{petsitterDetails.amountInCurrencyText}}
            </div>
            <div class="float-left q-ml-sm headingText col-9" v-else-if="petsitterDetails && petsitterDetails.topup">
                {{$t('bank.transfer.hired', {petsitterName: petsitterDetails.userServiceName})}}<br>
                Deposit {{petsitterDetails.amountInCurrencyText}} into balance
            </div>
            <div class="float-left q-ml-sm headingText col-9" v-else-if="petsitterDetails">
                {{$t('bank.transfer.hired', {petsitterName: petsitterDetails.userServiceName})}}<br>
                {{petsitterDetails.amountInCurrencyText}}
            </div>
        </div>
        <div class="cf"></div>
        <div class="q-pa-md borderSelf">
            <div class="row justify-center text-center" v-if="drawingAmount">
              <img src="statics/images/paynow/pay_now_sg.jpg" style="max-height: 250px;"/>
            </div>
            <br/>
            <div class="row justify-center text-center" v-html="petPortraitDetails" v-if="drawingAmount"></div>
            <div class="row justify-center text-center" v-html='bankDetail[currency]' v-else></div>
        </div>
        <div class="q-pt-md">
            <div class="row justify-center text-center" v-if="petsitterDetails && !drawingAmount">
              <p v-html="$t('bank.transfer.note')"></p>
            </div>
        </div>
        <div class="q-pa-md">
            <div class="row justify-center text-center" v-if="petsitterDetails && !drawingAmount">
                <div class="full-width q-mb-xs">{{$t('booking.reference')}}</div>
                <div class="borderSelf q-pa-md">
                    {{petsitterDetails.jobReference}}
                </div>
            </div>
        </div>
        <div class="full-width justify-center text-center" v-if="drawingAmount">
            <q-btn class="q-mb-xl"
            color="primary"
            size="md"
            @click="emailDetails('https://forms.gle/2Mtjy5aY7Gfunfyh8')"
            >Tap Here to Complete your Order</q-btn>
        </div>
        <div class="full-width justify-center text-center" v-else-if="petsitterDetails && petsitterDetails.id === '16'">
            <q-btn class="q-mb-xl"
            color="primary"
            size="md"
            @click="emailDetails('https://forms.gle/wZXrHgMrwYkcQTje8')"
            >{{$t('tap.here.to.complete.registration')}}</q-btn>
        </div>
        <div class="full-width justify-center text-center" v-else>
            <q-btn class="q-mb-xl"
            :loading="pictureUploading"
            color="primary"
            size="md"
            @click="onFileSelection"
            >{{ $t('submit.bank.transfer.slip') }}</q-btn>
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
      pictureUploading: false,
      premiumCarePackage: null,
      petsitterDetails: null,
      drawingAmount: null,
      currency: null,
      currencyCode: ['MYR', 'INR', 'SGD', 'TWD'],
      bankDetail: {
        'MYR': `Bank Transfer to <br><br>Petbacker Sdn. Bhd.<br>CIMB<br>Account Number: 8008562866<br><br><div class="full-width">Then <a href="javascript:;" id="contact-us">Contact Us</a></div>`,
        'INR': 'Bank Transfer to <br><br>Petbacker India Pvt Ltd<br>ICICI bank<br>Account Number: 182805001325<br>IFSC Code: ICIC0001828<br><br><div class="full-width">Then <a href="javascript:;" id="contact-us">Contact Us</a></div>',
        'SGD': 'Bank Transfer to<br><br>PetBacker Pte Ltd<br>OCBC Bank<br>Account Number: 712475821001<br><br><div class="full-width">Then <a href="javascript:;" id="contact-us">Contact Us</a></div>',
        'TWD': '網路銀行轉賬<br><br>玉山銀行<br>代碼: 808<br>賬號: 1333968015657<br><br><div class="full-width">然後 <a href="javascript:;" id="contact-us">聯係我們</a></div>'
      },
      petPortraitDetails: 'Bank Deposit to<br><br>PetBacker Pte Ltd<br>OCBC Bank<br>Account Number: 712475821001<br><br><div class="full-width"></div>'
    }
  },
  created () {
    if (this.$q.localStorage.has('petSitterDetails')) {
      this.currency = this.$q.localStorage.getItem('petSitterDetails').currencyText
      this.petsitterDetails = this.$q.localStorage.getItem('petSitterDetails')
    } else if (this.$q.localStorage.has('premiumCarePackage')) {
      this.currency = this.$q.localStorage.getItem('premiumCarePackage').currency
      this.premiumCarePackage = this.$q.localStorage.getItem('premiumCarePackage')
    }

    if (this.$route.query.country) {
      this.currency = this.$route.query.country.toUpperCase()
    }

    if (this.$route.query.amount) {
      this.drawingAmount = this.$route.query.amount
    }

    if (this.drawingAmount === null) {
      if (!this.$store.state.user.access) {
        this.$store.commit('user/updateUserBackUrlState', this.$route.fullPath)
        this.$router.replace('/')
      }
    }
  },
  mounted () {
    let vm = this
    if (!this.$route.query.country) {
      document.getElementById('contact-us').addEventListener('click', function () {
        vm.$router.push({name: 'ChatSupportHelp'})
      })
    }

    // listen to ImageUploadMixin callback (image processing)
    this.$on('image-data', (data) => {
      this.uploadImageData(data.blob)
    })
  },
  beforeDestroy () {
    this.$q.localStorage.remove('petSitterDetails')
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
            this.paymentForSitter()
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
    emailDetails (link) {
      this.openUrl(link)
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
      this.messageBox = 'Bank Transfer payment made for PetBacker Premium Protection Subscription'
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
      this.messageBox = `${this.petsitterDetails.topup ? '(Balance Top Up) ' : ''}Bank transfer payment made for job reference: ${this.petsitterDetails.jobReference}`
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
input
  outline: none
  text-align: center
.marginSelf
    margin 0 auto
@media screen and (min-width: 601px)
  .width40
    width 40%
  .centerBox
    margin 0 auto
</style>
