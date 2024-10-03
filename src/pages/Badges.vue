<template>
  <q-page :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}" class="justify-center q-pb-xl margin-auto">
    <!-- Verify Email -->
    <q-item class="input q-ma-md clickable" @click.native="onRedirect('ConfirmEmail')">
        <q-item-section avatar>
            <q-avatar square>
                <q-icon name="far fa-envelope" size="35px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{$t('email')}}</q-item-label>
            <q-item-label v-if="$store.getters['user/getEmailVerified'] === 2" class="text-position text-warning" caption>{{$t('status.pending')}}</q-item-label>
            <q-item-label v-else-if="$store.getters['user/getEmailVerified'] === 1" class="text-position text-positive" caption>{{$t('status.verified')}}</q-item-label>
            <q-item-label v-else class="text-primary" caption>{{$t('verify.now')}}</q-item-label>
        </q-item-section>

        <q-item-section side v-if="$store.getters['user/getEmailVerified'] === 1">
            <q-item-label class="text-position text-positive" caption><q-icon name="fas fa-check-circle" size="md"></q-icon></q-item-label>
        </q-item-section>
    </q-item>

    <!-- Verify Phone -->
    <q-item class="input q-ma-md clickable" @click.native="onRedirect('PromptPhone')">
        <q-item-section avatar>
            <q-avatar square>
                <q-icon name="fas fa-mobile-alt" size="35px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{$t('signup.phone')}}</q-item-label>
            <q-item-label v-if="$store.getters['user/getUserMobileVerified'] === 2" class="text-position text-warning" caption>{{$t('status.pending')}}</q-item-label>
            <q-item-label v-else-if="$store.getters['user/getUserMobileVerified'] === 1" class="text-position text-positive" caption>{{$t('status.verified')}}</q-item-label>
            <q-item-label v-else class="text-primary" caption>{{$t('verify.now')}}</q-item-label>
        </q-item-section>

        <q-item-section side v-if="$store.getters['user/getUserMobileVerified'] === 1">
            <q-item-label class="text-position text-positive" caption><q-icon name="fas fa-check-circle" size="md"></q-icon></q-item-label>
        </q-item-section>
    </q-item>

    <!-- Verify Identity Document -->
    <q-item class="input q-ma-md clickable" @click.native="onRedirect('IdentityVerification')">
        <q-item-section avatar>
            <q-avatar square>
                <q-icon name="fas fa-portrait" size="28px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{$t('identity.verification')}}</q-item-label>
            <q-item-label v-if="$store.getters['user/getIdVerified'] === 2 || $store.getters['user/getSelfieVerified'] === 2" class="text-position text-warning" caption>{{$t('status.pending')}}</q-item-label>
            <q-item-label v-else-if="$store.getters['user/getIdVerified'] === 1 && $store.getters['user/getSelfieVerified'] === 1" class="text-position text-positive" caption>{{$t('status.verified')}}</q-item-label>
            <q-item-label v-else class="text-primary" caption>{{$t('verify.now')}}</q-item-label>
        </q-item-section>

        <q-item-section side v-if="$store.getters['user/getIdVerified'] === 1 && $store.getters['user/getSelfieVerified'] === 1">
            <q-item-label class="text-position text-positive" caption><q-icon name="fas fa-check-circle" size="md"></q-icon></q-item-label>
        </q-item-section>
    </q-item>

    <!-- Facebook Verification -->
    <q-item class="input q-ma-md" @click.native="onRedirect('FacebookVerify')">
        <q-item-section avatar>
            <q-avatar square>
                <q-icon name="fab fa-facebook" size="30px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{ $t('login.with.facebook') }}</q-item-label>
            <q-item-label v-if="$store.getters['user/getFacebookVerified'] === 1" class="text-position text-positive" caption>{{$t('status.verified')}}</q-item-label>
            <q-item-label v-else class="text-primary" caption>{{$t('verify.now')}}</q-item-label>
        </q-item-section>

        <q-item-section side v-if="facebookVerifyLoader">
            <q-item-label class="text-position text-positive" caption>
                <q-spinner-dots size="md"></q-spinner-dots>
            </q-item-label>
        </q-item-section>
        <q-item-section side v-else-if="$store.getters['user/getFacebookVerified'] === 1">
            <q-item-label class="text-position text-positive" caption><q-icon name="fas fa-check-circle" size="md"></q-icon></q-item-label>
        </q-item-section>
    </q-item>

    <!-- Google+ Verification -->
    <q-item class="input q-ma-md" @click.native="onRedirect('GoogleVerify')">
        <q-item-section avatar>
            <q-avatar square>
                <q-icon name="fab fa-google-plus-g" size="30px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{$t('google')}}</q-item-label>
            <q-item-label v-if="$store.getters['user/getGoogleVerified'] === 2" class="text-position text-warning" caption>{{$t('status.pending')}}</q-item-label>
            <q-item-label v-else-if="$store.getters['user/getGoogleVerified'] === 1" class="text-position text-positive" caption>{{$t('status.verified')}}</q-item-label>
            <q-item-label v-else class="text-primary" caption>{{$t('verify.now')}}</q-item-label>
        </q-item-section>

        <q-item-section side v-if="googleVerifyLoader">
            <q-item-label class="text-position text-positive" caption>
                <q-spinner-dots size="md"></q-spinner-dots>
            </q-item-label>
        </q-item-section>
        <q-item-section side v-else-if="$store.getters['user/getGoogleVerified'] === 1">
            <q-item-label class="text-position text-positive" caption><q-icon name="fas fa-check-circle" size="md"></q-icon></q-item-label>
        </q-item-section>
    </q-item>

    <!-- Verify Certifications -->
    <q-item class="input q-ma-md" @click.native="onRedirect('Certificates')">
        <q-item-section avatar>
            <q-avatar square>
                <q-icon name="fas fa-clipboard-check" size="30px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{$t('certifications')}}</q-item-label>
            <q-item-label class="text-primary" caption>{{$t('verify.now')}}</q-item-label>
        </q-item-section>

        <q-item-section side v-if="($store.getters['user/getTrainingCertified'] === 1) && ($store.getters['user/getGroomingCertified'] === 1) && ($store.getters['user/getVetCertified'] === 1)">
            <q-item-label class="text-position text-positive" caption><q-icon name="fas fa-check-circle" size="md"></q-icon></q-item-label>
        </q-item-section>
    </q-item>

    <!-- Business Verification -->
    <q-item class="input q-ma-md" @click.native="onRedirect('BusinessVerify')">
        <q-item-section avatar>
            <q-avatar square>
                <q-icon name="fas fa-briefcase" size="30px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{$t('business.license')}}</q-item-label>
            <q-item-label v-if="$store.getters['user/getBusinessVerified'] === 2" class="text-position text-warning" caption>{{$t('status.pending')}}</q-item-label>
            <q-item-label v-else-if="$store.getters['user/getBusinessVerified'] === 1" class="text-position text-positive" caption>{{$t('status.verified')}}</q-item-label>
            <q-item-label v-else class="text-primary" caption>{{$t('verify.now')}}</q-item-label>
        </q-item-section>

        <q-item-section side v-if="$store.getters['user/getBusinessVerified'] === 1">
            <q-item-label class="text-position text-positive" caption><q-icon name="fas fa-check-circle" size="md"></q-icon></q-item-label>
        </q-item-section>
    </q-item>

    <!-- Police Clearance Verification -->
    <q-item class="input q-ma-md" @click.native="onRedirect('PoliceVerify')">
        <q-item-section avatar>
            <q-avatar square>
                <q-icon name="fas fa-id-badge" size="30px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{$t('police.clearance')}}</q-item-label>
            <q-item-label v-if="$store.getters['user/getPoliceVerified'] === 2" class="text-position text-warning" caption>{{$t('status.pending')}}</q-item-label>
            <q-item-label v-else-if="$store.getters['user/getPoliceVerified'] === 1" class="text-position text-positive" caption>{{$t('status.verified')}}</q-item-label>
            <q-item-label v-else class="text-primary" caption>{{$t('verify.now')}}</q-item-label>
        </q-item-section>

        <q-item-section side v-if="$store.getters['user/getPoliceVerified'] === 1">
            <q-item-label class="text-position text-positive" caption><q-icon name="fas fa-check-circle" size="md"></q-icon></q-item-label>
        </q-item-section>
    </q-item>

    <!-- Online Test -->
    <q-item class="input q-ma-md" @click.native="onRedirect('OnlineTest')">
        <q-item-section avatar>
            <q-avatar square>
                <q-icon name="fas fa-file-alt" size="30px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{$t('badges.online.test')}}</q-item-label>
            <q-item-label class="text-primary" caption v-if="!$store.getters['user/getUserExamCertified']">{{$t('take.now')}}</q-item-label>
        </q-item-section>

        <q-item-section side v-if="onlineTestLoader">
            <q-item-label class="text-position text-positive" caption>
                <q-spinner-dots size="md"></q-spinner-dots>
            </q-item-label>
        </q-item-section>
        <q-item-section side v-else-if="$store.getters['user/getUserExamCertified']">
            <q-item-label class="text-position text-positive" caption><q-icon name="fas fa-check-circle" size="md"></q-icon></q-item-label>
        </q-item-section>
    </q-item>

    <!-- Pet Sitter Intro Test -->
    <q-item class="input q-ma-md" @click.native="onRedirect('PetSitterIntro')">
        <q-item-section avatar>
            <q-avatar square>
                <q-icon name="fas fa-align-left" size="30px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{$t('pet.sitter.intro.test')}}</q-item-label>
            <q-item-label class="text-primary" caption v-if="!$store.getters['user/getSitterIntroVerified']">{{$t('take.now')}}</q-item-label>
        </q-item-section>

        <q-item-section side v-if="petSitterIntroLoader">
            <q-item-label class="text-position text-positive" caption>
                <q-spinner-dots size="md"></q-spinner-dots>
            </q-item-label>
        </q-item-section>
        <q-item-section side v-else-if="$store.getters['user/getSitterIntroVerified']">
            <q-item-label class="text-position text-positive" caption><q-icon name="fas fa-check-circle" size="md"></q-icon></q-item-label>
        </q-item-section>
    </q-item>

    <!-- Other Documents -->
    <q-item class="input q-ma-md" @click.native="onRedirect('OtherDocuments')">
        <q-item-section avatar>
          <q-avatar square>
                <q-icon name="fas fa-id-badge" size="30px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
  <q-item-label>{{$t('other.documents')}}</q-item-label>
  <q-item-label class="text-primary" caption>
    Pending Verification: {{ UnverifiedDocuments }}<br>
    Verified Documents: {{ VerifiedDocuments }}
  </q-item-label>
