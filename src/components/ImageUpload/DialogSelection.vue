<template>
    <q-dialog v-model="modal" position="bottom" @hide="closePopUp" class="responsive-modal" transition-hide="slide-down" transition-show="slide-up">

        <!-- Invisible File Upload -->
        <!-- <input type="file" disable @change="imageUpload" accept=".jpg,.jpeg,.png" ref="selectedFile" style="display:none;"> -->

        <!-- Selection -->
        <q-card style="border-top-left-radius:11px;border-top-right-radius:11px;" class="q-pb-lg">
            <q-card-section class="q-pb-xs">
                <q-btn flat class="full-width q-my-sm text-weight-medium" text-color="black" style="margin-top:8px" @click="onPhotoLibrary"><p  style="text-transform: none;">{{$t('choose.from.photo.library')}}</p></q-btn>
                <q-btn flat class="full-width q-my-sm text-weight-medium" text-color="black" style="margin-top:8px" @click="onPhotoCamera"><p  style="text-transform: none;">{{$t('take.a.photo')}}</p></q-btn>
                <div><q-separator/></div>
                <q-btn flat class="full-width q-my-md text-weight-bold" text-color="black" id="closeBtn" no-caps @click="closePopUp">{{$t('close')}}</q-btn>
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
      default: false,
      required: true
    }
  },
  data () {
    return {
      modal: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    }
  },
  created () {
    // adjust upload image url accordingly
    this.checkUploadUrl()
  },
  beforeDestroy () {
    this.$off('image-data')
  },
  mounted () {
    // TODO: centralized image upload through this component
    // this.$on('image-data', this.onImageUpload)
    // this.$on('image-info', this.onImageUploadSuccess)

    // listen to ImageUploadMixin callback (image processing)
    this.$on('image-data', this.onImageSelected)
  },
  methods: {
    onImageSelected (imageData) {
      this.$emit('on-selected', imageData.blob)
    },
    /**
     * Image uploaded success callback
     * @param {Filereader} rawData - encoded image data url
     * @param {JSON} mediaInfo - uploaded json encoded image data
     */
    onImageUploadSuccess (rawData, mediaInfo) {
      this.$emit('image-uploaded', rawData, mediaInfo)
    },
    checkUploadUrl () {
      switch (this.$route.name) {
        case 'IdentityVerification': this.imageUploadUrl = 'imageupload?type=identity'; break
        case 'Moments': this.imageUploadUrl = 'imageupload?type=moment'; break
        case 'Checkout':
        case 'ProductCheckout':
        case 'BankTransfer':
          this.imageUploadUrl = 'imageupload?type=banktransfer'
          break
        case 'ChatSupportEnquiry': this.imageUploadUrl = 'imageupload?type=helpdesk'; break
      }
    },
    onPhotoLibrary () {
      this.mediaSource = navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
      this.onFileSelection()
      this.closePopUp()
    },
    onPhotoCamera () {
      this.mediaSource = navigator.camera.PictureSourceType.CAMERA
      this.onFileSelection()
      this.closePopUp()
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
