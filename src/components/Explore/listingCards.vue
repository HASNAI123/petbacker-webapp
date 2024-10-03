<template>
    <q-card :class="{'q-mb-lg': $route.name !== 'PublicProfile' && $route.name !== 'MobileDashboard'}" v-if="listingInfo.parentServiceName !== '1'" style="height: 228px;border-radius: 11px;" flat>
        <!-- Image -->
        <!-- @click="$router.push({name: 'Listing', params: {listingId: listingInfo.listingId || listingInfo.id}, query: {id: listingInfo.userInfo ? listingInfo.userInfo.id : $store.getters['user/getUserUuidState'], url: listingInfo.listingUrl}})" -->
        <q-img basic v-if="listingInfo && (listingInfo.coverImage || listingInfo.serviceImage)" :src="(listingInfo.coverImage || listingInfo.serviceImage[0].href)" placeholder-src="statics/images/graphic-placeholder.jpg" class="listing-image" style="border-radius: 11px;border: 0.5px solid lightgrey;" @click="onTriggerListingModal(true)">
          <q-btn color="white" size="sm" text-color="red" :loading="favLoader" @click.stop="onFavorite(false)" round style="position: absolute; right: 5px;top: 5px;z-index: 500;" :icon="isFavorite === 1 ? 'favorite' : 'favorite_border'"></q-btn>
        </q-img>
        <q-skeleton v-else class="listing-image" height="150px" style="border-radius: 11px;"></q-skeleton>

        <!-- Content -->
        <q-card-section class="q-pa-none" @click="onTriggerListingModal(true)">
            <q-item class="q-px-none q-py-xs">
                <q-item-section v-if="listingInfo && listingInfo.userServiceName">
                    <!-- Listing name -->
                    <q-item-label lines="1" class="font-normal">{{listingInfo.userServiceName}}</q-item-label>

                    <!-- Listing city (only in explore page) -->
                    <q-item-label lines="1" caption v-if="$route.name === 'PublicProfile' || $route.name !== 'MobileDashboard' ">{{ $t('from') }} {{listingInfo.serviceLocation[0].city}}</q-item-label>

                    <!-- Listing rate and type -->
                    <q-item-label lines="1" caption v-else>
                      {{parseRates(listingInfo.serviceRates)}}
                      <q-icon name="fas fa-circle" class="q-mx-xs" size="5px" style="color: lightgrey;margin-bottom: 1%;" v-if="listingInfo.serviceRates"></q-icon>
                      {{listingInfo.parentServiceName}}
                    </q-item-label>

                    <q-item-label :style="{'margin-top': $route.name === 'MobileDashboard' ? '0px': ''}">
                      <q-item dense :class="{'q-pa-none': $route.name === 'MobileDashboard'}">
                        <!-- Listing user avatar -->
                        <q-item-section thumbnail class="q-pr-none" v-if="$route.name !== 'MobileDashboard' && $route.name !== 'PublicProfile'">
                          <q-avatar size="28px" class="q-mr-sm">
                            <q-img :src="listingInfo.userInfo.avatarImage" placeholder-src="statics/images/graphic-placeholder.jpg" height="100%" basic class="responsive image-upload"></q-img>
                          </q-avatar>
                        </q-item-section>

                        <!-- Listing username and ratings -->
                        <q-item-section>
                          <!-- username -->
                          <q-item-label lines="1" class="text-capitalize" v-if="$route.name !== 'MobileDashboard' && $route.name !== 'PublicProfile'">{{listingInfo.userInfo.username}}</q-item-label>

                          <!-- ratings -->
                          <q-item-label :style="marginStyle" lines="1" v-if="listingInfo.numberOfRatings > 0">
                            <q-icon name="fas fa-star" style="font-size: 8px; " class="star-color q-mr-xs" v-for="i in listingInfo.rating" :key="i"></q-icon>
                            <span class="text-grey" style="font-size:10px;">({{listingInfo.numberOfRatings}})</span>
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-item-label>
                </q-item-section>
                <q-item-section v-else>
                  <q-skeleton width="70px" height="10px" class="q-my-xs"></q-skeleton>
                  <q-skeleton width="110px" height="10px" class="q-my-xs"></q-skeleton>
                  <q-skeleton width="90px" height="10px" class="q-my-xs"></q-skeleton>
                </q-item-section>
            </q-item>
        </q-card-section>

        <!-- Dialog Listing -->
        <dialog-listing v-if="listingInfo && (listingInfo.listingId || listingInfo.id)" :trigger="listingModal" :favorited="isFavorite" :listingId="parseInt(listingInfo.listingId || listingInfo.id)" :info="listingInfo"
        @listing-favorite="onListingFavorited"
        @on-close="onTriggerListingModal"
        @on-server-error="triggerServerError"
        @on-block-user="onBlockUser"
        ></dialog-listing>

        <!-- Dynamic Error Dialog -->
        <dialog-error :trigger="serverError" :statusCode="errorStatus" :message="errorMessage" :okButtonLabel="errorOkLabel" @on-ok="onFavorite(true)" @on-close="triggerServerError"></dialog-error>
    </q-card>
