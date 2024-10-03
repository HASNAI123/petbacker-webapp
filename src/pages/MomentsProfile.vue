<template>
  <div class="bg-grey-2">
    <q-scroll-observer @scroll="onScroll" />
    <q-page :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}" class="margin-auto q-pt-md">
      <q-pull-to-refresh @refresh="this.refresh">
        <!-- Mobile -->
        <div v-if="$q.platform.is.mobile">
          <div v-if="momentsInfo === 'EMPTY'" class="text-center q-mt-lg">
            <img class="image-upload" :src="'statics/images/no_notification.png'" width="50%"/>
            <p class="q-my-none q-mt-md font-normal q-px-lg">{{$t('moments.empty.message')}}</p>
            <q-btn color="primary" class="q-mt-lg" outline :label="$t('create.first.moment')" @click="onCreateFirstMoment"></q-btn>
          </div>
          <div v-else-if="momentsInfo">
            <!-- Feed -->
            <moment-card v-for="(moment, index) in this.momentsInfo" :key="moment.id" class="q-mb-lg" style="border-radius: 15px;"
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

            <!-- Back To Top Button -->
            <q-page-scroller position="bottom" :scroll-offset="14000" :offset="[18, 18]">
              <q-btn rounded icon="arrow_upward" label="Back To Top" color="primary" class="text-capitalize"/>
            </q-page-scroller>

            <p class="q-py-lg"><!-- Spacing --></p>
          </div>
          <div class="justified text-center" ref="preLoader" v-else>
              <ComponentPreLoader></ComponentPreLoader>
              <q-card class="card-styling q-my-lg svg-styling" v-for="(item, index) in this.items" :key="index" bordered>
                <q-card-section>
                  <q-item>
                    <q-item-section avatar>
                      <q-skeleton size="50px" class="q-my-xs" type="QAvatar"></q-skeleton>
                    </q-item-section>

                    <q-item-section>
                        <q-skeleton width="220px" height="10px" class="q-my-xs"></q-skeleton>
                        <q-skeleton width="70px" height="10px" class="q-my-xs"></q-skeleton>
                    </q-item-section>
                  </q-item>

                  <q-skeleton width="200px" height="10px" class="q-my-sm"></q-skeleton>
                  <q-skeleton width="340px" height="10px" class="q-my-sm"></q-skeleton>
                </q-card-section>
                <q-skeleton width="590px" height="400px" class="q-my-xs"></q-skeleton>
                <q-card-actions class="text-grey" align="around">
                  <q-btn flat icon="far fa-heart" :ripple="false">
                    <span class="text-capitalize q-ml-sm">{{0}}</span>
                  </q-btn>
                  <q-btn flat icon="far fa-comment-dots" :ripple="false">
                    <span class="text-capitalize q-ml-sm">{{0}}</span>
                  </q-btn>
                  <q-btn flat icon="fas fa-share" :ripple="false">
                    <span class="text-capitalize q-ml-sm">{{$t('share')}}</span>
                  </q-btn>
                </q-card-actions>
              </q-card>
          </div>
        </div>
        <!-- Desktop -->
        <div v-else-if="$q.platform.is.desktop" style="display:flex;" class="row q-mt-md">
          <!-- Filter and user's bio (left column) -->
          <div class="col-md-4 col-xs-12 q-mb-lg q-ml-lg">
            <q-item class="q-mb-md">
              <q-item-section avatar>
                <q-avatar>
                  <img :src="profileInfo.avatarImage" class="responsive profile-img">
                </q-avatar>
              </q-item-section>
              <q-item-section>{{profileInfo.username}}</q-item-section>
            </q-item>
          </div>
          <!-- Feed (right column)-->
          <div class="col-md-7 q-ml-lg">
            <div v-if="momentsInfo">
                <moment-card v-for="(moment, index) in momentsInfo" :key="moment.id" class="q-my-lg"
                  :Id="moment.id"
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
            <div class="justified text-center" ref="preLoader" v-else>
              <ComponentPreLoader></ComponentPreLoader>
              <q-card class="card-styling q-my-lg svg-styling" v-for="(item, index) in this.items" :key="index" bordered>
                <q-card-section>
                  <q-item>
                    <q-item-section avatar>
                      <q-skeleton size="50px" class="q-my-xs" type="QAvatar"></q-skeleton>
                    </q-item-section>

                    <q-item-section>
                        <q-skeleton width="220px" height="10px" class="q-my-xs"></q-skeleton>
                        <q-skeleton width="70px" height="10px" class="q-my-xs"></q-skeleton>
                    </q-item-section>
                  </q-item>

                  <q-skeleton width="200px" height="10px" class="q-my-sm"></q-skeleton>
                  <q-skeleton width="340px" height="10px" class="q-my-sm"></q-skeleton>
                </q-card-section>
                <q-skeleton width="590px" height="400px" class="q-my-xs"></q-skeleton>
                <q-card-actions class="text-grey" align="around">
                    <q-btn flat icon="far fa-heart" :ripple="false">
                      <span class="text-capitalize q-ml-sm">{{0}}</span>
                    </q-btn>
                    <q-btn flat icon="far fa-comment-dots" :ripple="false">
                      <span class="text-capitalize q-ml-sm">{{0}}</span>
                    </q-btn>
                    <q-btn flat icon="fas fa-share" :ripple="false">
                      <span class="text-capitalize q-ml-sm">{{$t('share')}}</span>
                    </q-btn>
                </q-card-actions>
              </q-card>
            </div>

            <!-- Back To Top Button :scroll-offset="15000"-->
            <q-page-sticky position="bottom" v-if="showScrollBackTop" :offset="[18, 18]" class="desktop-backtotop">
              <q-btn rounded icon="arrow_upward" label="Back To Top" color="primary" class="text-capitalize"/>
            </q-page-sticky>
          </div>
        </div>
      </q-pull-to-refresh>
    </q-page>
  </div>
