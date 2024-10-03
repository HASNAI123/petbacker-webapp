<template>
  <q-page class="q-pt-xs q-pb-xl bg-white">
    <div :style="{'max-width': $q.platform.is.mobile ? '100%' : '1030px'}" class="margin-auto">
      <q-card class="q-ma-md q-pb-sm" v-if="categoryFilter" style="border-radius: 20px;">
        <q-card-section class="text-center q-pa-sm">
          <img src="statics/images/request_submitted_header.jpg" loading="lazy" decoding="async" width="100%" />
          <h6 class="q-mb-md q-mt-xs" style="font-size: 30px;">{{$t('broadcast.request')}}</h6>
          <p class="q-my-md">{{$t('broadcast.request.notify.description')}}</p>
          <q-btn :label="$t('broadcast.request')" color="primary" @click="checkService"></q-btn>
        </q-card-section>
      </q-card>

      <prompt-scroll-down v-if="nearbyInfo && categoryFilter && listingInfo.length > 0"></prompt-scroll-down>

      <div class="q-mx-md q-mt-lg q-mb-md"> <!-- v-if="nearbyInfo" removed -->
        <!--  <p class="q-my-none text-weight-light">{{computeCount(nearbyInfo.items._meta.totalCount)}}<span v-if="nearbyInfo.items._meta.totalCount > 10">+</span> backers</p>
            <h6 class="q-my-none q-mb-sm" v-if="listingInfo && listingInfo[0] && listingInfo[0].serviceLocation">{{$t('backers.nearby.filter.location', {serviceName: categoryFilter ? getServiceName(categoryFilter) : 'Backers', locationName: listingInfo[0].serviceLocation[0].city})}}</h6> -->
        <q-btn rounded outline color="grey-5" class="text-capitalize q-my-sm" @click="triggerSearchModal(true)"><span
            style="color: black;" class="text-weight-light">{{$t('explore.filters')}}</span></q-btn>
      </div>
      <!-- <div v-else class="q-mx-md q-mt-lg q-mb-md">
            <q-skeleton width="80px" height="10px" class="q-my-sm"></q-skeleton>
            <q-skeleton width="150px" height="20px" class="q-mt-sm q-mb-md"></q-skeleton>
            <q-skeleton width="70px" height="30px" class="q-mt-lg" type="QChip"></q-skeleton>
          </div> -->

      <q-infinite-scroll style="height: 200px;" :disabled="isLoading || endOfPage" ref="backers-nearby-infinite-scroll"
        @load="onLoad" class="row q-py-sm justify-center q-mx-md scroll-container" :offset="500">
        <div v-for="(listing, index) in listingInfo" :key="index"
          :class="listing.parentServiceName === '1' ? 'col-12' : (screenWidth < 700 ? 'col-6' : 'col-3')">

          <!-- Broadcast image -->
          <q-card class="broadcast-image margin-auto" style="max-height: 145px;margin-bottom: 10%;"
            @click="triggerServicesModal(true)" v-if="listing.parentServiceName === '1'" flat bordered>
            <q-img :src="listing.coverImage" :placeholder-src="listing.coverImage" basic style="height: 145px;"
              class="image-offset"></q-img>
          </q-card>

          <!-- Listing card -->
          <listing-card :listingInfo="listing" :index="index" :isFavorite="listing.isFavorite"
            class="backer-listing q-px-xs" @on-favorite="updateFavorite" @on-block-user="onBlockUser"
            v-else></listing-card>
        </div>
        <div v-if="listingInfo.length === 0 && endOfPage">
          <p style="width: 100%;">{{ $t('no.listings.available') }}</p>
        </div>
        <template v-slot:loading v-if="isLoading">
          <div style="height: 100px;">
            <listing-card v-for="index in 8" :key="index" :listingInfo="{}" :index="index" class="backer-listing col-6"
              @on-block-user="onBlockUser"></listing-card>
          </div>
        </template>
        <div v-if="searchLoader">
          <!-- <ComponentPreLoader></ComponentPreLoader> -->
          <q-spinner-dots size="50px" color="primary"></q-spinner-dots>
        </div>
      </q-infinite-scroll>

      <!-- Search Dialog -->
      <dialog-search :trigger="searchModal" :preFilled="searchForm" @on-close="triggerSearchModal"
        @on-apply="onApply"></dialog-search>

      <!-- More Services Dialog -->
      <dialog-services :trigger="servicesModal" @on-close="triggerServicesModal"></dialog-services>
    </div>
  </q-page>
