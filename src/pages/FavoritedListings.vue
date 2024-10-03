<template>
    <q-page class="q-mt-xs q-mb-xl">
        <!--<q-infinite-scroll @load="onLoad" class="row q-py-sm justify-center q-mx-md" :offset="2800">-->
            <div class="row justify-center q-mx-md q-py-sm" v-if="listingInfo">
                <div class="col-12 text-center q-mb-md" v-if="searchLoader">
                    <ComponentPreLoader></ComponentPreLoader>
                </div>
                <!-- Listing card -->
                <listing-card v-for="(listing, index) in listingInfo" :key="index" :class="screenWidth < 700 ? 'col-6' : 'col-3'" :listingInfo="listing.serviceInfo" :index="index" :isFavorite="listing.serviceInfo.isFavorite" class="listing-card q-px-xs" @on-favorite="updateFavorite"></listing-card>
                <div v-if="listingInfo.length === 0 && endOfPage" class="text-center q-pt-md">
                  <img src="statics/images/logo-mid.jpg" class="image-upload q-mb-md" width="25%"/>
                  <p>{{$t('no.favorited.listings')}}</p>
                  <q-btn color="primary" outline :label="$t('discover.nearby.backers')" @click="$router.push({name: 'BackersNearby', query: {cached: 1}})"></q-btn>
                </div>
            </div>
            <div v-else-if="!endOfPage" class="row justify-center q-mx-md q-py-sm">
                <div class="row">
                    <div class="col-md-3 col-xs-6" v-for="index in 8" :key="index">
                        <listing-card :listingInfo="{}" :index="index" class="listing-card q-px-xs"></listing-card>
                    </div>
                </div>
            </div>
        <!--</q-infinite-scroll>-->
    </q-page>
</template>
<script>
import services from 'assets/services.json'
export default {
  components: {
    'listing-card': () => import('components/Explore/listingCards.vue')
  },
  data () {
    return {
      listingInfo: null,
      endOfPage: false,
      searchLoader: false,
      screenWidth: screen.width
    }
  },
  created () {
    this.getFavorites()
  },
  beforeDestroy () {
    this.$emit('search-info', null)
  },
  methods: {
    updateFavorite (status, index) {
      this.listingInfo[index].serviceInfo.isFavorite = status
    },
    onLoad (index, done) {
      if (this.endOfPage) {
        done()
        return
      }

      setTimeout(() => {
        this.getFavorites()
        done()
      }, 2500)
    },
    getFavorites () {
      this.searchLoader = true
      if (this.$store.getters['cached/getFavoritedListingsCached']) {
        this.listingInfo = this.$store.getters['cached/getFavoritedListingsCached']
      }

      this.$axios.get(`users/${this.$store.getters['user/getUserUuidState']}/favorites`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        console.log(response)
        if (response.status === 204 || response.data.favoritesServiceInfo.items.length === 0) {
          this.endOfPage = true
          this.listingInfo = []
        } else {
          this.listingInfo = response.data.favoritesServiceInfo.items
          this.$store.dispatch('cached/cachedFavoritedListings', this.listingInfo)
        }
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        this.searchLoader = false
      })
    },
    getServiceName (parentId) {
      return this.$_.findWhere(services, {'parentId': parentId}).shortName
    }
  }
}
</script>
