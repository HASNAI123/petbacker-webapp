<template>
  <div>
    <q-page class="margin-auto" :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}" style="min-height: 100%;">
      <q-pull-to-refresh @refresh="refreshJobsPage" :scroll-target="$parent.$parent">
        <div :style="{'min-height': $q.platform.is.mobile ? '190px;' : '330px'}">
          <img src="statics/images/Jobs-Center.jpg" v-if="$q.platform.is.mobile" height="190px" width="100%" style="object-fit:cover;" loading="lazy" decoding="async"/>
          <img src="statics/images/Jobs-Center-desktop.jpg" v-else height="330px" width="100%" style="max-height:auto;object-fit:cover;" />
        </div>

        <!-- Tabs -->
        <q-card style="border-radius: 10px;" class="job-card-position">
            <q-card-section class="q-pb-sm q-pt-none q-px-sm text-center row text-primary">
                <div class="col-md-3 col-xs-3 q-mx-sm" style="width: 54px;">
                    <div class="q-px-sm selected-button" style="border-radius:50px;height:45px;margin-top: 10%;">
                      <q-icon name="fas fa-clipboard-list" style="margin-top: 23%;" size="30px"></q-icon>
                    </div>
                    <p class="font-x-small text-primary q-my-none font-x-small" style="line-height: 1.2em;">{{$t('job.lists')}}</p>
                </div>
                <div class="col-md-3 col-xs-3 q-mx-sm" style="width: 61px;" @click="goTo('JobCalendar')">
                    <div class="q-px-xs q-pt-sm" style="border-radius:50px;height:50px;">
                        <q-icon name="img:statics/icons/custom-icon/calendar.png" size="35px"></q-icon>
                    </div>
                    <p class="font-x-small text-primary q-my-none font-x-small" style="line-height: 1.2em;">{{$t('calendar')}}</p>
                </div>
                <div class="col-md-3 col-xs-3 q-mr-sm q-ml-xs" style="width: 56px;" @click="$emit('trigger-dialog-pet-walk', true)">
                    <div class="q-px-xs q-pt-sm" style="border-radius:50px;height:50px;">
                        <q-icon name="fas fa-paw" style="margin-top: 10%;" size="30px"></q-icon>
                    </div>
                    <p class="font-x-small text-primary q-my-none font-x-small" style="line-height: 1.2em;">{{$t('dog.walk')}}</p>
                </div>
                <!-- <div class="col-md-3 col-xs-3 q-mr-sm q-ml-xs" style="width: 56px;" @click="futureUpdateModal = true">
                    <div class="q-px-xs q-pt-sm" style="border-radius:50px;height:50px;">
                        <q-icon name="fas fa-paw" style="margin-top: 10%;" size="30px"></q-icon>
                    </div>
                    <p class="font-x-small text-primary q-my-none font-x-small">{{$t('dog.walk')}}</p>
                </div> -->
                <!-- <div class="col-md-3 col-xs-3 q-mx-xs" style="width: 65px;" @click="goTo('AccountHistory')">
                    <div class="q-px-xs q-pt-sm" style="border-radius:50px;height:50px;">
                        <q-icon name="img:statics/icons/custom-icon/finance.png" size="35px"></q-icon>
                    </div>
                    <p class="font-x-small text-primary q-my-none font-x-small" style="line-height: 1.2em;">{{$t('finance')}}</p>
                </div> -->
                <div class="col-md-3 col-xs-3 q-mx-xs" style="width: 64px;" @click="goTo('JobsHelp')">
                  <div class="q-px-xs q-pt-sm" style="border-radius:50px;height:50px;">
                      <q-icon name="img:statics/icons/custom-icon/help-center.png" size="35px"></q-icon>
                  </div>
                  <p class="font-x-small text-primary q-my-none font-x-small" style="line-height: 1.2em;">{{$t('navbar.help')}}</p>
              </div>
            </q-card-section>
        </q-card>

        <!-- Job Search -->
        <div class="q-mt-md" v-if="emptyResults || (jobs && jobs.length > 0) || $store.getters['user/getServiceProvider'] !== false">
          <job-search ref="job-search-bar" :class="$q.platform.is.mobile ? 'q-mx-lg' : ''" @on-search="onSearch" @on-reset="onResetSearch"></job-search>
          <job-filter ref="job-status-bar" class="q-mt-sm" @status-changed="onChangeStatus"></job-filter>
        </div>

        <!-- Job lists -->
        <div class="q-mt-xs">
          <div ref="job-infinite-scroll">
            <div v-if="jobs && jobs.length > 0">
              <job-card class="q-my-md" :class="$q.platform.is.mobile ? 'q-mx-lg' : ''"
              v-for="(job, index) in jobs" :key="job.id"
              :jobInfo="job"
              :index="index"
              :edit="editMode"
              @on-open="onOpen"
              @on-decline="onDecline"
              @on-remove="onRemove"
              @on-refresh="onRefresh"
              @on-mark-job-complete="updateTasksList"
              @on-edit="triggerEdit"
              @on-selected="onEditSelected"
              @on-deselected="onEditDeselected"
              @on-first-quote="onFirstQuote"></job-card>
            </div>
            <div v-else-if="emptyResults">
              <div class="q-my-lg" :class="$q.platform.is.mobile ? 'q-mx-lg' : ''">
                <p class="text-grey text-center">{{$t('empty.result.job.search', {status: searchInfo.searchKeyword !== '' ? (searchInfo.statusType) : ''})}}<br/>{{$t('try.again.later')}}</p>
              </div>
            </div>
            <div v-else-if="jobsLoaded && jobs.length === 0">
              <div class="q-my-lg text-center " :class="$q.platform.is.mobile ? 'q-mx-lg' : ''" v-if="$store.getters['user/getServiceProvider'] === false">
                <img src="statics/images/logo-mid.jpg" class="image-upload q-mb-md" width="25%"/>
                <p>{{$t('sign.up.as.sitter.job.center')}}</p>
                <q-btn color="primary" outline :label="$t('offer.service.now')" @click="goTo('OfferService')"></q-btn>
              </div>
              <div class="q-my-lg" :class="$q.platform.is.mobile ? 'q-mx-md' : ''" v-else>
                <p class="text-grey text-center">{{$t('no.jobs.available', {status: searchInfo.searchKeyword !== '' ? (searchInfo.statusType) : ''})}}<br/>{{$t('come.back.check.again.later')}}</p>
              </div>
            </div>
            <template>
              <div class="row justify-center q-my-md" v-if="!stopInfiniteScroll">
                <ComponentPreLoader></ComponentPreLoader>
              </div>
            </template>
          </div>
          <p class="q-py-md"></p>
        </div>
      </q-pull-to-refresh>
    </q-page>

    <!-- Future Updates Dialog -->
    <dialog-future-update :trigger="futureUpdateModal" :message="$t('dog.walking.better.experience')" @on-close="onCloseFutureUpdateModal"></dialog-future-update>
   </div>
