<template>
  <q-page padding class="row justify-center">
    <div class="col-xs-12 col-sm-7 col-lg-5 text-center">
      <h4>{{ $t('signup.confirm.title') }}</h4>
      <div class="q-pb-lg text-center">
        <q-icon name="mail_outline" style="font-size: 100px;" />
      </div>
      <p>{{ $t('signup.confirm.msg') }}</p>
      <p class="text-negative q-mb-none">{{$t('please.check.junk')}}</p>
      <q-input v-model="email"
        class="q-mt-md q-mb-sm q-py-sm text-black input"
        type="email"
        :placeholder="$t('vuelidate.please.enter.email')"
        :after="[{icon: 'mail'}]"
        borderless
        dense
        @keyup.enter="updateUserEmail()"
      ></q-input>
      <small class="text-red-14" v-if="!$v.email.required && displayError">{{$t('vuelidate.please.enter.email')}}</small>
      <small class="text-red-14" v-if="!$v.email.email && displayError">{{$t('vuelidate.email.invalid')}}</small>
      <small class="text-red-14" v-if="!$v.email.minLength && displayError">Your email address must be more than 4 characters</small>
      <q-btn class="full-width q-mb-xl" v-if="$q.platform.is.desktop"
        :disabled="email.toString().length < 5"
        :loading="emailLoading"
        color="primary"
        size="md"
        @click.native="updateUserEmail()"
        >{{ $t('button.next') }}</q-btn>
      <q-btn class="full-width fixed-bottom q-pb-md q-pt-sm" v-else
        :disabled="email.toString().length < 5"
        :loading="emailLoading"
        color="primary"
        size="lg"
        @click.native="updateUserEmail()"
        >{{ $t('button.next') }}</q-btn>
    </div>
  </q-page>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  data () {
    return {
      email: this.$store.getters['user/getUserEmail'] || '',
      emailLoading: false,
      displayError: false,
      firstTime: this.$store.getters['user/getUserEmail'] ? 0 : 1
    }
  },
  methods: {
    updateUserEmail () {
      this.email = this.email.replace(/ /g, '')
      this.email = this.email.replace(/。/g, '.')
      this.email = this.email.replace(/·/g, '.')
      console.log(this.email)
      this.emailLoading = true
      /**
       * These 2 line will display all the neccesary error
       * on the form when user click submit button
       */
      this.displayError = !this.displayError
      this.$v.$touch()

      if (this.$v.email.$error) {
        this.email = this.email.replace(/ /g, '')
        this.emailLoading = !this.emailLoading
        return
      }

      let accountInfo = {
        'accountInfo': {
          'email': this.email
        }
      }

      // Persist the users email num
      this.$store.commit('user/updateUserEmailState', this.email)

      if (this.firstTime) {
        this.$axios.put(`account/${this.$store.state.user.uuid}`, JSON.stringify(accountInfo), {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then(response => {
          // After we update the email, we need to check if user still has not
          // verified his phone, if not then we redirect to verify phone page
          if (!this.$store.state.user.mobileNum || !this.$store.state.user.mobileVerified) {
            this.$router.replace({name: 'PromptPhone'})
          } else {
            this.$router.replace({name: 'ThankYou'})
          }
        }).catch(error => {
          let errorMessage = error.response.data.message || this.$t('something.wrong.update.email')
          this.$q.notify({
            message: errorMessage,
            type: 'negative'
          })
        }).finally(_ => {
          this.emailLoading = false
        })
      } else {
        this.$axios.put(`account/${this.$store.state.user.uuid}/verifyemail`, JSON.stringify(accountInfo), {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then(response => {
          this.$store.commit('user/updateEmailVerified', 2)

          // After we update the email, we need to check if user still has not
          // verified his phone, if not then we redirect to verify phone page
          if (!this.$store.state.user.mobileNum || !this.$store.state.user.mobileVerified) {
            this.$router.replace({name: 'PromptPhone'})
          } else {
            this.$router.replace({name: 'ThankYou'})
          }
        }).catch(error => {
          let errorMessage = error.response.data.message || this.$t('something.wrong.update.email')
          this.$q.notify({
            message: errorMessage,
            type: 'negative'
          })
        }).finally(_ => {
          this.emailLoading = false
        })
      }
    }
  },
  validations: {
    email: {
      required,
      email,
      minLength: minLength(5)
    }
  }
}
</script>

<style>
</style>
