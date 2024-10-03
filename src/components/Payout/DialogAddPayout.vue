<!-- payout details page after choosing add payout -->
<template>
  <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
      <q-card :class="{'desktop-size': $q.platform.is.desktop}">
        <!-- Header -->
        <q-toolbar>
          <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
            <q-toolbar-title v-close-popup>
              <h6 class="q-my-none payout-title font-header-title">{{$t('payout.details.title')}}</h6>
            </q-toolbar-title>
          <!--<q-btn flat round dense icon="add" ></q-btn>-->
        </q-toolbar>

        <!-- Rate Cards -->
        <q-card-section class="q-mb-xl q-pb-xl">
          <div :class="computedClass">
            <!-- Paypal -->
            <div v-if="type === 2">
              <div v-for="(questionField, index) in payoutQuestions" :key="questionField.questionId">
                <q-input v-if="questionField.questionId !== 999"
                  v-model="userInfo[index]"
                  :error="showError[index]"
                  class="input q-my-md"
                  hide-bottom-space
                  :label="questionField.content"
                  autocapitalize="off"
                  borderless
                  :rules="[value => (value && !value.includes(' ') && value.includes('@') && value.includes('.com')) || '']"
                  lazy-rules
                  @input="validateInput(index)"
                ></q-input>
                <div v-if="questionField.questionId === 999" v-html="questionField.content"></div>
              </div>
            </div>

            <!-- Bank -->
            <div v-else-if="type === 3">
              <div v-for="(questionField, index) in payoutQuestions" :key="questionField.questionId">
                <q-input
                  v-if="questionField.questionId !== 999"
                  v-model="userInfo[index]"
                  :error="showError[index]"
                  class="input q-my-md"
                  hide-bottom-space
                  :label="questionField.content"
                  borderless
                  :rules="[value => (value && value !== '') || '']"
                  lazy-rules
                  @input="validateInput(index)"
                ></q-input>
                <div v-if="questionField.questionId === 999" v-html="questionField.content"></div>
              </div>
            </div>

            <!-- Zelle (not in use anymore) -->
            <!-- <div v-else-if="type === 4">
                <q-input v-model="info.email" type="email" :error="(showError && !info.email) || invalidEmail" hide-bottom-space class="input q-my-md" label="Zelle Email" borderless></q-input>
                <q-input v-model="info.phoneNumber" :type="$q.platform.is.desktop ? 'number' : 'tel'" :error="showError && !info.phoneNumber" hide-bottom-space class="input q-my-md" :label="$t('signup.phonenumber')" borderless></q-input>
            </div> -->

            <!-- WeChat -->
            <div v-else-if="type === 5">
              <div v-for="(questionField, index) in payoutQuestions" :key="questionField.questionId">
               <q-input
                  v-if="questionField.questionId !== 999"
                  v-model="userInfo[index]"
                  :error="showError[index]"
                  class="input q-my-md"
                  hide-bottom-space
                  :label="questionField.content"
                  borderless
                  :rules="[value => (value && value !== '') || '']"
                  lazy-rules
                  @input="validateInput(index)"
                ></q-input>
                <div v-if="questionField.questionId === 999" v-html="questionField.content"></div>
              </div>
                <!-- <q-input v-model="info.email" :error="showError && !info.email" hide-bottom-space class="input q-my-md" label="WeChat ID" borderless></q-input>
                <q-input v-model="info.phoneNumber" :type="$q.platform.is.desktop ? 'number' : 'tel'" :error="showError && !info.phoneNumber" hide-bottom-space class="input q-my-md" :label="$t('signup.phonenumber')" borderless></q-input>
                <p class="text-grey-7 q-my-md">{{$t('wechat.add.us.too', {weChatId: wechatId[$store.getters['user/getUserPrefferedCurrency']]})}}</p> -->
            </div>

          </div>
        </q-card-section>

        <!-- Save Button -->
        <div class="absolute-bottom" style="position: fixed; bottom: 0; width: 100%;">
          <div :class="error ? 'q-pa-sm bg-grey' : 'q-pa-sm bg-primary'" @click="onSubmit()"> <!-- post payout info to API -->
            <q-btn class="full-width text-weight-bold text-white" :loading="showLoader" flat style="border-radius: 6px;" :ripple="false" :label="$t('button.save')" size="lg"></q-btn>
          </div>
        </div>

      </q-card>
  </q-dialog>
</template>
<script>
import axios from 'axios'

