<template>
    <q-dialog v-model="modal" @hide="closePopUp" transition-show="slide-up" transition-hide="slide-down">
        <q-card style="overflow: visible;max-width: 355px; border-radius: 15px;">
          <q-card-section>
            <div class="text-center">
              <q-icon name="fas fa-tags" class="protection-bulb-image" style="height: 50px" size="3em" color="primary"></q-icon>
            </div>
            <div class="bg-white-self">
              <div class="row justify-center column">
                <p class="q-title q-mt-none q-mb-lg text-center protection-title text-weight-bold">{{$t('discount.title')}}</p>
              </div>
              <div class="row text-justify">
                <div class="col-md-12 text-justify protection-desc" style="width:260px;">
                  <q-input v-model="discountAmount" borderless :type="$q.platform.is.desktop ? 'number' : 'tel'" class="input col-xs-3" hide-bottom-space :error="!discountValid" @blur="checkNumValid" :prefix="getCurrency(currency)" :label="$t('enter.discount.amount')"></q-input>
                </div>
              </div>
              <div class="row q-mt-xl">
                <div class="full-width">
                  <q-btn class="full-width text-weight-bold q-my-sm text-capitalize" color="primary" size="lg" :loading="loader" :label="$t('give.discount')" dense @click="checkValid"/>
                  <q-btn class="full-width text-weight-bold q-my-sm text-capitalize" color="primary" flat :label="$t('done')" dense @click="closePopUp"/>
                </div>
              </div>
            </div>
          </q-card-section>
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
    currency: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      discountAmount: null,
      discountValid: true,
      loader: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)
    },
    discountAmount (value) {
      if (value !== null && value !== '' && value !== ' ') {
        this.discountValid = true
      } else {
        this.discountValid = false
      }
    }
  },
  methods: {
    closePopUp () {
      this.$emit('on-close', false)
    },
    checkValid () {
      if (this.discountAmount === null) {
        this.discountValid = false
      }

      // submit valid quote
      if (this.discountValid) {
        this.onGiveDiscount()
      }
    },
    onGiveDiscount () {
      this.loader = true
      let quoteItem = {
        'quotesInfo': {
          'quoteAmount': this.discountAmount,
          'quoteCurrencyId': this.currency,
          'quoteDescription': '',
          'quoteQuantity': 0,
          'quoteTitle': this.$t('discount.title'),
          'quoteType': 3,
          'quoteUnit': '',
          'quoteUnitServiceId': ''
        }
      }

      this.$axios.post(`users/${this.$store.getters['user/getUserUuidState']}/tasks/${this.$route.params.taskId}/quotes`, quoteItem, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.discountAmount = null
        this.$emit('refresh', true)
        this.$route.query.discount = 0
        this.closePopUp()
      }).catch((error) => {
        console.error(error)
        let errorMessage = error.response.data.message ? error.response.data.message : this.$t('something.wrong.gateway')
        this.$q.notify({
          message: errorMessage,
          type: 'negative',
          position: 'top'
        })
      }).finally(_ => {
        this.loader = false
      })
    },
    getCurrency (countryid) {
      for (let index in countries) {
        if (parseInt(countries[index].id) === countryid) {
          return countries[index].currencyCode
        }
      }
    },
    checkNumValid () {
      if (this.discountAmount) {
        this.discountAmount = parseInt(this.discountAmount.toString().replace(/\D/g, ''))
        if (Number.isNaN(this.discountAmount)) {
          this.discountAmount = null
        }
      }
    }
  }
}
</script>
