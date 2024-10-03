<template>
  <q-page class="row justify-center" style="min-height: 100%;height: 100%;">
    <q-img src="statics/images/login/login-screen-v1.jpg" class="image-upload" style="height: 320px;" basic>
      <q-icon name="chevron_left" style="left: 8px;top: 50px;" size="3em" color="white" @click="$router.go(-1)"></q-icon>
    </q-img>

    <div class="col-xs-12 col-sm-8 col-lg-6 text-center text-label q-px-lg q-mx-sm q-mt-md">
      <h5 class="q-my-none text-weight-medium">{{ $t('login.resetpassword.title') }}</h5>
      <p class="q-my-none q-mb-lg q-mt-sm q-mx-md">{{ $t('login.resetpassword.msg') }}</p>

      <q-input type="email" class="text-left input capitalize" :label="$t('email')" hide-bottom-space borderless :float-label="$t('email')" v-model="email" :after="[{icon: 'email'}]"/>

      <small class="text-negative" v-if="!$v.email.required && displayError">{{$t('vuelidate.please.enter.email')}}</small>
      <small class="text-negative" v-if="!$v.email.email && displayError">{{$t('vuelidate.email.invalid')}}</small>

      <q-btn class="full-width q-mt-lg" :loading="resetLoading" :disabled="resetLoading" style="border-radius: 6px;" color="primary" :label="$t('send.reset.link')" @click="onResetPassword"></q-btn>
      <q-btn class="full-width q-mt-md" @click="$emit('update-email', email) ,$router.go(-1)" flat clear :label="$t('button.back')"></q-btn>
    </div>
  </q-page>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
export default {
  mixins: [validationMixin],
  props: {
    updatedEmail: null
  },
  data () {
    return {
      email: this.updatedEmail || null,
      displayError: false,
      resetLoading: false
    }
  },
  validations: {
    email: {
      required,
      email
    }
  },
  methods: {
    onResetPassword () {
      if (!this.email) {
        this.displayError = true
        return
      }

      this.email = this.email.replace(/ /g, '')
      this.email = this.email.replace(/。/g, '.')
      this.email = this.email.replace(/·/g, '.')

      this.resetLoading = !this.resetLoading
      /**
       * These 2 line will display all the neccesary error
       * on the form when user click submit button
       */
      this.displayError = !this.displayError
      this.$v.email.$touch()

      /**
       * Disable the form to be submitted if the user
       * has not completed the form
       */
      if (this.$v.email.$error) {
        this.resetLoading = !this.resetLoading
        return
      }

      let accountInfo = JSON.stringify({
        'accountInfo': {
          'email': this.email
        }
      })

      this.$axios.post('account/passwordrequest', accountInfo).then(response => {
        this.$emit('update-email', this.email)
        this.$q.localStorage.set('forgetPasswordAlert', this.$t('password.reset.instruction'))
        this.$router.go(-1)
      }).catch((e) => {
        this.$emit('update-email', this.email)
        this.$q.localStorage.set('forgetPasswordAlert', e.response.data.message)
        this.$router.go(-1)
      })
    }
  }
}
</script>
