<template>
  <div class="list" v-if="responseInfo">
    <!-- DESKTOP -->
    <q-list class="gt-xs" v-if="$q.platform.is.desktop" bordered>
      <q-item multiline>
        <q-item-section v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_NO_RESPONSE">
          <q-item-label>
            <span class="q-my-sm" v-if="responseUserInfo">{{ $t('chat.requesthasbeensent')}} {{ responseUserInfo.username }}</span>
          </q-item-label>
        </q-item-section>
        <q-item-section v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT">
          <q-item-label>
            <span class="q-my-sm" v-if="$route.name === 'Chat' && responseUserInfo">{{ responseUserInfo.username }} {{ $t('chat.hasaccepted') }}</span>
            <span class="q-my-sm" v-else-if="$route.name === 'JobChat'">{{requestInfo.requestorInfo.username}} would like your help</span>
          </q-item-label>
          <q-item-label caption>
            <div v-if="$route.name === 'Chat'">{{ $t('chat.pleaseclick') }}</div>
            <div v-else-if="$route.name === 'JobChat'">Please click or tap on the button below to edit your quotes</div>
            <div class="q-my-sm">
              <q-btn outline v-if="$route.name === 'Chat'" color="primary" :label="$t('btn.editrequest')" @click.native="$router.push({ name: 'EditRequest', params: {requestId: $route.params.request} })"></q-btn>
              <q-btn outline v-else-if="$route.name === 'JobChat'" color="primary" :label="$t('discount.title')" class="q-mr-sm" @click.native="$router.push({name: 'JobQuote', params: {taskId: $route.params.taskId}, query: {discount: 1}})"></q-btn>
              <q-btn v-if="$route.name === 'JobChat'" color="primary" :label="$t('view.your.quote')" class="q-mx-sm" @click.native="$router.push({name: 'JobQuote', params: {taskId: $route.params.taskId}})"></q-btn>
              <q-btn :label="$t('chat.booknow')" color="primary" style="margin-left: 10px" @click.native="$router.push($route.path + '/checkout')" v-if="priceInfo && priceInfo.totalPrice !== 0 && $route.name === 'Chat'"></q-btn>
              <q-btn :loading="payWallet" :label="$t('chat.booknow')" color="primary" style="margin-left: 10px" @click.native="takeFromWallet" v-else-if="$route.name === 'Chat'"></q-btn>
            </div>
          </q-item-label>
        </q-item-section>
        <q-item-section v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_REJECT || responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_REJECT_AFTER_BOOK">
          <q-item-label>
            <span class="q-my-sm" v-if="$route.name === 'Chat'">{{ $t('chat.requestrejected') }}</span>
            <span class="q-my-sm" v-else-if="$route.name === 'JobChat'">You have declined this job</span>
          </q-item-label>
        </q-item-section>
        <q-item-section v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_CANCEL_REQUEST">
          <q-item-label>
            <span class="q-my-sm" v-if="$route.name === 'Chat'">{{ $t('chat.youcancelrequest') }}</span>
            <span class="q-my-sm" v-else-if="$route.name === 'JobChat'">This job has been closed</span>
          </q-item-label>
        </q-item-section>
        <q-item-section v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_ACCEPT && responseInfo.completionStatus === STATUS.COMPLETION_NO_RESPONSE">
          <q-item-label>
            <span class="q-my-sm" v-if="$route.name === 'Chat' && responseUserInfo">{{ $t('chat.youhavebookedfor') }} {{ responseUserInfo.username }}</span>
            <span class="q-my-sm" v-if="$route.name === 'JobChat' && responseUserInfo">You have been booked by {{ responseUserInfo.username }}</span>
          </q-item-label>
          <q-item-label caption>
            <div class="q-my-sm" v-if="$route.name === 'Chat'">
              <q-btn outline :label="$t('requests.page.reviewsitterrequest')" :loading="closeRequestLoading" :disabled="closeRequestLoading" @click.native="closeRequest()"></q-btn>
              <q-btn color="primary" class="q-ml-md" v-if="$q.platform.is.desktop" :label="$t('extend.rebook.this.booking')" @click.native="$router.push({ name: 'BookAgainRequest', params: {requestId: responseInfo.requestInfo.id, serviceUserId: responseServiceInfo.id} })"></q-btn>
            </div>
            <div class="q-my-sm" v-else-if="$route.name === 'JobChat'">
              <q-btn color="primary" :label="$t('mark.job.complete')" size="md" @click="triggerMarkJobCompleteModal(true)"></q-btn>
            </div>
          </q-item-label>
        </q-item-section>
        <q-item-section v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_ACCEPT && responseInfo.completionStatus === STATUS.COMPLETION_PARENT_DEEMED_COMPLETE">
          <q-item-label v-if="$route.name === 'Chat' && responseUserInfo">
            <span class="q-my-sm">{{ responseUserInfo.username }} {{ $t('chat.hascompletejob') }}</span>
          </q-item-label>
          <q-item-label v-else-if="$route.name === 'JobChat'">
            <span class="q-my-sm">{{$t('you.completed.this.job')}}</span>
          </q-item-label>
          <q-item-label caption>
            <div class="q-my-sm">
              <q-btn outline :label="$t('chat.reviewnow')" v-if="responseInfo.userRating === 0 && $route.name === 'Chat'" @click="$router.push({name: 'ReviewVerified', params: {request: $route.params.request, response: $route.params.response}})"></q-btn>
              <q-btn color="primary" :label="$t('chat.reviewnow')" v-else-if="responseInfo.applicantRating === 0 && $route.name === 'JobChat'" @click="triggerMarkJobCompleteModal(true)"></q-btn>
              <q-btn color="primary" :label="$t('chat.bookagain')" v-if="$route.name === 'Chat'" @click.native="$router.push({ name: 'BookAgainRequest', params: {requestId: responseInfo.requestInfo.id, serviceUserId: responseServiceInfo.id} })"></q-btn>
            </div>
          </q-item-label>
        </q-item-section>
        <q-item-section v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_ACCEPT && responseInfo.completionStatus === STATUS.PARENT_DEEMED_INCOMPLETE">
          <q-item-label>
            <span class="q-my-sm" v-if="responseUserInfo">{{ responseUserInfo.username }} {{ $t('chat.didnotcompletejob') }}</span>
          </q-item-label>
          <q-item-label sublabel v-if="responseInfo.userRating === 0">
            <div class="q-my-sm">
              <q-btn outline :label="$t('chat.reviewnow')" @click="$router.push({name: 'ReviewVerified', params: {request: $route.params.request, response: $route.params.response}})"></q-btn>
            </div>
          </q-item-label>
        </q-item-section>
        <q-item-section v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_REJECT">
          <q-item-label>
            <span class="q-my-sm">{{ $t('chat.yourejectedsitter') }}</span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Mobile -->
    <q-list class="bg-white fixed-top lt-lg q-py-none" v-else-if="$q.platform.is.mobile" style="z-index: 20;" :style="visibility ? '' : 'display: none;'" :class="$q.platform.is.cordova && $q.platform.is.ios ? 'top-ios' : ($q.platform.is.cordova && $q.platform.is.android ? 'top-android' : 'top-webapp')" >
      <q-item multiline class="header-content q-pb-sm">
        <q-item-section v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_NO_RESPONSE">
          <q-item-label>
            <span class="q-my-sm" v-if="responseUserInfo">{{ $t('chat.requesthasbeensent')}} {{ responseUserInfo.username }}</span>
            <span class="float-right" v-if="priceInfo">{{ responseInfo.offerCurrencyText }} {{ (priceInfo.totalPrice || priceInfo.totalAmount) | currency }}</span>
          </q-item-label>
        </q-item-section>
        <q-item-section v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT">
          <q-item-label style="height: 44px">
            <div class="row">
              <div class="col-xs-8" @click="openQuoteModal">
                <!--<img class="responsive avatar request-status-avatar" style="height: 30px; width: 30px;" :src="responseUserInfo.avatarImage" alt="">-->
                <p class="q-my-sm text-weight-bold font-normal" style="margin-bottom: 5px;">
                  {{ $t(getServiceName(this.responseInfo.serviceInfo.services ? this.responseInfo.serviceInfo.services.subCategory[0].id : this.responseInfo.requestInfo.serviceId)) }}
                </p>
                <p class="q-my-sm text-weight-light font-small" style="margin-top: 0px; line-height: 13px;">
                  {{ this.getDescription(this.responseInfo.requestInfo) }}
                </P>
              </div>
              <div class="col-xs-4 text-right" style="line-height: 28px; font-size: 4vw;" @click="openQuoteModal" v-if="priceInfo">
                {{ responseInfo.offerCurrencyText }} {{ (priceInfo.totalPrice || priceInfo.totalAmount) | currency }}
                <span class="float-right cursor-pointer text-primary" @click="openQuoteModal" ><q-icon name="fas fa-info-circle" class="font-medium" style="margin-left: 10px; margin-top: -5px;"></q-icon></span>
              </div>
            </div>
          </q-item-label>
          <q-item-label caption class="line-height-self" style="margin-top: 10px;">
            <div class="row">
              <div class="q-my-xs col-xs-12">
                <q-btn outline v-if="$route.params.request" color="primary" :label="$t('btn.editrequest')" @click.native="$router.push({ name: 'EditRequest', params: {requestId: $route.params.request} })"></q-btn>
                <q-btn outline v-else-if="$route.name === 'JobChat'"  color="primary" :label="$t('discount.title')" class="q-mr-sm" @click.native="$router.push({name: 'JobQuote', params: {taskId: $route.params.taskId}, query: {discount: 1}})"></q-btn>
                <q-btn v-if="$route.name === 'JobChat'" color="primary" :label="$t('view.your.quote')" class="q-mx-xs" @click.native="$router.push({name: 'JobQuote', params: {taskId: $route.params.taskId}})"></q-btn>
                <q-btn :label="$t('chat.booknow')" color="primary" style="margin-left: 10px;"  @click.native="onBookNow" v-if="priceInfo && priceInfo.totalPrice !== 0 && $route.params.request"></q-btn>
                <q-btn :loading="payWallet" :label="$t('chat.booknow')" color="primary" style="margin-left: 10px;" @click.native="takeFromWallet" v-else-if="$route.params.request"></q-btn>
              </div>
            </div>
          </q-item-label>
        </q-item-section>
        <q-item-section v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_REJECT || responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_REJECT_AFTER_BOOK">
          <q-item-label>
            <div class="q-my-sm" @click="openQuoteModal">
              <span class="q-my-sm" v-if="$route.name === 'Chat'">{{ $t('chat.requestrejected') }}</span>
              <span class="q-my-sm" v-else-if="$route.name === 'JobChat'">{{$t('you.decline.this.job')}}</span>
              <span class="float-right cursor-pointer text-primary" @click="openQuoteModal" ><q-icon name="fas fa-info-circle" class="font-medium" style="margin-left: 10px; margin-top: -5px;"></q-icon></span>
              <span class="float-right" v-if="priceInfo">{{ responseInfo.offerCurrencyText }} {{ (priceInfo.totalPrice || priceInfo.totalAmount) | currency }}</span>
            </div>
          </q-item-label>
        </q-item-section>
        <q-item-section v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_CANCEL_REQUEST">
          <q-item-label>
            <div class="q-my-sm" @click="openQuoteModal">
              <span class="q-my-sm" v-if="$route.name === 'Chat'">{{ $t('chat.youcancelrequest') }}</span>
              <span class="q-my-sm" v-else-if="$route.name === 'JobChat'">{{ $t('job.has.been.closed') }}</span>
              <span class="float-right cursor-pointer text-primary" @click="openQuoteModal" ><q-icon name="fas fa-info-circle" class="font-medium" style="margin-left: 10px; margin-top: -5px;"></q-icon></span>
              <span class="float-right" v-if="priceInfo">{{ responseInfo.offerCurrencyText }} {{ (priceInfo.totalPrice || priceInfo.totalAmount) | currency }}</span>
            </div>
          </q-item-label>
        </q-item-section>
        <q-item-section style="padding-top: 20px;" v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_ACCEPT && responseInfo.completionStatus === STATUS.COMPLETION_NO_RESPONSE">
          <q-item-label @click="openQuoteModal">
            <span class="q-my-sm" v-if="$route.name === 'Chat' && responseUserInfo">{{ $t('chat.youhavebookedfor') }} {{ responseUserInfo.username }}</span>
            <span class="q-my-sm" v-if="$route.name === 'JobChat' && responseUserInfo">{{ $t('you.have.been.booked', {backerName: responseUserInfo.username}) }}</span>
            <span class="float-right cursor-pointer text-primary" @click="openQuoteModal" ><q-icon name="fas fa-info-circle" class="font-medium" style="margin-left: 10px; margin-top: -5px;"></q-icon></span>
            <span class="float-right" v-if="priceInfo">{{ responseInfo.offerCurrencyText }} {{ (priceInfo.totalPrice || priceInfo.totalAmount) | currency }}</span>
          </q-item-label>
          <q-item-label caption>
            <div class="q-my-sm" v-if="$route.name === 'Chat'">
              <q-btn outline :label="$t('requests.page.reviewsitterrequest')" size="sm" @click.native="closeRequest()" :loading="closeRequestLoading" :disabled="closeRequestLoading"></q-btn>
              <q-btn color="primary" class="q-ml-md" size="sm" :label="$t('extend.rebook.this.booking')" @click.native="$router.push({ name: 'BookAgainRequest', params: {requestId: responseInfo.requestInfo.id, serviceUserId: responseServiceInfo.id} })"></q-btn>
            </div>
            <div class="q-my-sm" v-if="$route.name === 'JobChat'">
              <q-btn
  style="margin-right: 10px; max-width: 150px;"
  outline
  @click="triggerUpdateJobModal"
  color="primary"
  v-if="$route.name === 'JobChat'"
  :label="$t('Job.update')"
  class="q-mx-xs"
