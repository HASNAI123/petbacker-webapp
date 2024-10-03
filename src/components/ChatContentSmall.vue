<template>
  <div style="margin-top: 100px;margin-bottom: 25%; user-select: none;" ref="chat-container">
    <q-infinite-scroll @load="onLoad" reverse ref="chat-infinite-scroll" class="q-px-xs" v-scroll="scrolled">
      <template slot="loading" v-if="!hideLoader">
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>
      <div style="user-select: none;" class="row q-py-sm" v-for="msg in messages" id="container" :key="msg.id" :class="msg.userInfo.id !== $store.state.user.uuid ? '' : 'justify-end'">
        <div
        class="col-xs-9"
  v-if="msg.contentType.toLowerCase() === 'text'"
  style="user-select: none;"
>
          <q-chat-message
    :name="msg.userInfo.id === $store.state.user.uuid ? '' : capitalized(msg.userInfo.username)"
    v-if="!msg.content.includes('click to view')"
    :bg-color="msg.userInfo.id === $store.state.user.uuid ? 'green-5' : 'grey-3'"
    :sent="msg.userInfo.id === $store.state.user.uuid ? true : false"
  >
            <template v-slot:avatar>
              <img :class="msg.userInfo.id === $store.state.user.uuid ? 'q-message-avatar q-message-avatar--sent' : 'q-message-avatar q-message-avatar--received'" @click="openBackerListing(msg.userInfo.id)" :src="msg.userInfo.id === $store.state.user.uuid ? '' : msg.userInfo.avatarImage" />
            </template>
            <p
  @touchstart="startLongPress(msg.content,msg.userInfo.id,msg.id)"
  @touchend="stopLongPress"
  style="user-select: none;"
  :class="['text-weight-regular', 'q-my-none', 'q-pa-xs', 'font-normal', msg.userInfo.id === $store.state.user.uuid ? 'white-link' : '']"
  :style="{color: msg.userInfo.id === $store.state.user.uuid ? 'white' : 'grey'}"
  v-html="linkifyText(msg)"
