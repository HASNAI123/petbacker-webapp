<!-- payout details page for ADDED payment methods -->
<template>
  <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
      <q-card :class="{'desktop-size': $q.platform.is.desktop}">
        <!-- Header -->
        <q-toolbar >
          <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
            <q-toolbar-title v-close-popup>
              <h6 class="q-my-none payout-title font-header-title">{{$t('payout.details.title')}}</h6>
            </q-toolbar-title>
          <!--<q-btn flat round dense icon="add" ></q-btn>-->
        </q-toolbar>

        <!-- Rate Cards -->
        <q-card-section class="q-mb-xl q-pb-xl">
          <!-- Display for all -->
          <div v-if="payoutDetails.paymentMethodId">
            <div v-for="(questionField) in payoutQuestions" :key="questionField.questionId">
              <div v-if="questionField.questionId !== 999">
              <q-input
                v-model="questionField.reply"
                readonly
                hide-bottom-space
                class="input q-my-md"
                :label="questionField.content"
                borderless
              ></q-input>
            </div>
            <div v-if="questionField.questionId === 999" v-html="questionField.content"></div>
            </div>
          </div>

          <!-- Bank -->
            <!-- <q-input v-if="info.length > 0" v-model="info[0]" readonly hide-bottom-space :error="showError && !info[0]" class="input q-my-md" :label="$t('bank.name.label')" borderless></q-input> -->
            <!-- <q-input v-if="info.length > 1" v-model="info[1]" readonly hide-bottom-space :error="showError && !info[1]" class="input q-my-md" :label="$t('account.number.label')" borderless></q-input>
            <q-input v-if="info.length > 2" v-model="info[2]" readonly hide-bottom-space :error="showError && !info[2]" class="input q-my-md" :label="$t('account.holder.name')" borderless></q-input> -->

            <!-- Conditional  For India FSC -->
            <!-- <q-input v-if="info.length > 3 && $store.getters['user/getUserPrefferedCurrency'] === 106"   v-model="info[3]" readonly hide-bottom-space :error="showError && !info[3]" class="input q-my-md" label="IFSC Code" borderless></q-input> -->

            <!-- Conditional I For Thailand || Benificary Adresss -->
            <!-- <q-input v-if="info.length > 3 && $store.getters['user/getUserPrefferedCurrency'] === 219"   v-model="info[3] " readonly hide-bottom-space :error="showError && !info[3]" class="input q-my-md" label=" Swift Code" borderless></q-input>
            <q-input v-if="info.length > 3 && $store.getters['user/getUserPrefferedCurrency'] === 219"  v-model="combinedInfo" readonly hide-bottom-space :error="showError && !info[3]" class="input q-my-md" label=" Address" borderless></q-input> -->

            <!-- Conditional I For Brazil || Benificary Adresss -->
            <!-- <q-input v-if="info.length > 3 && $store.getters['user/getUserPrefferedCurrency'] === 31"   v-model="info[3] " readonly hide-bottom-space :error="showError && !info[3]" class="input q-my-md" label=" Swift Code" borderless></q-input>
            <q-input v-if="info.length > 3 && $store.getters['user/getUserPrefferedCurrency'] === 31" v-model="combinedInfo" readonly hide-bottom-space :error="showError && !info[3]" class="input q-my-md" label=" Address" borderless></q-input> -->

            <!-- Conditional I For Colobmia || Benificary Adresss -->
            <!-- <q-input v-if="info.length > 3 && $store.getters['user/getUserPrefferedCurrency'] === 49"   v-model="info[3] " readonly hide-bottom-space :error="showError && !info[3]" class="input q-my-md" label=" Swift Code" borderless></q-input>
            <q-input v-if="info.length > 3 && $store.getters['user/getUserPrefferedCurrency'] === 49"   v-model="combinedInfo" readonly hide-bottom-space :error="showError && !info[3]" class="input q-my-md" label=" Address" borderless></q-input> -->

            <!-- Conditional I For Europe|| SWIFT Code && IBAN-->
            <!-- <q-input v-if="info.length > 3 && $store.getters['user/getUserPrefferedCurrency'] === 70"   v-model="info[3]" readonly hide-bottom-space :error="showError && !info[3]" class="input q-my-md" label="SWIFT Code" borderless></q-input>
            <q-input v-if="info.length > 3 && $store.getters['user/getUserPrefferedCurrency'] === 70"   v-model="info[4]" readonly hide-bottom-space :error="showError && !info[4]" class="input q-my-md" label="IBAN" borderless></q-input> -->

            <!-- Conditional I For UK|| SWIFT Code && IBAN-->
            <!-- <q-input v-if="info.length > 3 && $store.getters['user/getUserPrefferedCurrency'] === 78"   v-model="info[3]" readonly hide-bottom-space :error="showError && !info[3]" class="input q-my-md" label="SWIFT Code" borderless></q-input>
            <q-input v-if="info.length > 3 && $store.getters['user/getUserPrefferedCurrency'] === 78"   v-model="info[4]" readonly hide-bottom-space :error="showError && !info[4]" class="input q-my-md" label="Sort Code" borderless></q-input> -->
          <!-- Zelle -->
          <!-- <div v-else-if="payoutDetails.paymentMethodId === 4 && info.length > 0">
            <q-input v-if="info.length > 0" v-model="info[0]" readonly type="email" :error="(showError && !info[0]) || invalidEmail" hide-bottom-space class="input q-my-md" label="Zelle Email" borderless></q-input>
            <q-input v-if="info.length > 1" v-model="info[1]" readonly :type="$q.platform.is.desktop ? 'number' : 'tel'" :error="showError && !info[1]" hide-bottom-space class="input q-my-md" :label="$t('signup.phonenumber')" borderless></q-input>
          </div> -->
          <!-- WeChat (removed) -->
         <!--  <div v-else-if="payoutDetails.paymentMethodId === 5 && info.length > 0">
            <q-input v-if="info.length > 0" v-model="info[0]" readonly :error="showError && !info[0]" hide-bottom-space class="input q-my-md" label="WeChat ID" borderless></q-input>
            <q-input v-if="info.length > 1" v-model="info[1]" readonly :type="$q.platform.is.desktop ? 'number' : 'tel'" :error="showError && !info[1]" hide-bottom-space class="input q-my-md" :label="$t('signup.phonenumber')" borderless></q-input>
            <p class="text-grey-7 q-my-md" v-if="wechatId[$store.getters['user/getUserPrefferedCurrency']]">{{$t('wechat.add.us.too', {weChatId: wechatId[$store.getters['user/getUserPrefferedCurrency']]})}}</p>
          </div> -->
          <!-- <p class="text-grey-7 q-my-md">{{$t('no.funds.if.wrong.info')}}</p>
          <p class="text-grey-7 q-my-md">{{$t('days.to.verify.payout.details')}}</p> -->
        </q-card-section>

        <!-- Save Button -->
        <!-- <div class="absolute-bottom">
          <div class="q-pa-sm bg-primary" @click="updatePayout">
            <q-btn class="full-width text-weight-bold text-white" :loading="showLoader" flat style="border-radius: 6px;" :ripple="false" :label="$t('button.save')" size="lg"></q-btn>
          </div>remve
        </div> -->
      </q-card>
  </q-dialog>
