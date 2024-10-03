<template>
    <q-item style="border-bottom: 1px solid lightgrey;" v-if="transaction">
        <q-item-section>
            <q-item-label>{{parseTimeDate(transaction.createdTime)}}</q-item-label>
        </q-item-section>

        <q-item-section>
            <q-item-label :class="transaction.status === 1 ? 'text-warning' : (transaction.credit ? 'text-negative' : 'text-positive')">
                {{transaction.credit ? '-' : '+'}}
                {{getCurrency(transaction.currencyId)}}
                {{transaction.credit || transaction.debit}}
            </q-item-label>
        </q-item-section>

        <q-item-section>
            <q-item-label>
                {{transaction.status === 1 ? 'Pending' : ''}}
                {{transaction.note}}
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
<script>
import countries from 'assets/countries.json'
import moment from 'moment'
export default {
  props: {
    transaction: {
      type: Object,
      required: true
    }
  },
  methods: {
    getCurrency (currencyId) {
      if (currencyId) {
        return this.$_.findWhere(countries, {'id': currencyId.toString()}).currencyCode
      } else {
        return ''
      }
    },
    parseTimeDate (timestamp) {
      return moment.utc(timestamp).local().format('D MMM YYYY')
    }
  }
}
</script>
