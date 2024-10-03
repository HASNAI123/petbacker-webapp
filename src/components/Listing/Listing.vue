<template>
  <div>
    <div ref="listing-view" class="q-mb-xl margin-auto" :style="{'max-width': $q.platform.is.mobile ? '100%' : '1030px'}">
        <q-tabs v-model="tab" ref="listing-header" class="text-grey fixed-top bg-white" style="top: 9.8%;border-bottom: solid 1px lightgrey;z-index:1000;" active-color="primary" indicator-color="primary" align="justify" dense>
          <q-tab name="details" :label="$t('details')" class="text-capitalize"></q-tab>
          <q-tab name="reviews" :label="serviceInfo && serviceInfo.reviewInfo && serviceInfo.reviewInfo.reviewCount > 0 ? `${serviceInfo.reviewInfo.reviewCount} ${$t('reviews.title')}` : $t('reviews.title')" class="text-capitalize"></q-tab>
        </q-tabs>

        <!-- <div v-if="showEdit" style="margin-top: 8.5%;">
          <q-btn outline color="primary" class="full-width" label="Edit Listing" :ripple="false" @click="$router.push({name: 'EditListing', params: {listingId: $route.params.listingId}})"></q-btn>
        </div> -->
        <p style="margin-top: 7%;"></p>

        <q-tab-panels v-model="tab" animated keep-alive ref="listing-tabs" style="height: 83vh;">
          <!-- <q-scroll-observer :scroll-target="$refs['listing-tabs'] ? $refs['listing-tabs'].$children[0] : ''" @scroll="onScroll"></q-scroll-observer> -->
          <q-tab-panel name="details" class="q-pa-none q-pt-sm">
            <!-- Carousel Header Image -->
            <carousel-header :carouselImages="(listingInfo && listingInfo.images) ? listingInfo.images : []" :images="images"></carousel-header>

            <!-- About Listing -->
            <div class="q-mx-md" >
              <q-item v-if="listingInfo" dense class="q-mt-sm q-mb-md q-pl-xs" clickable @click="$router.push({name: 'PublicProfile', params: {userId: listingInfo ? listingInfo.userInfo.id : ''}})">
                <q-item-section avatar>
                  <q-avatar style="height: 70px; width: 70px;">
                      <img :src="listingInfo.userInfo.avatarImage" class="image-upload">
                  </q-avatar>
                </q-item-section>

                <q-item-section class="q-my-sm">
                  <q-item-label lines="1">
                    <h6 class="q-my-none text-left" style="font-size: 17px;line-height: 1.2em;">{{listingInfo.listingName}}</h6>
                  </q-item-label>

                  <q-item-label class="q-my-sm text-grey" style="font-size: 11px;">
                    <q-icon name="fas fa-star" style="font-size: 12px;" class="star-color q-mr-xs" v-for="i in listingInfo.serviceReviewsInfo.rating" :key="i"></q-icon>
                    <span v-if="serviceInfo && serviceInfo.reviewInfo && serviceInfo.reviewInfo.reviewCount > 0">({{serviceInfo.reviewInfo.reviewCount}})</span>
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

              <!-- Badges Section -->
              <div class="justify-center q-pl-sm" v-if="listingInfo">
                <badges-section :userInfo="listingInfo.userInfo"></badges-section>
              </div>

              <q-separator class="q-my-md" ></q-separator>

              <div class="q-mx-sm font-normal" v-if="serviceInfo" style="max-width: 100%;" v-html="serviceInfo.userServiceDescriptionHtml"></div>
              <div class="col-xs-12 text-center" v-else>
                <ComponentPreLoader></ComponentPreLoader>
              </div>
            </div>

            <q-separator inset class="q-my-md" ></q-separator>

            <!-- Resident Pets -->
            <div class="q-mx-md" v-if="listingInfo && listingInfo.userInfo.personalItemsInfo.items.length > 0">
                <h6 class="q-my-md q-ml-sm">{{$t('resident.pets')}}</h6>
                <div class="row justify-evenly">
                    <q-card class="col-xs-5 q-mb-sm resident-pets" v-for="pet in listingInfo.userInfo.personalItemsInfo.items" :key="pet.id" @click="$router.push({name: 'PetProfile', params: {petId: pet.id}})">
                        <img :src="pet.images[0]" class="image-upload" style="height: 155px;max-height: 155px;"/>

                        <q-card-section class="text-center q-pa-xs">
                            <p class="q-my-none">{{pet.personalItemDetails[0].content}}</p>
                        </q-card-section>
                    </q-card>
                </div>
            </div>

            <q-separator inset class="q-my-md" v-if="listingInfo && listingInfo.userInfo.personalItemsInfo.items.length > 0"/>
            <!-- Neighbourhood -->
            <div class="q-mx-md" v-if="listingInfo && listingInfo.userInfo">
              <h6 class="q-my-md q-ml-sm">{{$t('neighbourhood')}}</h6>
              <p class="q-mx-sm font-small">{{$t('backer.service.nearby', {backerName: listingInfo.userInfo.username, serviceType: $t(getServiceName(listingInfo.subServiceId[0]))})}} <strong>{{listingInfo.serviceLocation[0].city}}, {{listingInfo.serviceLocation[0].country}}</strong>. {{$t('book.via.petbacker')}}</p>
              <div style="position: relative;">
                <!-- <img :src="`https://www.google.com/maps/api/staticmap?size=${deviceWidth - 30}x310&zoom=13&center=${this.listingInfo.serviceLocation[0].latitude},${this.listingInfo.serviceLocation[0].longitude}&markers=icon:http://storage.googleapis.com/petbacker/images/cms/map_coverage_64.png%7C${this.listingInfo.serviceLocation[0].latitude},${this.listingInfo.serviceLocation[0].longitude}&key=${PROCESS.GOOGLE_MAPS_KEY}`" /> -->
                <iframe
                  sandbox="allow-same-origin allow-pointer-lock allow-scripts"
                  :width="(deviceWidth - 30)"
                  scrolling="no"
                  height="250"
                  frameborder="0"
                  allowtransparency="true"
                  style="border:0;"
                  :src="`https://www.google.com/maps/embed/v1/view?center=${listingInfo.serviceLocation[0].latitude},${listingInfo.serviceLocation[0].longitude}&zoom=13&key=${PROCESS.GOOGLE_MAPS_KEY}`"
                >
                </iframe>
              </div>
            </div>

            <q-separator inset class="q-my-md"/>

            <!-- Payment Protection -->
            <div class="q-mb-md q-mt-lg q-mb-xl q-mx-lg" v-if="!showEdit">
              <h6 class="q-my-xs">{{$t('payment.methods')}}</h6>
              <img src="statics/images/donate-now-payment.png" style="height: auto;width: 100%;" class="row q-mb-md" />
              <!-- <q-btn  outline color="primary" class="full-width" style="border-radius: 11px;" label="Contact Backer" @click="contactNowModal = true"></q-btn> -->
              <q-item dense class="q-pa-none q-mt-md">
                <q-item-section>
                  <q-item-label caption>{{$t('book.via.petbacker.long')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="fas fa-shield-alt" color="primary"></q-icon>
                </q-item-section>
              </q-item>
            </div>

          <!-- Other services by this user -->
          <div class="q-my-md q-mt-lg q-mb-lg" :class="{'q-mb-xl q-pb-lg': showEdit}" v-if="listingInfo && listingInfo.otherListingInfo.length > 0">
            <h6 class="q-my-none q-mx-md q-px-sm">{{$t('other.services.by.backer', {backerName: listingInfo.userInfo.username})}}</h6>
            <div class="row no-wrap q-px-sm justify-left hide-scrollbar" style="height: 13vh;overflow: auto;">
              <p class="q-pl-md"></p>

              <!-- Other listing card -->
              <other-listing-card v-for="(listing, index) in listingInfo.otherListingInfo" :key="index" class="col-12 q-mx-sm bg-white clickable" style="width: 230px;height: 75px;"
              :listingInfo="listing"
              :services="getServices()"
              :userUuid="listingInfo.userInfo.id"
              ></other-listing-card>

              <p class="q-pr-md"></p>
            </div>
          </div>

          <!-- Similar listings in this area -->
          <div class="q-my-lg q-mb-xl q-pb-lg" v-if="otherListingInfo.length > 0 && !showEdit">
            <h6 class="q-my-none q-mx-md q-px-sm" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" v-if="listingInfo">{{$t('similar.listings', {cityName: listingInfo.serviceLocation[0].city})}}</h6>
            <div class="row q-py-sm justify-around q-mx-md">
              <div v-for="(listing, index) in otherListingInfo" :key="index" :class="listing.parentServiceName === '1' ? 'col-xs-12' : 'col-md-3 col-xs-6'">
                <!-- Broadcast image -->
                <q-card class="broadcast-image" style="max-height: 145px;margin-bottom: 10%;" v-if="listing.parentServiceName === '1'" @click="triggerServicesModal(true)" flat bordered>
                  <q-img :src="listing.coverImage" style="height: 145px;" class="image-offset"></q-img>
                </q-card>

                <!-- Listing card -->
                <listing-card :listingInfo="listing" :index="index" :currentListing="listingInfo.listingId" class="backer-listing q-px-xs" v-else></listing-card>
              </div>
            </div>
            <!-- <q-infinite-scroll @load="onLoad" :scroll-target="$refs['listing-tabs']" class="row q-py-sm justify-around q-mx-md" ref="infinite-scroll" :offset="2500">
                <div v-for="(listing, index) in otherListingInfo" :key="index" :class="listing.parentServiceName === '1' ? 'col-xs-12' : 'col-md-3 col-xs-6'"> -->
                  <!-- Broadcast image -->
                  <!-- <q-card class="broadcast-image" style="max-height: 145px;margin-bottom: 10%;" v-if="listing.parentServiceName === '1'" @click="triggerServicesModal(true)" flat bordered>
                    <q-img :src="listing.coverImage" style="height: 145px;" class="image-offset"></q-img>
                  </q-card> -->

                  <!-- Listing card -->
                  <!-- <listing-card :listingInfo="listing" :index="index" :currentListing="listingInfo.listingId" class="backer-listing q-px-xs" v-else></listing-card>
                </div> -->
                <!-- <template v-slot:loading v-if="!endOfPage">
                  <div class="row">
                    <listing-card v-for="index in 8" :key="index" :listingInfo="{}" :index="index" class="backer-listing col-md-3 col-xs-6 q-px-xs"></listing-card>
                  </div>
                </template>
            </q-infinite-scroll> -->
          </div>
          <p class="q-py-md"></p>
          </q-tab-panel>

          <q-tab-panel name="reviews" class="q-pa-none q-pt-md">
            <!-- Reviews -->
            <div v-if="serviceInfo && serviceInfo.reviewInfo && serviceInfo.reviewInfo.items.length > 0" class="q-mb-xl q-pb-lg">
              <review-card v-for="index in serviceInfo.reviewInfo.reviewCount" :key="index" :showReply="showEdit" :reviewInfo="serviceInfo.reviewInfo" :index="index"></review-card>
            </div>
            <div class="col-xs-12 text-center" v-else-if="serviceInfo && (serviceInfo.reviewInfo === null || serviceInfo.reviewInfo.items.length === 0)">
              <img class="image-upload q-mt-md" :src="'statics/images/no_notification.png'" width="60%"/>
              <p class="text-center q-mt-md text-label font-normal" v-html="$t('listing.empty.reviews')"></p>
            </div>
            <div class="col-xs-12 text-center" v-else-if="serviceInfo && serviceInfo.reviewInfo && serviceInfo.reviewInfo.items.length !== 0 && serviceInfo.reviewInfo === null">
              <ComponentPreLoader></ComponentPreLoader>
            </div>
          </q-tab-panel>
        </q-tab-panels>
    </div>

    <!-- Bottom Contact Now Button -->
    <transition appear enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown" v-if="listingInfo && !hideBottomBar">
      <div class="row justify-center fixed-bottom shadow-8" style="z-index: 1000;height: 70px;max-height: 70px;" v-if="tab === 'details'">
        <div class="q-pb-lg q-px-md q-pt-sm bg-primary full-width row" v-if="listingInfo.ratesInfo.items.length > 0">
          <div class="col-7">
            <p class="q-my-none text-white"><strong>{{$t(getServiceName(listingInfo.subServiceId[0]))}} {{getCurrencyCode(listingInfo.ratesInfo.items[0].ratesCurrencyId)}} {{listingInfo.ratesInfo.items[0].ratesAmount}}</strong>/{{listingInfo.ratesInfo.items[0].ratesUnit}}</p>
            <p class="q-my-none" v-if="listingInfo.serviceReviewsInfo.rating">
              <q-icon name="fas fa-star" style="font-size: 14px;" class="star-color q-mr-xs" v-for="i in listingInfo.serviceReviewsInfo.rating" :key="i"></q-icon>
              <span v-if="serviceInfo && serviceInfo.reviewInfo.reviewCount > 1" class="text-white" style="font-size: 11px;">({{serviceInfo.reviewInfo.reviewCount}} {{$t('reviews')}})</span>
            </p>
            <p style="padding-top: 5px;" v-else><!-- This p tag is here to make UI look better (spacing) --></p>
          </div>
          <q-btn class="col text-weight-bold text-primary" style="border-radius: 6px;" :ripple="false" :label="$t('edit.listing')" color="white" @click="$router.push({name: 'EditListing', params: {listingId: listingInfo.id}})" v-if="showEdit"></q-btn>
          <q-btn class="col text-weight-bold text-primary" :style="$store.getters['user/getCurrentLanguage'] === 'idid' ? 'font-size: 12px': ''" style="border-radius: 6px;" :ripple="false" :label="$t('contact.now')" color="white" @click="contactNowModal = true" v-else></q-btn>
        </div>
        <div class="q-pb-md q-px-md q-pt-sm bg-white full-width row" v-else>
          <q-btn class="col-12 text-weight-bold" style="border-radius: 6px;" :ripple="false" outline :label="$t('edit.listing')" color="primary" @click="$router.push({name: 'EditListing', params: {listingId: listingInfo.id}})" v-if="showEdit"></q-btn>
          <q-btn class="col-12 text-weight-bold" style="border-radius: 6px;" :ripple="false" :label="$t('contact.now')" color="primary" @click="contactNowModal = true" v-else></q-btn>
        </div>
      </div>
      <div class="row justify-center fixed-bottom shadow-8" style="z-index: 1000;height: 70px;max-height: 70px;" v-else-if="tab === 'reviews' && showEdit">
        <div class="q-pb-md q-px-md q-pt-sm bg-primary full-width row">
          <q-btn class="col-12 text-weight-bold font-normal" style="border-radius: 6px;" flat color="white" :ripple="false" :label="$t('get.more.recommendations')" @click="$router.push({name: 'ShareListing', params: {listingId: listingInfo.id}})"></q-btn>
        </div>
      </div>
      <div class="row justify-center fixed-bottom shadow-8" style="z-index: 1000;height: 70px;max-height: 70px;" v-else-if="tab === 'reviews'">
        <div class="q-pb-md q-px-md q-pt-sm bg-primary full-width row">
          <q-btn class="col-12 text-weight-bold font-normal" style="border-radius: 6px;" flat color="white" :ripple="false" :label="$t('chat.reviewnow')" @click="$router.push({name: 'Review', params: {serviceUserId: listingInfo.id}})"></q-btn>
        </div>
      </div>
    </transition>
    <!-- <div class="justify-center fixed-bottom shadow-8" style="border-top: 1px solid lightgrey;z-index: 1000;height: 71px;max-height: 71px;" v-else-if="!hideBottomBar">
      <div class="q-pb-lg q-px-md q-pt-sm bg-primary full-width">
        <q-skeleton width="185px" height="15px" class="q-my-xs"></q-skeleton>
        <q-skeleton width="155px" height="15px" class="q-my-xs"></q-skeleton>
      </div>
    </div> -->

    <!-- Contact Now Dialog -->
    <dialog-contactnow v-if="listingInfo" :trigger="contactNowModal" :userInfo="listingInfo.userInfo" :serviceUri="getServiceLink(listingInfo.subServiceId[0])" :listingInfo="listingInfo" :images="images" @on-close="closeContactNowModal"></dialog-contactnow>

    <!-- More Services Dialog -->
    <dialog-services :trigger="servicesModal" @on-close="triggerServicesModal"></dialog-services>
  </div>
</template>
<script>
import countries from 'assets/countries.json'
import services from 'assets/services.json'

export default {
  components: {
    'carousel-header': () => import('components/Listing/ListingCarousel.vue'),
    'badges-section': () => import('components/Listing/Badges.vue'),
    'review-card': () => import('components/Listing/reviewCards.vue'),
    'other-listing-card': () => import('components/Listing/OtherListingCard.vue'),
    'dialog-contactnow': () => import('components/Listing/DialogContactNow.vue'),
    'listing-card': () => import('components/Explore/listingCards.vue'),
    'dialog-services': () => import('components/DialogServices.vue')
  },
  props: {
    serviceInfo: {
      default: null,
      required: true
    },
    listingInfo: {
      default: null,
      required: true
    },
    images: {
      type: Array,
      default: () => { return [] },
      required: true
    }
  },
  data () {
    return {
      listingModal: false,
      otherListingInfo: [],
      contactNowModal: false,
      currentPage: 1,
      endOfPage: false,
      isFavorite: false,
      hideBottomBar: false,
      deviceWidth: screen.width,
      showEdit: false,
      tab: 'details',
      slider: 0,
      startInfiniteLoad: false,
      servicesModal: false
    }
  },
  mounted () {
    this.$refs['listing-header'].$el.style.top = `${this.$parent.$parent.$parent.$parent.$parent.$refs['listing-navbar'].$el.clientHeight + 1}px`
    this.$refs['listing-tabs'].$el.style.top = `${this.$refs['listing-header'].$el.clientHeight - 36}px`
  },
  beforeDestroy () {
    this.$emit('listing-name', null, null)
    this.$emit('listing-favorite', null)
    this.$emit('update-edit-button-status', false)
  },
  methods: {
    getServices () {
      return services
    },
    onTriggerListingModal (status) {
      this.listingModal = status
    },
    triggerShowEdit (status) {
      this.showEdit = status
    },
    triggerServicesModal (status) {
      this.servicesModal = status
    },
    onScroll (info) {
      console.log(info)
      if (info.direction === 'down' && info.position >= 4750) {
        this.hideBottomBar = true
      } else if (info.direction === 'up') {
        this.hideBottomBar = false
      }

      if (info.position > 0 && this.$refs['infinite-scroll'] && (info.position >= Math.max(this.$refs['infinite-scroll'].$el.clientHeight - 1500, 0))) {
        this.startInfiniteLoad = true
      } else if (this.$refs['infinite-scroll'] && (info.position < (this.$refs['infinite-scroll'].$el.clientHeight))) {
        this.startInfiniteLoad = false
      }
    },
    getCurrencyCode (countryId) {
      return this.$_.findWhere(countries, {'id': countryId.toString()}).currencyCode
    },
    closeContactNowModal (value) {
      this.contactNowModal = value
    },
    onLoad (index, done) {
      if (this.endOfPage || (this.startInfiniteLoad === false)) {
        done()
        return
      }

      setTimeout(() => {
        this.getOtherListingInfo(done)
      }, 2000)
    },
    checkOtherListingInfo () {
      if (this.otherListingInfo.length === 0) {
        this.getOtherListingInfo()
      }
    },
    getOtherListingInfo (done = null, perPage = 4) {
      this.$axios.get(`listings/search?per-page=${perPage}&page=${this.currentPage}&category_id=${this.listingInfo ? this.listingInfo.parentServiceId : 3}&lang=${this.$store.getters['user/getCurrentLanguage']}&lon=${this.listingInfo.serviceLocation[0].longitude + 0.002}&lat=${this.listingInfo.serviceLocation[0].latitude + 0.002}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.data.searchInfo.items.serviceInfo.length === 0) {
          // insert broadcast button at the end of array
          /* if (this.listingInfo.length > 0 && (this.listingInfo[this.listingInfo.length - 1].parentServiceName !== '1')) {
            let serviceInfo = {
              coverImage: 'statics/images/broadcast-picture.png',
              listingUrl: `/services`,
              parentServiceName: '1'
            }
            this.listingInfo.push(serviceInfo)
          } */

          this.endOfPage = true
        } else if (response.data.searchInfo.items.serviceInfo.length > 0) {
          if (this.currentPage === 2) {
            // insert broadcast button
            let serviceInfo = {
              coverImage: 'statics/images/broadcast-picture.png',
              listingUrl: `/services`,
              parentServiceName: '1'
            }
            let random = parseInt(Math.random() * 10)
            if (random % 2 === 0) {
              response.data.searchInfo.items.serviceInfo.splice(random + 1, 0, serviceInfo)
            } else {
              response.data.searchInfo.items.serviceInfo.splice(random, 0, serviceInfo)
            }
          } else if (this.otherListingInfo.length === 0) {
            response.data.searchInfo.items.serviceInfo.shift()
          }

          this.otherListingInfo = this.otherListingInfo.concat(response.data.searchInfo.items.serviceInfo)
          this.currentPage += 1
        }
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        if (done) {
          done()
        }

        if (this.currentPage === 2 && (this.endOfPage === false)) {
          this.getOtherListingInfo(null, 13)
        }
      })
    },
    getServiceName (serviceId) {
      return this.$_.findWhere(services, {'id': serviceId}).shortName
    },
    getServiceLink (serviceId) {
      return this.$_.findWhere(services, {'id': serviceId}).link.split('/')[2]
    }
  }
}
</script>
<style lang="stylus">
.service-image-card
 width: 155px

.resident-pets
  width: 155px !important

@media only screen and (min-width: 320px)
  .service-image-card
    width: 132px !important
  .resident-pets
    width: 128px!important

@media only screen and (min-width: 350px)
  .service-image-card
    width: 150px !important
  .resident-pets
    width: 148px!important

@media only screen and (min-width: 370px)
  .service-image-card
    width: 157px !important
  .resident-pets
    width: 155px!important

@media only screen and (min-width: 410px)
  .service-image-card
    width: 173px !important
  .resident-pets
    width: 173px!important
</style>