</template>
<script>
export default {
  props: {
    payoutDetails: {
      type: Object,
      required: true
    },
    trigger: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data () {
    return {
      payoutType: 0,
      selectedPayoutType: [],
      getUserCurrency: this.$store.getters['user/getUserPrefferedCurrency'],
      payoutContent: [],
      payoutQuestions: [],
      modal: false,
      info: [],
      showLoader: false,
      showError: [],
      invalidEmail: false,
      wechatId: {
        96: 'petbacker', // Hong Kong
        48: 'vtcl13' // China
      }
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    }
  },
  beforeDestroy () {
    console.log('length of the info', this.info.length)
  },
  computed: {
    combinedInfo () {
      // Combine info[4] and info[5]
      return this.info[4] + '' + this.info[5] + ' ,' + this.info[6] + ', ' + this.info[7] + ', ' + this.info[8]
    }
  },
  async mounted () {
    await this.$axios.get(`https://pbapistaging.forwen.com/v5/users/${this.$store.state.user.uuid}/payoutchoices`, {
      headers: {
        'Authorization': this.$store.getters['user/authorizationHeader']
      }
    }).then(response => {
      this.payoutContent = response.data.payoutsMethodsInfo.payoutInfo
      this.setPayoutInputFields(this.payoutDetails.paymentMethodId)
    }).catch(error => {
      console.log('Oops an error occurred: ' + error)
    })
  },
  methods: {
    setPayoutInputFields (type) {
      this.payoutType = type
      this.selectedPayoutType = this.payoutContent.find(choice => choice.paymentMethodId === this.payoutType)

      // questionnaire is in JSON format, must parse it to access its string
      if (this.selectedPayoutType && this.selectedPayoutType.payoutInfoJson) {
        const questionnaire = JSON.parse(this.selectedPayoutType.payoutInfoJson)
        this.payoutQuestions = questionnaire.question
        console.log('Saved payout JSON', this.payoutQuestions)
      }
    },
    updatePayout () {
      this.showError = false
      this.showLoader = true
      let payoutInfo = ''

      if ((this.payoutDetails.paymentMethodId === 2 && !this.info[0]) || (this.payoutDetails.paymentMethodId === 3 && !this.info[1]) || ((this.payoutDetails.paymentMethodId === 4 || this.type === 5) && (!this.info[0] || !this.info[1]))) {
        this.showError = true
        this.showLoader = false
        return
      }

      if ((this.payoutDetails.paymentMethodId === 4 || this.payoutDetails.paymentMethodId === 2) && this.info[0] && (this.info[0].match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/) === null)) {
        this.invalidEmail = true
        this.showError = true
        this.showLoader = false
        return
      }

      if (this.payoutDetails.paymentMethodId === 2) {
      // Paypal
        payoutInfo = {
          'payoutInfo': {
            'paymentMethodId': this.payoutDetails.paymentMethodId,
            'paymentAccountInfo': this.info[0]
          }
        }
        // } else if (this.payoutDetails.paymentMethodId === 3 || this.payoutDetails.paymentMethodId === 4 || this.payoutDetails.paymentMethodId === 5) {
      } else if (this.payoutDetails.paymentMethodId === 3 || this.payoutDetails.paymentMethodId === 5) { // type 4 Zelle not in use
      // Bank / Zelle / WeChat

        payoutInfo = {
          'payoutInfo': {
            'paymentMethodId': this.payoutDetails.paymentMethodId,
            'paymentAccountInfo': this.info.join(',')
          }
        }
      }

      this.$axios.put(`/users/${this.$store.getters['user/getUserUuidState']}/payout/${this.payoutDetails.id}`, payoutInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$emit('on-update', response.data.payoutInfo)
      }).catch((error) => {
        console.error(error)
        let errorMessage = error.response.data.message ? error.response.data.message : this.$t('something.wrong.gateway')
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      }).finally(_ => {
        this.showLoader = false
      })
    },
    closePopUp () {
      this.$emit('on-close', false)
    },
    parseDetails (details) {
      this.info = details.split(',')
    }
  }
}
</script>
<style lang="stylus">
.payout-title
 margin-left: 23%
</style>