</template>

<script>
import momentMixin from '../mixins/momentMixin.js'

export default {
  mixins: [momentMixin],
  components: {
    'moment-card': () => import('components/Moments/ComponentMomentCard.vue'),
    'moment-new-post': () => import('components/Moments/ComponentMomentNewPost.vue'),
    'moment-filter-btn': () => import('components/Moments/ComponentMomentFilter.vue')
  },
  data () {
    return {
      filterType: '0',
      sliderIndexes: [],
      items: [{}, {}, {}, {}, {}, {}],
      showScrollBackTop: false,
      momentsInfo: null,
      profileInfo: null
    }
  },
  created () {
    if (this.$route.params.userId !== 0) {
      //  this.getProfileInfo()
      this.getUserMoments()
    } else {
      this.momentsInfo = 'EMPTY'
    }
  },
  methods: {
    onCreateFirstMoment () {
      this.$store.commit('user/updateUserCurrentMobileTab', 'navbar.moments')
      this.$router.replace({name: 'MobileDashboard', query: {createPost: 1}})
    },
    onScroll (info) {
      if (info.direction === 'down' && info.position >= 15000) {
        this.showScrollBackTop = true
      } else if (info.direction === 'up') {
        this.showScrollBackTop = false
      }
    },
    // getProfileInfo () {
    //   this.$axios.get(`users/${this.$route.params.userId}`, {
    //     headers: {
    //       Authorization: this.$store.getters['user/authorizationHeader']
    //     }
    //   }).then((response) => {
    //     this.profileInfo = response.data.accountInfo
    //   }).catch((error) => {
    //     console.error(error)
    //   })
    // },
    getUserMoments () {
      this.$axios.get(`moments/search/${this.$route.params.userId}?refresh=1`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status === 204) {
          this.momentsInfo = 'EMPTY'
        } else {
          this.momentsInfo = response.data
        }
      }).catch((error) => {
        console.error(error)
        this.forceLogout(error)
      })
    },
    momentLike (momentId) {
      this.like(momentId)
    },
    sliderUpdate (value) {
      // dummy function
    },
    slideFactory () {
      for (let i = 0; i < this.moments.length; i++) {
        this.sliderIndexes.push(0)
      }
    }
  }
}
</script>

<style lang="stylus">
.desktop-backtotop div.q-page-sticky
  margin-left: 22% !important

.svg-styling svg path
  transition: all 0.3s ease-in-out

.svg-styling svg
  position: relative
  z-index: 1

.card-styling
  box-shadow: none
</style>