</template>
<script>
import { debounce } from 'quasar'
export default {
  components: {
    'job-card': () => import('components/JobCenter/JobCard.vue'),
    'job-search': () => import('components/JobCenter/Search.vue'),
    'job-filter': () => import('components/JobCenter/Filter.vue'),
    'dialog-petwalkselection': () => import('components/DogWalk/DialogPetWalkSelection.vue'),
    'dialog-future-update': () => import('components/DialogFutureUpdate.vue')
  },
  data () {
    return {
      jobs: [],
      searchInfo: {
        searchKeyword: null,
        keywordFilter: null,
        filterType: 'All',
        serviceType: null,
        statusType: null
      },
      emptyResults: false,
      loaded: false,
      jobsLoaded: true,
      currentPage: 1,
      noMore: false,
      firstLoad: false,
      showLoader: false,
      onNewSearchStatus: false,
      futureUpdateModal: false,
      stopInfiniteScroll: false,
      blockLoading: false,
      selectedJob: [],
      selectedIndexJob: [],
      editMode: false
    }
  },
  created () {
    if (this.$store.getters['cached/getJobsCached']) {
      this.jobs = this.$store.getters['cached/getJobsCached']
    }

    // update message inbox tab to allow better UX flow
    // user clicking to inbox from here expects to see jobs inbox
    this.$store.commit('user/updateMessageTabIndexState', 'tab-jobs')

    this.loadMoreJobs = debounce(this.loadMoreJobs, 600)
    this.scrollEvent = debounce(this.scrollEvent, 1000)
  },
  mounted () {
    this.loaded = true

    this.$parent.$parent.$el.addEventListener('scroll', this.scrollEvent)
  },
  activated () {
    this.$parent.$parent.$el.scrollTo(0, 0)

    if (this.$store.getters['search/getJobSearchCachedId']) {
      setTimeout(() => { this.getJobCacheById() }, 0)
    } else {
      this.searchInfo = {
        searchKeyword: null,
        keywordFilter: null,
        filterType: 'All',
        serviceType: null,
        statusType: null
      }

      if (this.$refs['job-search-bar']) {
        this.$refs['job-search-bar'].clearSearch()
      }

      setTimeout(() => { this.getJobs() }, 0)

      this.$parent.$parent.$el.addEventListener('scroll', this.scrollEvent)
    }
  },
  deactivated () {
    this.$parent.$parent.$el.removeEventListener('scroll', this.scrollEvent)

    // reset search bar when result is empty or when changing to different tabs
    if (this.$route.name === 'MobileDashboard' || this.$route.name === 'Messages' || (this.emptyResults && this.$refs['job-search-bar'])) {
      this.$store.commit('search/updateJobSearchCachedId', null)
      if (this.$refs['job-search-bar']) {
        this.$refs['job-search-bar'].clearSearch()
      }
      this.onClear()
    }

    this.$store.commit('user/updateJobFilter', null)
  },
  beforeDestroy () {
    this.$parent.$el.removeEventListener('scroll', this.scrollEvent)
    this.triggerEdit(false)
  },
  methods: {
    triggerEdit (status) {
      this.editMode = status
      this.$emit('edit-mode', status)

      if (status === false) {
        this.selectedJob = []
        this.selectedIndexJob = []
        this.$emit('edit-selected', this.selectedJob)
      }
    },
    onEditSelected (jobId, index) {
      this.selectedJob.push(jobId)
      this.selectedIndexJob.push(index)

      this.$emit('edit-selected', this.selectedJob)
    },
    onEditDeselected (jobId) {
      let index = this.selectedJob.indexOf(jobId)
      if (index > -1) {
        this.selectedJob.splice(index, 1)
        this.selectedIndexJob.splice(index, 1)
      }

      this.$emit('edit-selected', this.selectedJob)
    },
    getJobCacheById () {
      this.$store.dispatch('search/getJobSearchById', this.$store.getters['search/getJobSearchCachedId']).then((data) => {
        this.jobs = JSON.parse(data.content)
        this.searchInfo = {
          searchKeyword: data.keyword_filter === 'null' ? null : data.keyword_filter,
          keywordFilter: data.keyword_filter_type === 'null' ? null : data.keyword_filter_type,
          filterType: data.filter_type === 'null' ? null : data.filter_type,
          serviceType: data.service_type === 'null' ? null : data.service_type,
          statusType: data.status_type === 'null' ? null : data.status_type
        }
        this.onNewSearchStatus = true

        if (this.$refs['job-search-bar']) {
          this.$refs['job-search-bar'].prefilledSearch(this.searchInfo)
          this.$refs['job-status-bar'].prefilledFilter(this.searchInfo.statusType)
        }
      }).catch((error) => {
        console.error(error)
      })
    },
    onClear () {
      this.stopInfiniteScroll = false
      this.onNewSearchStatus = false
      this.emptyResults = false
      this.noMore = false
      this.searchInfo = {
        searchKeyword: null,
        keywordFilter: null,
        filterType: 'All',
        serviceType: null,
        statusType: null
      }
      this.currentPage = 1
      if (this.$store.getters['cached/getJobsCached']) {
        this.jobs = this.$store.getters['cached/getJobsCached']
      } else {
        this.jobs = []
      }
    },
    loadMoreJobs (index, done) {
      if (this.stopInfiniteScroll || this.blockLoading) {
        return
      }

      setTimeout(() => {
        this.getJobs(this.onNewSearchStatus, this.currentPage, false, done)
      }, 1000)
    },
    scrollEvent () {
      this.previousScroll = this.$parent.$parent.$el.scrollTop

      if (this.$store.getters['user/getUserCurrentMobileTab'] === 'mobile.navbar.jobs' && this.$route.name === 'MobileDashboard' && this.$refs['job-infinite-scroll']) {
        if (this.$parent.$parent.$el.scrollTop >= this.previousScroll && this.$parent.$parent.$el.scrollTop >= (this.$refs['job-infinite-scroll'].clientHeight - 800)) {
          this.loadMoreJobs()
        }
      }
    },
    goTo (routeName) {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.$emit('trigger-login-signup', true, routeName)
        return
      }

      if (routeName === 'OfferService') {
        this.$store.commit('user/updateUserCurrentMobileTab', 'navbar.profile')
        this.$route.query.createListing = 1
        return
      }

      if (routeName === 'JobsHelp') {
        this.$router.push({name: 'JobsHelp'})
      }

      this.$router.push({name: routeName})
    },
    onLoadNewContent () {
      this.showLoader = true
      this.currentPage = 1
      this.getJobs(this.onNewSearchStatus, this.currentPage)
    },
    refreshJobsPage (done) {
      console.log('on refresh jobs page')
      this.firstLoad = false
      this.stopInfiniteScroll = false
      this.$store.dispatch('cached/clearJobsPageCached')
      this.currentPage = 1
      this.getJobs(this.onNewSearchStatus, this.currentPage)
      if (done) {
        setTimeout(() => { done() }, 2500)
      }

      // scroll back to top when necessary
      this.$parent.$el.scrollTo(0, 0)
    },
    onCloseFutureUpdateModal (status) {
      this.futureUpdateModal = status
    },
    onOpen (index) {
      this.jobs[index].read = 1
      this.$store.dispatch('cached/cacheJobs', this.jobs)
    },
    onDecline (index) {
      this.jobs[index].acceptanceStatus = '2'
      this.$store.dispatch('cached/cacheJobs', this.jobs)
    },
    onRemove (index) {
      this.jobs.splice(index, 1)
      this.$store.dispatch('cached/cacheJobs', this.jobs)
    },
    onFirstQuote (index, acceptanceStatus) {
      this.jobs[index].acceptanceStatus = acceptanceStatus
      this.$store.dispatch('cached/cacheJobs', this.jobs)

      // after update cache, redirect user to quote page
      this.$router.replace({name: 'JobQuote', params: {taskId: this.jobs[index].id}})
    },
    onResetSearch (form) {
      this.$store.commit('search/updateJobSearchCachedId', null)
      this.stopInfiniteScroll = false
      this.onNewSearchStatus = false
      this.jobs = []
      this.searchInfo = form
      this.currentPage = 1
      this.$refs['job-status-bar'].adjustIntoView(this.searchInfo.statusType)
      this.getJobs(this.onNewSearchStatus, this.currentPage)
    },
    onChangeStatus (status) {
      this.searchInfo.statusType = status
      this.stopInfiniteScroll = false
      this.onNewSearchStatus = (status !== null)
      this.jobs = []
      this.currentPage = 1
      this.getJobs(this.onNewSearchStatus, this.currentPage)
    },
    onSearch (form) {
      this.stopInfiniteScroll = false
      this.onNewSearchStatus = true
      this.jobs = []
      this.searchInfo = form
      this.currentPage = 1
      this.$refs['job-status-bar'].adjustIntoView(this.searchInfo.statusType)
      this.getJobs(this.onNewSearchStatus, this.currentPage)
    },
    onRefresh (index, newInfo) {
      this.jobs[index].acceptanceStatus = newInfo.acceptanceStatus
      this.jobs[index].completionStatus = newInfo.completionStatus
      this.jobs[index].offerAmount = newInfo.offerAmount
      this.jobs[index].offerCurrency = newInfo.offerCurrency
      this.$store.dispatch('cached/cacheJobs', this.jobs)
    },
    updateTasksList (index) {
      this.jobs[index].completionStatus = 1
      this.jobs[index].applicantRating = 5 // dummy rating to update locally only
      this.jobs[index].applicantReview = 'Great' // dummy review to update locally only
      // this.getJobs(this.onNewSearchStatus, this.currentPage)
    },
    async getJobs (onNewSearch = false, index = 1, override = false, done = null) {
      this.blockLoading = true
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.stopInfiniteScroll = true
        return
      }

      this.jobsLoaded = false
      this.emptyResults = false

      if (onNewSearch && index === 1) {
        this.$store.dispatch('search/getJobSearch', this.searchInfo).then((data) => {
          if (data.length > 0) {
            if (this.searchInfo.statusType === data[0].status_type) {
              this.jobs = JSON.parse(data[0].content)
              this.$store.commit('search/updateJobSearchCachedId', data[0].id)
            }
          }
        }).catch((error) => {
          console.error(error)
        })
      } else if (this.$store.getters['cached/getJobsCached'] && index === 1) {
        this.jobs = this.$store.getters['cached/getJobsCached']
      }

      this.$axios.get(`users/${this.$store.getters['user/getUserUuidState']}/tasks?${this.searchInfo.filterType === 'All' ? '' : `isPrivate=1`}${this.searchInfo.serviceType ? `&service_id[]=${this.searchInfo.serviceType}` : ''}${this.searchInfo.statusType ? `&category=${this.searchInfo.statusType}` : ''}${this.searchInfo.searchKeyword ? (this.searchInfo.keywordFilter === 'name' ? `&username=${this.searchInfo.searchKeyword}` : `&job_reference=${this.searchInfo.searchKeyword}`) : ''}&page=${index}&per_page=20`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status === 204 && (this.searchInfo.searchKeyword || this.searchInfo.keywordFilter || this.searchInfo.serviceType || this.searchInfo.statusType)) {
          this.emptyResults = true
          this.noMore = true
          this.stopInfiniteScroll = true
        } else if (response.status === 204) {
          //  this.$q.notify({message: 'All available jobs are loaded, come back later for more jobs!'})
          this.noMore = true
          this.stopInfiniteScroll = true
        } else {
          // only cache first page
          if (index === 1 && onNewSearch === false) {
            if (this.searchInfo.statusType === null) {
              this.jobs = response.data.taskInfo.items
            }

            // update cache
            this.$store.dispatch('cached/cacheJobs', response.data.taskInfo.items)
          } else if (index === 1 && onNewSearch) {
            let payload = this.searchInfo
            payload.items = response.data.taskInfo.items
            let requestType = response.config.url.split('&')
            if (requestType[1].split('=')[0] === 'category') {
              payload.statusType = requestType[1].split('=')[1]
            } else if (requestType[2] && requestType[2].split('=')[0] === 'category') {
              payload.statusType = requestType[2].split('=')[1]
            } else {
              this.jobs = response.data.taskInfo.items
            }

            if (requestType[1].split('=')[0] === 'service_id[]') {
              payload.serviceType = requestType[1].split('=')[1]
            }

            this.$store.dispatch('search/insertJobSearch', payload).then((data) => {
              if (data && data.statusType === this.searchInfo.statusType) {
                this.jobs = data.items
              }
            }).catch((error) => {
              console.error(error)
            })
          } else if (index > 1) {
            this.jobs = this.jobs.concat(response.data.taskInfo.items)
          }

          // straight close preloader if current items less than 20
          if (response.data.taskInfo.items.length < 20) {
            this.noMore = true
            this.stopInfiniteScroll = true
          }
        }
      }).catch((error) => {
        this.forceLogout(error)
        console.error(error)
        let errorMessage = error.response.data ? error.response.data.message : this.$t('something.wrong.gateway')
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      }).finally(_ => {
        this.jobsLoaded = true
        this.showLoader = false
        this.firstLoad = false
        this.currentPage++
        this.blockLoading = false

        if (done) {
          done()
        }
      })
    }
  }
}
</script>
<style lang="stylus">
.job-card-position
  position: absolute
  top: 160px
  display: block

