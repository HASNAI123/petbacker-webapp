<template>
  <div>
    <request-viewer
    :request="this.request"
    :requestQuestionLists="this.questionLists"
    :serviceStart="this.serviceStart"
    :disableEdit="this.disableEdit"
    v-if="this.request !== null">
    </request-viewer>
    <div v-else class="row justify-center q-py-lg">
      <ComponentPreLoader></ComponentPreLoader>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  components: {
    'request-viewer': () => import('components/RequestView.vue')
  },
  data () {
    return {
      questionLists: null,
      serviceStart: moment(),
      request: null,
      disableEdit: false
    }
  },
  created () {
    if (this.$route.name === 'ViewRequest') {
      this.getRequest()
    } else if (this.$route.name === 'ViewJob') {
      this.getTask()
    }
  },
  methods: {
    getRequest () {
      this.$axios.get('users/' + this.$store.state.user.uuid + '/requests/' + this.$route.params.requestId, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.request = response.data
        this.questionLists = JSON.parse(this.request.requestInfo.requestDescriptionJson.replace('\\', '')).question
        this.serviceStart = moment(this.request.requestInfo.requiredTime).format('DD/MM/YYYY')

        if (this.request.requestInfo.status !== 0) {
          this.disableEdit = true
        }
      }).catch((error) => {
        this.forceLogout(error)
        console.error(error)
      })
    },
    getTask () {
      this.disableEdit = true
      this.$axios.get('users/' + this.$store.state.user.uuid + '/tasks/' + this.$route.params.taskId, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.request = response.data.taskInfo
        this.questionLists = JSON.parse(this.request.requestInfo.requestDescriptionJson.replace('\\', '')).question
        this.serviceStart = moment(this.request.requestInfo.requiredTime).format('DD/MM/YYYY')
      }).catch((error) => {
        this.forceLogout(error)
        console.log(error)
      })
    }
  }
}
</script>
