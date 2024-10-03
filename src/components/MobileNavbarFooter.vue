<template>
    <!-- Mobile footer navbar -->
    <q-footer :reveal="$store.getters['user/getUserCurrentMobileTab'] === 'navbar.moments'" bordered id="footer-navbar" class="shadow-6 bg-grey-1 footer-mobile" v-if="$store.state.user.access && showNavFooter.indexOf($route.name) > -1 && visibility">
      <!-- Edit Footer -->
      <q-btn-group flat v-if="showEditNavbar" no-caps spread class="text-black q-pb-md" style="height: 68px;">
        <q-btn :label="`${$t('delete')} ${editInfo.data && editInfo.data.length > 0 ? `(${editInfo.data.length})` : ''}`"
          :class="(editInfo.data && editInfo.data.length > 0) ? 'text-negative' : 'text-grey-6'"
          :disable="(editInfo.data && editInfo.data.length === 0) || !editInfo.data"
          :ripple="false" flat
          :loading="deleteLoading"
          @click="onDelete"></q-btn>
        <!-- <q-btn label="Read All" :ripple="false" flat></q-btn> -->
        <q-btn :label="$t('done')" :ripple="false" @click="onTriggerEditMode(false)" flat></q-btn>
      </q-btn-group>

      <!-- Footer Navbar -->
      <q-tabs v-else v-model="currentTab" no-caps align="justify" active-color="black" indicator-color="transparent" class="text-grey" style="max-width: 100%;">
        <q-tab class="text-capitalize" name="services.explore" content-class="mobile-navbar" :label="$t('services.explore')" :ripple="false" :icon="$store.getters['user/getUserCurrentMobileTab'] === 'services.explore' ? 'img:statics/images/new-icons/explore-active.png' : 'img:statics/images/new-icons/explore.png'"></q-tab>
        <q-tab class="text-capitalize" name="mobile.navbar.requests" content-class="mobile-navbar" :label="$t('mobile.navbar.requests')" :ripple="false" :icon="$store.getters['user/getUserCurrentMobileTab'] === 'mobile.navbar.requests' ? 'img:statics/images/new-icons/requests-active.png' : 'img:statics/images/new-icons/requests.png'"></q-tab>
        <q-tab class="text-capitalize" name="navbar.moments" content-class="mobile-navbar" :label="$t('navbar.moments')" :ripple="false" :icon="$store.getters['user/getUserCurrentMobileTab'] === 'navbar.moments' ? 'img:statics/images/new-icons/moments-active.png' : 'img:statics/images/new-icons/moments.png'"></q-tab>
        <q-tab class="text-capitalize" name="mobile.navbar.jobs" content-class="mobile-navbar" :label="$t('mobile.navbar.jobs')" :ripple="false" :icon="$store.getters['user/getUserCurrentMobileTab'] === 'mobile.navbar.jobs' ? 'img:statics/images/new-icons/jobs-active.png' : 'img:statics/images/new-icons/jobs.png'"></q-tab>
        <q-tab class="text-capitalize" name="navbar.profile" content-class="mobile-navbar" :label="$t('navbar.profile')" :ripple="false" :icon="$store.getters['user/getUserCurrentMobileTab'] === 'navbar.profile' ? 'img:statics/images/new-icons/profile-active.png' : 'img:statics/images/new-icons/profile.png'"></q-tab>
      </q-tabs>

      <!-- Prompt Dialog -->
      <dialog-prompt :trigger="promptModal" :type="promptType" :message="promptMessage" :okButtonLabel="okBtnLabel" :cancelButtonLabel="canceblBtnLabel" @on-ok="onPromptOk" @on-close="triggerPromptDialog"></dialog-prompt>
    </q-footer>
</template>
<script>
export default {
  components: {
    'dialog-prompt': () => import('components/DialogPrompt.vue')
  },
  data () {
    return {
      showNavFooter: [
        'MobileDashboard',
        'Explore',
        'Requests',
        'Jobs',
        'Profile',
        'Moments'
      ],
      visibility: true,
      showEditNavbar: false,
      editInfo: {
        data: null
      },
      promptModal: false,
      promptType: 0,
      promptMessage: this.$t('confirmation.delete.jobs'),
      okBtnLabel: this.$t('delete'),
      canceblBtnLabel: this.$t('chat.later'),
      deleteLoading: false
    }
  },
  beforeDestroy () {
    this.$root.$off('background-visibility', this.triggerBackgroundVisibility)
    this.onTriggerEditMode(false)
  },
  computed: {
    currentTab: {
      get () {
        if (this.$store.getters['user/getUserCurrentMobileTab'] === null && this.$q.platform.is.cordova) {
          return 'services.explore'
        }

        return this.$store.getters['user/getUserCurrentMobileTab']
      },
      set (value) {
        this.$store.commit('user/updateUserCurrentMobileTab', value)
        return value
      }
    }
  },
  watch: {
    currentTab (to, from) {
      if (to === 'mobile.navbar.jobs') {
        this.$root.$on('background-visibility', this.triggerBackgroundVisibility)
      } else if (from === 'mobile.navbar.jobs') {
        this.$root.$off('background-visibility', this.triggerBackgroundVisibility)
      }
    }
  },
  methods: {
    onDelete () {
      this.triggerPromptDialog(true, this.$t('confirmation.delete.jobs'), this.$t('delete'), this.$t('chat.later'), 1)
    },
    onPromptOk (type) {
      if (type === 1) {
        this.archivedJobs()
      }
    },
    archivedJobs () {
      this.deleteLoading = true

      let payload = {
        'archiveInfo': {
          'id': this.editInfo.data
        }
      }

      this.$axios.post(`users/${this.$store.state.user.uuid}/archivejobs`, payload, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$q.notify({
          message: this.$t('jobs.successfully.deleted'),
          type: 'positive',
          position: 'top'
        })
        this.editInfo.data = null
        this.onTriggerEditMode(false)
      }).catch(e => {
        console.error(e)
        if (e.response && e.response.data) {
          this.$q.notify({
            message: e.response.data.message,
            position: 'top',
            type: 'negative'
          })
        }
      }).finally(_ => {
        this.deleteLoading = false
        this.$emit('refresh-view')
      })
    },
    triggerPromptDialog (status, message = '', okLabel = null, cancelLabel = null, type = 0) {
      this.promptMessage = message
      this.okBtnLabel = okLabel
      this.canceblBtnLabel = cancelLabel
      this.promptType = type
      this.promptModal = status
    },
    triggerEditDone (info) {
      this.editInfo.data = info
    },
    onTriggerEditMode (status) {
      this.$emit('on-trigger-edit', status)
    },
    triggerEditNavbar (status) {
      this.showEditNavbar = status
    },
    triggerBackgroundVisibility (status) {
      this.visibility = status
    },
    redirect (button) {
      this.$store.commit('user/updateUserCurrentMobileTab', button)
    }
  }
}
</script>
<style lang="stylus">
.mobile-navbar .q-tab__label
  font-size: 12px

.platform-ios .footer-mobile
  min-height: 65px

.q-tab
  padding: 0px
  width: 80px

@media screen and (max-width: 415px)
  .q-tab
   padding: 0px
   width: 90px
</style>