@media only screen and (min-width: 320px)
  .job-card-position
    position: absolute
    top: 125px
    display: block
    margin-left: 4%

@media only screen and (min-width: 350px)
  .job-card-position
    position: absolute
    top: 125px
    display: block
    margin-left: 8%

@media only screen and (min-width: 370px)
  .job-card-position
    position: absolute
    top: 125px
    display: block
    margin-left: 11%

@media only screen and (min-width: 390px)
  .job-card-position
    position: absolute
    top: 125px
    display: block
    margin-left: 12.5%

@media only screen and (min-width: 410px)
  .job-card-position
    position: absolute
    top: 125px
    display: block
    margin-left: 14.5%

@media only screen and (min-width: 440px)
  .job-card-position
    position: absolute
    top: 125px
    display: block
    margin-left: 17%

@media only screen and (min-width: 500px)
  .job-card-position
    position: absolute
    top: 120px
    display: block
    margin-left: 20%

@media only screen and (min-width: 600px)
  .job-card-position
    position: absolute
    top: 120px
    display: block
    margin-left: 26%

@media only screen and (min-width: 750px)
  .job-card-position
    position: absolute
    top: 120px
    display: block
    margin-left: 32%

@media only screen and (min-width: 1024px)
  .job-card-position
    position: absolute
    top: 120px
    display: block
    margin-left: 35%

@media only screen and (min-width: 1300px)
  .job-card-position
    position: absolute
    top: 120px
    display: block
    margin-left: 35%

@media only screen and (min-width: 1600px)
  .job-card-position
    position: absolute
    top: 120px
    display: block
    margin-left: 36%
</style>
