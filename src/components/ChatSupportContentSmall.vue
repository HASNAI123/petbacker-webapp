<template>
  <div>
    <q-list class="bg-amber fixed-top q-py-none" style="z-index: 20;" ref="top-banner">
      <q-item>
        <q-item-section>
          <q-item-label class="text-center">
            {{ $t('support.team.contact')}}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <div style="margin-top: 95px;margin-bottom: 8%;" ref="chatContainer">
      <div class="q-py-sm force-select row q-py-sm" v-for="msg in messages" :key="msg.id" :class="msg.userInfo.id !== $store.state.user.uuid ? '' : 'justify-end'" @click="closeKeyboard">
        <!-- TEXT -->
        <div class="col-xs-9" v-if="msg.contentType.toLowerCase() === 'text'">
          <q-chat-message
          v-if="!msg.content.includes('click to view')"
          :sent="msg.userInfo.id === $store.state.user.uuid ? true : false"
          :bg-color="msg.userInfo.id === $store.state.user.uuid ? 'green-5' : 'grey-3'"
          :avatar="msg.userInfo.id === $store.state.user.uuid ? '' : msg.userInfo.avatarImage"
          >
            <p style="font-size: 16px; padding: 2px" class="text-weight-regular" :style="{color: msg.userInfo.id === $store.state.user.uuid ? 'white' : 'grey'}" v-html="linkifySupportText(msg)"></p>
          </q-chat-message>
          <q-chat-message
            v-else
            :sent="msg.userInfo.id === $store.state.user.uuid ? true : false"
            :bg-color="msg.userInfo.id === $store.state.user.uuid ? 'green-5' : 'grey-3'"
          >
            <span class="cursor-pointer text-primary" @click="$store.commit('user/updateopenModalQuoteDetailsState', Math.random())" href="#">
              {{ msg.content }}
            </span>
          </q-chat-message>
          <div><small class="text-neutral" style="margin-left: 16%" :style="{float: msg.userInfo.id === $store.state.user.uuid? 'right' : 'left'}">{{ parseReadableDate(msg.createdDate, 'time') }}</small></div>
        </div>
        <!-- Images -->
        <div class="col-xs-9 q-ml-lg" style="margin-left: 0px;" v-if="msg.contentType.toLowerCase() === 'image'">
            <q-chat-message
            :sent="msg.userInfo.id === $store.state.user.uuid ? true : false"
            :bg-color="msg.userInfo.id === $store.state.user.uuid ? 'green-5' : 'grey-3'"
            :avatar="msg.userInfo.id === $store.state.user.uuid ? '' : msg.userInfo.avatarImage"
            text-sanitize
            >
              <img class="responsive cursor-pointer image-upload" style="max-height:300px;" :src="msg.content" :alt="$t('placeholder.chat.image')" @click="$refs.lightbox.showImage(galleryImages.findIndex(imageLink => imageLink === msg.content))">
            </q-chat-message>
          <div><small class="text-neutral" style="margin-left: 16%" :style="{float: msg.userInfo.id === $store.state.user.uuid? 'right' : 'left'}">{{ parseReadableDate(msg.createdDate, 'time') }}</small></div>
        </div>
        <!-- Title -->
        <div class="text-center col-xs-12 cursor-pointer" v-if="msg.contentType.toLowerCase() === 'title'" @click="tapSeeDetails(msg.content)">
          <message-title :contentInfo="JSON.parse(msg.content)" :timeStamp="parseReadableDate(msg.createdDate, 'date-time')"></message-title>
        </div>
      </div>
      <p class="q-pb-xl"></p>
      <p class="q-pb-xl" v-if="messageInfo.ticketStatus === 4"></p>
      <q-card v-if="showYellowBar" class="bg-amber-2 fixed-top text-center q-px-sm" style="top: 50px;height: auto; z-index: 1; line-height: 90%;padding-top:2px">
        <p class="q-my-sm" v-html="$t('support.reply.within')"></p>
      </q-card>
      <!-- Closed Ticket -->
      <div class="fixed-bottom bg-grey-3 q-py-sm q-px-xs z-fab" v-if="messageInfo.ticketStatus >= 4">
        <!-- Prompt on closed issue -->
        <div v-if="count === 1">
          <!-- Title -->
          <h6 class="q-my-none text-center" v-if="messageInfo.ticketStatus === 4" style="font-size: 16px;">{{$t('has.this.been.resolved')}}</h6>
          <h6 class="q-my-none text-center" v-else-if="messageInfo.ticketStatus === 5" style="font-size: 16px;">{{$t('issue.resolved')}}<q-icon class="q-pl-sm q-pb-xs" name="fas fa-check-circle" color="positive"></q-icon></h6>

          <!-- Buttons -->
          <q-btn :label="$t('resolved.and.rate')" v-if="messageInfo.ticketStatus === 4" class="row q-px-md q-my-md text-capitalize margin-auto" @click="count++" color="primary"></q-btn>
          <q-btn v-if="messageInfo.ticketArchived === 0" :loading="loading" :label="$t('continue.query')" @click="onContinueQuery($route.params.ticketId)" class="row q-my-md text-capitalize margin-auto" outline color="primary"></q-btn>
          <q-btn v-if="messageInfo.ticketArchived === 1" :label="$t('submit.new.query')" @click="$router.replace({name: 'ChatSupportEnquiry'})" class="row q-my-md text-capitalize margin-auto" outline color="primary"></q-btn>
        </div>

        <!-- Rating -->
        <div v-else-if="count === 2" class="text-center">
          <h6 class="q-my-none text-center" style="font-size: 16px;">{{$t('please.rate.your.customer.service.experience')}}</h6>
          <q-rating v-model="rating" :max="5" size="3.5em" class="q-my-sm" color="primary" :icon="ratingIcons"></q-rating>
          <q-btn :loading="loading" :label="$t('submit.rating')" rounded @click="onSubmitRating($route.params.ticketId)" class="margin-auto q-my-sm q-px-md text-capitalize" color="primary"></q-btn>
        </div>
      </div>
      <!-- Normal Chat -->
      <div class="row fixed-bottom bg-grey-3 q-py-sm q-px-xs z-fab" v-else>
        <div style="width: 75%; margin-left: 5%" v-if="admin">
          <q-input ref="inputBox" type="textarea" v-model="messageBox" :placeholder="$t('type_a_message_here')" rows="1"  borderless dense rounded standout/>
        </div>
        <div style="width: 75%; margin-left: 5%" v-else>
          <q-input ref="inputBox" type="text" autogrow v-model="messageBox" :placeholder="$t('type_a_message_here')" rows="1"  borderless dense rounded standout/>
        </div>
        <div style="width: 20%;" :style="{paddingBottom: $q.platform.is.cordova ? '13%' : ''}">
          <q-btn icon="camera_alt" color="primary" style="width: 45px; height: 45px; position: absolute; right: 20px;bottom: 15px;" :loading="pictureUploading" round @click="onFileSelection" v-if="isEmptyOrSpaces(messageBox)"></q-btn>
          <q-btn icon="send"  color="orange-9" style="width: 45px; height: 45px; position: absolute; right: 20px;bottom: 15px;" round class="bg-white" v-else-if="admin" @click.native="confirmDialog = true"/>
          <q-btn icon="send"  color="primary" style="width: 45px; height: 45px; position: absolute; right: 20px;bottom: 15px;" round v-else @click.native="send()"/>
          <input type="file" multiple @change="onFileChange($event, true)" accept=".jpg,.jpeg,.png" ref="selectedFile" style="display: none;">
        </div>
      </div>
      <LightBox
      v-if="lightBoxImages.length > 0"
      :media="lightBoxImages"
      ref="lightbox"
      :show-caption="false"
      :show-light-box="false"
    ></LightBox>
      <q-dialog v-model="modalImageGallery" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
        <q-card>
          <q-toolbar slot="header">
            <q-btn
              flat
              round
              dense
              v-close-popup
              icon="keyboard_arrow_left"
            />
            <q-toolbar-title v-close-popup>
              {{ $t('button.backtorequest') }}
            </q-toolbar-title>
          </q-toolbar>
            <q-carousel
              color="white"
              arrows
              quick-nav
              class="modal-gallery"
            >
            <q-carousel-slide
              img-src="galleryImage"
              style="background-size: 100% !important;background-repeat: no-repeat !important;"
              class="responsive"
              v-for="galleryImage in galleryImages" :key="galleryImage  + Math.floor((Math.random() * 10000) + 1)"/>
          </q-carousel>
        </q-card>
      </q-dialog>

      <!-- Confirm send dialog box -->
      <confirmsend-dialog v-if="admin" :messageDialog="confirmDialog" :responseMessageDialog="messageBox === null ? '' : messageBox" @send-message="sendMessage"></confirmsend-dialog>
    </div>
  </div>
