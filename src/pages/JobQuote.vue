<!-- Your Quotes page after clicking service rate card -->
<template>
  <q-page class="margin-auto" :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}">
      <!-- Quote total breakdown -->
      <card-quotetotal :priceInfo="priceInfo" class="fixed-top q-mt-xl margin-auto" style="z-index:1000;" :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}" :class="$q.platform.is.cordova && $q.platform.is.ios ? 'quote-breakdown-ios' : ($q.platform.is.cordova && $q.platform.is.android ? 'quote-breakdown-android' : 'quote-breakdown-webapp')"></card-quotetotal>

      <!-- Quote Cards -->
      <div v-if="priceInfo !== null" class="q-my-xl q-py-xl" :style="{marginTop: screenWidth < 600 ? '17%' : '9%'}">
        <transition-group appear enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutUp">
          <card-quoteitem :quoteItem="quoteItem" :ref="index" :quoteTypes="priceInfo.quoteItems" :taskCompleted="taskInfo ? Boolean(taskInfo.completionStatus) : false" v-for="(quoteItem, index) in priceInfo.items" :key="quoteItem.id" @on-refresh="onRefresh"></card-quoteitem>
        </transition-group>
        <transition appear enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown" v-if="taskInfo && taskInfo.completionStatus !== 1">
          <q-card style="border-radius: 11px;margin-left:3%;margin-right:3%;margin-top:3%;opacity: 0.5;" class="q-py-sm" @click="addQuoteItem" v-if="loaded && priceInfo.quoteItems.length > 1">
              <q-card-section>
                  <q-item class="q-pa-none font-normal">
                      <q-item-section>
                          <!-- Quote Name -->
                          <q-item-label class="font-header-title text-wrap" lines="1" >{{$t('add.quote.item')}}</q-item-label>
                          <!-- Quote Details -->
                          <q-item-label lines="2" class="text-wrap text-grey">{{$t('click.here.add.additional.item')}}</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                          <q-item-label caption>
                              <q-icon name="chevron_right" size="2em"></q-icon>
                          </q-item-label>
                      </q-item-section>
                  </q-item>
              </q-card-section>
          </q-card>
        </transition>
      </div>

      <!-- Dialog Minimum Quote -->
      <dialog-minquote v-if="priceInfo"
      :trigger="minQuoteModal"
      :currency="priceInfo.currencyId"
      :minimum="priceInfo.min"
      :unit="priceInfo.quoteItems[0].unit"
      @on-revise="onReviseQuote"
      @on-continue="checkApplicants()"
      @on-close="closeMinQuoteDialog"></dialog-minquote>

      <!-- Insurance waived advisory -->
      <dialog-insurancewaive v-if="priceInfo"
      :trigger="advisoryModal"
      @on-revise="onReviseQuote"
      @on-continue="checkApplicants()"
      @on-close="closeAdvisoryDialog"></dialog-insurancewaive>

      <!-- Mobile Send Quote Button -->
      <transition appear enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown" v-if="taskInfo && taskInfo.completionStatus !== 1">
        <div class="fixed-bottom bg-primary" v-if="$q.platform.is.mobile" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" @click="onSendQuote">
          <div class="q-pa-md q-pb-lg">
            <div class="text-white q-pb-sm text-center cursor-pointer font-header-title">
              <span v-if="!showLoading">{{$t('send.quote')}}</span>
              <span v-else><q-spinner size="1.5em"></q-spinner></span>
            </div>
          </div>
        </div>
        <div class="bg-primary" v-else style="border-radius: 15px" @click="onSendQuote">
          <div class="q-pa-md q-py-md">
            <div class="text-white text-center cursor-pointer font-header-title">
              <span v-if="!showLoading">{{$t('send.quote')}}</span>
              <span v-else><q-spinner size="1.5em"></q-spinner></span>
            </div>
          </div>
        </div>
      </transition>
      <dialog-prompt v-if="this.errorCode !== 0" :trigger="promptModal" :type="typeCode" :message="promptMessage" :learnMoreLink="learnMoreLink" :persistent="promptPersistant" :okButtonLabel="okBtnLabel" :cancelButtonLabel="canceblBtnLabel" @on-ok="onPromptOk" @on-cancel="onPromptCancel" @on-close="closeDialog"></dialog-prompt>
      <dialog-prompt v-else-if="this.errorCode === 0" :trigger="promptModal" :type="typeCode" :message="promptMessage" :learnMoreLink="learnMoreLink" :persistent="promptPersistant" :okButtonLabel="okBtnLabel" :cancelButtonLabel="canceblBtnLabel" @on-ok="onForceSubmitQuote()" @on-cancel="onPromptCancel" @on-close="closeDialog" :errorCode="errorCode"></dialog-prompt>
  </q-page>
