<template>
  <q-page class="margin-auto" :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}">
    <div v-if="taskInfo">
      <job-details :responseInfo="taskInfo" :requestInfo="taskInfo.requestInfo"></job-details>
      <prompt-scroll-down v-if="taskInfo.acceptanceStatus === 0"></prompt-scroll-down>
    </div>
    <div v-else class="text-center">
      <ComponentPreLoader></ComponentPreLoader>
    </div>
  </q-page>
</template>
<script>
export default {
  components: {
    'job-details': () => import('components/QuoteDetail.vue'),
    'prompt-scroll-down': () => import('components/PromptScrollDown.vue')
  },
  data () {
    return {
      taskInfo: null
    }
  },
  created () {
    this.getTaskInfo()
  },
  methods: {
    getJobs () {
      this.$axios.get(`users/${this.$store.getters['user/getUserUuidState']}/tasks?page=1&per_page=20`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status !== 204) {
          // update cache
          this.$store.dispatch('cached/cacheJobs', response.data.taskInfo.items)
        }
      }).catch((error) => {
        this.forceLogout(error)
        console.error(error)
      })
    },
    getTaskInfo () {
      this.$axios.get(`users/${this.$store.getters['user/getUserUuidState']}/tasks/${this.$route.params.taskId}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.taskInfo = response.data.taskInfo
        this.getJobs()
      }).catch((error) => {
        console.error(error)
        let errorMessage = error.response.data ? error.response.data.message : this.$t('something.wrong.gateway')
        this.$q.notify({
          message: errorMessage,
          type: 'negative',
          position: 'top'
        })
        this.forceLogout(error)
      })
    }
  }
}
</script>
