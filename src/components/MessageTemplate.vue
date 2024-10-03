<template>
  <div>
    <!-- Message Template -->
    <q-dialog v-model="modal" @hide="closeMessageTemplate" :maximized="this.$q.platform.is.mobile" :persistent="this.$q.platform.is.mobile" :transition-show="this.$q.platform.is.mobile ? 'slide-up' : 'none'" :transition-hide="$q.platform.is.mobile ? 'slide-down' : 'none'">
      <q-card class="popup-width-height">
        <q-toolbar style="width: 435px; z-index: 5000;border-bottom: solid 1px lightgrey;" :class="this.$q.platform.is.mobile ? 'fixed-top bg-white' : 'bg-white modal-header-desktop responsive'">
          <q-btn
            flat
            round
            dense
            v-close-popup
            icon="chevron_left"
            size="18px"
          />
          <q-toolbar-title v-close-popup class="font-title text-header">
            <h6 class="q-my-none font-normal">{{$t('back.to.chat')}}</h6>
          </q-toolbar-title>
        </q-toolbar>

        <div class="bg-amber-2 text-center fixed-bottom" style="z-index: 4000;" flat @click="whySeeingThisModal = true">
          <p class="q-my-none q-py-sm">{{$t('why.am.i.seeing.this')}} <u>{{$t('learn.more.tap')}}</u></p>
        </div>

        <div class="q-mx-md q-mt-xl">
          <h6 class="q-mb-none q-pt-md">{{$t('blocked.messaging')}}</h6>
          <p class="text-grey-6 q-my-none" v-html="$t('blocked.messaging.description')"></p>
          <div class="row q-mt-md">
            <q-btn :label="$t('unblock')" :loading="disputeLoader" @click="onDispute" outline color="primary" class="col-4 text-capitalize"></q-btn>
            <q-btn :label="$route.name === 'Chat' ? $t('make.pre.payment') : $t('subscribe.to.sponsor')" @click="whySeeingThisModal = true" color="primary" class="col text-capitalize"></q-btn>
          </div>
        </div>

        <q-card-section :class="$q.platform.is.desktop ? 'q-mt-xl' : ''">
          <q-list class="margin-top q-mb-lg">
            <div v-for="definedMessage in messageTemplateItems" :key="definedMessage.id">
              <q-item class="messageOptions" clickable v-if="definedMessage.message_type === 1" @click="openMessageDialog(definedMessage.message, definedMessage.response, definedMessage.link)">
                <q-item-section>
                  <p class="font-normal q-ma-none">{{definedMessage.message}}</p>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
              <q-item class="messageOptions" clickable v-else-if="definedMessage.message_type === 2" @click="sendTimeMessage(definedMessage.response, definedMessage.link, definedMessage.message)">
                <q-item-section>
                  <p class="font-normal q-ma-none">{{definedMessage.message}}</p>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
              <q-item class="messageOptions" clickable v-else-if="definedMessage.message_type === 3" @click="sendLocationMessage(definedMessage.response, definedMessage.link, definedMessage.message)">
                <q-item-section>
                  <p class="font-normal q-ma-none">{{definedMessage.message}}</p>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
              <!--
              <q-item class="messageOptions" v-if="definedMessage.message_type === 4" @click.native="sendPetInfo(definedMessage.response, definedMessage.link)">
                <q-item-section>
                  <p style="font-size: 16px; margin: 0px;">{{definedMessage.message}}</p>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
              -->
              <q-item class="messageOptions" clickable v-else-if="definedMessage.message_type === 100"  @click="openMessageDialog('Custom Message', definedMessage.response, definedMessage.link)">
                <q-item-section>
                  <p class="font-normal q-ma-none">{{definedMessage.message}}</p>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
            </div>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Confirm send message dialog -->
    <q-dialog v-model="messageDialog">
      <q-card style="min-width: 300px; overflow: visible; border-radius: 15px;" class="card-container">
        <img src="statics/images/tip_icon.png" style="margin-top: -37px; border-radius: 50%" class="protection-bulb"/>
        <q-card-section style="margin-top: 40px; max-width: 300px;padding-bottom: 0px;">
          <p class="text-center" style="font-size: 18px;">{{$t('send.this.message')}}</p>
          <p style="font-size: 16px; color: grey; margin-top: 25px;" class="text-justify">{{responseMessageDialog}}</p>
        </q-card-section>
        <q-card-actions class="row actions-buttons full-width q-mt-sm" style="padding-top: 0px; padding-bottom: 0px;">
          <q-btn v-if="readMoreUrl" flat v-close-popup @click="openNewTab" style="font-size: 16px;" class="full-width text-capitalize text-weight-bold q-mx-xs" color="primary" dense>{{$t('read.more')}}</q-btn>
        </q-card-actions>
        <q-card-actions class="row text-bottom action-buttons full-width">
          <q-btn v-if="reserve" @click="toBookingNow" style="font-size: 16px;width: 130px;" class="full-width text-capitalize text-weight-bold q-mx-xs q-my-xs" color="primary" dense>{{$t('reserve.now')}}</q-btn>
          <q-btn v-else v-close-popup @click="send" style="font-size: 16px;width: 130px;" class="full-width text-capitalize text-weight-bold q-mx-xs q-my-xs" color="primary" dense>{{$t('send')}}</q-btn>
          <q-btn outline color="primary" style="font-size: 16px;width: 130px; margin-left: 6px;" class="full-width text-capitalize text-weight-bold q-mx-xs q-my-xs" v-close-popup dense>{{$t('pick.another')}}</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Why seeing this modal -->
    <q-dialog v-model="whySeeingThisModal" round>
      <q-card style="overflow: visible;min-width: 230px; max-width: 300px;">
        <q-card-section>
          <div class="protection-bulb">
            <img src="statics/images/for-your-protection.jpg" class="protection-bulb-image">
          </div>
          <div class="bg-white-self">
            <div class="row justify-center column">
              <div class="q-title q-mt-sm text-center protection-title text-weight-bold"> {{$t('why.am.i.seeing.this')}} </div>
            </div>
            <div class="row text-justify q-mt-lg">
              <div class="col-md-12 text-justify protection-desc">
                <span>{{whySeeingThis}}</span>
              </div>
            </div>
            <div class="row">
              <div class="full-width q-my-sm col-md-12">
                <q-btn color="primary" class="full-width text-weight-bold" :label="$t('chat.learnmore')" dense @click="openFaqTab" />
              </div>
              <div class="full-width q-my-sm col-md-12">
                <q-btn color="primary" class="full-width text-weight-bold" :label="$t('customer.support')" dense  @click="$router.push({name: 'ChatSupportHelp'})"/>
              </div>
              <div class="full-width col-md-12">
                <q-btn flat class="full-width text-weight-bold" :label="$t('close')" dense @click.native="whySeeingThisModal = false" />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Select Time message dialog -->
    <q-dialog v-model="timeDialog" round :persistent="this.$q.platform.is.mobile" :maximized="this.$q.platform.is.mobile" :transition-show="this.$q.platform.is.mobile ? 'slide-left' : 'none' " :transition-hide="this.$q.platform.is.mobile ? 'slide-right' : 'none'">
      <q-card class="card-container time-dialog-box">
        <q-toolbar style="border-bottom: solid 1px lightgrey;">
          <q-btn
            flat
            round
            dense
            v-close-popup
            size="18px"
            icon="chevron_left"
          />
        </q-toolbar>
        <q-card-section>
          <p class="col-md-12 col-xs-11 text-weight-bold" style="font-size: 18px;">{{currentTime}}</p>
          <p class="text-weight-medium col-xs-11" style="font-size: 16px; margin-bottom: 0px;">{{$t('select.time.required')}}</p>
            <q-input class="input col-md-12 col-xs-11" readonly v-model="serviceStartFormat" @click.native="$refs.qDate.show()" borderless dense >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer" style="margin-right: 10px;">
                  <q-popup-proxy ref="qDate" transition-show="scale" transition-hide="scale">
                    <q-date class="full-width" v-model="serviceStart" :options="checkDate" mask="YYYY-MM-DD" @input="onCheckError('qDate')"></q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input class="input col-md-12 col-xs-11" readonly v-model="serviceStartTime" mask="##:##" @click.native="$refs.qTime.show()" style="margin-top: 30px;" borderless dense>
              <template v-slot:prepend>
                <q-icon name="access_time" class="cursor-pointer" style="margin-right: 10px;">
                  <q-popup-proxy ref="qTime" transition-show="scale" transition-hide="scale">
                    <q-time class="full-width" v-model="serviceStartTime" mask="HH:mm" @input="onCheckError('qTime')"></q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
        </q-card-section>
        <q-card-section style="position: absolute; bottom: 0;" class="full-width">
            <q-btn @click="openMessageDialog('Time')" size="lg" class="full-width text-weight-bold text-capitalize" style="font-size: 16px;" unelevated color="primary" :label="$t('send.a.message')"/>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Select Location Dialog -->
    <q-dialog v-model="locationDialog" v-if="trigger" style="z-index: 2000!important; position: relative;" :persistent="this.$q.platform.is.mobile" :transition-hide="this.$q.platform.is.mobile ? 'right' : 'none'" :transition-show="this.$q.platform.is.mobile ? 'left' : 'none'" :maximized="this.$q.platform.is.mobile" round>
      <q-card class="card-container location-dialog-box" >
        <q-toolbar style="border-bottom: solid 1px lightgrey;">
          <q-btn
            flat
            round
            dense
            v-close-popup
            size="18px"
            icon="chevron_left"
          />
        </q-toolbar>
        <q-card-section v-if="locationDialog">
          <p class="col-md-12 col-xs-11 text-weight-bold" style="font-size: 18px;">{{currentLocation}}</p>
          <div class="row">
            <google-autocomplete v-if="locationDialog" className="input" :place="locationSelect" v-model="locationSelect" @place-changed="onPlaceChanged($event)" class="col-md-12 col-xs-11 input"></google-autocomplete>
          </div>
        </q-card-section>
        <q-card-section style="position: absolute; bottom: 0;" class="full-width">
          <q-btn @click="openMessageDialog('Location')" size="lg" class="text-weight-bold full-width text-capitalize" style="font-size: 16px;" dense color="primary" :label="$t('send.location')"/>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Pet Selection Dialog -->
    <q-dialog v-model="petSelectionDialog" style="z-index: 2000!important;" round>
      <q-card class="card-container" style="z-index: 2500!important; min-height: 600px;min-width: 400px; max-width: 450px; max-height: 700px;">
        <q-toolbar style="border-bottom: solid 1px lightgrey;">
          <q-btn
            flat
            round
            dense
            v-close-popup
            size="18px"
            icon="chevron_left"
          />
          <q-toolbar-title v-close-popup>
            {{$t('select.pet.title')}}
          </q-toolbar-title>
        </q-toolbar>
        <q-card-section>
          <!--<p class="col-md-12 col-xs-11 text-weight-bold" style="font-size: 18px;"></p>-->
          <div class="row">
              <q-card v-for="(pet, index) in personalItems" :key="index" :ref="index" class="col-xs-5 col-md-5 q-mt-lg justify-center" @click="select($event, index, petSelected)" style="margin-left: 20px;">
                  <img :src="getImgSrc(pet.image, 102, pet.type)" :class="$q.platform.is.desktop ? 'petImgDesktop' : 'petImg'">
                <div class="item-content cursor-pointer text-center">
                  <label style="font-size: 16px" class="text-weight-bold">{{ pet.name }}</label><br/>
                  <label style="font-size: 12px; color: grey;" class="text-weight-light">{{ pet.weight }}</label>
                  <q-icon name='fas fa-check-circle' style="color: #D97D54; position: absolute;right: 15px; bottom: 9px; font-size:25px;" v-if="checkSelect(index, petSelected)"></q-icon>
                </div>
              </q-card>
          </div>
        </q-card-section>
        <q-card-section class="text-bottom">
            <q-btn @click="openMessageDialog('Pet')" size="lg" class="text-weight-bold full-width text-capitalize" style="font-size: 16px;" unelevated color="primary" :label="$t('send.pet.info')"/>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog Error -->
    <dialog-error :trigger="serverErrorModal" :statusCode="errorStatus" :message="errorMessage" :okButtonLabel="errorOkBtnLabel" @on-ok="onOkBtn" @on-close="triggerServerError"></dialog-error>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  components: {
    'dialog-error': () => import('components/DialogError.vue'),
    'google-autocomplete': () => import('components/ComponentGmapAutocomplete.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      default: false,
      required: true
    },
    whySeeingThis: {
      type: String,
      required: true
    },
    whySeeingThisLink: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      messageDialog: false,
      responseMessageDialog: null,
      messageTemplateItems: null,
      whySeeingThisModal: false,
      timeDialog: false,
      serviceStart: moment().format('YYYY-MM-DD'),
      serviceStartFormat: moment(this.serviceStart).format('Do MMMM, YYYY'),
      serviceStartTime: moment().format('HH:mm'),
      serviceStartTimeFormat: moment(this.serviceStartTime).format('LT'),
      today: moment(),
      locationSelect: '',
      locationDialog: false,
      isLocationSet: false,
      readMoreUrl: false,
      templateMessage: '',
      petSelectionDialog: false,
      personalItems: [],
      petSelected: [],
      reserve: false,
      messageBox: null,
      modal: false,
      disputeLoader: false,
      serverErrorModal: false,
      errorStatus: 0,
      errorMessage: null,
      errorOkBtnLabel: this.$t('ok')
    }
  },
  created () {
    this.loadMessageTemplate()
    console.log('check', this.$route.name)
  },
  watch: {
    trigger (status) {
      this.modal = status
      console.log(status)
    }
  },
  computed: {
    currentTime () {
      return this.templateMessage.toString().replace('{time}', `${this.serviceStartFormat}, ${this.serviceStartTimeFormat}`)
    },
    currentLocation () {
      return this.templateMessage.toString().replace('{location}', `${this.locationSelect}`)
    }
  },
  methods: {
    openLearnMore () {
      if (this.$route.name === 'Chat') {
        this.openUrl(`${this.$t('link.href.help.center')}/pet-parents/why-can-t-i-send-custom-messages-in-chat`, false, 'Chat', 'Why Cannot Send Custom Messages - Owner')
      } else if (this.$route.name === 'JobChat') {
        this.openUrl(`${this.$t('link.href.help.center')}/pet-service-providers/why-can-t-i-send-custom-messages-in-chat-backer`, false, 'Chat', 'Why Cannot Send Custom Messages - Sitter')
      }
    },
    onOkBtn (codeStatus) {
      if (codeStatus === 30) {
        this.toBookingNow()
      } else if (codeStatus === 31) {
        this.$router.push({name: 'Sponsor'})
      }
    },
    triggerServerError (status, code = 0, message = null, okBtnLabel = this.$t('ok')) {
      if (code) {
        this.errorStatus = code
      }

      if (message) {
        this.errorMessage = message
      }

      if (okBtnLabel) {
        this.errorOkBtnLabel = okBtnLabel
      }

      this.serverErrorModal = status
    },
    onDispute () {
      this.disputeLoader = true
      if (this.$route.name === 'Chat') {
        this.$axios.post(`users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}/messages-unblock`, {}, {
          headers: {
            'Authorization': this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          this.closeMessageTemplate()
          this.$q.notify({name: 'Chat successfully unblock! Keep in mind not to share sensitive informations when chatting.', type: 'positive', positive: 'top'})
        }).catch((error) => {
          console.error(error)
          if (error.response && error.response.data) {
            this.triggerServerError(true, error.response.data.code, error.response.data.message, error.response.data.okBtnLabel)
          }
        }).finally(_ => {
          this.disputeLoader = false
        })
      } else {
        this.$axios.post(`users/${this.$store.state.user.uuid}/tasks/${this.$route.params.taskId}/messages-unblock`, {}, {
          headers: {
            'Authorization': this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          this.closeMessageTemplate()
          this.$q.notify({name: 'Chat successfully unblock! Keep in mind not to share sensitive informations when chatting.', type: 'positive', positive: 'top'})
        }).catch((error) => {
          console.error(error)
          if (error.response && error.response.data) {
            this.triggerServerError(true, error.response.data.code, error.response.data.message, error.response.data.okBtnLabel)
          }
        }).finally(_ => {
          this.disputeLoader = false
        })
      }
    },
    closeMessageTemplate () {
      this.$emit('trigger-updated', false)
      this.modal = false
    },
    loadMessageTemplate () {
      console.log('check route name', this.$route.name)
      switch (this.$route.name) {
        case 'Chat':
          if (this.$q.localStorage.has('messageTemplate')) {
            this.messageTemplateItems = this.$q.localStorage.getItem('messageTemplate').items
          }
          break
        case 'JobChat':
          if (this.$q.localStorage.has('messageTemplateJobs')) {
            console.log('check stroage for meesage template', this.$q.localStorage.getItem('messageTemplateJobs').items)
            this.messageTemplateItems = this.$q.localStorage.getItem('messageTemplateJobs').items
          }
          break
      }

      if (this.messageTemplateItems === null) {
        console.error('[MessageTemplate.vue] Message Template empty, could not find key (messageTemplate)!')
      }
    },
    openFaqTab () {
      this.openUrl(this.whySeeingThisLink)
    },
    openNewTab () {
      this.openUrl(this.readMoreUrl)
    },
    sendTimeMessage (responseMessage, url, message) {
      this.readMoreUrl = url
      this.templateMessage = message // for formatting string
      this.timeDialog = true
    },
    sendLocationMessage (responseMessage, url, message) {
      this.readMoreUrl = url
      this.templateMessage = message // for formatting string
      this.locationDialog = true
    },
    send () {
      this.$emit('send-message', this.messageBox)
      this.timeDialog = false
      this.locationDialog = false
      this.locationSelect = ''
      this.closeMessageTemplate()
    },
    checkDate (serviceStart) {
      return moment(serviceStart).format('YYYY-MM-DD') >= moment(this.today).format('YYYY-MM-DD')
    },
    toBookingNow () {
      if (this.$route.name === 'Chat') {
        this.$router.push(this.$route.path + '/checkout')
      } else if (this.$route.name === 'JobChat') {
        this.$router.push({name: 'Sponsor'})
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
        console.log(this.currentTime)
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
    onCheckError (type) {
      this.$refs.qDate.hide()
      this.$refs.qTime.hide()
      this.serviceStartFormat = moment(this.serviceStart).format('Do MMMM, YYYY')
      this.serviceStartTimeFormat = moment(this.serviceStartTime, 'HH:mm').format('LT')
    }
  }
}
</script>

<style lang="stylus" scoped>
.modal-header-desktop
  position: fixed
  max-width: 520px

.text-header
  margin-left: 13%

@media screen and (min-width: 360px)
    .text-header
      margin-left: 21%

@media screen and (min-width: 410px)
    .text-header
      margin-left: 23%

@media screen and (min-width: 600px)
    .text-header
      margin-left: 25%

.margin-top
  margin-top: 15px

@media screen and (min-width: 750px)
  .mobile-margin-top
    margin-top: 0px
  .margin-top
    margin-top: 10px
  .popup-width-height
    max-height: 600px
    max-width: 450px
  .time-dialog-box
    min-width:450px
    min-height: 600px
    position: relative
  .location-dialog-box
    min-height: 600px
    min-width: 450px
    z-index: 2500!important

.petImg
  object-fit: cover
  height: 74%
  width: 100%

.petImgDesktop
  object-fit: cover
  height: 80%
  width: 100%

.messageOptions
  box-shadow: 0px 2px 0px -1px white, 0px -1px 0px -1px white, 10px 0 15px -6px #E0E0E0, -10px 0 15px -6px #E0E0E0
  margin-bottom: 6px
  border-radius: 10px

.protection-bulb
  position: absolute
  top: 0
  left: calc(50% - 35px)
  padding: 10px
  background:  #fff
  width: 70px
  border-radius: 50%
  margin-top: -35px;
.protection-bulb-image
  width: 50px

.protection-desc
  font-size: 16px
  color: #111

.protection-title
  font-size 20px
  color: #444

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

.width-50
  width: 50%

</style>
