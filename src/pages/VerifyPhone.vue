<template>
  <div>
    <q-page padding class="row justify-center q-px-md">
      <div class="col-xs-12 col-lg-5 text-center">
        <p class="text-left text-weight-bold font-title" style="margin-bottom: 10px;">{{ $t('sms.confirm.phone') }}</p>
        <p class="text-left text-weight-light font-normal" style="margin-bottom: 5px;">{{ $t('sms.check.your.phone') }}</p>
        <p class="text-left text-weight-bold q-my-md">
          <span class="font-normal">{{ $store.getters['user/getUserMobileNum'] }}</span>
          <q-btn :ripple="false" style="margin-bottom: 3px;" flat @click="$router.replace({name: 'PromptPhone'})" class="text-capitalize font-normal text-primary">{{$t('change.phone.number')}}</q-btn>
        </p>
        <q-input v-model="code" :placeholder="$t('sms.enter.code')" inverted color="neutral" class="input q-mt-sm q-mb-md text-black" borderless dense type="number" :after="[{icon: 'mail'}]"/>
        <div class="col-xs-12 q-mt-lg text-left">
          <q-btn
            :disabled="!code || (code && code.toString().length < 5) || verifyButtonLoading"
            class="col-xs-4 button q-px-md q-mr-md font-small"
            color="primary"
            size="md"
            @click.native="onVerify()"
            :loading="verifyButtonLoading"
            v-if="$q.platform.is.desktop"
            dense
          >
          {{$t('button.submit')}}
          </q-btn>
          <q-btn class="col-xs-3 text-capitalize button q-px-md font-small" dense color="primary"  @click="sendImpression('Phone Verification', 'Skipped'), $router.push('/thank-you')">{{$t('skip.step')}}</q-btn>
          <q-btn class="col-xs-3 text-capitalize button q-px-md q-ml-md font-small"
            color="primary"
            :label="countdown === 0 ? $t('send.code.again') : $t('send.sms.in', {counter: countdown})"
            @click.native="sendCodeAgain(), enableSendCodeAgainTimer(120)"
            :disabled="countdown > 0"
            dense
          />
        </div>
      </div>
    </q-page>
      <!-- BUTTON BOTTOM will appear on screen < sm -->
    <div class="row text-center fixed-bottom lt-lg" v-if="$q.platform.is.mobile">
      <div class="col-xs-12">
        <q-btn class="full-width z999 text-white q-pa-md bg-primary cursor-pointer font1-3-rem text-weight-bold" style="font-size: 16px;" @click.native="onVerify()" :loading="verifyButtonLoading" :disabled="!code || (code && code.toString().length < 5) || verifyButtonLoading">{{$t('button.submit')}}</q-btn>
      </div>
    </div>
    <!-- END OF BUTTON BOTTOM will appear on screen < md -->
  </div>
</template>

<script>
import authFlowMixin from '../mixins/authFlowMixin'

export default {
  mixins: [authFlowMixin],
  data () {
    return {
      code: null,
      verifyButtonLoading: false,
      countdown: 0,
      countDownInterval: null
    }
  },
  mounted () {
    this.enableSendCodeAgainTimer(120)
  },
  methods: {
    onVerify () {
      this.sendImpression('Phone Verification', 'Submitted')
      this.verifyButtonLoading = true
      this.$axios.get(`account/${this.$store.state.user.uuid}/verifysms/${this.code}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.verifyButtonLoading = false
        this.$store.commit('user/updateuserMobileVerifiedState', 1)
        this.updateUserPhoneInfo()
      }).catch(error => {
        console.log(error)
        let errorMessage = error.response.data.message || this.$t('something.wrong.verify.sms')
        this.verifyButtonLoading = false
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      })
    },
    updateUserPhoneInfo () {
      let accountInfo = {
        'accountInfo': {
          'mobileNum': this.$store.getters['user/getUserMobileNum'],
          'mobileCountryId': this.$store.getters['user/getUserMobileCountryId']
        }
      }

      this.$axios.put(`account/${this.$store.state.user.uuid}`, JSON.stringify(accountInfo), {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        // Persist the users mobile num
        this.$store.commit('user/updateUserMobileNumState', this.$store.getters['user/getUserMobileCountryId'])

        // After we update the phone, we need to check if user still has not
        // verified his email, if not then we redirect to verify email
        if (!this.$store.state.user.email) {
          this.$router.push('/user/confirm-email')
        } else {
          this.$router.push('/thank-you')
        }
      }).catch(error => {
        let errorMessage = error.response.data.message || this.$t('something.wrong.update.phone')
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      })
    },
    sendCodeAgain () {
      let accountInfo = JSON.stringify({
        'accountInfo': {
          'mobileNum': this.$store.getters['user/getUserMobileNum'],
          'mobileCountryId': this.$store.getters['user/getUserMobileCountryId']
        }
      })

      this.$axios.put(`account/${this.$store.state.user.uuid}/verifysms`, accountInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.$q.notify({
          message: 'Verification SMS have been requested'
        })
      }).catch(error => {
        console.log(error)
        let errorMessage = error.response.data.message || this.$t('something.wrong.send.sms')
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      })
    },
    enableSendCodeAgainTimer (duration) {
      this.countdown = duration
      this.countDownInterval = setInterval(() => {
        this.countdown = this.countdown - 1
        if (this.countdown === 0) {
          clearInterval(this.countDownInterval)
        }
      }, 1000)
    }
  }
}
</script>

<style>
.button{
  border-radius: 5px;
}
</style>
