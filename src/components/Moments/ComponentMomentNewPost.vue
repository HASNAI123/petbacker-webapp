<template>
  <div class="bg-white q-py-xs">
    <q-card class="q-ma-none" flat>
      <!-- <q-item style="border-bottom: solid 1px lightgrey;" class="q-pb-md"> -->
        <!-- <q-item-section avatar @click="$router.push({name: 'MomentsProfile', params: {userId: $store.state.user.uuid || 0}})">
          <q-avatar style="width: 40px;heigth: 40px;border-radius: 20px;">
            <q-img class="image-upload" height="100%" :src="$store.getters['user/getUserAvatarImage']" style="border-radius: 20px;" placeholder-src="statics/images/graphic-placeholder.jpg"></q-img>
          </q-avatar>
        </q-item-section> -->

        <!-- <q-item-section>
          <q-input v-model="userInput" @click.native="triggerMenuModal(true)" class="input" style="border-bottom: solid 1px lightgrey;" disable :placeholder="$t('share.pet.or.thoughts')" borderless dense standout>
            <template slot="append">
              <q-icon name="far fa-edit" size="16px"></q-icon>
            </template>
          </q-input>
        </q-item-section> -->
     <!--  </q-item> -->

     <q-card-actions align="around" class="q-pb-xs q-ma-none">
  <q-btn class="q-btn--no-uppercase text-capitalize icon-size" :ripple="false" :label="$t('navbar,moment')" @click.native="onSelectionMenu('Moments')" flat>
    <img class="q-mr-none q-ml-none q-icon--size-sm" src="statics/images/moment/new_moment.png" style="height: 20px; width: 20px;" />
  </q-btn>
  <q-btn class="q-btn--no-uppercase text-capitalize icon-size" :ripple="false" :label="$t('Job.update')" @click="triggerUpdateJobModal()" flat>
    <img class="q-mr-none q-ml-none q-icon--size-sm" src="statics/images/moment/Job_update.png" style="height: 20px; width: 20px;" />
  </q-btn>
  <q-btn class="q-btn--no-uppercase text-capitalize icon-size" :ripple="false" @click.native="$emit('trigger-dog-walk', true)" :label="$t('pet.walks')" flat>
    <img class="q-mr-none q-ml-none q-icon--size-sm" src="statics/images/moment/dog_walk.png" style="height: 20px; width: 20px;" />
  </q-btn>
</q-card-actions>

    </q-card>

    <!-- More options modal -->
    <!-- <q-dialog v-model="modalMoreOptions" auto-close position="bottom" class="moreOptions" style="border-top-right-radius: 15px;border-top-left-radius: 15px;">
      <q-card> -->
        <!-- Moments Post Options -->
        <!-- <q-card-section>
          <q-btn flat :ripple="false" class="full-width q-mt-md text-weight-medium" text-color="black" style="margin-top:8px" @click.native="onSelectionMenu('Moments')" no-caps><p>{{$t('new.moment')}}</p></q-btn>
          <q-btn flat :ripple="false" class="full-width q-mt-md text-weight-medium" text-color="black" style="margin-top:8px" @click.native="onSelectionMenu('Stories')" no-caps><p>{{$t('new.story')}}</p></q-btn>
          <q-btn flat :ripple="false" class="full-width q-mt-md text-weight-medium" text-color="black" style="margin-top:8px" @click.native="onSelectionMenu('Drafts')" no-caps><p>{{$t('saved.drafts')}}</p></q-btn>
          <div><q-separator/></div>
          <q-btn flat class="full-width q-mt-md text-weight-bold" text-color="black" id="closeBtn" no-caps>{{$t('close')}}</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog> -->

    <!-- Create Moment Modal -->
    <q-dialog v-model="createMomentModal" :persistent="this.$q.platform.is.mobile" :maximized="this.$q.platform.is.mobile" :transition-show="this.$q.platform.is.mobile ? 'slide-left' : 'none' " :transition-hide="this.$q.platform.is.mobile ? 'slide-right' : 'none'" >
      <create-moment-card  @share="share" @posted="postedJob" :momentInfo="selectedDraft" @on-close="triggerCreateMomentModal" @on-post="refreshMomentContent"></create-moment-card>
    </q-dialog>
 <!-- Update Job Moment Modal -->
    <q-dialog v-model="jobUpdateModal" :persistent="this.$q.platform.is.mobile" :maximized="this.$q.platform.is.mobile" :transition-show="this.$q.platform.is.mobile ? 'slide-left' : 'none'" :transition-hide="this.$q.platform.is.mobile ? 'slide-right' : 'none'">
    <Job-update-card  @share="share"  @posted="postedJob" @on-close="triggercloseUpdateJobModal"> </Job-update-card>
    </q-dialog>

    <!-- Create Story Modal -->
    <q-dialog v-model="createStoryModal" :persistent="this.$q.platform.is.mobile" :maximized="this.$q.platform.is.mobile" :transition-show="this.$q.platform.is.mobile ? 'slide-left' : 'none' " :transition-hide="this.$q.platform.is.mobile ? 'slide-right' : 'none'" >
      <create-story-card :storyInfo="selectedDraft" @on-close="triggerCreateStoryModal" @on-post="refreshMomentContent"></create-story-card>
    </q-dialog>

    <!-- Saved Drafts Modal -->
    <q-dialog v-model="saveDraftsModal" :persistent="this.$q.platform.is.mobile" :maximized="this.$q.platform.is.mobile" :transition-show="this.$q.platform.is.mobile ? 'slide-left' : 'none' " :transition-hide="this.$q.platform.is.mobile ? 'slide-right' : 'none'">
      <saved-drafts-card @open-saved-drafts="openSavedDrafts" ></saved-drafts-card>
    </q-dialog>

    <dialog-success     :description="description" :shareurl="shareurl"  :momentid="momentid"    :posttype="posttype"  :successModal="successModal" :trigger="successModal" @close-modal="closesuccess()"></dialog-success>

  </div>
