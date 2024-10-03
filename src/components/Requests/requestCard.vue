<template>
    <q-card style="border-radius: 11px;">
        <q-card-section class="q-pb-none q-pt-sm">
            <q-item class="q-pa-none">
                <q-item-section avatar v-if="$route.name === 'Rebooking' && request && request.responseInfo.items.length > 0">
                  <q-avatar style="width:50px; height: 50px;" class="q-mr-xs">
                    <img :src="request.responseInfo.items[0].serviceInfo.avatarImage" alt="avatar" class="avatar responsive image-upload cursor-pointer"/>
                  </q-avatar>
                </q-item-section>

                <q-item-section @click="onRequestClick">
                    <!-- Request Service Name -->
                    <q-item-label class="font-header-title">
                      {{ $t(getServiceName(request.serviceId)) }}
                    </q-item-label>

                    <q-item-label v-if="$route.name === 'Rebooking' && request && request.responseInfo.items.length > 0">
                      {{ request.responseInfo.items[0].serviceInfo.userServiceName }}
                    </q-item-label>

                    <!-- Request Status -->
                    <q-item-label class="q-my-xs" v-if="$route.name !== 'Rebooking'">
                        <template v-if="request.status === STATUS.REQUEST_STATUS_PENDING">
                            <div v-if="request.totalResponses === 0">
                                <b>{{ $t('requests.page.quotesotw') }}</b>
                            </div>
                            <div v-else>
                                <b class="text-warning">{{ $t('requests.page.negotiation') }}:</b> {{ request.totalResponses }} {{ $t('requests.page.responses') }}
                            </div>
                        </template>
                        <template v-else-if="request.status === STATUS.REQUEST_STATUS_IN_PROGRESS">
                            <div v-if="request.totalResponses === 0">
                                <b>{{ $t('requests.page.quotesotw')}}</b>
                            </div>
                            <div v-else>
                                <b class="text-info">{{ $t('inbox.message.status.hired') }}:</b> {{ $t('requests.page.inprogress') }}
                            </div>
                        </template>
                        <template v-else-if="request.status === STATUS.REQUEST_STATUS_COMPLETED">
                            <b class="text-positive">{{ $t('requests.page.completed') }}</b>
                        </template>
                        <template v-else-if="request.status === STATUS.REQUEST_STATUS_CANCELLED">
                            <b class="text-negative">{{ $t('requests.page.closed') }}</b>
                        </template>
                        <template v-else-if="request.status === STATUS.REQUEST_STATUS_NO_RESULT">
                            <b>{{ $t('requests.page.quotesotw') }}</b>
                        </template>
                        <template v-else-if="request.status === STATUS.ACCEPTANCE_PARENT_CANCEL_REQUEST && request.status === STATUS.ACCEPTANCE_PARENT_CANCEL_REQUEST_AFTER_BOOK">
                            <b class="text-negative">{{ $t('requests.page.closed') }}</b>
                        </template>
                    </q-item-label>

                    <!-- Request Description Short -->
                    <q-item-label class="text-primary q-my-xs" lines="1" caption>
                      {{ request.requestDescription }}
                    </q-item-label>
                </q-item-section>

                <q-item-section side v-if="$route.name === 'Rebooking'">
                  <!-- Right Arrow -->
                  <q-btn style="width: 25px;" @click="$router.push({ name: 'RequestSummary', params: {requestId: request.id} })" class="q-mr-xs" size="xs" icon="arrow_forward_ios" flat :ripple="false"></q-btn>
                </q-item-section>
                <q-item-section side v-else>
                  <!-- 3 dots menu -->
                  <q-btn color="primary" :loading="removeLoader" style="width: 30px;" :ripple="false" flat icon="more_vert" @click="openMoreOptions"></q-btn>

                  <!-- Right Arrow -->
                  <q-btn style="width: 25px;" @click="$router.push({ name: 'RequestSummary', params: {requestId: request.id} })" class="q-mt-md q-mr-xs" size="xs" icon="arrow_forward_ios" flat :ripple="false"></q-btn>
                </q-item-section>
            </q-item>
        </q-card-section>

        <!-- Responses -->
        <q-card-section class="row q-pt-none q-pb-sm" v-if="$route.name !== 'Rebooking'">
            <div class="response-container row" v-if="request.status === STATUS.REQUEST_STATUS_IN_PROGRESS || request.status === STATUS.REQUEST_STATUS_COMPLETED">
                <div v-for="response in request.responseInfo.items" :key="response.id">
                    <q-avatar v-if="response.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_ACCEPT" style="max-width: 50px;float: left;" class="q-mr-xs">
                        <img :src="response.serviceInfo.avatarImage" alt="avatar"
                            class="avatar responsive image-upload cursor-pointer"
                            @click="toMessagePage(response.acceptanceStatus, request.id, response.id)"
                            />
                    </q-avatar>
                </div>
            </div>
            <div class="response-container row" v-else-if="request.totalResponses > 0">
                <div v-for="response in request.responseInfo.items" :key="response.id">
                    <q-avatar v-if="response.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT" style="max-width: 50px;float: left;" class="q-mr-xs">
                        <img :src="response.serviceInfo.avatarImage" alt="avatar"
                            class="avatar responsive image-upload cursor-pointer"
                            @click="toMessagePage(response.acceptanceStatus, request.id, response.id)"
                            />
                    </q-avatar>
                </div>
            </div>
            <!-- Default ICON -->
            <div class="response-container q-mt-sm" v-else-if="request.totalResponses === 0">
                <q-avatar class="float-left q-mr-sm">
                    <img src="statics/images/avatar_blue.jpg" class="responsive cursor-pointer noresponse" alt="avatar">
                </q-avatar>
                <div @click="$router.push({ name: 'RequestSummary', params: {requestId: request.id} })">
                    <p class="q-my-none q-mt-sm text-grey-8 font-x-small" v-if="checkCreatedTime(request.createdDate)">{{ $t("request.quotes.within.hour") }}</p>
                    <p class="q-my-none q-mt-sm q-mr-md text-grey-8 font-x-small" v-else>{{ $t("request.quotes.hang.on") }}</p>
                </div>
            </div>
        </q-card-section>

        <q-separator spaced inset/>

        <!-- Action Buttons -->
        <q-card-actions align="between" class="q-pt-none q-px-md q-pb-md" v-if="$route.name !== 'Rebooking'">
          <q-btn :ripple="false" color="primary" :loading="removeLoader" style="border-radius: 10px;" class="text-capitalize q-px-none" :label="$t('requests.page.cancelrequest')" @click="onTriggerCancellationModal(true)" v-if="(request.status !== STATUS.REQUEST_STATUS_CANCELLED && request.status !== STATUS.REQUEST_STATUS_COMPLETED)"></q-btn>
          <q-btn :ripple="false" color="negative" :loading="removeLoader" flat style="border-radius: 10px;" class="text-capitalize q-px-xs" icon="delete" @click="onCancelRequest(request.id, request.serviceName, true)" v-else-if="request.status === STATUS.REQUEST_STATUS_CANCELLED || request.status === STATUS.REQUEST_STATUS_COMPLETED"></q-btn>
          <q-btn :ripple="false" color="primary" :loading="reviewLoader" style="border-radius: 10px;" class="text-capitalize q-px-none" :label="$t('chat.givereview')" @click="closeRequest(request.id, request.responseInfo, request.status)" v-if="(request.status === STATUS.REQUEST_STATUS_IN_PROGRESS || request.status === STATUS.REQUEST_STATUS_COMPLETED) && request.responseInfo.totalResponses && request.responseInfo.items[0].hasReview === 0"></q-btn>
          <q-btn :ripple="false" color="primary" style="border-radius: 10px;" class="text-capitalize q-px-md" :label="$t('button.edit')" @click="$router.push({ name: 'ViewRequest', params: {requestId: request.id} })" v-if="request.status === STATUS.REQUEST_STATUS_PENDING"></q-btn>
          <!-- <q-btn :ripple="false" color="primary" style="border-radius: 10px;" class="text-capitalize q-px-xs" :label="$t('invite.another.backer')" @click="$router.push('/requests/' + request.id + '#invite-backer')" v-if="request.status === STATUS.REQUEST_STATUS_PENDING"></q-btn> -->
          <q-btn :ripple="false" color="primary" style="border-radius: 10px;" class="text-capitalize q-px-none float-right" :label="$t('requests.page.bookagainrequest')" @click.native="$router.push({ name: 'BookAgainRequest', params: {requestId: request.id, serviceUserId: request.responseInfo.items[0].serviceInfo.id} })" v-if="request.status === STATUS.REQUEST_STATUS_COMPLETED && request.responseInfo.totalResponses && request.responseInfo.items[0].completionStatus === STATUS.COMPLETION_PARENT_DEEMED_COMPLETE"></q-btn>
          <q-btn :ripple="false" color="primary" style="border-radius: 10px;" class="text-capitalize q-px-sm float-right" :label="$t('requests.page.viewrequest')" @click="$router.push({ name: 'RequestSummary', params: {requestId: request.id} })" v-else></q-btn>
        </q-card-actions>

        <!-- More options modal -->
        <q-dialog v-model="modalMoreOptions" auto-close position="bottom" >
          <q-card>
            <q-card-section>
              <q-btn flat class="full-width q-py-md text-weight-medium" @click="$router.push({ name: 'RequestSummary', params: {requestId: request.id} })" no-caps><p class="font-normal q-ma-none">{{$t('view.request.header')}}</p></q-btn>
              <q-btn flat v-if="request.status === 0 || request.status === 4" class="full-width q-py-md text-weight-medium" @click.native="$router.push({ name: 'EditRequest', params: {requestId: request.id} })" no-caps><p class="font-normal q-ma-none">{{$t('edit.this.booking')}}</p></q-btn>
              <q-btn flat class="full-width q-py-md text-weight-medium" @click="onTriggerCancellationModal(true)" no-caps><p class="font-normal q-ma-none">{{$t('cancel.this.booking')}}</p></q-btn>
              <div ><q-separator/></div>
              <q-btn flat class="full-width q-py-sm text-weight-bold" id="closeBtn" no-caps>{{$t('close')}}</q-btn>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Cancellation Dialog -->
        <dialog-cancellation :trigger="cancellationModal" :status="request.status" :requestId="request.id" :responseId="request.responseInfo.items.length > 0 ? request.responseInfo.items[0].serviceInfo.id : 0" :requestRef="request.requestReference" :bookingRef="request.responseInfo.items.length > 0 ? request.responseInfo.items[0].jobReference : request.requestReference" @refresh="onRefresh" @on-close="onTriggerCancellationModal"></dialog-cancellation>

        <!-- Dialog Prompt -->
        <dialog-prompt :trigger="promptModal" :type="typeCode" :message="promptMessage" :okButtonLabel="okBtnLabel" :cancelButtonLabel="canceblBtnLabel" @on-close="triggerPromptDialog"></dialog-prompt>
    </q-card>
