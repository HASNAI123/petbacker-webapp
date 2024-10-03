<template>
    <q-dialog v-model="modal" @hide="onClose">
      <q-card style="overflow: visible;border-radius: 11px;">
        <q-card-section style="min-height: 100px;max-width: 280px;" class="q-px-none q-pt-md q-pb-sm">
          <div class="tip-bulb">
            <img src="statics/images/logo-mid.jpg" class="tip-bulb-image"/>
          </div>
          <div class="bg-white">
              <div class="row justify-center">
                <div class="col-12 text-center q-pa-md tip-desc">
                  <p class="q-my-sm font-header-title">{{$t('be.responsible')}}</p>
                  <p class="q-my-sm">{{$t('minimum.fees.prompt.description', {currency: getCurrency(),minimum: minimum, unit: unit})}}</p>
                </div>
              </div>
              <div class='full-width q-px-md'>
                <q-btn class="full-width q-my-xs" color="primary" @click="onRevise" :label="$t('revise.quote')"></q-btn>
                <q-btn class="full-width q-my-xs " flat color="primary" @click="onClose" :label="$t('requests.page.cancelrequest')"></q-btn>
              </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>
<script>
import countries from '../../assets/countries.json'

export default {
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    minimum: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    currency: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      modal: false
    }
  },
  created () {
    console.log('sdfs')
    this.getCurrencyCode()
  },

  watch: {
    trigger (value) {
      this.modal = value
      console.log(this.getCurrencyCode)
    }
  },
  methods: {
    getCurrency () {
      for (let index in countries) {
        if (parseInt(countries[index].id) === this.currency) {
          return countries[index].currencyCode
        }
      }
    },
    onRevise () {
      this.onClose()
      this.$emit('on-revise', true)
    },
    onContinue () {
      this.onClose()
      this.$emit('on-continue', true)
    },
    onClose () {
      this.$emit('on-close', false)
      console.log(this.getCurrencyCode)
    }
  }
}
</script>
