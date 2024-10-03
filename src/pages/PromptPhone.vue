<template>
  <div>
    <q-page class="row justify-center q-px-md gutter">
      <div class="col-xs-12 col-lg-5 text-left">
        <p class="q-mt-md text-weight-bold font-title">{{$t('get.notifications.on.your.phone')}}</p>
        <p class="text-weight-light font-normal" v-if="isFirstTime">{{$t('signup.add.phone')}}</p>
        <p class="text-weight-light font-normal" v-else>{{$t('phone.number.kept.private')}}</p>
        <p class="text-left" style="margin-top: 40px;"></p><!-- For spacing -->
        <q-select input-debounce="100" behavior="menu" use-input @filter="filterFn" dense @input="selected" :options="options" v-model="country" class="input" borderless :label="$t('signup.country')">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{$t('no.result')}}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input v-model="phone" type="number" inverted color="neutral" borderless dense maxlength="12" class="input q-mt-lg q-mb-sm text-black" :prefix="mobileCode" :label="$t('signup.phonenumber')"/>
        <div class="text-center">
          <div v-if="isFirstTime">
            <q-btn color="primary" dense class="q-my-lg q-px-md q-mx-sm" size="md" :loading="textMeLoading" :disabled="!phone || !country || (phone && phone.toString().length < 6) || textMeLoading" @click.native="modalConfirmMobileNumber = true" :label="$t('save.mobile.num')"></q-btn>
          </div>
          <div v-else class="q-my-sm">
            <div>
              <q-btn class="q-my-sm q-px-md q-mx-sm"
                v-for="methods in verifyMethods" :key="methods.id"
                color="green"
                size="md"
                :label="`Verify with ${methods.title}`"
                @click.native="onVerifyPhoneAlternative(methods.type, methods.message, methods.phoneNumber)"
                dense
              ></q-btn>
            </div>
            <div>
              <q-btn class="q-my-sm q-px-md q-mx-sm"
                  color="primary"
                  icon="mail"
                  size="md"
                  :label="$t('signup.confirm.phonenumber')"
                  :disabled="!phone || !country || (phone && phone.toString().length < 6) || textMeLoading"
                  @click.native="modalConfirmMobileNumber = true"
                  :loading="textMeLoading"
                  dense
                ></q-btn>
            </div>
            <q-btn v-if="this.$route.params.settings === undefined" class="q-my-sm q-px-md q-mx-sm"
  color="secondary"
  size="md"
  label="Do it Later"
  @click.native="doItLaterFunction()"
  dense
></q-btn>
          </div>
        </div>
      </div>

      <q-dialog v-model="modalConfirmMobileNumber" :content-css="{minWidth: '350px', minHeight: '200px', width: 'unset', height: 'unset'}">
        <q-card :content-style="'overflow: hidden !important;'">
          <div class="text-center full-width q-pa-md" style="min-width:200px;">
            <div class="q-pt-md q-message-label no-margin">{{country}}</div>
            <div class="q-pt-md">({{mobileCode}}) {{phone}}</div>
            <div class="q-message-label no-margin cursor-pointer q-pt-xs text-primary" @click="modalConfirmMobileNumber = false">{{$t('change.my.number')}}</div>
            <div class="q-pt-md">
              <q-btn class="q-mt-sm btn-capitalize no-border-radius"
                color="primary"
                size="md"
                :label="$t('dialog.title.confirm')"
                @click.native="textMeLoading = true;submitPhoneNum()"
                :loading="textMeLoading"
                v-close-popup
              />
            </div>
          </div>
        </q-card>
      </q-dialog>

    <q-dialog v-model="serverError">
      <q-card :content-style="'overflow: hidden !important;'" style="max-width: 330px;border-radius: 20px;">
        <div class="text-center full-width q-pa-md" style="font-weight:450;">
          <div class="q-pt-sm">
            <span class="text-bold" style="font-size:16px;">{{$t('note')}}</span>
          </div>
          <div class="q-pt-md q-message-label no-margin">{{serverMessage}}</div>
          <div class="q-pt-md">
            <q-btn v-for="methods in verifyMethods" :key="methods.id" :label="`Verify with ${methods.title}`" class="full-width q-my-xs" color="green" @click="onVerifyPhoneAlternative(methods.type, methods.message, methods.phoneNumber)"/>
            <q-btn :label="$t('app.footer.emailus')" outline class="full-width q-my-xs" @click="$router.replace({name: 'ChatSupportHelp'})" color="primary"/>
            <q-btn :label="$t('chat.later')" flat class="full-width q-my-xs" @click="$router.replace({name: 'ThankYou'});serverError = false;" color="primary"/>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- BUTTON BOTTOM will appear on screen < sm -->
    <!-- <div class="row text-center absolute-bottom lt-lg" @click="onCheckValid" v-if="$q.platform.is.mobile">
      <div class="col-xs-12" v-if="isFirstTime">
        <q-btn class="full-width z999 text-white q-pa-md bg-primary cursor-pointer font1-3-rem q-pb-lg" style="font-size: 16px;" :loading="textMeLoading" :disabled="!phone || !country || (phone && phone.toString().length < 6) || textMeLoading" @click.native="modalConfirmMobileNumber = true" :label="$t('save.mobile.num')"></q-btn>
      </div>
      <div class="col-xs-12" v-else>
        <q-btn class="full-width z999 text-white q-pa-md bg-primary cursor-pointer font1-3-rem q-pb-lg" style="font-size: 16px;" :loading="textMeLoading" :disabled="!phone || !country || (phone && phone.toString().length < 6) || textMeLoading" @click.native="modalConfirmMobileNumber = true" :label="$t('signup.confirm.phonenumber')"></q-btn>
      </div>
    </div> -->

    <!-- Prompt Dialog -->
    <dialog-prompt :trigger="promptModal" :message="promptMessage" :okButtonLabel="promptOkLabel" @on-close="triggerPromptDialog"></dialog-prompt>
  </q-page>
  </div>
