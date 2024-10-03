<template>
    <div class="col-md-12 col-xs-12" style="position: relative;">
        <q-carousel
        swipeable
        v-model="slider"
        :arrows="carouselImages ? carouselImages.length > 1 : false"
        :navigation="carouselImages ? carouselImages.length > 1 : false"
        keep-alive
        :keep-alive-max="6"
        transition-prev="slide-right"
        transition-next="slide-left"
        animated
        padding
        style="height: 400px;max-height: 420px;"
        class="bg-grey-4">
            <q-carousel-slide v-for="(image, index) in carouselImages" :key="image.id" :name="index" style="padding: 0px;">
                <q-img class="responsive image-upload" placeholder-src="statics/images/graphic-placeholder.jpg" height="400px" width="100%" :src="image.full || image.href" style="margin: none;"></q-img>
            </q-carousel-slide>
        </q-carousel>

        <!-- upload photo button (called onUpload to upload photos)-->
        <q-btn @click="triggerGalleryModal(true)" color="rgba(200,200,200,0.5)" class="text-capitalize" style="margin-top: 15px;margin-right: 15px;position: absolute;background-color: rgba(200,200,200,0.6);top: 0;right: 0;border-radius: 6px">
            <span class="text-weight-bold text-18" style="color: #FFFFFF;">{{$t('view.photos')}}</span>
        </q-btn>

        <!-- Photo Gallery -->
        <dialog-gallery :trigger="galleryModal" :images="images" @on-close="triggerGalleryModal"></dialog-gallery>

        <slot name="dialog-gallery-edit"></slot>
    </div>
</template>
<script>
export default {
  components: {
    'dialog-gallery': () => import('components/Listing/PhotoGallery.vue')
  },
  props: {
    carouselImages: {
      required: true
    },
    images: {
      required: true
    }
  },
  data () {
    return {
      slider: 0,
      galleryModal: false
    }
  },
  methods: {
    resetSlider () {
      this.slider = 0
    },
    triggerGalleryModal (status) {
      if (this.$route.name === 'EditListing') {
        this.$emit('trigger-gallery', status)
      } else {
        this.galleryModal = status
      }
    }
  }
}
</script>
