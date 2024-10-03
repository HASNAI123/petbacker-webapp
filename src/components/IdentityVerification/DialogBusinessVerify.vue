<template>
    <q-dialog v-model="modal"
    :position="count < 3 ? 'bottom' : 'standard'"
    :maximized="count === 3"
    @hide="closePopUp"
    class="responsive-modal"
    transition-hide="slide-down"
    transition-show="slide-up"
    >
        <input type="file" disable @change="imageUpload" accept=".jpg,.jpeg,.png" ref="selectedFile" style="display:none;">
        <q-card style="border-top-left-radius:11px;border-top-right-radius:11px;" class="q-pb-lg" v-if="count === 0">
            <q-card-section class="q-pb-xs">
                <h6 class="q-my-none">{{$t('photo.of.business.permit')}}</h6>
                <p class="text-grey-9">{{$t('photo.of.business.permit.description')}}</p>
            </q-card-section>

            <!-- <q-card-section>
                <div class="text-center" >
                    <q-img src="statics/images/ID.png" style="width: 200px;border-radius: 11px;" ></q-img>
                </div>
            </q-card-section> -->

            <q-card-section>
                <q-btn class="full-width q-py-sm cursor-pointer" :label="$t('get.started')" color="primary" :loading="loader" :ripple="false" @click="onFileSelection"></q-btn>
            </q-card-section>
        </q-card>

        <q-card style="border-top-left-radius:11px;border-top-right-radius:11px;" class="q-pb-xl" v-if="count === 1">
            <!-- Header -->
            <q-toolbar v-if="count === 3">
                <q-btn flat round dense icon="chevron_left" size="1.3em" @click="count -= 1"></q-btn>
                <q-toolbar-title @click="count -= 1">
                  <h6 class="q-my-none header-title font-header-title">{{$t('business.verification')}}</h6>
                </q-toolbar-title>
            </q-toolbar>

            <q-card-section class="q-pb-xs q-mt-lg">
                <h6 class="q-my-none font-title">{{$t('business.verification.details')}}</h6>
            </q-card-section>

            <q-card-section class="q-pt-none q-pb-lg q-mb-lg">
              <q-input v-model="business.registrationNum" hide-bottom-space borderless class="input q-my-md" :error="showError && business.registrationNum === null" :label="$t('business.registration.number')"></q-input>
            </q-card-section>

            <!-- BUTTON BOTTOM will appear on mobile screen -->
            <div class="row text-center fixed-bottom lt-lg">
                <div class="col-xs-12" :disabled="showLoading" @click="onSubmit">
                    <div class="full-width z999 text-white q-pa-md bg-primary cursor-pointer font-header-title-large">
                        <span v-if="!showLoading">{{ $t('button.submit') }}</span>
                        <span v-else><q-spinner></q-spinner></span>
                    </div>
                </div>
            </div>
        </q-card>
    </q-dialog>
</template>
<script>
import ImageTools from 'assets/ImageTools.js'
import ImageUploadMixin from '../../mixins/imageUploadMixin.js'
export default {
  mixins: [ImageUploadMixin],
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    showLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      count: 0,
      modal: false,
      business: {
        fileName: null,
        registrationNum: null
      },
      loader: false,
      showError: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)
    }
  },
  mounted () {
    // listen to ImageUploadMixin callback (image processing)
    this.$on('image-data', this.uploadImageData)
  },
  beforeDestroy () {
    this.$off('image-data', this.uploadImageData)
  },
  methods: {
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    },
    resetCount () {
      this.count = 0
    },
    onSubmit () {
      if (this.checkInvalid()) {
        this.showError = true
        return
      }

      let form = {
        'accountInfo': {
          'documentType': 2,
          'fileName': this.business.fileName,
          'registrationNum': this.business.registrationNum
        }
      }

      this.$emit('on-submit', form)
    },
    checkInvalid () {
      if (this.business.registrationNum === '' || this.business.registrationNum === null || this.business.registrationNum === ' ') {
        return true
      }

      return false
    },
    uploadImageData (imageBlobData) {
      let vm = this
      this.loader = true
      let formData = new FormData()
      formData.append('imagefile', imageBlobData.blob, 'image.jpg')
      vm.$axios.post('imageupload?type=identity', formData)
        .then((response) => {
          if (vm.count === 0) {
            vm.business.fileName = response.data.imageName
          }

          vm.count += 1
        }).catch(e => {
          console.error(e)
          vm.$q.notify(e.response.data.message)
        }).finally(_ => {
          vm.loader = false
        })
    },
    imageUpload (e) {
      if (!e.target.files[0]) {
        this.$q.notify({
          message: this.$t('no.images.selected'),
          position: 'top'
        })
        return
      }

      this.loader = true
      let image = e.target.files[0]
      if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
        let sorry = this.$t('sorry')
        let message = this.$t('only.jpeg.png')
        this.$q.dialog({
          title: sorry,
          message: message
        })
        return
      }

      let vm = this
      ImageTools.resize(image, function (blob, didItResize) {
        let formData = new FormData()
        formData.append('imagefile', blob, 'image.jpg')
        vm.$axios.post('imageupload?type=identity', formData)
          .then((response) => {
            if (vm.count === 0) {
              vm.business.fileName = response.data.imageName
            }
            vm.count += 1
          }).catch(e => {
            console.error(e)
            vm.$q.notify(e.response.data.message)
          }).finally(_ => {
            vm.loader = false
          })
      })
    }
  }
}
</script>
<style lang="stylus">
.header-title
  margin-left: 20%
</style>
