<template>
  <q-page padding class="row justify-center text-center">
    <div v-if="this.$store.state.user.access">
      <div v-if="listingInfo">
        <div class="col-xs-12 col-md-9" style="border-bottom: 1px solid lightgrey;">
          <big> {{ $t('submit.review.for')}} <br/> <strong>{{ listingInfo.biz_title }}</strong> </big>
        </div>
        <q-separator></q-separator>
        <div class="col-xs-12 q-pa-md col-md-9">
          <a :href="listingInfo.listing_url" target="_blank" rel="noreferrer noopener">
            <q-avatar style="height: 100px;width: 100px;">
              <img :src="listingInfo.avatar" :alt="listingInfo.username" class="responsive avatar image-upload">
            </q-avatar>
          </a>
          <div class="text-center">
            <q-rating class="q-pb-md q-pt-lg primary" color="yellow-star" v-model="userRating" :max="5" size="40px"/>
          </div>
          <p class="q-pt-md">{{ $t('what.about.experience') }}</p>
          <textarea v-model="userReview" class="full-width q-pa-md" rows="3"></textarea>
          <q-btn color="primary" :loading="saveReviewLoading" :disabled="saveReviewLoading || !userReview" class="q-ma-md" @click="sendReview">{{ $t('button.submit.review')}}</q-btn>
        </div>
      </div>
      <div class="col-xs-12 text-center" v-else>
        <ComponentPreLoader></ComponentPreLoader>
      </div>
      <q-dialog v-model="reviewModal" class="responsive-modal" :maximized="mobileView" :content-css="{minWidth: '350px', minHeight: '200px'}">
        <q-card>
          <q-card-section class="text-center">
            <h4>{{$t('review.us.too')}} ❤️</h4>
            <h5 v-if="reviewModalText === 'fb'">{{$t('review.modal.text.fb')}}</h5>
            <h5 v-else-if="reviewModalText === 'app'">{{$t('review.modal.text.app')}}</h5>
            <q-btn class="q-mb-sm q-mt-md q-mx-md primary bg-primary text-white full-width" size="lg" @click="openReviewLink">
              {{$t('chat.reviewnow')}}
            </q-btn>
            <q-btn class="q-mb-sm q-mt-md q-mx-md primary bg-white text-grey full-width" size="lg" @click="reviewModal = false">
              {{$t('chat.later')}}
            </q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      userRating: 5,
      userReview: null,
      saveReviewLoading: false,
      userServiceId: this.$route.params.serviceUserId,
      listingInfo: this.$q.cookies.get('globalStorageReviewListingInfo') || null,
      review: this.$q.cookies.get('globalReviewStatus') || null,
      mobileView: this.$q.platform.is.mobile,
      reviewModal: false,
      reviewModalText: '',
      reviewModalLink: ''
    }
  },
  created () {
    // if (!this.$store.state.user.access) {
    //   this.$router.replace('/login/email')
    //   return
    // }
    if (this.listingInfo === null) {
      this.getSitterListing()
    }

    if (!this.$store.state.user.access) {
      this.$router.replace({name: 'Signup'})
    }
  },
  methods: {
    openReviewLink () {
      this.reviewModal = false
      this.openUrl(this.reviewModalLink)
      this.$router.replace({name: 'ReviewVerifiedThankYou', params: {request: this.$route.params.request, response: this.$route.params.response}})
    },
    openReviewModal () {
      this.reviewModal = true
      this.reviewModalText = 'fb'
      this.reviewModalLink = 'https://www.facebook.com/petsbacker'
    },
    sendReview () {
      this.saveReviewLoading = true
      if (!this.userReview) {
        this.saveReviewLoading = false
        this.$q.notify({
          message: this.$t('please.write.review'),
          type: 'negative'
        })
        return
      }

      let info = {
        'responseInfo': {
          'userReview': this.userReview,
          'userRating': this.userRating
        }
      }
      this.$axios.put(`users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.modalReviewNow = false
        let submitted = this.$t('review.sent')
        this.$q.notify({
          message: submitted,
          position: 'top',
          type: 'positive'
        })
        setTimeout(() => {
          this.saveReviewLoading = false
        }, 500)

        if (this.$q.platform.is.cordova) {
          if (this.userRating === 5) {
            this.triggerInAppReview()
          } else if (this.userRating === 4) {
            if (!this.$q.cookies.get('facebookReviewed')) {
              if (confirm('Enjoy your experiece? Review us on our Facebook page!')) {
                this.$q.cookies.set('facebookReviewed', true, {'expires': 20})
                this.openUrl('https://www.facebook.com/petsbacker')
              }
            }
          }

          setTimeout(() => {
            this.$router.replace({name: 'ReviewVerifiedThankYou', params: {request: this.$route.params.request, response: this.$route.params.response}})
          }, 650)
        } else {
          setTimeout(() => {
            if (response.data.responseInfo.userRating > 3) {
              this.openReviewModal()
            } else {
              this.$router.replace({name: 'ReviewVerifiedThankYou', params: {request: this.$route.params.request, response: this.$route.params.response}})
            }
          }, 550)
        }
      }).catch(e => {
        console.log(e)
        let errorMessage = this.$t('failed.send.review')
        if (e.response.data.message) {
          errorMessage = e.response.data.message
        }
        this.saveReviewLoading = false
        this.modalReviewNow = false
        this.$q.notify({
          message: errorMessage
        })
      })
    },
    unslugify (nameSlug) {
      let name = ''
      for (let index = 0; index < nameSlug.length; index++) {
        name += ' ' + nameSlug[index].charAt(0).toUpperCase() + nameSlug[index].substr(1)
      }
      return name
    },
    getSitterListing () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      })
        .then(response => {
          let listingData = {
            biz_title: response.data.responseInfo.serviceInfo.userServiceName,
            listing_url: response.data.responseInfo.serviceInfo.listingUrl,
            avatar: response.data.responseInfo.serviceInfo.userInfo.avatarImage,
            username: response.data.responseInfo.serviceInfo.userInfo.username
          }
          if (!this.$store.state.user.access) {
            let COOKIE_EXPIRATION = 1
            this.$q.cookies.set('globalStorageReviewInfoUrl', this.$route.fullPath, { expires: COOKIE_EXPIRATION })
            this.$q.cookies.set('globalStorageReviewListingInfo', listingData, { expires: COOKIE_EXPIRATION })
            this.$q.cookies.set('globalReviewStatus', false, {expires: COOKIE_EXPIRATION})
          } else {
            this.listingInfo = listingData
          }
        }).catch(error => {
          console.log(error)
          if (this.$q.platform.is.mobile) {
            this.$router.replace({name: 'MobileDashboard'})
          } else {
            this.$router.replace({name: 'Requests'})
          }
        })
    }
  },
  watch: {
    userRating (newVal) {
      if (newVal === 0) {
        this.userRating = 5
      }
    },
    reviewModal (newVal) {
      if (newVal === false) {
        this.$router.replace({name: 'ReviewVerifiedThankYou', params: {request: this.$route.params.request, response: this.$route.params.response}})
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
textarea
  resize: none

@media screen and (min-width: 561px)
  .max-line-hight
    max-height: 50px
</style>
