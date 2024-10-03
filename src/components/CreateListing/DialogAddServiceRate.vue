<template>
  <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
      <q-card>
        <!-- Header -->
        <q-toolbar >
          <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
          <q-toolbar-title v-close-popup>
            <h6 class="q-my-none header-title font-header-title">{{$t('add.service.rate.title')}}</h6>
          </q-toolbar-title>
          <q-btn v-if="$route.name === 'EditListing'" flat round dense icon="delete" color="negative" @click="triggerPromptDialog(true, 'Are you sure you want to delete this service rate?', 'Delete')"></q-btn>
        </q-toolbar>

        <!-- Type -->
        <q-card-section>
          <q-input borderless class="input" v-model="type" :readonly="type !== null" ref="serviceType" @focus="onFocus" hide-bottom-space options-selected-class="text-primary" :label="$t('select.service.type')" ></q-input>
        </q-card-section>

        <!-- Pricing -->
        <q-card-section class="q-mt-lg">
          <q-input v-model="pricing" borderless :type="$q.platform.is.desktop ? 'number' : 'tel'" class="input" :error="!pricingValid" hide-bottom-space :prefix="getCurrency()" :suffix="defaultUnit" :label="$t('input.your.pricing')"></q-input>
        </q-card-section>

        <!-- Quote Description -->
        <q-card-section class="q-mt-lg">
          <p class="text-grey">{{$t('pet.owner.more.comfortable.knowing.what.is.included')}}</p>
          <q-input  @keyup="checkDescriptionError" :error="descerror" type="textarea" v-model="description" borderless class="input" stack-label label="Description"></q-input>

        </q-card-section>
        <!-- Mobile Send Quote Button -->
        <div class="fixed-bottom bg-primary" style="border-top-right-radius: 15px;border-top-left-radius: 15px;">
          <div class="q-pa-md q-pb-lg" @click="checkValid">
              <div class="q-pb-sm text-white text-center cursor-pointer font-header-title">
                  <span>{{$t('save.rate')}}</span>
              </div>
          </div>
        </div>

        <!-- Prompt Dialog -->
        <dialog-prompt :trigger="promptModal" :message="promptMessage" :okButtonLabel="okBtnLabel" :cancelButtonLabel="canceblBtnLabel" @on-ok="onPromptOk" @on-close="triggerPromptDialog"></dialog-prompt>
      </q-card>
  </q-dialog>
</template>
<script>
import countries from 'assets/countries.json'
export default {
  components: {
    'dialog-prompt': () => import('components/DialogPrompt.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    quoteDescription: {
      type: String
    },
    type: {
      type: String
    },
    defaultUnit: {
      type: String
    },
    defaultPrice: {
      type: Number,
      default: () => { return null }
    },
    id: {
      type: Number,
      default: () => { return null }
    },
    currency: {
      type: Number,
      default: null
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      modal: false,
      unit: null,
      description: null,
      pricing: null,
      pricingValid: true,
      promptModal: false,
      promptMessage: 'Are you sure you want to delete this service rate?',
      okBtnLabel: 'Delete',
      canceblBtnLabel: this.$t('chat.later'),
      descerror: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)

      if (value) {
        this.pricingValid = true
        this.pricing = this.defaultPrice
        this.description = this.quoteDescription
        this.unit = this.defaultUnit
      } else {
        this.pricing = null
        this.description = null
        this.unit = null
      }
    },
    pricing (value) {
      if (value !== null && value !== '' && value !== ' ') {
        this.pricingValid = true
      } else {
        this.pricingValid = false
      }
    }
  },
  computed: {
    isDescriptionInvalid () {
      return this.description === '' || this.description === undefined
    }
  },
  methods: {
    checkDescriptionError () {
      console.log('checking error')
      this.checkdesc()
    },
    onPromptOk () {
      this.closePopUp()
      this.$emit('on-delete', this.index)
    },
    triggerPromptDialog (status, message = '', okLabel = null) {
      this.promptMessage = message
      this.okBtnLabel = okLabel
      this.promptModal = status
    },
    onFocus () {
      this.$refs['serviceType'].blur()
    },
    getCurrency () {
      if (this.currency) {
        return this.$_.findWhere(countries, {'id': this.currency.toString()}).currencyCode
      } else {
        return this.$_.findWhere(countries, {'id': this.$store.getters['user/getUserPrefferedCurrency'].toString()}).currencyCode
      }
    },
    checkValid () {
      if (this.pricing === null || this.pricing < 0) {
        this.pricingValid = false
      }

      // submit valid rates
      if (this.pricingValid) {
        this.saveRate()
      }
    },
    checkdesc () {
      this.descerror = false
      if (this.description === '' || this.description === undefined) {
        this.descerror = true
      }
      console.log('check the descprition value', this.description)
    },
    saveRate () {
      console.log('triggered save rate')
      this.checkdesc()

      // Check if description is empty or undefined
      if (!this.description || this.description.trim() === '') {
        this.descerror = true
        return
      }

      let rate = {
        id: this.id,
        ratesTitle: this.type,
        currency: this.getCurrency(),
        ratesCurrencyId: this.currency || this.$store.getters['user/getUserPrefferedCurrency'],
        ratesAmount: this.pricing,
        ratesUnit: this.unit,
        ratesDescription: this.description
      }

      // Proceed with saving the rate
      this.$emit('on-save', rate)
      this.closePopUp()
    },

    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
