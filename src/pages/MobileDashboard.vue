<template>
  <div>
    <q-tab-panels
      v-model="currentTab"
      animated
      transition-prev="slide-right"
      transition-next="slide-left"
      class="dashboard-ios dashboard-android"
      :style="visibility ? '' : 'background-color: transparent;'"
      :class="{'bg-white': visibility}"
      keep-alive
      :keep-alive-max="5"
    >

    <div class="q-pa-md">
    <q-fab v-model="fabOpened" icon="add" @click="fabOpened = !fabOpened">
      <q-btn-toggle v-model="toggleBtnsShown" class="q-mt-sm" spread>
        <q-btn icon="star" round />
        <q-btn icon="favorite" round />
      </q-btn-toggle>
    </q-fab>
  </div>
      <!-- Explore View -->
      <q-tab-panel name="services.explore" class="q-pa-none">
        <explore-component @on-loaded="onTriggerPopUpLoader" @trigger-login-signup="triggerGuestModeModal" @trigger-dialog-pet-walk="onClosePetSelectionModal"></explore-component>
      </q-tab-panel>

      <!-- Requests View -->
      <q-tab-panel name="mobile.navbar.requests" class="q-pa-none">
        <requests-component @trigger-login-signup="triggerGuestModeModal" @trigger-dialog-pet-walk="onClosePetSelectionModal"></requests-component>
      </q-tab-panel>

      <!-- Moments Page -->
      <q-tab-panel name="navbar.moments" class="q-pa-none">
        <moments-component @trigger-login-signup="triggerGuestModeModal" @trigger-dialog-pet-walk="onClosePetSelectionModal" ref="moments-component"></moments-component>
        <!-- Floating Button -->
        <q-page-sticky position="bottom-right" :offset="[15, 15]">
    <q-fab icon="add" direction="up" vertical-actions-align="right" color="deep-purple-4">
      <q-fab-action @click="triggerUpdateJobModal" color="deep-purple-4">
  <div style="display: flex; align-items: center; justify-content: space-between; padding-left: 6px; ">
    {{ $t('Job.upda') }}
    <q-icon name="edit_note"  style=" padding-left: 6px;"/>
  </div>
</q-fab-action>

<q-fab-action @click="openCreateMomentModal" color="deep-purple-4">
  <div style="display: flex; align-items: center; justify-content: space-between; padding-left: 6px;">
    {{ $t('new.moment') }}
    <q-icon name="add" style=" padding-left: 6px;" />
  </div>
</q-fab-action>

    </q-fab>
  </q-page-sticky>

         <!-- Moment Create Model -->
      <q-dialog v-model="createMomentModal" :persistent="this.$q.platform.is.mobile" :maximized="this.$q.platform.is.mobile" :transition-show="this.$q.platform.is.mobile ? 'slide-left' : 'none' " :transition-hide="this.$q.platform.is.mobile ? 'slide-right' : 'none'" >
      <create-moment-card  @share="share"   @posted="postedJob"   @on-close="triggerCreateMomentModal" @on-post="refreshMomentContent"></create-moment-card>
    </q-dialog>

    <!-- Moment Update Model -->
    <q-dialog  ref="moment update" v-model="jobUpdateModal" :persistent="this.$q.platform.is.mobile" :maximized="this.$q.platform.is.mobile" :transition-show="this.$q.platform.is.mobile ? 'slide-left' : 'none'" :transition-hide="this.$q.platform.is.mobile ? 'slide-right' : 'none'">
    <Job-update-card    @share="share"  @on-close="triggercloseUpdateJobModal"    @posted="postedJob" > </Job-update-card>
    </q-dialog>

      <!-- Moment Success Model -->
      <dialog-success     :description="description" :shareurl="shareurl"  :momentid="momentid"    :posttype="posttype"  :successModal="successModal" :trigger="successModal" @close-modal="closesuccess()"></dialog-success>

      </q-tab-panel>

      <!-- Jobs Page -->
      <q-tab-panel name="mobile.navbar.jobs" class="q-pa-none" :style="visibility ? '' : 'background-color: transparent;'">
        <jobs-component ref="dashboard-jobs" @edit-selected="onEditSelection" @edit-mode="triggerFooterEditMode" @trigger-login-signup="triggerGuestModeModal" @trigger-dialog-pet-walk="onClosePetSelectionModal" :style="visibility ? '' : 'display: none;'"></jobs-component>
      </q-tab-panel>

      <!-- Profile Page -->
      <q-tab-panel name="navbar.profile" class="q-pa-none">
        <profile-component @trigger-login-signup="triggerGuestModeModal"></profile-component>
      </q-tab-panel>

    </q-tab-panels>

    <!-- Dialog Login/Sign Up Now -->
    <dialog-guestmode :trigger="guestModeModal" :message="guestModeMessage" @on-close="triggerGuestModeModal"></dialog-guestmode>

    <!-- Pet Selection for pet walk -->
    <dialog-petwalkselection :trigger="petSelectionModal" @on-close="onClosePetSelectionModal"></dialog-petwalkselection>

  </div>
