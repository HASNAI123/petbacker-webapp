<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" :persistent="$q.platform.is.mobile" transition-show="slide-up" transition-hide="slide-down">
        <q-card>
            <q-toolbar style="z-index: 5000;" class="borderline">
                <q-btn flat dense v-close-popup icon="chevron_left" size="lg" class="q-pl-none"/>
                <q-toolbar-title v-close-popup >
                    <h6 class="q-my-none header-title">{{$t('explore.filters')}}</h6>
                </q-toolbar-title>
            </q-toolbar>

            <q-card-section class="justify-center">
              <!-- Search bar -->
              <div class="q-mt-sm">
                <!-- <q-input v-model="searchKeyword" borderless dense class="input" v-if="searchType === 'keyword'" :label="$t('enter.keywords.here')"></q-input> -->
                <googlemap-autocomplete :className="'input'" :place="searchKeyword" v-model="searchKeyword" @place-changed="onPlaceChanged($event)"></googlemap-autocomplete>
              </div>
              <!-- <q-btn-toggle
                v-model="searchType"
                class="q-my-md"
                style="border-radius: 10px;"
                spread
                no-caps
                toggle-color="primary"
                color="white"
                text-color="black"
                :options="[
                  {label: $t('filter.by.keyword'), value: 'keyword'},
                  {label: $t('filter.by.location'), value: 'location'}
                ]"
              ></q-btn-toggle> -->

              <div>
                <p class="q-mt-lg text-center text-grey">{{$t('select.service.type.or.search.all')}}</p>
              </div>

              <!-- Filters -->
              <div class="row">
                <q-btn :outline="filter !== 'services.petboarding.short'" @click="onChangeFilter('services.petboarding.short')" color="primary" style="border-radius: 11px;" :label="$t('services.petboarding.short')" class="q-ma-xs" :ripple="false"></q-btn>
                <q-btn :outline="filter !== 'services.pettraining.short'" @click="onChangeFilter('services.pettraining.short')" color="primary" style="border-radius: 11px;" :label="$t('services.pettraining.short')" class="q-ma-xs" :ripple="false"></q-btn>
                <q-btn :outline="filter !== 'services.petgrooming.short'" @click="onChangeFilter('services.petgrooming.short')" color="primary" style="border-radius: 11px;" :label="$t('services.petgrooming.short')" class="q-ma-xs" :ripple="false"></q-btn>
                <q-btn :outline="filter !== 'services.dogwalking.short'" @click="onChangeFilter('services.dogwalking.short')" color="primary" style="border-radius: 11px;" :label="$t('services.dogwalking.short')" class="q-ma-xs" :ripple="false"></q-btn>
                <q-btn :outline="filter !== 'services.pethousesitting.short'" @click="onChangeFilter('services.pethousesitting.short')" color="primary" style="border-radius: 11px;" :label="$t('services.pethousesitting.short')" class="q-ma-xs" :ripple="false"></q-btn>
                <q-btn :outline="filter !== 'services.petdaycare.short'" @click="onChangeFilter('services.petdaycare.short')" color="primary" style="border-radius: 11px;" :label="$t('services.petdaycare.short')" class="q-ma-xs" :ripple="false"></q-btn>
                <q-btn :outline="filter !== 'services.pettaxi.short'" @click="onChangeFilter('services.pettaxi.short')" color="primary" style="border-radius: 11px;" :label="$t('services.pettaxi.short')" class="q-ma-xs" :ripple="false"></q-btn>
              </div>
            </q-card-section>

            <!-- Bottom Button will appear on mobile screen -->
            <div class="justify-center fixed-bottom" style="border-top: 1px solid lightgrey;">
              <div class="q-pa-md q-pb-lg bg-white row">
                <q-btn class="col text-weight-bold q-mx-sm" style="border-radius: 6px;" :ripple="false" :label="$t('reset')" color="primary" outline @click="onReset"></q-btn>
                <q-btn class="col-8 text-weight-bold q-mx-xs" style="border-radius: 6px;" :ripple="false" :label="$t('apply')" color="primary" @click="onApply"></q-btn>
              </div>
            </div>
        </q-card>
    </q-dialog>
</template>
<script>
export default {
  components: {
    'googlemap-autocomplete': () => import('components/ComponentGmapAutocomplete.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      default: false,
      required: true
    },
    preFilled: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      modal: false,
      applyLoading: false,
      searchKeyword: null,
      searchLocation: null,
      filter: null,
      searchType: 'location'
    }
  },
  created () {
    if (this.preFilled) {
      this.searchType = this.preFilled.searchType || 'location'
      this.searchKeyword = this.preFilled.searchKeyword
      this.searchLocation = this.preFilled.searchLocation
      this.filter = this.preFilled.searchFilter
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)

      if (value && this.preFilled) {
        this.searchType = this.preFilled.searchType || 'location'
        this.searchKeyword = this.preFilled.searchKeyword
        if (this.searchType === 'location' && this.preFilled.searchLocation && this.preFilled.searchLocation.location) {
          this.searchKeyword = this.preFilled.searchLocation.location.fullAddress
        }
        this.searchLocation = this.preFilled.searchLocation
        this.filter = this.preFilled.searchFilter
      }
    },
    preFilled (value) {
      this.searchType = value.searchType
      this.searchKeyword = value.searchKeyword
      if (this.searchType === 'location' && value.searchLocation && value.searchLocation.location) {
        this.searchKeyword = value.searchLocation.location.fullAddress
      }
      this.searchLocation = value.searchLocation
      this.filter = value.searchFilter
    }
  },
  methods: {
    onReset () {
      this.searchKeyword = null
      this.filter = null
      this.searchLocation = null
    },
    onClose () {
      this.$emit('on-close', false)
    },
    onPlaceChanged (place) {
      this.searchKeyword = place.formatted_address.toString()

      this.searchLocation = {
        location: {
          latitude: place.geometry.location.lat().toString(),
          longitude: place.geometry.location.lng().toString(),
          fullAddress: place.formatted_address.toString()
        }
      }
    },
    onChangeFilter (filterType) {
      if (this.filter === filterType) {
        this.filter = null
      } else {
        this.filter = filterType
      }
    },
    onApply () {
      let form = {
        searchType: this.searchType,
        searchKeyword: this.searchKeyword,
        searchLocation: this.searchLocation,
        searchFilter: this.filter
      }

      this.$emit('on-apply', form)
    }
  }
}
</script>
<style lang="stylus">
.uploaded-images
  object-fit: cover

.header-title
  margin-left: 12%
  font-size: 18px

@media screen and (min-width: 320px)
  .header-title
    margin-left: 16%

@media screen and (min-width: 350px)
  .header-title
    margin-left: 22%

@media screen and (min-width: 370px)
  .header-title
    margin-left: 33%

@media screen and (min-width: 400px)
  .header-title
    margin-left: 35%

@media screen and (min-width: 530px)
  .header-title
    margin-left: 17%
</style>
