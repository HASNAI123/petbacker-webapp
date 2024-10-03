<template>
  <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-down" transition-show="slide-up">
    <q-card>
        <!-- Header -->
        <q-toolbar style="border-bottom: solid 1px lightgrey;">
            <q-toolbar-title v-close-popup>
                <h6 class="q-my-none dialog-title font-title">{{$t('decline.job.title')}}</h6>
            </q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup></q-btn>
        </q-toolbar>

        <q-card-section class="q-pa-none">
            <q-img src="statics/images/support-help.jpg"></q-img>
        </q-card-section>

        <q-card-section>
            <p class="text-grey q-mt-md" v-if="bookStatus === 0">{{$t('decline.can.be.frustrating.state.reason')}}</p>
            <p class="text-grey q-mt-md" v-if="bookStatus === 1">{{$t('number.cancellation.will.show.in.profile')}}</p>
            <q-input v-model="declineReason" type="textarea" :error="!isValid" class="input" borderless :label="$t('explain.why.cancel.here')" stack-label></q-input>
        </q-card-section>

        <!-- Mobile bottom button -->
        <div class="fixed-bottom bg-primary" style="border-top-right-radius: 15px;border-top-left-radius: 15px;">
            <div class="q-pa-md q-pb-lg" @click="checkValid">
                <div class="text-white text-center cursor-pointer font-header-title q-pt-sm">
                    <span v-if="!showLoading">{{$t('button.submit')}}</span>
                    <span v-else><q-spinner size="2em"></q-spinner></span>
                </div>
            </div>
        </div>

        <!-- Support Enquiry Submitted Dialog Box -->
        <q-dialog v-model="modalSubmitted" @hide="closePopUp">
          <q-card style="width: 360px;">
            <q-card-section>
              <div class="tip-bulb">
                  <img src="statics/images/logo-mid.jpg" class="tip-bulb-image">
              </div>
              <div class="bg-white-self">
                  <div class="row q-px-md column">
                  <div class="q-title q-pt-xl text-center tip-title"> {{  $t('app.footer.petbacker')}} </div>
                  </div>
                  <div class="row justify-center">
                    <div class="col-12 text-center q-pa-md tip-desc">
                        <span>{{$t('support_form_submitted_text')}}</span>
                    </div>
                  </div>
                  <div class='full-width q-px-md'>
                    <q-btn class="full-width" color="primary" :label="$t('ok')" @click.native="modalSubmitted=false;closePopUp()" />
                  </div>
                  <div class="row q-py-sm q-mx-auto">
                  </div>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>

    </q-card>
  </q-dialog>
</template>
<script>
import chatMixin from '../../mixins/chatMixin.js'
export default {
  mixins: [chatMixin],
  props: {
    trigger: {
      type: Boolean,
      default: false,
      required: true
    },
    bookingReference: {
      type: String
    },
    bookStatus: {
      type: Number,
      default: () => { return null }
    },
    taskId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      showLoading: false,
      declineReason: this.$t('not.interested'),
      isValid: true,
      modalSubmitted: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    },
    declineReason (value) {
      if (value !== null && value !== '' && value !== ' ') {
        this.isValid = true
      }
    }
  },
  methods: {
    checkValid () {
      if (this.declineReason === null || this.declineReason === '') {
        this.isValid = false
      }

      if (this.isValid) {
        this.onDecline()
      }
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    },
    onDecline () {
      this.showLoading = true
      let taskInfo = {
        'taskInfo': {
          'acceptanceStatus': parseInt(this.bookStatus) === 1 ? 6 : 2,
          'cancellationReason': this.declineReason
        }
      }

      if (parseInt(this.bookStatus) === 1) {
        // Inform support
        setTimeout(() => {
          this.modalSubmitted = true
          this.showLoading = false
        }, 850)
        this.sendTicket(this.SUPPORT_CATEGORY.BOOKING_CANCELLATION, 'Booking Cancellation', `I need help on cancelling job reference "${this.bookingReference}"\n\nReason: ${this.declineReason}`)
        this.closePopUp()
      } else {
        this.$axios.put(`/users/${this.$store.state.user.uuid}/tasks/${this.taskId}`, taskInfo, {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          this.$emit('on-decline')
          this.closePopUp()
        }).catch((error) => {
          console.error(error)
          let errorMessage = error.response.data ? error.response.data.message : this.$t('something.wrong.gateway')
          this.$q.notify({
            message: errorMessage,
            type: 'negative'
          })
        }).finally(_ => {
          this.showLoading = false
        })
      }
    }
  }
}
</script>
<style lang="stylus">
.dialog-title
  margin-left: 35%

.protection-bulb
  position: absolute
  top: 0
  left: calc(50% - 35px)
  padding: 10px
  background: #fff
  width: 70px
  border-radius: 50%
  margin-top: -35px
.protection-bulb-image
  width: 50px

.protection-desc
  font-size: 16px
  color: #111

.protection-title
  font-size: 20px
  color: #444

.bg-white-self
  background: #fff
  margin-top: 30px
  border-radius: 10px
</style>
