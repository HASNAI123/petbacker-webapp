<template>
  <div class="row">
    <div v-if="edit" thumbnail class="col-2">
      <q-checkbox ref="job-checkbox" v-model="checkBoxSelection" :disable="(!checkPassRequiredTime() && parseInt(jobInfo.acceptanceStatus) !== status.ACCEPTANCE_SITTER_REJECT && parseInt(jobInfo.acceptanceStatus) !== status.ACCEPTANCE_SITTER_REJECT_AFTER_BOOK && parseInt(jobInfo.acceptanceStatus) !== status.ACCEPTANCE_PARENT_REJECT && parseInt(jobInfo.acceptanceStatus) !== status.ACCEPTANCE_PARENT_CANCEL_REQUEST && parseInt(jobInfo.completionStatus) === status.COMPLETION_NO_RESPONSE)" @input="onEditSelected" class="q-ml-xs" style="position: relative;top: 40%;"></q-checkbox>
    </div>

    <q-card v-touch-hold:330.mouse="onHold" style="border-radius: 11px;" class="q-pa-none col"
    :style="(edit && (!checkPassRequiredTime() && parseInt(jobInfo.acceptanceStatus) !== status.ACCEPTANCE_SITTER_REJECT && parseInt(jobInfo.acceptanceStatus) !== status.ACCEPTANCE_SITTER_REJECT_AFTER_BOOK && parseInt(jobInfo.acceptanceStatus) !== status.ACCEPTANCE_PARENT_REJECT && parseInt(jobInfo.acceptanceStatus) !== status.ACCEPTANCE_PARENT_CANCEL_REQUEST && parseInt(jobInfo.completionStatus) === status.COMPLETION_NO_RESPONSE)) ? 'opacity: 0.5;' : ''"
    :class="(jobInfo.read === 0 && (parseInt(jobInfo.acceptanceStatus) !== status.ACCEPTANCE_PARENT_REJECT && parseInt(jobInfo.acceptanceStatus) !== status.ACCEPTANCE_PARENT_CANCEL_REQUEST)) || (edit && checkBoxSelection)  ? 'unread-notification' : 'read-notification'" >
        <q-card-section @click="onTriggerSummaryModal(true)" class="q-pb-sm">
            <q-item class="q-pa-none">
                <q-item-section>
                    <!-- Request Name -->
                    <q-item-label class="font-header-title">
                      {{jobInfo.requestInfo.requestorInfo.username}}
                      <span class="float-right text-grey" style="font-size: 11px;">{{formatCreatedTime(jobInfo.assignedDate)}}</span>
                    </q-item-label>

                    <!-- Request Description Short -->
                    <q-item-label caption>{{jobInfo.requestInfo.requestDescription}}</q-item-label>
                    <q-item-label class="text-primary" style="margin-top: 0px;">
                        <!-- Request Service Type -->
                        <q-item dense>
                            <q-item-section thumbnail class="q-pr-sm">
                                <q-icon name="fas fa-clipboard-check" size="16px"></q-icon>
                            </q-item-section>
                            <q-item-section class="font-small">{{$t(getServiceName(jobInfo.requestInfo.serviceId))}}</q-item-section>
                        </q-item>

                        <!-- Required Date (time to required date) -->
                        <q-item dense style="margin-top: -10px;" class="q-pr-none">
                            <q-item-section thumbnail class="q-pr-sm">
                              <q-icon name="far fa-clock" size="16px"></q-icon>
                            </q-item-section>
                            <q-item-section class="font-small">{{formatDaysToJob(jobInfo.requestInfo.requiredTime)}}</q-item-section>
                            <q-icon class="float-right" name="chevron_right" size="2em"></q-icon>
                        </q-item>
                    </q-item-label>
                </q-item-section>
            </q-item>
        </q-card-section>
        <q-card-section class="row q-pt-none q-pb-sm" @click="onTriggerSummaryModal(true)">
          <!-- Personal Items Icons -->
          <q-item-label v-if="jobInfo.requestInfo.personalItemInfo && jobInfo.requestInfo.personalItemInfo.items && jobInfo.requestInfo.personalItemInfo.items.length > 0"  class="font-header-title text-left text-primary col-7 row" style="padding-left: 20px;">
            <q-item v-for="index in jobInfo.requestInfo.personalItemInfo.items.length > 3 ? 3 : jobInfo.requestInfo.personalItemInfo.items.length" :key="jobInfo.requestInfo.personalItemInfo.items[index - 1].id" dense class="q-pa-none" style="border-radius: 25px;" clickable>
              <q-item-section thumbnail style="margin-left: -20px;">
                <q-avatar style="width: 50px;height: 50px;">
                  <img v-if="jobInfo" style="min-width: 50px;" :src="jobInfo.requestInfo.personalItemInfo.items[index - 1].mediaInfo[0].filePath" class="image-upload avatar responsive cursor-pointer q-mx-xs" alt="Personal Item Image Icon" />
                </q-avatar>
              </q-item-section>

              <q-item-section side v-if="index === 3 && jobInfo.requestInfo.personalItemInfo.items.length > 3">
                <q-item-label caption>+ {{jobInfo.requestInfo.personalItemInfo.items.length - 3}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-item-label>

          <!-- Service Icons -->
          <q-item-label v-else class="font-header-title text-left text-primary col-7 row">
            <q-avatar>
              <img v-if="jobInfo" :src="getServiceImage(jobInfo.requestInfo.serviceId)" class="avatar responsive cursor-pointer q-mx-xs" alt="Job Type Icon" />
              <q-spinner v-else></q-spinner>
            </q-avatar>
          </q-item-label>

          <!-- Job Status -->
          <q-item-label class="font-header-title text-right col-5" v-if="parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_NO_RESPONSE">
            <p :class="jobInfo.requestInfo.jobAssignedToServiceUserId ? 'q-my-none' : 'q-my-sm'">
              <span class="text-positive"><q-icon name="fas fa-hand-holding-heart" class="q-mr-sm " size="14px"></q-icon>{{$t('earn.now')}}</span><br/>
              <span class="font-small text-weight-light text-primary" v-if="jobInfo.requestInfo.jobAssignedToServiceUserId && jobInfo.requestInfo.jobAssignedToServiceUserId === $store.getters['user/getUserUuidState']">{{$t('being.preferred')}}</span>
            </p>
          </q-item-label>
          <q-item-label class="font-header-title text-right text-info col-5" v-else-if="parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_PARENT_ACCEPT && parseInt(jobInfo.completionStatus) === status.COMPLETION_PARENT_DEEMED_COMPLETE">
            <p class="q-my-sm"><q-icon name="far fa-calendar-check" class="q-mr-sm" size="14px"></q-icon>{{$t('requests.page.completed')}}</p>
          </q-item-label>
          <q-item-label class="font-header-title text-right text-negative col-5" v-else-if="(parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_PARENT_REJECT || parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_PARENT_CANCEL_REQUEST) && parseInt(jobInfo.completionStatus) === status.COMPLETION_NO_RESPONSE">
            <p class="q-my-sm">{{$t('no.more')}}</p>
          </q-item-label>
          <q-item-label class="font-header-title text-right text-negative col-5" v-else-if="(parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_SITTER_REJECT || parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_SITTER_REJECT_AFTER_BOOK) && parseInt(jobInfo.completionStatus) === status.COMPLETION_NO_RESPONSE">
            <p class="q-my-sm"><q-icon name="far fa-calendar-times" class="q-mr-sm" size="14px"></q-icon>{{$t('inbox.message.status.declined')}}</p>
          </q-item-label>
          <q-item-label class="font-header-title text-right text-warning col-5" v-else-if="parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_SITTER_ACCEPT">
            <p class="q-my-sm"><q-icon name="fas fa-comments-dollar" class="q-mr-sm" size="14px"></q-icon>{{$t('negotiating')}}</p>
          </q-item-label>
          <q-item-label class="font-header-title text-right text-info col-5" v-else-if="parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_PARENT_ACCEPT">
            <p class="q-my-sm"><q-icon name="fas fa-thumbtack" class="q-mr-sm" size="14px"></q-icon>{{$t('inbox.message.status.hired')}}</p>
          </q-item-label>
          <q-item-label class="font-header-title text-right text-negative col-5" v-else-if="parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_PARENT_CANCEL">
            <p class="q-my-sm"><q-icon name="far fa-calendar-times" class="q-mr-sm" size="14px"></q-icon>{{$t('requests.page.closed')}}</p>
          </q-item-label>
        </q-card-section>

        <q-separator inset/>

        <!-- Card Actions -->
        <q-card-actions align="between" class="q-px-md q-pb-md">
          <q-btn color="primary" :ripple="false" style="border-radius: 10px;" class="text-capitalize q-px-xs" :label="$t('decline')" v-if="(parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_NO_RESPONSE || parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_SITTER_ACCEPT) && jobInfo.requestInfo.jobAssignedToServiceUserId && (jobInfo.requestInfo.jobAssignedToServiceUserId === $store.getters['user/getUserUuidState'])" @click="triggerDeclineModal(true)"></q-btn>
          <q-btn color="primary"  :ripple="false" :loading="deleteLoader" style="border-radius: 10px;" class="text-capitalize q-px-xs" :label="$t('decline')" v-else-if="(parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_NO_RESPONSE ||  parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_SITTER_ACCEPT)" @click="onRemoveTask(false)"></q-btn>
          <q-btn color="primary" :ripple="false" style="border-radius: 10px;" class="text-capitalize q-px-xs" :label="$t('dispute')" v-else-if="(parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_PARENT_ACCEPT) && parseInt(jobInfo.completionStatus) === status.COMPLETION_NO_RESPONSE" @click="triggerDeclineModal(true)"></q-btn>
          <q-btn flat color="negative" :loading="deleteLoader" :ripple="false" class="text-capitalize q-px-xs" icon="delete" v-else-if="!edit && (parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_SITTER_REJECT || parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_SITTER_REJECT_AFTER_BOOK || parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_PARENT_REJECT || parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_PARENT_CANCEL_AFTER_BOOK || parseInt(jobInfo.completionStatus) === status.COMPLETION_PARENT_DEEMED_COMPLETE)" @click="onRemoveTask"></q-btn>
          <q-btn color="primary" :ripple="false" style="border-radius: 10px;" class="text-capitalize q-px-xs" :label="$t('mark.job.complete')" v-if="(parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_PARENT_ACCEPT) && parseInt(jobInfo.completionStatus) === status.COMPLETION_NO_RESPONSE" @click="modalMarkJobComplete = true"></q-btn>
          <q-btn color="primary" :ripple="false" style="border-radius: 10px;" class="text-capitalize q-px-xs" :label="$t('chat.reviewnow')" v-else-if="(parseInt(jobInfo.completionStatus) === status.COMPLETION_PARENT_DEEMED_COMPLETE) && jobInfo.applicantRating === 0" @click="modalMarkJobComplete = true"></q-btn>
          <q-btn color="primary" :ripple="false" style="border-radius: 10px;" class="text-capitalize q-px-xs" :label="parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_NO_RESPONSE ? $t('referrals.easystart1') : $t('view')" v-if="parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_NO_RESPONSE || parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_SITTER_ACCEPT" @click="onTriggerSummaryModal(true)"></q-btn>
        </q-card-actions>
    </q-card>

    <!-- More options modal -->
    <q-dialog v-model="modalMoreOptions" auto-close position="bottom">
      <q-card class="no-select">
        <q-card-section class="no-select">
          <q-btn flat class="full-width q-py-md text-weight-medium text-negative" v-if="(parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_NO_RESPONSE || parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_SITTER_ACCEPT) && jobInfo.requestInfo.jobAssignedToServiceUserId && (jobInfo.requestInfo.jobAssignedToServiceUserId === $store.getters['user/getUserUuidState'])" @click="triggerDeclineModal(true)" no-caps><p class="no-select font-normal q-ma-none">{{$t('decline')}}</p></q-btn>
          <q-btn flat class="full-width q-py-md text-weight-medium text-negative" v-else-if="(parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_NO_RESPONSE ||  parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_SITTER_ACCEPT)" @click="onRemoveTask(false)" no-caps><p class="no-select font-normal q-ma-none">{{$t('decline')}}</p></q-btn>
          <q-btn flat class="full-width q-py-md text-weight-medium text-negative" v-else-if="(parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_PARENT_ACCEPT) && parseInt(jobInfo.completionStatus) === status.COMPLETION_NO_RESPONSE" @click="triggerDeclineModal(true)" no-caps><p class="no-select font-normal q-ma-none">{{$t('dispute')}}</p></q-btn>
          <q-btn flat class="full-width q-py-md text-weight-medium text-negative" v-else-if="parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_SITTER_REJECT || parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_SITTER_REJECT_AFTER_BOOK || parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_PARENT_REJECT || parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_PARENT_CANCEL_AFTER_BOOK || parseInt(jobInfo.completionStatus) === status.COMPLETION_PARENT_DEEMED_COMPLETE" @click="onRemoveTask" no-caps><p class="no-select font-normal q-ma-none">{{$t('delete')}}</p></q-btn>
          <q-btn flat class="full-width q-py-md text-weight-medium" @click="triggerEdit(!edit)" no-caps><p class="no-select font-normal q-ma-none">{{$t('requests.page.editrequest')}}</p></q-btn>
          <div ><q-separator/></div>
          <q-btn flat class="full-width q-py-sm text-weight-bold" id="closeBtn" no-caps><p class="no-select font-normal q-ma-none">{{$t('close')}}</p></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Mark Job Complete Dialog -->
    <dialog-markcomplete :trigger="modalMarkJobComplete" :responseInfo="jobInfo" :scanRequired="jobInfo.hasOwnProperty('scanMarkCompleteRequired') ? jobInfo.scanMarkCompleteRequired : 1" @on-mark-complete="onMarkJobCompleted" @on-close="onCloseMarkJobCompleteModal"></dialog-markcomplete>

    <!-- Decline Dialog -->
    <dialog-jobdecline :trigger="declineModal" @on-decline="onDecline" :bookingReference="jobInfo.jobReference" :bookStatus="parseInt(jobInfo.acceptanceStatus) === status.ACCEPTANCE_PARENT_ACCEPT ? 1 : 0" :taskId="parseInt(jobInfo.id)" @on-close="triggerDeclineModal" v-if="jobInfo"></dialog-jobdecline>

    <!-- Dialog Job Summary -->
    <dialog-summary ref="job-summary" :trigger="summaryModal" @on-refresh="onRefresh" @on-decline="onDecline" :taskId="jobInfo.id" @on-open="onOpenSummary" @on-loaded="onLoaded" @on-close="onTriggerSummaryModal"></dialog-summary>
  </div>
</template>
<script>
import requestStatus from 'assets/request-status.json'
import services from 'assets/services.json'
import moment from 'moment'
export default {
  components: {
    'dialog-summary': () => import('components/JobCenter/DialogJobSummary.vue'),
    'dialog-jobdecline': () => import('components/JobCenter/DialogDeclineJob.vue'),
    'dialog-markcomplete': () => import('components/MarkComplete/DialogMarkJobComplete.vue')
  },
  props: {
    jobInfo: {
      type: Object,
      required: true
    },
    index: {
      type: Number
    },
    edit: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      status: requestStatus,
      declineModal: false,
      deleteLoader: false,
      modalMarkJobComplete: false,
      summaryModal: false,
      modalMoreOptions: false,
      checkBoxSelection: false
    }
  },
  watch: {
    edit (status) {
      if (status === false) {
        this.checkBoxSelection = false
      }
    }
  },
  methods: {
    onRefresh (acceptanceStatus) {
      this.$emit('on-first-quote', this.index, acceptanceStatus)
    },
    checkPassRequiredTime () {
      if (parseInt(this.jobInfo.acceptanceStatus) === this.status.ACCEPTANCE_NO_RESPONSE) {
        let today = moment()
        let diffTime = moment.duration(moment(today).diff(moment(this.jobInfo.requestInfo.requiredTime))).as('days')
        if (diffTime >= 1) {
          return true
        }
      }

      return false
    },
    onEditSelected (status) {
      if (status) {
        this.$emit('on-selected', this.jobInfo.id, this.index)
      } else {
        this.$emit('on-deselected', this.jobInfo.id, this.index)
      }
    },
    triggerEdit (status) {
      this.$emit('on-edit', status)
    },
    onHold () {
      if (this.edit === false) {
        this.modalMoreOptions = true
      }
    },
    onLoaded (payload) {
      this.$emit('on-refresh', this.index, payload)
    },
    onOpenSummary () {
      this.$emit('on-open', this.index)
    },
    onTriggerSummaryModal (status) {
      if (this.edit) {
        this.$refs['job-checkbox'].toggle()
        return
      }

      this.summaryModal = status
    },
    onDecline () {
      if (this.edit) {
        this.$refs['job-checkbox'].toggle()
        return
      }

      this.$emit('on-decline', this.index)
      this.$refs['job-summary'].refresh()
    },
    onRemoveTask (onRemove = false) {
      this.$q.dialog({
        title: this.$t('confirmation'),
        message: onRemove ? this.$t('remove.job.confirmation.description') : this.$t('are.you.sure.cancel.this.job'),
        ok: this.$t('yes'),
        cancel: this.$t('no')
      }).onOk(() => {
        this.deleteLoader = true
        // decline job
        if ((parseInt(this.jobInfo.acceptanceStatus) === this.status.ACCEPTANCE_NO_RESPONSE) || (parseInt(this.jobInfo.acceptanceStatus) === this.status.ACCEPTANCE_SITTER_ACCEPT)) {
          let taskInfo = {
            'taskInfo': {
              'acceptanceStatus': parseInt(this.jobInfo.bookStatus) === 1 ? this.status.ACCEPTANCE_SITTER_REJECT_AFTER_BOOK : this.status.ACCEPTANCE_SITTER_REJECT,
              'cancellationReason': ''
            }
          }

          this.$axios.put(`users/${this.$store.state.user.uuid}/tasks/${this.jobInfo.id}`, taskInfo, {
            headers: {
              Authorization: this.$store.getters['user/authorizationHeader']
            }
          }).then((response) => {
            this.$emit('on-decline', this.index)
            this.$refs['job-summary'].refresh()
          }).catch((error) => {
            console.error(error)
            let errorMessage = error.response.data ? error.response.data.message : this.$t('something.wrong.gateway')
            this.$q.notify({
              message: errorMessage,
              type: 'negative',
              position: 'top'
            })
          }).finally(_ => {
            setTimeout(() => {
              this.deleteLoader = false
            }, 650)
          })
        } else {
          // archived job
          this.$axios.delete(`users/${this.$store.getters['user/getUserUuidState']}/tasks/${this.jobInfo.id}`, {
            headers: {
              Authorization: this.$store.getters['user/authorizationHeader']
            }
          }).then((response) => {
            setTimeout(() => {
              this.$q.notify({
                message: this.$t('job.deleted', {requestServiceName: `${this.jobInfo.requestInfo.requestorInfo.username} ${this.$t(this.getServiceName(this.jobInfo.requestInfo.serviceId))}`}),
                type: 'positive',
                position: 'top'
              })
            }, 250)
            this.$emit('on-remove', this.index)
          }).catch((error) => {
            console.error(error)
            let errorMessage = error.response.data ? error.response.data.message : this.$t('something.wrong.gateway')
            this.$q.notify({
              message: errorMessage,
              type: 'negative',
              position: 'top'
            })
          }).finally(_ => {
            setTimeout(() => {
              this.deleteLoader = false
            }, 650)
          })
        }
      }).onCancel(() => {
      })
    },
    onMarkJobCompleted () {
      if (this.edit) {
        this.$refs['job-checkbox'].toggle()
        return
      }

      this.$emit('on-mark-job-complete', this.index)
    },
    onCloseMarkJobCompleteModal (status) {
      this.modalMarkJobComplete = status
    },
    triggerDeclineModal (value) {
      this.declineModal = value
    },
    getServiceName (id) {
      return this.$_.findWhere(services, {'id': parseInt(id)}).name
    },
    getServiceImage (serviceType) {
      return this.$_.findWhere(services, {'id': parseInt(serviceType)}).icon
    },
    formatDaysToJob (requiredTime) {
      let today = moment()
      if (today <= moment.utc(requiredTime).local()) {
        return this.$t('jobs.starts.in.description', {startTimeFromNow: moment.utc(requiredTime).local().fromNow()})
      } else if (today > moment.utc(requiredTime).local()) {
        return this.$t('jobs.past.description', {pastTimeFromNow: moment.utc(requiredTime).local().fromNow()})
      }
    },
    formatCreatedTime (time) {
      // Get the language from the Vuex store
      const userLanguage = this.$store.state.user.language

      // Set Moment.js locale based on user's language
      if (userLanguage === 'en') {
        moment.locale('en')
      } else if (userLanguage === 'frfr') {
        moment.locale('fr')
      } else if (userLanguage === 'eses') {
        moment.locale('es')
      } else if (userLanguage === 'msmy') {
        moment.locale('ms-my')
      } else if (userLanguage === 'dede') {
        moment.locale('de')
      } else if (userLanguage === 'idid') {
        moment.locale('id')
      } else if (userLanguage === 'sksk') {
        moment.locale('sk')
      } else if (userLanguage === 'itit') {
        moment.locale('it')
      } else if (userLanguage === 'cscs') {
        moment.locale('cs')
      } else if (userLanguage === 'zhcn') {
        moment.locale('zh-cn')
      } else if (userLanguage === 'thth') {
        moment.locale('th')
      }
      // ... Add more conditions as needed for other languages

      return moment.utc(time).local().fromNow()
    }
  }
}
</script>
