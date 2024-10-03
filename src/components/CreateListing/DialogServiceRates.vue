<template>
    <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
        <q-card>
          <!-- Header -->
          <q-toolbar style="border-bottom: solid 1px lightgrey;">
            <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
              <q-toolbar-title v-close-popup>
                <h6 class="q-my-none service-coverage-title font-header-title">{{$t('service.rates.title')}}</h6>
              </q-toolbar-title>
          </q-toolbar>

          <!-- Service Rates -->
          <q-card-section>
            <!-- Rate Cards -->
            <service-rate-card v-for="(rate, index) in serviceRates" :key="index" :rateInfo="rate" :index="index" @on-remove="onRemoveServiceRate" @save-rate="updateServiceRate"></service-rate-card>

            <!-- Add Rate button -->
            <q-item class="q-my-sm font-normal" style="border: 1px solid lightgrey; border-radius: 12px;opacity: 1;" @click.native="triggerAddServiceRateModal(true)">
              <q-item-section>
                <q-item-label lines="1" class="font-title">{{$t('add.service.rate.title')}}</q-item-label>
                <q-item-label caption>{{$t('service.rates.add.multiple')}}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <div style="display:block;">
                  <q-item-label><q-icon name="chevron_right" size="1.5em"></q-icon></q-item-label>
                </div>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>

        <!-- Dialog Add Service Rate -->
        <dialog-add-servicerate :trigger="addServiceRateModal" @on-close="triggerAddServiceRateModal"
        :defaultUnit="serviceRates[0].ratesUnit"
        :type="serviceRates[0].ratesTitle"
        @on-save="onSaveRates"></dialog-add-servicerate>
    </q-dialog>
</template>
<script>
export default {
  components: {
    'service-rate-card': () => import('components/CreateListing/ServiceRateCard.vue'),
    'dialog-add-servicerate': () => import('components/CreateListing/DialogAddServiceRate.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    serviceRates: {
      type: Array,
      required: true
    },
    loader: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modal: false,
      addServiceRateModal: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)
    }
  },
  methods: {
    onRemoveServiceRate (index) {
      let listingRates = this.serviceRates
      listingRates.splice(index, 1)

      this.$emit('on-save', listingRates)
    },
    updateServiceRate (rateInfo, index) {
      let listingRates = this.serviceRates
      listingRates.splice(index, 1, rateInfo)

      this.$emit('on-save', listingRates)
    },
    onSaveRates (rateInfo) {
      let listingRates = this.serviceRates
      listingRates.push(rateInfo)

      this.$emit('on-save', listingRates)
    },
    triggerAddServiceRateModal (status) {
      this.addServiceRateModal = status
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
<style lang="stylus">
.service-coverage-title
  margin-left: 24%
</style>
