<template>
  <div class="request-help">
    <q-carousel
      v-model="slide"
      transition-prev="jump-right"
      transition-next="jump-left"
      swipeable
      animated
      control-color="primary"
      control-type="flat"
      navigation-icon="radio_button_unchecked"
      navigation-active-icon="circle"
      navigation
      :height="`${$q.screen.height * 0.85}px`"
      class=""
    >
      <q-carousel-slide v-for="(step, index) in requestSteps" :name="index" :key="index" class="q-pa-none">
        <q-img :src="step.img" :style="`height: ${$q.screen.height * 0.47}px`"></q-img>
        <div class="text-center title-text q-mt-md q-pa-sm">
          <h4>{{index + 1}}</h4>
          {{ step.title }}
        </div>
        <p class="text-center description-text q-mt-md q-pa-sm">
          {{ step.description }}
        </p>
      </q-carousel-slide>
    </q-carousel>
    <!-- Bottom buttons fixed -->
    <div class="fixed-bottom bg-white z999">
    <div class="row">
        <q-btn class="col-xs-6 q-py-md z999" size="md" style="border-radius: 0px;" :ripple="false" :label="buttonLeftText" color="primary" @click="onLeftBtnClick"></q-btn>
        <q-btn class="col-xs-6 q-py-md z999" size="md" style="border-radius: 0px;" :ripple="false" :label="buttonRightText" color="primary" @click="onRightBtnClick"></q-btn>
    </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      slide: 0,
      requestSteps: [
        {'img': 'statics/images/request-steps/1-select-service-en.jpg', 'title': this.$t('request.disclaimer.title.step1'), 'description': this.$t('request.disclaimer.description.step1')},
        {'img': 'statics/images/request-steps/2-select-service-en.jpg', 'title': this.$t('request.disclaimer.title.step2'), 'description': this.$t('request.disclaimer.description.step2')},
        {'img': 'statics/images/request-steps/3-get-quotes-en.jpg', 'title': this.$t('request.disclaimer.title.step3'), 'description': this.$t('request.disclaimer.description.step3')},
        {'img': 'statics/images/request-steps/4-check-listing-profile-en.jpg', 'title': this.$t('request.disclaimer.title.step4'), 'description': this.$t('request.disclaimer.description.step4')},
        {'img': 'statics/images/request-steps/5-chat-with-listing-en.jpg', 'title': this.$t('request.disclaimer.title.step5'), 'description': this.$t('request.disclaimer.description.step5')},
        {'img': 'statics/images/request-steps/6-chat-and-negotiate-en.jpg', 'title': this.$t('request.disclaimer.title.step6'), 'description': this.$t('request.disclaimer.description.step6')},
        {'img': 'statics/images/request-steps/7-make-payment-en.jpg', 'title': this.$t('request.disclaimer.title.step7'), 'description': this.$t('request.disclaimer.description.step7')},
        {'img': 'statics/images/request-steps/8-leave-review-en.jpg', 'title': this.$t('request.disclaimer.title.step8'), 'description': this.$t('request.disclaimer.description.step8')}
      ],
      buttonLeftText: 'FAQ',
      buttonRightText: this.$t('button.next')
    }
  },
  watch: {
    // detect language change
    slide (currentSlide, oldSlide) {
      if (currentSlide === 7) {
        this.buttonRightText = this.$t('i.understand')
      } else {
        this.buttonRightText = this.$t('button.next')
      }
    }
  },
  methods: {
    onLeftBtnClick () {
      this.$router.push({name: 'HelpCenter'})
    },
    onRightBtnClick () {
      if (this.slide === 7) {
        this.$router.go(-1)
      } else {
        this.slide++
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.title-text
  font-size: 20px
  color: #40bbc7
  text-align: center
  width: 100%
  font-weight: bold
.title-text h4
  font-weight: bold
  margin: 5px
.description-text
  font-weight: bold
  font-size: 16px
  color: #999
</style>