></q-btn>

<q-btn
  color="primary"
  :label="$t('mark.job.complete')"
  @click="triggerMarkJobCompleteModal(true)"
  :style="{ 'max-width': $store.getters['user/getCurrentLanguage'] === 'eses' ? '150px' : 'auto' }"
></q-btn>

            </div>
          </q-item-label>
        </q-item-section>
        <q-item-section v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_ACCEPT && responseInfo.completionStatus === STATUS.COMPLETION_PARENT_DEEMED_COMPLETE">
          <q-item-label @click="openQuoteModal">
            <div class="q-my-sm col-xs-12">
              <span v-if="$route.name === 'Chat' && responseUserInfo">{{ responseUserInfo.username }} {{ $t('chat.hascompletejob') }}</span>
              <span v-else-if="$route.name === 'JobChat'">{{$t('you.completed.this.job')}}</span>
              <span class="float-right cursor-pointer text-primary" @click="openQuoteModal" ><q-icon name="fas fa-info-circle" class="font-medium" style="margin-left: 10px; margin-top: -5px;"></q-icon></span>
              <span class="float-right" v-if="priceInfo">{{ responseInfo.offerCurrencyText }} {{ (priceInfo.totalPrice || priceInfo.totalAmount) | currency }}</span>
            </div>
          </q-item-label>
          <q-item-label caption>
            <div class="q-my-sm">
              <q-btn outline :label="$t('chat.reviewnow')" v-if="responseInfo.userRating === 0 && $route.name === 'Chat'" @click="$router.push({name: 'ReviewVerified', params: {request: $route.params.request, response: $route.params.response}})"></q-btn>
              <q-btn color="primary" :label="$t('chat.reviewnow')" v-else-if="responseInfo.applicantRating === 0 && $route.name === 'JobChat'" @click="triggerMarkJobCompleteModal(true)"></q-btn>
              <q-btn color="primary" :label="$t('chat.bookagain')" class="q-ml-sm" v-if="$route.name === 'Chat'" @click.native="$router.push({ name: 'BookAgainRequest', params: {requestId: responseInfo.requestInfo.id, serviceUserId: responseServiceInfo.id} })"></q-btn>
            </div>
          </q-item-label>
        </q-item-section>
        <q-item-section v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_ACCEPT && responseInfo.completionStatus === STATUS.COMPLETION_PARENT_DEEMED_INCOMPLETE">
          <q-item-label @click="openQuoteModal">
            <span class="q-my-sm" v-if="responseUserInfo">{{ responseUserInfo.username }} {{ $t('chat.didnotcompletejob') }}</span>
            <span class="float-right cursor-pointer text-primary" @click="openQuoteModal" ><q-icon name="fas fa-info-circle" class="font-medium" style="margin-left: 10px; margin-top: -5px;"></q-icon></span>
          </q-item-label>
          <q-item-label caption v-if="responseInfo.userRating === 0">
            <div class="q-my-sm">
              <q-btn outline :label="$t('chat.reviewnow')" v-if="$route.name === 'Chat'" size="sm" class="full-width"  @click="$router.push({name: 'ReviewVerified', params: {request: $route.params.request, response: $route.params.response}})"></q-btn>
              <q-btn color="primary" :label="$t('mark.job.complete')" v-else-if="$route.name === 'JobChat'" size="sm" class="full-width" @click="triggerMarkJobCompleteModal(true)"></q-btn>
            </div>
          </q-item-label>
        </q-item-section>
        <q-item-section v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_REJECT">
          <q-item-label>
            <div class="q-my-sm" @click="openQuoteModal">
              <span class="q-my-sm" v-if="$route.name === 'Chat'">{{ $t('chat.yourejectedsitter') }}</span>
              <span class="q-my-sm" v-else-if="$route.name === 'JobChat'">{{ $t('job.has.been.closed') }}</span>
               <span class="float-right cursor-pointer text-primary" @click="openQuoteModal" ><q-icon name="fas fa-info-circle" class="font-medium" style="font-size:20px; margin-left: 10px; margin-top: -5px;"></q-icon></span>
              <span class="float-right" v-if="priceInfo">{{ responseInfo.offerCurrencyText }} {{ (priceInfo.totalPrice || priceInfo.totalAmount) | currency }}</span>
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
<!-- Moment Update Model -->
    <q-dialog  ref="moment update" v-model="jobUpdateModal" :persistent="this.$q.platform.is.mobile" :maximized="this.$q.platform.is.mobile" :transition-show="this.$q.platform.is.mobile ? 'slide-left' : 'none'" :transition-hide="this.$q.platform.is.mobile ? 'slide-right' : 'none'">
    <Job-update-card  :id="this.responseInfo.id"   @share="share"  @on-close="triggercloseUpdateJobModal" :jobid="getJobId()"  @posted="postedJob" > </Job-update-card>
    </q-dialog>

    <!-- Quote Details Modal -->
    <q-dialog v-model="modalQuoteDetails" maximized transition-show="slide-left" transition-hide="slide-right">
      <q-card >
        <q-toolbar class="fixed-top bg-white" style="z-index:10;border-bottom: 1px solid lightgrey;" @click.native="modalQuoteDetails = false">
          <q-btn flat round dense icon="chevron_left" class="font-header-title" v-close-popup/>
          <q-toolbar-title v-close-popup class="font-header-title" style="margin-left:22%;">
            {{ $t('chat.quotedetail') }}
          </q-toolbar-title>
        </q-toolbar>

        <q-card-section class="q-pt-none q-mt-xl q-px-none" v-if="priceInfo && requestInfo">
          <quote-detail :responseInfo="responseInfo" :priceInfo="priceInfo" :requestInfo="requestInfo" @refresh-price="getPriceInfo" class="q-mb-xl"></quote-detail>
        </q-card-section>
        <q-card-section class="q-pt-xl q-mt-xl q-px-none" v-else>
          <ComponentPreLoader class="margin-auto"></ComponentPreLoader>
        </q-card-section>

        <q-btn v-if="$route.params.request && (responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT && priceInfo && priceInfo.totalPrice !== 0)" size="lg"
          class="full-width fixed-bottom q-pt-sm q-pb-md" style="border-top-left-radius: 12px;border-top-right-radius: 12px;z-index: 5000;" color="primary" :label="$t('chat.booknow')"
          @click.native="$router.push($route.path + '/checkout')"/>
        <q-btn :loading="payWallet" v-else-if="$route.params.request && (responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT)" size="lg"
          class="full-width fixed-bottom q-pt-sm q-pb-md" style="border-top-left-radius: 12px;border-top-right-radius: 12px;z-index: 5000;" color="primary" :label="$t('chat.booknow')"
          @click.native="takeFromWallet"/>
      </q-card>
    </q-dialog>

    <!-- Promotion Package -->
    <dialog-promotions :trigger="promotionDialog" @on-close="triggerPromotionDialog" :productId="6"></dialog-promotions>

    <!-- Mark Job Complete Modal -->
    <dialog-jobcomplete :trigger="modalMarkJobComplete" :responseInfo="responseInfo" :scanRequired="responseInfo.hasOwnProperty('scanMarkCompleteRequired') ? responseInfo.scanMarkCompleteRequired : 1" @on-mark-complete="jobCompleted" @on-close="triggerMarkJobCompleteModal"></dialog-jobcomplete>

    <!-- Rewards Prompt Modal -->
    <dialog-rewards v-if="$route.name === 'Chat'" :responseInfo="responseInfo" :trigger="rewardsModal" @on-close="triggerRewardsModal"></dialog-rewards>
  </div>
