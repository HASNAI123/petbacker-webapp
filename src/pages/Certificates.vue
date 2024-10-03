<template>
  <q-page :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}" class="justify-center q-pb-xl margin-auto">
    <!-- Training Cert -->
    <q-item class="input q-ma-md" clickable @click="onTriggerCertModal(true, 'training.cert')">
        <q-item-section avatar>
            <q-avatar square>
              <q-icon name="fas fa-certificate" size="35px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{$t('training.cert')}}</q-item-label>
            <!-- <q-item-label v-else class="text-primary" caption>{{$t('verify.now')}}</q-item-label> -->
        </q-item-section>

        <q-item-section side v-if="$store.getters['user/getTrainingCertified'] === 1">
          <q-item-label class="text-position text-positive" caption><q-icon name="fas fa-check-circle" size="md"></q-icon></q-item-label>
        </q-item-section>
    </q-item>

    <!-- Grooming Certification -->
    <q-item class="input q-ma-md" clickable @click="onTriggerCertModal(true, 'grooming.cert')">
        <q-item-section avatar>
            <q-avatar square>
              <q-icon name="fas fa-cut" size="35px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{$t('grooming.cert')}}</q-item-label>
            <!-- <q-item-label v-else class="text-primary" caption>{{$t('verify.now')}}</q-item-label> -->
        </q-item-section>

        <q-item-section side v-if="$store.getters['user/getGroomingCertified'] === 1">
          <q-item-label class="text-position text-positive" caption><q-icon name="fas fa-check-circle" size="md"></q-icon></q-item-label>
        </q-item-section>
    </q-item>

    <!-- Vet Certification -->
    <q-item class="input q-ma-md" clickable @click="onTriggerCertModal(true, 'vet.cert')">
        <q-item-section avatar>
            <q-avatar square>
                <q-icon name="fas fa-user-md" size="28px" color="secondary"></q-icon>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{$t('vet.cert')}}</q-item-label>
            <!-- <q-item-label v-else class="text-primary" caption>{{$t('verify.now')}}</q-item-label> -->
        </q-item-section>

        <q-item-section side v-if="$store.getters['user/getVetCertified'] === 1">
          <q-item-label class="text-position text-positive" caption><q-icon name="fas fa-check-circle" size="md"></q-icon></q-item-label>
        </q-item-section>
    </q-item>

    <!-- Dialog Certification Submit -->
    <dialog-submit-certification :trigger="certificationModal"
    @on-close="onTriggerCertModal"
    @on-document-submit="onDocumentSubmit"
    :showLoading="showLoading"
    @on-loading="onLoading"
    :type="certificateType"></dialog-submit-certification>

    <!-- Dialog pop up after document submit -->
    <dialog-submitted :trigger="submittedModal" :type="submittedType" @on-close="onTriggerSubmittedModal"></dialog-submitted>
  </q-page>
</template>
<script>
export default {
  components: {
    'dialog-submit-certification': () => import('components/IdentityVerification/OtherDocuments.vue'),
    'dialog-submitted': () => import('components/IdentityVerification/DialogSubmitted.vue')
  },
  data () {
    return {
      certificateType: 'training.cert',
      showLoading: false,
      submittedModal: false,
      certificationModal: false,
      submittedType: 'verification'
    }
  },
  methods: {
    onLoading (status) {
      this.showLoading = status
    },
    onTriggerCertModal (status, certType = 'training.cert') {
      this.certificateType = certType
      this.certificationModal = status
    },
    onTriggerSubmittedModal (status) {
      this.submittedModal = status
    },
    onDocumentSubmit (form) {
      this.showLoading = true
      this.$axios.put(`account/${this.$store.getters['user/getUserUuidState']}/verifydocument`, form, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.onTriggerSubmittedModal(true)
      }).catch(error => {
        console.error(error)
        this.$q.notify(error.response.data.message)
      }).finally(_ => {
        this.$store.dispatch('user/refreshState')
        setTimeout(() => {
          this.showLoading = false
          this.onTriggerCertModal(false)
        }, 600)
      })
    }
  }
}
</script>
