<template>
  <q-page class="q-mb-xl q-pb-xl">
    <!-- Carousel Header Image -->
    <carousel-header ref="listing-carousel" :carouselImages="images" :images="images" @trigger-gallery="triggerImageGallery">
      <template v-slot:dialog-gallery-edit>
        <!-- Dialog Gallery -->
        <q-dialog v-model="imageGalleryModal" @hide="showDeleteOption = false" :maximized="$q.platform.is.mobile" transition-show="slide-left" transition-hide="slide-right">
          <q-card>
            <q-toolbar style="z-index: 5000;" class="fixed-top borderline bg-white" :class="{'q-pt-xl': $q.platform.is.cordova}">
                <q-btn flat dense v-close-popup icon="chevron_left" size="lg"></q-btn>
                <q-toolbar-title v-close-popup >
                    <h6 class="q-my-none text-center">{{$t('photo.gallery.title')}}</h6>
                </q-toolbar-title>
                <q-btn flat dense label="Edit" :ripple="false" @click="onEdit" v-if="!showDeleteOption"></q-btn>
                <q-btn flat dense label="Done" :ripple="false" @click="showDeleteOption = false" v-else></q-btn>
            </q-toolbar>

            <!-- Images Gallery -->
            <q-card-section class="q-px-sm q-my-lg q-mt-xl">
              <dialog-gallery ref="services-gallery" :media="images" @on-image-upload="onNewImageUploaded" :showDeleteOption="showDeleteOption" @on-remove-image="onRemoveServiceImage" class="justify-center"></dialog-gallery>
            </q-card-section>
          </q-card>
        </q-dialog>
      </template>
    </carousel-header>

    <!-- About Listing User -->
    <div class="q-mx-md" >
      <q-item v-if="serviceInfo" dense class="q-mt-sm q-mb-md q-pl-xs" clickable @click="$router.push({name: 'PublicProfile', params: {userId: serviceInfo.userInfo.id}})">
        <q-item-section avatar>
          <q-avatar style="height: 70px; width: 70px;">
              <img :src="serviceInfo.userInfo.avatarImage" class="image-upload">
          </q-avatar>
        </q-item-section>

        <q-item-section class="q-my-sm">
          <q-item-label lines="1">
            <h6 class="q-my-none text-left" style="font-size: 17px;line-height: 1.2em;">{{serviceInfo.userInfo.username}}</h6>
          </q-item-label>

          <q-item-label class="q-my-sm text-grey" style="font-size: 11px;">
            <q-icon name="fas fa-star" style="font-size: 12px;" class="star-color q-mr-xs" v-for="i in serviceInfo.rating" :key="i"></q-icon>
            <span v-if="serviceInfo.numberOfRatings > 1">({{serviceInfo.numberOfRatings}})</span>
          </q-item-label>

          <q-item-label>
            <q-btn :label="$t('view.profile')" class="full-width" size="sm" dense color="primary"></q-btn>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item dense class="q-mt-sm q-mb-md q-pl-xs" v-else>
        <q-item-section avatar>
          <q-skeleton type="QAvatar" style="height: 70px; width: 70px;"></q-skeleton>
        </q-item-section>

        <q-item-section class="q-mb-md q-mt-sm">
          <q-item-label><q-skeleton class="q-my-sm" width="150px"></q-skeleton></q-item-label>
          <q-item-label><q-skeleton width="190px"></q-skeleton></q-item-label>
        </q-item-section>
      </q-item>
    </div>

    <!-- Preview Web Directory Listing -->
    <q-item v-if="serviceInfo" class="q-px-none q-mx-lg q-py-xs input" @click.native="openUrl(serviceInfo.listingUrl)">
      <q-item-section thumbnail class="q-pr-none q-pl-sm">
        <q-avatar icon="fas fa-globe-asia" class="text-grey-6"></q-avatar>
      </q-item-section>

      <q-item-section class="q-pl-none">
        <q-item-label class="font-normal" caption>{{$t('preview.web.directory.listing')}}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon name="chevron_right" size="sm"></q-icon>
      </q-item-section>
    </q-item>

    <div v-if="serviceInfo" class="q-mx-lg q-pb-xl">
        <!-- Listing Name -->
        <div class="q-mt-lg" @click="triggerUpdateListingNameModal(true)">
          <h6 class="q-my-none">{{$t('listing.name')}}<q-icon name="far fa-edit" class="float-right"></q-icon></h6>
          <q-item class="q-px-none q-py-md" style="border-bottom: solid 1px lightgrey;">
            <q-item-section>
              <q-item-label class="font-normal">{{serviceName}}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="chevron_right" class="float-right"></q-icon>
            </q-item-section>
          </q-item>
        </div>

        <!-- Listing Type -->
        <div class="q-mt-lg" >
          <h6 class="q-my-none">{{$t('category')}}</h6>
          <q-item class="q-px-none q-py-md" style="border-bottom: solid 1px lightgrey;">
            <q-item-section thumbnail class="q-pl-md">
              <q-avatar style="height: 40px; width: 40px;">
                <img :src="getServiceIcon(serviceInfo.services.subCategory[0].id)" height="40px" width="40px" class="image-upload">
              </q-avatar>
            </q-item-section>

            <q-item-section class="q-pl-none">
              <q-item-label class="font-normal">{{$t(getServiceName(serviceInfo.services.subCategory[0].id))}}</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <!-- Description -->
        <h6 class="q-mt-lg q-mb-none">{{$t('description')}}</h6>
        <div v-for="(questionForm, index) in questionLists" :key="questionForm.questionId">
          <template v-if="questionForm.type === 'label'">
            <p class="font-title q-my-none" :class="index > 1 ? 'q-mt-lg': 'q-mt-sm'">{{ questionForm.content }}</p>
          </template>
          <template v-else-if="questionForm.type === 'radioButtonSelector'" >
            <q-select dense v-model="questionForm.reply" :options="questionToArray(questionForm.content)" class="full-width"></q-select>
          </template>
          <template v-else-if="questionForm.type === 'checkBoxSelector'">
            <q-select dense class="full-width" multiple v-model="questionForm.reply" :options="questionToArray(questionForm.content)"></q-select>
          </template>
          <template v-else-if="questionForm.type === 'inputBox'">
            <input-summary
            :title="questionLists[index - 1].content"
            :replyInfo="questionForm.reply"
            :contentInfo="questionForm.content"
            :index="index"
            :loader="saveLoader"
            @on-save="onSaveSummary" :key="questionForm.questionId"></input-summary>
          </template>
          <template v-else-if="questionForm.type === 'numberBox'">
            <q-input type="number" dense class="full-width" v-model.number="questionForm.reply"></q-input>
          </template>
          <template v-else>
            <q-input dense class="full-width" v-model.number="questionForm.reply"></q-input>
          </template>
        </div>

        <!-- Service Rates -->
        <div class="q-mt-lg" @click="triggerServiceRateDialog(true)">
          <h6 class="q-my-none">{{$t('service.rates.title')}}<q-icon name="far fa-edit" class="float-right"></q-icon></h6>
          <q-item v-for="serviceRate in serviceInfo.ratesInfo.items" :key="serviceRate.ratesId" class="q-px-none q-py-md" style="border-bottom: solid 1px lightgrey;">
            <q-item-section>
              <q-item-label class="font-normal">{{computeRates(serviceRate.ratesCurrencyId, serviceRate.ratesAmount, serviceRate.ratesUnit)}}</q-item-label>
              <q-item-label caption lines="1" v-if="serviceRate.ratesDescription">{{serviceRate.ratesDescription}}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="chevron_right" class="float-right"></q-icon>
            </q-item-section>
          </q-item>
        </div>

        <!-- Video Url -->
        <div class="q-mt-lg">
          <h6 class="q-my-none">{{$t('video')}}<q-icon name="far fa-edit" class="float-right"></q-icon></h6>
          <q-item class="q-px-none q-pb-md" style="border-bottom: solid 1px lightgrey;" @click.native="triggerVideoModal(true)">
            <q-item-section>
              <q-item-label class="font-normal" lines="1" caption v-if="serviceInfo.videoUrl">{{serviceInfo.videoUrl}}</q-item-label>
              <q-item-label class="font-normal" v-else caption>{{$t('add.youtube.video')}}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="chevron_right" class="float-right"></q-icon>
            </q-item-section>
          </q-item>
        </div>

        <!-- Greeting Message -->
        <div class="q-mt-lg">
          <h6 class="q-my-none">{{$t('greeting.message')}}<q-icon name="far fa-edit" class="float-right"></q-icon></h6>
          <q-item class="q-px-none q-pb-md" style="border-bottom: solid 1px lightgrey;" @click.native="triggerGreetingModal(true)">
            <q-item-section>
              <q-item-label class="font-normal" lines="2" caption v-if="serviceInfo.greeting !== 'Hello #username, I would like to help you with your #service request. Hi Everyone!'">{{serviceInfo.greeting}}</q-item-label>
              <q-item-label class="font-normal" caption v-else>{{$t('add.greeting.message')}}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="chevron_right" class="float-right"></q-icon>
            </q-item-section>
          </q-item>
        </div>

        <!-- Location -->
        <div class="q-mt-lg" ref="edit-location" @click="triggerEditLocationDialog(true)">
            <h6 class="q-my-none">{{$t('listing.location')}}<q-icon name="far fa-edit" class="float-right"></q-icon></h6>
            <q-img :src="`https://www.google.com/maps/api/staticmap?size=${deviceWidth - 30}x200&zoom=13&center=${serviceLocation.latitude},${serviceLocation.longitude}&key=${PROCESS.GOOGLE_MAPS_KEY}`">
                <!-- Service Location  -->
                <div class="absolute-bottom" style="padding: 7px;">
                    <q-item dense class="q-pa-none">
                        <q-item-section class="q-pa-none">
                            <q-item-label lines="2">{{serviceLocation.city}}, {{serviceLocation.country}}</q-item-label>
                        </q-item-section>
                    </q-item>
                </div>
            </q-img>
        </div>
    </div>
    <div v-else class="text-center">
      <ComponentPreLoader></ComponentPreLoader>
    </div>

    <!-- Bottom Buttons -->
    <div class="fixed-bottom bg-primary" style="border-top-right-radius: 15px;border-top-left-radius: 15px;z-index: 2000;">
      <div class="q-pa-md q-pb-lg" @click="onSaveListing">
        <div class="text-white q-pb-sm text-center cursor-pointer font-header-title">
          <span v-if="!loader" class="text-weight-bold font-title">{{$t('button.save')}}</span>
          <span v-else>
            <q-spinner size="1.5em"></q-spinner>
          </span>
        </div>
      </div>
    </div>

    <!-- Dialog Video -->
    <dialog-video v-if="serviceInfo" :trigger="editVideoModal" :loader="saveLoader" :videoUrl="serviceInfo.videoUrl === null ? '' : serviceInfo.videoUrl" @on-save="onSaveVideo" @on-close="triggerVideoModal"></dialog-video>

    <!-- Dialog Greeting Message -->
    <dialog-add-greeting v-if="serviceInfo" :trigger="editGreetingModal" :loader="saveLoader" :greetingMessage="serviceInfo.greeting" @on-save="onSaveGreetings" @on-close="triggerGreetingModal"></dialog-add-greeting>

    <!-- Dialog Edit Service Rate -->
    <dialog-service-rates v-if="serviceInfo" :trigger="serviceRateModal" :serviceRates="serviceInfo.ratesInfo.items" :loader="saveLoader" @on-save="onSaveRates" @on-close="triggerServiceRateDialog"></dialog-service-rates>

    <!-- Dialog Edit Location -->
    <dialog-edit-location v-if="serviceInfo" :trigger="editLocationModal" :serviceInfo="serviceInfo" :locationResponse="locationResponse" :loader="saveLoader" @on-save="onSaveLocationInfo" @on-close="triggerEditLocationDialog"></dialog-edit-location>

    <!-- Dialog To Update Listing Name -->
    <dialog-update-listingname v-if="serviceInfo" :trigger="updateListingNameModal" :loader="saveLoader" :listingName="serviceName" :serviceType="$t(getServiceName(serviceInfo.services.subCategory[0].id))" @on-save="onSaveListingName" @on-close="triggerUpdateListingNameModal"></dialog-update-listingname>
  </q-page>
