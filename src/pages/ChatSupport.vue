<template>
  <q-page class="margin-auto" :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}">
   <div class="row justify-center" v-if="accessDenied">
      <div>
        <h4>{{messageInfo.text}}</h4>
      </div>
    </div>
    <div class="row" v-if="messageInfo !== null ">
      <div class="col-md-12 gt-xs" v-if="$q.platform.is.desktop">
        <chat-support-content class="gt-xs" :messageInfo="messageInfo" @sendMessage="getMessageInfo" @sendImage="getMessageInfo"></chat-support-content>
      </div>
      <div class="col-xs-12 lt-md q-pr-sm" v-else-if="$q.platform.is.mobile">
        <chat-support-content-small :messageInfo="messageInfo" @on-continue-query="onContinueQuery" @on-resolved="onResolved" @sendMessage="getMessageInfo" @sendImage="getMessageInfo"></chat-support-content-small>
      </div>
    </div>
    <div class="row justify-center" v-else>
      <div>
        <ComponentPreLoader></ComponentPreLoader>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  components: {
    'chat-support-content': () => import('components/ChatSupportContent'),
    'chat-support-content-small': () => import('components/ChatSupportContentSmall')
  },
  data () {
    return {
      messageInfo: null,
      chatInterval: null,
      notified: false,
      userId: '',
      accessDenied: false
    }
  },
  created () {
    this.$store.commit('user/updateUserFooterVisibilityState', false)
    this.checkAdminLogin()
    this.getMessageInfo()
    this.chatInterval = setInterval(this.getMessageInfo, 5000)
  },
  mounted () {
    this.$store.commit('user/updateUnreadSupportMessage', 0)
  },
  beforeDestroy () {
    this.$store.commit('user/updateUserFooterVisibilityState', true)
    clearInterval(this.chatInterval)
  },
  methods: {
    onResolved (info) {
      this.messageInfo.ticketStatus = info.status
      this.messageInfo.ticketArchived = info.isArchived
    },
    onContinueQuery (info) {
      this.messageInfo.ticketStatus = info.status
    },
    checkAdminLogin () {
      if (this.$route.params.userId) {
        this.$store.commit('user/updateUserAdminState', true)

        // check for full screen query
        if (this.$route.query.fullscreen) {
          switch (this.$route.query.fullscreen) {
            case '1': this.$store.commit('user/updateUserNavbarVisibilityState', false); break
            case '0': this.$store.commit('user/updateUserNavbarVisibilityState', true); break
          }
        }
      }
    },
    getMessageInfo () {
      if (this.notified) {
        return
      } else if (navigator.onLine) {
        this.notified = false
      }

      if (this.$route.params.userId) {
        // CS to User
        this.$axios.get(`/users/f2790e1e-98d7-11e6-9df5-42010af00a14/support/${this.$route.params.userId}?page=1&per_page=40&ticket_id=${this.$route.params.ticketId}`, {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          this.messageInfo = response.data.messageInfo
          let clientWidth = document.documentElement.clientWidth
          if (clientWidth < 558) {
            this.messageInfo.items = this.messageInfo.items.reverse()
          } else {
            this.messageInfo.items = this.messageInfo.items
          }
        }).catch((error) => {
          this.messageInfo = {}
          console.log(error)
          this.forceLogout(error)

          // user did not chat with support before
          if (error.response.data.status === 403 || error.response.data.status === 401) {
            this.$q.notify({
              message: error.response.data.message
            })
            this.accessDenied = true
            this.messageInfo.text = error.response.data.message
            clearInterval(this.chatInterval)
          }

          if (error.response.data.status === 404) {
            clearInterval(this.chatInterval)
          }
        })
      } else {
        // User to CS
        this.$axios.get(`/users/${this.$store.state.user.uuid}/support?page=1&per_page=35&ticket_id=${this.$route.params.ticketId}`, {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          this.messageInfo = response.data.messageInfo
          let clientWidth = document.documentElement.clientWidth
          if (clientWidth < 558) {
            this.messageInfo.items = this.messageInfo.items.reverse()
          } else {
            this.messageInfo.items = this.messageInfo.items
          }
        }).catch(error => {
          this.messageInfo = {}
          console.log(error)
          this.forceLogout(error)
          if (navigator.onLine === false) {
            if (this.notified === false) {
              let noInternet = this.$t('no.internet')
              this.$q.notify({
                message: noInternet,
                type: 'negative'
              })
              this.notified = true
            }
          }

          if (error.response.data.status === 404) {
            clearInterval(this.chatInterval)
          }
        })
      }
    }
  }
}
</script>
