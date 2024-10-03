<template>
  <div class="row justify-center">
    <div class="col-12" v-if="messages !== null && messages !== 'NO CONTENT'">
      <q-infinite-scroll ref="infinite-scroll-job" class="animate-popup-down q-pb-lg q-mb-lg">
        <!-- Job Inbox Card -->
        <job-inbox-card v-for="(message, index) in messages" :index="index" :key="index" :message="message" :showEdit="enableEditMode" @on-read="onMessageOpen" @on-selected="onSelected" @on-deselected="onDeselect"></job-inbox-card>
        <template v-if="!emptyContent">
          <div class="row justify-center">
            <ComponentPreLoader></ComponentPreLoader>
          </div>
        </template>
      </q-infinite-scroll>
      <!-- <div class="q-mt-sm" >
        <q-pagination class="justify-center" v-if="bInitialized" @input="loadMoreMessages" v-model="pageCount" boundary-links direction-links color="primary" :max="maxMessagesPageCount" :max-pages="5"/>
      </div> -->
    </div>
    <div v-else-if="messages === 'NO CONTENT'" class="row full-width">
      <div class="col-12 q-pa-lg text-center">
        <h4 class="q-my-md"><b>{{$t('no.jobs.yet')}}</b></h4>
        <p class="text-center text-label font-normal" v-html="$t('create.first.listing.notified.here')"></p>
        <q-btn class="q-mb-md q-mt-md" outline color="primary" :label="$t('create.listing')" @click="toProfile"></q-btn>
      </div>
    </div>
    <div v-else>
      <ComponentPreLoader></ComponentPreLoader>
    </div>

    <!-- Prompt Dialog -->
    <dialog-prompt :trigger="promptModal" :type="typeCode" :message="promptMessage" :persistent="promptPersistant" :okButtonLabel="okBtnLabel" :cancelButtonLabel="canceblBtnLabel" @on-ok="onPromptOk" @on-cancel="onPromptCancel" @on-close="triggerPromptDialog"></dialog-prompt>
  </div>
</template>

<script>
import { debounce } from 'quasar'

