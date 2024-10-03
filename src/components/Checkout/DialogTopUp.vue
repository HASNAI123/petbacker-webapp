<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" :transition-hide="$q.platform.is.mobile ? 'slide-down' : ''" :transition-show="$q.platform.is.mobile ? 'slide-up' : ''">
      <q-card style="min-width: 320px;min-height: 400px;">
        <q-toolbar class="q-pl-xs" style="border-bottom: solid 1px lightgrey;">
          <q-btn flat round dense v-close-popup size="lg" icon="chevron_left"/>
          <q-toolbar-title v-close-popup>
            <h6 class="q-my-none" style="margin-left: 33%;">{{$t('top.up')}}</h6>
          </q-toolbar-title>
        </q-toolbar>

        <q-card-section v-if="topUpInfo">
          <p class="font-normal">{{$t('payment.details')}}</p>

          <!-- Break down of top up info -->
          <q-item v-for="(info, index) in topUpInfo.itemsPrice" :key="index" class="q-px-none">
            <q-item-section class="font-normal">
              <q-item-label lines="1">
                {{info.quoteTitle}}
                <q-btn flat size="sm" @click="openMoreInfo(info)" v-if="info.quoteDescription !== ''" :ripple="false" :round="true">
                  <q-icon name="help_outline"></q-icon>
                </q-btn>
              </q-item-label>
            </q-item-section>
            <q-item-section side class="font-normal" style="color:black;">
              <q-item-label lines="1">{{ currency }} {{ Number.parseFloat(info.quotePrice).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') }}</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Total Price -->
          <q-item class="q-px-none">
            <q-item-section class="font-normal">
              <q-item-label lines="1">{{ $t('chat.total') }}</q-item-label>
            </q-item-section>

            <q-item-section side class="font-normal clickable" style="color:black;">
              <q-item-label lines="1" class="text-weight-bold">{{currency}} {{ topUpAmount }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-card-section>
          <!-- Top Up Options -->
          <payment-buttons :responseInfo="responseInfo" :currency="currency" :priceInfo="topUpInfo" :termsChecked="true" :hidePayWithWallet="true" class="q-mx-md"></payment-buttons>
        </q-card-section>
      </q-card>

      <!-- More Info Pop Up -->
      <modal-moreinfo @on-close="triggerMoreInfoModal" :trigger="moreInfoModal" :moreInfoText="moreInfoText" :quoteDescriptionLink="quoteDescriptionLink"></modal-moreinfo>
    </q-dialog>
</template>
<script>
export default {
  components: {
    'payment-buttons': () => import('components/Checkout/PaymentButtons.vue'),
    'modal-moreinfo': () => import('components/ModalMoreInfo.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    topUpAmount: {
      type: Number
    },
    topUpInfo: {
      type: Object,
      required: true
    },
    responseInfo: {
      type: Object,
      required: true
    },
    currency: {
      required: true
    }
  },
  data () {
    return {
      modal: false,
      checked: false,
      moreInfoModal: false,
      moreInfoText: '',
      quoteDescriptionLink: ''
    }
  },
  mounted () {
    if (this.topUpInfo) {

    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    }
  },
  beforeDestroy () {
    this.$emit('on-close', false)
  },
  methods: {
    onClose () {
      this.modal = false
      this.$emit('on-close', false)
    },
    triggerMoreInfoModal (status) {
      this.moreInfoModal = status
    },
    openMoreInfo (item) {
      if (item.quoteDescriptionLink) {
        this.quoteDescriptionLink = item.quoteDescriptionLink
      } else {
        this.quoteDescriptionLink = ''
      }
      this.moreInfoText = item.quoteDescription
      this.triggerMoreInfoModal(true)
    }
  }
}
</script>
