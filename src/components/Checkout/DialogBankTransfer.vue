<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" :transition-hide="$q.platform.is.mobile ? 'slide-right' : ''" :transition-show="$q.platform.is.mobile ? 'slide-left' : ''">
      <q-card class="scroll" style="min-width: 320px;min-height: 400px;">
        <q-toolbar class="bg-white fixed-top" style="border-bottom: solid 1px lightgrey;z-index: 5000;">
          <q-btn flat round dense v-close-popup size="lg" icon="chevron_left"/>
          <q-toolbar-title v-close-popup>
            <h6 class="q-my-none" :style="{'margin-left: 14%;' : $q.platform.is.mobile}">Bank Transfer</h6>
          </q-toolbar-title>
        </q-toolbar>

        <q-card-section v-if="paymentInfo" class="q-mt-xl q-scroll-area" style="heigth: 47px;">
            <div class=" width40">
                <div class="row justify-center">

                    <div class="float-left q-ml-sm headingText col-9" v-if="topup">
                        {{paymentInfo.description}}<br/>
                        Deposit {{paymentInfo.amountText}} into balance
                    </div>
                    <div class="float-left q-ml-sm headingText col-9 text-center " v-else>
                         <div class="desc">{{paymentInfo.description}}</div>
                        {{paymentInfo.amountText}}
                    </div>
                </div>

                <div class="cf"></div>
                <div class="q-pt-md">
                    <div class="row justify-center  ">
                    <p class="note"  v-html="$t('bank.transfer.note')"></p>
                    </div>
                </div>

                <div class="q-pa-md ">
                     <div style="font-size: 20px;" class="transfer"> Transfer Details</div><br>
                     <label class="transfer" for="">Account Name</label> <br>
                    <div class="details">{{paymentInfo.bankInfo.accountName}}</div><br>

                    <label class="transfer" for="">Account Number</label> <br>
                    <div class="row">
                   <div class="details">{{paymentInfo.bankInfo.accountNumber}}</div> <br>
                   <button class="copy-button q-ml-auto " @click="copyToClipboard">Copy</button>

                    </div> <br>
                    <label class="transfer" for="">Bank Name</label> <br>
                   <div class="details">{{paymentInfo.bankInfo.bankName}}</div> <br>

                    <label class="transfer" for="">Reference Number</label> <br>
                    <div class="row">
                   <div class="details">{{paymentInfo.bookingRef}}</div> <br>
                   <button class="copy-button q-ml-auto " @click="copyToClipboard2">Copy</button>

                    </div> <br><br><br><br>
                </div>
                <!-- Submit Bank Transfer Slip Button -->
                <div class="full-width justify-center text-center">
                    <div class="fixed-bottom bg-primary" v-if="$q.platform.is.mobile" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" @click="onFileSelection">
                        <div class="q-pa-md q-pb-lg">
                            <div class="text-white q-pb-sm text-center cursor-pointer font-header-title">
                                <span v-if="!pictureUploading">{{$t('submit.bank.transfer.slip')}}</span>
                                <span v-else><q-spinner size="1.5em"></q-spinner></span>
                            </div>
                        </div>
                    </div>
                    <q-btn class="q-mb-xl"
                    v-else
                    :loading="pictureUploading"
                    color="primary"
                    size="md"
                    @click="onFileSelection"
                    >{{ $t('submit.bank.transfer.slip') }}</q-btn>
                    <input type="file" @change="onFileChange2($event)" accept=".jpg,.jpeg,.png" ref="selectedFile" style="display: none;">
                </div>
            </div>
        </q-card-section>
        <q-card-section v-else class="text-center">
          <ComponentPreLoader></ComponentPreLoader>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script>
import ImageUploadMixin from '../../mixins/imageUploadMixin.js'
import clipboard from '../../mixins/copyClipboardMixin'
export default {
  mixins: [ImageUploadMixin],
  props: {
    trigger: {
      type: Boolean,
      require: true,
      default: false
    },
    href: {
      type: String,
      require: true
    },
    topup: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      imageLink: null,
      pictureUploading: false,
      petsitterDetails: null,
      paymentInfo: null,
      modal: false,
      copied: false
    }
  },
  mounted () {
    // listen to ImageUploadMixin callback (image processing)
    this.$on('image-data', this.uploadImageData)
    console.log('Payment modal pop up')
    document.addEventListener('deviceready', this.onDeviceReady, false)
    console.log('check plugins', clipboard)
  },
  watch: {
    trigger (value) {
      this.modal = value

      if (value && this.paymentInfo === null) {
        this.getPaymentInfo()
      }
    }
  },
  beforeDestroy () {
    this.$off('image-data', this.uploadImageData)
    this.$q.localStorage.remove('petSitterDetails')
  },
  methods: {
    copyToClipboard () {
      this.$copyText(this.paymentInfo.bankInfo.accountNumber)
      this.copied = true
      this.$q.notify({
        message: 'Copied to clipboard',
        color: 'positive',
        position: 'top',
        timeout: 2000
      })
      setTimeout(() => {
        this.copied = false
      }, 3000)
    },

    copyToClipboard2 () {
      this.$copyText(this.paymentInfo.bookingRef)
      this.copied = true
      this.$q.notify({
        message: 'Copied to clipboard',
        color: 'positive',
        position: 'top',
        timeout: 2000
      })
      setTimeout(() => {
        this.copied = false
      }, 3000)
    },
    onDeviceReady () {
      if (window.clipboard) {
        console.log('Clipboard API available')
      } else {
        console.log('Clipboard API not available')
      }
    },
    getPaymentInfo () {
      this.$axios.get(this.href, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        console.log(response)
        this.paymentInfo = response.data.paymentInfo
      }).catch((error) => {
        console.error(error)
      })
    },
    uploadImageData (imageBlobData) {
      let vm = this
      this.pictureUploading = true
      let formData = new FormData()
      formData.append('imagefile', imageBlobData.blob, `image.jpg`)
      vm.$axios.post('imageupload?type=banktransfer', formData)
        .then((response) => {
          vm.imageLink = response.data.imageName
          this.paymentForSitter()
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
      this.paymentForSitter()
    },
    paymentForSitter () {
      let payload = {
        'paymentInfo': {
          'bookingRef': this.paymentInfo.bookingRef,
          'imageInfo': {
            'fileName': this.imageLink
          }
        }
      }

      this.$axios.post('/payments/bank/initiate', payload, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        setTimeout(() => {
          this.$q.dialog({
            title: `${this.$t('pending.approval')} (${this.paymentInfo.bookingRef})`,
            message: this.$t('payment.verify'),
            ok: this.$t('ok')
          }).onOk(() => {})
        }, 400)
        this.$router.replace({ name: 'Chat', params: {request: this.paymentInfo.requestid, response: this.paymentInfo.jobId} })
      }).catch((error) => {
        console.error(error)
      })
    },
    onClose () {
      this.$emit('on-close', false)
      this.modal = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.scroll {
  overflow-y: auto;
}

.copy-button
   background-color: white
   border-color: #9b89b9
   border-radius: 10px
   width:70px
.details
    font-weight: bold
.cf
    clear both
.logoImage
    width 60px
.transfer
  color: #9b89b9;
  font-weight: bold
.desc
  color: #9b89b9;
  font-weight: bold
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

    .details {
  font-size: 24px;
  color: #222;
}

.transfer {
  font-size: 30px;
  color: #3f51b5;
}

@media screen and (max-width: 800px) {
  .details {
    font-size: 18px;
  }

  .transfer {
    font-size: 24px;
  }
}
</style>