></p>

          </q-chat-message>
          <q-chat-message
            v-else
            :name="msg.userInfo.id === $store.state.user.uuid ? '' : capitalized(msg.userInfo.username)"
            :sent="msg.userInfo.id === $store.state.user.uuid ? true : false"
            :bg-color="msg.userInfo.id === $store.state.user.uuid ? 'green-5' : 'grey-3'"
            :avatar="msg.userInfo.id === $store.state.user.uuid ? '' : msg.userInfo.avatarImage"
            >
            <span class="cursor-pointer text-primary" @click="updateForYourProtectionState(true)">
            {{ msg.content }}
            </span>
          </q-chat-message>

          <div><small class="text-neutral" style="margin-left: 16%" :style="{float: msg.userInfo.id === $store.state.user.uuid? 'right' : 'left'}">{{ parseReadableDate(msg.createdDate, 'time') }}</small></div>

        </div>
        <!-- Moment -->
        <div   class="col-12"  v-if="msg.contentType.toLowerCase() === 'moment'">
          <q-chat-message
          style="padding-left: 30px; padding-right: 25px;"
          :style="{ 'padding-bottom': jsonMsgContent(msg.content, 'service') && jsonMsgContent(msg.content, 'service').includes('Walking') ? '30px' : '0' }"
            :bg-color="'white'"
            text-sanitize
            >
            <div  style="border-radius: 5px; border: 1.5px solid #9b89ba; width:301px" class="d-flex align-items-center ">
              <div style="margin: 0px;" class="row d-flex align-items-start">
                <div class=" avatar_div"><img style="padding: 7px;" class="avatarImage" :src="jsonMsgContent(msg.content, 'media')" alt=""></div>
                <div style="padding-top: 9px; padding-left: 0px;" class="col-9">
                  <div class="service">{{ jsonMsgContent(msg.content, 'service') }}</div>
                  <div class="description" >{{ jsonMsgContent(msg.content, 'description') }}</div>
                </div>
                <!-- <pre>{{ msg.content }}</pre> -->
              </div>
              <div class="d-flex flex-column">
                <button class="update_btn mt-2" style="background-color: #9b89ba; color: white; width:300px "   @click="goToMoment(jsonMsgContent(msg.content, 'moment_id'))" >{{$t('job.update.view')}}</button>
              </div>
            </div>
          </q-chat-message>
        </div>
        <!-- Images -->
        <div class="col-xs-9 q-ml-lg" style="padding: 0; margin: 0; user-select: none;" v-if="msg.contentType.toLowerCase() === 'image'"
        @touchstart="startLongPress(msg.content,msg.userInfo.id,msg.id)"
  @touchend="stopLongPress"
  >
          <q-chat-message
            :name="msg.userInfo.id === $store.state.user.uuid ? '' : capitalized(msg.userInfo.username)"
            :sent="msg.userInfo.id === $store.state.user.uuid ? true : false"
            :bg-color="msg.userInfo.id === $store.state.user.uuid ? 'green-5' : 'grey-3'"
            :avatar="msg.userInfo.id === $store.state.user.uuid ? '' : msg.userInfo.avatarImage"
            text-sanitize
            >
            <img class="responsive cursor-pointer image-upload" style="max-height:300px;" :src="msg.content" :alt="$t('placeholder.chat.image')" @click="showImage(msg.content)">
          </q-chat-message>
          <div><small class="text-neutral" style="margin-left: 16%" :style="{float: msg.userInfo.id === $store.state.user.uuid? 'right' : 'left'}">{{ parseReadableDate(msg.createdDate, 'time') }}</small></div>
        </div>
        <!-- Video -->
        <message-video v-if="msg.contentType.toLowerCase() === 'video'" :messageInfo="msg" :formattedTime="parseReadableDate(msg.createdDate, 'time')"></message-video>
        <!-- Title -->
        <div class="text-center col-xs-12 cursor-pointer" v-if="msg.contentType.toLowerCase() === 'title'" @click="tapSeeDetails(msg.content)" style="line-height: 0.7;">
          <message-title :messageId="msg.id" :contentInfo="JSON.parse(msg.content)" :timeStamp="parseReadableDate(msg.createdDate, 'date-time')"></message-title>
        </div>
      </div>
      <div class="row q-py-sm" v-for="msg in tempMessages" id="container" :key="msg.id" :class="tempMessages.length && msg.userInfo.id !== $store.state.user.uuid ? '' : 'justify-end'">
        <div class="col-xs-9" v-if="msg.contentType.toLowerCase() === 'text'">
          <q-chat-message
            :class="'opacity-low-removed'"
            :name="msg.userInfo.id === $store.state.user.uuid ? '' : capitalized(msg.userInfo.username)"
            v-if="!msg.content.includes('click to view')"
            :bg-color="msg.userInfo.id === $store.state.user.uuid ? 'green-5' : 'grey-3'"
            :sent="msg.userInfo.id === $store.state.user.uuid ? true : false"
            >
            <template v-slot:avatar>
              <img :class="msg.userInfo.id === $store.state.user.uuid ? 'q-message-avatar q-message-avatar--sent' : 'q-message-avatar q-message-avatar--received'" @click="openBackerListing(msg.userInfo.id)" :src="msg.userInfo.id === $store.state.user.uuid ? '' : msg.userInfo.avatarImage" />
            </template>
            <p class="text-weight-regular q-my-none q-pa-xs font-normal" :class="msg.userInfo.id === $store.state.user.uuid ? 'white-link' : ''" :style="{color: msg.userInfo.id === $store.state.user.uuid ? 'white' : 'grey'}" v-html="linkifyText(msg)"></p>
          </q-chat-message>
          <q-chat-message
            v-else
            :name="msg.userInfo.id === $store.state.user.uuid ? '' : capitalized(msg.userInfo.username)"
            :sent="msg.userInfo.id === $store.state.user.uuid ? true : false"
            :bg-color="msg.userInfo.id === $store.state.user.uuid ? 'green-5' : 'grey-3'"
            :avatar="msg.userInfo.id === $store.state.user.uuid ? '' : msg.userInfo.avatarImage"
            >
            <span class="cursor-pointer text-primary" @click="updateForYourProtectionState(true)">
            {{ msg.content }}
            </span>
          </q-chat-message>
          <div>
            <small class="text-neutral" style="margin-left: 16%" :style="{float: msg.userInfo.id === $store.state.user.uuid? 'right' : 'left'}">
              <!-- <q-btn v-if="msg.sending !== 1" small flat class="resend" color="primary">resend</q-btn> -->
              <!-- {{ parseReadableDate(msg.createdDate, 'time') }} -->
              <q-icon name="fas fa-clock" />
            </small>
          </div>
        </div>
      </div>
    </q-infinite-scroll>
    <q-card v-if="showYellowBar && $route.name === 'Chat'" class="bg-amber-2 fixed-bottom text-center q-px-sm amber-bottom-card" style="height: 33px; z-index: 1; line-height: 0.8em;padding-top:2px" @click="dialogBenefits = true">
      <small v-html="$t('all.payment.via.petbacker')"></small>
    </q-card>
    <q-card v-else-if="showYellowBar && $route.name === 'JobChat'" class="bg-amber-2 fixed-bottom text-center q-px-sm amber-bottom-card" style="height: 33px; z-index: 1; line-height: 0.8em;padding-top:2px" @click="dialogJobScam = true">
      <small v-html="$t('job.chat.bottom.message')"></small>
    </q-card>
    <!-- Message Bar -->
    <div class="row fixed-bottom bg-white q-py-md q-px-xs z-fab" @click="openMessageTemplateModal" v-if="template === 1" :style="{paddingBottom: $q.platform.is.cordova ? '5%' : '', boxShadow: showYellowBar ? '' : '0px -9px 50px 0px rgba(220, 220, 220, 0.55)'}">
      <div style="width: 75%; margin-left: 5%">
        <q-input type="text" ref="inputBox" disable autogrow :placeholder="$t('send.a.message')" rows="1" borderless dense rounded standout></q-input>
      </div>
      <div style="width: 20%;">
        <q-btn icon="camera_alt" disable :loading="pictureUploading" color="primary" style="width: 45px; height: 45px; position: absolute; right: 20px" round @click="onFileSelection" v-if="isEmptyOrSpaces(messageBox)"/>
        <q-btn icon="send" disable color="primary" style="width: 45px; height: 45px; position: absolute; right: 20px" round v-else @click.native="send()"/>
      </div>
    </div>
    <div class="row fixed-bottom bg-white q-py-md q-px-xs z-fab" v-else :style="{paddingBottom: $q.platform.is.cordova ? '5%' : '', boxShadow: showYellowBar ? '' : '0px -9px 50px 0px rgba(220, 220, 220, 0.55)'}">
      <div style="width: 75%; margin-left: 5%">
        <q-input type="text" ref="inputBox" autogrow v-model="messageBox" :placeholder="$t('send.a.message')" rows="1" borderless dense rounded standout></q-input>
        <!-- <q-input type="text" ref="inputBox" v-on:blur="$refs.inputBox.$el.focus()" autogrow v-model="messageBox" :placeholder="$t('send.a.message')" rows="1" borderless dense rounded standout></q-input> -->
      </div>
      <div style="width: 20%;">
        <q-btn icon="camera_alt" :loading="pictureUploading" color="primary" style="width: 45px; height: 45px; position: absolute; right: 20px;bottom: 15px;" round @click="openModal" v-if="isEmptyOrSpaces(messageBox)"/>
        <q-btn icon="send" color="primary" style="width: 45px; height: 45px; position: absolute; right: 20px; bottom: 15px;" round v-else  @click.native="send()"/>
      </div>
    </div>
    <input type="file" multiple disable @change="onFileChange" accept=".jpg,.jpeg,.png" ref="selectedFile" style="display: none;">
    <LightBox
      v-if="lightBoxImages.length > 0"
      :media="lightBoxImages"
      ref="lightbox"
      :show-caption="false"
      :show-light-box="false"
      ></LightBox>

      <!-- Image Selection Option -->
     <dialog-image-source v-model="showModal" @option-selected="handleOptionSelected" @close-dialog="handleCloseDialog" ></dialog-image-source>

    <!-- Membership Pop Up -->
    <dialog-membership :trigger="membershipModal" @on-close="closeMembershipModal"></dialog-membership>
    <!-- Sponsored Pop Up -->
    <dialog-sponsored :trigger="sponsoredModal" @on-close="closeSponsoredModal"></dialog-sponsored>
    <!-- Dialog Benefits -->
    <dialog-benefits :trigger="dialogBenefits" @on-close="closeDialogBenefits" v-if="$route.name === 'Chat'"></dialog-benefits>
    <!-- Dialog Job Scam Pop up -->
    <dialog-jobscam :trigger="dialogJobScam" @on-close="closeDialogJobScam" v-else></dialog-jobscam>
    <!-- For Your Protection Pop Up -->
    <dialog-foryourprotection @trigger-updated="updateForYourProtectionState" :trigger="forYourProtection" :requestId="parseInt($route.params.request)" :responseId="parseInt($route.params.response)"></dialog-foryourprotection>
    <!-- Message Template -->
    <message-template style="user-select: none;" v-if="responseInfo" :trigger="messageTemplate" @trigger-updated="updateMessageTemplate" :whySeeingThis="responseInfo ? responseInfo.whySeeingThis : ''" :whySeeingThisLink="responseInfo ? responseInfo.whySeeingThisLink : ''" @send-message="send" ></message-template>
    <!-- Floating Action Button -->
    <button-petwalking v-if="responseInfo && responseInfo.bookStatus === 1" :serviceId="responseInfo.requestInfo.serviceId" :taskId="parseInt(responseInfo.id)" :personalItems="responseInfo.requestInfo.personalItemsInfo && responseInfo.requestInfo.personalItemsInfo.items" :hide="!keyboardStatus"></button-petwalking>

     <!-- Report  Dialog -->
     <q-dialog v-model="reportModal" :content-css="{width: 'auto', height: 'fit-content', background: 'transparent', boxShadow: 'none'}">
      <q-card style="overflow: visible; border-radius: 11px;">
        <q-card-section style="min-height: 150px;min-width: 250px;max-width: 280px;" class="q-px-none q-py-sm">
          <div class="tip-bulb">
              <img src="statics/images/logo-mid.jpg" class="tip-bulb-image">
          </div>
          <div class="bg-white q-mt-lg">
              <div class="row justify-center">
                <div class="col-12 text-center q-pa-md tip-desc">
                  <h6 class="q-my-none q-mb-md" v-if="title">{{title}}</h6>
                  <span style="white-space: pre-wrap;">{{promptMessage}}</span> <br><br>
                  <span style="white-space: pre-wrap; font-size:14px">{{DataPrivacy}}</span>
                </div>
              </div>
              <q-input color="primary" autofocus type="text" class="q-px-md q-pb-md" v-model="reportmsg"></q-input>
              <div class='full-width q-px-md'>
                <q-btn class="full-width text-capitalize q-my-sm" color="primary" :label="$t('ok')"  @click="onOk()" ></q-btn>
                <q-btn class="full-width text-capitalize q-my-sm" color="primary" outline  :label=" $t('close')" @click="onCancel"></q-btn>
              </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialog" transition-show="slide-up" transition-hide="slide-down" position="bottom">
  <q-card>
      <q-btn style="padding-left:20px; padding-top:10px;" flat round dense @click="dialog = false">
  <q-icon name="close" />
