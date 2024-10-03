<template>
  <q-page padding :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}" class="justify-center q-pb-xl margin-auto">
    <!-- ID verification -->
    <q-item class="input q-ma-md" @click.native="triggerModal('identity')">
        <q-item-section avatar>
            <q-avatar square>
                <q-icon name="far fa-address-card" size="35px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{$t('verify.id')}}</q-item-label>
            <q-item-label v-if="$store.getters['user/getIdVerified'] === 2" class="text-position text-warning" caption>{{$t('status.pending')}}</q-item-label>
            <q-item-label v-else-if="$store.getters['user/getIdVerified'] === 1" class="text-position text-positive" caption>{{$t('status.verified')}}</q-item-label>
            <q-item-label v-else class="text-negative" caption>{{$t('required')}}</q-item-label>
        </q-item-section>
    </q-item>

    <!-- Dialog Identify Verification -->
    <dialog-identity ref="id-verify" :trigger="identityModal" @on-close="onCloseIdentityModal" @on-id-submit="onIdSubmit" :showLoading="showLoading"></dialog-identity>

    <!-- Selfie Verification -->
    <q-item class="input q-ma-md" @click.native="triggerModal('selfie')">
        <q-item-section avatar>
            <q-avatar square>
                <q-icon name="fas fa-portrait" size="35px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{$t('selfie.with.id')}}</q-item-label>
            <q-item-label v-if="$store.getters['user/getSelfieVerified'] === 2" class="text-position text-warning" caption>{{$t('status.pending')}}</q-item-label>
            <q-item-label v-else-if="$store.getters['user/getSelfieVerified'] === 1" class="text-position text-positive" caption>{{$t('status.verified')}}</q-item-label>
            <q-item-label v-else class="text-negative" caption>{{$t('required')}}</q-item-label>
        </q-item-section>
    </q-item>

    <!-- Dialog Selfie -->
    <dialog-selfie :trigger="selfieModal" @on-close="onCloseSelfieModal" @on-selfie-submit="onSelfieSubmit" :showLoading="showLoading"></dialog-selfie>

    <!-- Optional Documents -->
    <h6 class="q-mx-md q-mb-none text-capitalize">{{$t('optional')}}</h6>
    <!-- Driving License -->
    <q-item class="input q-ma-md" @click.native="triggerModal('license')">
        <q-item-section avatar>
            <q-avatar square>
                <q-icon name="fas fa-car-side" size="28px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{$t('driving.license')}}</q-item-label>
            <q-item-label caption>{{$t('required.for.taxi.service')}}</q-item-label>
        </q-item-section>
    </q-item>

    <!-- Passport -->
    <q-item class="input q-ma-md" @click.native="triggerModal('passport')">
        <q-item-section avatar>
            <q-avatar square>
                <q-icon name="fas fa-passport" size="30px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{ $t('passport') }}</q-item-label>
            <q-item-label caption>{{ $t('optional.if.dont.have.id') }}</q-item-label>
        </q-item-section>
    </q-item>

    <!-- Police Clearance -->
    <q-item class="input q-ma-md" @click.native="triggerModal('clerance')">
        <q-item-section avatar>
            <q-avatar square>
                <q-icon name="fas fa-id-badge" size="30px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{$t('police.clearance')}}</q-item-label>
            <q-item-label caption>{{ $t('optional.if.dont.have.id') }}</q-item-label>
        </q-item-section>
    </q-item>

    <!-- Payout ID -->
    <q-item class="input q-ma-md" @click.native="triggerModal('payout')">
        <q-item-section avatar>
            <q-avatar square>
                <q-icon name="fas fa-money-check" size="30px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{$t('payout.id')}}</q-item-label>
            <q-item-label caption>{{$t('payout.id.description')}}</q-item-label>
        </q-item-section>
    </q-item>

    <!-- Get Yourself verified note -->
    <q-item class="q-ma-md" style="border: 2px solid lightgrey;border-radius: 11px;">
        <q-item-section>
            <q-item-label caption>{{$t('get.yourself.verified')}}</q-item-label>
        </q-item-section>
    </q-item>

    <!-- Dialog Other Optional Documents -->
    <dialog-other-document :trigger="othersModal"
    @on-close="onCloseOthersModal"
    @on-document-submit="submitInfo"
    :showLoading="showLoading"
    @on-loading="onLoading"
    :type="documentType"></dialog-other-document>

    <!-- Dialog pop up after document submit -->
    <dialog-submitted :trigger="submittedModal" :type="'verification'" @on-close="onCloseSubmittedModal"></dialog-submitted>
  </q-page>
