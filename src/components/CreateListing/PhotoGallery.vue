<template>
    <div class="row">
        <!-- Picture Cards -->
        <q-card v-for="(image, index) in media" :key="image.id" style="height:105px;max-height: 105px;width: 100%;max-width: 105px;" class="col-xs-3 q-ma-xs">
            <q-img :src="image.filePath || image.href"
              class="responsive uploaded-images"
              style="object-fit: cover;height: 100%;width: 100%;"
              v-if="image.contentType === 'image' || image.id "
              @click="showImage(index)"
            ><q-icon name="fas fa-times-circle" color="red" size="25px" class="q-pa-xs" @click="onRemove(index)" v-if="showDeleteOption"></q-icon></q-img>
        </q-card>

        <!-- Add Pictures -->
        <q-card style="height:105px;max-height: 105px;width: 100%;max-width: 105px;" class="col-xs-3 q-ma-xs" @click="onFileSelection('listing')">
            <q-card-section class="text-center">
                <div style="margin-top: 15%;">
                    <q-spinner v-if="loader" size="45px" color="primary"></q-spinner>
                    <q-icon name="fas fa-plus" size="45px" color="primary" class="text-center" v-else></q-icon>
                </div>
            </q-card-section>
        </q-card>
        <input type="file" disable @change="imageUpload" multiple accept=".jpg,.jpeg,.png" ref="selectedFile" style="display: none;">

        <!-- Light Box -->
        <LightBox
            v-if="lightBoxImages.length > 0"
            :media="lightBoxImages"
            ref="lightbox"
            :showThumbs="true"
            :show-caption="false"
            :show-light-box="false"
            style="z-index: 6000;"
        ></LightBox>
    </div>
</template>
<script>
require('vue-image-lightbox/dist/vue-image-lightbox.min.css')
import LightBox from 'vue-image-lightbox'
import ImageTools from 'assets/ImageTools.js'
import ImageUploadMixin from '../../mixins/imageUploadMixin.js'
export default {
  mixins: [ImageUploadMixin],
  components: {
    LightBox
  },
  props: {
    media: {
      type: Array
    },
    showDeleteOption: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loader: false,
      lightBoxImages: []
    }
  },
  mounted () {
    // listen to ImageUploadMixin callback (image processing)
    this.$on('image-data', this.uploadImageData)
    this.loadImage()
  },
  methods: {
    loadImage () {
      this.lightBoxImages = []
      for (let index in this.media) {
        this.lightBoxImages.push({
          'thumb': this.media[index].href || this.media[index].filePath,
          'src': this.media[index].href || this.media[index].filePath
        })
      }
    },
    uploadImageData (imageBlobData) {
      let vm = this
      this.loader = true
      let formData = new FormData()
      formData.append('imagefile', imageBlobData.blob, 'image.jpg')
      vm.$axios.post('imageupload', formData)
        .then((response) => {
          let mediaInfo = {
            'contentType': 'image',
            'fileName': response.data.imageName,
            'filePath': response.data.imagePath
          }
          vm.$emit('on-image-upload', mediaInfo)
        }).catch(e => {
          console.error(e)
          vm.$q.notify(e.response.data.message)
        }).finally(_ => {
          vm.loadImage()
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
      for (let index = 0; index < e.target.files.length; index++) {
        let image = e.target.files[index]
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
          vm.$axios.post('imageupload', formData)
            .then((response) => {
              let mediaInfo = {
                'contentType': 'image',
                'fileName': response.data.imageName,
                'filePath': response.data.imagePath
              }
              vm.$emit('on-image-upload', mediaInfo)
              vm.$q.notify('Image successfully uploaded!')
            }).catch(e => {
              console.error(e)
              vm.$q.notify(e.response.data.message)
            }).finally(_ => {
              vm.loadImage()
              vm.loader = false
            })
        })
      }
    },
    onRemove (index) {
      this.$emit('on-remove-image', index)
    },
    showImage (index) {
      if (!this.showDeleteOption) {
        this.$refs['lightbox'].showImage(index)
      }
    }
  }
}
</script>