</template>

<script>
import countryLists from 'assets/countries.json'

function parseCountries () {
  let countryMap = []
  for (let i = 0, len = countryLists.length; i < len; i++) {
    let country = {
      label: countryLists[i].shortName,
      sublabel: countryLists[i].mobileCode,
      value: countryLists[i].id
    }
    countryMap.push(country)
  }
  return countryMap
}

export default {
  components: {
    'dialog-prompt': () => import('components/DialogPrompt.vue')
  },
  data () {
    return {
      country: null,
      countries: parseCountries(),
      options: null,
      mobileCode: null,
      phone: null,
      textMeLoading: false,
      modalConfirmMobileNumber: false,
      isFirstTime: false,
      serverError: false,
      serverMessage: null,
      whatsapp: {
        '159': '60124711065', // MY
        '199': '6586217409', // SG
        '102': '6281299090241', // Indonesia
        '106': '919726770130', // India
        '13': '61404692918', // Australia
        '78': '447784808863' // UK
      },
      verifyMethods: null,
      countryId: this.$store.getters['user/getUserMobileCountryId'].toString(),
      loader: false,
      promptModal: false,
      promptMessage: '',
      promptOkLabel: 'Ok'
    }
  },
  created () {
    if (!this.$store.getters['user/getUserMobileNum']) {
      this.isFirstTime = true
    }

    this.setCountryCallingCode()
    this.getPhoneVerifyInfo(this.$store.getters['user/getUserMobileCountryId'].toString())
    this.phone = this.$store.getters['user/getUserMobileNum']
    window.addEventListener('SVC-closed', this.InAppBrowserClosed)
  },
  beforeDestroy () {
    window.removeEventListener('SVC-closed', this.InAppBrowserClosed)
  },
  computed: {
    mobileVerified () {
      return this.$store.getters['user/getUserMobileVerified']
    }
  },
  watch: {
    mobileVerified (value) {
      if (value) {
        // After we update the phone, we need to check if user still has not
        // verified his email, if not then we redirect to verify email
        if (!this.$store.state.user.email) {
          this.$router.replace({name: 'ConfirmEmail'})
        } else {
          this.$router.replace({name: 'ThankYou'})
        }
      }
    }
  },
  methods: {
    doItLaterFunction () {
      if (this.$q.localStorage.getItem('localStorageRequestInfo')) {
        this.submitRequestForm(this.$q.localStorage.getItem('localStorageRequestInfo'))
      } else {
        if (this.$route.query.redirect) {
          // If user still hasn't filled up about me
          if (!this.$store.getters['user/getAboutMe'] && this.$route.query.redirect === 'CreateListing') {
            this.$router.replace({ name: 'AboutMe', query: { redirect: 'CreateListing', serviceId: this.$route.query.serviceId } })
            return
          }
          this.$router.replace({ name: this.$route.query.redirect, params: { serviceId: this.$route.query.serviceId } })
        } else {
          this.$router.replace({ name: 'ThankYou' })
        }
      }
    },
    onCheckValid () {
      if (!this.phone || !this.country || (this.phone && this.phone.toString().length < 6)) {
        this.triggerPromptDialog(true, this.$t('please.enter.valid.mobile.number'))
      }
    },
    triggerPromptDialog (status, message = '', okLabel = null) {
      this.showPrompt = status
      this.promptMessage = message
      this.promptOkLabel = okLabel
      this.promptModal = status
    },
    onVerifyPhoneAlternative (method, message, phoneNumber) {
      this.$store.commit('user/updateUserMobileCountryIdState', parseInt(this.countryId))
      if (method === 1) {
        this.onWhatsappVerify(message, phoneNumber)
      } else if (method === 2) {
        this.onLineVerify(message, phoneNumber)
      } else {
        this.onAlternativeVerify(phoneNumber)
      }
      this.savePhoneNum()
    },
    onAlternativeVerify (link) {
      this.serverError = false
      this.serverMessage = null
      this.openUrl(link)
    },
    getPhoneVerifyInfo (countryId) {
      this.loader = true
      this.$axios.get(`account/${this.$store.state.user.uuid}/phoneverifymethods?country_id=${countryId}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.verifyMethods = response.data.phoneVerifyMethodsInfo.items
      }).catch(e => {
        console.log(e)
        let errorMessage = this.$t('form.fails')
        if (e.response && e.response.data.message) {
          errorMessage = e.response.data.message
          this.$q.notify({
            message: errorMessage,
            timeout: 3000,
            position: 'top'
          })
        }
      }).finally(_ => {
        this.loader = false
      })
    },
    InAppBrowserClosed (info) {
      if (info.detail.url.includes('wa.me') || info.detail.url.includes('line.me')) {
        // After we update the phone, we need to check if user still has not
        // verified his email, if not then we redirect to verify email
        if (!this.$store.state.user.email) {
          this.$router.replace({name: 'ConfirmEmail'})
        } else {
          this.$router.replace({name: 'ThankYou'})
        }
      }
    },
    onWhatsappVerify (message, phoneNumber) {
      this.serverError = false
      this.serverMessage = null

      this.openUrl(`https://wa.me/${encodeURI(phoneNumber)}?text=${encodeURI(message)}`)
    },
    onLineVerify (message, lineLink) {
      this.serverError = false
      this.serverMessage = null
      this.openUrl(lineLink)
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = this.countries
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.countries.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    selected (item) {
      this.country = item.label
      this.mobileCode = item.sublabel
      this.countryId = item.value

      this.getPhoneVerifyInfo(this.countryId)
    },
    setCountryCallingCode () {
      let mobileCountry = this.$_.findWhere(countryLists, {'id': this.countryId})
      this.mobileCode = mobileCountry.mobileCode
      this.country = mobileCountry.shortName
      this.sendImpression('Phone Number Entry', mobileCountry.shortName)
    },
    submitPhoneNum () {
      this.$store.commit('user/updateUserMobileCountryIdState', parseInt(this.countryId))
      if (this.isFirstTime) {
        this.savePhoneNum()
      } else {
        this.onSendSMS()
      }
    },
    savePhoneNum () {
      if (!this.isNum(this.phone)) {
        this.phone = null
        this.$q.notify({
          message: this.$t('input.not.number'),
          type: 'negative',
          position: 'top'
        })
        return
      }

      let phone = this.getParsedPhone()

      // Remove 0 at the beginning
      if (phone.substr(0, 1) === '0') {
        phone = phone.substr(0)
      }

      let accountInfo = JSON.stringify({
        'accountInfo': {
          'mobileNum': phone,
          'mobileCountryId': this.$store.getters['user/getUserMobileCountryId']
        }
      })

      // save phone number
      this.$store.commit('user/updateUserMobileNumState', parseInt(phone))

      this.$axios.put(`account/${this.$store.state.user.uuid}`, accountInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.textMeLoading = false
        this.$q.notify({
          message: this.$t('phone.number.successfully.saved'),
          type: 'positive',
          position: 'top'
        })

        if (this.$q.localStorage.getItem('localStorageRequestInfo')) {
          this.submitRequestForm(this.$q.localStorage.getItem('localStorageRequestInfo'))
        } else {
          if (this.$route.query.redirect) {
            // If user still hasn't filled up about me
            if (!this.$store.getters['user/getAboutMe'] && this.$route.query.redirect === 'CreateListing') {
              this.$router.replace({name: 'AboutMe', query: {redirect: 'CreateListing', serviceId: this.$route.query.serviceId}})
              return
            }
            this.$router.replace({name: this.$route.query.redirect, params: {serviceId: this.$route.query.serviceId}})
          } else {
            this.$router.replace({name: 'ThankYou'})
          }
        }
      }).catch(error => {
        console.log(error)
        let errorMessage = error.response.data.message || this.$t('something.wrong.send.sms')
        this.textMeLoading = false
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      })
    },
    submitRequestForm (formRequest) {
      formRequest.requestInfo.preferredCurrency = this.$store.getters['user/getUserPrefferedCurrency']
      this.sendImpression('Request Submitting', this.getCountryShortName(formRequest.requestInfo.countryId))
      this.$axios.post(`users/${this.$store.state.user.uuid}/requests/direct`, JSON.stringify(formRequest), {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.$q.localStorage.set('localStorageFormResponseInfo', response.data)
        this.$router.push({ name: 'RequestSubmitted', params: {requestReference: response.data.requestInfo.requestReference} })
      }).catch(e => {
        console.log(e)
        let errorMessage = this.$t('form.fails')
        if (e.response.data.message) {
          errorMessage = e.response.data.message
        }
        this.$q.notify({
          message: errorMessage,
          timeout: 3000
        })
      }).finally(_ => {
        this.$q.localStorage.remove('localStorageRequestInfo')
      })
    },
    getCountryShortName (id) {
      let myArray = countryLists
      for (let i = 0; i < myArray.length; i++) {
        if (parseInt(myArray[i].id) === parseInt(id)) {
          return myArray[i].shortName
        }
      }
      return null
    },
    onSendSMS (type) {
      if (!this.isNum(this.phone)) {
        this.phone = null
        this.$q.notify({
          message: this.$t('input.not.number'),
          type: 'negative'
        })
        return
      }

      let phone = this.getParsedPhone()

      // Remove 0 at the beginning
      if (phone.substr(0, 1) === '0') {
        phone = phone.substr(0)
      }

      let accountInfo = JSON.stringify({
        'accountInfo': {
          'mobileNum': phone,
          'mobileCountryId': this.$store.getters['user/getUserMobileCountryId']
        }
      })

      // Used in VerifyPhone
      this.$store.commit('user/updateUserMobileNumState', parseInt(phone))

      this.$axios.put(`account/${this.$store.state.user.uuid}/verifysms`, accountInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.$store.commit('user/updateuserMobileVerifiedState', 2)
        this.textMeLoading = false
        this.$router.replace({name: 'VerifyPhone'})
      }).catch(error => {
        console.log(error)
        this.serverMessage = null
        this.serverMessage = error.response.data.message || this.$t('something.wrong.send.sms')
        this.textMeLoading = false
        this.serverError = true
      })
    },
    getParsedMsisdn () {
      let mobileCodeWithoutPlus = this.mobileCode.substr(1)
      let mobileCodeLength = mobileCodeWithoutPlus.length
      let phone = this.phone.toString()

      if (phone.substr(0, mobileCodeLength) === mobileCodeWithoutPlus) {
        return this.mobileCode + phone.substr(mobileCodeLength)
      } else {
        return this.mobileCode + phone
      }
    },
    getParsedPhone () {
      let mobileCodeWithoutPlus = this.mobileCode.substr(1)
      let mobileCodeLength = mobileCodeWithoutPlus.length
      let phone = this.phone.toString()

      if (phone.substr(0, mobileCodeLength) === mobileCodeWithoutPlus) {
        return phone.substr(mobileCodeLength)
      } else {
        return phone
      }
    },
    isNum (msisdn) {
      return /^\d+$/.test(msisdn)
    }
  }
}
</script>

<style lang="stylus" scoped>
.q-btn-outline-self{
  border: 1px solid $primary;
  background: transparent !important;
  color: $primary;
}
.btn-capitalize{
  text-transform: capitalize
}
</style>
