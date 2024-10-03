<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" transition-show="slide-left" transition-hide="slide-right">
        <q-card>
            <q-toolbar style="z-index: 5000;" class="borderline fixed-top bg-white" :class="{'q-pt-xl': $q.platform.is.ios}">
                <q-btn flat dense v-close-popup icon="chevron_left" size="lg" class="q-pl-none"/>
                <q-toolbar-title v-close-popup >
                  <h6 class="q-my-none header-title">{{$t('reviews.title')}}</h6>
                </q-toolbar-title>
            </q-toolbar>

            <q-card-section class="q-pa-none q-my-xl q-pt-md" v-if="reviewInfo">
              <review-card v-for="index in (reviewInfo.reviewCount)" :key="index" :reviewInfo="reviewInfo" :showReply="$route.name === 'MobileDashboard'" :index="index"></review-card>
              <div class="col-xs-12 text-center" v-if="reviewInfo.items.length === 0">
                <img class="image-upload q-mt-md" :src="'statics/images/no_notification.png'" width="60%"/>
                <p class="text-center q-mt-md text-label font-normal">
                  {{$t('person.not.having.review')}}
                </p>
              </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script>
export default {
  components: {
    'review-card': () => import('components/Listing/reviewCards.vue')
  },
  props: {
    trigger: {
      required: true,
      type: Boolean
    },
    reviewInfo: {
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
  methods: {
    onClose () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
<style lang="stylus">
.header-title
  margin-left: 12%
  font-size: 18px

@media screen and (min-width: 320px)
  .header-title
    margin-left: 27%

@media screen and (min-width: 350px)
  .header-title
    margin-left: 32%

@media screen and (min-width: 370px)
  .header-title
    margin-left: 33%

@media screen and (min-width: 400px)
  .header-title
    margin-left: 33%

@media screen and (min-width: 530px)
  .header-title
    margin-left: 17%
</style>
