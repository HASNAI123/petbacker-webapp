<template>
    <q-dialog v-model="modal" @hide="closePopUp" :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
        <q-card>
          <!-- Header -->
          <q-toolbar style="border-bottom: solid 1px lightgrey;">
            <q-btn flat round dense icon="chevron_left" size="1.3em" @click="onBack"></q-btn>
            <q-toolbar-title @click="onBack">
              <h6 class="q-my-none service-coverage-title font-header-title">{{$t('service.coverage')}}</h6>
            </q-toolbar-title>
          </q-toolbar>

          <!-- Locations Selector -->
          <q-card-section v-if="count === 0">
            <div class="row">
              <service-location-card @location-selected="locationSelected" v-for="(location, index) in serviceInfo.serviceLocation" :key="index" :index="index" :locationInfo="location" class="col-12"></service-location-card>
            </div>
          </q-card-section>

          <!-- Pin Location-->
          <q-card-section v-else-if="count === 1">
            <h6 class="q-mb-sm q-mt-none">Which area does your listing cover?</h6>
            <google-autocomplete v-if="count === 1" :className="'input'" :place="locationInfo.fullAddress" v-model="locationInfo.fullAddress" @place-changed="onPlaceChanged" class="q-my-md"></google-autocomplete>
            <div style="height: 100%;">
              <q-icon name="fas fa-map-marker-alt" color="negative" size="40px" style="z-index: 5000;position: absolute; top: 45%;left: 45%;"></q-icon>
              <div ref="map" style="width: 100%;height: 600px;" class="map-style"></div>
            </div>
          </q-card-section>

          <!-- Confirm Listing Location-->
          <q-card-section v-else-if="count === 2">
            <div>
              <h6 class="q-my-sm">{{$t('confirm.listing.location')}}</h6>
              <p class="input q-pa-md">{{locationInfo.fullAddress}}</p>
              <br/>
              <q-input dense borderless :label="$t('apt.suite.etc')" v-model="locationInfo.name" class="input q-my-md"></q-input>
              <q-input dense borderless :label="$t('street')" v-model="locationInfo.street" class="input q-my-md"></q-input>
              <q-input dense borderless :label="$t('city')" v-model="locationInfo.city" class="input q-my-md"></q-input>
              <q-input dense borderless :label="$t('state')" v-model="locationInfo.state" class="input q-my-md"></q-input>
              <q-input dense borderless :label="$t('postal.code')" v-model="locationInfo.postcode" class="input q-my-md"></q-input>
              <q-input
  dense
  borderless
  :label="$t('Country')"
  v-model="locationInfo.country"
  class="input q-my-md"
  readonly
></q-input>
<br><br><br><br>
            </div>
          </q-card-section>

          <!-- Mobile Save Button -->
          <div class="fixed-bottom bg-primary" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" v-if="count > 0">
            <div class="q-pa-md q-pb-md" @click="proceed">
              <div class="text-white text-center cursor-pointer font-header-title">
                <p v-if="!loader" class="text-weight-bold font-title" style="margin-top: 5px;">{{count === 1 ? $t('button.next') : $t('button.save')}}</p>
                <span v-else>
                  <q-spinner size="3em"></q-spinner>
                </span>
              </div>
            </div>
          </div>
        </q-card>
    </q-dialog>
