<template>
    <q-card :class="$route.name === 'MobileDashboard' ? 'q-ml-sm' : ''" :style="{'height': $route.name === 'MobileDashboard' ? '228px' : ''}" style="border-radius:11px;" :flat="$route.name === 'MobileDashboard'">
        <q-card-section class="q-pa-none" v-if="$route.name !== 'MobileDashboard'">
            <q-item class="q-px-none q-py-xs">
                <q-item-section v-if="petInfo">
                    <q-item-label v-if="$route.name !== 'MobileDashboard'" class="q-py-sm">
                      <q-item dense clickable>
                        <!-- Pet Owner avatar -->
                        <q-item-section avatar class="q-pr-none">
                          <q-avatar size="40px" class="q-mr-sm">
                            <img v-if="petInfo.userInfo" :src="petInfo.userInfo.avatarImage" class="image-upload"/>
                          </q-avatar>
                        </q-item-section>

                        <!-- Owner's Info -->
                        <q-item-section>
                          <q-item-label class="text-weight-bold text-capitalize" style="font-size: 16px;" v-if="petInfo.userInfo">{{petInfo.userInfo.username}}</q-item-label>
                          <q-item-label caption class="text-weight-light" style="margin-top:2px;">{{computeTime(petInfo.createdTime)}}</q-item-label>
                        </q-item-section>

                        <!-- <q-item-section side>
                          <q-icon name="chevron_right"></q-icon>
                        </q-item-section> -->
                        <q-item-section side @click="modalMoreOptions = true" class="clickable">
                            <q-icon name="fas fa-ellipsis-v" size="16px" class="q-mb-sm"/>
                        </q-item-section>
                      </q-item>
                    </q-item-label>
                </q-item-section>
                <q-item-section  v-else>
                  <q-skeleton width="70px" height="10px" class="q-my-xs"></q-skeleton>
                  <q-skeleton width="110px" height="10px" class="q-my-xs"></q-skeleton>
                </q-item-section>
            </q-item>
        </q-card-section>

        <!-- Content -->
        <q-card-section class="q-py-xs" v-if="$route.name !== 'MobileDashboard'" @click="triggerPetProfile(true)">
          <!-- Pet name -->
          <q-item-label lines="1" class="font-normal">{{petInfo.title}}</q-item-label>
        </q-card-section>

        <!-- Image -->
        <q-img v-if="petInfo.mediaInfo" @click="triggerPetProfile(true)" :src="petInfo.mediaInfo[0].filePath" class="image-upload" placeholder-src="statics/images/graphic-placeholder.jpg" basic :class="$route.name === 'MobileDashboard' ? 'pet-image' : 'pet-image-community'" :style="$route.name === 'MobileDashboard' ? 'border-radius: 11px;' : ''" style="position: relative;border: 0.5px solid lightgrey;"></q-img>
        <q-skeleton v-else width="155px" height="150px" style="border-radius: 11px;"></q-skeleton>

        <q-card-section class="q-pa-none" v-if="$route.name === 'MobileDashboard'">
            <q-item class="q-px-none q-py-xs">
                <q-item-section v-if="petInfo">
                    <!-- Pet name -->
                    <q-item-label lines="1" class="font-normal" v-if="$route.name === 'MobileDashboard'">{{petInfo.title}}</q-item-label>

                    <!-- Pet Owner name -->
                    <q-item-label lines="1" caption v-if="$route.name === 'MobileDashboard' && petInfo.userInfo">{{petInfo.userInfo.username}}</q-item-label>
                </q-item-section>
                <q-item-section  v-else>
                  <q-skeleton width="70px" height="10px" class="q-my-xs"></q-skeleton>
                  <q-skeleton width="110px" height="10px" class="q-my-xs"></q-skeleton>
                </q-item-section>
            </q-item>
        </q-card-section>
        <!-- Bottom Action Buttons -->
        <q-card-actions class="text-grey row q-py-xs" align="around" v-if="$route.name !== 'MobileDashboard'" style="border-top: solid 1px lightgrey;">
          <q-btn flat :icon="petInfo.isLiked ? 'fas fa-heart' : 'far fa-heart'" :class="petInfo.isLiked ? 'liked' : ''" :ripple="false" @click="onLikeButtonTap" class="col-3 q-pa-none">
            <span class="text-capitalize q-ml-sm" @click.stop="triggerLikeModal(true)">{{petInfo.totalLikes}}</span>
          </q-btn>
          <q-btn flat icon="far fa-comment-dots" :ripple="false" @click="openCommentDialog" class="col-3 q-pa-none">
            <span class="text-capitalize q-ml-sm">{{petInfo.totalComments}}</span>
          </q-btn>
          <q-btn flat icon="fas fa-share" :ripple="false" @click="onShare" class="col-3 q-pa-none">
            <span class="text-capitalize q-ml-sm">{{$t('share')}}</span>
          </q-btn>
        </q-card-actions>

        <!-- Comments Dialog Box -->
        <q-dialog v-model="commentDialog" :maximized="$q.platform.is.mobile" :persistent="$q.platform.is.mobile" :transition-show="$q.platform.is.mobile ? 'slide-left' : ''" :transition-hide="$q.platform.is.mobile ? 'slide-right' : ''">
          <q-card :style="{'min-height': $q.platform.is.desktop ? '600px' : '', 'max-height': $q.platform.is.desktop ? '800px' : ''}">
            <q-toolbar style="width: 435px; z-index: 5000;" class="borderline">
              <q-btn
                flat
                round
                dense
                v-close-popup
                icon="chevron_left"
                size="1.3em"
              />
              <!-- Header Title -->
              <q-toolbar-title v-close-popup>
                <h6 class="q-my-none comment-title" >{{$t('moments.title.comments')}}</h6>
              </q-toolbar-title>
            </q-toolbar>
            <q-card-section v-if="commentArray !== null" class="q-pa-none" :style="{'min-height': $q.platform.is.desktop ? '520px' : ''}">
              <!-- A comment -->
              <div v-if="commentArray.length > 0">
                <div v-for="(comment, index) in commentArray" :key="index">
                  <q-item>
                    <!-- Avatar-->
                    <q-item-section avatar @click="$router.push({name: 'PublicProfile', params: {userId: comment.user.uuid}})">
                      <q-avatar>
                        <img :src="comment.user.avatarImage" class="responsive profile-img"/>
                      </q-avatar>
                    </q-item-section>
                    <!-- User's name and comment -->
                    <q-item-section>
                      <q-item-label lines="1">{{comment.user.standard_username}}</q-item-label>
                      <q-item-label lines="2">{{comment.comment}}</q-item-label>
                    </q-item-section>
                    <!-- Time since created -->
                    <q-item-section side>
                      <q-item-label caption>{{computeTime(comment.created_time)}}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator spaced inset="item" />
                </div>
              </div>
              <!-- Show this if no comments in post -->
              <div v-else>
                <h5 class="text-center">{{$t('moments.comment.here.first')}}</h5>
              </div>
            </q-card-section>
            <div class="justified text-center" v-else ref="preLoader" :style="{'min-height': $q.platform.is.desktop ? '520px' : ''}">
              <ComponentPreLoader></ComponentPreLoader>
            </div>

            <q-card-actions class="borderline q-pt-sm q-pb-md" :class="$q.platform.is.mobile ? 'fixed-bottom' : ''">
              <q-input type="text" class="full-width" ref="inputBox" autogrow v-model="commentBox" :placeholder="$t('chat.entercomments')" borderless dense rounded standout>
                <template v-slot:append>
                  <q-btn icon="send" :loading="commentSending" color="primary" style="width: 40px; height: 40px;" round @click.native="comment()"/>
                </template>
              </q-input>
            </q-card-actions>
          </q-card>
        </q-dialog>

       <!-- Likes Dialog -->
       <dialog-moment-likes :trigger="likeModal" :momentId="petInfo.id" :likes="petInfo.totalLikes" @on-close="triggerLikeModal"></dialog-moment-likes>

       <!-- More Options Dialog -->
       <q-dialog v-model="modalMoreOptions" auto-close position="bottom" class="moreOptions" transition-show="slide-up">
        <q-card style="width:400px;">
          <q-card-section >
            <q-btn flat class="full-width q-py-xs text-weight-medium" @click="onBlock" text-color="red" no-caps><p>{{$t('block')}}</p></q-btn>
            <q-btn flat class="full-width q-py-xs text-weight-medium" @click="triggerReportDialog(true, $t('report.this.post'), $t('why.are.you.reporting.this.post'), $t('button.submit'), $t('button.cancel'), 1, true)" text-color="red" no-caps><p>{{$t('report')}}</p></q-btn>
            <q-btn flat class="full-width q-py-xs text-weight-medium"  @click="onShare" text-color="black" no-caps><p>{{$t('share')}}</p></q-btn>
            <div><q-separator/></div>
            <q-btn flat class="full-width q-py-xs text-weight-bold" text-color="black" id="closeBtn" no-caps>{{$t('close')}}</q-btn>
          </q-card-section>
        </q-card>
       </q-dialog>

       <!-- Block Dialog -->
       <dialog-block :trigger="blockModal" :momentId="petInfo.id" :type="'pet'" :blockUserUuid="petInfo && petInfo.userInfo && petInfo.userInfo.id ? petInfo.userInfo.id : null" @on-close="triggerBlockModal" @on-block-moment="onBlockMoment"></dialog-block>

       <!-- Report Pet Dialog -->
       <dialog-report :trigger="promptModal" :type="typeCode" :title="promptTitle" :message="promptMessage" :persistent="promptPersistant" :okButtonLabel="okBtnLabel" :cancelButtonLabel="canceblBtnLabel" @on-ok="onPromptOk" @on-cancel="onPromptCancel" @on-close="triggerReportDialog"></dialog-report>

       <!-- Share Dialog -->
       <q-dialog v-model="sharingDialog" auto-close  position="bottom" class="moreOptions" transition-show="slide-up">
          <social-share-card v-if="petInfo && petInfo.userInfo" :detail="`Hey! Checkout ${petInfo.userInfo.username}\'s '${petInfo.title}' at PetBacker`" :shareLink="`${$t('link.href.petbacker')}/moments/${petInfo.id}`"></social-share-card>
       </q-dialog>

       <!-- Pet Profile Dialog -->
       <dialog-pet-profile :trigger="petProfileDialog" :userInfo="petInfo.userInfo" :petInfo="petInfo.itemDescription" :mediaInfo="petInfo.mediaInfo" :wallInfo="{likes: petInfo.totalLikes, comments: petInfo.totalComments, liked: petInfo.isLiked, id: petInfo.id}"
       @on-like="likePost" @on-unlike="unlikePost" @trigger-like-dialog="triggerLikeModal" @trigger-comment-dialog="openCommentDialog" @on-share="onShare" @on-close="triggerPetProfile" @on-block-moment="onBlockMoment"></dialog-pet-profile>
    </q-card>
