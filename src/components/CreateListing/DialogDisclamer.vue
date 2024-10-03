<template>
  <div>
    <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-down" transition-show="slide-up">
        <q-card ref="disclamer-card">
            <!-- Header -->
            <q-toolbar class="fixed-top bg-white" style="z-index: 5000;border-bottom: 1px solid lightgrey;">
                <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
                <q-toolbar-title v-close-popup>
                  <h6 class="q-my-none header-title" style="margin-left: 26%;">{{$t('agreements')}}</h6>
                </q-toolbar-title>
            </q-toolbar>

            <q-card-section class="q-px-none q-pt-xl">
              <img src="statics/images/create_biz_disclaimer.jpg" width="100%" height="auto"/>
            </q-card-section>

            <q-card-section class="q-pb-xl q-mb-xl">
              <b>{{$t('you.understand.that')}}</b>
              <ul v-html="$t('disclaimer.terms')"></ul>
              <q-checkbox v-model="agree" @input="checkValid" :label="$t('disclaimer.agree')"></q-checkbox>
              <p><!-- SPACING --></p>
            </q-card-section>

            <!-- BUTTON BOTTOM will appear on mobile screen -->
            <div class="row text-center fixed-bottom lt-lg">
              <div class="col-xs-12" v-if="showSubmit" @click="triggerServiceModal(true)">
                <div class="full-width z999 text-white q-pa-md bg-primary cursor-pointer font-header-title-large" :class="$q.platform.is.cordova ? 'q-pb-md' : ''">
                    <span>{{ $t('agree') }}</span>
                </div>
              </div>
            </div>
        </q-card>
    </q-dialog>

    <!-- Services Dialog -->
    <dialog-services :trigger="serviceModal" @on-close="triggerServiceModal" @selected-service="onServiceSelected"></dialog-services>
  </div>
</template>
<script>
export default {
  components: {
    'dialog-services': () => import('components/CreateListing/DialogServices.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      agree: false,
      serviceModal: false,
      showSubmit: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    }
  },
  methods: {
    checkValid (status) {
      if (status) {
        this.showSubmit = true
      } else {
        this.showSubmit = false
      }
    },
    triggerServiceModal (value) {
      this.serviceModal = value

      if (value === true) {
        this.sendImpression('Button Click', 'Agree - Agreements', 'Become a Sitter')
      }
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    },
    onServiceSelected (serviceId) {
      /**
       * Does necessary checking when create listing
       * - if user have not enter mobile number
       * - if user have not filled up about me
       */
      // If user still hasn't save phone number
      if (!this.$store.getters['user/getUserMobileNum']) {
        this.$router.replace({name: 'PromptPhone', query: {redirect: 'CreateListing', serviceId: serviceId}})
        return
      }

      // If user still hasn't filled up about me
      if (!this.$store.getters['user/getAboutMe']) {
        this.$router.replace({name: 'AboutMe', query: {redirect: 'CreateListing', serviceId: serviceId}})
        return
      }

      this.$router.push({name: 'CreateListing', params: {serviceId: serviceId}})
    }
  }
}
</script>
