<template>
    <q-page class="q-mb-xl q-pb-lg q-mt-sm margin-auto" :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}" >
        <div>
            <q-item v-if="profileInfo">
                <!-- User's Profile Picture -->
                <q-item-section avatar class="q-pr-sm" @click="onSelectProfilePicture">
                  <q-avatar style="height: 73px; width: 73px;">
                    <img :src="profileInfo.avatarImage" class="image-upload"/>

                    <!-- Edit Label -->
                    <!-- <div class="absolute-bottom text-center" v-if="showEdit">
                      <q-item dense class="q-pa-none" style="background-color:rgba(255, 255, 255, 0.7);">
                        <q-item-section class="q-pa-none">
                          <q-item-label class="font-small q-pa-none q-my-none">Edit</q-item-label>
                        </q-item-section>
                      </q-item>
                    </div> -->
                  </q-avatar>
                </q-item-section>

                <!-- User's Info -->
                <q-item-section class="q-ml-sm">

                    <!-- User's Name and Review Info -->
                    <q-item-label lines="1">
                      <h6 class="q-my-none text-capitalize">{{profileInfo.username}}</h6>
                    </q-item-label>

                    <!-- Lives Where -->
                    <q-item-label v-if="profileInfo" class="text-weight-light" style="margin-top: 0px;"> {{$t('lives.in')}} {{getCountryName(profileInfo.mobileCountryId)}}</q-item-label>

                    <!-- Joined Date -->
                    <!-- <q-item-label class="text-weight-light text-grey-6">{{formatJoinedDate(profileInfo.createdDate)}}</q-item-label> -->

                    <!-- Following Button -->
                    <q-item-label style="margin-top: 8px;" v-if="profileInfo.id !== $store.getters['user/getUserUuidState']">
                      <q-btn v-if="following" :loading="followLoader" :label="$t('following')" outline size="sm" color="primary" class="text-capitalize q-px-xl" @click="onUnfollow"></q-btn>
                      <q-btn v-else :loading="followLoader" :label="followed ? $t('follow.back') : $t('follow')" size="sm" color="primary" class="text-capitalize q-px-xl" @click="onFollow"></q-btn>
                    </q-item-label>
                </q-item-section>
            </q-item>
            <q-item v-else>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" size="70px"></q-skeleton>
              </q-item-section>
              <q-item-section>
                <q-skeleton width="150px" height="20px" class="q-my-xs"></q-skeleton>
                <q-skeleton width="140px" height="15px" class="q-my-xs"></q-skeleton>
                <q-skeleton width="155px" height="25px" class="q-my-xs"></q-skeleton>
              </q-item-section>
            </q-item>
        </div>

        <!-- Followers and review count -->
        <div class="row justify-center q-my-md font-normal" v-if="profileInfo ">
          <div class="col text-center" @click="triggerFollowersModal(true, 'followers')">
            <p class="q-my-none text-grey">{{$t('followers')}}</p>
            <p class="q-my-none font-medium-title text-secondary">{{profileInfo.followedCount || 0}}</p>
          </div>

          <div class="col text-center" @click="triggerFollowersModal(true, 'followings')">
            <p class="q-my-none text-grey">{{$t('followings')}}</p>
            <p class="q-my-none font-medium-title text-secondary">{{profileInfo.followingCount || 0}}</p>
          </div>

          <div class="col text-center" @click="openReviewModal">
            <p class="q-my-none text-grey">{{$t('reviews.title')}}</p>
            <p class="q-my-none font-medium-title text-secondary">{{profileInfo.reviewInfo.reviewCount}}</p>
            <p class="q-my-none text-weight-light font-x-small text-secondary" v-if="profileInfo  && (profileInfo.rating >= 4) && profileInfo.reviewInfo.items.length > 0">
              <q-icon name="fas fa-star" class="star-color" size="9px"></q-icon>
              {{profileInfo.rating.toFixed(1)}}
            </p>
          </div>
        </div>

        <q-separator class="q-mb-md q-mt-sm" inset></q-separator>
        <!-- Badges -->
        <div v-if="profileInfo">
          <h6 class="q-my-none q-mb-xs q-mx-lg">{{$t('badges')}}</h6>
          <badges-component :userInfo="profileInfo" class="q-mt-sm q-mx-md"></badges-component>
        </div>
        <div v-else>
          <h6 class="q-my-none q-mb-xs q-mx-lg">{{$t('badges')}}</h6>
          <div class="row q-mx-lg">
            <q-skeleton size="50px" class="q-my-xs q-mx-xs col-3" type="circle"></q-skeleton>
            <q-skeleton size="50px" class="q-my-xs q-mx-xs col-3" type="circle"></q-skeleton>
            <q-skeleton size="50px" class="q-my-xs q-mx-xs col-3" type="circle"></q-skeleton>
            <q-skeleton size="50px" class="q-my-xs q-mx-xs col-3" type="circle"></q-skeleton>
            <q-skeleton size="50px" class="q-my-xs q-mx-xs col-3" type="circle"></q-skeleton>
            <q-skeleton size="50px" class="q-my-xs q-mx-xs col-3" type="circle"></q-skeleton>
          </div>
        </div>

        <q-separator class="q-my-lg" inset></q-separator>

        <!-- About -->
        <div class="q-mx-lg" >
            <h6 class="q-my-none">{{$t('about')}}</h6>
            <p class="q-my-none font-normal" v-if="profileInfo" v-html="profileInfo.aboutMeHtml"></p>
            <div v-else>
              <q-skeleton width="270px" height="15px" class="q-my-xs"></q-skeleton>
              <q-skeleton width="200px" height="15px" class="q-my-xs"></q-skeleton>
              <q-skeleton width="240px" height="15px" class="q-my-xs"></q-skeleton>
            </div>
        </div>

        <q-separator class="q-my-lg" inset style="max-width: 30px;"></q-separator>

        <!-- Location, Language, Number of Pets -->
        <div class="q-mx-lg text-grey">
            <!-- Live location -->
            <q-item dense v-if="profileInfo && getCountryName(profileInfo.mobileCountryId) !== 'N/A' && !$store.getters['user/getUserEmail']">
                <q-item-section thumbnail>
                    <q-icon name="fas fa-home" size="16px"></q-icon>
                </q-item-section>
                <q-item-section>
                    <q-item-label v-if="profileInfo.mobileCountryId">{{$t('lives.in')}} {{getCountryName(profileInfo.mobileCountryId)}}</q-item-label>
                    <div v-else>
                      <q-skeleton width="120px" height="15px" class="q-my-xs"></q-skeleton>
                    </div>
                </q-item-section>
            </q-item>

            <!-- Number of pets -->
            <q-item dense v-if="profileInfo && profileInfo.id === $store.getters['user/getUserUuidState'] && $store.getters['cached/getPersonalItemsCached'] && $store.getters['cached/getPersonalItemsCached'].items && $store.getters['cached/getPersonalItemsCached'].items.length > 0">
                <q-item-section thumbnail>
                    <q-icon name="fas fa-paw" size="16px"></q-icon>
                </q-item-section>
                <q-item-section>
                    <q-item-label v-if="profileInfo && profileInfo.id === $store.getters['user/getUserUuidState'] && ($store.getters['cached/getPersonalItemsCached'] && $store.getters['cached/getPersonalItemsCached'].items && $store.getters['cached/getPersonalItemsCached'].items.length > 0)">{{$store.getters['cached/getPersonalItemsCached'].items.length}} Pet(s)</q-item-label>
                    <q-item-label v-else-if="profileInfo && profileInfo.id === $store.getters['user/getUserUuidState']">0 Pets</q-item-label>
                    <div v-else>
                      <q-skeleton width="70px" height="15px" class="q-my-xs"></q-skeleton>
                    </div>
                </q-item-section>
            </q-item>
        </div>

        <q-separator class="q-my-md" inset></q-separator>

        <!-- User's Listings -->
        <div v-if="!listingIsEmpty" >
          <h6 class="q-mx-lg q-my-none q-mt-lg q-mb-md" v-if="profileInfo">{{profileInfo.username}}'s Listings
            <!-- <div class="float-right q-my-none text-primary" style="font-weight: 400;">
                <q-icon name="chevron_right" size="23px"></q-icon>
            </div> -->
          </h6>
          <div class="row no-wrap q-px-md justify-left hide-scrollbar" style="height: 230px;overflow: auto;" >
            <!-- TODO: Include isFavorite flag in listing cards -->
            <!-- Listing Cards-->
            <listing-card class="col-md-3 col-xs-12 q-ml-sm backer-listing" style="height: 230px;" v-for="(listing, index) in listingsInfo" :key="index" :index="index" :listingInfo="listing"></listing-card>
          </div>
        </div>

        <!-- User's Moments -->
        <div class="q-mx-lg q-mt-md" v-if="momentsInfo && momentsInfo.length > 0">
          <h6 class="q-my-none q-mb-md">{{$t('navbar.moments')}}
            <div class="float-right q-my-none text-primary" style="font-weight: 400;" @click="$router.push({name: 'MomentsProfile', params: {userId: $route.params.userId}})">
                <q-icon name="chevron_right" size="23px"></q-icon>
            </div>
          </h6>
          <div class="row">
            <moment-card v-for="(moment, index) in momentsInfo" :key="moment.id" :class="{'q-mr-md': $q.platform.is.desktop}" :style="{'width': $q.platform.is.desktop ? '469px' : ''}" class="q-mb-lg col-md-5 col-xs-12" style="border-radius: 15px;"
              :Id="moment.id"
              :index="index"
              :userInfo="moment.creator"
              :images="moment.medias"
              :type="moment.content_type"
              :timeCreated="moment.created_time"
              :title="moment.title"
              :subTitle="moment.subtitle"
              :description="moment.description ? moment.description : ''"
              :details="moment.detail"
              :share_url="moment.share_url"
              :commentCount="Number(moment.comment_count)"
              :loveCount="Number(moment.thumbs_up_count)"
              :liked="Boolean(Number(moment.liked))"
              @like-post="momentLike"
              @unlike-post="unlike"
              :sliderIndex="sliderIndexes[index]"
              @slider-change="sliderUpdate">
            </moment-card>
          </div>
          <q-btn :label="$t('view.all.moments')" class="text-capitalize full-width text-weight-bold q-py-sm q-mb-sm" @click="$router.push({name: 'MomentsProfile', params: {userId: $route.params.userId}})" style="border-radius: 11px;" outline color="secondary"></q-btn>
        </div>

        <q-separator class="q-my-lg" inset v-if="momentsInfo && momentsInfo.length > 0"></q-separator>

        <!-- User's Reviews -->
        <div v-if="profileInfo && profileInfo.reviewInfo.items.length > 0" ref="reviews">
          <h6 class="q-my-none q-mx-lg q-mb-md">{{profileInfo.reviewInfo.reviewCount}} {{$t('reviews.title')}}
            <div class="float-right q-my-none text-primary" style="font-weight: 400;" @click="reviewModal = true">
              <q-icon name="chevron_right" size="23px"></q-icon>
            </div>
          </h6>
          <div v-for="index in (profileInfo.reviewInfo.reviewCount < 5 ? profileInfo.reviewInfo.reviewCount : 5)" :key="index">
            <review-card :reviewInfo="profileInfo.reviewInfo" :index="index" class="q-mb-lg" hideSeparator></review-card>
          </div>
          <div class="q-mx-lg" v-if="profileInfo.reviewInfo.reviewCount > 5">
            <q-btn :label="$t('view.all.reviews')" class="text-capitalize full-width text-weight-bold q-py-sm q-mb-sm" @click="reviewModal = true" style="border-radius: 11px;" outline color="secondary"></q-btn>
          </div>
        </div>
        <p class="q-py-md"></p>

        <!-- Dialog Followers/Followings -->
        <dialog-following-followers v-if="profileInfo" ref="dialog-follows" :trigger="modalFollowers" :active="activeTab" :userUuid="$route.params.userId" :followersCount="profileInfo.followedCount" :followingsCount="profileInfo.followingCount" @update-followings-count="updateFollowingsCount" @on-close="triggerFollowersModal"></dialog-following-followers>
        <!-- Review Dialog -->
        <dialog-reviews v-if="profileInfo" :trigger="reviewModal" :reviewInfo="profileInfo.reviewInfo" @on-close="closeReviewModal"></dialog-reviews>

    </q-page>