</template>
<script>
export default {
  components: {
    'dialog-listing': () => import('components/Listing/DialogListing.vue'),
    'dialog-error': () => import('components/DialogError.vue')
  },
  props: {
    listingInfo: {
      type: Object,
      required: true
    },
    currentListing: {
      type: Number,
      default: 0
    },
    isFavorite: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      favLoader: false,
      serverError: false,
      errorStatus: 0,
      errorMessage: '',
      errorOkLabel: this.$t('ok'),
      listingModal: false
    }
  },
  computed: {
    marginStyle () {
      if (this.$route.name === 'PublicProfile') {
        return { marginTop: '-15px', marginLeft: '-15px' }
      } else {
        return { margin: '0px' }
      }
    }
  },
  methods: {
    onListingFavorited (status) {
      this.$emit('on-favorite', status, this.index)
    },
    onTriggerListingModal (status) {
      this.listingModal = status
    },
    parseRates (ratesString) {
      if (ratesString === null) {
        return ''
      }

      return ratesString.split('/')[0]
    },
    triggerServerError (status, message = null, errorCode = null, params = null) {
      if (errorCode) {
        this.errorStatus = errorCode

        if (errorCode !== 11) {
          this.errorOkLabel = this.$t('yes')
        }
      }

      if (message) {
        this.errorMessage = message
      }

      this.serverError = status
    },
    onFavorite (override = false) {
      this.favLoader = true
      if (this.isFavorite) {
        // un-favorite
        this.$axios.delete(`users/${this.$store.getters['user/getUserUuidState']}/services/${this.listingInfo.listingId || this.listingInfo.id}/favorites${override ? '?override=1' : ''}`, {
          headers: {
            'Authorization': this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          this.$emit('on-favorite', 0, this.index)
        }).catch((error) => {
          console.error(error)
          if (error.response.data) {
            this.triggerServerError(true, error.response.data.message, error.response.data.code)
          }
        }).finally(_ => {
          setTimeout(() => {
            this.favLoader = false
          }, 150)
        })
      } else {
        // favorite
        this.$axios.get(`users/${this.$store.getters['user/getUserUuidState']}/services/${this.listingInfo.listingId || this.listingInfo.id}/favorites`, {
          headers: {
            'Authorization': this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          this.$emit('on-favorite', 1, this.index)
        }).catch((error) => {
          console.error(error)
          if (error.response.data) {
            this.triggerServerError(true, error.response.data.message, error.response.data.code)
          }
        }).finally(_ => {
          setTimeout(() => {
            this.favLoader = false
          }, 150)
        })
      }
    },
    onBlockUser () {
      this.$emit('on-block-user')
    }
  }
}
</script>
<style lang="stylus">
.hide
  display: none

.spacing-left
  margin-left: 10%
</style>
