<template>
    <q-item class="q-my-sm font-normal col-10" style="border: 1px solid lightgrey; border-radius: 12px;" @click.native="triggerEditServiceRateModal(true)">
        <q-item-section>
            <q-item-label lines="1" class="font-title">{{rateInfo.ratesTitle}}</q-item-label>
            <q-item-label lines="1"><span class="text-weight-bold">{{computeRates(rateInfo.ratesCurrencyId, rateInfo.ratesAmount, rateInfo.ratesUnit)}}</span>/{{rateInfo.ratesUnit}}</q-item-label>
            <q-item-label lines="1" class="text-wrap" caption v-if="rateInfo.ratesDescription">{{rateInfo.ratesDescription}}</q-item-label>
        </q-item-section>

        <q-item-section side>
            <div style="display:block;">
            <q-item-label><q-icon name="chevron_right" size="1.5em"></q-icon></q-item-label>
            </div>
        </q-item-section>

        <!-- Dialog Service Rate Details -->
        <dialog-edit-servicerates :trigger="editServiceRateModal" @on-close="triggerEditServiceRateModal"
        :id="rateInfo.ratesId"
        :quoteDescription="rateInfo.ratesDescription"
        :defaultUnit="rateInfo.ratesUnit"
        :defaultPrice="parseInt(rateInfo.ratesAmount)"
        :type="rateInfo.ratesTitle"
        :currency="rateInfo.ratesCurrencyId"
        :index="index"
        @on-delete="onRemove"
        @on-save="onSaveRates"></dialog-edit-servicerates>
    </q-item>
</template>
<script>
import countries from 'assets/countries.json'
export default {
  components: {
    'dialog-edit-servicerates': () => import('components/CreateListing/DialogAddServiceRate.vue')
  },
  props: {
    rateInfo: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      editServiceRateModal: false
    }
  },
  methods: {
    onRemove (index) {
      this.$emit('on-remove', index)
    },
    onSaveRates (rateInfo) {
      this.$emit('save-rate', rateInfo, this.index)
    },
    onEditServiceRate () {
      this.triggerEditServiceRateModal(true)
    },
    triggerEditServiceRateModal (value) {
      this.editServiceRateModal = value
    },
    computeRates (currencyId, amount) {
      let currency = this.$_.findWhere(countries, {'id': currencyId.toString()}).currencyCode
      return `${currency} ${amount}`
    }
  }
}
</script>