</template>
<script>
import countries from 'assets/countries.json'
import languages from 'assets/languages.json'
export default {
  components: {
    'google-autocomplete': () => import('components/ComponentGmapAutocomplete.vue'),
    'service-location-card': () => import('components/CreateListing/ServiceLocationCard.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    serviceInfo: {
      type: Object,
      required: true
    },
    loader: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modal: false,
      count: 0,
      listingInfoName: null,
      listingNameError: false,
      gMap: null,
      locationInfo: null,
      currentIndex: null,
      locationResponse: null
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)

      if (value) {
        this.listingInfoName = this.listingName
      } else {
        this.count = 0
      }
    }
  },
  beforeDestroy () {
    this.closePopUp()
  },
  methods: {
    onBack () {
      if (this.count === 0) {
        this.closePopUp()
      } else if (this.count === 2) {
        setTimeout(() => {
          this.loadMap(this.locationInfo.latitude, this.locationInfo.longitude)
        }, 100)
        this.count -= 1
      } else {
        this.count -= 1
      }
    },
    proceed () {
      if (this.count === 2) {
        this.onSave()
      } else {
        this.count += 1
      }
    },
    locationSelected (index) {
      this.currentIndex = index
      this.locationInfo = this.serviceInfo.serviceLocation[index]
      this.count++
      setTimeout(() => {
        this.loadMap(this.locationInfo.latitude, this.locationInfo.longitude)
      }, 100)
    },
    async loadMap (latitude, longitude) {
      try {
        /* global google */
        this.gMap = new google.maps.Map(this.$refs['map'], {
          center: {lat: parseFloat(latitude), lng: parseFloat(longitude)},
          zoom: 15,
          disableDefaultUI: true,
          draggable: true
        })
      } catch (error) {
        console.error(error)
      }
    },
    onPlaceChanged (place) {
      let addressComponents = place.address_components
      if (typeof addressComponents !== 'object' || !addressComponents.length) {
        throw new Error('Address Component is not complete with data ' + JSON.stringify(place))
      }

      // split out address info
      for (var i = 0; i < addressComponents.length; i++) {
        var placeInfo = addressComponents[i]

        if (placeInfo.types[0] === 'locality') {
          this.locationInfo.city = placeInfo.long_name
        }
        if (placeInfo.types[0] === 'postal_town') {
          this.locationInfo.city = placeInfo.long_name
        }
        if (placeInfo.types[0] === 'country') {
          this.locationInfo.country = placeInfo.long_name
        }
        // State Checks based on conditions
        if (placeInfo.types[0] === 'administrative_area_level_1') {
          // Set state as administrative_area_level_1
          this.locationInfo.state = placeInfo.long_name
        } else if (placeInfo.types[0] === 'administrative_area_level_2') {
          // Check if administrative_area_level_1 is not available
          if (!this.locationInfo.state) {
            // Set state as administrative_area_level_2
            this.locationInfo.state = placeInfo.long_name
          } else if (placeInfo.long_name !== this.locationInfo.state) {
            // Check if administrative_area_level_1 and administrative_area_level_2 are different
            // Set state as administrative_area_level_2
            this.locationInfo.state = placeInfo.long_name
          }
        } else if (placeInfo.types[0] === 'locality') {
          // Check if administrative_area_level_1 and locality are the same
          if (placeInfo.long_name !== this.locationInfo.state) {
            // Set state as locality
            this.locationInfo.state = placeInfo.long_name
          }
        } else if (placeInfo.types[0] === 'natural_feature') {
          // Check if administrative_area_level_1, administrative_area_level_2, and locality are not available
          if (!this.locationInfo.state) {
            // Set state as natural_feature
            this.locationInfo.state = placeInfo.long_name
          }
        }

        // If neither administrative_area_level_1, administrative_area_level_2, nor locality is available,
        // and there is no natural_feature, set locality as state
        /* if (!this.locationInfo.state && !placeInfo.types.includes('administrative_area_level_1') && !placeInfo.types.includes('administrative_area_level_2')) {
          this.locationInfo.state = addressComponents.find(x => x.types[0] === 'locality').long_name
        } */

        // Special case for the United Kingdom
        if (placeInfo.short_name.toLowerCase().includes('gb') || placeInfo.long_name.toLowerCase().includes('united kingdom')) {
          // Check if administrative_area_level_2 is available
          const admin2Search = addressComponents.find(x => x.types[0] === 'administrative_area_level_2' && x.types[1] === 'political')
          if (admin2Search) {
            // Set state as administrative_area_level_2
            this.locationInfo.state = admin2Search.long_name
          } else {
            console.error('Error: Unable to find administrative_area_level_2 in the United Kingdom.')
          }
        }

        // Log final state
        console.log('Final state:', this.locationInfo.state)

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
          this.locationInfo.country = placeInfo.long_name

          // Get country id
          this.locationInfo.countryId = parseInt(this.$_.findWhere(countries, {'countryName': placeInfo.short_name}).id)

          // update user mobile country id
          this.$store.commit('user/updateUserMobileCountryIdState', this.locationInfo.countryId)
        }

        if (placeInfo.types[0] === 'postal_code' || placeInfo.types[0] === 'postal_code_prefix') {
          this.locationInfo.postcode = placeInfo.long_name
        }

        if (placeInfo.types[0] === 'route' || placeInfo.types[0] === 'street_address') {
          this.locationInfo.street = placeInfo.long_name
        }

        if (placeInfo.types[0] === 'street_number') {
          this.locationInfo.street_number = placeInfo.long_name
        }

        if (placeInfo.types[0] === 'neighborhood' || placeInfo.types.indexOf('sublocality') > -1) {
          this.locationInfo.name = placeInfo.long_name
        }

        if (placeInfo.types[0] === 'premise') {
          this.locationInfo.building = placeInfo.long_name
        }
        if (placeInfo.short_name.toLowerCase().includes('my') || placeInfo.long_name.toLowerCase().includes('malaysia')) {
          if (placeInfo.types[0] === 'administrative_area_level_1') {
            this.locationInfo.state = placeInfo.long_name
          }
        }

        if (
          placeInfo.short_name.toLowerCase().includes('my') || // Malaysia country code
  placeInfo.long_name.toLowerCase().includes('malaysia')
        ) {
          // Logic for Malaysia
          const stateSearch = (addressComponents.find(x => x.types[0] === 'administrative_area_level_1' && x.types[1] === 'political') || {}).long_name || null
          if (stateSearch !== null) {
            this.locationInfo.state = stateSearch
          }
        }

        if (placeInfo.short_name.toLowerCase().includes('sg') || placeInfo.long_name.toLowerCase().includes('Singapore')) {
          const citySearch = (addressComponents.find(x => x.types[0] === 'neighborhood' && x.types[1] === 'political') || {}).long_name || null
          console.log(citySearch)
          if (citySearch !== null) {
            this.locationInfo.city = citySearch
          } else if (citySearch === null) {
            const localitySearch = this.locationInfo.city = addressComponents.find(x => x.types[0] === 'locality' && x.types[1] === 'political').long_name
            const countrySearch = addressComponents.find(x => x.types[0] === 'country' && placeInfo.types[1] === 'political').long_name

            if (localitySearch !== null) {
              console.log('hi')
              this.locationInfo.city = localitySearch
            } else if (countrySearch) {
              this.locationInfo.city = countrySearch
            }
          }
          this.locationInfo.name = addressComponents.find(x => x.types[0] === 'street_number') ? addressComponents.find(x => x.types[0] === 'street_number').long_name : null
          this.locationInfo.state = addressComponents.find(x => x.types[0] === 'country' && placeInfo.types[1] === 'political').long_name
        }
        console.log(placeInfo)
      }
      this.locationResponse = place
      console.log('Check the location reponse', place)
      this.locationInfo.latitude = place.geometry.location.lat().toString()
      this.locationInfo.longitude = place.geometry.location.lng().toString()
      this.locationInfo.fullAddress = place.formatted_address
      this.locationInfo.language = this.$_.findWhere(languages, {'value': this.$store.getters['user/getCurrentLanguage']}).id
      setTimeout(() => {
        this.loadMap(this.locationInfo.latitude, this.locationInfo.longitude)
      }, 100)
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    },
    onSave () {
      this.$emit('on-save', this.currentIndex, this.locationInfo, this.locationResponse)
    }
  }
}
</script>
<style lang="stylus">
.service-coverage-title
  margin-left: 22%
</style>
