<!-- after clicking into middle job quote card in "Your Quotes" page -->
<template>
  <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
      <q-card>
        <!-- Header -->
        <q-toolbar style="border-bottom: solid 1px lightgrey;">
          <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup @click="resetClickNo()"></q-btn>
            <q-toolbar-title v-close-popup>
              <h6 class="q-my-none font-header-title" style="margin-left: 24%;">{{$t('edit.quote.items')}}</h6>
            </q-toolbar-title>
          <!--<q-btn flat round dense icon="add" ></q-btn>-->
        </q-toolbar>

        <!-- Type -->
        <q-card-section v-if="quoteType !== 3">
          <q-select borderless class="input" :disable="selectedType && selectedType.serviceId === quoteTypes[0].serviceId" v-model="selectedType" @input="selected" hide-bottom-space :error="!typeValid" clearable :options="typeOptions" options-selected-class="text-primary" :label="$t('select.quote.type')" ></q-select>
        </q-card-section>

        <!-- Pricing -->
        <q-card-section v-if="selectedType">
          <div v-if="selectedType && selectedType.serviceId === quoteTypes[0].serviceId">
              <q-input v-model="pricing" borderless :type="$q.platform.is.desktop ? 'number' : 'tel'" class="input" hide-bottom-space :error="!pricingValid" @blur="checkNumValid" :prefix="getCurrency(currency)" :suffix="computeSuffixText(quantity1, quantity2, quantity3)" :label="$t('pricing')"></q-input>
          </div>
          <div v-else-if="quoteType === 3">
              <q-input v-model="pricing" borderless :type="$q.platform.is.desktop ? 'number' : 'tel'" style="box-shadow: 0px 2px lightgrey" class="input" hide-bottom-space :error="!pricingValid" @blur="checkNumValid" :prefix="getCurrency(currency)" :label="$t('discount.title')"></q-input>
          </div>
          <div v-else-if="selectedType && selectedType.serviceId === 0" class="row">
              <q-input v-model="pricing" borderless :type="$q.platform.is.desktop ? 'number' : 'tel'" style="box-shadow: 0px 2px lightgrey" class="input col-xs-4" hide-bottom-space :error="!pricingValid" @blur="checkNumValid" :prefix="getCurrency(currency)" :label="$t('pricing')"></q-input>
              <p class="col-xs-1 q-mt-lg text-center font-normal">x</p>
              <q-input v-model="quantity" borderless :type="$q.platform.is.desktop ? 'number' : 'tel'" style="box-shadow: 0px 2px lightgrey" class="input col-xs-3" hide-bottom-space :error="!quantityValid" @blur="checkNumValid"  :label="$t('number')"></q-input>
              <q-input v-model="unit" borderless style="box-shadow: 0px 2px lightgrey" class="input col-xs-3" hide-bottom-space :error="!quantityValid" @blur="checkNumValid"  :label="$t('unit')"></q-input>
          </div>
          <div v-else class="row">
              <q-input v-model="pricing" borderless :type="$q.platform.is.desktop ? 'number' : 'tel'" style="box-shadow: 0px 2px lightgrey" class="input col-xs-4" hide-bottom-space :error="!pricingValid" @blur="checkNumValid" :prefix="getCurrency(currency)" :label="$t('pricing')"></q-input>
              <p class="col-xs-1 q-mt-lg text-center font-normal">x</p>
              <q-input v-model="quantity" borderless :type="$q.platform.is.desktop ? 'number' : 'tel'" style="box-shadow: 0px 2px lightgrey" class="input col-xs-4" hide-bottom-space :error="!quantityValid" @blur="checkNumValid" :suffix="computeSuffixText(quantity1, quantity2, quantity3)"  :label="`${selectedType.unit}`"></q-input>
          </div>
        </q-card-section>

        <!-- Quote Description -->
        <q-card-section class="q-mt-lg" v-if="quoteType !== 3">
          <p class="q-mx-xs text-grey">{{$t('pet.owner.more.comfortable.knowing.what.is.included')}}</p>
          <q-input type="textarea" v-model="description" borderless class="input" stack-label :label="$t('description')"></q-input>
        </q-card-section>

        <!-- Mobile Send Quote Button -->
        <div :class="this.stylingSetting" style="border-top-right-radius: 15px;border-top-left-radius: 15px;">
          <div class="q-pa-md q-pb-lg" @click="allowOnce(1)" >
              <div class="q-pb-sm text-white text-center cursor-pointer font-header-title">
                  <span v-if="!showLoading">{{$t('save.quote')}}</span>
                  <span v-else><q-spinner size="2em"></q-spinner></span>
              </div>
          </div>
        </div>
      </q-card>
  </q-dialog>