export default {
  props: {
    trigger: {
      type: Boolean,
      required: true,
      default: false
    },
    type: {
      type: Number,
      required: true,
      default: 2
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
      payoutJSON: {},
      userInfo: [],
      showLoader: false,
      showError: [],
      error: true
    }
  },
  computed: {
    computedClass () {
      return this.setPayoutInputFields(this.type)
    }
  },
  async mounted () {
    await axios.get(`https://pbapistaging.forwen.com/v5/users/${this.$store.state.user.uuid}/payoutchoices`, {
      headers: {
        'Authorization': this.$store.getters['user/authorizationHeader']
      }
    }).then(response => {
      this.payoutContent = response.data.payoutsMethodsInfo.payoutOption
      this.setPayoutInputFields(this.type)
    }).catch(error => {
      console.log('Oops an error occurred: ' + error)
    })
  },
  watch: {
    trigger (value) {
      this.modal = value
    },
    info: {
      handler (newVal) {
        if (newVal.email && newVal.email.match(/^[\w/.-]+@[a-zA-Z1-9-]+?(\.[a-zA-Z1-9-]+)+$/) !== null) {
          this.invalidEmail = false
        }
      },
      deep: true
    }
  },
  methods: {
    setPayoutInputFields (type) {
      this.payoutType = type
      this.selectedPayoutType = this.payoutContent.find(choice => choice.payout_method_id === this.payoutType)

      // questionnaire is in JSON format, must parse it to access its string
      if (this.selectedPayoutType && this.selectedPayoutType.questionnaire) {
        const questionnaire = JSON.parse(this.selectedPayoutType.questionnaire)
        this.payoutQuestions = questionnaire.question

        this.userInfo = this.payoutQuestions.map(question => {
          if (question.questionId !== 999) {
            return '' // default to empty string if no specific default value
          }
        })
      }
    },
    // POST to API
    postPayout () {
      let payoutInfo = ''
      let paymentAccountInfo = ''
      let combinedString = []

      // avoid getting final object (payout notes)
      for (let index = 0; index < this.userInfo.length - 1; index++) {
        console.log('hello', index, this.userInfo[index])
        this.info[index] = this.userInfo[index]
      }
      console.log('this is info[] output', this.info)

      // stringifying and put into JSON
      for (let index = 0; index < this.payoutQuestions.length; index++) {
        if (index === this.payoutQuestions.length) {
          combinedString[index] = {
            ...this.payoutQuestions[index]
          }
        } else {
          combinedString[index] = {
            ...this.payoutQuestions[index],
            'reply': this.info[index]
          }
        }
      }

      let payoutString = []
      payoutString = {
        'question': combinedString
      }

      this.payoutJSON = JSON.stringify(payoutString)
      console.log('payoutJSON output ', this.payoutJSON)

      // create paymentAccountInfo
      for (let index = 0; index < this.info.length; index++) {
        paymentAccountInfo += this.info[index]
        if (index < this.info.length - 1) {
          paymentAccountInfo += ','
        }
      }
      console.log('paymentAccountInfo output ', paymentAccountInfo)

      payoutInfo = {
        'payoutInfo': {
          'payment_method_id': this.type,
          // 'paymentAccountInfo': paymentAccountInfo,
          'infoDescription': this.payoutJSON
        }
      }
      console.log('payoutInfo ', payoutInfo)

      // POST to API
      this.$axios.post(`https://pbapistaging.forwen.com/v5/users/${this.$store.state.user.uuid}/submitpayout`, payoutInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$emit('on-update', response.data.payoutInfo)
        console.log('submitted successfully!', response.data.payoutInfo)
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
    // validate all items in userInput before POST
    validatePayoutDetails () {
      let count = 0 // checking input array

      // check every input is not empty and valid
      for (let index = 0; index < this.payoutQuestions.length - 1; index++) {
        if (this.userInfo[index] === '' || this.showError[index] === true) {
          this.showLoader = false
          count--
        } else {
          count++
        }
      }

      // console.log(count)
      if (count === (this.payoutQuestions.length - 1)) {
        this.error = false
      } else {
        this.error = true
        console.log('cannot submit')
      }

      count = 0 // restart once submit form
    },
    validateInput (index) {
      // bank or others
      if (this.type !== 2 && this.userInfo[index] !== '') {
        this.$set(this.showError, index, false)
        console.log('input ok', index, this.userInfo[index])
      } else {
        this.$set(this.showError, index, true)
        console.log('whoops input wrong')
        this.error = true
      }

      // paypal
      if (this.type === 2) {
        if (!this.userInfo[index].includes(' ') && this.userInfo[index].includes('@') && this.userInfo[index].includes('.com')) {
          this.$set(this.showError, index, false)
          console.log('good to go', index, this.userInfo[index])
        } else {
          this.$set(this.showError, index, true)
          console.log('nu uh paypal', index, 'whoops')
          this.error = true
        }
      }
      this.validatePayoutDetails()
    },
    closePopUp () {
      this.$emit('on-close', false)

      // for emptying the input field after close popup
      this.userInfo = this.payoutQuestions.map(question => {
        if (question.questionId !== 999) {
          this.showError = []
          return '' // default to empty string if no specific default value
        }
      })

      this.info = []
    },
    parseDetails (details) {
      console.log(details)
      this.info = details.split(',')
    },
    onSubmit () {
      if (!this.error) {
        this.showLoader = true
        this.postPayout()
      }
    }
  }
}
</script>
<style lang="stylus">
.payout-title
 margin-left: 23%
</style>