</template>

<script>
/* eslint-disable no-useless-escape */
import moment from 'moment'
import ACCEPTANCE_STATUS from 'assets/request-status.json'
import services from 'assets/services'

export default {
  props: {
    responseInfo: {
      required: true
    },
    requestInfo: {
      required: true
    },
    priceInfo: {
      required: true
    },
    forcesmall: {
      type: Boolean,
      default: false
    },
    triggerQuoteDetails: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'quote-detail': () => import('components/QuoteDetail'),
    'dialog-jobcomplete': () => import('components/MarkComplete/DialogMarkJobComplete.vue'),
    'dialog-promotions': () => import('components/Promotions/DialogPromotions.vue'),
    'dialog-rewards': () => import('components/Chat/DialogRewardsPrompt.vue'),
    'Job-update-card': () => import('components/Moments/ComponentJobUpdate.vue')
  },
  data () {
    return {
      jobUpdateModal: false,
      modalMarkJobComplete: false,
      responseServiceInfo: null,
      responseUserInfo: null,
      STATUS: ACCEPTANCE_STATUS,
      modalQuoteDetails: false,
      modalJobComplete: false,
      saveReviewLoading: false,
      closeRequestLoading: false,
      showNotificationBar: false,
      payWallet: false,
      promotionDialog: false,
      visibility: true,
      rewardsModal: false,
      jobid: null
    }
  },
  filters: {
    currency (value) {
      if (value) {
        return Number.parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
      } else {
        return '0.00'
      }
    },
    readableDate (value) {
      return moment(value).format('DD MMM YYYY')
    }
  },
  computed: {
    modalQuoteDetailsVuex () {
      return this.$store.state.user.openModalQuoteDetails
    }
  },
  watch: {
    modalQuoteDetailsVuex (val) {
      this.modalQuoteDetails = true
    },
    modalQuoteDetails (value) {
      this.$emit('close-quotemodal', value)
    },
    triggerQuoteDetails (value) {
      this.modalQuoteDetails = value
    },
    responseInfo (value) {
      if (value) {
        this.responseUserInfo = (value.serviceInfo.userInfo || this.requestInfo.requestorInfo)
        this.responseServiceInfo = this.responseInfo.serviceInfo
      }
    }
  },
  created () {
    console.log('job info check', this.responseInfo.id)
    this.responseUserInfo = (this.responseInfo.serviceInfo.userInfo || this.requestInfo.requestorInfo)
  },
  mounted () {
    this.responseServiceInfo = this.responseInfo.serviceInfo
  },
  beforeDestroy () {
    this.$root.$off('background-visibility', this.triggerBackgroundVisibility)
  },
  methods: {
    getJobId () {
      this.jobid = this.responseInfo.jobReference + '(' + this.responseUserInfo.username + ')'
      return this.jobid || null
    },
    triggercloseUpdateJobModal () {
      console.log(this.jobUpdateModal = false)
    },
    triggerUpdateJobModal () {
      this.responseUserInfo = (this.responseInfo.serviceInfo.userInfo || this.requestInfo.requestorInfo)
      this.$forceUpdate()
      console.log(this.jobUpdateModal = true)
    },
    postedJob (value) {
      // set the successModal data property to true to trigger and open the dialog-success component
      this.successModal = true
      this.posttype = value
    },
    share (value) {
      this.moment = value
      this.description = this.moment.description
      this.shareurl = this.moment.shareUrl
    },
    triggerRewardsModal (status) {
      this.rewardsModal = status
    },
    triggerPromotionDialog (status) {
      this.promotionDialog = status
    },
    onBookNow () {
      // TODO: Show Promotional Package For Grooming Packages
      // this.triggrPromotionDialog(true)

      this.$router.push(this.$route.path + '/checkout')
      console.log('check id', this.responseInfo.jobReference)
      this.sendImpression('Book Now Clicked', 'Job Reference:' + this.responseInfo.jobReference, 'Job Request')
      // check whether trigger pop up for rewards point to be earned (once per chat)
      /* if (this.$q.localStorage.has(`chat-rewards-${this.$route.params.request}-${this.$route.params.response}`)) {
        this.$router.push(this.$route.path + '/checkout')
      } else {
        this.triggerRewardsModal(true)
      } */
    },
    jobCompleted () {
      this.$emit('get-response-info')
      // this.onCloseMarkJobCompleteModal(false)
    },
    triggerMarkJobCompleteModal (status) {
      this.modalMarkJobComplete = status

      if (status) {
        this.$root.$on('background-visibility', this.triggerBackgroundVisibility)
      } else {
        setTimeout(() => {
          this.$root.$off('background-visibility', this.triggerBackgroundVisibility)
        }, 50)
      }
    },
    triggerBackgroundVisibility (status) {
      this.visibility = status
    },
    openQuoteModal () {
      if (this.$route.name === 'Chat') {
        this.modalQuoteDetails = true
      } else if (this.$route.name === 'JobChat') {
        this.$router.push({name: 'JobQuote', params: {taskId: this.$route.params.taskId}})
      }
    },
    getPriceInfo () {
      this.$emit('refresh-price', true)
    },
    takeFromWallet () {
      this.payWallet = true
      this.$axios.get(`users/${this.$store.state.user.uuid}/tasks/${this.$route.params.response}/paymentfromwallet`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$q.notify({
          message: this.$t('successfully.booked.with.backer', {sitterName: this.responseUserInfo.username})
        })
        setTimeout(() => {
          window.location.reload()
        }, 2400)
      }).catch((error) => {
        console.error(error)
      })
    },
    getServiceName (id) {
      for (let items in services) {
        if (services[items].id === id) {
          return services[items].name
        }
      }
      return 'failed'
    },
    getDescription (requestInfo) {
      let startDate = moment.utc(requestInfo.requiredTime).local().format('ll').split(', ')

      return `${requestInfo.petCount} Pet(s), from ${startDate[0]} for ${requestInfo.duration} ${requestInfo.unit}(s)`
    },
    closeRequest () {
      this.$q.dialog({
        title: this.$t('confirmation'),
        message: this.$t('mark.this.completed'),
        ok: this.$t('dialog.button.yes'),
        cancel: this.$t('dialog.button.no')
      }).onOk(() => {
        // allo override mark complete before request end date for sitting and dog walking only
        let endDate = moment.utc(this.responseInfo.requestInfo.requiredTime).local().add(parseInt(this.responseInfo.requestInfo.duration) - 1, 'day')
        let today = moment()

        if ((today.diff(endDate, 'day') < 0) && (this.responseInfo.requestInfo.serviceId === 16 || this.responseInfo.requestInfo.serviceId === 13)) {
          this.$q.dialog({
            title: this.$t('confirmation'),
            message: this.$t('mark.job.complete.before.job.end.date'),
            ok: this.$t('dialog.button.yes'),
            cancel: this.$t('dialog.button.no')
          }).onOk(() => {
            this.markRequestComplete(true)
          }).onCancel(() => {})
        } else {
          this.markRequestComplete()
        }
      }).onCancel(() => {})
    },
    markRequestComplete (override = false) {
      this.closeRequestLoading = true
      let responseInfo = JSON.stringify({
        'responseInfo': {
          'acceptanceStatus': this.STATUS.ACCEPTANCE_PARENT_ACCEPT,
          'completionStatus': this.STATUS.COMPLETION_PARENT_DEEMED_COMPLETE
        }
      })

      this.$axios.put(`users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}${override ? '?overridecomplete=1' : ''}`, responseInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.closeRequestLoading = false
        this.$q.notify({
          message: this.$t('booking.mark.complete'),
          type: 'positive'
        })
        this.$router.push({name: 'ReviewVerified', params: {request: this.$route.params.request, response: this.$route.params.response}})
        // setTimeout(() => {
        //   window.location.reload()
        // }, 2400)
        // this.$emit('onGetResponseInfo')
      }).catch(e => {
        this.closeRequestLoading = false
        console.error(e)
        this.$q.notify({
          message: this.$t('booking.mark.fail'),
          type: 'negative'
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
q-item-main#chatHeader
  margin-top: 0px
  padding-top: 0px
  display: block

.rating-input
  border-radius: 5px
  padding: 10px
  resize: none

.cursor-pointer:hover
  text-decoration: underline

.line-height-self
  height: 40px

.top-webapp
  top: 6%

.top-ios
  top: 10%

.top-android
  top: 6%

@media screen and (min-width: 320px)
  .line-height-self
    line-height: 16px
  .top-webapp
    top: 7%
  .top-android
    top: 7%

@media screen and (min-width: 370px)
  .top-ios
    top: 9.5%
  .top-webapp
    top: 5%
  .top-android
    top: 5%

@media screen and (min-width: 370px) and (min-height: 700px)
  .top-ios
    top: 11.5%

@media screen and (min-width: 370px) and (min-height: 734px)
  .top-ios
    top: 11%

@media screen and (min-width: 390px)
  .top-ios
    top: 10.5%
  .top-webapp
    top: 5%
  .top-android
    top: 6%

@media screen and (min-width: 410px)
  .top-ios
    top: 9.8%

@media screen and (min-width: 410px) and (min-height: 700px)
  .top-ios
    top: 9%

@media screen and (min-width: 410px) and (min-height: 800px)
  .top-ios
    top: 10%

@media screen and (min-width: 425px)
  .top-ios
    top: 10%

@media screen and (min-width: 450px)
  .top-webapp
    top: 5%
  .top-android
    top: 5%

@media screen and (min-width: 500px)
  .top-ios
    top: 5%
  .top-webapp
    top: 4%
  .top-android
    top: 4%

@media screen and (min-width: 600px)
  .top-ios
    top: 5%
  .top-android
    top: 5%
  .top-webapp
    top: 5%

@media screen and (min-width: 700px)
  .top-ios
    top: 5.8%
  .top-android
    top: 4%
  .top-webapp
    top: 4%

.header-content
  border-bottom: 1px solid #E0E0E0
  border-top: 1px solid #E0E0E0
</style>