</template>
<script>
import moment from 'moment'
import countries from 'assets/countries.json'
import momentMixin from '../mixins/momentMixin.js'

export default {
  mixins: [momentMixin],
  components: {
    'badges-component': () => import('components/Listing/Badges.vue'),
    'listing-card': () => import('components/Explore/listingCards.vue'),
    'review-card': () => import('components/Listing/reviewCards.vue'),
    'dialog-reviews': () => import('components/Listing/DialogReviews.vue'),
    'dialog-following-followers': () => import('components/Profile/DialogFollowingFollowers.vue'),
    'moment-card': () => import('components/Moments/ComponentMomentCard.vue')
  },
  data () {
    return {
      profileInfo: null,
      listingsInfo: [{}, {}, {}, {}, {}, {}],
      momentsInfo: [],
      sliderIndexes: [],
      reviewModal: false,
      listingIsEmpty: false,
      listingLoaded: false,
      showEdit: false,
      followLoader: false,
      following: false,
      followed: false,
      modalFollowers: false,
      activeTab: ''
    }
  },
  created () {
    this.getProfileInfo()
    this.getUserListings()
    this.getUserMoments()
  },
  methods: {
    updateFollowersCount (status) {
      if (status) {
        // increment
        this.profileInfo.followedCount += 1
      } else {
        // decrement
        this.profileInfo.followedCount -= 1
      }
    },
    updateFollowingsCount (status) {
      if (status) {
        // increment
        this.profileInfo.followingCount += 1
      } else {
        // decrement
        this.profileInfo.followingCount -= 1
      }
    },
    openReviewModal () {
      // prevent self with empty reviews from opening
      if (this.profileInfo.id === this.$store.getters['user/getUserUuidState'] && this.profileInfo.reviewInfo.items.length === 0) {
        return
      }

      this.reviewModal = true
    },
    triggerFollowersModal (status, tab = '') {
      this.activeTab = tab
      this.modalFollowers = status
    },
    onUnfollow () {
      this.followLoader = true
      this.$axios.delete(`moments/user/${this.$route.params.userId}/follow`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.following = false
        this.updateFollowersCount(this.following)
        this.$refs['dialog-follows'].getFollowers()
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        this.followLoader = false
      })
    },
    onFollow () {
      this.followLoader = true
      this.$axios.post(`moments/user/${this.$route.params.userId}/follow`, {}, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.following = true
        this.updateFollowersCount(this.following)
        this.$refs['dialog-follows'].getFollowers()
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        this.followLoader = false
      })
    },
    onSelectProfilePicture () {
      if (this.$route.params.userId === this.$store.getters['user/getUserUuidState']) {
        this.$router.push({name: 'EditProfile', params: {userId: this.$route.params.userId}})
      }
    },
    scrollTo (refName) {
      window.scrollBy({
        top: this.$refs[refName].offsetTop,
        behavior: 'smooth'
      })
    },
    closeReviewModal (status) {
      this.reviewModal = status
    },
    getCountryName (countryId) {
      let countryInfo = this.$_.findWhere(countries, {'id': countryId.toString()})
      if (countryInfo) {
        return countryInfo.shortName
      }

      return 'N/A'
    },
    formatJoinedDate (joinedDate) {
      return `Joined in ${moment.utc(joinedDate).local().format('MMMM, YYYY')}`
    },
    getProfileInfo () {
      if (this.$route.params.userId === this.$store.getters['user/getUserUuidState']) {
        this.showEdit = true
      }

      this.$axios.get(`users/${this.$route.params.userId}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.profileInfo = response.data.accountInfo
        this.following = response.data.accountInfo.isFollowing
        this.followed = response.data.accountInfo.isFollowed
      }).catch((error) => {
        console.error(error)
      })
    },
    getUserListings () {
      this.$axios.get(`users/${this.$route.params.userId}/services`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status === 204 || response.data.serviceInfo.services.length === 0) {
          this.listingIsEmpty = true
        } else {
          this.listingsInfo = response.data.serviceInfo.services
          this.listingsInfo.map((service) => {
            service['userInfo'] = {
              id: this.$route.params.userId
            }
          })
        }
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        this.listingLoaded = true
      })
    },
    getUserMoments () {
      this.$axios.get(`moments/search/${this.$route.params.userId}?refresh=1&per_page=2`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.momentsInfo = response.data
      }).catch((error) => {
        console.error(error)
      })
    },
    slideFactory () {
      for (let i = 0; i < this.moments.length; i++) {
        this.sliderIndexes.push(0)
      }
    },
    momentLike (momentId) {
      this.like(momentId)
    },
    sliderUpdate (value) {
      // dummy function
    }
  }
}
</script>
