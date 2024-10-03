<template>
  <div class="justify-center">
    <div v-if="messages !== null && messages !== 'NO CONTENT'">
      <q-infinite-scroll style="max-height: 100%;" class="animate-popup-down q-pb-lg q-mb-lg">
        <!-- Request Inbox Card -->
        <request-inbox-card v-for="(message, index) in messages" :index="index" :key="message.id" :message="message" :showEdit="enableEditMode" @on-read="onMessageOpen" @on-selected="onSelected" @on-deselected="onDeselect"></request-inbox-card>
        <template v-if="loader">
          <div class="row justify-center">
            <ComponentPreLoader></ComponentPreLoader>
          </div>
        </template>
      </q-infinite-scroll>
    </div>
    <div v-else-if="messages === 'NO CONTENT'" class="row full-width">
      <div class="q-pa-lg text-center margin-auto">
        <h4 class="q-my-md"><b>{{ $t('inbox.page.nomessagesyet') }}</b></h4>
        <p class="text-center text-label font-normal">{{ $t('inbox.page.youseetheirmessage') }}</p>
        <q-btn class="q-my-md" color="primary" outline :label="$t('requests.page.makerequest')" @click="triggerServicesModal(true)"/>
      </div>
    </div>
    <div v-else class="text-center">
      <ComponentPreLoader></ComponentPreLoader>
    </div>

    <!-- Prompt Dialog -->
    <dialog-prompt :trigger="promptModal" :type="typeCode" :message="promptMessage" :persistent="promptPersistant" :okButtonLabel="okBtnLabel" :cancelButtonLabel="canceblBtnLabel" @on-ok="onPromptOk" @on-cancel="onPromptCancel" @on-close="triggerPromptDialog"></dialog-prompt>

    <!-- More Services Dialog -->
    <dialog-services v-if="messages === 'NO CONTENT'" :trigger="servicesModal" @on-close="triggerServicesModal"></dialog-services>
  </div>
</template>

<script>
import { debounce } from 'quasar'

export default {
  components: {
    'dialog-services': () => import('components/DialogServices.vue'),
    'request-inbox-card': () => import('components/Inbox/RequestInbox.vue'),
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
      messages: null,
      bInitialized: false,
      pageCount: 2,
      loader: false,
      previousScroll: 0,
      emptyContent: false,
      servicesModal: false,
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
  },
  mounted () {
    if (this.$refs['infinite-scroll']) {
      this.$refs['infinite-scroll'].stop()
    }

    if (this.messages === null) {
      this.getMessages()
    }
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  },
  activated () {
    window.scrollTo(0, 0)
    setTimeout(this.getMessages, 1200)
    window.addEventListener('scroll', this.onScroll)
  },
  deactivated () {
    window.removeEventListener('scroll', this.onScroll)

    this.enableEditMode = false
    this.selectedMessage = []
    this.selectedIndexMessage = []
    this.triggerPromptDialog(false)
  },
  methods: {
    onMessageOpen (index) {
      this.messages[index].read = 1
      this.$store.dispatch('cached/cacheRequestsInbox', this.messages)
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
      this.archivedRequestMessages()
    },
    onPromptCancel () {
      this.enableEditMode = false
      this.selectedMessage = []
      this.selectedIndexMessage = []
    },
    archivedRequestMessages () {
      let payload = {
        'messageInfo': {
          'id': this.selectedMessage
        }
      }

      this.$q.loading.show({spinnerColor: 'primary', backgroundColor: 'white'})
      this.$axios.post(`/users/${this.$store.state.user.uuid}/requestinbox`, payload, {
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

        // cache request messages
        if (JSON.stringify(this.$store.getters['cached/getRequestsInboxCached']) !== JSON.stringify(this.messages)) {
          this.$store.dispatch('cached/cacheRequestsInbox', this.messages)
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
    triggerServicesModal (status) {
      this.servicesModal = status
    },
    onScroll (info) {
      this.previousScroll = document.documentElement.scrollTop

      if (this.$store.getters['user/getMessageTabIndex'] === 'tab-requests' && this.$route.name === 'Messages') {
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 100) && this.loader === false && this.emptyContent === false) {
          this.loadMoreMessages()
        }
      }
    },
    getMessages () {
      // cache request messages
      if (this.$store.getters['cached/getRequestsInboxCached']) {
        this.messages = this.$store.getters['cached/getRequestsInboxCached']
      }

      this.$axios.get(`users/${this.$store.state.user.uuid}/requestinbox?page=1&per_page=20`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        if (response.data === '') {
          this.messages = 'NO CONTENT'
        } else {
          this.messages = response.data.requestInbox.items

          if (this.$q.platform.is.cordova) {
            for (let messageUser in response.data.requestInbox.items) {
              this.$store.dispatch('chat/insertMessageUser', response.data.requestInbox.items[messageUser].userInfo).catch((error) => {
                console.error(error)
              })
            }
          }

          // cache request messages
          if (!this.$store.getters['cached/getRequestsInboxCached'] || (JSON.stringify(this.$store.getters['cached/getRequestsInboxCached']) !== JSON.stringify(response.data.requestInbox.items))) {
            this.$store.dispatch('cached/cacheRequestsInbox', response.data.requestInbox.items)
          }
        }
      }).catch(error => {
        console.error(error)
        if (error.message === 'Network Error') {
          console.log('network error')
        }
      })
    },
    loadMoreMessages () {
      this.loader = true
      this.$axios.get(`/users/${this.$store.state.user.uuid}/requestinbox?page=${this.pageCount++}&per_page=20`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status !== 204) {
          this.messages = this.messages.concat(response.data.requestInbox.items)
        } else {
          this.emptyContent = true
        }
      }).catch(error => {
        console.error(error)
      }).finally(_ => {
        this.loader = false
      })
    },
    goToChat (href) {
      let splitLink = href.split('/')
      this.$store.commit('user/decreaseUserUnreadMessageState')
      this.$router.push('/chat/request/' + splitLink[4] + '/response/' + splitLink[6])
    },
    parseHumanReadableDate (date) {
      return date
    }
  }
}
</script>
<style lang="stylus" scoped>
.items
  padding-bottom: 12px
</style>
