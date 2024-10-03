<template>
  <div>
    <q-list class="q-my-md">
      <!-- Message Input Box -->
      <q-item @click.native="openMessageTemplateModal" v-if="this.template === 1" style="padding: 0px;">
        <q-item-section>
          <q-item-label>
            <q-input disable :label="$t('enter.message.here')"/>
          </q-item-label>
          <q-item-label class="q-pt-md q-pa-md text-right bg-grey-12" @click.native="openMessageTemplateModal">
            <q-btn class="bg-white" :loading="loading" disable outline :disabled="isEmptyOrSpaces(messageBox)">{{ $t('button.sendmessage') }}</q-btn>
            <q-btn class="bg-white" disable outline @click="onUpload" style="margin-left: 15px">{{ $t('button.uploadimage') }}</q-btn>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-else style="padding: 0px;">
        <q-item-section >
          <q-item-label>
            <q-input v-model="messageBox" :label="$t('enter.message.here')"/>
          </q-item-label>
          <q-item-label class="q-pt-md q-pa-md text-right bg-grey-12">
            <q-btn class="bg-white" :loading="loading" outline @click.native="send()" :disabled="isEmptyOrSpaces(messageBox)">{{ $t('button.sendmessage') }}</q-btn>
            <q-btn class="bg-white" outline @click="onUpload" style="margin-left: 15px">{{ $t('button.uploadimage') }}</q-btn>
          </q-item-label>
        </q-item-section>
      </q-item>
      <input type="file" multiple @change="onFileChange" accept=".jpg,.jpeg,.png" ref="selectedFile" style="display: none;">
    </q-list>
    <!-- Messages -->
    <div class="row q-py-md animate-popup-down" v-for="msg in messages" :key="msg.id" :class="msg.userInfo.id !== $store.state.user.uuid ? '' : 'justify-end'">
      <div class="col-xs-1" v-if="msg.userInfo.id !== $store.state.user.uuid && msg.contentType !== 'title'">
        <q-avatar>
          <img class="item avatar responsive nonherit header image-upload" :src="msg.userInfo.avatarImage" >
        </q-avatar>
      </div>
      <div class="col-xs-9 bubble q-ml-lg force-select" :style="{color: msg.userInfo.id === $store.state.user.uuid ? 'white' : 'grey'}" :class="msg.userInfo.id !== $store.state.user.uuid ? 'me' : 'you'" v-if="msg.contentType.toLowerCase() === 'text'">
        <!-- <p v-html="linkifyText(msg)"></p> -->
        <p v-html="linkifyText(msg)" v-if="!msg.content.includes('click to view')"></p>
        <p v-else><span class="cursor-pointer text-primary" @click="forYourProtection = true">{{ msg.content }}</span></p>
      </div>
      <div class="col-xs-9 bubble" :class="msg.userInfo.id !== $store.state.user.uuid ? 'me' : 'you'" v-else-if="msg.contentType.toLowerCase() === 'image'">
        <div>
          <img class="responsive cursor-pointer image-upload" style="max-height:300px;" :src="msg.content" :alt="$t('placeholder.chat.image')" @click="showImage(msg)">
        </div>
        <div><small class="text-neutral">{{ parseReadableDate(msg.createdDate, 'date-time') }}</small></div>
      </div>
      <!-- Title -->
      <div class="text-center col-xs-12 cursor-pointer" v-if="msg.contentType.toLowerCase() === 'title'" @click="tapSeeDetails(msg.content)">
        <message-title :contentInfo="JSON.parse(msg.content)" :timeStamp="parseReadableDate(msg.createdDate, 'date-time')"></message-title>
      </div>
    </div>
      <LightBox
        v-if="lightBoxImages.length > 0"
        :media="lightBoxImages"
        ref="lightbox"
        :show-caption="false"
        :show-light-box="false"
      ></LightBox>

    <!-- For Your Protection Pop Up -->
    <dialog-foryourprotection @trigger-updated="updateForYourProtectionState" :trigger="forYourProtection" :requestId="parseInt($route.params.request)" :responseId="parseInt($route.params.response)"></dialog-foryourprotection>

    <!-- Message Template -->
    <message-template :trigger="messageTemplate" @trigger-updated="updateMessageTemplate"  :whySeeingThis="this.responseInfo.whySeeingThis" :whySeeingThisLink="this.responseInfo.whySeeingThisLink" @send-message="send" ></message-template>
  </div>