</template>
<script>
import services from 'assets/services.json'
export default {
components: {
  'listing-card': () => import('components/Explore/listingCards.vue'),
  'dialog-search': () => import('components/Explore/DialogSearch.vue'),
  'dialog-services': () => import('components/DialogServices.vue'),
  'prompt-scroll-down': () => import('components/PromptScrollDown.vue')
},
data () {
  return {
    dataLoaded: true,
    listingInfo: [{}, {}, {}, {}, {}, {}, {}, {}],
    nearbyInfo: null,
    currentPage: 1,
    endOfPage: false,
    searchModal: false,
    categoryFilter: null,
    categoryService: null,
    locationSearchInfo: null,
    keywordSearchInfo: null,
    currentLocation: {
      latitude: this.$store.getters['user/getUserLatitude'] || this.$store.getters['geolocation/geopluginLatitude'],
      longitude: this.$store.getters['user/getUserLongitude'] || this.$store.getters['geolocation/geopluginLongitude']
    },
    searchLoader: false,
    searchForm: null,
    onSearch: false,
    servicesModal: false,
    screenWidth: screen.width,
    renewCache: false,
    isLoading: false
  }
},
created () {
  if (this.$route.query.category_id) {
    let serviceInfo = this.$_.findWhere(services, {'id': parseInt(this.$route.query.category_id)})
    this.categoryFilter = serviceInfo.parentId
    this.categoryService = serviceInfo.shortName
  } else if (parseInt(this.$route.query.cached) === 1) {
    this.listingInfo = this.$store.getters['cached/getBackersNearbyCached']
  }

  if (this.categoryFilter !== null && this.$store.getters['search/getExploreSearchCachedId'] !== null) {
    console.log('[Backers Nearby]: get cache by id')
    // get cache by id
    this.$store.dispatch('search/getExploreSearchById', this.$store.getters['search/getExploreSearchCachedId']).then((data) => {
      this.nearbyInfo = {
        'items': {
          '_meta': {
            'totalCount': data.total_count
          }
        }
      }

      // check if is the first load
      if (this.listingInfo[0] && this.listingInfo[0].id === undefined) {
        this.listingInfo = []
      }
      this.listingInfo = this.listingInfo.concat(JSON.parse(data.content))

      this.searchForm = {
        searchType: data.search_type === 'null' ? null : data.search_type,
        searchKeyword: data.search_keyword === 'null' ? null : data.search_keyword,
        searchLocation: {
          location: {
            latitude: data.latitude === 'null' ? null : data.latitude,
            longitude: data.longitude === 'null' ? null : data.longitude,
            fullAddress: data.full_address === 'null' ? null : data.full_address
          }
        },
        searchFilter: data.search_filter === 'null' ? null : data.search_filter
      }

      // prefilled search bar
    }).catch((error) => {
      console.error(error)
    })
  } else {
    this.getBackersNearby()
  }
},
beforeDestroy () {
  this.$emit('search-info', null)
},
methods: {
  checkService () {
    if (this.$route.query.category_id) {
      this.$router.push(this.$_.findWhere(services, {'id': parseInt(this.$route.query.category_id)}).link)
    } else {
      this.triggerServicesModal(true)
    }
  },
  triggerServicesModal (status) {
    this.servicesModal = status
  },
  computeCount (count) {
    let floorValue = Math.floor(count)

    if ((floorValue / 10000) > 0.9999) {
      return (Math.floor(count / 10000) * 10000)
    } else if ((floorValue / 1000) > 0.9999) {
      return (Math.floor(count / 1000) * 1000)
    } else if ((floorValue / 100) > 0.9999) {
      return (Math.floor(count / 100) * 100)
    } else if ((floorValue / 10) > 0.9999) {
      return (Math.floor(count / 10) * 10)
    }

    return count
  },
  updateFavorite (status, index) {
    this.listingInfo[index].isFavorite = status
  },
  // onLoad (index, done) {
  //   this.searchLoader = true
  //   // this.dataLoaded = false
  //   if (this.endOfPage || this.onSearch) {
  //     done()
  //     return
  //   }
  //   this.currentPage += 1
  //   this.getBackersNearby(null, done)
  //   // this.dataLoaded = true
  // },

  onLoad (index, done) {
    this.searchLoader = true // Indicate that the search is in progress
    // this.dataLoaded = true

    // If it's the end of the page or currently on search, finish loading
    if (this.endOfPage || this.onSearch) {
      done()
      this.searchLoader = true // Reset search loader as loading is done

      return
    }

    this.currentPage += 1 // Increment the current page number

    // Fetch the backers nearby and ensure `done` is called afterwards
    this.getBackersNearby(null, () => {
      this.searchLoader = false // Reset search loader as loading is done
      this.dataLoaded = true
      done()
    })
  },

  triggerSearchModal (value) {
    this.searchModal = value
  },

  onApply (searchInfo) {
    this.$store.commit('search/updateExploreSearchCachedId', null)
    this.currentPage = 1
    this.searchModal = false
    this.endOfPage = false
    this.listingInfo = []
    this.searchLoader = true

    this.searchForm = searchInfo
    this.locationSearchInfo = null
    this.categoryFilter = null
    this.keywordSearchInfo = null
    this.nearbyInfo = null

    if (searchInfo.searchType === 'location') {
      this.locationSearchInfo = searchInfo.searchLocation
    } else if (searchInfo.searchType === 'keyword') {
      this.keywordSearchInfo = searchInfo.searchKeyword
    }

    if (searchInfo.searchFilter !== null) {
      let serviceInfo = this.$_.findWhere(services, {'shortName': searchInfo.searchFilter})
      this.categoryFilter = serviceInfo.parentId
      this.categoryService = serviceInfo.shortName
    } else {
      this.categoryFilter = null
      this.categoryService = null
    }

    this.$emit('search-info', this.locationSearchInfo || this.keywordSearchInfo)
    this.getBackersNearby(searchInfo.searchType)
    this.$refs['backers-nearby-infinite-scroll'].resume()
  },
  getBackersNearby (searchType = null, done) {
    this.onSearch = true
    // this.searchLoader = true

    if ((searchType !== null || this.categoryFilter !== null) && this.currentPage === 1) {
      console.log('[Backers Nearby]: search for valid cache')

      // check search type
      let searchTypeInfo = null
      if (searchType === 'keyword' && this.keywordSearchInfo !== null) {
        searchTypeInfo = 'keyword'
      } else if (searchType === 'location' && this.locationSearchInfo !== null) {
        searchTypeInfo = 'location'
      }

      this.searchForm = {
        searchType: searchTypeInfo,
        searchKeyword: this.keywordSearchInfo,
        searchLocation: {
          location: {
            latitude: this.locationSearchInfo ? this.locationSearchInfo.location.latitude : null,
            longitude: this.locationSearchInfo ? this.locationSearchInfo.location.longitude : null,
            fullAddress: this.locationSearchInfo ? this.locationSearchInfo.location.fullAddress : null
          }
        },
        searchFilter: this.categoryService
      }

      // check if cache exist
      this.$store.dispatch('search/getExploreSearch', this.searchForm).then((data) => {
        if (data.length > 0) {
          this.nearbyInfo = {
            'items': {
              '_meta': {
                'totalCount': data[0].total_count
              }
            }
          }

          // check if is the first load
          if (this.listingInfo[0] && this.listingInfo[0].id === undefined) {
            this.searchLoader = true
            this.listingInfo = []
          }

          this.listingInfo = this.listingInfo.concat(JSON.parse(data[0].content))
          this.$store.commit('search/updateExploreSearchCachedId', data[0].id)
        } else {
          console.log('[Backers Nearby]: db empty')
        }
      }).catch((error) => {
        console.error(error)
      })
    }

    this.$axios.get(`listings/search?per-page=20&page=${this.currentPage}&lang=${this.$store.getters['user/getCurrentLanguage']}${this.categoryFilter ? `&category_id=${this.categoryFilter}` : ''}&lon=${this.locationSearchInfo ? this.locationSearchInfo.location.longitude : this.currentLocation.longitude}&lat=${this.locationSearchInfo ? this.locationSearchInfo.location.latitude : this.currentLocation.latitude}${searchType === 'keyword' && this.keywordSearchInfo ? `&keywords=${this.keywordSearchInfo}` : ''}${this.renewCache ? `&renewCache=1` : ''}`, {
      headers: {
        'Authorization': this.$store.getters['user/authorizationHeader']
      }
    }).then((response) => {
      let page = response.config.url.split('&')[1]
      if (response.data.searchInfo.items.serviceInfo.length === 0) {
        if (this.listingInfo.length === 8 && page === 'page=1') {
          this.nearbyInfo = {
            'items': {
              '_meta': {
                'totalCount': 0
              }
            }
          }
          this.listingInfo = []
        }

        this.endOfPage = true
      } else if (response.data.searchInfo.items.serviceInfo.length > 0) {
        // cache search results
        if ((searchType !== null || this.categoryFilter) && this.currentPage === 1 && page === 'page=1') {
          let searchTypeInfo = null
          // check search type
          if (searchType === 'keyword' && this.keywordSearchInfo !== null) {
            searchTypeInfo = 'keyword'
          } else if (searchType === 'location' && this.locationSearchInfo !== null) {
            searchTypeInfo = 'location'
          }

          this.searchForm = {
            searchType: searchTypeInfo,
            searchKeyword: this.keywordSearchInfo,
            searchLocation: {
              location: {
                latitude: this.locationSearchInfo ? this.locationSearchInfo.location.latitude : null,
                longitude: this.locationSearchInfo ? this.locationSearchInfo.location.longitude : null,
                fullAddress: this.locationSearchInfo ? this.locationSearchInfo.location.fullAddress : null
              }
            },
            searchFilter: this.categoryService
          }

          // update cache
          let payload = this.searchForm
          payload.items = this.$_.clone(response.data.searchInfo.items.serviceInfo)
          payload.totalCount = response.data.searchInfo.items._meta.totalCount
          this.$store.dispatch('search/insertExploreSearch', payload).catch((error) => {
            console.error(error)
          })
        }

        // insert broadcast button
        let serviceInfo = {
          coverImage: 'statics/images/broadcast-picture.png',
          listingUrl: `/services`,
          parentServiceName: '1'
        }

        let serviceListings = response.data.searchInfo.items.serviceInfo
        let random = parseInt(Math.random() * 10)
        if (random % 2 === 0) {
          serviceListings.splice(random, 0, serviceInfo)
        } else {
          serviceListings.splice(random + 1, 0, serviceInfo)
        }

        this.nearbyInfo = response.data.searchInfo

        // check if is the first load
        if (this.listingInfo[0] && this.listingInfo[0].id === undefined) {
          this.listingInfo = []
        }

        if (this.renewCache) {
          this.listingInfo = []
          this.renewCache = false
        }

        if (this.listingInfo.length === 0 && page === 'page=1') {
          this.listingInfo = this.listingInfo.concat(serviceListings)
        } else if (page !== 'page=1') {
          this.listingInfo = this.listingInfo.concat(serviceListings)
        }

        // directly end preloader if current items less than 18
        if (response.data.searchInfo.items.serviceInfo.length < 18) {
          if (this.$refs['backers-nearby-infinite-scroll']) {
            this.$refs['backers-nearby-infinite-scroll'].stop()
          }
          this.endOfPage = true
        }
      }
      this.onSearch = false
    }).catch((error) => {
      console.error(error)
    }).finally(_ => {
      this.searchLoader = false

      if (done) {
        done()
      }
    })
  },
  getServiceName (parentId) {
    return this.$t(this.$_.findWhere(services, {'parentId': parentId}).shortName)
  },
  onBlockUser () {
    this.renewCache = true
    this.getBackersNearby()
  }
}
}
</script>