</template>
<script>
import countries from 'assets/countries.json'
export default {
props: {
  trigger: {
    type: Boolean,
    required: true
  },
  id: {
    type: Number,
    default: () => { return null }
  },
  quoteTypes: {
    type: Array,
    required: true
  },
  quoteDescription: {
    type: String
  },
  type: {
    type: Number,
    default: () => { return null }
  },
  currency: {
    type: Number,
    required: true
  },
  quantity1: {
    type: Number
  },
  quantity2: {
    type: Number
  },
  quantity3: {
    type: Number
  },
  defaultUnit: {
    type: String
  },
  defaultPrice: {
    type: Number,
    default: () => { return null }
  }
},
data () {
  return {
    modal: false,
    selectedType: null,
    typeOptions: null,
    pricing: null,
    showLoading: false,
    typeValid: true,
    pricingValid: true,
    description: null,
    quantity: null,
    quantityValid: true,
    unit: null,
    unitValid: true,
    quoteType: null,
    noOfClicks: 0,
    canProceed: true,
    processData: true,
    stylingSetting: 'fixed-bottom bg-primary'
  }
},
watch: {
  trigger (value) {
    this.modal = value
    this.$emit('on-close', value)

    if (value) {
      this.pricing = this.defaultPrice
      this.description = this.quoteDescription || null
      this.quantity = this.quantity3 || null
      this.unit = this.defaultUnit || null
      if (this.defaultPrice < 0) {
        // detect discount quote item
        this.quoteType = 3
        this.selectedType = true
      } else {
        this.parseServiceType()
      }
    } else {
      this.pricing = null
      this.description = null
      this.quantity = null
      this.unit = null
      this.selectedType = null
      this.typeValid = true
      this.quoteType = null
    }
  },
  pricing (value) {
    if (value !== null && value !== '' && value !== ' ') {
      this.pricingValid = true
    } else {
      this.pricingValid = false
    }
  },
  unit (value) {
    if (value !== null && value !== '' && value !== ' ') {
      this.unitValid = true
    } else {
      this.unitValid = false
    }
  },
  selectedType (value) {
    if (value !== null && value !== '' && value !== ' ') {
      this.typeValid = true
    } else {
      this.typeValid = false
    }
  },
  quoteTypes (value) {
    this.typeOptions = this.parseServiceType()
  }
},
created () {
  this.typeOptions = this.parseServiceType()
},
beforeDestroy () {
  this.closePopUp()
},
methods: {
  getCurrency (countryid) {
    for (let index in countries) {
      if (parseInt(countries[index].id) === countryid) {
        return countries[index].currencyCode
      }
    }
  },
  checkValid () {
    if (this.selectedType === null) {
      this.typeValid = false
    }

    if (this.pricing === null) {
      this.pricingValid = false
    }

    // submit valid quote
    if (this.pricingValid && this.typeValid) {
      if (this.noOfClicks === 1) {
        this.saveQuote()
      }
    }
  },
  allowOnce (clicked) {
    this.noOfClicks += clicked

    // validate click amount and reset t/f
    if (this.noOfClicks === 1) {
      this.processData = true
    }

    if (this.processData === true) {
      // blocked button styling
      if (this.noOfClicks === 1) {
        this.stylingSetting = 'fixed-bottom bg-grey disabled'
        this.checkValid()
      }
    }
  },
  resetClickNo () {
    this.noOfClicks = 0
    this.stylingSetting = 'fixed-bottom bg-primary'
    this.processData = false
  },
  saveQuote () {
    this.showLoading = true

    if (this.quoteType === 3 && this.pricing < 0) {
      this.pricing = this.pricing * -1
    }

    let quoteItem = {
      'quotesInfo': {
        'quoteAmount': this.pricing,
        'quoteCurrencyId': this.currency,
        'quoteDescription': this.description || '',
        'quoteQuantity': this.quoteType === 3 ? 0 : (this.quantity || this.quantity3 || 0),
        'quoteTitle': this.quoteType === 3 ? 'Discount by Backer' : this.selectedType.value,
        'quoteType': this.quoteType || this.selectedType.type,
        'quoteUnit': this.quoteType === 3 ? '' : (this.selectedType.unit || this.unit),
        'quoteUnitServiceId': this.quoteType === 3 ? '' : this.selectedType.serviceId
      }
    }

    if (this.id) {
      // update existing quote
      this.$axios.put(`users/${this.$store.getters['user/getUserUuidState']}/tasks/${this.$route.params.taskId}/quotes/${this.id}`, quoteItem, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$emit('refresh', true)
        this.closePopUp()
      }).catch((error) => {
        console.error(error)
        let errorMessage = error.response.data ? error.response.data.message : this.$t('something.wrong.gateway')
        this.$emit('on-error', true, 'Revise Quote', errorMessage, this.$t('note'), error.response.data.code, 'Continue with Quote')
      }).finally(_ => {
        this.showLoading = false
      })
    } else if (this.$route.query.serviceId) {
      this.onFirstQuote(quoteItem, this.$route.query.override)
    } else {
      // add new quote item
      this.$axios.post(`users/${this.$store.getters['user/getUserUuidState']}/tasks/${this.$route.params.taskId}/quotes`, quoteItem, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$emit('refresh', true)
        this.closePopUp()
      }).catch((error) => {
        console.error(error)
        let errorMessage = error.response.data ? error.response.data.message : this.$t('something.wrong.gateway')
        this.$emit('on-error', true, this.$t('find.out.more'), errorMessage, this.$t('note'), error.response.data.code)
      }).finally(_ => {
        this.showLoading = false
      })
    }
  },
  onFirstQuote (quoteInfo, override = false) {
    this.$axios.post(`users/${this.$store.getters['user/getUserUuidState']}/tasks/${this.$route.params.taskId}/firstquote${override ? '?override=1' : ''}`, quoteInfo, {
      headers: {
        Authorization: this.$store.getters['user/authorizationHeader']
      }
    }).then((response) => {
      this.$emit('refresh', true)
      this.closePopUp()
    }).catch((error) => {
      console.error(error)
      let errorMessage = error.response.data ? error.response.data.message : this.$t('something.wrong.gateway')
      this.$emit('on-error', true, this.$t('find.out.more'), errorMessage, this.$t('note'), error.response.data.code)
    }).finally(_ => {
      this.showLoading = false
    })
  },
  checkNumValid () {
    if (this.pricing) {
      this.pricing = parseInt(this.pricing.toString().replace(/\D/g, ''))
      if (Number.isNaN(this.pricing)) {
        this.pricing = null
      }
    }

    if (this.quantity) {
      this.quantity = parseInt(this.quantity.toString().replace(/\D/g, ''))
      if (Number.isNaN(this.quantity)) {
        this.quantity = null
      }
    }
  },
  selected (value) {
    this.selectedType = value
    this.pricing = null
    this.description = null
    this.quantity = null
  },
  closePopUp () {
    this.modal = false
    this.$emit('on-close', false)
    this.resetClickNo()
  },
  parseServiceType () {
    let types = []

    for (let i in this.quoteTypes) {
      let type = {
        label: this.quoteTypes[i].title,
        value: this.quoteTypes[i].title,
        type: this.quoteTypes[i].type,
        serviceId: this.quoteTypes[i].serviceId,
        unit: this.quoteTypes[i].unit
      }

      if (type.serviceId === parseInt(this.$route.query.serviceId)) {
        this.selectedType = type
        this.quoteType = type.type
      } else if (type.serviceId === this.type) {
        this.selectedType = type
        this.quoteType = type.type
      } else if (type.serviceId === this.quoteTypes[0].serviceId) {
        // prevent multi required service type to add as item
        continue
      } else {
        types.push(type)
      }
    }

    return types
  },
  computeSuffixText (quantity1, quantity2, quantity3) {
    if (this.selectedType && this.selectedType.serviceId) {
      if (this.selectedType.serviceId === this.quoteTypes[0].serviceId) {
        // TODO: backend should return quantity1 and quantity2
        if (quantity1 && quantity2) {
          return `x ${quantity1} ${this.selectedType.unit}(s) x ${quantity2} Pet(s)`
        } else {
          return ''
        }
      } else if (this.selectedType.serviceId === 0) {
        return `x `
      } else {
        return `${this.selectedType.unit}(s)`
      }
    } else {
      return ''
    }
  }
}
}
</script>
