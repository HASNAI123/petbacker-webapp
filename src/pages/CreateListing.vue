<template>
    <q-page class="justify-center q-pb-xl margin-auto" style="min-height:100%;height: 100%;" padding v-if="questionLists.length > 0" :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}">
      <div >
        <!-- Listing Name -->
        <div v-if="count === 0" class="q-mx-sm">
            <p class="font-title text-weight-bold q-mt-md q-mb-sm">{{$t('give.name.to.service')}}</p>
            <p class="q-my-xs text-grey-6 q-my-sm q-mb-md">{{$t('use.combination.city.town')}}</p>
            <q-input v-model="listingInfo.name" :input-class="{'text-grey-6': listingInfo.name === null || listingInfo.name === ''}" :placeholder="$t('service.name.placeholder')" borderless dense class="input" :error="listingNameError && !listingInfo.name" hide-bottom-space></q-input>
        </div>

        <!-- Question Form -->
        <div v-else-if="count === 1" class="q-mx-sm" >
            <div v-for="(question) in questionLists" :key="question.questionId">
                <div v-if="question.type === 'label'" class="text-weight-bold font-title row" style="margin-top: 20px;">
                    {{ question.content }}
                    <!--<span class="strong emphasize" v-if="String(question.required) !== '1'">({{ $t('optional') }})</span>-->
                </div>
                <div v-else-if="question.type !== 'label'" class="row q-mb-xl q-pb-md">
                    <div v-if="question.type === 'inputBox'" class="col-12">
                        <q-input type="textarea" :input-class="{'text-grey-6': !question.hasOwnProperty('reply') || question.reply === ''}" v-model="question.reply" :placeholder="question.content" borderless dense class="input" :error="showError && (question.required === '1') && !question.reply"></q-input>
                    </div>
                    <div v-else-if="question.type === 'radioButtonSelector'" class="col-12">
                        <q-select v-model="question.reply" :options="questionToArray(question.content)" :error="showError && (question.required === '1') && !question.reply"></q-select>
                    </div>
                    <div v-else-if="question.type === 'checkBoxSelector'" class="col-12">
                        <q-select v-model="question.reply" :options="questionToArray(question.content)" multiple :error="showError && (question.required === '1') &&  !question.reply"></q-select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Service Rates -->
        <div v-else-if="count === 2" class="q-mx-sm">
          <div >
            <div v-for="(rate, index) in listingInfo.serviceRates" :key="index" :class="{'row': onEdit}">
              <!-- Delete Button to show on edit -->
              <div v-if="onEdit" class="col-2 row" >
                <q-icon name="fas fa-trash" size="20px" class="col-12" color="negative" @click="onDelete(index)"></q-icon>
              </div>

              <!-- Rate Cards -->
              <q-item class="q-my-sm font-normal col-10" style="border: 1px solid lightgrey; border-radius: 12px;" @click.native="editServiceRates(rate, index)">
                <q-item-section>
                  <q-item-label lines="1" class="font-title">{{rate.ratesTitle}}</q-item-label>
                  <q-item-label lines="1"><span class="text-weight-bold">{{rate.currency}}{{rate.ratesAmount}}</span>{{rate.ratesUnit}}</q-item-label>
                  <q-item-label lines="1" class="text-wrap" caption>{{rate.ratesDescription}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div style="display:block;">
                    <q-item-label><q-icon name="chevron_right" size="1.5em"></q-icon></q-item-label>
                  </div>
                </q-item-section>
              </q-item>
            </div>

            <!-- Add Rate button -->
            <q-item class="q-my-sm font-normal" style="border: 1px solid lightgrey; border-radius: 12px;opacity: 1;" @click.native="triggerAddServiceRateModal(true)">
              <q-item-section>
                <q-item-label lines="1" class="font-title">{{$t('add.service.rate.title')}}</q-item-label>
                <q-item-label caption>{{$t('service.rates.add.multiple')}}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <div style="display:block;">
                  <q-item-label><q-icon name="chevron_right" size="1.5em"></q-icon></q-item-label>
                </div>
              </q-item-section>
            </q-item>
          </div>
        </div>

        <!-- Listing Location -->
        <div v-else-if="count === 3" class="q-mt-sm q-mx-sm">
          <h6 class="q-my-xs">{{$t('listing.location')}}</h6>
          <p class="q-my-xs text-grey-6 q-my-sm q-mb-md">{{$t('listing.location.description')}}</p>
          <google-autocomplete :className="'input'" :place="listingInfo.location.fullAddress" :placeholder="$t('type.here.to.search')" v-model="listingInfo.location.fullAddress" @place-changed="onPlaceChanged" class="col-12 input"></google-autocomplete>
          <p class="q-my-lg"></p>
          <!-- <div class="text-middle-line">
            <span class="lowercase text-label">{{ $t('or') }} {{$t('enter your address')}}</span>
          </div> -->
          <q-separator></q-separator>
          <p class="q-my-lg"></p>
          <div>
            <q-input dense borderless :label="$t('apt.suite.etc')" v-model="listingInfo.location.name" class="input q-my-md"></q-input>
            <q-input dense borderless :label="$t('street')" v-model="listingInfo.location.street" class="input q-my-md"></q-input>
            <q-input dense borderless :label="$t('city')" v-model="listingInfo.location.city" class="input q-my-md"></q-input>
            <q-input dense borderless :label="$t('state')" v-model="listingInfo.location.state" class="input q-my-md"></q-input>
            <q-input dense borderless :label="$t('postal.code')" v-model="listingInfo.location.postcode" class="input q-my-md"></q-input>
            <q-input
              dense
              borderless
              :label="$t('Country')"
              v-model="listingInfo.location.country"
              class="input q-my-md"
              readonly
            ></q-input>
            <br><br>

            <!-- <p class="input q-pa-md text-grey-7" v-if="listingInfo.location.fullAddress">
              <span v-if="listingInfo.location.name">{{listingInfo.location.name}}<br/></span>
              <span v-if="listingInfo.location.street">{{listingInfo.location.street}},<br/></span>
              <span v-if="listingInfo.location.city">{{listingInfo.location.postcode}} {{listingInfo.location.city}},<br/></span>
              <span v-if="listingInfo.location.state">{{listingInfo.location.state}},<br/></span>
              <span v-if="listingInfo.location.country">{{listingInfo.location.country}}</span>
            </p> -->
          </div>
        </div>

        <!-- Pin Location In Map -->
        <div v-else-if="count === 4" class="q-mx-sm">
          <h6 class="q-mb-sm q-mt-none">{{$t('confirm.listing.location')}}</h6>
          <div style="height: 100%;">
            <q-icon name="fas fa-map-marker-alt" color="negative" size="40px" style="z-index: 5000;position: absolute; top: 40%;left: 45%;"></q-icon>
            <div ref="map" style="width: 100%;height: 600px;" class="map-style"></div>
          </div>
        </div>

        <!-- Upload Photos of you and your pets -->
        <div v-else-if="count === 5" class="q-mx-sm">
          <photo-gallery :media="listingInfo.serviceImage"
          @on-image-upload="onImageUploaded"
          :showDeleteOption="showDeleteOption"
          @on-remove-image="removeImageUploaded"></photo-gallery>
          <p class="text-center q-mt-lg text-grey-6">
            <!-- Text for Pet Walking, Taxi -->
            <span v-if="[16, 22].indexOf(serviceId) > -1">{{$t('listing.upload.service.photos')}}</span>

            <!-- Text For Pet Photography and grooming -->
            <span v-else-if="[19, 30].indexOf(serviceId) > -1">{{$t('listing.upload.porfolio.photos')}}</span>

            <!-- Others -->
            <span v-else>{{$t('upload.few.lovely.pet.photos')}}</span>
            <q-icon name="fas fa-heart" color="primary" class="q-ml-xs" style="opacity: 0.6;"></q-icon>
          </p>
        </div>

        <!-- Upload Photos of your house-->
        <div v-else-if="count === 6" class="q-mx-sm">
          <photo-gallery :media="morePhotos"
          @on-image-upload="onMoreImageUploaded"
          :showDeleteOption="showDeleteOption"
          @on-remove-image="removeMoreImageUploaded"></photo-gallery>
          <p class="text-center q-mt-lg text-grey-6">
            <span>{{$t('uploaded.lovely.photos.of.location')}}</span>
            <q-icon name="fas fa-home" color="primary" class="q-ml-xs" style="opacity: 0.6;"></q-icon>
          </p>
        </div>

        <!-- What's Next -->
        <div v-else-if="(count > 6) && (count < 10)">
          <whats-next></whats-next>
        </div>

        <!-- Get Recommendations -->
        <div v-else-if="count === 10" class="q-mx-sm">
          <div>
            <h6 class="q-my-none q-mb-sm">{{ $t('pet.owners.rely.on.recommendation') }}</h6>
            <p class="font-normal text-grey-8">{{$t('references.job.cv')}}</p>
            <br/>
            <p class="q-my-none q-mb-sm">{{ $t('share.fowlling.recommendation') }}</p>
            <div class="text-center q-pa-sm" style="border: solid 1px lightgrey;">
              {{`${share_url}`}}
            </div>

            <div class="q-mt-md font-normal">
              <a class="anchor-link" style="text-decoration:none;" @click="onFBShare">
                {{$t('share.on.facebook')}}
              </a>
              <br/>
              <a class="anchor-link" style="text-decoration:none;" :href="`mailto:?subject=${$t('help.backer.get.started', {backerName: $store.getters['user/getUserName']})}%0A%0A${share_url}`">
                {{$t('share.on.email')}}
              </a>
              <br/>
              <a class="anchor-link" style="text-decoration:none;" @click="onWebShare">
                {{$t('share.on.others')}}
              </a>
            </div>

            <div class="text-center q-mt-lg">
              <q-btn color="primary" :label="$t('share.now')" class="full-width q-px-xl q-mt-lg font-normal" style="border-radius: 25px;" @click="onFBShare"></q-btn>
              <q-btn color="primary" :label="$t('done')" flat class="full-width q-px-xl q-mt-lg" @click="onDone"></q-btn>
            </div>
          </div>
        </div>

        <!-- Verified Identity -->
        <dialog-verifyid ref="id-verify" :trigger="identityModal" @on-close="onCloseIdentityModal" @on-id-submit="onIdSubmit" :showLoading="showLoading"></dialog-verifyid>

        <!-- Verified Selfie -->
        <dialog-selfie :trigger="selfieModal" @on-close="onCloseSelfieModal" @on-selfie-submit="onSelfieSubmit" :showLoading="showLoading"></dialog-selfie>

        <!-- Share Dialog -->
        <q-dialog v-model="sharingDialog" auto-close  position="bottom" class="moreOptions" transition-show="slide-up" transition-hide="slide-down">
          <dialog-share @on-shared="onShared" :detail="$t('help.backer.get.started', {backerName: $store.getters['user/getUserName']})" :shareLink="`${share_url}`"></dialog-share>
        </q-dialog>

        <!-- Error Dialog -->
        <dialog-error :trigger="errorModal" :message="errorMessage" @on-close="closeErrorModal"></dialog-error>

        <!-- Dynamic Prompt Dialog -->
        <dialog-prompt :trigger="promptModal" :message="promptMessage" :okButtonLabel="promptOkLabel" :cancelButtonLabel="promptCancelLabel" :persistent="promptPersistent" @on-ok="onPromptOk" @on-cancel="onPromptCancel" @on-close="triggerPromptDialog"></dialog-prompt>

        <!-- Add Service Rate Dialog -->
        <dialog-addservicerates :trigger="addServiceRateModal"
        :id="serviceRateInfo.id"
        :quoteDescription="serviceRateInfo.description"
        :defaultUnit="serviceRateInfo.unit"
        :defaultPrice="serviceRateInfo.pricing"
        :type="serviceType"
        @on-close="triggerAddServiceRateModal" @on-save="onSaveRates"></dialog-addservicerates>

        <!-- bottom button -->
        <div class="text-center q-mt-xl" v-if="$q.platform.is.desktop">
          <div v-if="count !== 10">
            <q-btn color="primary" outline label="Back" @click="back" class="q-px-md q-mx-sm" v-if="count > 0"></q-btn>
            <q-btn color="primary" label="Next" @click="proceed" class="q-px-xl "></q-btn>
          </div>
        </div>
        <!-- bottom next button -->
        <div class="text-center fixed-bottom" style="z-index: 2000;" v-else>
          <div v-if="count !== 10" class="bg-primary q-pb-md" @click="proceed">
            <q-btn color="white" :loading="showLoading" :ripple="false" flat :label="$t('button.next')" size="lg" class="q-px-xl q-mt-sm text-white bg-primary"></q-btn>
          </div>
        </div>
      </div>
    </q-page>
</template>
<script>
import services from 'assets/services.json'
import listingForm from 'assets/form-listing-v5.json'
import languages from 'assets/languages.json'
import countries from 'assets/countries.json'
import 'assets/fb-sdk.js'

export default {
  components: {
    'google-autocomplete': () => import('components/ComponentGmapAutocomplete.vue'),
    'dialog-addservicerates': () => import('components/CreateListing/DialogAddServiceRate.vue'),
    'photo-gallery': () => import('components/CreateListing/PhotoGallery.vue'),
    'dialog-error': () => import('components/Dialog400Error.vue'),
    'dialog-verifyid': () => import('components/IdentityVerification/DialogID.vue'),
    'dialog-selfie': () => import('components/IdentityVerification/DialogSelfie.vue'),
    'dialog-share': () => import('components/DialogShare.vue'),
    'whats-next': () => import('components/CreateListing/WhatsNext.vue'),
    'dialog-prompt': () => import('components/DialogPrompt.vue')
  },
  data () {
    return {
      questionLists: [],
      morePhotos: [],
      serviceId: null,
      serviceType: null,
      count: 0,
      listingInfo: {
        name: null,
        location: {
          building: '',
          city: '',
          country: '',
          countryId: '',
          fullAddress: '',
          language: '',
          latitude: '',
          longitude: '',
          name: '',
          postcode: '',
          state: '',
          status: 1,
          street: '',
          street_number: ''
        },
        serviceRates: [],
        serviceImage: []
      },
      serviceRateInfo: {
        id: null,
        description: null,
        unit: null,
        pricing: null
      },
      addServiceRateModal: false,
      listingPrice: null,
      listingNameError: null,
      showError: false,
      onEdit: false,
      gMap: null,
      showDeleteOption: false,
      errorModal: false,
      errorMessage: '',
      identityModal: false,
      showLoading: false,
      selfieModal: false,
      sharingDialog: false,
      share_url: '',
      submittedInfo: null,
      promptModal: false,
      promptMessage: '',
      promptOkLabel: null,
      promptCancelLabel: null,
      promptPersistent: true,
      locationResponse: []
    }
  },
  created () {
    this.onListingLoad()
    this.$emit('current-count', this.count)
  },
  mounted () {
    history.pushState(null, null, location.href)

    // detect browser back button
    window.addEventListener('popstate', this.backButtonDetected, false)
  },
  beforeDestroy () {
    this.$emit('current-count', 0)
    window.removeEventListener('popstate', this.backButtonDetected)
  },
  methods: {
    onDone () {
      try {
        history.pushState('ThankYou', 'ThankYou', this.$router.resolve({ name: 'ThankYou' }))
        this.$router.push({name: 'Listing', params: {listingId: this.submittedInfo.id}, query: {id: this.submittedInfo.userInfo.id}})
      } catch (err) {
        console.error(err)
        this.$router.replace({name: 'MobileDashboard'})
      }
    },
    triggerPromptDialog (status, message = null, okLabel = null, cancelLabel = null, persistent = null) {
      if (message) {
        this.promptMessage = message
      }

      if (okLabel) {
        this.promptOkLabel = okLabel
      }

      if (cancelLabel) {
        this.promptCancelLabel = cancelLabel
      }

      if (persistent) {
        this.promptPersistent = persistent
      }

      this.promptModal = status
    },
    onPromptOk () {
      this.triggerPromptDialog(false)
    },
    onPromptCancel () {
      history.pushState('ThankYou', 'ThankYou', this.$router.resolve({ name: 'ThankYou' }))
      if (this.$q.platform.is.mobile) {
        this.$router.replace({name: 'MobileDashboard'})
      } else {
        this.$router.replace({name: 'Profile'})
      }
    },
    backButtonDetected (event) {
      if (event.state) {
        history.pushState(null, null, location.href)
      }

      if (this.count === 0) {
        this.triggerPromptDialog(true, this.$t('lose.listings.data'), this.$t('continue.create.listings'), this.$t('proceed.with.exit'), true)
      } else if (this.count === 10) {
        // go to listing page TODO
        if (this.$q.platform.is.mobile) {
          this.$router.replace({name: 'MobileDashboard'})
        } else {
          this.$router.replace({name: 'Profile'})
        }
      } else {
        this.count -= 1
        this.$emit('current-count', this.count)

        // generate gmaps
        if (this.count === 4) {
          setTimeout(() => {
            this.loadMap()
          }, 100)
        }
      }
    },
    onShared () {
      this.$router.replace({name: 'Listing', params: {listingId: this.submittedInfo.id}, query: {id: this.$store.getters['user/getUserUuidState'], url: this.submittedInfo.shortUrl}})
    },
    onFBShare () {
      if (this.$q.platform.is.cordova) {
        window.facebookConnectPlugin.showDialog({
          method: 'share',
          href: `${this.share_url}`,
          caption: this.detail ? this.detail : '',
          description: this.detail ? this.detail : '',
          hashtag: '#PetBacker'
        }, (response) => {
          this.$router.replace({name: 'Listing', params: {listingId: this.submittedInfo.id}, query: {id: this.$store.getters['user/getUserUuidState'], url: this.submittedInfo.shortUrl}})
        }, (error) => {
          console.error(error)
        })
      } else {
        window.FB.ui({
          method: 'share',
          href: `${this.share_url}`,
          quote: this.$t('help.backer.get.started', {backerName: this.$store.getters['user/getUserName']}),
          hashtag: '#PetBacker'
        }, function (response) {})
      }
    },
    onWebShare () {
      if (navigator.share) {
        navigator.share({
          title: this.$t('share.get.started'),
          text: this.$t('help.backer.get.started', {backerName: this.$store.getters['user/getUserName']}),
          url: `${this.share_url}`
        }).then(() => this.onShared()).catch((error) => console.log('Error sharing', error))
      }
    },
    onSelfieSubmit (info) {
      let form = {
        'accountInfo': {
          'documentType': 7,
          'fileName': info.fileName
        }
      }

      this.submitVerification(form)
    },
    onIdSubmit (info) {
      let form = {
        'accountInfo': {
          'documentType': 1,
          'fileName': info.fileName,
          'IDBackFileName': info.IDBackFileName,
          'fullName': info.fullName,
          'icNumber': info.icNumber,
          'dob': info.dob
        }
      }

      this.submitVerification(form)
    },
    submitVerification (info) {
      this.showLoading = true
      this.$axios.put(`account/${this.$store.getters['user/getUserUuidState']}/verifydocument`, info, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
      }).catch(error => {
        console.error(error)

        if (error.response && error.response.data.message) {
          this.$q.notify({
            message: error.response.data.message
          })
        }
      }).finally(_ => {
        this.showLoading = false
        this.onCloseIdentityModal(false)
        this.$refs['id-verify'].resetCount()
        this.onCloseSelfieModal(false)
        this.proceed()
      })
    },
    onCloseSelfieModal (value) {
      this.selfieModal = value
    },
    onCloseIdentityModal (value) {
      this.identityModal = value
    },
    closeErrorModal (value) {
      this.errorModal = value
    },
    // to activate editing
    onEditImages (status) {
      console.log(status)
      this.showDeleteOption = status
    },
    onEditMoreImages (status) {
      console.log(status)
      this.showDeleteOption = status
    },
    // for uploading image
    onImageUploaded (imageInfo) {
      this.listingInfo.serviceImage.push(imageInfo)
    },
    onMoreImageUploaded (imageInfo) {
      this.morePhotos.push(imageInfo)
    },
    // for removing images
    removeImageUploaded (index) {
      this.listingInfo.serviceImage.splice(index, 1)
    },
    removeMoreImageUploaded (index) {
      this.morePhotos.splice(index, 1)
    },
    // to combine service and house images
    combineImage (index) {
      for (index = 0; index < this.morePhotos.length; index++) {
        this.listingInfo.serviceImage.push(this.morePhotos[index])
      }
      if (this.listingInfo.serviceImage.length > 4) {
        console.log('Total images: ', this.listingInfo.serviceImage.length)
      }
    },
    // to update service rates pricing/description
    editServiceRates (rateInfo, index) {
      this.serviceRateInfo.id = index
      this.serviceRateInfo.description = rateInfo.ratesDescription
      this.serviceRateInfo.unit = rateInfo.ratesUnit
      this.serviceRateInfo.pricing = parseInt(rateInfo.ratesAmount)
      this.triggerAddServiceRateModal(true)
    },
    // to put service rate cards into edit mode (delete)
    onEditRates (status) {
      if (this.listingInfo.serviceRates.length > 0) {
        this.onEdit = status
      }
    },
    async loadMap () {
      try {
        /* global google */
        this.gMap = new google.maps.Map(this.$refs['map'], {
          center: {lat: parseFloat(this.listingInfo.location.latitude), lng: parseFloat(this.listingInfo.location.longitude)},
          zoom: 17,
          disableDefaultUI: true,
          draggable: true
        })
      } catch (error) {
        console.error(error)
      }
    },
    onPlaceChanged (place) {
      let addressComponents = place.address_components
      console.log('Adress componennts', place.address_components)
      if (typeof addressComponents !== 'object' || !addressComponents.length) {
        throw new Error('Address Component is not complete with data ' + JSON.stringify(place))
      }

      this.listingInfo.location = {
        city: '',
        state: '',
        country: '',
        countryId: null,
        postcode: '',
        street: '',
        street_number: '',
        name: '',
        building: '',
        latitude: '',
        longitude: '',
        fullAddress: '',
        language: null
      }

      // split out address info
      for (var i = 0; i < addressComponents.length; i++) {
        var placeInfo = addressComponents[i]

        if (placeInfo.types[0] === 'locality') {
          this.listingInfo.location.city = placeInfo.long_name
        }
        if (placeInfo.types[0] === 'postal_town') {
          this.listingInfo.location.city = placeInfo.long_name
        }
        if (placeInfo.types[0] === 'country') {
          this.listingInfo.location.country = placeInfo.long_name
        }
        // State Checks based on conditions
        if (placeInfo.types[0] === 'administrative_area_level_1') {
          // Set state as administrative_area_level_1
          this.listingInfo.location.state = placeInfo.long_name
        } else if (placeInfo.types[0] === 'administrative_area_level_2') {
          // Check if administrative_area_level_1 is not available
          if (!this.listingInfo.location.state) {
            // Set state as administrative_area_level_2
            this.listingInfo.location.state = placeInfo.long_name
          } else if (placeInfo.long_name !== this.listingInfo.location.state) {
            // Check if administrative_area_level_1 and administrative_area_level_2 are different
            // Set state as administrative_area_level_2
            this.listingInfo.location.state = placeInfo.long_name
          }
        } else if (placeInfo.types[0] === 'locality') {
          // Check if administrative_area_level_1 and locality are the same
          if (placeInfo.long_name !== this.listingInfo.location.state) {
            // Set state as locality
            this.listingInfo.location.state = placeInfo.long_name
          }
        } else if (placeInfo.types[0] === 'natural_feature') {
          // Check if administrative_area_level_1, administrative_area_level_2, and locality are not available
          if (!this.listingInfo.location.state) {
            // Set state as natural_feature
            this.listingInfo.location.state = placeInfo.long_name
          }
        }

        // If neither administrative_area_level_1, administrative_area_level_2, nor locality is available,
        // and there is no natural_feature, set locality as state
        /* if (!this.listingInfo.location.state && !placeInfo.types.includes('administrative_area_level_1') && !placeInfo.types.includes('administrative_area_level_2')) {
          this.listingInfo.location.state = addressComponents.find(x => x.types[0] === 'locality').long_name
        } */

        // Special case for the United Kingdom
        if (placeInfo.short_name.toLowerCase().includes('gb') || placeInfo.long_name.toLowerCase().includes('united kingdom')) {
          // Check if administrative_area_level_2 is available
          const admin2Search = addressComponents.find(x => x.types[0] === 'administrative_area_level_2' && x.types[1] === 'political')
          if (admin2Search) {
            // Set state as administrative_area_level_2
            this.listingInfo.location.state = admin2Search.long_name
          } else {
            console.error('Error: Unable to find administrative_area_level_2 in the United Kingdom.')
          }
        }

        // Log final state
        console.log('Final state:', this.listingInfo.location.state)

        // Malaysia Specific code

        if (
          placeInfo.types.includes('administrative_area_level_1') &&
          placeInfo.types.includes('country') &&
          placeInfo.short_name.toLowerCase() === 'my' // Check for Malaysia country code
        ) {
          // Set the state in your listingInfo object
          this.listingInfo.state = placeInfo.long_name
        }

        if (placeInfo.types[0] === 'country') {
          this.listingInfo.location.country = placeInfo.long_name

          // Get country id
          this.listingInfo.location.countryId = parseInt(this.$_.findWhere(countries, {'countryName': placeInfo.short_name}).id)

          // update user mobile country id
          this.$store.commit('user/updateUserMobileCountryIdState', this.listingInfo.location.countryId)
        }

        if (placeInfo.types[0] === 'postal_code' || placeInfo.types[0] === 'postal_code_prefix') {
          this.listingInfo.location.postcode = placeInfo.long_name
        }

        if (placeInfo.types[0] === 'route' || placeInfo.types[0] === 'street_address') {
          this.listingInfo.location.street = placeInfo.long_name
        }

        if (placeInfo.types[0] === 'street_number') {
          this.listingInfo.location.street_number = placeInfo.long_name
        }

        if (placeInfo.types[0] === 'neighborhood' || placeInfo.types.indexOf('sublocality') > -1) {
          this.listingInfo.location.name = placeInfo.long_name
        }

        if (placeInfo.types[0] === 'premise') {
          this.listingInfo.location.building = placeInfo.long_name
        }
        if (placeInfo.short_name.toLowerCase().includes('my') || placeInfo.long_name.toLowerCase().includes('malaysia')) {
          if (placeInfo.types[0] === 'administrative_area_level_1') {
            this.listingInfo.location.state = placeInfo.long_name
          }
        }

        if (
          placeInfo.short_name.toLowerCase().includes('my') || // Malaysia country code
          placeInfo.long_name.toLowerCase().includes('malaysia')
        ) {
          // Logic for Malaysia
          const stateSearch = (addressComponents.find(x => x.types[0] === 'administrative_area_level_1' && x.types[1] === 'political') || {}).long_name || null
          if (stateSearch !== null) {
            this.listingInfo.location.state = stateSearch
          }
        }

        if (placeInfo.short_name.toLowerCase().includes('sg') || placeInfo.long_name.toLowerCase().includes('Singapore')) {
          const citySearch = (addressComponents.find(x => x.types[0] === 'neighborhood' && x.types[1] === 'political') || {}).long_name || null
          console.log(citySearch)
          if (citySearch !== null) {
            this.listingInfo.location.city = citySearch
          } else if (citySearch === null) {
            const localitySearch = this.listingInfo.location.city = addressComponents.find(x => x.types[0] === 'locality' && x.types[1] === 'political').long_name
            const countrySearch = addressComponents.find(x => x.types[0] === 'country' && placeInfo.types[1] === 'political').long_name

            if (localitySearch !== null) {
              console.log('hi')
              this.listingInfo.location.city = localitySearch
            } else if (countrySearch) {
              this.listingInfo.location.city = countrySearch
            }
          }
          this.listingInfo.location.name = addressComponents.find(x => x.types[0] === 'street_number') ? addressComponents.find(x => x.types[0] === 'street_number').long_name : null
          this.listingInfo.location.state = addressComponents.find(x => x.types[0] === 'country' && placeInfo.types[1] === 'political').long_name
        }
        console.log(placeInfo)
      }

      this.listingInfo.location.latitude = place.geometry.location.lat().toString()
      this.listingInfo.location.longitude = place.geometry.location.lng().toString()
      this.listingInfo.location.fullAddress = place.formatted_address
      this.listingInfo.location.language = this.$_.findWhere(languages, {'value': this.$store.getters['user/getCurrentLanguage']}).id

      this.locationResponse = place
    },
    onDelete (index) {
      this.listingInfo.serviceRates.splice(index, 1)

      if (this.listingInfo.serviceRates.length === 0) {
        this.$emit('update-edit-button-status', false)
        this.$emit('show-edit-button', false)
      }
    },
    onSaveRates (form) {
      if (form.id !== null) {
        this.listingInfo.serviceRates[form.id] = form
      } else {
        this.listingInfo.serviceRates.push(form)
      }

      if (this.listingInfo.serviceRates.length > 0) {
        this.$emit('show-edit-button', true)
      }
    },
    triggerAddServiceRateModal (value) {
      if (!value) {
        this.serviceRateInfo.id = null
        this.serviceRateInfo.description = null
        this.serviceRateInfo.pricing = null
      }
      this.addServiceRateModal = value
      this.$emit('update-edit-button-status', false)
    },
    proceed () {
      this.showError = false
      if (this.count === 0 && (this.listingInfo.name === null || this.listingInfo.name === '' || this.listingInfo.name === ' ')) {
        this.listingNameError = true
        return
      }

      if (this.count === 1 && this.checkValid()) {
        this.showError = true
        this.errorModal = true
        this.errorMessage = this.$t('requests.petboarding.error.fill.correct.information')
        return
      }

      if (this.count === 2 && this.listingInfo.serviceRates.length === 0) {
        this.errorModal = true
        this.errorMessage = this.$t('please.add.rate.before.proceeding')
        return
      }

      if (this.count === 3 && this.listingInfo.location.latitude === '') {
        this.errorModal = true
        this.errorMessage = this.$t('please.provide.location.service')
        return
      } else if (this.count === 3) {
        // reconstruct full address
        let fullAddress = ''

        // update full address (incase user update after searching)
        if (this.listingInfo.location.name) {
          fullAddress += `${this.listingInfo.location.name} `
        }

        if (this.listingInfo.location.street) {
          fullAddress += `${this.listingInfo.location.street}`
        }

        if (this.listingInfo.location.postcode && this.listingInfo.location.city) {
          fullAddress += `, ${this.listingInfo.location.postcode} ${this.listingInfo.location.city}`
        } else if (this.listingInfo.location.city) {
          fullAddress += `, ${this.listingInfo.location.city}`
        }

        if (this.listingInfo.location.state) {
          fullAddress += `, ${this.listingInfo.location.state}`
        }

        // update full address if is valid
        if (fullAddress.split(' ').join('').length > 2) {
          this.listingInfo.location.fullAddress = fullAddress
        } else {
          this.errorModal = true
          this.errorMessage = this.$t('please.provide.location.service')
          return
        }
      }

      // get latest center pin
      if (this.count === 4) {
        this.listingInfo.location.latitude = this.gMap.getCenter().lat().toString()
        this.listingInfo.location.longitude = this.gMap.getCenter().lng().toString()
      }

      // ensure user upload at least 3 photos
      if (this.count === 5 && this.listingInfo.serviceImage.length < 3) {
        this.errorModal = true
        this.errorMessage = this.$t('upload.3.photos.to.proceed')
        return
      } else {
        this.showDeleteOption = false
      }

      // ensure user upload at least 3 photos (compound/house)
      // services exempted from this are:
      // sitting, walking, grooming, taxi
      if (this.count === 6 && this.morePhotos < 3 && [13, 16, 22, 19].indexOf(this.serviceId) < 0) {
        this.errorModal = true
        this.errorMessage = this.$t('upload.one.photo.to.proceed')
        return
      }

      // submit listingInfo
      if (this.count === 6) {
        this.combineImage()
        this.submitListing()
        return
      }

      window.scroll(0, 0)
      this.count += 1
      this.$emit('current-count', this.count)

      // pop up add service rate modal
      if (this.count === 2 && this.listingInfo.serviceRates.length === 0) {
        this.triggerAddServiceRateModal(true)
      }

      // generate gmaps
      if (this.count === 4) {
        setTimeout(() => {
          this.loadMap()
        }, 100)
      }

      // skip adding photos for compound/house (6)
      // services exempted from this are:
      // sitting, walking, grooming, taxi, photography
      if (this.count === 6 && [13, 16, 19, 22, 30].indexOf(this.serviceId) > -1) {
        this.count += 1
        this.submitListing()
      }

      if (this.count === 8 && this.$store.getters['user/getIdVerified'] === 0) {
        this.identityModal = true
      } else if (this.count === 8) {
        this.count += 2
      }

      if (this.count === 9 && this.$store.getters['user/getIdVerified'] === 0) {
        this.selfieModal = true
      } else if (this.count === 9) {
        this.count += 1
      }
    },
    back () {
      window.scroll(0, 0)
      this.count -= 1
      this.$emit('current-count', this.count)

      // generate gmaps
      if (this.count === 4) {
        setTimeout(() => {
          this.loadMap()
        }, 100)
      }
    },
    checkValid () {
      for (let i in this.questionLists) {
        if ((i % 2 !== 0) && this.questionLists[i].required === '1' && !this.questionLists[i].reply) {
          return true
        }
      }
      return false
    },
    submitListing () {
      this.showLoading = true

      let form = {
        'serviceInfo': {
          'ratesInfo': this.listingInfo.serviceRates,
          'serviceImage': this.getImageName(this.listingInfo.serviceImage),
          'serviceLocation': [this.listingInfo.location],
          'services': [this.serviceId],
          'status': 0,
          'userServiceDescription': null,
          'userServiceDescriptionJson': this.modelConversion(),
          'userServiceName': this.listingInfo.name,
          'language': this.listingInfo.location.language
        }
      }

      let resp = this.locationResponse
      console.log('check the JSON value of location', this.locationResponse)
      const originalFormat = {
        form,
        resp2: {
          resp
        }
      }

      const combinedResp = {
        serviceInfo: originalFormat.form.serviceInfo,
        locationJson: originalFormat.resp2
      }
      const combinedRespString = JSON.stringify(combinedResp)

      this.$axios.post(`users/${this.$store.getters['user/getUserUuidState']}/services`, combinedRespString, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.share_url = response.data.serviceInfo.listingUrl
        this.submittedInfo = response.data.serviceInfo

        // for users who wants to answer jobs that dont have correct listing
        if (this.$route.query.jobId && (this.$store.getters['user/getIdVerified'] === 1)) {
          this.$router.replace({name: 'JobQuote', params: {taskId: this.$route.query.jobId}, query: {serviceId: this.$route.params.serviceId}})
          return
        }

        // skip id verification if submitted
        if (this.$store.getters['user/getIdVerified'] > 0) {
          if (![13, 16, 19, 22, 30].includes(this.serviceId)) {
            this.count += 3
          } else {
            this.count += 2
          }
          this.$emit('current-count', this.count)
        } else {
          if (![13, 16, 19, 22, 30].includes(this.serviceId)) {
            this.count += 1
          }
          this.$emit('current-count', this.count)
        }
        window.scroll(0, 0)
      }).catch((error) => {
        console.error(error)
        if (error.response && error.response.data.message) {
          this.$q.notify({
            message: error.response.data.message,
            type: 'negative'
          })
        }
      }).finally(_ => {
        this.showLoading = false
      })
    },
    // Convert some input into values that will be accepted by the server
    modelConversion () {
      let questionLists = this.questionLists
      for (var index in questionLists) {
        if (questionLists.hasOwnProperty(index)) {
          // get value of checkbox array selection
          if (questionLists[index].type === 'checkBoxSelector') {
            let userSelection = []
            for (let i in questionLists[index].reply) {
              if (questionLists[index].reply[i].value) {
                userSelection.push(questionLists[index].reply[i].value)
              } else {
                userSelection.push(questionLists[index].reply[i])
              }
            }
            questionLists[index].reply = userSelection.join(', ')
          }

          // get radio button selection value
          if (questionLists[index].type === 'radioButtonSelector') {
            if (questionLists[index].reply && questionLists[index].reply.value) {
              questionLists[index].reply = questionLists[index].reply.value
            } else {
              questionLists[index].reply = questionLists[index].reply
            }
          }
        }
      }
      return JSON.stringify({'question': questionLists})
    },
    // Load the dynamic form based on questionnaire from the server
    onListingLoad () {
      let language = this.getLanguage()
      let serviceType = this.getServiceName()
      let fullServiceName = serviceType + '.' + language
      let response = listingForm[fullServiceName]
      this.serviceRateInfo.unit = `/${response.unitType}`

      // display service type on navbar (mobile view)
      this.$emit('service-name', response.serviceName)

      this.questionLists = JSON.parse(response.story.replace('\\', '')).question
    },
    getImageName (imageArray) {
      let temp = []
      for (let i in imageArray) {
        temp.push(imageArray[i].fileName)
      }

      return temp
    },
    getLanguage () {
      let ALLOWED_LANGUAGE = [
        'en',
        'zh_cn',
        'zh_tw',
        'ptpt',
        'dede',
        'sksk',
        'eses',
        'itit',
        'jajp',
        'cscz',
        'zh_hk',
        'frfr',
        'thth',
        'idid',
        'msmy',
        'elel',
        'vivi'
      ]

      try {
        let locale = this.$store.state.user.language
        if (ALLOWED_LANGUAGE.indexOf(locale) > -1) {
          return locale
        }
        return 'en'
      } catch (e) {
        return 'en'
      }
    },
    getServiceName () {
      for (let i = 0; i < services.length; i++) {
        if (parseInt(this.$route.params.serviceId) === services[i].id) {
          this.serviceType = this.$t(services[i].name)
          this.serviceId = services[i].id
          return services[i].name
        }
      }
      return null
    },
    questionToArray (arrayObject) {
      if (arrayObject.length === 0) {
        return
      }
      let arrayVal = null

      if (Array.isArray(arrayObject)) {
        arrayVal = arrayObject
      } else {
        // arrayVal = eval(arrayObject)
        let a = arrayObject
        a = a.replace('[\'', '')
        a = a.replace('\']', '')
        a = a.replace(/','/g, ',')
        arrayVal = a.split(',')
      }

      return arrayVal
    }
  }
}
</script>
<style lang="stylus">
.map-style {
  box-shadow: 1px 2px 5px lightgrey
  border-radius: 5px
}
</style>
