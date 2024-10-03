<template>
  <div>
    <q-card class="bg-amber-2 fixed-top text-center q-px-sm" flat style="top: 50px;height: auto; z-index: 1; line-height: 90%;padding-top:2px">
      <p class="q-my-sm" v-html="$t('support.reply.within')"></p>
    </q-card>
    <div class="list rounded-borders request-status" v-if="this.$store.getters['user/getUserNavbarVisibilityState']">
        <q-list class="gt-xs">
          <q-item multiline>
            <q-item-section>
              <q-item-label>
                <p class="q-my-sm" style="font-size: 25px;">{{ $t('need.some.help')}}</p>
                <p>{{ $t('support.team.contact')}}</p>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
    </div>
    <q-list class="q-my-md q-mt-lg">
      <q-item multiline>
        <q-item-section>
          <q-item-label>
            <textarea v-model="messageBox" class="full-width border-1 resize-none q-pa-sm" :placeholder="$t('enter.message.here')" rows="3"></textarea>
          </q-item-label>
          <q-item-label label class="q-pt-md q-pa-md text-right bg-grey-12">
            <q-btn class="bg-white" v-if="admin" outline @click.native="confirmDialog = true" :disabled="isEmptyOrSpaces(messageBox)">{{ $t('button.sendmessage') }}</q-btn>
            <q-btn class="bg-white" v-else outline @click.native="sendSupportMessage()" :disabled="isEmptyOrSpaces(messageBox)">{{ $t('button.sendmessage') }}</q-btn>
            <q-btn class="bg-white" outline @click="onUpload">{{ $t('button.uploadimage') }}</q-btn>
            <input type="file" multiple @change="onFileChange($event, true)" accept=".jpg,.jpeg,.png" ref="selectedFile" style="display: none;">
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <div class="row q-py-md animate-popup-down" v-for="msg in messages" :key="msg.id" :class="msg.userInfo.id !== $store.state.user.uuid ? '' : 'justify-end'">
      <div class="col-xs-1" v-if="msg.userInfo.id !== $store.state.user.uuid && msg.contentType !== 'title'">
        <img class="item avatar responsive nonherit" :src="msg.userInfo.avatarImage">
      </div>
      <div class="col-xs-9  bubble q-ml-lg force-select" :class="msg.userInfo.id !== $store.state.user.uuid ? 'me' : 'you'" v-if="msg.contentType.toLowerCase() === 'text'">
        <p v-html="linkifySupportText(msg)"></p>
      </div>
      <div class="col-xs-9  bubble" :class="msg.userInfo.id !== $store.state.user.uuid ? 'me' : 'you'" v-if="msg.contentType.toLowerCase() === 'image'">
        <div>
          <img class=" responsive cursor-pointer" style="max-height:300px;" :src="msg.content" :alt="$t('placeholder.chat.image')" @click="modalImageGallery = true">
        </div>
          <div><small class="text-grey-7">{{ parseReadableDate(msg.createdDate, 'date-time') }}</small></div>
      </div>
      <!-- Title -->
      <div class="text-center col-xs-12 cursor-pointer" v-if="msg.contentType.toLowerCase() === 'title'" @click="tapSeeDetails(msg.content)">
        <message-title :contentInfo="JSON.parse(msg.content)" :timeStamp="parseReadableDate(msg.createdDate, 'date-time')"></message-title>
      </div>
    </div>

    <q-dialog v-model="modalImageGallery" v-if="galleryImages.length> 0">
      <q-card style="min-width: 80vw;min-height: 80vh;">
        <q-toolbar>
          <q-btn
            flat
            round
            dense
            v-close-popup
            icon="close"
          />
          <!-- <q-toolbar-title v-close-popup>
            {{ $t('button.backtorequest') }}
          </q-toolbar-title> -->
        </q-toolbar>
        <q-carousel
          color="white"
          :arrows="galleryImages.length > 1 && $q.platform.is.desktop"
          :navigation="galleryImages.length > 1"
          class="modal-gallery"
          v-model="slide"
        >
          <q-carousel-slide :name="index" v-for="(galleryImage, index) in galleryImages" :key="index" class="q-pa-none">
            <q-img :src="galleryImage" class="responsive image-upload"></q-img>
          </q-carousel-slide>
        </q-carousel>
      </q-card>
    </q-dialog>

    <!-- Confirm send dialog box -->
    <confirmsend-dialog v-if="admin" :messageDialog="confirmDialog" :responseMessageDialog="messageBox === null ? '' : messageBox" @hide="confirmDialog = false" @send-message="sendMessage"></confirmsend-dialog>
  </div>
