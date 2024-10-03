<template>
    <q-dialog v-model="modal"
    :maximized="$q.platform.is.mobile"
    @hide="closePopUp"
    class="responsive-modal"
    transition-hide="slide-right"
    transition-show="slide-left"
    >
        <q-card class="q-pb-lg">
            <!-- Header -->
            <q-toolbar style="border-bottom: 1px solid lightgrey;" class="bg-white fixed-top">
              <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
                <q-toolbar-title v-close-popup>
                  <h6 class="q-my-none header-title font-header-title">{{$t('verify.identity')}}</h6>
                </q-toolbar-title>
            </q-toolbar>

            <q-card-section class="q-pb-xs q-mt-xl" @click="triggerImageSelectionModal(true)">
                <h6 class="q-my-none">{{$t('take.a.selfie')}}</h6>
                <div class="bg-primary q-my-md q-mx-sm" style="border-radius: 11px;height: 200px;">

                  <q-img v-if="image" :src="image" style="border-radius: 11px;max-height: 200px;" class="image-upload"></q-img>
                  <div style="position: absolute; left: 30%;top: 47%;" class="text-center" v-else-if="!loader">
                    <q-icon name="fas fa-camera" color="white" size="30px"></q-icon>
                    <p class="q-my-none q-mt-sm text-white">{{$t('tap.here.upload.selfie')}}</p>
                  </div>

                  <!-- Loader -->
                  <div class="text-center" style="position: absolute; left: 42%;top: 47%;" v-if="loader">
                    <q-spinner size="65px" color="white" ></q-spinner>
                  </div>
                </div>
            </q-card-section>
            <input type="file" disable @change="imageUpload" accept=".jpg,.jpeg,.png" ref="selectedFile" style="display: none;">

            <q-card-section class="q-py-xs">
              <h6 class="q-my-none">{{$t('take.a.selfie.while.holding.your.id')}}</h6>
              <p class="q-ml-sm q-my-sm"><q-icon name="fas fa-check" color="positive" class="q-mr-sm"></q-icon> {{$t('hide.id.number.before.submit')}}</p>
              <p class="q-ml-sm q-my-sm"><q-icon name="fas fa-check" color="positive" class="q-mr-sm"></q-icon> {{$t('stand.in.front.light.background')}}</p>
              <p class="q-ml-sm q-my-sm"><q-icon name="fas fa-check" color="positive" class="q-mr-sm"></q-icon> {{$t('hold.id.next.to.you')}}</p>
            </q-card-section>

            <q-card-section class="q-pa-none">
                <div class="text-center" >
                  <q-img src="statics/images/selfie.png" style="width: 200px;border-radius: 11px;" ></q-img>
                </div>
            </q-card-section>

            <!-- BUTTON BOTTOM will appear on mobile screen -->
            <div class="row text-center fixed-bottom lt-lg">
                <div class="col-xs-12" :disabled="showLoading" @click="onSubmit">
                    <div class="full-width z999 text-white q-pa-sm bg-primary cursor-pointer font-header-title-large" :class="$q.platform.is.cordova ? 'q-pb-md' : ''">
                        <span v-if="!showLoading">{{ $t('button.submit') }}</span>
                        <span v-else><q-spinner></q-spinner></span>
                    </div>
                </div>
            </div>

            <!-- Image Selection Option -->
            <dialog-image-options :trigger="imageSelectionModal" @on-selected="uploadImageData" @on-close="triggerImageSelectionModal"></dialog-image-options>
        </q-card>
    </q-dialog>
</template>
<script>
import ImageTools from 'assets/ImageTools.js'
export default {
  components: {
    'dialog-image-options': () => import('components/ImageUpload/DialogSelection.vue')
  },
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
      modal: false,
      imageInfo: null,
      loader: false,
      image: null,
      imageSelectionModal: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)
    }
  },
  methods: {
    triggerImageSelectionModal (status) {
      this.imageSelectionModal = status
    },
    uploadImageData (imageBlobData) {
      let vm = this
      this.loader = true
      let formData = new FormData()
      formData.append('imagefile', imageBlobData, 'image.jpg')
      vm.$axios.post('imageupload?type=identity', formData)
        .then((response) => {
          let mediaInfo = {
            'contentType': 'image',
            'fileName': response.data.imageName,
            'filePath': response.data.imagePath
          }
          vm.imageInfo = mediaInfo

          let reader = new FileReader()
          reader.readAsDataURL(imageBlobData)
          reader.onloadend = () => {
            vm.image = reader.result
          }
        }).catch(e => {
          console.error(e)
          vm.$q.notify(e.response.data.message)
        }).finally(_ => {
          vm.loader = false
        })
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    },
    onSubmit () {
      if (!this.imageInfo) {
        this.$q.notify({
          message: this.$t('please.upload.selfie.photo'),
          type: 'negative'
        })
        return
      }

      let info = {
        'fileName': this.imageInfo.fileName
      }

      this.$emit('on-selfie-submit', info)
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
            let mediaInfo = {
              'contentType': 'image',
              'fileName': response.data.imageName,
              'filePath': response.data.imagePath
            }
            vm.imageInfo = mediaInfo
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
