<template>
    <q-layout class="justify-center" :class="$q.platform.is.desktop ? 'row bg-grey-1' : ''">
        <div class="bg-white q-pb-xl q-mx-none" :class="$q.platform.is.desktop ? 'col-md-6' : ''">
          <!-- Requestion location in maps -->
          <q-item class="clickable q-pt-none q-px-none" :class="$q.platform.is.mobile ? 'q-px-none' : ''" v-if="$route.name !== 'Checkout'">
            <q-item-section style="height: 199px;">
              <iframe
                v-if="request"
                sandbox="allow-same-origin allow-pointer-lock allow-scripts"
                :width="(deviceWidth - 8)"
                scrolling="no"
                height="200"
                frameborder="0"
                allowtransparency="true"
                style="border:0;"
                :src="`https://www.google.com/maps/embed/v1/view?center=${request.requestInfo.latitude},${request.requestInfo.longitude}&zoom=13&key=${PROCESS.GOOGLE_MAPS_KEY}`"
              ></iframe>
              <div v-else-if="$q.platform.is.cordova" ref="map" style="height:200px;" :style="{width: (deviceWidth - 8)}">
                <q-skeleton :width="`${(deviceWidth - 8)}px`" height="180px"></q-skeleton>
                <!-- <q-icon name="img:http://storage.googleapis.com/petbacker/images/cms/map_coverage_64.png" style="position: absolute;width: 150px;height: 150px;left: 31%;top: 1%;"></q-icon>
                <img class="image-upload" :src="`https://www.google.com/maps/api/staticmap?size=${deviceWidth}x180&zoom=13&center=${this.request.requestInfo.latitude},${this.request.requestInfo.longitude}&key=${PROCESS.GOOGLE_MAPS_KEY}`" /> -->
              </div>
            </q-item-section>
          </q-item>

          <!-- Request Service type -->
          <q-item dense class="q-mx-md">
            <q-item-section thumbnail>
              <q-icon name="fas fa-clipboard-check" size="18px" color="black"></q-icon>
            </q-item-section>
            <q-item-section class="font-normal ">{{$t(getServiceName(request.requestInfo.serviceId))}}</q-item-section>
          </q-item>

          <!-- Request Description -->
          <q-item dense class="q-mx-md">
            <q-item-section thumbnail>
              <q-icon name="far fa-calendar-alt" size="18px" color="black"></q-icon>
            </q-item-section>
            <q-item-section class="font-normal">{{request.requestInfo.requestDescriptionShort}}</q-item-section>
          </q-item>

          <!-- Request Location -->
          <q-item dense class="q-mx-md">
            <q-item-section thumbnail >
              <q-icon name="fas fa-map-marker-alt" size="18px" color="black"></q-icon>
            </q-item-section>
            <q-item-section class="font-normal">{{request.requestInfo.fullAddress}}</q-item-section>
          </q-item>

          <!-- Request time since created -->
          <q-item dense class="q-mx-md">
            <q-item-section thumbnail>
              <q-icon name="far fa-clock" size="18px" color="black"></q-icon>
            </q-item-section>
            <q-item-section class="font-normal">{{computeTime(request.requestInfo.requiredTime)}}</q-item-section>
          </q-item>

          <q-separator class="q-my-md" style="height: 2px;" inset></q-separator>

          <!-- Pets to be boarded/hosted -->
          <q-item class="clickable q-my-sm" v-if="request.requestInfo.personalItemsInfo.items.length > 0">
            <q-item-section>
              <q-item-label lines="1" class="font-normal text-weight-bold">{{$t('pets.to.be.boarded')}}</q-item-label>
              <pet-card-horizontal v-for="pet in request.requestInfo.personalItemsInfo.items" :key="pet.id" :pet="pet"></pet-card-horizontal>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" style="height: 2px;" inset v-if="request.requestInfo.personalItemsInfo.items.length > 0" ></q-separator>

          <!-- V5 form info (old questionaire) -->
          <!-- Number of Pets -->
          <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 102 || question.questionId === 2) > -1">
            <q-item-section>
              <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 102 || question.questionId === 2) - 1].listingDisplay}}</q-item-label>
              <q-item-label lines="2" class="font-normal">{{ requestQuestionLists.find(question => question.questionId === 102 || question.questionId === 2).reply }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" style="height: 2px;" inset  v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 102 || question.questionId === 2) > -1"></q-separator>

          <!-- Pet Type -->
          <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 104 || question.questionId === 4) > -1">
            <q-item-section>
              <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 104 || question.questionId === 4) - 1].listingDisplay}}</q-item-label>
              <q-item-label lines="2" class="font-normal">{{ requestQuestionLists.find(question => question.questionId === 104 || question.questionId === 4).reply }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" style="height: 2px;" inset  v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 104 || question.questionId === 4) > -1"></q-separator>

          <!-- Pet Breed -->
          <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 106 || question.questionId === 6 || question.questionId === 125) > -1">
            <q-item-section>
              <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 106 || question.questionId === 6 || question.questionId === 125) - 1].listingDisplay}}</q-item-label>
              <q-item-label lines="2" class="font-normal">{{ requestQuestionLists.find(question => question.questionId === 106 || question.questionId === 6 || question.questionId === 125).reply }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" style="height: 2px;" inset  v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 106 || question.questionId === 6 || question.questionId === 125) > -1"></q-separator>

          <!-- Pet Size -->
          <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 108 || question.questionId === 8) > -1">
            <q-item-section>
              <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 108 || question.questionId === 8) - 1].listingDisplay}}</q-item-label>
              <q-item-label lines="2" class="font-normal">{{ requestQuestionLists.find(question => question.questionId === 108 || question.questionId === 8).reply }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" style="height: 2px;" inset  v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 108 || question.questionId === 8) > -1"></q-separator>

          <!-- Taxi Specific (Pick up location) -->
          <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90032 || question.questionId === 16) > -1">
            <q-item-section>
              <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 90032 || question.questionId === 16) - 1].listingDisplay}}</q-item-label>
              <q-item-label lines="2" class="font-normal">{{requestQuestionLists.find(question => question.questionId === 90032 || question.questionId === 16).reply}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90032 || question.questionId === 16) > -1"></q-separator>

          <!-- Taxi Specific (Drop Off location) -->
          <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90010) > -1">
            <q-item-section>
              <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 90010) - 1].listingDisplay}}</q-item-label>
              <q-item-label lines="2" class="font-normal">{{requestQuestionLists.find(question => question.questionId === 90010).reply}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90010) > -1"></q-separator>

          <!-- Type of Photography required -->
          <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90036) > -1">
            <q-item-section>
              <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 90036) - 1].listingDisplay}}</q-item-label>
              <q-item-label lines="2" class="font-normal">{{requestQuestionLists.find(question => question.questionId === 90036).reply}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90036) > -1"></q-separator>

          <!-- Preferred location of Photography -->
          <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90038) > -1">
            <q-item-section>
              <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 90038) - 1].listingDisplay}}</q-item-label>
              <q-item-label lines="2" class="font-normal">{{requestQuestionLists.find(question => question.questionId === 90038).reply}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90038) > -1"></q-separator>

          <!-- Preferred kind of Photography -->
          <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90040) > -1">
            <q-item-section>
              <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 90040) - 1].listingDisplay}}</q-item-label>
              <q-item-label lines="2" class="font-normal">{{requestQuestionLists.find(question => question.questionId === 90040).reply}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90040) > -1"></q-separator>

          <!-- Preferred Format of Photography -->
          <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90042) > -1">
            <q-item-section>
              <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 90042) - 1].listingDisplay}}</q-item-label>
              <q-item-label lines="2" class="font-normal">{{requestQuestionLists.find(question => question.questionId === 90042).reply}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90042) > -1"></q-separator>

          <!-- Number of edited Photography -->
          <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90044) > -1">
            <q-item-section>
              <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 90044) - 1].listingDisplay}}</q-item-label>
              <q-item-label lines="2" class="font-normal">{{requestQuestionLists.find(question => question.questionId === 90044).reply}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90044) > -1"></q-separator>

          <!-- Type of grooming service required -->
          <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90051) > -1">
            <q-item-section>
              <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 90051) - 1].listingDisplay}}</q-item-label>
              <q-item-label lines="2" class="font-normal">{{requestQuestionLists.find(question => question.questionId === 90051).reply}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90051) > -1"></q-separator>

          <!-- Date Service Required -->
          <q-item class="q-my-sm">
            <q-item-section>
              <q-item-label lines="1" class="font-normal text-weight-bold">{{$t('date.service.required')}}</q-item-label>
              <q-item-label lines="2" class="font-normal">{{ request.requestInfo.requiredTime | readableDate }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" style="height: 2px;" inset></q-separator>

          <!-- Number of <units> requires -->
          <q-item class="q-my-sm">
            <q-item-section >
              <q-item-label lines="1" class="font-normal text-weight-bold">{{ $t('number.of.units.required', {unit: request.requestInfo.unit }) }}</q-item-label>
              <q-item-label lines="2" class="font-normal">{{ request.requestInfo.duration }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" style="height: 2px;" inset></q-separator>

          <!-- Pick Up Service Required -->
          <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => PICK_UP.indexOf(question.questionId) > -1) > -1">
            <q-item-section>
              <q-item-label lines="1" class="font-normal text-weight-bold">{{$t('pet.pickup.service.required')}}</q-item-label>
              <q-item-label lines="2" class="font-normal">{{ requestQuestionLists.find(question => PICK_UP.indexOf(question.questionId) > -1).reply }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestQuestionLists && requestQuestionLists.findIndex(question => PICK_UP.indexOf(question.questionId) > -1) > -1"></q-separator>

          <!-- Additional information -->
          <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => ADDITIONAL_INFO.indexOf(question.questionId) > -1) > -1 && requestQuestionLists.find(question => ADDITIONAL_INFO.indexOf(question.questionId) > -1).reply">
            <q-item-section>
              <q-item-label lines="1" class="font-normal text-weight-bold">{{$t('additional.info.you.should.know')}}</q-item-label>
              <q-item-label lines="2" class="font-normal">{{ requestQuestionLists.find(question => ADDITIONAL_INFO.indexOf(question.questionId) > -1).reply }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" style="height: 2px;" inset  v-if="requestQuestionLists && requestQuestionLists.findIndex(question => ADDITIONAL_INFO.indexOf(question.questionId) > -1) > -1 && requestQuestionLists.find(question => ADDITIONAL_INFO.indexOf(question.questionId) > -1).reply"></q-separator>

          <!-- Job/Request Reference No. -->
          <q-item class="clickable q-my-sm q-mb-xl" @click.native="copiedSuccessText = $t('booking.ref.successfully.copied');onCopy((request.jobReference || request.requestInfo.requestReference).toUpperCase())">
            <q-item-section>
              <q-item-label lines="1" class="font-normal text-weight-bold" v-if="$route.name === 'ViewRequest'">{{$t('request.reference')}}</q-item-label>
              <q-item-label lines="1" class="font-normal text-weight-bold" v-else-if="$route.name === 'ViewJob'">{{$t('job.reference')}}</q-item-label>
              <q-item-label lines="2" class="font-normal text-uppercase text-primary">{{ request.jobReference || request.requestInfo.requestReference}}<q-icon class="q-ml-sm q-mb-sm" name="far fa-copy"></q-icon></q-item-label>
            </q-item-section>
          </q-item>

          <!-- Bottom Buttons -->
          <div class="fixed-bottom" v-if="$q.platform.is.mobile && request.requestInfo.status === STATUS.REQUEST_STATUS_PENDING">
            <q-btn class="full-width q-pt-xs q-pb-md text-capitalize" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" size="lg" :ripple="false" :label="$t('requests.page.editrequest')" color="primary" @click.native="$router.push({ name: 'EditRequest', params: {requestId: $route.params.requestId} })"></q-btn>
          </div>
          <div class="q-mx-md q-mb-xl" v-else-if="request.requestInfo.status === STATUS.REQUEST_STATUS_PENDING">
            <q-btn :disable="disableEdit" v-if="$route.params.requestId" class="full-width float-right q-ma-sm q-my-lg q-mx-sm" :label="$t('requests.page.editrequest')" color="primary" @click.native="$router.push({ name: 'EditRequest', params: {requestId: $route.params.requestId} })"/>
            <q-btn :hidden="true" class="float-right q-my-lg q-mx-sm" :label="$t('button.back')" @click.native="$router.go(-1)"/>
          </div>
        </div>
    </q-layout>
</template>
<script>
import requestStatus from 'assets/request-status.json'
import formListings from 'assets/form-request-v3.json'
import services from 'assets/services.json'
import moment from 'moment'
import clipboard from '../mixins/copyClipboardMixin.js'

export default {
  mixins: [clipboard],
  components: {
    'pet-card-horizontal': () => import('components/PetProfile/PetCardHorizontal.vue')
  },
  props: {
    disableEdit: {
      type: Boolean,
      default: false
    },
    requestQuestionLists: {
      type: Array,
      default: null,
      required: true
    },
    serviceStart: {
      type: String,
      default: null,
      required: true
    },
    request: {
      type: Object,
      default: null,
      required: true
    }
  },
  data () {
    return {
      NAME_OF_PET: 1,
      TYPE_OF_PET: 3,
      BREED_OF_PET: 5,
      SIZE_OF_PET: 7,
      DOB_OF_PET: 11,
      NO_OF_PET: 1,
      ADD_INFO: 6,
      ADDITIONAL_INFO: [10, 110, 119, 123, 129, 90022, 90046],
      PICK_UP: [90012],
      STATUS: requestStatus,
      deviceWidth: screen.width,
      mapUrl: null,
      gmap: null
    }
  },
  filters: {
    readableDate: function (value) {
      return moment(value).format('D MMM, YYYY')
    }
  },
  methods: {
    replyConversion: function (value) {
      if (Array.isArray(value)) {
        return value.toString()
      } else {
        return value
      }
    },
    formatAge (petDOB) {
      let today = moment()
      return moment.utc(petDOB).local().diff(today, 'year')
    },
    computeTime (time) {
      return moment.utc(time).local().format('h:mm A')
    },
    getServiceName (id) {
      for (let items in services) {
        if (services[items].id === id) {
          return services[items].name
        }
      }
      return 'failed'
    },
    getQuestion (questionID, index) {
      let service = this.request.requestInfo.serviceName.toLowerCase().replace(/\s/g, '')

      if (service === 'pettaxiandtransport') {
        service = 'pettaxi'
      }

      let formLang = 'services.' + service + '.' + this.$store.getters['user/getCurrentLanguage']
      let currentLangForm = JSON.parse(formListings[formLang].story)
      if (index < currentLangForm.question.length) {
        return currentLangForm.question[index].listingDisplay
      }

      return null
    }
  }
}
</script>