</q-btn>
    <q-card-section class="column justify-center">
      <q-item v-if="currentuserid == this.$store.state.user.uuid" clickable @click="deleteText(selectedMsgId)">
        <q-item-section side>
          <q-icon name="delete" color="primary" />
        </q-item-section>
        <q-item-section>
          Delete Message
        </q-item-section>
      </q-item>

      <q-separator />

      <q-item clickable @click="Copy(copytext)">
        <q-item-section side>
          <q-icon name="content_copy" color="primary" />
        </q-item-section>
        <q-item-section>
          Copy Message
        </q-item-section>
      </q-item>

      <q-separator />

      <q-item v-if="currentuserid !== this.$store.state.user.uuid" clickable @click="report(selectedMsgId)">
        <q-item-section side>
          <q-icon name="report_problem" color="primary" />
        </q-item-section>
        <q-item-section>
          Report Message
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</q-dialog>
  </div>
</template>

<script>
require('vue-image-lightbox/dist/vue-image-lightbox.min.css')
import chatMixin from '../mixins/chatMixin'
import LightBox from 'vue-image-lightbox'
import moment from 'moment'
import requestStatus from 'assets/request-status.json'
import ImageUploadMixin from '../mixins/imageUploadMixin.js'
import JSON5 from 'json5'
import clipboard from '../mixins/copyClipboardMixin.js'