</template>

<script>
import chatMixin from '../mixins/chatMixin'
function isEmpty (obj) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false
    }
  }
  return JSON.stringify(obj) === JSON.stringify({})
}
export default {
  mixins: [chatMixin],
  components: {
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
      slide: 1,
      admin: this.$store.getters['user/getUserAdminState'],
      confirmDialog: false
    }
  },
  mounted () {
    if (isEmpty(this.messages)) {
      this.messages = []
    } else {
      this.messages = this.messageInfo.items || []
      if (!this.messages) {
        return
      } else if (typeof (this.messages) === 'undefined') {
        return
      }
      for (let i = 0; i < this.messages.length; i++) {
        if (this.messages[i].contentType === 'image') {
          this.galleryImages.push(this.messages[i].content)
        }
      }
    }
  },
  watch: {
    messageInfo (val) {
      this.messages = val.items

      if (typeof (this.messages) === 'undefined') {
        return
      }

      if (this.galleryImages.length === 0) {
        for (let i = 0; i < this.messages.length; i++) {
          if (this.messages[i].contentType === 'image') {
            this.galleryImages.push(this.messages[i].content)
          }
        }
      }
    }
  },
  methods: {
    onUpload () {
      this.$refs['selectedFile'].click()

      if (this.$q.platform.is.cordova) {
        this.$refs['selectedFile'].click()
      }
    },
    sendMessage (status) {
      if (status) {
        this.sendAdminMessage()
      }
      this.confirmDialog = false
    }
  }
}

</script>
<style lang="stylus" scoped>
.circsquare
  border-radius: 50%
  box-shadow: 0 2px 6px rgba(0,0,0,0.3)
  width: 40px !important
  height: 40px !important

div.text-middle-line
  width: 100%
  text-align: center
  border-bottom: 1px solid #c7c7c7
  line-height: 0.1em
  margin: 15px 0px
  color: #8e8e8e

.text-middle-line span
  background:#fff
  padding:0 10px

@media only screen and (min-width: 601px)
  .modal-gallery
    height: 100%
    min-width: 650px

@media only screen and (max-width: 600px)
  .modal-gallery
    height: 100%
    min-width: 400px

.bubble
  background-color: #F2F2F2
  border-radius: 5px
  display: inline-block
  padding: 10px 18px
  position: relative
  vertical-align: top

.bubble.me::before
  background-color: #d1fdd3
  content: "\A0"
  display: block
  height: 13px
  position: absolute
  top: 3px
  transform: rotate(55deg) skew(-35deg)
  -moz-transform: rotate(55deg) skew(-35deg)
  -ms-transform: rotate(55deg) skew(-35deg)
  -o-transform: rotate(55deg) skew(-35deg)
  -webkit-transform: rotate(55deg) skew(-35deg)
  width: 23px

.bubble.you::before
  background-color: #e2e2e2
  content: "\A0"
  display: block
  height: 19px
  position: absolute
  top: 0px
  transform:rotate(360deg) skew(-35deg)
  -moz-transform:rotate(360deg) skew(-35deg)
  -ms-transform:rotate(360deg) skew(-35deg)
  -o-transform:rotate(360deg) skew(-35deg)
  -webkit-transform: rotate(360deg) skew(-35deg)
  width: 17px
  right: -5px

.me
  float: lefts
  background-color: #d1fdd3

.me::before
  left: -9px

.you
  float: right
  margin: 5px 20px 5px 45px
  background-color: #e2e2e2

.you::before
  right: -9px
</style>
