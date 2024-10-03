<template>
  <q-page class="bg-grey-2">
    <q-pull-to-refresh @refresh="this.refresh" ref="pull-refresh">
      <moment-new-post ref="create-post" class="q-my-xs" @on-click="onCreateMoment" @trigger-dog-walk="$emit('trigger-dialog-pet-walk', true)" @refresh-moment="this.refresh"></moment-new-post>

      <!-- Filter -->
      <moment-filter-btn @filter-change="filterChange" :firstLoad="true" class="q-my-sm"></moment-filter-btn>

      <!-- Feed -->
      <q-infinite-scroll :offset="500" ref="infinite-scroll" style="height: 100%;overflow-y: hidden;" v-if="moments !== null" >
        <moment-card v-for="(moment, index) in moments" :key="moment.id" class="q-mb-md" style="border-radius: 15px;"
          :Id="moment.id"
          :index="index"
          :userInfo="moment.creator"
          :images="moment.medias"
          :type="moment.content_type"
          :timeCreated="moment.created_time"
          :title="moment.title || ''"
          :subTitle="moment.subtitle || ''"
          :description="moment.description ? moment.description : ''"
          :details="moment.detail"
          :share_url="moment.share_url"
          :commentCount="Number(moment.comment_count)"
          :loveCount="Number(moment.thumbs_up_count)"
          :liked="Boolean(Number(moment.liked))"
          @like-post="momentLike"
          @unlike-post="unlike"
          :sliderIndex="sliderIndexes[index]"
          @on-remove="onRemove"
          @on-block-moment="onBlockMoment"
          @trigger-login-signup="goTo">
        </moment-card>
        <template v-if="loader">
          <div class="justified text-center">
            <ComponentPreLoader></ComponentPreLoader>
          </div>
        </template>
      </q-infinite-scroll>
      <div v-else>
        <div v-if="noMomentsYet || (moments === null)" class="text-center q-mt-lg">
          <img class="image-upload" :src="'statics/images/no_notification.png'" width="50%"/>
          <p class="q-my-none q-mt-md font-normal q-px-lg">{{$t('moments.empty.message')}}</p>
          <q-btn color="primary" class="q-mt-lg" outline :label="$t('create.first.moment')" @click="goTo('CreateMoment')"></q-btn>
        </div>
        <div class="justified text-center" v-else>
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
            <q-skeleton width="100%" height="400px" class="q-my-xs"></q-skeleton>
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

      <!-- Back To Top Button -->
      <transition appear enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown" v-if="showScrollBackTop">
        <q-page-sticky position="bottom" :offset="[18, 18]">
          <q-btn rounded icon="arrow_upward" label="Back To Top" color="primary" class="text-capitalize" @click="scrollBackToTop"/>
        </q-page-sticky>
      </transition>
    </q-pull-to-refresh>
  </q-page>
</template>

<script>
import MomentCard from 'components/Moments/ComponentMomentCard.vue'
import momentMixin from '../../mixins/momentMixin.js'
import { debounce } from 'quasar'
export default {
  mixins: [momentMixin],
  components: {
    'moment-card': MomentCard,
    'moment-new-post': () => import('components/Moments/ComponentMomentNewPost.vue'),
    'moment-filter-btn': () => import('components/Moments/ComponentMomentFilter.vue')
  },
  data () {
    return {
      filterType: '0',
      sliderIndexes: [],
      items: [{}, {}, {}, {}, {}, {}],
      showScrollBackTop: false,
      previousScroll: 0,
      noMomentsYet: false
    }
  },
  created () {
    setTimeout(this.getMoments, 0)
    this.loadMoreMoments = debounce(this.loadMoreMoments, 400)
    this.scrollEvent = debounce(this.scrollEvent, 600)
  },
  mounted () {
    if (this.$refs['infinite-scroll']) {
      this.$refs['infinite-scroll'].stop()
    }

    this.$on('moments-loaded', this.onLoaded)

    if (this.$route.query.createPost === 1) {
      this.$route.query.createPost = 0

      setTimeout(() => {
        this.goTo('CreateMoment')
      }, 10)
    }

    this.$parent.$parent.$el.addEventListener('scroll', this.scrollEvent)
  },
  activated () {
    this.$parent.$parent.$el.scrollTo(0, 0)
    this.$parent.$parent.$el.addEventListener('scroll', this.scrollEvent)

    if (this.$route.query.createstory === 1) {
      setTimeout(() => {
        this.$refs['create-post'].triggerCreateStoryModal(true)
      }, 180)
    }
  },
  deactivated () {
    this.$parent.$parent.$el.removeEventListener('scroll', this.scrollEvent)

    if (this.$route.query.createstory && this.$route.query.createstory === 1) {
      this.$route.query.createstory = 0
    }
  },
  beforeDestroy () {
    this.$off('moments-loaded')
    this.$parent.$parent.$el.removeEventListener('scroll', this.scrollEvent)
  },
  methods: {
    scrollBackToTop () {
      this.$parent.$parent.$el.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    onRemove (index) {
      this.moments.splice(index, 1)

      if (this.momentType === 0) {
        this.$store.dispatch('cached/cacheMomentsPublic', this.moments)
      } else if (this.momentType === 1) {
        this.$store.dispatch('cached/cacheMomentsRelated', this.moments)
      }
    },
    onCreateMoment () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.$emit('trigger-login-signup', true, 'CreateMoment')
      }
    },
    goTo (routeName) {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.$emit('trigger-login-signup', true, routeName)
        return
      }

      if (routeName === 'CreateMoment') {
        this.$refs['create-post'].triggerCreateMomentModal(true)
      }

      //  this.$router.push({name: routeName})
    },
    onNewPost (postInfo) {
      // this.moments.unshift(postInfo)
      this.$refs['pull-refresh'].trigger()
    },
    onLoaded (status, requestType) {
      if (requestType === 'type=0' && this.momentType === 3) {
        return
      } else if (requestType === 'type=3' && this.momentType === 0) {
        return
      }

      if (status === 204) {
        this.noMomentsYet = true
      } else {
        this.noMomentsYet = false
      }
    },
    scrollEvent () {
      if ((this.$parent.$parent.$el.scrollTop > this.previousScroll) && this.$parent.$parent.$el.scrollTop >= 15000) {
        // downscroll
        this.showScrollBackTop = true
      } else {
        // upscroll
        this.showScrollBackTop = false
      }

      this.previousScroll = this.$parent.$parent.$el.scrollTop

      if (this.$store.getters['user/getUserCurrentMobileTab'] === 'navbar.moments' && this.$route.name === 'MobileDashboard') {
        if ((this.$parent.$parent.$el.scrollTop >= this.previousScroll) && this.$refs['infinite-scroll'] && (this.$parent.$parent.$el.scrollTop >= (this.$refs['infinite-scroll'].$el.clientHeight - 800))) {
          this.loadMoreMoments()
        }
      }
    },
    momentLike (momentId) {
      this.like(momentId)
    },
    filterChange (value) {
      this.loaded = false
      this.momentType = value

      this.getMoments()
    },
    slideFactory () {
      for (let i = 0; i < this.moments.length; i++) {
        this.sliderIndexes.push(0)
      }
    },
    async onBlockMoment () {
      await this.getMoments(true, true)
    }
  }
}
</script>

<style lang="stylus">
.svg-styling svg path
  transition: all 0.3s ease-in-out

.svg-styling svg
  position: relative
  z-index: 1
</style>
