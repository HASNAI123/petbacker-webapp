<template>
    <q-dialog v-model="modal" @hide="closeModal" maximized transition-show="slide-up" transition-hide="slide-down">
        <q-card>
          <q-toolbar style="border-bottom: solid 1px lightgrey;">
            <q-btn flat round dense @click="onBack" style="font-size: 1.3em;" icon="chevron_left" v-if="steps !== 3 && steps !== 6"/>
            <q-toolbar-title class="text-center" v-if="steps === 3 || steps === 6">
              <h6 class="q-my-none font-title">{{$t('cancel.this.booking')}}</h6>
            </q-toolbar-title>
            <q-toolbar-title v-else>
              <h6 class="q-my-none font-title" style="margin-left: 23%;">{{$t('cancel.this.booking')}}</h6>
            </q-toolbar-title>
          </q-toolbar>

          <q-card-section v-if="steps === 0">
            <p class="text-weight-medium font-normal q-mx-sm">{{$t('cancellation.why')}}</p>

            <!-- Cancellation Options -->
            <q-list class="cancelOptions q-mt-lg q-mx-sm" separator>
              <!-- Change Date or Duration -->
              <q-item clickable v-ripple @click.native="onSelectChangeDuration">
                <q-item-section>
                  <q-item-label>{{$t('cancellation.change.date.of.request')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>

              <!-- Decline Backer -->
              <q-item clickable v-ripple @click.native="steps = 7" v-if="$route.name !== 'MobileDashboard' && status === 0 && responseId">
                <q-item-section>
                  <q-item-label>{{$t('decline.backer.offer')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>

              <!-- Change Backer -->
              <q-item clickable v-ripple @click.native="steps = 1" v-if="status === 1">
                <q-item-section>
                  <q-item-label>{{$t('change.backer')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>

              <!-- Change Date or Duration -->
              <q-item clickable v-ripple @click.native="steps = 4">
                <q-item-section>
                  <q-item-label>{{$t('travel.plans.changed')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>

              <!-- Cancel Request -->
              <q-item clickable v-ripple @click.native="steps = 4">
                <q-item-section>
                  <q-item-label>{{$t('do.not.need.this.request')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>

              <!-- Help Center -->
               <q-item clickable v-ripple @click.native="goTo('HelpCenter')">
                <q-item-section>
                  <q-item-label>{{$t('need.help.with.request')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <!-- Change Backers -->
          <q-card-section v-if="steps === 1">
            <p class="text-weight-medium font-normal q-mx-sm">{{$t('change.backer.description')}}</p>
            <p class="text-weight-medium font-normal q-mx-sm">{{$t('cancellation.will.reduce.backer.rating')}}</p>

            <!-- Change Backers Options -->
            <q-list class="q-mt-lg cancelOptions q-mx-sm" separator>
              <!-- Proceed -->
              <q-item clickable @click.native="proceed">
                <q-item-section>
                  <q-item-label>{{$t('yes.proceed')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>

              <!-- Contact Support -->
              <q-item clickable @click.native="goTo('ChatSupportHelp')">
                <q-item-section>
                  <q-item-label>{{$t('would.like.to.contact.support')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>

              <!-- I will do this later -->
              <q-item clickable @click.native="closeModal">
                <q-item-section>
                  <q-item-label>{{$t('do.this.later')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <!-- Change Backer Reason -->
          <q-card-section v-else-if="steps === 2">
            <p class="text-weight-medium font-normal q-mx-sm">{{$t('change.backer.prompt.reasons')}}</p>

            <q-input v-model="reasons" borderless class="input q-mb-lg q-mx-sm" input-style="height: 200px;" type="textarea" placeholder="Type your reasons here"></q-input>

            <q-list class="cancelOptions q-mt-xl q-mx-sm" separator>
              <!-- Proceed -->
              <q-item  clickable @click.native="onChangeBacker(2)">
                <q-item-section>
                  <q-item-label>{{$t('change.backer.title')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios" v-if="!loader"></q-icon>
                  <q-spinner v-else style="font-size: 1.3em"></q-spinner>
                </q-item-section>
              </q-item>

              <!-- I will do this later -->
              <q-item clickable @click.native="closeModal">
                <q-item-section>
                  <q-item-label>{{$t('do.this.later')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <!-- Change Backer Successful -->
          <q-card-section v-else-if="steps === 3">
            <p class="text-weight-medium font-normal q-mx-sm">{{$t('change.backer.description')}}</p>
            <p class="text-weight-medium font-normal q-mx-sm">{{$t('change.backer.payment.description')}}</p>
            <p class="text-weight-medium font-normal q-mx-sm">{{$t('thank.you.for.using.petbacker')}}</p>

            <div class="text-center">
              <q-btn color="primary" class="text-center" @click="closeModal">{{$t('go.back.to.home')}}</q-btn>
            </div>
          </q-card-section>

          <!-- Cancel Request -->
          <q-card-section v-else-if="steps === 4">
            <p class="text-weight-medium font-normal q-mx-sm">
              <span v-if="status === 1">{{$t('booking.with.this.backer.will.be.cancelled')}}</span>
              {{$t('request.will.be.cancelled.make.new.request.again')}}
              <span v-if="status === 1"><br/><br/> {{$t('cancellation.deposit.returned.with.processing.fees')}}</span>
              <span v-if="status === 1" v-html="$t('find.out.cancellation.here')"></span>
              <span v-if="status === 1"><br/>{{$t('you.may.choose.one.options')}}</span>
            </p>

            <q-list class="q-mt-lg cancelOptions q-mx-sm" separator>
              <!-- wiht 10% voucher -->
              <q-item clickable @click.native="cancellationType = 1;proceed()" v-if="status === 1">
                <q-item-section>
                  <q-item-label>{{$t('cancellation.refund.back.with.voucher')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>

              <!-- full refund on wallet -->
              <q-item clickable @click.native="cancellationType = 2;proceed()" v-if="status === 1">
                <q-item-section>
                  <q-item-label>{{$t('cancellation.keep.all.in.wallet')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>

               <!-- full refund on wallet -->
              <q-item clickable @click.native="proceed" v-if="status === 0">
                <q-item-section>
                  <q-item-label>{{$t('yes.proceed')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>

              <!-- I will do this later -->
              <q-item clickable @click.native="closeModal">
                <q-item-section>
                  <q-item-label>{{$t('do.this.later')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <!-- Cancel Request Reasons -->
          <q-card-section v-else-if="steps === 5">
            <p class="text-weight-medium font-normal q-mx-sm">{{$t('cancel.request.prompt.reasons')}}</p>

            <q-input v-model="reasons" borderless class="input q-mb-lg q-mx-sm" input-style="height: 200px;" type="textarea" :placeholder="$t('cancel.reasons')"></q-input>

            <q-list class="cancelOptions q-mt-lg q-mx-sm" separator>
              <q-item clickable>
                <q-item-section @click.native="onCancelRequest">
                  <q-item-label>{{$t('cancel.this.request')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios" v-if="!loader"></q-icon>
                  <q-spinner v-else style="font-size: 1.3em"></q-spinner>
                </q-item-section>
              </q-item>

              <q-item clickable @click.native="closeModal">
                <q-item-section>
                  <q-item-label>{{$t('do.this.later')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <!-- Cancel Request Successful -->
          <q-card-section v-else-if="steps === 6">
            <p class="text-weight-medium font-normal q-mx-sm" v-if="status === 0 || status === 3">{{$t('request.have.been.cancelled')}}</p>
            <p class="text-weight-medium font-normal q-mx-sm" v-else-if="status === 1">{{$t('booking.will.be.cancelled.within.24.hours')}}</p>

            <div class="text-center">
              <q-btn color="primary" class="text-center" @click="closeModal">{{$t('go.back.to.home')}}</q-btn>
            </div>
          </q-card-section>

          <!-- Decline Backer -->
          <q-card-section v-if="steps === 7">
            <p class="text-weight-medium font-normal q-mx-sm">{{$t('decline.backer.offer.description')}}</p>

            <!-- Change Backers Options -->
            <q-list class="q-mt-lg cancelOptions q-mx-sm" separator>
              <!-- Proceed -->
              <q-item clickable @click.native="declineBacker">
                <q-item-section>
                  <q-item-label>{{$t('yes.proceed')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios" v-if="!loader"></q-icon>
                  <q-spinner v-else style="font-size: 1.3em"></q-spinner>
                </q-item-section>
              </q-item>

              <!-- I will do this later -->
              <q-item clickable @click.native="closeModal">
                <q-item-section>
                  <q-item-label>{{$t('do.this.later')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <!-- Change Date or Duration (Start Time) -->
          <q-card-section v-if="steps === 8">
            <p class="text-weight-medium font-normal q-mx-sm">{{$t('pick.new.start.time.and.date')}}</p>

            <!-- Date Selector -->
            <q-input class="input q-mx-sm" readonly v-model="serviceStart.date" @click.native="$refs.qDate.show()" borderless dense>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer" style="margin-right: 10px;">
                  <q-dialog ref="qDate" transition-show="scale" transition-hide="scale">
                    <q-date class="full-width" v-model="serviceStart.date" @input="$refs.qDate.hide()" :options="checkDate" mask="YYYY-MM-DD"></q-date>
                  </q-dialog>
                </q-icon>
              </template>
            </q-input>
            <!-- Time Selector -->
            <q-input class="input q-mx-sm" v-model="serviceStart.time" readonly @click.native="$refs.qTime.show()"  mask="##:##" style="margin-top: 25px;" borderless dense>
              <template v-slot:prepend>
                  <q-icon name="access_time" class="cursor-pointer" style="margin-right: 10px;">
                    <q-dialog ref="qTime" transition-show="scale" transition-hide="scale">
                      <q-time class="full-width" v-model="serviceStart.time" mask="HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('done')" color="primary" flat ></q-btn>
                        </div>
                      </q-time>
                    </q-dialog>
                  </q-icon>
              </template>
            </q-input>

            <q-list class="q-mt-xl cancelOptions q-mx-sm" separator>
              <!-- Proceed -->
              <q-item clickable @click.native="steps++">
                <q-item-section>
                  <q-item-label>{{$t('yes.proceed')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios" v-if="!loader"></q-icon>
                  <q-spinner v-else style="font-size: 1.3em"></q-spinner>
                </q-item-section>
              </q-item>

              <!-- I will do this later -->
              <q-item clickable @click.native="closeModal">
                <q-item-section>
                  <q-item-label>{{$t('do.this.later')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <!-- Change Date or Duration (End Time) -->
          <q-card-section v-if="steps === 9">
            <p class="text-weight-medium font-normal q-mx-sm">{{$t('pick.new.end.time.and.date')}}</p>

            <!-- Date Selector -->
            <q-input class="input q-mx-sm" readonly v-model="serviceEnd.date" @click.native="$refs.qDate.show()" borderless dense>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer" style="margin-right: 10px;">
                  <q-dialog ref="qDate" transition-show="scale" transition-hide="scale">
                    <q-date class="full-width" v-model="serviceEnd.date" @input="$refs.qDate.hide()" :events="[MOMENT(serviceStart.date).format('YYYY/MM/DD')]" :options="checkEndDate" mask="YYYY-MM-DD"></q-date>
                  </q-dialog>
                </q-icon>
              </template>
            </q-input>
            <!-- Time Selector -->
            <q-input class="input q-mx-sm" v-model="serviceEnd.time" readonly @click.native="$refs.qTime.show()"  mask="##:##" style="margin-top: 25px;" borderless dense>
              <template v-slot:prepend>
                  <q-icon name="access_time" class="cursor-pointer" style="margin-right: 10px;">
                    <q-dialog ref="qTime" transition-show="scale" transition-hide="scale">
                      <q-time class="full-width" v-model="serviceEnd.time" mask="HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('done')" color="primary" flat ></q-btn>
                        </div>
                      </q-time>
                    </q-dialog>
                  </q-icon>
              </template>
            </q-input>

            <q-list class="q-mt-lg cancelOptions q-mx-sm" separator>
              <!-- Proceed -->
              <q-item clickable @click.native="onChangeServiceDetails">
                <q-item-section>
                  <q-item-label>{{$t('yes.proceed')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios" v-if="!loader"></q-icon>
                  <q-spinner v-else style="font-size: 1.3em"></q-spinner>
                </q-item-section>
              </q-item>

              <!-- I will do this later -->
              <q-item clickable @click.native="closeModal">
                <q-item-section>
                  <q-item-label>{{$t('do.this.later')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <!-- Prompt Dialog -->
        <dialog-prompt :trigger="promptModal" :message="messagePrompt" :okButtonLabel="promptButtonLabel" :cancelButtonLabel="promptCancelLabel" @on-close="triggerPromptDialog"></dialog-prompt>

        <!-- Error Dialog -->
        <dialog-error :trigger="serverErrorModal" :statusCode="errorStatus" :message="errorMessage" :okButtonLabel="$t('ok')" @on-close="triggerServerError"></dialog-error>
    </q-dialog>
</template>
<script>
import chatMixin from '../../mixins/chatMixin.js'
import moment from 'moment'
export default {
  mixins: [chatMixin],
  components: {
    'dialog-prompt': () => import('components/DialogPrompt.vue'),
    'dialog-error': () => import('components/DialogError.vue')
  },
  data () {
    return {
      modal: false,
      steps: 0,
      reasons: null,
      promptModal: false,
      messagePrompt: '',
      promptButtonLabel: null,
      promptCancelLabel: '',
      errorStatus: 0,
      errorMessage: '',
      serverErrorModal: false,
      loader: false,
      cancellationType: null,
      MOMENT: moment,
      serviceEnd: {
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HH:mm')
      },
      serviceStart: {
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HH:mm')
      },
      today: moment()
    }
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    status: {
      type: Number,
      required: true
    },
    requestId: {
      type: Number,
      required: true
    },
    responseId: {
      type: Number,
      default: () => {
        return null
      }
    },
    requestRef: {
      type: String,
      default: ''
    },
    bookingRef: {
      type: String,
      default: ''
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    }
  },
  methods: {
    checkDate (serviceStart) {
      return moment(serviceStart).format('YYYY-MM-DD') >= moment(this.today).format('YYYY-MM-DD')
    },
    checkEndDate (serviceEnd) {
      return moment(serviceEnd).format('YYYY-MM-DD') >= moment(this.serviceStart.date).format('YYYY-MM-DD')
    },
    goTo (routeName) {
      this.closeModal()
      this.$router.push({name: routeName})
    },
    onSelectChangeDuration () {
      if (this.status === 0) {
        this.closeModal()
        this.$router.push({name: 'EditRequest', params: {requestId: this.requestId}})
      } else {
        this.steps = 8
      }
    },
    onChangeServiceDetails () {
      this.loader = true
      let startTime = moment(this.serviceStart.date + ' ' + this.serviceStart.time).format('YYYY-MM-DD HH:mmZ')
      let endTime = moment(this.serviceEnd.date + ' ' + this.serviceEnd.time).format('YYYY-MM-DD HH:mmZ')

      this.sendTicket(this.SUPPORT_CATEGORY.BOOKING_CANCELLATION, 'Change Booking Info', `I would like to change date/duration of this request [${this.requestRef.toUpperCase()}]\n\nStart Time: ${startTime}\nEnd Time: ${endTime}`)

      setTimeout(() => {
        this.triggerPromptDialog(true, this.$t('support.team.contact'), this.$t('ok'), this.$t('dismiss'))
        this.loader = false
        this.steps = 0
      }, 650)
    },
    triggerServerError (status, message = null, errorCode = null) {
      if (errorCode) {
        this.errorStatus = errorCode
      }

      if (message) {
        this.errorMessage = message
      }

      this.serverErrorModal = status
    },
    triggerPromptDialog (status, message = null, okLabel = null, cancelLabel = null) {
      if (message) {
        this.messagePrompt = message
      }

      if (okLabel) {
        this.promptButtonLabel = okLabel
      }

      this.promptCancelLabel = cancelLabel
      this.promptModal = status
    },
    onBack () {
      if (this.steps === 0) {
        this.closeModal()
        return
      }

      if (this.steps === 4) {
        this.steps = 0
        return
      }

      if (this.steps === 7) {
        this.steps = 0
        return
      }

      if (this.steps === 8) {
        this.steps = 0
        return
      }

      this.steps--
    },
    closeModal () {
      this.reasons = null
      this.steps = 0
      this.modal = false
      this.messageBox = null
      this.$emit('on-close', false)
    },
    proceed (type = null) {
      this.steps++
    },
    onCancelRequest () {
      if ((this.steps === 5) && (this.reasons === null || this.reasons === '' || this.reasons === ' ')) {
        this.triggerPromptDialog(true, this.$t('valid.reasons.prompt'), null)
        return
      }

      let info = {
        'responseInfo': {
          'reasons': this.reasons
        }
      }

      this.loader = true
      this.$axios.delete(`users/${this.$store.state.user.uuid}/requests/${this.requestId}?reason=${encodeURI(this.reasons)}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        },
        data: info
      }).then((response) => {
        this.$emit('refresh')
        this.proceed()
      }).catch((error) => {
        console.error(error)
        if (error.response && error.response.data && error.response.data.code === 1) {
          this.messageBox = `I need help on cancelling this booking [${this.bookingRef.toUpperCase()}]. \nReason: ${this.reasons}`

          if (this.cancellationType !== null) {
            if (this.cancellationType === 1) {
              this.messageBox += `\n\nI would like to get 90% of the payment refunded back with 10% voucher`
            } else if (this.cancellationType === 2) {
              this.messageBox += `\n\nI would like to keep 100% in my balance for future bookings`
            }
          }

          this.sendTicket(this.SUPPORT_CATEGORY.BOOKING_CANCELLATION, 'Booking Cancellation', this.messageBox)
          this.proceed()
        } else if (error.response.data) {
          this.triggerServerError(true, error.response.data.message, error.response.data.code)
        }
      }).finally(_ => {
        this.loader = false
      })
    },
    declineBacker () {
      this.loader = true
      let info = {
        'responseInfo': {
          'acceptanceStatus': 4
        }
      }

      this.$axios.put(`users/${this.$store.state.user.uuid}/requests/${this.requestId}/responses/${this.responseId}`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.closeModal()
      }).catch((error) => {
        console.error(error)
        if (error.response.data) {
          this.triggerServerError(true, error.response.data.message, error.response.data.code)
        }
      }).finally(_ => {
        this.loader = false
      })
    },
    onChangeBacker (type = null) {
      if ((this.steps === 2) && (this.reasons === null || this.reasons === '' || this.reasons === ' ' || this.reasons.split(' ').length < 3)) {
        this.triggerPromptDialog(true, this.$t('valid.reasons.prompt'), null)
        return
      }

      let info = {
        'responseInfo': {
          'options': type,
          'reasons': this.reasons
        }
      }

      this.loader = true
      this.$axios.put(`users/${this.$store.state.user.uuid}/requests/${this.requestId}/responses/${this.responseId}/cancel`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.proceed()
      }).catch((error) => {
        console.error(error)
        if (error.response.data) {
          this.triggerServerError(true, error.response.data.message, error.response.data.code)
        }
      }).finally(_ => {
        this.loader = false
      })
    }
  }
}
</script>
<style lang="stylus">
.cancelOptions {
  box-shadow: 5px 0 15px -7px lightgrey, -5px 0 15px -7px lightgrey;
}
</style>