</template>
<script>
import ExploreComponent from 'components/Dashboard/Explore.vue'
import RequestComponent from 'components/Dashboard/Requests.vue'
import JobComponent from 'components/Dashboard/Jobs.vue'
import MomentComponent from 'components/Dashboard/Moments.vue'
import ProfileComponent from 'components/Dashboard/Profile.vue'
export default {
  components: {
    'Job-update-card': () => import('components/Moments/ComponentJobUpdate.vue'),
    'create-moment-card': () => import('components/Moments/ComponentMomentCreate.vue'),
    'explore-component': ExploreComponent,
    'requests-component': RequestComponent,
    'moments-component': MomentComponent,
    'jobs-component': JobComponent,
    'profile-component': ProfileComponent,
    'dialog-petwalkselection': () => import('components/DogWalk/DialogPetWalkSelection.vue'),
    'dialog-guestmode': () => import('components/DialogLoginSignUpNow.vue'),
    'dialog-success': () => import('components/Moments/ComponentSuccessfulPost.vue')
  },
  data () {
    return {
      guestModeModal: false,
      guestModeMessage: '',
      petSelectionModal: false,
      visibility: true,
      prevRoute: null,
      createMomentModal: false,
      jobUpdateModal: false,
      successModal: false,
      posttype: null,
      moment: [],
      shareurl: null,
      description: null,
      momentid: null,
      toggleBtnsShown: false,
      fabOpened: false,
      shareUrl: null
    }
  },
  preFetch ({store, redirect}) {
    if (store.getters['user/getUserAccessState'] === false || store.getters['user/getUserAccessState'] === null) {
      redirect('/')
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // vm.prevRoute = from
      if (from == null) {
        vm.$store.commit('user/updateUserCurrentMobileTab', 'services.explore')
      }
    })
  },
  created () {
    // on first load always show explore page
    // this.$store.commit('user/updateUserCurrentMobileTab', 'services.explore')
  },
  mounted () {
    this.$store.commit('search/updateExploreSearchCachedId', null)
    this.$store.dispatch('cached/cacheJobsInboxFull', null)

    if (this.$route.query.createListing) {
      this.currentTab = 'navbar.profile'
    }
    // on first load always show explore page - moved to beforeRouteEnter
    // this.$store.commit('user/updateUserCurrentMobileTab', 'services.explore')
  },
  beforeDestroy () {
    this.$root.$off('background-visibility', this.triggerBackgroundVisibility)
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
    share (value) {
      console.log('moment object', value)
      this.moment = value
      console.log('saved in the dashboard', this.moment)
      console.log('descrition', this.moment.description)
      console.log('Shareurl', this.moment.shareUrl)
      this.description = this.moment.description
      this.shareurl = this.moment.shareUrl
    },
    closesuccess () {
      this.successModal = false
    },
    postedJob (value) {
      // set the successModal data property to true to trigger and open the dialog-success component
      this.successModal = true
      console.log('this is the value', value)
      this.posttype = value
      console.log('this is the posttype value', this.posttype)
    },
    onEditSelection (info) {
      this.$emit('on-edit-selection', info)
    },
    openCreateMomentModal () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.triggerGuestModeModal(true)
        return
      }
      this.createMomentModal = true
    },
    triggerCreateMomentModal () {
      this.createMomentModal = false
    },
    triggerUpdateJobModal () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.triggerGuestModeModal(true)
        return
      }
      console.log(this.jobUpdateModal)
      console.log(this.jobUpdateModal = true)
    },

    triggercloseUpdateJobModal () {
      console.log(this.jobUpdateModal)
      console.log(this.jobUpdateModal = false)
    },
    refreshMomentContent () {
      // Implement your logic to refresh the moment content here
    },
    triggerFooterEditMode (status) {
      this.$emit('show-edit-footer', status)
    },
    triggerEditMode (status) {
      this.$refs['dashboard-jobs'].triggerEdit(status)
    },
    triggerBackgroundVisibility (status) {
      this.visibility = status
    },
    onClosePetSelectionModal (status) {
      if (status && this.$store.getters['user/getUserUuidState'] === null) {
        this.triggerGuestModeModal(true, 'DogWalk')
        return
      }

      this.petSelectionModal = status
    },
    refreshJobs () {
      this.$refs['dashboard-jobs'].refreshJobsPage()
    },
    refreshMoment (content) {
      if (content) {
        this.$refs['moments-component'].onNewPost(content)
      }
    },
    onTriggerPopUpLoader (status) {
      this.$emit('trigger-popup', status)
    },
    triggerGuestModeModal (status, navigationTo = null, message = null) {
      this.guestModeMessage = this.$t('guest.mode.create.listing')

      if (navigationTo) {
        switch (navigationTo) {
          case 'CreateMoment': this.guestModeMessage = this.$t('guest.mode.view.moments'); break
          case 'LikeMoment': this.guestModeMessage = this.$t('guest.mode.like.moments'); break
          case 'CommentMoment': this.guestModeMessage = this.$t('guest.mode.comment.moment'); break
          case 'Services': this.guestModeMessage = this.$t('guest.mode.create.request'); break
          case 'JobCalendar':
          case 'OfferService':
            this.guestModeMessage = this.$t('guest.mode.view.jobs'); break
          case 'DogWalk': this.guestModeMessage = this.$t('guest.mode.pet.walk'); break
        }
      }

      if (message) {
        this.guestModeMessage = message
      }

      this.guestModeModal = status
    }
  }
}
</script>
