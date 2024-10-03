<template>
  <q-dialog ref="" v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
    <q-card v-touch-pan.right.prevent.mouse="onSwipeRight">
        <!-- Header -->
        <q-toolbar ref="listing-navbar" style="border-bottom: 1px solid lightgrey;z-index: 6000;" class="fixed-top bg-white row">
          <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
          <q-toolbar-title >
            <h6 class="q-my-none font-header-title text-center col-11" v-if="listingInfo">{{listingInfo.listingName}}</h6>
          </q-toolbar-title>

          <!-- Favorite Button -->
          <q-icon style="font-size: 20px;" @click="onFavorite" class="phone font-title q-mx-xs" :style="{'color': isFavorite ? 'red' : 'black'}" :name="isFavorite ? 'favorite' : 'favorite_border'"></q-icon>

          <!-- More Options -->
          <q-icon style="color: black; font-size: 20px;" @click="modalMoreOption" class="moreOptions q-mx-xs" name="more_vert"></q-icon>
        </q-toolbar>

        <q-card-section class="q-pa-none q-mt-xl scroll">
          <listing-details v-if="modal" ref="listing-details" :listingInfo="listingInfo" :serviceInfo="serviceInfo" :images="serviceInfo ? serviceInfo.serviceImage : []"></listing-details>
        </q-card-section>
    </q-card>
    <!-- Block Dialog -->
    <dialog-block :trigger="blockModal" :type="'user'" :blockUserUuid="listingInfo && listingInfo.userInfo && listingInfo.userInfo.id ? listingInfo.userInfo.id : null" @on-close="triggerBlockModal" @on-block-user="onBlockUser"></dialog-block>

    <!-- Report Pet Dialog -->
    <dialog-report :trigger="promptModal" :type="typeCode" :title="promptTitle" :message="promptMessage" :persistent="promptPersistant" :okButtonLabel="okBtnLabel" :cancelButtonLabel="canceblBtnLabel" @on-ok="onPromptOk" @on-cancel="onPromptCancel" @on-close="triggerReportDialog"></dialog-report>

    <!-- Share Dialog (From Pet Profile) -->
    <q-dialog v-model="sharingModal" auto-close  position="bottom" class="moreOptions" transition-show="slide-up">
      <share-card :detail="shareText" :shareLink="shareLink" @on-shared="sharingModal = false"></share-card>
    </q-dialog>
 <!-- Dialog Login/Sign Up Now -->
 <dialog-guestmode :trigger="guestModeModal" :message="guestModeMessage" @on-close="triggerGuestModeModal"></dialog-guestmode>

    <!-- More Options Dialog -->
    <q-dialog v-model="modalMoreOptions" auto-close position="bottom" style="width: 220px; border-top-right-radius: 15px;border-top-left-radius: 15px;">
      <q-card>
        <!-- Listings More Options -->
        <q-card-section v-if="listingInfo">
          <q-btn v-if="listingInfo.userInfo.uuid !== $store.getters['user/getUserUuidState']" flat class="full-width q-py-xs text-weight-medium" @click="onBlock" text-color="red" no-caps><p>{{$t('block')}}</p></q-btn>
          <q-btn flat class="full-width q-my-xs text-weight-medium" text-color="red" style="margin-top:8px" @click.native="triggerReportDialog(true, $t('report.this.post'), $t('why.are.you.reporting.this.post'), $t('button.submit'), $t('button.cancel'), 1, true)" no-caps v-if="listingInfo.userInfo.id !== $store.getters['user/getUserUuidState']"><p>{{$t('report')}}</p></q-btn>
          <q-btn flat class="full-width q-my-xs text-weight-medium" text-color="black" style="margin-top:8px" @click.native="$router.push({name: 'PublicProfile', params: {userId: listingInfo.userInfo.id}})" no-caps><p>{{$t('view.profile')}}</p></q-btn>
          <q-btn flat class="full-width q-my-xs text-weight-medium" v-if="showEdit" text-color="black" @click="$router.push({name: 'EditListing', params: {listingId: listingId}})" style="margin-top:8px" no-caps><p>{{$t('listing.edit.info.option')}}</p></q-btn>
          <q-btn flat class="full-width q-my-xs text-weight-medium" text-color="black" style="margin-top:8px" @click.native="triggerShareDialog(true, '', serviceInfo.listingUrl)" no-caps><p>{{$t('share')}}</p></q-btn>
          <div><q-separator/></div>
          <q-btn flat class="full-width q-my-xs text-weight-bold" text-color="black" id="closeBtn" no-caps>{{$t('close')}}</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>
