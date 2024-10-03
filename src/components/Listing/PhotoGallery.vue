<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" :transition-show="$q.platform.is.mobile ? 'slide-left' : 'none'" :transition-hide="$q.platform.is.mobile ? 'slide-right' : 'none'">
        <q-card>
            <q-toolbar style="z-index: 5000;" class="fixed-top borderline bg-white" :class="{'q-pt-xl': $q.platform.is.cordova}">
                <q-btn flat dense v-close-popup icon="chevron_left" size="lg"></q-btn>
                <q-toolbar-title v-close-popup >
                    <h6 class="q-my-none" style="margin-left: 22%;">{{$t('photo.gallery.title')}}</h6>
                </q-toolbar-title>
            </q-toolbar>

            <q-card-section class="row justify-center q-px-xs q-my-lg">
                <!-- Picture Cards -->
                <div v-if="images" class="q-my-md">
                    <div>
                        <div class="row justify-evenly">
                            <q-card class="col-5 q-mb-sm photo-gallery-card"  flat v-for="(image, index) in images" :key="image.id">
                                <q-img :src="image.href" class="responsive image-upload" placeholder-src="statics/images/graphic-placeholder.jpg" style="height: 100%;width: 100%;" @click="showImage(index)"></q-img>
                            </q-card>
                        </div>
                    </div>
                </div>
            </q-card-section>
        </q-card>

        <!-- Light Box -->
        <LightBox
            v-if="lightBoxImages.length > 0"
            :media="lightBoxImages"
            ref="lightbox-gallery"
            :showThumbs="true"
            :show-caption="false"
            :show-light-box="false"
            style="z-index: 6000;"
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
    images: {
      type: Array,
      required: true
    },
    trigger: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      lightBoxImages: []
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    },
    images (value) {
      this.loadImage()
    }
  },
  methods: {
    loadImage () {
      for (let index in this.images) {
        this.lightBoxImages.push({
          'thumb': this.images[index].href,
          'src': this.images[index].href
        })
      }
    },
    showImage (index) {
      if (this.lightBoxImages.length === 0) {
        this.loadImages()
      }

      this.$refs['lightbox-gallery'].showImage(index)
    },
    onClose () {
      this.$emit('on-close', false)
    }
  }
}
</script>
<style lang="stylus">
.photo-gallery-card
 width: 155px

@media only screen and (min-width: 320px)
  .photo-gallery-card
    width: 144px !important

@media only screen and (min-width: 350px)
  .photo-gallery-card
    width: 163px !important

@media only screen and (min-width: 370px)
  .photo-gallery-card
    width: 171px !important

@media only screen and (min-width: 410px)
  .photo-gallery-card
    width: 189px !important
</style>
