<!-- the page showing service rates after clicking i am interested btn-->
<template>
    <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
        <q-card :class="{'desktop-size': $q.platform.is.desktop}">
          <!-- Header -->
          <q-toolbar >
            <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
              <q-toolbar-title v-close-popup>
                <h6 class="q-my-none rates-title font-header-title">{{$t('service.rates.title')}}</h6>
              </q-toolbar-title>
            <!--<q-btn flat round dense icon="add" ></q-btn>-->
          </q-toolbar>

          <!-- Rate Cards -->
          <q-card-section>
            <q-item class="q-my-sm font-normal" style="border: 1px solid lightgrey; border-radius: 12px;" v-for="rate in serviceRates.items" :key="rate.ratesId" @click.native="onFirstQuote(rate)">
              <q-item-section>
                <q-item-label lines="1" class="font-title">{{rate.ratesTitle}}</q-item-label>
                <q-item-label lines="1"><span class="text-weight-bold">{{getCurrency(rate.ratesCurrencyId)}}{{rate.ratesAmount}}</span>/{{rate.ratesUnit}}</q-item-label>
                <q-item-label lines="1" class="text-wrap" caption>{{rate.ratesDescription}}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <div :ref="'chevron' + rate.ratesId" style="display:block;">
                  <q-item-label><q-icon name="chevron_right" size="1.5em"></q-icon></q-item-label>
                </div>
                <div :ref="rate.ratesId" style="display:none;">
                  <q-spinner :size="25" ></q-spinner>
                </div>
              </q-item-section>
            </q-item>
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
    ratesInfo: {
      type: Object,
      required: true
    },
    serviceId: {
      type: Number,
      required: true
    },
    taskId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      serviceRates: null,
      onFirstQuoteInProgress: false
    }
  },
  created () {
    this.serviceRates = this.ratesInfo
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)
    },
    ratesInfo (value) {
      this.serviceRates = value
    }
  },
  methods: {
    closePopUp () {
      this.$emit('on-close', false)
    },
    getCurrency (countryid) {
      for (let index in countries) {
        if (parseInt(countries[index].id) === countryid) {
          return countries[index].currencyCode
        }
      }
    },
    onFirstQuote (rateInfo, override = false) {
      if (this.onFirstQuoteInProgress) return
      this.onFirstQuoteInProgress = true
      // show loading
      this.$refs['chevron' + rateInfo.ratesId][0].style.display = 'none'
      this.$refs[rateInfo.ratesId][0].style.display = 'block'

      let quoteInfo = {
        'quotesInfo': {
          'quoteAmount': rateInfo.ratesAmount,
          'quoteCurrencyId': rateInfo.ratesCurrencyId,
          'quoteDescription': rateInfo.ratesDescription,
          'quoteTitle': rateInfo.ratesTitle,
          'quoteType': 0,
          'quoteUnit': rateInfo.ratesUnit,
          'quoteUnitServiceId': this.serviceId
        }
      }
      this.$axios.post(`users/${this.$store.getters['user/getUserUuidState']}/tasks/${this.taskId}/firstquote${override ? '?override=1' : ''}`, quoteInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$emit('on-first-quote')
        //  this.$router.replace({name: 'JobQuote', params: {taskId: this.taskId}})
      }).catch((error) => {
        console.error(error)
        this.$refs[rateInfo.ratesId][0].style.display = 'none'
        this.$refs['chevron' + rateInfo.ratesId][0].style.display = 'block'
        this.$emit('on-error', true, error.response.data.message, error.response.data.code, {rateInfo: rateInfo})
      }).finally(() => {
        this.onFirstQuoteInProgress = false
      })
    }
  }
}
</script>
<style lang="stylus">
.rates-title
  margin-left: 23%
.desktop-size
  width: 400px
  min-heigth: 800px
</style>