</q-item-section>

        <q-item-section side v-if="($store.getters['user/getTrainingCertified'] === 1) && ($store.getters['user/getGroomingCertified'] === 1) && ($store.getters['user/getVetCertified'] === 1)">
            <q-item-label class="text-position text-positive" caption><q-icon name="fas fa-check-circle" size="md"></q-icon></q-item-label>
        </q-item-section>
    </q-item>

    <!-- Get Yourself verified note -->
    <q-item class="q-ma-md" style="border: 2px solid lightgrey;border-radius: 11px;">
        <q-item-section>
            <q-item-label caption>{{$t('get.yourself.verified')}}</q-item-label>
        </q-item-section>
    </q-item>

    <!-- Dialog Police Clearance -->
    <dialog-police-clearance :trigger="policeClearanceModal"
    @on-close="onTriggerPoliceClearanceModal"
    @on-document-submit="onDocumentSubmit"
    :showLoading="showLoading"
    @on-loading="onLoading"
    :type="'document'"></dialog-police-clearance>

        <!-- Other Documents Modal  -->
        <dialog-other :trigger="otherdocumentsModal"
    @on-close="onTriggerOtherDocumentsModal"
    @on-document-submit="onDocumentSubmit"
    :showLoading="showLoading"
    @on-loading="onLoading"
    :type="'Other Documents'"
    @pending-documents="onPendingDocuments"
    @verified-documents="onVerifiedDocuments"></dialog-other>

    <!-- Dialog Business Verify -->
    <dialog-business-verify ref="business-verify" :trigger="businessVerifyModal" @on-close="onTriggerBusinessVerifyModal" @on-submit="onDocumentSubmit" :showLoading="showLoading"></dialog-business-verify>

    <!-- Dialog pop up after document submit -->
    <dialog-submitted :trigger="submittedModal" :type="submittedType" @on-close="onTriggerSubmittedModal"></dialog-submitted>

    <!-- Dialog Error -->
    <dialog-error :trigger="errorModal" :statusCode="errorStatus" :message="errorMessage" :okButtonLabel="errorOkLabel" @on-ok="onErrorOk" @on-close="triggerServerError"></dialog-error>
  </q-page>