</template>
<script>
export default {
  components: {
    'dialog-submitted': () => import('components/IdentityVerification/DialogSubmitted.vue'),
    'dialog-identity': () => import('components/IdentityVerification/DialogID.vue'),
    'dialog-selfie': () => import('components/IdentityVerification/DialogSelfie.vue'),
    'dialog-other-document': () => import('components/IdentityVerification/OtherDocuments.vue')
  },
  data () {
    return {
      identityModal: false,
      showLoading: false,
      selfieModal: false,
      submittedModal: false,
      documentType: null,
      othersModal: false
    }
  },
  mounted () {
    if (this.$route.query.type) {
      switch (parseInt(this.$route.query.type)) {
        case 1: this.triggerModal('identity'); break
        case 7: this.triggerModal('selfie'); break
        case 8: this.triggerModal('license'); break
        case 9: this.triggerModal('passport'); break
        case 10: this.triggerModal('clerance'); break
        case 11: this.triggerModal('payout'); break
      }
    }
  },
  methods: {
    triggerModal (modal) {
      switch (modal) {
        case 'identity':
          if (this.$store.getters['user/getIdVerified'] === 1) {
            break
          }
          this.identityModal = true
          break
        case 'selfie':
          if (this.$store.getters['user/getSelfieVerified'] === 1) {
            break
          }
          this.selfieModal = true
          break
        case 'license':
          this.documentType = 'driving.license'
          this.othersModal = true
          break
        case 'passport':
          this.documentType = 'passport'
          this.othersModal = true
          break
        case 'clerance':
          this.documentType = 'document'
          this.othersModal = true
          break
        case 'payout':
          this.documentType = 'payout.verify'
          this.othersModal = true
          break
      }
    },
    onLoading (status) {
      this.showLoading = status
    },
    onCloseOthersModal (status) {
      this.othersModal = status
    },
    onCloseSubmittedModal (status) {
      this.submittedModal = status
    },
    onCloseSelfieModal (status) {
      this.selfieModal = status
    },
    onCloseIdentityModal (status) {
      this.identityModal = status
    },
    onIdSubmit (info) {
      let form = {
        'accountInfo': {
          'documentType': 1,
          'fileName': info.fileName,
          'IDBackFileName': info.IDBackFileName,
          'fullName': info.fullName,
          'icNumber': info.icNumber,
          'dob': info.dob
        }
      }

      this.submitInfo(form)
    },
    onSelfieSubmit (info) {
      let form = {
        'accountInfo': {
          'documentType': 7,
          'fileName': info.fileName
        }
      }

      this.submitInfo(form)
    },
    submitInfo (info) {
      this.showLoading = true
      this.$axios.put(`account/${this.$store.getters['user/getUserUuidState']}/verifydocument`, info, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        if (info.accountInfo.documentType === 1 || info.accountInfo.documentType === 9) {
          this.$store.commit('user/updateIdVerified', 2)
        } else if (info.accountInfo.documentType === 7) {
          this.$store.commit('user/updateSelfieVerified', 2)
        }
        this.submittedModal = true
      }).catch(error => {
        console.error(error)
        this.$q.notify(error.response.data.message)
      }).finally(_ => {
        this.showLoading = false
        this.onCloseIdentityModal(false)
        this.$refs['id-verify'].resetCount()
        this.onCloseSelfieModal(false)
        this.onCloseOthersModal(false)
      })
    }
  }
}
</script>