</template>
<script>
import STATUS from 'assets/request-status.json'
export default {
components: {
  'card-quotetotal': () => import('components/JobQuote/QuoteTotal.vue'),
  'card-quoteitem': () => import('components/JobQuote/QuoteCard.vue'),
  'dialog-minquote': () => import('components/JobQuote/DialogMinQuote.vue'),
  'dialog-insurancewaive': () => import('components/JobQuote/DialogInsuranceWaive.vue'),
  'dialog-prompt': () => import('components/DialogPrompt.vue')
},
data () {
  return {
    promptPersistant: false,
    typeCode: null,
    learnMoreLink: null,
    errorCode: null,
    priceInfo: null,
    showLoading: false,
    loaded: false,
    taskInfo: null,
    minQuoteModal: false,
    advisoryModal: false,
    screenWidth: screen.width,
    promptModal: false,
    promptMessage: '',
    promptButtonLabel: null,
    promptCancelLabel: '',
    errorStatus: 0,
    okBtnLabel: this.$t('ok'),
    canceblBtnLabel: this.$t('close')
  }
},
created () {
  this.getPriceInfo()
  this.getTaskInfo()
},
mounted () {
  if (parseInt(this.$route.query.discount) === 1) {
    this.$emit('trigger-discount-dialog')
  }

  if (this.$route.query.serviceId) {
    setTimeout(() => {
      this.$emit('on-addquoteitems')
    }, 500)
    // first quantity issue
  }

  window.scrollTo(0, 0)
},
methods: {
  closeDialog () {
    this.promptModal = false
  },
  onPromptCancel () {
    this.promptModal = false
  },
  onPromptOk () {
    this.promptModal = false
  },
  triggerPromptDialog (status, message = '', okLabel = null, cancelLabel = null, typeCode = 0, persistent = false) {
    this.promptMessage = message
    this.okBtnLabel = okLabel
    this.canceblBtnLabel = cancelLabel
    this.promptPersistant = persistent
    this.typeCode = typeCode
    this.promptModal = status
    this.learnMoreLink = 'https://www.petbacker.com/help-center/pet-parents/how-to-get-credits'
  },
  addQuoteItem () {
    this.$emit('on-addquoteitems')
  },
  onRefresh () {
    this.getPriceInfo()
  },
  closeAdvisoryDialog (status) {
    this.advisoryModal = status
  },
  closeMinQuoteDialog (status) {
    this.minQuoteModal = status
  },
  onReviseQuote () {
    this.$refs[0][0].openQuoteDetailModal()
  },
  onSendQuote () {
    if (parseFloat(this.priceInfo.items[0].quoteAmount) < parseFloat(this.priceInfo.min)) {
      this.minQuoteModal = true
    } else {
      // this.onSubmitQuote() // to submit quote (old)
      this.checkApplicants() // to check num of applicants
    }
  },
  // to check num of job applicants
  checkApplicants () {
    this.showLoading = true
    let taskInfo = {
      'taskInfo': {
        'acceptanceStatus': 1,
        'offerAmount': this.priceInfo.totalAmount,
        'offerCurrency': this.priceInfo.currencyId
      }
    }

    this.$axios.put(`users/${this.$store.state.user.uuid}/tasks/${this.$route.params.taskId}?deduct-credits=2`, taskInfo, {
      headers: {
        Authorization: this.$store.getters['user/authorizationHeader']
      }
    }).then(response => {
      // if below 9 applicants
      this.$store.dispatch('bookings/insertBooking', {
        id: parseInt(this.taskInfo.id),
        ownerHref: `/users/${this.taskInfo.requestInfo.requestorInfo.id}/request/${this.taskInfo.requestInfo.id}/responses/${parseInt(this.taskInfo.id)}`,
        ownerUuid: this.taskInfo.requestInfo.requestorInfo.id,
        sitterHref: this.taskInfo.href,
        sitterUuid: this.$store.getters['user/getUserUuidState'],
        bookingRef: this.taskInfo.jobReference,
        offerCurrencyText: this.taskInfo.offerCurrencyText,
        offerCurrency: response.data.taskInfo.offerCurrency,
        offerAmount: response.data.taskInfo.offerAmount,
        acceptanceStatus: response.data.taskInfo.acceptanceStatus,
        bookStatus: this.taskInfo.bookStatus,
        completionStatus: this.taskInfo.completionStatus,
        ownerRating: this.taskInfo.userRating,
        sitterRating: this.taskInfo.applicantRating,
        serviceId: this.taskInfo.requestInfo.serviceId,
        petCount: this.taskInfo.requestInfo.petCount,
        requiredTime: this.taskInfo.requestInfo.requiredTime,
        duration: this.taskInfo.requestInfo.duration,
        unit: this.taskInfo.requestInfo.unit
      }).then((results) => {
        this.$router.replace({name: 'JobChat', params: {taskId: parseInt(this.taskInfo.id)}})
        this.showLoading = false
        console.log('below 9 applicants, ok to submit')
      }).catch((error) => {
        console.error(error)
        this.$router.replace({name: 'JobChat', params: {taskId: parseInt(this.taskInfo.id)}})
      })
    }).catch((error) => {
      this.showLoading = false
      if (error.response.data.code === 10) {
        this.$router.replace({name: 'JobChat', params: {taskId: parseInt(this.taskInfo.id)}})
        return
      } else if (error.response.data.code === 0) { // receive this error if above 8 applicants
        console.log('above 8 applicants, not ok to submit')
        let errorMessage = error.response.data.message
        let errorButton = error.response.data.okBtnLabel
        this.errorCode = error.response.data.code
        this.triggerPromptDialog(true, errorMessage, errorButton, errorButton)
        return (this.errorCode)
      }

      console.error(error)
      // to show error dialog
      let errorMessage = error.response.data ? error.response.data.message : this.$t('something.wrong.gateway')
      this.triggerPromptDialog(true, errorMessage, this.$t('okay'), this.$t('okay'))
    })
  },
  onForceSubmitQuote () {
    this.showLoading = true
    let taskInfo = {
      'taskInfo': {
        'acceptanceStatus': 1,
        'offerAmount': this.priceInfo.totalAmount,
        'offerCurrency': this.priceInfo.currencyId
      }
    }

    // force submit quote after error
    this.$axios.put(`users/${this.$store.state.user.uuid}/tasks/${this.$route.params.taskId}?deduct-credits=1`, taskInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.$store.dispatch('bookings/insertBooking', {
        id: parseInt(this.taskInfo.id),
        ownerHref: `/users/${this.taskInfo.requestInfo.requestorInfo.id}/request/${this.taskInfo.requestInfo.id}/responses/${parseInt(this.taskInfo.id)}`,
        ownerUuid: this.taskInfo.requestInfo.requestorInfo.id,
        sitterHref: this.taskInfo.href,
        sitterUuid: this.$store.getters['user/getUserUuidState'],
        bookingRef: this.taskInfo.jobReference,
        offerCurrencyText: this.taskInfo.offerCurrencyText,
        offerCurrency: response.data.taskInfo.offerCurrency,
        offerAmount: response.data.taskInfo.offerAmount,
        acceptanceStatus: response.data.taskInfo.acceptanceStatus,
        bookStatus: this.taskInfo.bookStatus,
        completionStatus: this.taskInfo.completionStatus,
        ownerRating: this.taskInfo.userRating,
        sitterRating: this.taskInfo.applicantRating,
        serviceId: this.taskInfo.requestInfo.serviceId,
        petCount: this.taskInfo.requestInfo.petCount,
        requiredTime: this.taskInfo.requestInfo.requiredTime,
        duration: this.taskInfo.requestInfo.duration,
        unit: this.taskInfo.requestInfo.unit
      }).then((results) => {
        this.$router.replace({name: 'JobChat', params: {taskId: parseInt(this.taskInfo.id)}})
        this.showLoading = false
        console.log('force submit')
      }).catch((error) => {
        console.error(error)
        this.$router.replace({name: 'JobChat', params: {taskId: parseInt(this.taskInfo.id)}})
      })
    }).catch((error) => {
      this.showLoading = false
      if (error.response.data.code === 10) {
        this.$router.replace({name: 'JobChat', params: {taskId: parseInt(this.taskInfo.id)}})
        return
      }

      console.error(error)
      let errorMessage = error.response.data ? error.response.data.message : this.$t('something.wrong.gateway')
      this.triggerPromptDialog(true, errorMessage, this.$t('okay'), this.$t('okay'))
    })
  },
  // old
  onSubmitQuote (override = false) {
    this.showLoading = true
    let taskInfo = {
      'taskInfo': {
        'acceptanceStatus': 1,
        'offerAmount': this.priceInfo.totalAmount,
        'offerCurrency': this.priceInfo.currencyId
      }
    }

    this.$axios.put(`users/${this.$store.getters['user/getUserUuidState']}/tasks/${this.$route.params.taskId}${override ? '?override=1' : ''}`, taskInfo, {
      headers: {
        Authorization: this.$store.getters['user/authorizationHeader']
      }
    }).then(response => {
      this.$store.dispatch('bookings/insertBooking', {
        id: parseInt(this.taskInfo.id),
        ownerHref: `/users/${this.taskInfo.requestInfo.requestorInfo.id}/request/${this.taskInfo.requestInfo.id}/responses/${parseInt(this.taskInfo.id)}`,
        ownerUuid: this.taskInfo.requestInfo.requestorInfo.id,
        sitterHref: this.taskInfo.href,
        sitterUuid: this.$store.getters['user/getUserUuidState'],
        bookingRef: this.taskInfo.jobReference,
        offerCurrencyText: this.taskInfo.offerCurrencyText,
        offerCurrency: response.data.taskInfo.offerCurrency,
        offerAmount: response.data.taskInfo.offerAmount,
        acceptanceStatus: response.data.taskInfo.acceptanceStatus,
        bookStatus: this.taskInfo.bookStatus,
        completionStatus: this.taskInfo.completionStatus,
        ownerRating: this.taskInfo.userRating,
        sitterRating: this.taskInfo.applicantRating,
        serviceId: this.taskInfo.requestInfo.serviceId,
        petCount: this.taskInfo.requestInfo.petCount,
        requiredTime: this.taskInfo.requestInfo.requiredTime,
        duration: this.taskInfo.requestInfo.duration,
        unit: this.taskInfo.requestInfo.unit
      }).then((results) => {
        this.$router.replace({name: 'JobChat', params: {taskId: parseInt(this.taskInfo.id)}})
        this.showLoading = false
        console.log('normal submit')
      }).catch((error) => {
        console.error(error)
        this.$router.replace({name: 'JobChat', params: {taskId: parseInt(this.taskInfo.id)}})
      })
    }).catch((error) => {
      this.showLoading = false
      if (error.response.data.code === 10) {
        this.$router.replace({name: 'JobChat', params: {taskId: parseInt(this.taskInfo.id)}})
        return
      }

      console.error(error)
      let errorMessage = error.response.data ? error.response.data.message : this.$t('something.wrong.gateway')
      this.triggerPromptDialog(true, errorMessage, this.$t('okay'), this.$t('okay'))
    })
  },
  getPriceInfo () {
    this.$axios.get(`/users/${this.$store.getters['user/getUserUuidState']}/tasks/${this.$route.params.taskId}/quotes`, {
      headers: {
        Authorization: this.$store.getters['user/authorizationHeader']
      }
    }).then((response) => {
      this.priceInfo = response.data.quotesInfo
      this.$emit('quote-types-options', this.priceInfo.quoteItems)
      setTimeout(() => {
        this.loaded = true
      }, 100)
    }).catch((error) => {
      console.error(error)
      let errorMessage = error.response.data ? error.response.data.message : this.$t('something.wrong.gateway')
      this.$q.notify({
        message: errorMessage,
        type: 'negative'
      })
    })
  },
  getTaskInfo () {
    this.$axios.get(`/users/${this.$store.getters['user/getUserUuidState']}/tasks/${this.$route.params.taskId}`, {
      headers: {
        Authorization: this.$store.getters['user/authorizationHeader']
      }
    }).then((response) => {
      this.taskInfo = response.data.taskInfo
      if (this.taskInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_REJECT || this.taskInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_REJECT || this.taskInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_CANCEL_REQUEST || this.taskInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_CANCEL_REQUEST_AFTER_BOOK || this.taskInfo.bookStatus) {
        this.taskInfo.completionStatus = 1
      }

      this.$emit('get-response-user-info', this.taskInfo)
    }).catch((error) => {
      console.error(error)
      let errorMessage = error.response.data ? error.response.data.message : this.$t('something.wrong.gateway')
      this.$q.notify({
        message: errorMessage,
        type: 'negative'
      })
    })
  }
}
}
</script>
<style lang="stylus">
.outline
  border: solid 2px $primary

.quote-breakdown-webapp
  top: 0px

.quote-breakdown-ios
  top: 0px

.quote-breakdown-android
  top: 0px

@media screen and (min-width: 320px)
  .quote-breakdown-ios
    top: 2%

@media screen and (min-width: 370px)
  .quote-breakdown-ios
    top: 2.5%

@media screen and (min-width: 370px) and (min-height: 700px)
  .quote-breakdown-ios
    top: 5.5%

@media screen and (min-width: 370px) and (min-height: 734px)
  .quote-breakdown-ios
    top: 5%

@media screen and (min-width: 390px)
  .quote-breakdown-ios
    top: 5%

@media screen and (min-width: 410px)
  .quote-breakdown-ios
    top: 4.7%

@media screen and (min-width: 425px)
  .quote-breakdown-ios
    top: 4.9%

@media screen and (min-width: 500px)
  .quote-breakdown-ios
    top: 5%

@media screen and (min-width: 600px)
  .quote-breakdown-ios
    top: 5%

@media screen and (min-width: 700px)
  .quote-breakdown-ios
    top: 1.8%
</style>