</template>
<script>
import languages from 'assets/languages.json'
export default {
  components: {
    'dialog-business-verify': () => import('components/IdentityVerification/DialogBusinessVerify.vue'),
    'dialog-police-clearance': () => import('components/IdentityVerification/OtherDocuments.vue'),
    'dialog-other': () => import('components/IdentityVerification/OtherPersonalDocuments.vue'),
    'dialog-submitted': () => import('components/IdentityVerification/DialogSubmitted.vue'),
    'dialog-error': () => import('components/DialogError.vue')
  },
  data () {
    return {
      googleVerifyLoader: false,
      facebookVerifyLoader: false,
      petSitterIntroLoader: false,
      onlineTestLoader: false,
      businessVerifyModal: false,
      businessVerifyLoader: false,
      showLoading: false,
      submittedModal: false,
      policeClearanceModal: false,
      otherdocumentsModal: false,
      UnverifiedDocuments: null,
      VerifiedDocuments: null,
      submittedType: 'verification',
      errorModal: false,
      errorStatus: 0,
      errorMessage: '',
      errorOkLabel: this.$t('ok'),
      accessToken: null,
      googlePlusObj: null
    }
  },
  mounted () {
    // listen to in app browser close event
    window.addEventListener('SVC-closed', this.onInAppBrowserClosed)

    this.$axios.get(`/account/${this.$store.state.user.uuid}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
    // Handle the response her
        this.$emit('pending-documents', response.data.accountInfo.otherDocuPending)
        this.UnverifiedDocuments = response.data.accountInfo.otherDocuPending
        this.VerifiedDocuments = response.data.accountInfo.otherDocuVerified
        this.$emit('verified-documents', response.data.accountInfo.otherDocuVerified)
      }).catch((error) => {
        // Handle the error here
        console.log(error)
      })
  },
  beforeDestroy () {
    // clean up event listeners
    window.removeEventListener('SVC-closed', this.onInAppBrowserClosed)
  },
  methods: {

    onPendingDocuments (pendingDocuments) {
    // Handle pending documents here
    console.log('check the Pedninf documents ', pendingDocuments)

    this.UnverifiedDocuments = pendingDocuments
  },
  onVerifiedDocuments (verifiedDocuments) {
    // Handle verified documents here
    console.log('check the Verified documents ', verifiedDocuments)
    this.VerifiedDocuments = verifiedDocuments
  },
    onErrorOk (codeStatus) {
      switch (codeStatus) {
        case 3: this.submitGoogleInfo(this.submitGoogleInfo, true); break
        case 5: this.submitFBInfo(this.accessToken, true); break
      }
    },
    triggerServerError (status, errorMessage = null, errorStatus = null, errorOkLabel = null) {
      if (errorMessage) {
        this.errorMessage = errorMessage
      }

      if (errorStatus !== null) {
        this.errorStatus = errorStatus
      }

      if (errorOkLabel) {
        this.errorOkLabel = errorOkLabel
      }

      this.errorModal = status
    },
    onInAppBrowserClosed () {
      // refresh internal states
      this.$store.dispatch('user/refreshState').then(() => {
        this.petSitterIntroLoader = false
        this.onlineTestLoader = false
      })
    },
    onLoading (status) {
      this.showLoading = status
    },
    onTriggerPoliceClearanceModal (status) {
      this.policeClearanceModal = status
    },

    onTriggerOtherDocumentsModal (status) {
    console.log('close dialog tireggered 01', status)
      this.otherdocumentsModal = false
    },

    onTriggerSubmittedModal (status) {
      this.submittedModal = status
    },
    onRedirect (path) {
      // prevent user from reverify identity
      if (path === 'IdentityVerification' && this.$store.getters['user/getIdVerified'] === 1 && this.$store.getters['user/getSelfieVerified'] === 1) {
        return
      }

      // prevent user from reverify business license
      if (path === 'BusinessVerify' && this.$store.getters['user/getBusinessVerified'] === 1) {
        return
      } else if (path === 'BusinessVerify') {
        this.onTriggerBusinessVerifyModal(true)
        return
      }

      // prevent user from reverify police clearance
      if (path === 'PoliceVerify' && this.$store.getters['user/getPoliceVerified'] === 1) {
        return
      } else if (path === 'PoliceVerify') {
        this.onTriggerPoliceClearanceModal(true)
        return
      }

      // prevent user from changing verified email
      if (path === 'ConfirmEmail' && this.$store.getters['user/getEmailVerified'] === 1) {
        return
      }

      // prevent user from changing verified mobile number
      if (path === 'PromptPhone' && this.$store.getters['user/getUserMobileVerified'] === 1) {
        return
      }

      // prevent user from reverifying facebook
      if (path === 'FacebookVerify' && this.$store.getters['user/getFacebookVerified'] === 1) {
        return
      } else if (path === 'FacebookVerify') {
        // trigger facebook verification process
        this.onFacebookVerify()
        return
      }

      // prevent user from reverifying google
      if (path === 'GoogleVerify' && this.$store.getters['user/getGoogleVerified'] === 1) {
        return
      } else if (path === 'GoogleVerify') {
        // trigger google verification process
        this.onGoogleVerify()
        return
      }
      // Other documents
      if (path === 'OtherDocuments') {
        console.log('check path', path)
        this.otherdocumentsModal = true
        return
        }
      // open in app browser redirect appropriately
      if (path === 'PetSitterIntro') {
        if (!this.$store.getters['user/getSitterIntroVerified']) {
          this.petSitterIntroLoader = true
        }

        this.openUrl(`${this.$t('link.href.petbacker')}/pet-sitter-intro?uuid=${this.$store.getters['user/getUserUuidState']}`)
        return
      } else if (path === 'OnlineTest') {
        // prevent already verified user from retaking
        if (this.$store.getters['user/getUserExamCertified']) {
          return
        }
        this.onlineTestLoader = true
        this.openUrl(`${this.$t('link.href.petbacker')}/pet-sitter-certification-l1?uuid=${this.$store.getters['user/getUserUuidState']}`)
        return
      }

      this.$router.push({name: path})
    },
    onDocumentSubmit (form) {
      this.showLoading = true
      this.$axios.put(`account/${this.$store.getters['user/getUserUuidState']}/verifydocument`, form, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        if (form.accountInfo.documentType === 2) {
          this.submittedType = 'update'
          this.onTriggerSubmittedModal(true)
        } else {
          this.submittedType = 'verification'
          this.onTriggerSubmittedModal(true)
        }
      }).catch(error => {
        console.error(error)
        this.$q.notify(error.response.data.message)
      }).finally(_ => {
        this.$store.dispatch('user/refreshState')
        setTimeout(() => {
          this.showLoading = false
          this.onTriggerBusinessVerifyModal(false)
          this.$refs['business-verify'].resetCount()
          this.onTriggerPoliceClearanceModal(false)
        }, 600)
      })
    },
    onTriggerBusinessVerifyModal (status) {
      this.businessVerifyModal = status
    },
    onFbSuccessLogin (userData) {
      window.facebookConnectPlugin.getAccessToken((token) => {
        this.accessToken = token
        this.submitFBInfo(token)
      })
    },
    onFacebookVerify () {
      this.facebookVerifyLoader = true
      window.facebookConnectPlugin.getLoginStatus((response) => {
        if (response.status === 'connected') {
          // The user is logged in and has authenticated your
          // app, returns response.authResponse object
          this.accessToken = response.authResponse.accessToken
          this.submitFBInfo(response.authResponse.accessToken)
        } else if (response.status === 'not_authorized') {
          // The user hasn't authorized your application.
          window.facebookConnectPlugin.login(['public_profile', 'email'], this.onFbSuccessLogin,
            (error) => {
              console.error(error)
              this.facebookVerifyLoader = false
            })
        } else {
          // The user isn't logged in to Facebook.
          window.facebookConnectPlugin.login(['public_profile', 'email'], this.onFbSuccessLogin,
            (error) => {
              console.error(error)
              this.facebookVerifyLoader = false
            })
        }
      })
    },
    loadGoogleOAuth () {
      // Ensure we load google oauth just once
      if (window.gapi && typeof window.gapi.auth2 === 'object') {
        return
      }

      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: process.env.GOOGLE_AUTH2_CLIENT_ID,
          scope: 'profile email',
          ux_mode: 'popup'
        })

        let vm = this
        let googleAuth = window.gapi.auth2.getAuthInstance()
        googleAuth.signIn().then((response) => {
          let user = window.gapi.auth2.getAuthInstance().currentUser.get()
          vm.submitGoogleInfo(user.getBasicProfile())
        }).catch((e) => {
          console.error(e)
          let error = vm.$t('google.login.error')
          this.$q.notify({
            message: error
          })
          this.googleLoading = false
        })
      })
    },
    onGoogleVerify () {
      this.googleVerifyLoader = true
      if (this.$q.platform.is.cordova) {
        window.plugins.googleplus.login({
          'scopes': 'profile email', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
          'webClientId': process.env.GOOGLE_AUTH2_CLIENT_ID, // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
          'offline': true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        }, (obj) => {
          this.googlePlusObj = obj
          this.submitGoogleInfo(obj)
        }, (msg) => {
          this.googleVerifyLoader = false
        })
      } else {
        if (typeof window.gapi.auth2 === 'undefined') {
          this.loadGoogleOAuth()
          this.$q.notify({
            message: 'It seems there is an error in processing login through google. Please try again later or proceed with login by email',
            type: 'negative'
          })
        }
      }
    },
    submitGoogleInfo (userObject, override = false) {
      let accountInfo = {
        'accountInfo': {
          'uuid': this.$store.getters['user/getUserUuidState'],
          'email': userObject.email ? userObject.email : '',
          'gpId': userObject.userId,
          'gpName': userObject.displayName,
          'gpEmail': userObject.email ? userObject.email : '',
          'gpLink': 'https://plus.google.com/' + userObject.userId,
          'gpAvatar': userObject.imageUrl,
          'mobileCountryId': this.$store.getters['user/getUserMobileCountryId'],
          'mobileNum': this.$store.getters['user/getUserMobileNum'],
          'pushId': this.$store.state.user.pushid,
          'vendor': this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5,
          'osVersion': this.$q.platform.is.cordova ? window.device.version : this.$q.platform.is.versionNumber,
          'platform': this.$q.platform.is.cordova ? window.device.platform : 'WEB',
          'model': this.$q.platform.is.cordova ? window.device.model : this.$q.platform.is.name,
          'screenWidth': screen.width,
          'screenHeight': screen.height,
          'language': this.$_.findWhere(languages, {'value': this.$store.state.user.language}).id,
          'appVersion': process.env.APP_VERSION,
          'referrer': this.$store.state.user.referrer,
          'deviceId': this.$q.platform.is.cordova ? window.device.uuid : this.$q.cookies.get('device-uuid')
        }
      }

      this.$axios.post(`account/logingplus?lang=${this.langToAPI(this.$store.state.user.language)}${override ? '&forcetransfer=1' : ''}`, accountInfo).then((response) => {
        if (response.status === 200) {
          // proceed to update
          this.$store.dispatch('user/updateUserStates', response)
        }
      }).catch(error => {
        console.error(error)
        let errorMessage = this.$t('google.login.error')
        if (error.response && error.response.data.message) {
          errorMessage = error.response.data.message
        }

        this.triggerServerError(true, errorMessage, error.response.data.code)
      }).finally(_ => {
        this.googleVerifyLoader = false
      })
    },
    submitFBInfo (token, override = false) {
      let accountInfo = {
        'accountInfo': {
          'uuid': this.$store.getters['user/getUserUuidState'],
          'access_token': token,
          'mobileCountryId': this.$store.getters['user/getUserMobileCountryId'],
          'mobileNum': this.$store.getters['user/getUserMobileNum'],
          'pushId': this.$store.state.user.pushid,
          'vendor': this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5,
          'osVersion': this.$q.platform.is.cordova ? window.device.version : this.$q.platform.is.versionNumber,
          'platform': this.$q.platform.is.cordova ? window.device.platform : 'WEB',
          'model': this.$q.platform.is.cordova ? window.device.model : this.$q.platform.is.name,
          'screenWidth': screen.width,
          'screenHeight': screen.height,
          'language': this.$_.findWhere(languages, {'value': this.$store.state.user.language}).id,
          'appVersion': process.env.APP_VERSION,
          'referrer': this.$store.state.user.referrer,
          'deviceId': this.$q.platform.is.cordova ? window.device.uuid : this.$q.cookies.get('device-uuid')
        }
      }

      this.$axios.post(`account/loginfacebook?lang=${this.langToAPI(this.$store.state.user.language)}${override ? '&forcetransfer=1' : ''}`, accountInfo).then((response) => {
        if (response.status === 200) {
          // proceed to update
          this.$store.dispatch('user/updateUserStates', response)
        }
      }).catch(error => {
        console.log(error)
        let errorMessage = error.response.data ? error.response.data.message : this.$t('unable.auth.fb')
        let fbErrorMessage = 'active access token'

        // Override error message if we detect 'active access token'
        if (errorMessage.search(fbErrorMessage) !== -1) {
          errorMessage = this.$t('unable.auth.fb')
        }

        this.triggerServerError(true, errorMessage, error.response.data ? error.response.data.code : 0)
      }).finally(_ => {
        this.facebookVerifyLoader = false
      })
    }
  }
}
</script>
