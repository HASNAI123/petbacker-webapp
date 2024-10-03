<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" :transition-hide="$q.platform.is.mobile ? 'slide-right' : ''" :transition-show="$q.platform.is.mobile ? 'slide-left' : ''">
      <q-card style="min-width: 320px;min-height: 400px;">
        <q-toolbar class="bg-white fixed-top" style="border-bottom: solid 1px lightgrey;z-index: 5000;">
          <q-btn flat round dense v-close-popup size="lg" icon="chevron_left"/>
          <!-- <q-toolbar-title v-close-popup>
            <h6 class="q-my-none" :style="{'margin-left: 14%;' : $q.platform.is.mobile}">Bank Transfer</h6>
          </q-toolbar-title> -->
        </q-toolbar>

        <q-card-section v-if="paymentInfo" class="q-mt-xl" style="heigth: 77px;">
            <div>
                <div class="row">
                    <div class="float-left">
                      <img src="statics/images/logo-mid.jpg" alt="" class="col-2 logoImage" width="60px"/>
                    </div>

                    <div class="float-left q-ml-sm headingText col" v-if="topup">
                        {{paymentInfo.description}}<br/>
                        Deposit {{paymentInfo.amountText}} into wallet
                    </div>

                    <div class="float-left q-ml-sm headingText col" v-else>
                        {{paymentInfo.description}}<br>
                        {{paymentInfo.amountText}}
                    </div>
                </div>

                <div class="cf"></div>

                <div class="q-pa-md borderSelf text-center">
                  <img :src="paymentInfo.qrInfo.imageHref" style="max-height: 240px;"/>
                </div>

                <div class="q-pt-md row justify-center text-center">
                  <p class="text-weight-medium text-justify" style="font-size: 16px;">{{$t('provide.screenshot.payment')}}</p>
                </div>

                <div class="q-mb-xl row justify-center text-center" v-if="paymentInfo">
                  <div class="full-width q-mb-xs">{{$t('booking.reference')}}</div>
                  <div class="borderSelf q-py-sm q-px-md">
                      {{paymentInfo.bookingRef}}
                  </div>
                </div>

                <!-- Submit Bank Transfer Slip Button -->
                <div class="full-width justify-center text-center">
                    <div class="fixed-bottom bg-primary" v-if="$q.platform.is.mobile" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" @click="onFileSelection">
                        <div class="q-pa-md q-pb-lg">
                            <div class="text-white q-pb-sm text-center cursor-pointer font-header-title">
                                <span v-if="!pictureUploading">{{$t('submit.wechat.payment')}}</span>
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
                    >{{ $t('submit.wechat.payment') }}</q-btn>
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
      modal: false
    }
  },
  mounted () {
    // listen to ImageUploadMixin callback (image processing)
    this.$on('image-data', this.uploadImageData)
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

      this.$axios.post('/payments/qr/initiate', payload, {
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
.cf
    clear both
.headingText
    font-size 24px
.borderSelf
    border 1px solid
.marginSelf
    margin 0 auto
</style>