</template>

<script>
/* eslint-disable no-eval */
import countries from 'assets/countries.json'
import moment from 'moment'
import services from 'assets/services.json'

export default {
  components: {
    'carousel-header': () => import('components/Listing/ListingCarousel.vue'),
    'dialog-edit-location': () => import('components/CreateListing/DialogEditLocation.vue'),
    'dialog-service-rates': () => import('components/CreateListing/DialogServiceRates.vue'),
    'dialog-update-listingname': () => import('components/CreateListing/DialogListingName.vue'),
    'input-summary': () => import('components/CreateListing/InputSummary.vue'),
    'dialog-gallery': () => import('components/CreateListing/PhotoGallery.vue'),
    'dialog-add-greeting': () => import('components/CreateListing/DialogGreeting.vue'),
    'dialog-video': () => import('components/CreateListing/DialogVideo.vue')
  },
  data () {
    return {
      questionLists: null,
      serviceInfo: null,
      editLoading: false,
      MOMENT: moment,
      updateListingNameModal: false,
      deviceWidth: screen.width,
      images: [],
      imageGalleryModal: false,
      showDeleteOption: false,
      saveLoader: false,
      editLocationModal: false,
      serviceRateModal: false,
      serviceName: null,
      serviceLocation: {
        latitude: null,
        longitude: null,
        city: null,
        country: null
      },
      loader: false,
      editGreetingModal: false,
      editVideoModal: false,
      locationResponse: null
    }
  },
  created () {
    this.getListingInfo()
    console.log('Check the location from google', this.locationResponse)
  },
  methods: {
    onSaveSummary (index, summaryInfo) {
      console.log(index, summaryInfo)
      this.saveLoader = true
      console.log('Check the location from google', this.locationResponse)
      // generate latest summary info
      this.questionLists[index].reply = summaryInfo
      console.log(this.questionLists)
      let listingInfo = {
        'serviceInfo': {
          'userServiceDescriptionJson': JSON.stringify(this.modelConversion())
        }
      }

      this.$axios.put(`users/${this.$store.state.user.uuid}/services/${this.$route.params.listingId}`, listingInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$q.notify({
          message: `Your listing summary updated!`,
          timeout: 2000,
          type: 'positive',
          position: 'top'
        })

        let questionLists = JSON.parse(response.data.serviceInfo.userServiceDescriptionJson).question
        for (var index in questionLists) {
          if (questionLists[index].type === 'checkBoxSelector') {
            if (questionLists[index].reply) {
              questionLists[index].reply = questionLists[index].reply.split(', ')
            } else {
              questionLists[index].reply = []
            }
          }
        }
        this.questionLists = questionLists
      }).catch(e => {
        console.error(e)
        let errorMessage = this.$t('requests.error.title')
        if (e.response && e.response.data) {
          errorMessage = e.response.data.message
        }
        this.$q.notify({
          message: errorMessage,
          timeout: 1000,
          type: 'negative',
          position: 'top'
        })
      }).finally(_ => {
        this.saveLoader = false
      })
    },
    triggerVideoModal (status) {
      this.editVideoModal = status
    },
    onSaveVideo (videoInfo) {
      this.saveLoader = true
      let serviceInfo = {
        'serviceInfo': {
          'videoUrl': (videoInfo === null || videoInfo === '' || videoInfo === ' ') ? null : videoInfo
        }
      }

      this.$axios.put(`users/${this.$store.state.user.uuid}/services/${this.$route.params.listingId}`, serviceInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.serviceInfo.videoUrl = videoInfo
      }).catch((error) => {
        this.forceLogout(error)
        console.error(error)
      }).finally(_ => {
        this.saveLoader = false
        this.triggerVideoModal(false)
      })
    },
    triggerGreetingModal (status) {
      this.editGreetingModal = status
    },
    onSaveGreetings (greetingInfo) {
      this.saveLoader = true
      let serviceInfo = {
        'serviceInfo': {
          'greeting': greetingInfo
        }
      }

      this.$axios.put(`users/${this.$store.state.user.uuid}/services/${this.$route.params.listingId}`, serviceInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.serviceInfo.greeting = greetingInfo
      }).catch((error) => {
        this.forceLogout(error)
        console.error(error)
      }).finally(_ => {
        this.saveLoader = false
        this.triggerGreetingModal(false)
      })
    },
    triggerImageGallery (status) {
      this.imageGalleryModal = status

      if (status) {
        setTimeout(() => {
          this.$refs['listing-carousel'].resetSlider()
        }, 350)
      }
    },
    onSaveRates (ratesInfo) {
      let serviceInfo = {
        'serviceInfo': {
          'ratesInfo': ratesInfo
        }
      }

      this.$axios.put(`users/${this.$store.state.user.uuid}/services/${this.$route.params.listingId}`, serviceInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.serviceInfo.ratesInfo.items = response.data.serviceInfo.ratesInfo.items
      }).catch((error) => {
        this.forceLogout(error)
        console.error(error)
      }).finally(_ => {
        this.saveLoader = false
      })
    },
    triggerServiceRateDialog (status) {
      this.serviceRateModal = status
    },
    computeRates (currencyId, amount, unit) {
      let currency = this.$_.findWhere(countries, {'id': currencyId.toString()}).currencyCode
      return `${currency} ${amount}/${unit}`
    },
    triggerEditLocationDialog (status) {
      this.editLocationModal = status
    },
    onSaveLocationInfo (index, locationInfo, locationResponse) {
      console.log('hearing for location response', locationResponse)
      let serviceCoverage = this.serviceInfo.serviceLocation
      serviceCoverage.splice(index, 1, locationInfo)
      console.log('check location from google', this.locationResponse)
      this.saveLoader = true

      this.saveLoader = true

      let serviceInfo = {
        'serviceInfo': {
          'serviceLocation': serviceCoverage,
          'locationJson': locationResponse // Add the locationJson key
        }
      }

      this.$axios.put(`users/${this.$store.state.user.uuid}/services/${this.$route.params.listingId}`, serviceInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.serviceLocation.latitude = response.data.serviceInfo.serviceLocation[0].latitude
        this.serviceLocation.longitude = response.data.serviceInfo.serviceLocation[0].longitude
        this.serviceLocation.city = response.data.serviceInfo.serviceLocation[0].city
        this.serviceLocation.country = response.data.serviceInfo.serviceLocation[0].country
      }).catch((error) => {
        this.forceLogout(error)
        console.error(error)
      }).finally(_ => {
        this.saveLoader = false
        this.triggerEditLocationDialog(false)
      })
    },
    onSaveListingName (newListingName) {
      this.saveLoader = true
      let serviceInfo = {
        'serviceInfo': {
          'userServiceName': newListingName
        }
      }

      this.$axios.put(`users/${this.$store.state.user.uuid}/services/${this.$route.params.listingId}`, serviceInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.serviceName = response.data.serviceInfo.userServiceName
      }).catch((error) => {
        this.forceLogout(error)
        console.error(error)
      }).finally(_ => {
        this.saveLoader = false
        this.triggerUpdateListingNameModal(false)
      })
    },
    scrollToEditLocation () {
      let elem = this.$refs['edit-location']
      window.scrollTo({
        top: elem.offsetTop + 100,
        behavior: 'smooth'
      })
    },
    onRemoveServiceImage (index) {
      if (index === 0 && this.images.length === 1) {
        this.$q.notify({
          color: 'negative',
          message: 'You must have at least one photo'
        })
        return
      }
      this.images.splice(index, 1)
      console.log('check index of image', index)

      // convert images into array
      let serviceImages = []
      for (let index in this.images) {
        serviceImages.push(this.images[index].id || this.images[index].fileName)
      }

      let serviceInfo = {
        'serviceInfo': {
          'serviceImage': serviceImages
        }
      }

      this.$axios.put(`users/${this.$store.state.user.uuid}/services/${this.$route.params.listingId}`, serviceInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.images = response.data.serviceInfo.serviceImage
      }).catch((error) => {
        this.forceLogout(error)
        console.error(error)
      }).finally(_ => {
        this.$refs['services-gallery'].loadImage()
      })
    },
    onEdit () {
      this.showDeleteOption = true
    },
    triggerUpdateListingNameModal (status) {
      this.updateListingNameModal = status
    },
    onNewImageUploaded (mediaInfo) {
      this.images.push(mediaInfo)

      // convert images into array
      let serviceImages = []
      for (let index in this.images) {
        serviceImages.push(this.images[index].id || this.images[index].fileName)
      }

      let serviceInfo = {
        'serviceInfo': {
          'serviceImage': serviceImages
        }
      }

      this.$axios.put(`users/${this.$store.state.user.uuid}/services/${this.$route.params.listingId}`, serviceInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.images = response.data.serviceInfo.serviceImage
      }).catch((error) => {
        this.forceLogout(error)
        console.error(error)
      })
    },
    getListingInfo () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/services/${this.$route.params.listingId}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.serviceInfo = response.data.serviceInfo
        this.serviceName = response.data.serviceInfo.userServiceName
        this.images = response.data.serviceInfo.serviceImage

        this.serviceLocation.latitude = response.data.serviceInfo.serviceLocation[0].latitude
        this.serviceLocation.longitude = response.data.serviceInfo.serviceLocation[0].longitude
        this.serviceLocation.city = response.data.serviceInfo.serviceLocation[0].city
        this.serviceLocation.country = response.data.serviceInfo.serviceLocation[0].country

        let questionLists = JSON.parse(this.serviceInfo.userServiceDescriptionJson).question
        for (var index in questionLists) {
          if (questionLists[index].type === 'checkBoxSelector') {
            if (questionLists[index].reply) {
              questionLists[index].reply = questionLists[index].reply.split(', ')
            } else {
              questionLists[index].reply = []
            }
          }
        }

        this.questionLists = questionLists
        if (response.data.serviceInfo.listingUrl) {
          // this.$emit('listing-name', response.data.serviceInfo.userServiceName, response.data.serviceInfo.listingUrl.split('.com')[1])
          this.$emit('listing-name', response.data.serviceInfo.userServiceName, response.data.serviceInfo.listingUrl)
        } else {
          this.$emit('listing-name', response.data.serviceInfo.userServiceName)
        }
        this.$emit('get-response-user-info', response.data.serviceInfo)
      }).catch((error) => {
        this.forceLogout(error)
        console.error(error)
      }).finally(_ => {
        if (this.$route.query.editLocation === 1) {
          setTimeout(() => {
            this.triggerEditLocationDialog(true)
          }, 120)
        }
      })
    },
    getServiceIcon (id) {
      let service = this.$_.findWhere(services, {'id': id})

      if (service) {
        return service.icon
      }

      return ''
    },
    getServiceName (id) {
      let service = this.$_.findWhere(services, {'id': id})

      if (service) {
        return service.name
      }

      return ''
    },
    questionToArray (arrayObject) {
      let arrayVal = null

      if (Array.isArray(arrayObject)) {
        arrayVal = arrayObject
      } else {
        // arrayVal = eval(arrayObject)
        let a = arrayObject
        a = a.replace(/^(\[')|('])$/g, '')
        arrayVal = a.split(`','`)
      }

      return arrayVal
    },
    // Convert some input into values that will be accepted by the server
    modelConversion () {
      const questionLists = this.questionLists

      for (var index in questionLists) {
        if (questionLists[index].type === 'checkBoxSelector') {
          console.log(index, questionLists[index].reply)
          if (questionLists[index].reply) {
            questionLists[index].reply = questionLists[index].reply.join(', ')
          } else {
            questionLists[index].reply = ''
          }
        } else if (questionLists[index].type === 'radioButtonSelector') {
          if (questionLists[index].reply.label) {
            questionLists[index].reply = questionLists[index].reply.value
          } else {
            questionLists[index].reply = questionLists[index].reply
          }
        } else {
          questionLists[index].reply = questionLists[index].reply
        }
      }
      return {'question': questionLists}
    },
    onSaveListing () {
      this.loader = true
      let listingInfo = {
        'serviceInfo': {
          'userServiceDescriptionJson': JSON.stringify(this.modelConversion())
        }
      }

      this.$axios.put(`users/${this.$store.state.user.uuid}/services/${this.$route.params.listingId}`, listingInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$q.notify({
          message: `Your listing has been updated`,
          timeout: 2000,
          type: 'positive',
          position: 'top'
        })
        this.$router.go(-1)
      }).catch(e => {
        console.error(e)
        let errorMessage = this.$t('requests.error.title')
        if (e.response && e.response.data) {
          errorMessage = e.response.data.message
        }
        this.$q.notify({
          message: errorMessage,
          timeout: 1000,
          position: 'top'
        })
      }).finally(_ => {
        this.loader = false
      })
    }
  }
}
</script>
