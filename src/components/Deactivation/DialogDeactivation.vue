 <template>
    <q-dialog v-model="modal" @hide="closePopUp" maximized transition-show="slide-left" transition-hide="slide-right" style="z-index: 500;">
        <q-card class="q-pa-none">
            <q-toolbar class="q-pl-xs" style="border-bottom: solid 1px lightgrey;">
                <q-btn flat round dense v-close-popup size="lg" icon="chevron_left"></q-btn>
                <q-toolbar-title v-close-popup>
                    <h6 class="q-my-none delete-account-title">{{$t('deactivate.account')}}</h6>
                </q-toolbar-title>
            </q-toolbar>

            <q-card-section class="font-normal q-mt-md">
                <p class="text-weight-bold font-title">{{$t('deactivate.account.msg')}}</p>
                <p class="text-grey-6 q-my-none">{{$t('deactivate.account.msg.description')}}</p>

                <div class="row q-mt-lg">
                  <q-card class="col-6 text-center" style="height: 110px;" @click="triggerDeactivateModal(true, 'I cannot get jobs')">
                    <q-card-section>
                      <q-icon name="work_outline" size="lg" color="primary"></q-icon>
                      <p class="q-my-none">{{$t('deactivation.cannot.get.job')}}</p>
                    </q-card-section>
                  </q-card>
                  <q-card class="col-6 text-center" style="height: 110px;" @click="triggerDeactivateModal(true, 'I am moving')">
                    <q-card-section>
                      <q-icon name="local_shipping" size="lg" color="primary"></q-icon>
                      <p class="q-my-none">{{$t('deactivation.moving')}}</p>
                    </q-card-section>
                  </q-card>
                  <q-card class="col-6 text-center" style="height: 110px;" @click="triggerDeactivateModal(true, 'I prefer others')">
                    <q-card-section>
                      <q-icon name="alt_route" size="lg" color="primary"></q-icon>
                      <p class="q-my-none">{{$t('deactivation.prefer.others')}}</p>
                    </q-card-section>
                  </q-card>
                  <q-card class="col-6 text-center" style="height: 110px;" @click="onTriggerFeedbackModal(true)">
                    <q-card-section>
                      <q-img src="statics/images/pb-logo.png" class="image-upload q-my-none" width="20%"></q-img>
                      <p class="q-my-none">{{$t('deactivation.do.not.like.petbacker')}}</p>
                    </q-card-section>
                  </q-card>
                  <q-card class="col-6 text-center" style="height: 110px;" @click="triggerOtherReasonModal(true)">
                    <q-card-section>
                      <q-icon name="bug_report" size="lg" color="primary"></q-icon>
                      <p class="q-my-none">{{$t('deactivation.something.is.broken')}}</p>
                    </q-card-section>
                  </q-card>
                  <q-card class="col-6 text-center" style="height: 110px;" @click="triggerOtherReasonModal(true)">
                    <q-card-section>
                      <q-icon name="edit" size="lg" color="primary"></q-icon>
                      <p class="q-my-none">{{$t('deactivation.other.reasons')}}</p>
                    </q-card-section>
                  </q-card>
                </div>
            </q-card-section>
        </q-card>

        <!-- Prompt Dialog -->
        <dialog-prompt :trigger="promptModal" :message="promptMessage" @on-close="triggerPromptDialog"></dialog-prompt>

        <!-- Confirmation Dialog -->
        <dialog-deactivation-confirmation :trigger="modalDeactivate" :reason="deactivationReason" @on-close="triggerDeactivateModal"></dialog-deactivation-confirmation>

        <!-- Other Reasons Dialog -->
        <dialog-other-reasons :trigger="modalOtherReasons" @on-submit="onSubmitFeedback" @on-close="triggerOtherReasonModal"></dialog-other-reasons>

        <!-- Feedback Dialog -->
        <dialog-feedback :trigger="feedbackModal" @on-submit="onSubmitFeedback" @on-close="onTriggerFeedbackModal" @on-prompt="triggerPromptDialog"></dialog-feedback>
    </q-dialog>
</template>
<script>
export default {
  components: {
    'dialog-feedback': () => import('components/Deactivation/DialogFeedback.vue'),
    'dialog-deactivation-confirmation': () => import('components/Deactivation/DialogDeactivateConfirmation.vue'),
    'dialog-prompt': () => import('components/DialogPrompt.vue'),
    'dialog-other-reasons': () => import('components/Deactivation/DialogOtherReasons.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      modal: false,
      feedbackModal: false,
      promptModal: false,
      promptMessage: '',
      modalDeactivate: false,
      deactivationReason: 'No longer need this',
      modalOtherReasons: false
    }
  },
  watch: {
    trigger (status) {
      this.modal = status
    }
  },
  methods: {
    triggerOtherReasonModal (status) {
      this.modalOtherReasons = status
    },
    onSubmitFeedback (reasons) {
      this.triggerDeactivateModal(true, reasons)
    },
    triggerDeactivateModal (status, reason = '') {
      this.modalDeactivate = status
      this.deactivationReason = reason
    },
    triggerPromptDialog (status, message = '') {
      this.promptMessage = message
      this.promptModal = status
    },
    onTriggerFeedbackModal (status) {
      this.feedbackModal = status
    },
    closePopUp () {
      this.feedbackModal = false
      this.promptModal = false
      this.modalOtherReasons = false
      this.modalDeactivate = false
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
<style lang="stylus">
.delete-account-title
  margin-left: 4%

@media screen and (min-width: 320px)
  .delete-account-title
    margin-left: 19%

@media screen and (min-width: 350px)
  .delete-account-title
    margin-left: 22%

@media screen and (min-width: 370px)
  .delete-account-title
    margin-left: 23%

@media screen and (min-width: 400px)
  .delete-account-title
    margin-left: 24%

@media screen and (min-width: 530px)
  .delete-account-title
    margin-left: 22%
</style>