<script>
export default {
  components: {
    'listing-details': () => import('components/Listing/Listing.vue'),
    'share-card': () => import('components/DialogShare.vue'),
    'dialog-report': () => import('components/DialogReport.vue'),
    'dialog-block': () => import('components/DialogBlock.vue'),
    'dialog-guestmode': () => import('components/DialogLoginSignUpNow.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    listingId: {
      type: Number,
      required: true
    },
    info: {
      type: Object
    },
    viewUserOtherListing: {
      type: Boolean,
      default: false
    },
    favorited: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      guestModeModal: false,
      guestModeMessage: '',
      modal: false,
      listingInfo: null,
      serviceInfo: null,
      isFavorite: false,
      showEdit: false,
      modalMoreOptions: false,
      sharingModal: false,
      shareText: null,
      shareLink: null,
      promptModal: false,
      blockModal: false,
      typeCode: 1,
      promptMessage: '',
      promptTitle: '',
      okBtnLabel: this.$t('ok'),
      canceblBtnLabel: this.$t('close'),
      promptPersistant: false,
      reportedReasons: ''
    }
  },
  watch: {

    favorited (value) {
      this.isFavorite = value
    },
    trigger (value) {
      this.modal = value

      if (value) {
        if (!this.listingInfo) {
          this.getListingInfo()
        } else {
          if (this.viewUserOtherListing === false) {
            setTimeout(() => {
              this.$refs['listing-details'].triggerShowEdit(this.showEdit)
              this.$refs['listing-details'].checkOtherListingInfo()
            }, 200)
          }
        }

        if (!this.serviceInfo) {
          this.getListingDescription()
        }
      }
    }
  },
  methods: {
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
    },
    modalMoreOption () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.triggerGuestModeModal(true)
        return
      }
      this.modalMoreOptions = true
    },

    onFavorite () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.triggerGuestModeModal(true)
        return
      }
      if (this.isFavorite) {
        this.$emit('listing-favorite', 0)
        this.isFavorite = 0

        // un-favorite
        this.$axios.delete(`users/${this.$store.getters['user/getUserUuidState']}/services/${this.listingId}/favorites`, {
          headers: {
            'Authorization': this.$store.getters['user/authorizationHeader']
          }
        }).catch((error) => {
          this.$emit('listing-favorite', 1)
          this.isFavorite = 1
          console.error(error)
          if (error.response.data) {
            this.$emit('on-server-error', true, error.response.data.message, error.response.data.code)
          }
        })
      } else {
        this.$emit('listing-favorite', 1)
        this.isFavorite = 1

        // favorite
        this.$axios.get(`users/${this.$store.getters['user/getUserUuidState']}/services/${this.listingId}/favorites`, {
          headers: {
            'Authorization': this.$store.getters['user/authorizationHeader']
          }
        }).catch((error) => {
          this.$emit('listing-favorite', 0)
          this.isFavorite = 0
          console.error(error)
          if (error.response.data) {
            this.$emit('on-server-error', true, error.response.data.message, error.response.data.code)
          }
        })
      }
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
    getListingInfo () {
      this.$axios.get(`listings/${this.listingId}?lang=${this.$store.getters['user/getCurrentLanguage']}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.listingInfo = response.data.listingInfo
        this.listingInfo.images = response.data.listingInfo.serviceImage

        if (this.$store.getters['user/getUserUuidState'] === response.data.listingInfo.userInfo.id) {
          this.showEdit = true
        } else {
          this.showEdit = false

          // load other listing info
          if (this.viewUserOtherListing === false) {
            setTimeout(() => {
              this.$refs['listing-details'].checkOtherListingInfo()
            }, 200)
          }
        }
        //  this.$emit('listing-name', this.listingInfo.listingName, response.data.receivedUrl)
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        this.$refs['listing-details'].triggerShowEdit(this.showEdit)
      })
    },
    getListingDescription () {
      this.$axios.get(`users/${this.info.userInfo.id}/services/${this.listingId}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.serviceInfo = response.data.serviceInfo
        this.isFavorite = Boolean(response.data.serviceInfo.isFavorite)

        this.$emit('listing-favorite', response.data.serviceInfo.isFavorite)
      }).catch((error) => {
        console.error(error)
      })
    },
    /* onReport () {
      this.$q.dialog({
        title: 'Report',
        message: 'Why are you reporting this user?',
        prompt: {
          model: this.reportedReasons,
          isValid: val => val.length > 2, // << here is the magic
          type: 'text'
        },
        cancel: true
      }).onOk(data => {
        this.reportSubmit(data)
        this.reportedReasons = ''
      }).onCancel(() => {
      })
    }, */
    onPromptCancel () {
      this.triggerReportDialog(false)
    },
    onPromptOk (message) {
      this.reportSubmit(message)
    },
    reportSubmit (reportReason) {
      let info = {
        'reportInfo': {
          'comment': reportReason
        }
      }

      this.$axios.post(`users/${this.$store.getters['user/getUserUuidState']}/report/${this.listingInfo.userInfo.id}`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$q.notify({
          message: this.$t('report.submitted.successful'),
          position: 'top'
        })
      }).catch((error) => {
        console.error(error)
        if (error.response) {
          this.$q.notify({
            message: error.response.data.message,
            position: 'top',
            timeout: 2000
          })
        }
      })
    },
    triggerShareDialog (status, shareText = '', shareLink = '') {
      this.shareText = shareText
      this.shareLink = shareLink
      this.sharingModal = status
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    },
    triggerReportDialog (status, title = '', message = '', okLabel = null, cancelLabel = null, typeCode = 0, persistent = false) {
      this.promptTitle = title
      this.promptMessage = message
      this.okBtnLabel = okLabel
      this.canceblBtnLabel = cancelLabel
      this.promptPersistant = persistent
      this.typeCode = typeCode
      this.promptModal = status
    },
    triggerBlockModal (status) {
      this.blockModal = status
    },
    onBlock () {
      this.triggerBlockModal(true)
    },
    onBlockUser () {
      this.modal = false
      this.$emit('on-block-user')
    }
  }
}
</script>