</template>
<script>
/* global bugsnagClient */
import requestStatus from 'assets/request-status.json'
import services from 'assets/services.json'
import moment from 'moment'

export default {
  components: {
    'dialog-cancellation': () => import('components/Cancellation/DialogCancellation.vue'),
    'dialog-prompt': () => import('components/DialogPrompt.vue')
  },
  props: {
    request: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      STATUS: requestStatus,
      modalMoreOptions: false,
      cancellationModal: false,
      removeLoader: false,
      reviewLoader: false,
      promptModal: false,
      typeCode: 0,
      promptMessage: this.$t('booking.mark.fail'),
      okBtnLabel: this.$t('ok'),
      canceblBtnLabel: null
    }
  },
  methods: {
    triggerPromptDialog (status, promptMessage = this.$t('booking.mark.fail'), okBtn = this.$t('ok'), cancelBtn = this.$t('chat.later')) {
      this.promptMessage = promptMessage
      this.okBtnLabel = okBtn
      this.cancelBtnLabel = cancelBtn
      this.promptModal = status
    },
    onRequestClick () {
      if (this.$route.name === 'Rebooking') {
        let responseInfo = null
        if (this.request.responseInfo.items.length > 0) {
          responseInfo = this.request.responseInfo.items[0]

          let avatarImage = responseInfo.serviceInfo.avatarImage.split('/')
          responseInfo.avatar = avatarImage[avatarImage.length - 1].split('.jpg')[0]
        }

        this.$router.replace({name: 'BookAgainRequest',
          params: {requestId: this.request.id, serviceUserId: responseInfo ? responseInfo.serviceInfo.id : 0},
          query: {
            servname: responseInfo ? responseInfo.serviceInfo.userServiceName : null,
            avatar: responseInfo ? responseInfo.avatar : null
          }
        })
      } else {
        this.$router.push({ name: 'RequestSummary', params: {requestId: this.request.id} })
      }
    },
    onRefresh () {
      this.$emit('refresh-content')
    },
    onTriggerCancellationModal (status) {
      this.cancellationModal = status
    },
    getServiceName (id) {
      for (let items in services) {
        if (services[items].id === id) {
          return services[items].name
        }
      }
      return ''
    },
    openMoreOptions () {
      this.modalMoreOptions = true
    },
    toMessagePage (status, requestId, responseId) {
      if (status === this.STATUS.ACCEPTANCE_SITTER_ACCEPT || status === this.STATUS.ACCEPTANCE_PARENT_ACCEPT) {
        this.$router.push({name: 'Chat', params: {request: requestId, response: responseId}})
      } else {
        this.$q.notify({
          message: this.$t('no.response.yet.chat'),
          timeout: 1200
        })
      }
    },
    checkCreatedTime (createdDate) {
      let today = moment()
      let different = moment.duration(moment(today).diff(moment(createdDate))).as('hours')
      if (different > 1) {
        return false
      }
      return true
    },
    closeRequest (requestID, responseInfo, status) {
      if (status === this.STATUS.REQUEST_STATUS_IN_PROGRESS) {
        // TODO: add nicer dialog instead of $q.dialog
        this.$q.dialog({
          title: this.$t('confirmation'),
          message: this.$t('mark.complete.before.review'),
          ok: this.$t('yes'),
          cancel: this.$t('no')
        }).onOk(() => {
          this.$route.params.response = responseInfo.items[0].id
          this.$route.params.request = requestID
          this.markRequestComplete(responseInfo)
        })
      } else {
        this.$router.push({ name: 'ReviewVerified', params: {request: requestID, response: responseInfo.items[0].id} })
      }
    },
    markRequestComplete (serviceUserID) {
      this.reviewLoader = true
      let responseInfo = JSON.stringify({
        'responseInfo': {
          'acceptanceStatus': this.STATUS.ACCEPTANCE_PARENT_ACCEPT,
          'completionStatus': this.STATUS.COMPLETION_PARENT_DEEMED_COMPLETE
        }
      })

      this.$axios.put(`users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}`, responseInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$q.notify({
          message: this.$t('booking.mark.complete'),
          type: 'positive',
          position: 'top'
        })

        this.$router.push({ name: 'ReviewVerified', params: {request: this.$route.params.request, response: this.$route.params.response} })
      }).catch((e) => {
        console.log(e)
        let lang = this.$store.getters['user/getCurrentLanguage']
        let path = `users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}`
        bugsnagClient.notify(new Error(e), {
          beforeSend: function (report) {
            report.metaData = {
              accountInfo: {
                language: lang,
                API: path
              }
            }
          }
        })

        if (e.response && e.response.data) {
          this.triggerPromptDialog(true, e.response.data.message)
        } else {
          this.triggerPromptDialog(true)
        }
      }).finally(_ => {
        this.reviewLoader = false
      })
    },
    onCancelRequest (requestId, requestServiceName, onDelete = false) {
      this.$q.dialog({
        title: this.$t('confirmation'),
        message: this.$t('confirmation.delete.request', {requestServiceName: requestServiceName}),
        ok: this.$t('yes'),
        cancel: this.$t('no')
      }).onOk(() => {
        this.removeLoader = true
        this.$axios.delete(`users/${this.$store.state.user.uuid}/requests/${requestId}`, {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then(response => {
          this.modalMoreOptions = false
          this.$emit('refresh-content')
          setTimeout(() => {
            this.$q.notify({
              message: this.$t('request.deleted', {requestServiceName: requestServiceName}),
              position: 'top',
              type: 'positive'
            })
          }, 950)
        }).catch(error => {
          console.error(error)
          bugsnagClient.notify(new Error(requestServiceName + ' (' + requestId + ')  request failed to be delete'))

          if (error.response && error.response.data) {
            this.triggerPromptDialog(true, error.response.data.message)
          } else {
            this.triggerPromptDialog(true)
          }
        }).finally(_ => {
          setTimeout(() => {
            this.removeLoader = false
          }, 950)
        })
      })
    }
  }
}
</script>
