<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" :persistent="$q.platform.is.mobile" :transition-show="$q.platform.is.mobile ? 'slide-left' : 'none'" :transition-hide="$q.platform.is.mobile ? 'slide-right' : 'none'">
        <q-card>
            <q-toolbar style="z-index: 5000;" class="borderline fixed-top bg-white">
                <q-btn flat dense v-close-popup icon="keyboard_arrow_left" size="1.3em"></q-btn>
                <q-toolbar-title v-close-popup >
                  <h6 class="q-my-none header-title" style="margin-left: 23%;">{{$t('uploaded.photos')}}</h6>
                </q-toolbar-title>
                <div v-if="!disableUpload">
                  <q-btn flat dense label="Edit" :ripple="false" @click="onEdit" v-if="!showDeleteOption"></q-btn>
                  <q-btn flat dense label="Done" :ripple="false" @click="showDeleteOption = false" v-else></q-btn>
                </div>
            </q-toolbar>

            <q-card-section class="row justify-center q-px-sm q-mt-xl">
                <!-- Picture Cards -->
                <q-card v-for="(image, index) in media" :key="image.id" style="height:105px;max-height: 105px;width: 100%;max-width: 105px;" class="col-xs-3 q-ma-xs">
                    <q-img :src="image.filePath"
                      class="responsive uploaded-images"
                      style="object-fit: cover;height: 100%;width: 100%;"
                      v-if="image.contentType === 'image'"
                      @click="showImage(index)"
                    ><q-icon name="fas fa-times-circle" color="red" size="25px" class="q-pa-sm" @click="onRemove(index)" v-if="showDeleteOption"></q-icon></q-img>
                </q-card>

                <!-- Add Pictures -->
                <q-card style="height:105px;max-height: 105px;width: 100%;max-width: 105px;" class="col-xs-3 q-ma-xs" v-if="!disableUpload" @click="onUpload">
                    <q-card-section class="text-center" style="margin-top: 11%;">
                      <q-spinner v-if="loader" size="45px" color="primary"></q-spinner>
                      <q-icon name="fas fa-plus" size="45px" color="primary" class="text-center" v-else></q-icon>
                    </q-card-section>
                </q-card>
            </q-card-section>
        </q-card>

        <!-- Light Box -->
        <LightBox
            v-if="lightBoxImages.length > 0"
            :media="lightBoxImages"
            ref="lightbox"
            :showThumbs="true"
            :show-caption="false"
            :show-light-box="false"
            style="z-index: 9000;"
        ></LightBox>
    </q-dialog>
</template>
<script>
require('vue-image-lightbox/dist/vue-image-lightbox.min.css')
import LightBox from 'vue-image-lightbox'
export default {
  components: {
    LightBox
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    disableUpload: {
      type: Boolean,
      default: false
    },
    media: {
      type: Array
    }
  },
  data () {
    return {
      modal: false,
      lightBoxImages: [],
      loader: false,
      showDeleteOption: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)
    }
  },
  methods: {
    onRemove (index) {
      this.$emit('on-remove', index)
    },
    onEdit () {
      this.showDeleteOption = true
    },
    updateLoader (value) {
      this.loader = value
    },
    loadImage () {
      this.lightBoxImages = []
      for (let index in this.media) {
        this.lightBoxImages.push({
          'thumb': this.media[index].filePath,
          'src': this.media[index].filePath
        })
      }
    },
    showImage (index) {
      if (!this.showDeleteOption) {
        this.$refs.lightbox.showImage(index)
      }
    },
    onClose () {
      this.showDeleteOption = false
      this.$emit('on-close', false)
    },
    onUpload () {
      this.$emit('on-upload')
    }
  }
}
</script>
<style lang="stylus">
.uploaded-images
  object-fit: cover

.header-title
  margin-left: 12%
  font-size: 18px

@media screen and (min-width: 320px)
  .header-title
    margin-left: 16%

@media screen and (min-width: 350px)
  .header-title
    margin-left: 22%

@media screen and (min-width: 370px)
  .header-title
    margin-left: 24%

@media screen and (min-width: 400px)
  .header-title
    margin-left: 26%

@media screen and (min-width: 530px)
  .header-title
    margin-left: 17%
</style>