</template>
<script>
import moment from 'moment'
export default {
  components: {
    'dialog-pet-profile': () => import('components/PetProfile/DialogPetProfile.vue'),
    'dialog-moment-likes': () => import('components/Moments/DialogLikes.vue'),
    'social-share-card': () => import('components/DialogShare.vue'),
    'dialog-report': () => import('components/DialogReport.vue'),
    'dialog-block': () => import('components/DialogBlock.vue')
  },
  props: {
    petInfo: {
      type: [Object, null]
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      modalMoreOptions: false,
      sharingDialog: false,
      commentDialog: false,
      liked: this.petInfo.isLiked,
      commentArray: null,
      commentBox: null,
      shareDetails: '',
      commentSending: false,
      petProfileDialog: false,
      likeModal: false,
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
  methods: {
    triggerLikeModal (status) {
      this.likeModal = status
    },
    triggerPetProfile (status) {
      this.petProfileDialog = status
    },
    onShare () {
      this.sharingDialog = true
    },
    toPublicProfile () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.$emit('on-guest-interaction', true)
        return
      }

      this.$router.push({name: 'PublicProfile', params: {userId: this.petInfo.userInfo.id}})
    },
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

      this.$axios.post(`users/${this.$store.getters['user/getUserUuidState']}/report/${this.petInfo.userInfo.id}`, info, {
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
    openCommentDialog () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.$emit('on-guest-interaction', true)
        return
      }

      this.commentDialog = true
      this.getComments()
    },
    onLikeButtonTap () {
      if (this.petInfo.isLiked) {
        this.unlikePost()
      } else {
        this.likePost()
      }
    },
    likePost () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.$emit('on-guest-interaction', true)
        return
      }

      this.$emit('on-like', this.index)
      this.$axios.post(`moments/${this.petInfo.id}/like?type=1`, {}, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
      }).catch((error) => {
        console.error(error)
        this.$q.notify({message: error.response.data.message})
      })
    },
    unlikePost () {
      this.$emit('on-unlike', this.index)
      this.$axios.delete(`moments/${this.petInfo.id}/like?type=1`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
      }).catch((error) => {
        console.error(error)
      })
    },
    computeTime (time) {
      return moment.utc(time).local().fromNow()
    },
    getComments () {
      this.$axios.get(`moments/${this.petInfo.id}/comments`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.commentArray = response.data.data
      }).catch((error) => {
        console.error(error)
        this.$q.notify({message: error.response.data.message})
      })
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
    onBlockMoment () {
      this.$emit('on-block-moment')
    }
  }
}
</script>
<style lang="stylus">
.pet-image
  object-fit: cover
  min-height: 175px
  max-height: 175px
  width: 154px

.pet-image-community
  object-fit: cover
  min-height: 175px
  max-height: 420px
</style>
