<template>
  <div class="row justify-center padding">
    <div v-if="this.responses !== 'NO CONTENT'" :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}">
        <!-- Header -->
        <q-item>
          <q-item-section>
            <q-item-label class="q-py-sm">
                <big>
                    <strong>{{ $t(getServiceName(this.responses.serviceId)) }}</strong>
                </big>
            </q-item-label>
            <q-item-label class="q-py-xs header-description" caption>{{this.responses.requestDescriptionShort}}</q-item-label>
            <q-item-label class="q-py-xs header-description" caption>
              {{$t('request.made.date')}} {{formatDate(this.responses.createdDate)}}
            </q-item-label>
            <q-item-label class="q-py-xs">
              <!-- View Details Button -->
              <q-btn-group flat spread rounded>
                <q-btn outline @click.native="viewRequestOpen" color="primary" :ripple="false" :label="$t('view.details')"></q-btn>
                <q-btn outline v-if="this.responses.status === STATUS.REQUEST_STATUS_PENDING" @click.native="viewRequestOpen" color="primary" :ripple="false" :label="$t('requests.page.editrequest')"></q-btn>
              </q-btn-group>
            </q-item-label>
          </q-item-section>
        </q-item>

        <div v-if="this.responses.totalResponses > 0">
          <!-- Title (Contacted Backers) -->
          <div class="contacted-header">
              <q-item-label class="font-title contacted-title " v-if="this.responses.status === STATUS.REQUEST_STATUS_PENDING">{{$t('contacted.backers')}}</q-item-label>
              <q-item-label class="font-title contacted-title " v-else-if="this.responses.status === STATUS.REQUEST_STATUS_IN_PROGRESS || this.responses.status === STATUS.REQUEST_STATUS_COMPLETED">{{$t('hired.backer')}}</q-item-label>
          </div>
          <!-- Responses -->
          <q-list no-border>
            <!-- STATUS in pending -->
            <div v-if="this.responses.status === STATUS.REQUEST_STATUS_PENDING">
              <div class="container" v-for="(response, index) in pendingArray" :key="response.id" >
                <hr/>
                <q-item class="response-item" >
                    <q-item-section top avatar @click.native="openPendingListingProfile(response)">
                        <q-avatar square style="width:80px;height:80px;">
                            <img :src="response.serviceInfo.avatarImage" class="profile">
                        </q-avatar>
                    </q-item-section>
                    <q-item-section @click.native="openPendingListingProfile(response)">
                        <q-item-label v-if="response.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT.toString()" class="font-normal text-positive text-weight-medium">{{$t('responded.backer')}}</q-item-label>
                        <q-item-label v-else-if="response.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_REJECT.toString()" class="font-normal text-negative text-weight-medium"><q-icon name="far fa-clock" style="font-size: 13px; margin-right: 5px;"></q-icon>{{$t('backer.unavailable')}}</q-item-label>
                        <q-item-label class="font-normal text-neutral text-weight-medium" v-else><q-icon name="far fa-clock" style="font-size: 13px; margin-right: 5px;"></q-icon>{{$t('waiting.to.hear.back')}}</q-item-label>
                        <q-item-label class="text-weight-medium font-normal">{{response.serviceInfo.userServiceName}}</q-item-label>
                        <q-item-label caption v-if="parseInt(response.serviceInfo.rating) > 0" class="star-size">
                          <q-icon name="fas fa-star" class="star-color" style="margin-left: 2px" v-for="i in parseInt(response.serviceInfo.rating)" :key="i"/>
                          <span v-if="response.serviceInfo.numberOfRatings > 0" style="margin-left: 2px"> ({{response.serviceInfo.numberOfRatings}})</span>

                          <span v-if="response.offerAmount > 0 && parseInt(response.directRequest) !== 1" class="listingPrice font-normal-bold q-px-xs" style="float: right;" >{{getCountryCurrency(response.offerCurrency)}} {{response.offerAmount}}</span>
                        </q-item-label>

                        <!-- Invited by you -->
                        <q-item-label v-if="parseInt(response.directRequest) === 1">
                          <q-badge color="primary" class="q-px-sm q-py-xs" style="border-radius: 11px;">
                            <q-icon name="far fa-thumbs-up" style="font-size:9px; margin-right:5px;"></q-icon>
                            {{$t('invited.banner')}}
                          </q-badge>

                          <span class="listingPrice font-normal-bold q-px-xs" style="float: right;" v-if="response.offerAmount > 0">{{getCountryCurrency(response.offerCurrency)}} {{response.offerAmount}}</span>
                        </q-item-label>

                        <!-- Quote Price -->
                        <q-item-label class="listingPrice font-normal-bold" v-if="response.offerAmount > 0 && parseInt(response.directRequest) !== 1 && parseInt(response.serviceInfo.rating) === 0">{{getCountryCurrency(response.offerCurrency)}} {{response.offerAmount}}</q-item-label>
                    </q-item-section>
                    <q-item-section side v-if="response.acceptanceStatus === STATUS.ACCEPTANCE_NO_RESPONSE.toString()">
                      <q-btn :loading="pokeLoading" label="poke" color="primary" class="text-capitalize" :ref="index" style="padding: 3px;margin-top: 40px;font-size: 12px;" round @click="poke(response.serviceInfo.userServiceName, index)"></q-btn>
                    </q-item-section>
                </q-item>
                <q-btn v-if="response.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT.toString()" class="full-width text-caption" style="font-weight:450" color="primary" @click="$router.push({ name: 'Chat', params: {request: $route.params.requestId, response: response.id} })" no-caps><q-icon name="far fa-comment" style="font-size:12px; margin-right: 10px;" />{{ $t('message.backer')}}</q-btn>
              </div>
            </div>
            <!-- STATUS in progress/completed-->
            <div v-else-if="this.responses.status === STATUS.REQUEST_STATUS_IN_PROGRESS || this.responses.status === STATUS.REQUEST_STATUS_COMPLETED">
              <div class="container" v-for="response in this.responses.responseInfo.items" :key="response.id" >
                <hr v-if="response.acceptanceStatus == STATUS.ACCEPTANCE_PARENT_ACCEPT"/>
                <div v-if="response.acceptanceStatus == STATUS.ACCEPTANCE_PARENT_ACCEPT">
                  <q-item class="response-item" @click="openPendingListingProfile(response)">
                      <q-item-section top avatar>
                          <q-avatar square style="width:80px;height:80px;">
                              <img :src="response.serviceInfo.avatarImage" class="profile">
                          </q-avatar>
                      </q-item-section>
                      <q-item-section >
                          <q-item-label class="font-normal text-weight-medium text-positive">{{$t('hired.status')}}</q-item-label>
                          <q-item-label class="text-weight-medium">{{response.serviceInfo.userServiceName}}</q-item-label>
                          <q-item-label caption>
                            <q-icon name="fas fa-star star-color" v-for="i in response.serviceInfo.rating" :key="i" class="star-size"/>
                            <span v-if="response.serviceInfo.numberOfRatings > 0" style="margin-left: 2px"> ({{response.serviceInfo.numberOfRatings}})</span>
                          </q-item-label>
                          <q-item-label>
                            <q-badge color="primary" class="q-px-sm q-py-xs" style="border-radius: 11px;">
                              <q-icon name="far fa-thumbs-up" style="font-size:9px; margin-right:5px;"></q-icon>
                              {{$t('invited.banner')}}
                            </q-badge>
                          </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label class="listingPrice font-normal-bold" style="margin-top: 60px;">{{getCountryCurrency(response.offerCurrency)}} {{response.offerAmount}}</q-item-label>
                      </q-item-section>
                  </q-item>
                  <q-btn class="full-width text-caption" style="font-weight:450" color="primary" @click="$router.push({ name: 'Chat', params: {request: $route.params.requestId, response: response.id} })" no-caps><q-icon name="far fa-comment" style="font-size:12px; margin-right: 10px;" /> {{$t('message.backer')}}</q-btn>
                </div>
              </div>
            </div>
            <!-- STATUS in cancelled-->
            <div v-else>
              <q-item>
                <q-item-section>
                    <q-item-label class="q-py-xs header-description text-center">{{$t('request.status.closed')}}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-list>
        </div>
        <!-- Appear on cancelled request -->
          <div v-else-if="this.responses.status === STATUS.REQUEST_STATUS_CANCELLED">
          <q-item>
            <q-item-section>
                <q-item-label class="q-py-xs header-description text-center">{{$t('request.status.cancelled')}}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <!-- Appear on no responses -->
        <div v-else>
          <q-item class="q-py-none q-my-none">
            <q-item-section class="q-ma-none">
                <!-- <q-item-label class="q-py-xs header-description text-center" caption>{{$t('no.responses.currently')}}</q-item-label> -->
                <img width="100%" src="statics/images/no-response.jpg" />
                <!-- <q-item-label class="q-py-xs header-description text-center" caption>{{$t('contacting.other.backers')}}</q-item-label> -->
                <div class="caption2 q-mt-md">
                  {{$t('pls.wait.for.responses')}}
                </div>
            </q-item-section>
          </q-item>
        </div>

        <prompt-scroll-down v-if="this.responses.status === STATUS.REQUEST_STATUS_PENDING && listings.length > 0"></prompt-scroll-down>

        <div v-if="this.responses.status === STATUS.REQUEST_STATUS_PENDING">
          <!-- Title (Invite other backers to your request) -->
          <div class="invite-header" ref="inviteBacker">
            <q-item-label class="font-title contacted-title">{{$t('invite.other.backers')}}</q-item-label>
          </div>
          <q-list no-border v-if="listings.length > 0">
            <q-infinite-scroll @load="loadMore" :offset="0">
              <div class="container" v-for="listing in listings" :key="listing.id" :ref="listing.listingId">
                  <div v-if="listing && listing.userInfo.id !== $store.getters['user/getUserUuidState'] && responseID.indexOf(listing.userInfo.id) < 0">
                    <hr/>
                    <q-item class="response-item" @click.native="openListingProfile(listing)">
                        <q-item-section top avatar>
                            <q-avatar square style="width:80px;height:80px;">
                                <img :src="listing.userInfo.avatarImage" class="profile">
                            </q-avatar>
                        </q-item-section>
                        <q-item-section >
                            <q-item-label class="text-weight-medium font-normal">{{listing.userServiceName}}</q-item-label>

                            <q-item-label caption>
                              <q-icon name="fas fa-star star-color" v-for="i in listing.rating" :key="i" class="star-size q-ml-xs"></q-icon>
                              <span v-if="listing.numberOfRatings > 0" style="margin-left: 2px"> ({{listing.numberOfRatings}})</span>
                            </q-item-label>

                            <q-item-label>
                              <q-badge color="positive" class="q-px-sm q-py-xs q-mr-sm q-my-xs" style="border-radius: 11px;" v-if="listing.userInfo != undefined && listing.userInfo.completedJob > 0 ">
                                {{listing.userInfo.completedJob}} {{$t('notifications.bookings')}}
                              </q-badge>
                              <q-badge color="positive" class="q-px-sm q-py-xs q-my-xs" style="border-radius: 11px;" v-if="listing.userInfo != undefined && listing.userInfo.repeatedGuests > 0">
                                {{listing.userInfo.repeatedGuests}} {{$t('repeated.customers.banner')}}
                              </q-badge>
                            </q-item-label>
                            <q-item-label class="listingPrice font-normal-bold" v-if="listing.serviceRates !== null">{{$t('listings.price', {serviceRates: listing.serviceRates})}}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-btn class="full-width text-caption" :loading="loading" :ref="listing.id" color="primary" style="font-weight:450" @click="inviteBacker(listing, listing.listingId, listing.userServiceName, listing.id, listing.listingUrl)" no-caps><q-icon name="far fa-comment" style="font-size:12px; margin-right: 10px" />
                      <template v-slot:loading>
                        <q-spinner-facebook />
                      </template>
                      {{$t('invite.backer')}}
                    </q-btn>
                  </div>
              </div>
            </q-infinite-scroll>
            <q-btn v-if="!hidden" :loading="loadingMore" size="12px" ref="loadMore" :label="$t('load.more.button')" class="load-more-btn" @click="loadMore" no-caps/>
          </q-list>
          <div class="justified text-center" v-else ref="preLoader">
            <ComponentPreLoader></ComponentPreLoader>
          </div>
        </div>
    </div>
    <div v-else>
        <ComponentPreLoader></ComponentPreLoader>
    </div>
  </div>
