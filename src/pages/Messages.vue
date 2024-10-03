<template>
  <q-page class="row justify-center">
    <div class="col-12" style="max-width: 1030px;">
      <q-tabs v-model="selectedTab" dense class="text-grey fixed-top bg-white" style="z-index:2000;border-bottom: 1px solid lightgrey;" ref="top-bar-header" :align="$q.platform.is.desktop ? 'left' : 'justify'" active-color="primary" animated>
        <q-tab default class="text-capitalize" name="tab-requests" :label="$t('message.requests')">
          <span v-if="$store.getters['user/getUnreadRequestMessageCount'] > 0" class="notification-dot" style="right: -10px;top: 0px;"></span>
        </q-tab>
        <q-tab class="text-capitalize" name="tab-jobs" :label="$t('mobile.navbar.jobs')">
          <span v-if="$store.getters['user/getUnreadJobsMessageCount'] > 0" class="notification-dot" style="right: -10px;top: 0px;"></span>
        </q-tab>
        <q-tab class="text-capitalize" name="tab-notifications" :label="$t('message.notifications')">
          <span v-if="$store.getters['user/getUnreadNotificationsCount'] > 0" class="notification-dot" style="right: -10px;top: 0px;"></span>
        </q-tab>
      </q-tabs>

      <q-tab-panels v-model="selectedTab" swipeable keep-alive :keep-alive-max="3" animated ref="tab" class="q-mb-lg">
        <q-tab-panel name="tab-requests" class="panel">
          <message-inbox :showEdit="showDeleteOption"></message-inbox>
        </q-tab-panel>
        <q-tab-panel name="tab-jobs" class="panel">
           <job-inbox :showEdit="showDeleteOption" ></job-inbox>
        </q-tab-panel>
        <q-tab-panel name="tab-notifications" class="panel">
           <notifications @change-tab="updateTab" ref="notification-inbox"></notifications>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script>

export default {
  components: {
    'message-inbox': () => import('components/MessageInbox.vue'),
    'notifications': () => import('components/Notifications/Notifications.vue'),
    'job-inbox': () => import('components/JobInbox.vue')
  },
  data () {
    return {
      selectedTab: this.$route.name === 'Notifications' ? 'tab-notifications' : this.$store.getters['user/getMessageTabIndex'],
      showDeleteOption: false
    }
  },
  created () {
    // insert self into user table
    let info = {
      'href': `/users/${this.$store.getters['user/getUserUuidState']}`,
      'id': this.$store.getters['user/getUserUuidState'],
      'avatarImage': this.$store.getters['user/getUserAvatarImage'],
      'username': this.$store.getters['user/getUserUsername']
    }

    if (this.$q.platform.is.cordova) {
      this.$store.dispatch('chat/insertMessageUser', info).then((result) => {
      }).catch((error) => {
        console.error(error)
      })
    }
  },
  mounted () {
    this.$refs['top-bar-header'].$el.style.top = `${this.$parent.$parent.$parent.$refs.navbar.$el.clientHeight + 1}px`
    this.$refs['tab'].$el.style.top = `${this.$refs['top-bar-header'].$el.clientHeight - 5}px`
  },
  beforeDestroy () {
    this.$emit('update-edit-button-status', false)
  },
  watch: {
    selectedTab (newValue, oldValue) {
      this.$store.commit('user/updateMessageTabIndexState', newValue)
      this.$emit('update-edit-button-status', false)
    }
  },
  methods: {
    refresh (type) {
      switch (type) {
        case 'tab-notifications': this.$refs['notification-inbox'].refresh(); break
      }
    },
    // edit function to edit inbox messages
    onEditRates (status) {
      this.showDeleteOption = status
    },
    // No Methods now
    updateTab () {
      this.selectedTab = this.$store.getters['user/getMessageTabIndex']
    }
  }
}
</script>
<style lang="stylus" scoped>
.panel
  padding: 0px
</style>