export default {
  components: {
    'job-inbox-card': () => import('components/Inbox/JobInbox.vue'),
    'dialog-prompt': () => import('components/DialogPrompt.vue')
  },
  props: {
    showEdit: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data () {
    return {
      items: [{}, {}, {}, {}, {}],
      messages: null,
      bInitialized: false,
      pageCount: 2,
      loader: false,
      previousScroll: 0,
      emptyContent: false,
      enableEditMode: false,
      selectedMessage: [],
      selectedIndexMessage: [],
      promptModal: false,
      typeCode: 1,
      promptMessage: '',
      okBtnLabel: this.$t('ok'),
      canceblBtnLabel: this.$t('close'),
      promptPersistant: false
    }
  },
  watch: {
    showEdit (status) {
      this.checkEdit(status)
    }
  },
  created () {
    this.onScroll = debounce(this.onScroll, 150)
    console.log(this.$q.localStorage.getItem('jobsChatPages'))
  },
  mounted () {
    if (this.$refs['infinite-scroll-job']) {
      this.$refs['infinite-scroll-job'].stop()
    }
    if (this.$store.getters['cached/getJobsInboxFullCached']) {
      let getJobsInboxFullCached = JSON.parse(this.$store.getters['cached/getJobsInboxFullCached'])
      // console.log(getJobsInboxFullCached)
      if (getJobsInboxFullCached.index > 2) {
        let d = new Date()
        let time = d.getTime()
        // console.log(time - getJobsInboxFullCached.time)
        if (time - getJobsInboxFullCached.time <= 1000 * 60 * 2) {
          let index = getJobsInboxFullCached.index
          let scrollTop = getJobsInboxFullCached.scrollTop
          this.messages = getJobsInboxFullCached.messages
          // console.log(this.messages)
          document.documentElement.scrollTop = scrollTop
          this.pageCount = index + 1
        } else {
          this.getJobMessages()
          this.onScroll()
        }
      } else {
        this.getJobMessages()
        this.onScroll()
      }
    } else if (this.messages === null) {
      this.getJobMessages()
      this.onScroll()
    }

    window.addEventListener('scroll', this.onScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  },
  activated () {
    // window.scrollTo(0, 0)
    // setTimeout(this.getJobMessages, 1200)
  },
  deactivated () {
    this.enableEditMode = false
    this.selectedMessage = []
    this.selectedIndexMessage = []
    this.triggerPromptDialog(false)
  },
  methods: {
    onMessageOpen (index) {
      this.messages[index].read = 1
      this.$store.dispatch('cached/cacheJobsInbox', this.messages)
    },
    triggerPromptDialog (status, message = '', okLabel = null, cancelLabel = null, typeCode = 0, persistent = false) {
      this.promptMessage = message
      this.okBtnLabel = okLabel
      this.canceblBtnLabel = cancelLabel
      this.promptPersistant = persistent
      this.typeCode = typeCode
      this.promptModal = status
    },
    onPromptOk (type) {
      this.archivedJobMessages()
    },
    onPromptCancel () {
      this.enableEditMode = false
      this.selectedMessage = []
      this.selectedIndexMessage = []
    },
    archivedJobMessages () {
      let payload = {
        'messageInfo': {
          'id': this.selectedMessage
        }
      }

      this.$q.loading.show({spinnerColor: 'primary', backgroundColor: 'white'})
      this.$axios.post(`/users/${this.$store.state.user.uuid}/taskinbox`, payload, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        // sort delement in desc order
        this.selectedIndexMessage.sort((a, b) => b - a)

        // remove deleted items
        for (let index in this.selectedIndexMessage) {
          this.messages.splice(this.selectedIndexMessage[index], 1)
        }
      }).catch(error => {
        console.error(error)
      }).finally(_ => {
        this.selectedMessage = []
        this.selectedIndexMessage = []
        this.enableEditMode = false

        // cache jobs messages
        if ((JSON.stringify(this.$store.getters['cached/getJobsInboxCached']) !== JSON.stringify(this.messages))) {
          this.$store.dispatch('cached/cacheJobsInbox', this.messages)
        }

        this.$q.loading.hide()
      })
    },
    checkEdit (status) {
      if (status === false && this.selectedMessage.length > 0) {
        this.triggerPromptDialog(true, this.$t('archived.multiple.inbox.messages'), this.$t('delete'), this.$t('chat.later'), 1, true)
      } else {
        this.enableEditMode = status
        this.selectedMessage = []
        this.selectedIndexMessage = []
      }
    },
    onSelected (inboxId, index) {
      this.selectedMessage.push(inboxId)
      this.selectedIndexMessage.push(index)
    },
    onDeselect (inboxId) {
      let index = this.selectedMessage.indexOf(inboxId)
      if (index > -1) {
        this.selectedMessage.splice(index, 1)
        this.selectedIndexMessage.splice(index, 1)
      }
    },
    onScroll (info) {
      this.previousScroll = document.documentElement.scrollTop

      if (this.$store.getters['user/getMessageTabIndex'] === 'tab-jobs' && this.$route.name === 'Messages') {
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 150) && this.loader === false && this.emptyContent === false) {
          this.loadMoreMessages(this.pageCount++)
        }
      }
    },
    toProfile () {
      if (this.$q.platform.is.mobile) {
        this.$store.commit('user/updateUserCurrentMobileTab', 'navbar.profile')
        this.$router.replace({name: 'MobileDashboard', query: {createListing: 1}})
      } else {
        this.$router.push({name: 'Profile', query: {createListing: 1}})
      }
    },
    openDownloadTab () {
      this.openUrl(this.$t('petbacker.app.link'))
    },
    async loadMoreMessages (index) {
      this.loader = true
      this.$axios.get(`/users/${this.$store.state.user.uuid}/taskinbox?page=${index}&per_page=20`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status !== 204) {
          if (this.messages === null) this.messages = []
          this.messages = this.messages.concat(response.data.taskInbox.items)
          let d = new Date()
          let time = d.getTime()
          let cacheJobsInboxFull = JSON.stringify({messages: this.messages, time: time, index: index, scrollTop: this.previousScroll})
          this.$store.dispatch('cached/cacheJobsInboxFull', cacheJobsInboxFull)
          // this.$q.localStorage.set('jobsChatPages', {time: time, index: index, scrollTop: this.previousScroll})
          for (let messageUser in response.data.taskInbox.items) {
            this.$store.dispatch('chat/insertMessageUser', response.data.taskInbox.items[messageUser].userInfo).then((result) => {
              //  console.log(result)
            }).catch((error) => {
              console.error(error)
            })
          }
        } else {
          this.emptyContent = true
        }
      }).catch(error => {
        console.error(error)
      }).finally(_ => {
        this.loader = false
      })
    },
    async getJobMessages () {
      // cache job messages
      if (this.$store.getters['cached/getJobsInboxCached'] && this.messages === null) {
        this.messages = this.$store.getters['cached/getJobsInboxCached']
      }
      // console.log(this.messages)

      this.$axios.get(`users/${this.$store.state.user.uuid}/taskinbox?page=1&per_page=20`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        if (response.data === '') {
          this.messages = 'NO CONTENT'
        } else {
          if (this.messages === null || this.messages.length === 20) {
            this.messages = response.data.taskInbox.items
          }

          if (this.$q.platform.is.cordova) {
            for (let messageUser in response.data.taskInbox.items) {
              this.$store.dispatch('chat/insertMessageUser', response.data.taskInbox.items[messageUser].userInfo).then((result) => {
                //  console.log(result)
              }).catch((error) => {
                console.error(error)
              })
            }
          }

          // cache jobs messages
          if (!this.$store.getters['cached/getJobsInboxCached'] || (JSON.stringify(this.$store.getters['cached/getJobsInboxCached']) !== JSON.stringify(response.data.taskInbox.items))) {
            this.$store.dispatch('cached/cacheJobsInbox', response.data.taskInbox.items)
          }
        }
      }).catch(error => {
        console.error(error)
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.items
  padding-bottom: 12px
</style>