</template>

<script>
/* global bugsnagClient */
import services from 'assets/services.json'
import moment from 'moment'
import requestStatus from 'assets/request-status.json'
import countriesDetails from 'assets/countries.json'

export default {
  components: {
    'prompt-scroll-down': () => import('components/PromptScrollDown.vue')
  },
  data () {
    return {
      responses: 'NO CONTENT',
      response: null,
      today: moment().utc().format(),
      STATUS: requestStatus,
      listings: [],
      loading: false,
      viewRequestModal: false,
      mobileView: false,
      transitionHideSummary: 'default',
      transitionShowSummary: 'default',
      viewFrom: 'modal',
      page: 1,
      count: 0,
      loadingMore: false,
      hidden: false,
      num: 0,
      responseID: [],
      pokeLoading: false
    }
  },
  created () {
    this.getResponses()
  },
  mounted () {
    this.offSet()
    console.log('Current route name:', this.$route.name)
    console.log('Current route path:', this.$route.path)
  },
  computed: {
    pendingArray: function () {
      return this.responses.responseInfo.items.slice().sort((a, b) => {
        if (a.acceptanceStatus === '0' && b.acceptanceStatus === '0') {
          return 0
        } else if (a.acceptanceStatus === '0' && b.acceptanceStatus === '1') {
          return 1
        } else if (b.acceptanceStatus === '0' && a.acceptanceStatus === '1') {
          return -1
        } else {
          return a.acceptanceStatus - b.acceptanceStatus
        }
      })
    }
  },
  methods: {
    poke (listingName, id) {
      this.$refs[id][0].loading = true
      let pokeText = this.$t('you.poked', {someone: listingName})
      setTimeout(() => {
        this.$q.notify({
          message: pokeText,
          timeout: 800,
          position: 'top',
          type: 'positive'
        })
      }, 1800)
      setTimeout(() => {
        this.$refs[id][0].loading = false
      }, 1800)
    },
    offSet () {
      // scroll to invite backer section on load
      if (this.$route.hash === '#invite-backer') {
        let elem = this.$refs['inviteBacker']
        scrollTo(document.body, elem.offsetTop, 100)
      }
    },
    viewRequestOpen () {
      const requestIdParam = this.$route.params.requestId

      // Check if requestId is present in the route parameters
      if (requestIdParam) {
        // Navigate to the 'ViewRequest' route using the requestIdParam from the route
        this.$router.push({ name: 'ViewRequest', params: { requestId: requestIdParam } })
      } else {
        // Check if requestId is present in localStorage
        const cachedRequestId = localStorage.getItem('cachedRequestId')

        if (cachedRequestId) {
          // Navigate to the 'ViewRequest' route using the cached requestId
          this.$router.push({ name: 'ViewRequest', params: { requestId: cachedRequestId } })
          return // Exit the function since we have the requestId from cache
        }

        // If requestId is neither in route params nor cache, handle the case accordingly
        // For example, redirect to a default route or show an error message
        // For now, let's redirect to the 'Requests' route
        this.$router.replace({ name: 'Requests' })
      }
    },

    openListingProfile (listingInfo) {
      if (this.$q.platform.is.cordova) {
        this.$router.push({name: 'Listing', params: {listingId: parseInt(listingInfo.listingId)}, query: {id: listingInfo.userInfo.id, url: listingInfo.listingUrl, invited: 0}})
      } else {
        this.openUrl(`${this.$t('link.href.petbacker')}${listingInfo.listingUrl}`)
      }
    },
    openPendingListingProfile (response) {
      if (this.$q.platform.is.cordova) {
        this.$router.push({name: 'Listing', params: {listingId: parseInt(response.serviceInfo.id)}, query: {id: response.serviceInfo.userInfo.id, url: response.serviceInfo.listingUrl, invited: 1, status: response.acceptanceStatus}})
      } else {
        this.openUrl(`${this.$t('link.href.petbacker')}${response.serviceInfo.listingUrl}`)
      }
    },
    getServiceName (id) {
      for (let items in services) {
        if (services[items].id === id) {
          localStorage.setItem('servicenameDialog', services[items].name)
          return services[items].name
        }
      }
      return 'Failed'
    },
    loadMore () {
      this.loadingMore = true
      this.page++
      this.getListings()
      setTimeout(() => { this.loadingMore = false }, 1200)
    },
    getResponses () {
      const requestIdParam = this.$route.params.requestId

      // Check if requestId is present in the route parameters
      if (requestIdParam) {
        // Fetch responses using the requestIdParam directly from the API
        this.$axios.get(`users/${this.$store.state.user.uuid}/requests/${requestIdParam}?v=6`, {
          headers: {
            'Authorization': this.$store.getters['user/authorizationHeader']
          }
        }).then(response => {
          this.responses = response.data.requestInfo

          // Save the requestId and responses in localStorage
          localStorage.setItem('cachedRequestId', requestIdParam)
          localStorage.setItem('cachedResponses', JSON.stringify(this.responses))

          for (let i = 0; i < this.responses.responseInfo.items.length; i++) {
            this.responseID.push(this.responses.responseInfo.items[i].serviceInfo.userInfo.id)
          }
          this.getListings()
        }).catch(error => {
          if (this.responses === 'NO CONTENT') {
            if (this.$q.platform.is.mobile) {
              this.$router.replace({ name: 'MobileDashboard' })
            } else {
              this.$router.replace({ name: 'Requests' })
            }
          }
          bugsnagClient.notify(error)
        })
      } else {
        // Check if requestId is present in localStorage
        const cachedRequestId = localStorage.getItem('cachedRequestId')

        if (cachedRequestId) {
          // Fetch responses from the cached value
          const cachedResponses = JSON.parse(localStorage.getItem('cachedResponses'))

          if (cachedResponses) {
            this.responses = cachedResponses
            this.getListings()
            return // Exit the function since we have the data from cache
          }
        }

        // If requestId is neither in route params nor cache, handle the case accordingly
        if (this.responses === 'NO CONTENT') {
          if (this.$q.platform.is.mobile) {
            this.$router.replace({ name: 'MobileDashboard' })
          } else {
            this.$router.replace({ name: 'Requests' })
          }
        }
      }
    },

    getListings () {
      if (this.responses.status !== this.STATUS.REQUEST_STATUS_PENDING) {
        return null
      }

      // TODO add filter, to show only allow broadcast sitters
      this.$axios.get(`listings/search?is_blocked=0&is_paused=0&lang=${this.langToAPI(this.$store.getters['user/getCurrentLanguage'])}&lat=${this.responses.latitude}&lon=${this.responses.longitude}&page=${this.page}&per_page=4`)
        .then(response => {
          if (response.data.searchInfo.items.serviceInfo.length === 0 && this.loadingMore) {
            this.hidden = true
          } else if (response.data.searchInfo.items.serviceInfo.length === 0) {
            // no other backers in area
            this.$refs['preLoader'].className = 'hide'
          } else {
            this.listings = this.listings.concat(response.data.searchInfo.items.serviceInfo)
          }
        }).catch(error => {
          bugsnagClient.notify(error)
          console.error(error)
        })
    },
    checkPreferred (responseInfo) {
      if (responseInfo.serviceInfo.userServiceName === this.responses.jobAssignedTo) {
        return true
      } else if (responseInfo.directRequest === '1') {
        return true
      }

      return false
    },
    inviteBacker (listing, listingID, listingName, id, listingUrl) {
      this.$refs[id][0].loading = true

      this.$axios.get(`users/${this.$store.state.user.uuid}/requestassign/${listingID}?requestid=${this.$route.params.requestId}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.$refs[listingID][0].className = 'visualHide'
        setTimeout(() => { this.$refs[listingID][0].hidden = true }, 250)
        this.$q.notify({
          message: `${listingName} has been invited to your request!`,
          timeout: 1000,
          type: 'positive',
          position: 'top'
        })

        let backer = {
          acceptanceStatus: '0',
          directRequest: '1',
          serviceInfo: {
            id: listingID,
            userServiceName: listingName,
            rating: listing.rating,
            numberOfRatings: listing.numberOfRatings,
            avatarImage: listing.userInfo.avatarImage,
            userInfo: {
              id: listing.userInfo.id
            },
            listingUrl: listingUrl
          }
        }
        this.$refs[id][0].loading = false
        setTimeout(() => { this.responses.responseInfo.items.push(backer) }, 200)
        if (this.responses.totalResponses === 0) {
          this.responses.totalResponses = 1
        }
        this.num++
      }).catch(error => {
        if (error.response.data.message !== undefined) {
          this.$q.notify({
            message: error.response.data.message,
            timeout: 1100
          })
        } else {
          this.$q.notify({
            message: `Looks like something went wrong! Contact support for help!`
          })
          bugsnagClient.notify(error)
          console.error(error)
        }
        this.$refs[id][0].loading = false
      })
    },
    getCountryCurrency (countryID) {
      for (let country in countriesDetails) {
        if (countriesDetails[country].id === countryID) {
          return countriesDetails[country].currencyCode
        }
      }

      return 'INVALID COUNTRY ID'
    },
    formatDate (date) {
      return moment(date).format('ll')
    },
    getLink (response) {
      let link = '/chat/request/' + this.$route.params.requestId + '/response/' + response.id
      let linkref = 'https://web.petbacker.com' + link
      linkref = encodeURIComponent(linkref)
      return '?linkref=' + linkref
    }
  }
}
</script>

<style lang="stylus">
.header-description
  margin-top: 0px
  padding-top: 0px
  font-size: 15px
.header-viewBtn
  margin-top: 55px
  padding-left: 22px
.viewDetails
  float: right
  top: -28px
  right: -23px
.q-focus-helper
  background: none !important

hr
  border: 0
  width: 90%
  background-color: #D0D0D0
  height: 1px
  margin-top: 5px
  margin-bottom: 15px

.contacted-header
  width: 100%
.contacted-title
  margin-left: 18px
  font-weight: 500

.invite-header
  width: 100%
  margin-top: 45px

.container
  width: 91%
  margin-left: 15px
  margin-right: 15px
  margin-bottom: 15px
.visualHide
  transform: translateX(1500px)
  opacity: 0
  overflow: hidden
  transition-duration: 0.4s
  transition-property: height, opacity, transform
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1)
.container hr
  width: 100%
  margin-bottom: 15px
.response-item
  padding: 0px
  padding-bottom: 12px

.listingPrice
  text-align: right

@media screen and (min-width: 360px)
  .viewDetails
    float: right
    top: -10px
    right: -10px

@media screen and (min-width: 700px)
  .container
    width: 96%

@media screen and (min-width: 1000px)
  .container
    width: 99%

.preferred-banner
  background-color: $primary
  padding: 3px
  padding-left: 15px
  padding-right: 16px
  color: white
  font-weight: 500
  border-radius: 60px
.bookings-banner
  background-color: $positive
  color: white
  font-weight: 500
  border-radius: 50px
  padding: 3px
  padding-left: 8px
  padding-right: 8px
.repeated-customer-banner
  background-color: $positive
  color: white
  font-weight: 500
  border-radius: 50px
  padding: 3px
  padding-left: 8px
  padding-right: 8px
  margin-left: 6px

img.profile
  object-fit: cover
  width: 100%
  height: 250px

.load-more-btn
  display: block
  color: $primary
  margin-left: auto
  margin-right:auto
  margin-bottom: 100px
  margin-top: 45px
  padding-left: 30px
  padding-right: 30px
  border-radius: 5px
  border-style: solid
  border-width: 1px
  border-color: $primary
  font-weight: 500

.hide
  display: none

.caption2
  color: rgba(0,0,0,0.54);
  font-size: 15px
</style>