</template>

<script>
require('vue-image-lightbox/dist/vue-image-lightbox.min.css')
import chatMixin from '../mixins/chatMixin.js'
import LightBox from 'vue-image-lightbox'
import moment from 'moment'
import requestStatus from 'assets/request-status.json'

export default {
  mixins: [chatMixin],
  components: {
    LightBox,
    'message-title': () => import('components/Chat/Title.vue'),
    'dialog-foryourprotection': () => import('components/ModalForYourProtection.vue'),
    'message-template': () => import('components/MessageTemplate.vue')
  },
  props: {
    responseInfo: {
      type: Object,
      required: true
    },
    messageInfo: {
      type: Array,
      required: true
    },
    template: Number
  },
  data () {
    return {
      lightBoxImages: [],
      lightBoxIndex: 0,
      forYourProtection: false,
      messageTemplate: false,
      STATUS: requestStatus,
      supportedCountry: [],
      isLocationSet: false,
      responseMessageDialog: null,
      readMoreUrl: false,
      templateMessage: '',
      petSelectionDialog: false,
      personalItems: [],
      petSelected: [],
      unblockKeys: [
        'Control',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Alt',
        'Meta',
        'Shift',
        'Tab'
      ],
      loading: false,
      whySeeingThisModal: false
    }
  },
  created () {
    this.updateChatContent()
    this.getPersonalItems()
    window.addEventListener('keydown', (e) => {
      if (this.unblockKeys.indexOf(e.key) > -1) {
        return
      }
      this.openMessageTemplateModal()
    })
  },
  mounted () {
    setTimeout(() => {
      this.updateChatContent()
    }, 1000)
  },
  methods: {
    onUpload () {
      this.$refs['selectedFile'].click()

      if (this.$q.platform.is.cordova) {
        this.$refs['selectedFile'].click()
      }
    },
    parseInfo (content) {
      let msgObject = JSON.parse(content.replace(/'/g, '"'))
      return msgObject.title
    },
    tapSeeDetails (content) {
      let info = JSON.parse(content.replace(/'/g, '"'))
      if (info.subtitle === 'Tap to see details') {
        this.$emit('open-quote-details', true)
      }
    },
    showImage (msg) {
      this.$refs.lightbox.showImage(this.galleryImages.findIndex(imageLink => imageLink === msg.content))
    },
    updateForYourProtectionState () {
      this.forYourProtection = false
    },
    updateMessageTemplate () {
      this.messageTemplate = false
    },
    openMessageTemplateModal () {
      if (this.responseInfo.useTemplate === 1 || this.template === 1) {
        this.messageTemplate = true
      }
    },
    send (value) {
      // close message template popup
      this.messageTemplate = false

      if (value) {
        this.messageBox = value
      }

      this.loading = true
      this.sendMessage(this.loading)
    },
    sendPetInfo (responseMessage, url) {
      this.readMoreUrl = url
      this.petSelectionDialog = true
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
    onCheckError (type) {
      this.$refs.qDate.hide()
      this.$refs.qTime.hide()
      this.serviceStartFormat = moment(this.serviceStart).format('Do MMMM, YYYY')
      this.serviceStartTimeFormat = moment(this.serviceStartTime, 'HH:mm').format('LT')
    },
    toBookingNow () {
      this.$router.push(this.$route.path + '/checkout')
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
    updateChatContent () {
      this.responseServiceInfo = this.responseInfo.serviceInfo
      this.messages = this.messageInfo
      this.galleryImages = []
      this.lightBoxImages = []
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
    messageInfo (newValue, oldValue) {
      this.loading = false
      if (newValue[0].id !== oldValue[0].id) {
        this.updateChatContent()

        if (newValue.items[0].contentType === 'title') {
          this.$emit('refresh-content')
        }
      }
    }
  }
}

</script>
<style lang="stylus" scoped>
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
  background-color: $grey-3
  border-radius: 5px
  display: inline-block
  padding: 10px 18px
  position: relative
  vertical-align: top

.bubble.me::before
  background-color: $grey-3
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
  background-color: $green-5
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

.me::before
  left: -9px

.you
  float: right
  margin: 5px 20px 5px 45px
  background-color: $green-5

.picked
  opacity: 1.0
</style>