</template>
<script>
export default {
  components: {
    'create-moment-card': () => import('components/Moments/ComponentMomentCreate.vue'),
    'create-story-card': () => import('components/Moments/ComponentStoryCreate.vue'),
    'saved-drafts-card': () => import('components/Moments/ComponentStoryDrafts.vue'),
    'Job-update-card': () => import('components/Moments/ComponentJobUpdate.vue'),
    'dialog-success': () => import('components/Moments/ComponentSuccessfulPost.vue')
  },
  data () {
    return {
      userInput: null,
      createStoryModal: false,
      createMomentModal: false,
      modalMoreOptions: false,
      saveDraftsModal: false,
      selectedDraft: null,
      jobUpdateModal: false,
      successModal: false,
      shareurl: null,
      description: null,
      momentid: null,
      toggleBtnsShown: false,
      fabOpened: false,
      shareUrl: null
    }
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    downloadAppModal (value) {
      if (value) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    },
    createStoryModal (value) {
      if (value) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    },
    saveDraftsModal (value) {
      if (value || this.createStoryModal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
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
    triggerUpdateJobModal () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.$emit('on-click')
        return
      }
      console.log(this.jobUpdateModal)
      console.log(this.jobUpdateModal = true)
    },

    triggercloseUpdateJobModal () {
      console.log(this.jobUpdateModal)
      console.log(this.jobUpdateModal = false)
    },
    /*  triggerMenuModal (status) {
      this.modalMoreOptions = status
    }, */
    onSelectionMenu (type) {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.$emit('on-click')
        return
      }

      switch (type) {
        case 'Moments': this.createMomentModal = true; break
        case 'Stories': this.createStoryModal = true; break
        case 'Drafts': this.saveDraftsModal = true; break
      }
    },
    triggerCreateMomentModal (status) {
      this.saveDraftsModal = false
      this.createMomentModal = status

      if (status === false) {
        this.selectedDraft = null
      }
    },
    triggerCreateStoryModal (status) {
      this.saveDraftsModal = false
      this.createStoryModal = status

      if (status === false) {
        this.selectedDraft = null
      }
    },
    refreshMomentContent () {
      this.$emit('refresh-moment')
      this.createStoryModal = false
    },
    openSavedDrafts (value) {
      if (value) {
        this.selectedDraft = value
      }

      if (value.type === 6) {
        this.createStoryModal = true
      } else if (value.type === 1) {
        this.createMomentModal = true
      }

      this.saveDraftsModal = false
    }
  }
}
</script>
<style lang="stylus">
.btn-outline
  border: 1px solid lightgrey
  min-height: 58px

.q-card-actions.q-card-actions--horiz .q-btn
  margin-left 0

.q-card-actions.q-card-actions--horiz .q-btn
  margin-left 0

</style>
