<template>
    <q-card>
        <!-- Top Header -->
        <q-item>
            <!-- Avatar Image -->
            <q-item-section avatar @click="openBackerProfile(userInfo.uuid)">
                <q-avatar>
                    <img :src="userInfo.avatarImage" class="responsive profile-img">
                </q-avatar>
            </q-item-section>

            <!-- User's Info -->
            <q-item-section @click="openBackerProfile(userInfo.uuid)">
                <q-item-label class="text-weight-bold" style="font-size: 16px;">{{userInfo.standard_username}}</q-item-label>
                <q-item-label caption class="text-weight-light" style="margin-top:2px;">{{computeTime(this.timeCreated)}}</q-item-label>
            </q-item-section>

            <!-- More options button (top right)-->
            <q-item-section side @click="moreoptions" class="clickable">
                <q-icon name="fas fa-ellipsis-v" size="16px" class="q-mb-sm"/>
            </q-item-section>
        </q-item>
        <!-- Description -->
          <!-- Story -->
        <q-card-section horizontal v-if="parseInt(this.type) === 6" @click="openStory">
          <q-item class="full-width">
            <q-item-section>
              <q-item-label class="text-h6">{{this.title}}</q-item-label>
              <q-item-label caption :lines="$q.platform.is.desktop ? 4 : 3" style="font-size: 14px;text-overflow: ellipsis;overflow: hidden;">{{this.subTitle}}</q-item-label>
            </q-item-section>

            <q-item-section avatar>
              <q-avatar square :class="$q.platform.is.desktop ? 'desktop-cover-image' : 'mobile-cover-image'">
                <img :src="this.images[0].media_filename" class="image-upload" style="border-radius: 10px;"/>
              </q-avatar>
            </q-item-section>
          </q-item>
        </q-card-section>
          <!-- Moment -->
        <q-card-section horizontal v-else class="q-py-xs q-px-md">
          <p class="q-my-xs" v-html="parsedDetails"></p>
        </q-card-section>

        <!-- Uploaded Image -->
        <q-carousel
          v-if="parseInt(this.type) !== 6"
          v-model="slide"
          :keep-alive="images.length > 1 && (images[0].content_type === 'video' || images[1].content_type === 'video')"
          :keep-alive-max="6"
          animated
          :arrows="this.images.length > 1 && this.$q.platform.is.desktop"
          control-type="flat"
          :navigation="this.images.length > 1"
          swipeable
          transition-prev="slide-right"
          transition-next="slide-left"
          style="overflow:hidden;height: auto;"
        >
          <q-carousel-slide v-for="(image, index) in this.images" class="q-pa-none" :key="image.id" :name="index" style="overflow:hidden;">
            <q-img v-if="image.content_type === 'image'" @load="computeRatio" :src="image.media_filename" placeholder-src="statics/images/graphic-placeholder.jpg" :ref="image.id" :ratio="aspectRatio" class="responsive image-upload" @click="onDoubleTap"/>
            <div v-else-if="image.content_type === 'video'" style="position: relative;">
              <video
                preload="auto"
                class="video-uploaded"
                @loadstart="videoLoader = false"
                @loadeddata="computeRatio"
                poster="statics/images/graphic-placeholder.jpg"
                @ended="videoPlaying = false;replay = true"
                @click="pauseVideo(image.id)"
                :ref="image.id"
                playsinline
              >
                <source :src="`${image.media_filename}#t=1`" type="video/mp4">
              </video>
              <ComponentPreLoader style="position: absolute;top: 40%;left: 45%" v-if="videoLoader"></ComponentPreLoader>
              <q-btn round flat v-else-if="!videoPlaying && !replay" icon="far fa-play-circle" size="xl" class="text-white play-button q-px-md q-py-sm" @click="playVideo(image.id)"></q-btn>
              <q-btn round flat v-else-if="replay" icon="fas fa-redo" size="xl" class="text-white play-button q-px-md q-py-sm" @click="playVideo(image.id)"></q-btn>
            </div>
            <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut" v-if="isDoubleTapped">
              <q-icon class="text-center heart" style="position: absolute;top:50%;left:50%;font-size: 100px;" color="primary"></q-icon>
            </transition>
          </q-carousel-slide>
        </q-carousel>

        <!-- Bottom Action Buttons -->
        <q-card-actions class="text-grey row" align="around">
            <q-btn flat :icon="likeStatus ? 'fas fa-heart' : 'far fa-heart'" :class="likeStatus ? 'liked' : ''" :ripple="false" @click="likePost" class="col-3 q-pa-none">
              <span class="text-capitalize q-px-sm" @click.stop="triggerLikeModal(true)">{{likeCount}}</span>
            </q-btn>
            <q-btn flat icon="far fa-comment-dots" :ripple="false" @click="openCommentDialog" class="col-3 q-pa-none">
              <span class="text-capitalize q-ml-sm">{{commentNum}}</span>
            </q-btn>
            <q-btn flat icon="fas fa-share" :ripple="false" @click="onShare" class="col-3 q-pa-none">
              <span class="text-capitalize q-ml-xs" v-if="$route.name !== 'PublicProfile' && $store.getters['user/getCurrentLanguage'] !== 'elel'">{{$t('share')}}</span>
            </q-btn>
        </q-card-actions>

        <!-- Comments Dialog Box -->
        <q-dialog v-model="commentDialog" :maximized="this.$q.platform.is.mobile" :persistent="this.$q.platform.is.mobile" :transition-show="this.$q.platform.is.mobile ? 'slide-left' : ''" :transition-hide="this.$q.platform.is.mobile ? 'slide-right' : ''">
          <q-card :style="{'min-height': this.$q.platform.is.desktop ? '600px' : '', 'max-height': this.$q.platform.is.desktop ? '800px' : ''}">
            <q-toolbar style="z-index: 5000;" class="borderline">
              <q-btn
                flat
                round
                dense
                v-close-popup
                icon="keyboard_arrow_left"
              />
              <!-- Header Title -->
              <q-toolbar-title v-close-popup>
                <h6 class="q-my-none comment-title" >{{$t('moments.title.comments')}}</h6>
              </q-toolbar-title>
            </q-toolbar>
            <q-card-section v-if="this.comments !== null" class="q-pa-none" :style="{'min-height': this.$q.platform.is.desktop ? '520px' : ''}">
              <!-- A comment -->
              <div v-if="this.commentArray.length > 0">
                <div v-for="(comment, index) in this.commentArray" :key="index">
                  <q-item>
                    <!-- Avatar-->
                    <q-item-section avatar @click="openBackerProfile(comment.user.uuid)">
                      <q-avatar >
                        <img :src="comment.user.avatarImage" class="responsive profile-img"/>
                      </q-avatar>
                    </q-item-section>
                    <!-- User's name and comment -->
                    <q-item-section>
                      <q-item-label lines="1" class="text-weight-medium" @click="openBackerProfile(comment.user.uuid)">{{comment.user.standard_username}}</q-item-label>
                      <q-item-label class="text-grey-9">{{comment.comment}}</q-item-label>
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

            <!-- Comment Box -->
            <q-card-actions class="borderline q-py-sm q-pb-lg" :class="$q.platform.is.mobile ? 'fixed-bottom' : ''">
              <q-input type="text" class="full-width q-px-md q-pr-xl bg-white" ref="inputBox" autogrow v-model="commentBox" :placeholder="$t('chat.entercomments')" rows="1" borderless dense rounded standout>
                <template v-slot:after>
                  <q-btn icon="send" :loading="commentSending" color="primary" style="width: 40px; height: 40px; position: absolute; bottom: 20px; right: 20px;" round @click.native="comment()"></q-btn>
                </template>
              </q-input>
            </q-card-actions>
          </q-card>
        </q-dialog>

       <!-- Dialog Likes -->
       <dialog-moment-likes :trigger="likeModal" :momentId="Id" :likes="`${loveCount}`" @on-close="triggerLikeModal" @trigger-login-signup="triggerGuestMode"></dialog-moment-likes>

       <!-- More Options Dialog -->
       <q-dialog v-model="modalMoreOptions" auto-close position="bottom" class="moreOptions" transition-show="slide-up">
        <q-card style="width:400px;">
          <q-card-section >
            <q-btn v-if="userInfo.uuid !== $store.getters['user/getUserUuidState']" flat class="full-width q-py-xs text-weight-medium" @click="onBlock" text-color="red" no-caps><p>{{$t('block')}}</p></q-btn>
            <q-btn v-if="userInfo.uuid === $store.getters['user/getUserUuidState']" flat class="full-width q-py-xs text-weight-medium" text-color="red" @click="onDelete" no-caps><p>{{$t('delete')}}</p></q-btn>
            <q-btn v-else-if="$store.getters['user/getUserUuidState']" flat class="full-width q-py-xs text-weight-medium" text-color="red" @click="triggerReportDialog(true, $t('report.this.post'), $t('why.are.you.reporting.this.post'), $t('button.submit'), $t('button.cancel'), 1, true)" no-caps><p>{{$t('report')}}</p></q-btn>
            <q-btn flat class="full-width q-py-xs text-weight-medium" text-color="black" @click="onShare" no-caps><p>{{$t('share')}}</p></q-btn>
            <div><q-separator/></div>
            <q-btn flat class="full-width q-py-xs text-weight-bold" text-color="black" id="closeBtn" no-caps>{{$t('close')}}</q-btn>
          </q-card-section>
        </q-card>
       </q-dialog>

       <!-- Block Dialog -->
       <dialog-block :trigger="blockModal" :type="'pet'" :momentId="Id" :blockUserUuid="userInfo && userInfo.uuid ? userInfo.uuid : null" @on-close="triggerBlockModal" @on-block="onBlockMoment"></dialog-block>

       <!-- Report Pet Dialog -->
       <dialog-report :trigger="promptModal" :type="typeCode" :title="promptTitle" :message="promptMessage" :persistent="promptPersistant" :okButtonLabel="okBtnLabel" :cancelButtonLabel="canceblBtnLabel" @on-ok="onPromptOk" @on-cancel="onPromptCancel" @on-close="triggerReportDialog"></dialog-report>

       <!-- Share Dialog -->
       <q-dialog v-model="sharingDialog" auto-close  position="bottom" class="moreOptions" transition-show="slide-up">
          <social-share-card :detail="this.details" :shareLink="parseInt(this.type) === 6 ? `${$t('link.href.petbacker')}/stories/${Id}` : `${$t('link.href.petbacker')}/moments/${Id}`"></social-share-card>
       </q-dialog>
    </q-card>
