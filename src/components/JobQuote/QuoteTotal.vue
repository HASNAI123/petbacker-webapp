<template>
    <div>
        <q-card v-if="priceInfo !== null" style="border-bottom-right-radius: 15px;border-bottom-left-radius: 15px;">
            <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                <q-card-section class="q-py-xs">
                    <q-item class="q-px-none" dense>
                        <q-item-section>
                            <q-item-label>{{$t('total.amount')}}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-item-label>{{`${getCurrency(priceInfo.currencyId)} ${priceInfo.totalAmount}`}}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item class="q-px-none" dense>
                        <q-item-section>
                            <q-item-label>{{(priceInfo.min > priceInfo.totalAmount ) ? '' : this.$t('quotetotal.insurance') + '+'}} {{$t('service.fees')}}
                              <q-btn flat size="sm" @click="openMoreInfo()" :ripple="false" :round="true">
                                <q-icon name="help_outline"></q-icon>
                              </q-btn>
                            </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-item-label>{{`- ${getCurrency(priceInfo.currencyId)} ${priceInfo.serviceCharges}`}}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item class="q-px-none" dense>
                        <q-item-section>
                            <q-item-label>{{$t('you.earn.amount')}}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-item-label>{{`${getCurrency(priceInfo.currencyId)} ${priceInfo.totalEarn}`}}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-card-section>
            </transition>
        </q-card>
        <q-card class="text-center" style="border-bottom-right-radius: 15px;border-bottom-left-radius: 15px;" v-else>
            <div class="q-pa-sm">
              <q-skeleton width="100%" height="15px" class="q-my-sm"></q-skeleton>
              <q-skeleton width="100%" height="15px" class="q-my-md"></q-skeleton>
              <q-skeleton width="100%" height="15px" class="q-my-sm"></q-skeleton>
            </div>
        </q-card>

        <!-- More Info Pop Up -->
        <modal-moreinfo @on-close="updateMoreInfoTrigger" :trigger="moreInfo" :moreInfoText="moreInfoText" :quoteDescriptionLink="quoteDescriptionLink"></modal-moreinfo>
    </div>
</template>
<script>
import countries from 'assets/countries.json'
export default {
  components: {
    'modal-moreinfo': () => import('components/ModalMoreInfo.vue')
  },
  props: {
    priceInfo: {
      required: true
    }
  },
  data () {
    return {
      quoteDescriptionLink: `${this.$t('link.href.help')}/pet-service-providers/how-much-are-the-service-fees`,
      moreInfoText: this.$t('service.fees.more.info'),
      moreInfo: false
    }
  },
  methods: {
    updateMoreInfoTrigger (value) {
      this.moreInfo = value
    },
    openMoreInfo () {
      this.moreInfo = true
    },
    getCurrency (countryid) {
      for (let index in countries) {
        if (parseInt(countries[index].id) === countryid) {
          return countries[index].currencyCode
        }
      }
    }
  }
}
</script>
