 <template>
    <q-dialog v-model="modal" @hide="closePopUp" maximized transition-show="slide-left" transition-hide="slide-right" style="z-index: 500;">
        <q-card class="q-pa-none">
            <q-toolbar class="q-pl-xs" style="border-bottom: solid 1px lightgrey;">
                <q-btn flat round dense v-close-popup size="lg" icon="chevron_left"></q-btn>
                <q-toolbar-title v-close-popup>
                    <h6 class="q-my-none feedback-title">{{$t('feedback')}}</h6>
                </q-toolbar-title>
            </q-toolbar>

            <q-card-section class="font-normal q-mt-md">
                <p class="q-my-none text-weight-bold font-title">{{$t('submit.feedback')}}</p>
                <p class="text-grey-6 q-my-none">{{$t('submit.feedback.description')}}</p>

                <div class="q-mt-lg">
                  <q-item dense class="q-px-none" clickable @click="$refs['job-feedback'].toggle()">
                    <q-item-section>
                        <q-item-label>{{$t('job.notifications.not.working')}}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-checkbox ref="job-feedback" v-model="feedbacks" val="Job notification not working"></q-checkbox>
                    </q-item-section>
                  </q-item>

                  <q-separator spaced></q-separator>

                  <q-item dense class="q-px-none" clickable @click="$refs['message-feedback'].toggle()">
                    <q-item-section>
                        <q-item-label>{{$t('message.notifications.not.working')}}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-checkbox ref="message-feedback" v-model="feedbacks" val="Message notification not working"></q-checkbox>
                    </q-item-section>
                  </q-item>

                  <q-separator spaced></q-separator>

                  <q-item dense class="q-px-none" clickable @click="$refs['app-feedback'].toggle()">
                    <q-item-section>
                        <q-item-label>{{$t('app.not.responsive')}}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-checkbox ref="app-feedback" v-model="feedbacks" val="App is often not responsive"></q-checkbox>
                    </q-item-section>
                  </q-item>

                  <q-separator spaced></q-separator>

                  <q-item dense class="q-px-none" clickable @click="$refs['chat-feedback'].toggle()">
                    <q-item-section>
                        <q-item-label>{{$t('missing.chat.messages')}}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-checkbox ref="chat-feedback" v-model="feedbacks" val="Missing chat messages"></q-checkbox>
                    </q-item-section>
                  </q-item>

                 <q-separator spaced></q-separator>

                  <q-item dense class="q-px-none" clickable @click="$refs['approval-feedback'].toggle()">
                    <q-item-section>
                        <q-item-label>{{$t('complicated.approval.process')}}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-checkbox ref="approval-feedback" v-model="feedbacks" val="Complicated approval process"></q-checkbox>
                    </q-item-section>
                  </q-item>

                  <!-- <q-separator spaced></q-separator> -->

                  <!-- <q-item dense class="q-px-none" clickable @click="$refs['other-reasons'].toggle()">
                    <q-item-section>
                        <q-item-label>Other reasons</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-checkbox ref="other-reasons" v-model="feedbacks" val="Other reasons"></q-checkbox>
                    </q-item-section>
                  </q-item> -->
                </div>
            </q-card-section>

            <div class="fixed-bottom bg-primary" :style="feedbacks.length > 0 ? '' : 'opacity: 0.7;'" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" @click="onSubmit">
                <div class="q-pa-md q-pb-lg">
                    <div class="text-white q-pb-sm text-center cursor-pointer font-header-title">
                        <span v-if="!showLoading">{{$t('button.submit')}}</span>
                        <span v-else><q-spinner size="1.5em"></q-spinner></span>
                    </div>
                </div>
            </div>
        </q-card>
    </q-dialog>
</template>
<script>
export default {
  props: {
    trigger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      modal: false,
      feedbacks: [],
      showLoading: false
    }
  },
  watch: {
    trigger (status) {
      this.modal = status
    }
  },
  methods: {
    onSubmit () {
      if (this.feedbacks.length === 0) {
        this.$emit('on-prompt', true, this.$t('form.request.error.required.checkbox'))
        return
      }

      this.$emit('on-submit', this.feedbacks.join(', '))
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
<style lang="stylus">
.feedback-title
  margin-left: 4%

@media screen and (min-width: 320px)
  .feedback-title
    margin-left: 25%

@media screen and (min-width: 350px)
  .feedback-title
    margin-left: 28%

@media screen and (min-width: 370px)
  .feedback-title
    margin-left: 29%

@media screen and (min-width: 400px)
  .feedback-title
    margin-left: 30%

@media screen and (min-width: 530px)
  .feedback-title
    margin-left: 28%
</style>