</template>
<script>
import moment from 'moment'
import momentMixin from '../../mixins/momentMixin.js'

export default {
  mixins: [momentMixin],
  props: {
    Id: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    userInfo: {
      type: Object,
      default: null,
      required: true
    },
    images: {
      type: Array,
      default: null,
      required: true
    },
    type: {
      type: String,
      default: null,
      required: true
    },
    timeCreated: {
      type: String,
      default: null,
      required: true
    },
    title: {
      type: String,
      default: null,
      required: true
    },
    subTitle: {
      default: null,
      required: true
    },
    description: {
      type: String,
      default: null
    },
    details: {
      type: String,
      default: null,
      required: true
    },
    commentCount: {
      type: Number,
      default: 0,
      required: true
    },
    loveCount: {
      type: Number,
      default: 0,
      required: true
    },
    liked: {
      type: Boolean,
      default: false,
      required: true
    },
    sliderIndex: {
      type: Number,
      default: 0
    },
    share_url: {
      type: String,
      default: '',
      required: true
    }
  },
  components: {
    'social-share-card': () => import('components/DialogShare.vue'),
    'dialog-moment-likes': () => import('components/Moments/DialogLikes.vue'),
    'dialog-report': () => import('components/DialogReport.vue'),
    'dialog-block': () => import('components/DialogBlock.vue')
  },
  data () {
    return {
      slide: this.sliderIndex,
      likeCount: this.loveCount,
      commentNum: this.commentCount,
      commentDialog: false,
      likeStatus: this.liked,
      commentSending: false,
      modalMoreOptions: false,
      aspectRatio: 4 / 3,
      commentArray: [],
      videoPlaying: false,
      mounted: false,
      replay: false,
      sharingDialog: false,
      firstClickTime: null,
      isDoubleTapped: false,
      reportedReasons: '',
      videoLoader: false,
      likeModal: false,
      promptModal: false,
      blockModal: false,
      typeCode: 1,
      promptMessage: '',
      promptTitle: '',
      okBtnLabel: this.$t('ok'),
      canceblBtnLabel: this.$t('close'),
      promptPersistant: false
    }
  },
  mounted () {
    this.mounted = true
  },
  computed: {
    parsedDetails () {
      // filter out links from details to be clickable
      return this.details.replace(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g, function (link) { /* eslint-disable-line */
        return '<a target="_blank" href="' + link + '">' + link + '</a>'
      })
    }
  },
  methods: {

    moreoptions () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.triggerGuestMode()
        return
      }
      this.modalMoreOptions = true
    },
    triggerLikeModal (status) {
      this.likeModal = status
    },
    onDelete () {
      this.$axios.delete(`moments/${this.Id}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$q.notify({
          message: this.$t('moment.delete.successful'),
          position: 'top',
          type: 'positive'
        })
        this.$emit('on-remove', this.index)
      }).catch((error) => {
        console.error(error)
      })
    },
    openStory () {
      if (parseInt(this.type) === 6) {
        this.openUrl(`${this.$t('link.href.petbacker')}${this.share_url}`)
      }
    },
    /* onReport () {
      this.$q.dialog({
        title: this.$t('report'),
        message: this.$t('why.reporting.this.post'),
        prompt: {
          model: this.reportedReasons,
          isValid: val => val.length > 2,
          type: 'text'
        },
        cancel: true
      }).onOk(data => {
        this.submitReport(data)
      }).onCancel(() => {
      })
    }, */
    onPromptCancel () {
      this.triggerReportDialog(false)
    },
    onPromptOk (message) {
      this.submitReport(message)
    },
    submitReport (reportReason) {
      let info = {
        'reportInfo': {
          'comment': reportReason
        }
      }

      this.$axios.post(`users/${this.$store.getters['user/getUserUuidState']}/report/${this.userInfo.uuid}`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$q.notify({
          message: this.$t('report.submitted'),
          position: 'top'
        })
      }).catch((error) => {
        console.error(error)
      })
    },
    onDoubleTap () {
      if (this.firstClickTime > 0) {
        let timeBetweenTap = Date.now() - this.firstClickTime
        if (timeBetweenTap <= 1500) {
          this.firstClickTime = null

          if (!this.likeStatus) {
            this.likePost()
          }
        } else {
          this.firstClickTime = Date.now()
        }
      } else {
        this.firstClickTime = Date.now()
      }
    },
    pauseVideo (num) {
      if (this.videoPlaying) {
        this.videoPlaying = false
        this.$refs[num][0].pause()
      } else {
        this.playVideo(num)
      }
    },
    playVideo (num) {
      if (!this.videoPlaying) {
        this.sendImpression('Play video', 'Video Play button', 'Moments')
        this.videoPlaying = true

        let playPromise = null
        if (this.$refs[num]) {
          if (this.$refs[num][0]) {
            playPromise = this.$refs[num][0].play()
          } else {
            playPromise = this.$refs[num].play()
          }
        }

        if (playPromise !== null) {
          playPromise.catch(_ => {
            this.videoPlaying = false
          })
        }
        this.replay = false
      } else {
        this.videoPlaying = false
      }
    },
    onShare () {
      this.sharingDialog = true
    },
    triggerGuestMode (routeName) {
      this.$emit('trigger-login-signup', routeName)
    },
    openBackerProfile (userUUID) {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.$emit('trigger-login-signup', 'ViewPublicProfile')
        return
      }

      this.$router.push({name: 'PublicProfile', params: {userId: userUUID}})
    },
    comment () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.$emit('trigger-login-signup', 'CommentMoment')
        return
      }

      this.commentSending = true

      if (!this.commentBox) {
        setTimeout(() => {
          this.commentSending = false
        }, 1500)
        return
      }

      let comment = {
        'user': {
          'standard_username': this.$store.getters['user/getUserName'],
          'avatarImage': this.$store.getters['user/getUserAvatarImage'],
          'uuid': this.$store.getters['user/getUserUuidState']
        },
        'comment': this.commentBox,
        'created_time': moment().utc()
      }

      this.submitComment(this.Id).then((commentInfo) => {
        this.commentArray = this.commentArray.concat(comment)
        this.commentNum += 1
        this.commentBox = null
      }).finally(_ => {
        this.commentSending = false
      })
    },
    computeRatio () {
      // to compute aspect ration (follow first image)
      if (typeof (this.$refs[this.images[0].id][0]) === 'undefined') {
        return
      }

      let naturalHeight = 0, naturalWidth = 0
      if (this.images[0].content_type === 'image') {
        naturalHeight = this.$refs[this.images[0].id][0].image.naturalHeight
        naturalWidth = this.$refs[this.images[0].id][0].image.naturalWidth
      } else if (this.images[0].content_type === 'video') {
        this.videoLoader = false
        naturalHeight = this.$refs[this.images[0].id][0].videoHeight
        naturalWidth = this.$refs[this.images[0].id][0].videoWidth
      }

      if (naturalHeight > naturalWidth) {
        this.aspectRatio = 4 / 5
      } else if (naturalWidth > naturalHeight) {
        this.aspectRatio = 4 / 3
      } else {
        this.aspectRatio = 1
      }
    },
    openCommentDialog () {
      this.commentDialog = true
      this.getComments(this.Id).then((commentsInfo) => {
        this.commentArray = commentsInfo.reverse()
      })
    },
    likePost () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.$emit('trigger-login-signup', 'LikeMoment')
        return
      }

      if (this.likeStatus) {
        this.likeStatus = false
        this.likeCount -= 1
        // unlike a post
        this.$emit('unlike-post', this.Id)
      } else {
        // like a post
        this.likeStatus = true
        this.isDoubleTapped = true
        setTimeout(() => {
          this.isDoubleTapped = false
        }, 150)
        this.likeCount += 1
        this.$emit('like-post', this.Id)
      }
    },
    computeTime (time) {
      return moment.utc(time).local().fromNow()
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
.video-progress
  position: absolute
  bottom: 0px
  left: 0px

.play-button
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

.video-uploaded
  width: 100%
  object-fit: cover

.comment-title
  margin-left: 15%

.desktop-cover-image
  width: 160px
  height: 160px

.mobile-cover-image
  width: 110px
  height: 110px

@media screen and (min-width: 355px)
  .comment-title
    margin-left: 23%

@media screen and (min-width: 410px)
  .comment-title
    margin-left: 30%

.heart {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: url(../../statics/heart-animation.png) no-repeat;
  background-position: 0 0;
  zoom: 2;
  cursor: pointer;
  animation: fave-heart 1s steps(28);
}

@keyframes fave-heart {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -2800px 0;
  }
}
</style>