export default {
  mixins: [chatMixin, ImageUploadMixin, clipboard],
  components: {
    LightBox,
    'message-title': () => import('components/Chat/Title.vue'),
    'message-video': () => import('components/Chat/Video.vue'),
    'dialog-foryourprotection': () => import('components/ModalForYourProtection.vue'),
    'message-template': () => import('components/MessageTemplate.vue'),
    'dialog-sponsored': () => import('components/Chat/DialogSponsoredPrompt.vue'),
    'dialog-membership': () => import('components/Chat/DialogMembershipPrompt.vue'),
    'dialog-benefits': () => import('components/DialogBenefits.vue'),
    'dialog-jobscam': () => import('components/DialogJobScam.vue'),
    'button-petwalking': () => import('components/Chat/FloatActionButton.vue'),
    'dialog-image-source': () => import('components/ImageUpload/DialogPhotoSource.vue'),
    'dialog-error': () => import('components/DialogError.vue'),
    'dialog-report': () => import('components/DialogReport.vue')
  },
  props: {
    responseInfo: {
      required: true
    },
    trigger: {
      type: Boolean,
      required: true
    },
    messageInfo: {
      required: true
    },
    template: {
      type: Number,
      required: true,
      default: 0
    },
    'open-quote-details': {
      type: Boolean
    }
  },
  data () {
    return {
      DataPrivacy: this.$t('data.privacy'),
      reportmsg: null,
      currentuserid: null,
      msgid: null,
      reportModal: false,
      promptMessage: this.$t('why.report.message'),
      title: this.$t('report'),
      typeCode: 0,
      okBtnLabel: this.$t('ok'),
      canceblBtnLabel: this.$t('close'),
      promptPersistant: false,
      dialog: false,
      selectedMsgId: null,
      copytext: null,
      scrolling: false,
      errorStatus: true,
      errorMessage: '',
      longPressTimer: null,
      imagesource: null,
      showModal: false,
      sponsoredModal: false,
      membershipModal: false,
      dialogBenefits: false,
      dialogJobScam: false,
      lightBoxImages: [],
      lightBoxIndex: 0,
      showYellowBar: true,
      forYourProtection: false,
      currentDate: null,
      pictureUploading: false,
      messageTemplate: false,
      messageTemplateInfo: null,
      STATUS: requestStatus,
      messageDialog: false,
      reserve: false,
      timeDialog: false,
      serviceStart: moment().format('YYYY-MM-DD'),
      serviceStartFormat: moment(this.serviceStart).format('Do MMMM, YYYY'),
      serviceStartTime: moment().format('HH:mm'),
      serviceStartTimeFormat: moment(this.serviceStartTime).format('LT'),
      today: moment(),
      chatEnable: false,
      locationSelect: '',
      locationDialog: false,
      isLocationSet: false,
      responseMessageDialog: null,
      readMoreUrl: null,
      templateMessage: '',
      petSelectionDialog: false,
      personalItems: [],
      petSelected: [],
      whySeeingThisModal: false,
      hideLoader: false,
      previousScrollPosition: 0,
      keyboardStatus: false,
      tempMessage: null,
      tempMessages: [],
      unsentMessages: null,
      resendTitle: null,
      interval: null
    }
  },
  computed: {
    currentTime () {
      return this.templateMessage.toString().replace('{time}', `${this.serviceStartFormat}, ${this.serviceStartTimeFormat}`)
    },
    currentLocation () {
      return this.templateMessage.toString().replace('{location}', `${this.locationSelect}`)
    },

    jsonMsgContent () {
      return (value, key) => {
        let fixedStr = value
        try {
          let jsonObj = JSON5.parse(fixedStr.replace(/=/g, ':').replace(/;/g, ','))
          console.warn('JSON string fixed successfully.')
          if (key) {
            return jsonObj[key]
          } else {
            return jsonObj
          }
        } catch (error) {
          console.warn('Invalid JSON string. Attempting to fix...')
          console.log('check JSON now', fixedStr)
          try {
            fixedStr = fixedStr.replace(/description\s*=\s*([^;]+);/g, '"description": "$1",')
            let jsonObj = JSON5.parse(fixedStr.replace(/=/g, ':').replace(/;/g, ','))
            console.warn('JSON string fixed successfully.')
            if (key) {
              return jsonObj[key]
            } else {
              return jsonObj
            }
          } catch (error) {
            console.error('Failed to fix JSON string.')
            return null
          }
        }
      }
    }

  },
  watch: {
    messageInfo (newValue, oldValue) {
      // this.retrySend()
      // this.makeResendMessages()
      if ((newValue && newValue.length > 0 && oldValue && oldValue.length > 0 && (newValue[newValue.length - 1].id !== oldValue[oldValue.length - 1].id)) || oldValue === null || (oldValue && oldValue.length === 0)) {
        this.tempMessages = []
        // this.$q.localStorage.remove(this.resendTitle, this.tempMessages)
        // check latest
        this.updateChatContent()
        if (newValue && newValue.length > 0 && newValue[newValue.length - 1].contentType === 'title') {
          this.$emit('refresh-content')
        }
      } else {
        /*  setTimeout(() => {
          this.scrollToBottom()
        }, 150) */
      }
    },
    responseInfo (value) {
      if (this.$route.name === 'Chat' && value.acceptanceStatus === 1) {
        if (value.serviceInfo.userInfo.proVerified === 1) {
          this.sponsoredModal = true
        } else if (value.isMembershipQuote === 1) {
          this.membershipModal = true
        }
      }
    }
  },
  created () {
    this.$store.commit('user/updateUserFooterVisibilityState', false)
    this.updateChatContent()

    document.addEventListener('focusin', this.focusIn)
    document.addEventListener('focusout', this.focusOut)
  },
  mounted () {
    switch (this.$route.name) {
      case 'Chat':
        this.resendTitle = `resend||users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}/messages`
        break
      case 'JobChat':
        this.resendTitle = `resend||users/${this.$store.state.user.uuid}/tasks/${this.$route.params.taskId}/messages`
        break
    }
    setTimeout(() => {
      this.makeResendMessages()
      this.interval = setInterval(this.resend, 10000)
      setTimeout(() => {
        this.scrollToBottom()
      }, 150)
    }, 150)

    // listen to ImageUploadMixin callback (image processing)
    this.$on('image-data', (data) => {
      this.uploadImageData(data.blob)
      this.pictureUploading = true
    })

    // if (this.$q.platform.is.desktop) {
    //   window.addEventListener('keydown', (e) => {
    //     if ((this.responseInfo.useTemplate === 1 || this.template === 1) {
    //       this.openMessageTemplateModal()
    //       if (this.$refs['inputB ox'] && this.$refs['inputBox'].focused) {
    //         this.$refs['inputBox'].blur()
    //       }
    //     }
    //   })
    // }

    if (this.$route.name === 'Chat' && this.responseInfo && this.responseInfo.acceptanceStatus === 1) {
      if (this.responseInfo.serviceInfo.userInfo.proVerified === 1) {
        this.sponsoredModal = true
      } else if (this.responseInfo.isMembershipQuote === 1) {
        this.membershipModal = true
      }
    }

    this.getPersonalItems()
    this.$refs.scrollableContainer.addEventListener('scroll', this.handleScroll)
  this.$refs.scrollableContainer.addEventListener('touchmove', this.handleScroll)
  },
  beforeDestroy () {
    this.$off('image-data')
    document.removeEventListener('focusin', this.focusIn)
    document.removeEventListener('focusout', this.focusOut)
    clearInterval(this.interval)
    this.$el.removeEventListener('scroll', this.handleScroll)
  this.$el.removeEventListener('touchmove', this.handleScroll)
  },
  methods: {

    async onOk () {
      console.log('triggered test')
    this.reportModal = false
    const uuid = this.$store.state.user.uuid
    const reporteduuid = this.currentuserid
    const msgId = this.msgid
    const comment = this.reportmsg

    console.log('uuid:', uuid)
console.log('reporteduuid:', reporteduuid)
console.log('msgId:', msgId)
console.log('comment:', comment)
    const url = `/users/${uuid}/report/${reporteduuid}`
    const data = {
      reportInfo: {
        msgId,
        comment
      }
    }
    const headers = {
    'Authorization': this.$store.getters['user/authorizationHeader']
  }
  try {
    const response = await this.$axios.post(url, data, { headers })
    console.log(response)
    // handle response
  } catch (error) {
    // handle error
  }
    },

     report () {
      this.reportModal = true
      this.dialog = false
      if (this.$q.platform.is.android) {
          this.closeKeyboard()
        }
    },
    onCancel () {
      this.reportModal = false
    },
    Copy (text) {
      console.log('check text', text)
      this.onCopy(text)
      this.dialog = false
  },
    async deleteMessage (messageId) {
    try {
      await this.$store.dispatch('chat/deleteMessage', messageId)
      this.messages = this.messages.filter(msg => msg.id !== messageId)
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  },
  startLongPress (content, userid, msgId) {
    this.copytext = content
    this.msgid = msgId
    this.currentuserid = userid // Message user id Set
    if (this.scrolling) {
    return
  }

  this.longPressTimer = setTimeout(() => {
    this.onLongPress(msgId)
  }, 800) // 0.8 second
},

  stopLongPress () {
    console.log('remove detec')
      clearTimeout(this.longPressTimer)
    },
    onLongPress (msgId) {
  if (this.scrolling) {
    return
  }

  this.selectedMsgId = msgId
  this.dialog = true
},

deleteText (msgId) {
  this.dialog = false
  console.log('check route parmeter', this.$route.params.taskId)
  const payload = {
    messageInfo: {
      messagesId: [parseInt(msgId)]
    }
  }
  switch (this.$route.name) {
    // Delete Message for Request chat
      case 'Chat':
        this.$axios.delete(`users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}/messages`, {
    headers: {
      'Authorization': this.$store.getters['user/authorizationHeader']
    },
    data: payload
  })
  .then(response => {
    // handle success
    console.log('chck the response', response)
    if (response.status === 404) {
      console.log(123, response)
    }
    this.dialog = false
    this.deleteMessage(msgId)
  })
  .catch(error => {
    // handle error
    if (error.response && error.response.status === 404) {
    console.log(error.response.data.message)
    this.dialog = false
    this.$q.dialog({
  title: 'Error',
  message: error.response.data.message,
  style: {
    maxWidth: '250px' // Set the maximum width of the dialog
  },
  ok: {
    label: 'OK',
    color: 'primary'
  },
  icon: 'warning' // Set the icon of the dialog
})
  } else {
    console.log(error)
  }
  })
        break
        // Delete Message for Job chat
      case 'JobChat':
      this.$axios.delete(`users/${this.$store.state.user.uuid}/tasks/${this.$route.params.taskId}/messages`, {
    headers: {
      'Authorization': this.$store.getters['user/authorizationHeader']
    },
    data: payload
  })
  .then(response => {
    // handle success
    console.log(response)
    this.deleteMessage(msgId)
  })
  .catch(error => {
    // handle error
    console.log(error)
    this.errorStatus = true
    this.errorMessage = error.response.data.message
      // handle error
      if (error.response && error.response.status === 404) {
    console.log(error.response.data.message)
    this.$q.dialog({
  title: 'Error',
  message: error.response.data.message,
  style: {
    maxWidth: '250px' // Set the maximum width of the dialog
  },
  ok: {
    label: 'OK',
    color: 'primary'
  }
})
  } else {
    console.log(error)
  }
  })
        break
    }
},
    openModal () {
      this.showModal = true
    },
    handleCloseDialog () {
      console.log('Dialog closed.')
      this.showModal = false
      // Perform any necessary actions when the dialog is closed.
      // For example, reset any data or perform additional logic.
    },
    handleOptionSelected (selectedOption) {
      console.log('Selected Option:', selectedOption)
      this.imagesource = selectedOption // Save the selected option in the data property
      console.log('check the image source', this.imagesource)
      this.onFileSelection(this.imagesource)
      this.showModal = false // Close the modal if needed
    },
    makeResendMessages () {
      if (this.messageInfo) {
        for (let index = 0; index < this.messageInfo.length; index++) {
          const message = this.messageInfo[index]
          if (message.userInfo.id === this.$store.state.user.uuid && message.contentType === 'text') {
            // var newDate = new Date()
            this.tempMessage = JSON.parse(JSON.stringify(message))
            break
          }
        }
      }
      if (this.$q.localStorage.getItem(this.resendTitle)) {
        let failedMessages = this.$q.localStorage.getItem(this.resendTitle).failedMessages
        this.tempMessages = []
        if (failedMessages) {
          var newDate = new Date()
          for (let index = 0; index < failedMessages.length; index++) {
            const msg = failedMessages[index]
            let tempMessage = JSON.parse(JSON.stringify(this.tempMessage))
            // tempMessage.content = msg.content
            tempMessage.content = msg
            tempMessage.createdDate = newDate
            // tempMessage.id = newDate.getTime() + Math.floor(Math.random() * 6) + 1
            tempMessage.id = newDate.getTime() + index
            this.tempMessages.push(tempMessage)
          }
        }
      }
    },
    scrolled (position) {
      this.scrolling = true
      if (this.keyboardStatus && (position < this.previousScrollPosition)) {
        if (this.$q.platform.is.android) {
          this.closeKeyboard()
        }
      }
      this.previousScrollPosition = position
      clearTimeout(this.scrollTimer)
  this.scrollTimer = setTimeout(() => {
    this.scrolling = false
  }, 150) // Reset the flag 150ms after the last scroll event
    },
    goToMoment (momentId) {
      this.$router.push({name: 'MomentPost', params: {momentId: momentId}})
    },
    capitalized (string) {
      if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      }

      return string
    },
    openBackerListing (messageUserId) {
      if ((this.responseInfo && this.responseInfo.serviceInfo.id) && this.$route.name === 'Chat') {
        this.$router.push({name: 'Listing', params: {listingId: parseInt(this.responseInfo.serviceInfo.id)}, query: {id: this.responseInfo.serviceInfo.userInfo.id, url: this.responseInfo.serviceInfo.listingUrl, status: this.responseInfo.acceptanceStatus}})
      } else if (this.$route.name === 'JobChat' && this.responseInfo) {
        this.$router.push({name: 'PublicProfile', params: {userId: this.responseInfo.requestInfo.requestorInfo.id}})
      }
    },
    showImage (messageImage) {
      let index = this.galleryImages.findIndex(imageLink => imageLink === messageImage)
      if (index > -1) {
        this.$refs.lightbox.showImage(index)
      }
    },
    onPageEnd () {
      console.log('page end called!')
      this.$refs['chat-infinite-scroll'].stop()
      this.hideLoader = true
    },
    resetPagination () {
      this.$refs['chat-infinite-scroll'].reset()
    },
    onLoad (index, done) {
      setTimeout(() => {
        this.$emit('load-content', index, done)
      }, 2000)
    },
    closeMembershipModal (value) {
      this.membershipModal = value
    },
    closeSponsoredModal (value) {
      this.sponsoredModal = value
    },
    closeDialogJobScam (value) {
      this.dialogJobScam = value
    },
    closeDialogBenefits (value) {
      this.dialogBenefits = value
    },
    tapSeeDetails (content) {
      let info = JSON.parse(content.replace(/'/g, '"'))
      if (info.subtitle === 'Tap to see details') {
        this.$emit('open-quote-details', true)
      }
    },
    updateMessageTemplate (status) {
      this.messageTemplate = status
    },
    updateForYourProtectionState (status) {
      this.forYourProtection = status
    },
    openMessageTemplateModal () {
      this.messageTemplate = true
    },
    openFaqTab () {
      this.openUrl(this.responseInfo.whySeeingThisLink)
    },
    checkBlock () {
      if (this.responseInfo.useTemplate === 1 || this.template === 1) {
        this.openMessageTemplateModal()
        if (this.$refs['inputBox'] && this.$refs['inputBox'].focused) {
          this.$refs['inputBox'].blur()
        }
      }
    },
    openNewTab () {
      this.openUrl(this.readMoreUrl)
    },
    checkDate (serviceStart) {
      return moment(serviceStart).format('YYYY-MM-DD') >= moment(this.today).format('YYYY-MM-DD')
    },
    sendTimeMessage (responseMessage, url, message) {
      this.readMoreUrl = url
      this.templateMessage = message
      this.timeDialog = true
    },
    sendLocationMessage (responseMessage, url, message) {
      this.readMoreUrl = url
      this.templateMessage = message
      this.locationDialog = true
    },
    sendPetInfo (responseMessage, url) {
      this.readMoreUrl = url
      this.petSelectionDialog = true
    },
    async resend () {
      this.tempMessages = []
      if (this.$q.localStorage.getItem(this.resendTitle)) {
        let failedMessages = this.$q.localStorage.getItem(this.resendTitle).failedMessages
        this.$q.localStorage.set(this.resendTitle, {failedMessages: []})
        if (failedMessages.length) {
          this.send(failedMessages, 1)
        }
      }
    },
    async send (value, resend = 0) {
      // close message template popup
      this.messageTemplate = false
      var newDate = new Date()
      if (Array.isArray(value) || typeof value === 'object') {
        if (value) {
          this.messageBox = value
        }
        for (let index = 0; index < value.length; index++) {
          const msg = value[index]
          if (this.messageInfo) {
            for (let index = 0; index < this.messageInfo.length; index++) {
              const message = this.messageInfo[index]
              if (message.userInfo.id === this.$store.state.user.uuid && message.contentType === 'text') {
                this.tempMessage = JSON.parse(JSON.stringify(message))
                this.tempMessage.content = msg
                this.tempMessage.createdDate = newDate
                // this.tempMessage.id = newDate.getTime() + Math.floor(Math.random() * 6) + 1
                this.tempMessage.id = newDate.getTime() + index
                this.tempMessage.sending = 1
                this.tempMessages.push(this.tempMessage)
                // this.$q.localStorage.set(this.resendTitle, this.tempMessages)
                this.scrollToBottom()
                break
              }
            }
          }
        }
      } else {
        if (value) {
          this.messageBox = value
        }
        if (this.messageInfo) {
          for (let index = 0; index < this.messageInfo.length; index++) {
            const message = this.messageInfo[index]
            if (message.userInfo.id === this.$store.state.user.uuid && message.contentType === 'text') {
              this.tempMessage = JSON.parse(JSON.stringify(message))
              this.tempMessage.content = this.messageBox
              this.tempMessage.createdDate = newDate
              // this.tempMessage.id = newDate.getTime() + Math.floor(Math.random() * 6) + 1
              this.tempMessage.id = newDate.getTime() + index
              this.tempMessage.sending = 1
              this.tempMessages.push(this.tempMessage)
              // this.$q.localStorage.set(this.resendTitle, this.tempMessages)
              this.scrollToBottom()
              break
            }
          }
        }
      }
      // console.log(this.messageInfo)
      // console.log(this.messageBox)
      // console.log(this.tempMessages)

      this.pictureUploading = false
      // setTimeout(() => {
      //   this.makeResendMessages()
      // }, 2000)
      let failedMessages = this.$q.localStorage.getItem(this.resendTitle)
      if (failedMessages && failedMessages.failedMessages.length && resend === 0) {
        // failedMessages.failedMessages.push({
        //   'content': this.messageBox,
        //   'source': this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5,
        //   'contentType': 'text'
        // })
        failedMessages.failedMessages.push(this.messageBox)
        // alert('ssss')
        this.$q.localStorage.set(this.resendTitle, failedMessages)
        if (resend === 0) {
          this.messageBox = null
        }
      } else {
        this.sendMessage(this.pictureUploading)
      }
    },
    openMessageDialog (message, responseMessage, url) {
      this.readMoreUrl = url
      this.reserve = false
      this.responseMessageDialog = responseMessage
      if (message === 'Custom Message') {
        this.reserve = true
        this.messageDialog = true
      } else if (message === 'Time') {
        this.messageBox = this.currentTime
        if (this.responseMessageDialog) {
          this.messageDialog = true
        } else {
          this.send()
        }
      } else if (message === 'Location') {
        if (this.locationSelect === '') {
          return
        }
        this.messageBox = this.currentLocation
        if (this.responseMessageDialog) {
          this.messageDialog = true
        } else {
          this.send()
        }
      } else if (message === 'Pet') {
        if (this.responseMessageDialog) {
          this.messageDialog = true
        }
        this.submitPetInfo()
      } else {
        this.messageBox = message
        if (this.responseMessageDialog) {
          this.messageDialog = true
        } else {
          this.send()
        }
      }
      this.templateMessage = ''
    },
    submitPetInfo () {
      if (this.petSelected.length === 0) {
        return
      }

      // form pet ids string
      let petID = ''
      for (let i = 0; i < this.petSelected.length; i++) {
        petID = petID + 'ids[]=' + this.personalItems[this.petSelected[i]].ID
        if (i < this.petSelected.length - 1) {
          petID = petID + '&'
        }
      }

      this.$axios.get(`users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}/messages/sendpets?${petID}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$q.notify({message: 'Pet Info Successfully Sent!'})
      }).catch((error) => {
        console.log(error)
        this.$q.notify({message: 'Pet Info Failed To Sent, Try Again Later or Contact Support Now!'})
      })
      this.petSelected = []
      this.petSelectionDialog = false
      this.messageTemplate = false
    },
    getPersonalItems () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/personal-items?v=6`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        let num = response.data.personalItemsInfo.items.length
        for (let i = 0; i < num; i++) {
          let pet = JSON.parse(response.data.personalItemsInfo.items[i].itemDescription.replace('\\', '')).question
          let personalPet = {
            ID: response.data.personalItemsInfo.items[i].id,
            type: pet[3].reply,
            weight: pet[7].reply,
            breed: pet[5].reply,
            image: response.data.personalItemsInfo.items[i].mediaInfo[0],
            name: pet[1].reply,
            title: response.data.personalItemsInfo.items[i].title
          }
          this.personalItems.push(personalPet)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    getImgSrc (file, index, type) {
      if (typeof file.fileName !== 'undefined' && file.fileName !== '') {
        return file.filePath
      } else {
        if (index === 90049) {
          if (type) {
            // set default pet photo to pet type (local storage)
            // this happens when pet has no images uploaded
            file = type
          } else {
            index = Number(file)
          }
        }
        let src = ''
        switch (index) {
          case 0: src = 'Dog'; break
          case 1: src = 'Cat'; break
          case 2: src = 'Rabbit'; break
          case 3: src = 'Guinea Pig'; break
          case 4: src = 'Ferret'; break
          case 5: src = 'Bird'; break
          case 6: src = 'Reptile'; break
          case 7: src = 'Turtle'; break
          default: src = file
        }
        src = src.toLowerCase().replace(' ', '-')
        src = 'statics/images/pets/' + src + '.png'
        return src
      }
    },
    checkSelect (label, item) {
      // empty reply
      if (typeof item === 'undefined' || item === null) {
        return false
      } else if (item.indexOf(label) > -1) {
        return true
      }
      return false
    },
    select (event, value, item, index) {
      // add another pet
      /*  if (value === -1) {
        console.log('add another pet')
        this.count = 0
        return
      } else if (value === 'Add Vet') {
        console.log('add vet')
        this.addVetModal = true
        return
      } */
      this.$refs[value][0].$el.classList.toggle('picked')

      if (this.$refs[value][0].$el.classList.toString().indexOf('picked') > 0) {
        // prevent select multiple
        /*  if (item.reply.length > 0 && item.questionId !== 102 && item.questionId !== 90018) {
          this.$refs[item.reply][0].$el.classList.toggle('picked')
          item.reply = ''
        } */

        // select
        item.push(value)
      } else {
        let index = item.indexOf(value)
        // deselect
        if (index > -1) {
          item.splice(index, 1)
        }
      }
    },
    onPlaceChanged (place) {
      this.isLocationSet = false
      let addressComponents = place.address_components
      let location = {
        area: '',
        city: '',
        state: '',
        country: ''
      }

      if (typeof addressComponents !== 'object' || !addressComponents.length) {
        throw new Error('Address Component is not complete with data ' + JSON.stringify(place))
      }

      for (var i = 0; i < addressComponents.length; i++) {
        var addressComponent = addressComponents[i]

        if (addressComponent.types[0] === 'sublocality_level_1') {
          location.area = addressComponent.long_name
        }

        if (addressComponent.types[0] === 'locality') {
          location.city = addressComponent.long_name
        }

        if (addressComponent.types[0] === 'administrative_area_level_1') {
          location.state = addressComponent.long_name
        }

        if (addressComponent.types[0] === 'country') {
          location.country = addressComponent.long_name
        }
      }

      location.full = location.area + ' ' + location.city + ' ' + location.state + ' ' + location.country
      location.latitude = place.geometry.location.lat().toString()
      location.longitude = place.geometry.location.lng().toString()
      this.locationSelect = location.full.toString()
      this.isLocationSet = true
    },
    toBookingNow () {
      this.$router.push(this.$route.path + '/checkout')
    },
    closeKeyboard () {
      if (this.$refs['inputBox']) {
        this.$refs['inputBox'].blur()
      }
    },
    showDate (createdDate) {
      // display date only when detect different
      if (this.currentDate !== null && this.currentDate.diff(createdDate, 'days') === 0) {
        return false
      }
      this.currentDate = moment(createdDate)
      return true
    },
    focusIn (event) {
      //  const el = event.target
      // do something with the element.
      this.showYellowBar = false
      this.keyboardStatus = true
    },
    focusOut (event) {
      //  const el = event.target
      // do something with the element.
      this.showYellowBar = true
      this.keyboardStatus = false
    },
    onCheckError (type) {
      this.$refs.qDate.hide()
      this.$refs.qTime.hide()
      this.serviceStartFormat = moment(this.serviceStart).format('Do MMMM, YYYY')
      this.serviceStartTimeFormat = moment(this.serviceStartTime, 'HH:mm').format('LT')
    },
    updateChatContent () {
      console.log('Refreshing messages for small width')
      this.scrollToBottom()
      this.messages = this.messageInfo || []
      this.scrollToBottom()
      this.galleryImages = []
      this.lightBoxImages = []
      this.pictureUploading = false
      for (let i = 0; i < this.messages.length; i++) {
        if (this.messages[i].contentType === 'image') {
          this.galleryImages.push(this.messages[i].content)
          this.lightBoxImages.push({
            'src': this.messages[i].content,
            'thumb': this.messages[i].content
          })
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>

.truncated

.service
 font-size:15px
 font-weight: bold
 text-align: left;
 padding-left:15px;
 white-space: nowrap;
 overflow: hidden;
 text-overflow: ellipsis;
 padding-left: 20px;
.description
 font-size:12px
 padding-top:3px
 text-align: left;
 white-space: nowrap;
 overflow: hidden;
 text-overflow: ellipsis;
 padding-left: 20px;

.avatar_div
 height:60px
 width:40px
 padding-bottom:5px
 margin-bottom: 10px
 margin:0px
.update_txt
 font-size:14px
.update_btn
  width:300px
  height:40px
  border:none
.pre-formatted
  white-space: pre

.background-primary
  background: red
  color: red

.messageOptions
  box-shadow: 0px 2px 0px -1px white, 0px -1px 0px -1px white, 10px 0 15px -6px #E0E0E0, -10px 0 15px -6px #E0E0E0
  margin-bottom: 6px

.petImg
  object-fit: cover
  height: 74%
  width: 100%

.petImgDesktop
  object-fit: cover
  height: 80%
  width: 100%

.picked
  opacity: 0.4

#text
  background: #fff
  text-align: center
  padding: 0 5px
  line-height: normal
  display: inline-block
  word-wrap: break-word
  white-space: normal !important
  color: #8e8e8e
  z-index: -1

.amber-bottom-card
  bottom: 73px

.resend
  margin-right: 5px
  margin-bottom: 5px
  font-size: 9px

.opacity-low
  opacity: 0.5

.avatarImage
  width: 60px
  height: 60px

>>>.moment-div .q-message-text {
  border-radius: 0
  margin: auto
}
>>>.moment-div .q-message-text:nth-child(2) {
  border-radius: 4px 4px 0 0
  padding-bottom: 0
}
>>>.moment-div .q-message-text:nth-child(3) {
  padding-bottom: 0
}
>>>.moment-div .q-message-text:nth-child(4) {
  border-radius: 0 0 0 4px
}
>>>.moment-div .avatarDiv img {
  margin-right: 10px
}
>>>.moment-div .avatarDiv {
  font-size: 14px;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  align-items: center;
}
@media screen and (max-width: 320px)
  .q-py-below-320
    padding-top 5px
    padding-bottom 5px
  .q-py-below-320 .protection-desc
    font-size 14px
  .of-auto
    overflow auto
  .mh-350
    max-height 350px

@media screen and (min-width: 315px)
  .amber-bottom-card
   bottom: 71px

@media screen and (min-width: 370px)
  .amber-bottom-card
   bottom: 72px

@media screen and (min-width: 410px)
  .amber-bottom-card
   bottom: 72px
</style>
