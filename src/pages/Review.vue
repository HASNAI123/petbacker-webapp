<template>
  <q-page padding class="justify-center text-center">
    <div v-if="$store.state.user.access">
      <div v-if="listingInfo">
        <div class="col-12" style="border-bottom: 1px solid lightgrey;">
          <big class="q-my-none">{{ $t('submit.review.for')}} <br/> <strong>{{ listingInfo.biz_title }}</strong></big>
        </div>
        <q-separator></q-separator>
        <div class="col-xs-12 q-pa-md col-md-9">
          <a :href="listingInfo.listing_url" target="_blank" rel="noreferrer noopener">
            <q-avatar style="height: 100px;width: 100px;">
              <img :src="listingInfo.avatar" :alt="listingInfo.username" class="responsive avatar image-upload">
            </q-avatar>
          </a>
          <div class="text-center">
            <q-rating class="q-py-md q-pb-lg primary" color="warning" v-model="userRating" :max="5" size="40px"/>
          </div>
          <textarea :placeholder="$t('what.about.experience')" v-model="userReview" class="full-width q-pa-md" rows="3"></textarea>
          <q-btn color="primary" :loading="saveReviewLoading" :disabled="saveReviewLoading || !userReview" class="q-ma-md" @click.native="sendReview()"> {{ $t('button.submit.review')}} </q-btn>
        </div>
      </div>
      <div class="col-xs-12 text-center" v-else>
        <ComponentPreLoader></ComponentPreLoader>
      </div>
    </div>
    <div class="col-xs-12 text-center" v-else>
      <ComponentPreLoader></ComponentPreLoader>
    </div>
    <q-dialog v-model="reviewModal" class="responsive-modal" transition-show="slide-up" transition-hide="slide-down" :maximized="mobileView" :content-css="{minWidth: '350px', minHeight: '200px'}">
      <q-card>
        <q-card-section class="text-center q-pa-lg">
          <h5>{{this.$t('review.us.too')}} ❤️</h5>
          <h6 class="text-left" v-if="reviewModalText === 'fb'">{{this.$t('review.modal.text.fb')}}</h6>
          <h6 class="text-left" v-if="reviewModalText === 'app'">{{this.$t('review.modal.text.app')}}</h6>
          <q-btn class="q-mb-sm q-mt-md q-mx-md primary bg-primary text-white" @click="openReviewLink()">
            {{$t('chat.reviewnow')}}
          </q-btn>
          <q-btn class="q-mb-sm q-mt-md q-mx-md primary bg-white text-grey full-width" flat @click="reviewModal = false">
            {{$t('chat.later')}}
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
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
    this.getSitterListing(this.$route.params.serviceUserId)
  },
  methods: {
    openReviewLink () {
      this.reviewModal = false
      window.open(this.reviewModalLink)
      this.$router.replace(this.$route.path + '/thank-you')
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

      let data = {}
      data.reviewInfo = {}
      data.reviewInfo.comment = this.userReview
      data.reviewInfo.rating = this.userRating
      data.reviewInfo.bizid = this.userServiceId

      if (!this.$store.state.user.access) {
        let COOKIE_EXPIRATION = 1
        this.$q.cookies.set('globalStorageReviewInfoUrl', this.$route.fullPath, {expires: COOKIE_EXPIRATION, path: '/'})
        this.$q.cookies.set('globalStorageReviewListingInfo', this.listingInfo, {expires: COOKIE_EXPIRATION, path: '/'})
        this.$q.cookies.set('globalReviewStatus', false, {expires: COOKIE_EXPIRATION, path: '/'})
        this.$router.replace({name: 'Signup'})
        return
      }

      data.accountInfo = this.$q.localStorage.getItem('globalStorageAccountInfo').accountInfo
      this.$axios.post(`listing/${this.userServiceId}/reviews`, JSON.stringify(data), {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.saveReviewLoading = false
        this.userReview = null
        this.$q.cookies.remove('globalStorageReviewInfoUrl')
        this.$q.cookies.remove('globalStorageReviewListingInfo')
        this.$q.cookies.remove('globalReviewStatus')
        this.$q.notify({
          message: this.$t('review.sent'),
          type: 'positive'
        })
        this.$q.cookies.set('globalReviewStatus', true, {expires: 1})
        if (response.data.reviewInfo.verified === 1 && response.data.reviewInfo.rating > 3) {
          this.openReviewModal()
        } else {
          this.$router.replace(this.$route.path + '/thank-you')
        }
      }).catch(e => {
        console.log(e)
        let errorMessage = this.$t('failed.send.review')
        if (e.response && e.response.data) {
          errorMessage = e.response.data.message
        }
        this.saveReviewLoading = false
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
        this.userReview = null
      })
    },
    unslugify (nameSlug) {
      let name = ''
      for (let index = 0; index < nameSlug.length; index++) {
        name += ' ' + nameSlug[index].charAt(0).toUpperCase() + nameSlug[index].substr(1)
      }
      return name
    },
    getSitterListing (userServiceId) {
      this.$axios.get(`listing/${userServiceId}`).then((response) => {
        if (!this.$store.state.user.access) {
          let COOKIE_EXPIRATION = 1
          let data = {
            'avatar': response.data.listingInfo.avatar,
            'biz_title': response.data.listingInfo.biz_title
          }
          // this.$q.cookies.set('globalStorageReviewInfoUrl', this.$route.fullPath, {expires: COOKIE_EXPIRATION, path: '/'})
          this.$store.commit('user/updateUserBackUrlState', this.$route.fullPath)
          this.$q.cookies.set('globalStorageReviewListingInfo', JSON.stringify(data), COOKIE_EXPIRATION)
          this.$q.cookies.set('globalReviewStatus', false, {expires: COOKIE_EXPIRATION, path: '/'})
          this.$router.replace({name: 'Signup'})
        } else {
          this.listingInfo = response.data.listingInfo
        }
      }).catch((error) => {
        console.error(error)
        this.$q.notify({message: 'Something went wrong! Try again later.', type: 'negative', position: 'top', timeout: 2000})
        this.$router.go(-1)
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
        this.$router.replace(this.$route.path + '/thank-you')
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