</template>

<script>
import chatMixin from '../mixins/chatMixin'
import LightBox from 'vue-image-lightbox'
require('vue-image-lightbox/dist/vue-image-lightbox.min.css')
import ImageUploadMixin from '../mixins/imageUploadMixin.js'

export default {
  mixins: [chatMixin, ImageUploadMixin],
  components: {
    LightBox,
    'message-title': () => import('components/Chat/Title.vue'),
    'confirmsend-dialog': () => import('components/DialogConfirmSend.vue')
  },
  props: {
    messageInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      lightBoxImages: [],
      lightBoxIndex: 0,
      admin: this.$store.getters['user/getUserAdminState'],
      confirmDialog: false,
      showYellowBar: true,
      previousScrollPosition: 0,
      keyboardStatus: false,
      rating: 4,
      ratingIcons: [
        'sentiment_very_dissatisfied',
        'sentiment_dissatisfied',
        'sentiment_neutral',
        'sentiment_satisfied',
        'sentiment_very_satisfied'
      ],
      count: 1,
      loading: false
    }
  },
  created () {
    this.updateContent()
    document.addEventListener('focusin', this.focusIn)
    document.addEventListener('focusout', this.focusOut)
  },
  beforeDestroy () {
    this.$off('image-data')
    document.removeEventListener('focusin', this.focusIn)
    document.removeEventListener('focusout', this.focusOut)
  },
  mounted () {
    console.log(this.$parent)
    this.$refs['top-banner'].$el.style.top = `${this.$parent.$parent.$parent.$parent.$parent.$refs.navbar.$el.clientHeight}px`
    setTimeout(() => {
      this.scrollToBottom()
    }, 10)

    setTimeout(() => {
      this.scrollToBottom()
    }, 150)

    // listen to ImageUploadMixin callback (image processing)
    this.$on('image-data', (data) => {
      this.uploadImageData(data.blob)
      this.pictureUploading = true
    })
  },
  methods: {
    onContinueQuery (ticketId = 0) {
      this.loading = true
      let ticketInfo = {
        'ticketInfo': {
          'status': 1
        }
      }

      this.$axios.put(`helpdesk-tickets/${ticketId}`, ticketInfo, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$emit('on-continue-query', response.data.helpdeskTicketInfo)
      }).catch((error) => {
        console.log(error)
      }).finally(_ => {
        this.loading = false
      })
    },
    onSubmitRating (ticketId = 0) {
      this.loading = true
      let ticketInfo = {
        'ticketInfo': {
          'rating': this.rating,
          'status': 5,
          'isArchived': 1
        }
      }

      this.$axios.put(`helpdesk-tickets/${ticketId}`, ticketInfo, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$emit('on-resolved', response.data.helpdeskTicketInfo)
        this.$q.notify({message: 'Rating submitted, thank you! ❤️', position: 'top', type: 'positive'})
        this.count = 1
      }).catch((error) => {
        console.log(error)
      }).finally(_ => {
        this.loading = false
      })
    },
    scrolled (position) {
      if (this.keyboardStatus && (position < this.previousScrollPosition)) {
        this.closeKeyboard()
      }
      this.previousScrollPosition = position
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
    sendMessage (status) {
      if (status) {
        this.sendAdminMessage()
        this.scrollToBottom()
      }
      this.confirmDialog = false
    },
    send () {
      this.sendSupportMessage()
      this.scrollToBottom()
      // if (this.$refs['inputBox'].focused) {
      //   this.$refs['inputBox'].focus()
      // }
    },
    closeKeyboard () {
      this.$refs['inputBox'].blur()
    },
    updateContent () {
      this.scrollToBottom()
      this.messages = this.messageInfo.items
      if (typeof (this.messages) === 'undefined') {
        this.messages = []
        return
      }
      this.scrollToBottom()
      this.galleryImages = []
      this.lightBoxImages = []
      this.pictureUploading = false
      for (let i = 0; i < this.messages.length; i++) {
        if (this.messages[i].contentType === 'image') {
          this.galleryImages.push(this.messages[i].content)
          this.lightBoxImages.push({
            'thumb': this.messages[i].content,
            'src': this.messages[i].content
          })
        }
      }
    }
  },
  watch: {
    messageInfo (val, oldVal) {
      if (val.items[val.items.length - 1].id !== oldVal.items[oldVal.items.length - 1].id) {
        this.updateContent()
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.modal-gallery
  height: 100%
</style>
