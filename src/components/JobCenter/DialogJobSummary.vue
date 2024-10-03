<template>
  <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
    <q-card class="bg-white" v-touch-pan.right.prevent.mouse="onSwipeRight">
        <!-- Header -->
        <q-toolbar style="border-bottom: 1px solid lightgrey;z-index: 6000;" class="fixed-top bg-white">
          <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
          <q-toolbar-title v-close-popup>
            <h6 class="q-my-none job-summary-header">{{$t('job.summary')}}</h6>
          </q-toolbar-title>
        </q-toolbar>

        <q-card-section v-if="taskInfo" class="bg-white q-pa-none q-pt-xl scroll">
          <job-details :responseInfo="taskInfo" :requestInfo="taskInfo.requestInfo" :mapData="mapImage" @map-image-url="cacheMapImageUrl" @on-first-quote="onRefreshJobInfo" @on-decline-job="onDeclineJob"></job-details>
          <prompt-scroll-down class="job-summary-dialog-page" v-if="taskInfo.acceptanceStatus === 0"></prompt-scroll-down>
        </q-card-section>
        <q-card-section v-else class="text-center q-mt-xl q-pt-lg">
          <ComponentPreLoader></ComponentPreLoader>
        </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  components: {
    'job-details': () => import('components/QuoteDetail.vue'),
    'prompt-scroll-down': () => import('components/PromptScrollDown.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    taskId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      taskInfo: null,
      modal: false,
      mapImage: null
    }
  },
  watch: {
    trigger (value) {
      this.modal = value

      if (value) {
        this.getTaskInfo()
      }
    }
  },
  methods: {
    cacheMapImageUrl (data) {
      this.mapImage = data
    },
    onRefreshJobInfo () {
      // refresh job card status to 1
      this.$emit('on-refresh', 1)
    },
    onDeclineJob () {
      this.$emit('on-decline')
    },
    onSwipeRight ({ evt, ...info }) {
      if (info.direction === 'right' && info.offset.x > 100) {
        this.closePopUp()
      }
    },
    refresh () {
      this.getTaskInfo()
    },
    getTaskInfo () {
      this.$axios.get(`users/${this.$store.getters['user/getUserUuidState']}/tasks/${this.taskId}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.taskInfo = response.data.taskInfo
        this.$emit('on-loaded', response.data.taskInfo)
      }).catch((error) => {
        console.error(error)
        let errorMessage = error.response.data ? error.response.data.message : this.$t('something.wrong.gateway')
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      }).finally(_ => {
        this.$emit('on-open')
      })
    },
    closePopUp () {
      this.$emit('on-close', false)
    }
  }
}
</script>
<style lang="stylus">
.job-summary-dialog-page.arrow-container
  bottom: 67px !important
@media screen and (min-width: 320px)
  .job-summary-header
    margin-left: 16%

@media screen and (min-width: 350px)
  .job-summary-header
    margin-left: 19%

@media screen and (min-width: 370px)
  .job-summary-header
    margin-left: 22%

@media screen and (min-width: 400px)
  .job-summary-header
    margin-left: 25%

@media screen and (min-width: 530px)
  .job-summary-header
    margin-left: 17%
</style>
