<!-- card for displaying registered bank details within app-->
<template>
  <div>
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <q-card style="border-radius: 11px;" class="q-mx-md q-py-xs q-my-sm clickable" @click.native="openDetailsModal(true)">
        <q-card-section>
            <q-item class="q-pa-none font-normal" dense >
                <q-item-section>
                  <!-- Payout Type -->
                  <q-item-label class="font-header-title text-wrap" lines="1" >{{checkPaymentType(payoutInfo.paymentMethodId)}}</q-item-label>

                  <!-- Payout Details -->
                  <q-item-label style="white-space: pre;" class="text-grey-8">{{parseText(payoutInfo.paymentAccountInfo)}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-item-label caption>
                        <q-icon name="chevron_right" size="2em"></q-icon>
                    </q-item-label>
                </q-item-section>
            </q-item>
        </q-card-section>
      </q-card>
    </transition>

    <!-- Payout Details Dialog -->
    <payout-details :trigger="showDetailsModal" :payoutDetails="payoutInfo" @on-close="triggerDetailsModal" @on-update="onRefresh"></payout-details>
  </div>
</template>
<script>
export default {
  components: {
    'payout-details': () => import('components/Payout/PayoutDetails.vue')
  },
  props: {
    payoutInfo: {
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
      showLoader: false,
      showDetailsModal: false
    }
  },
  methods: {
    openDetailsModal (status) {
      console.log(status)
      if (this.$route.name === 'AccountHistory') {
        this.$emit('payout-info', this.index)
        return
      }

      this.showDetailsModal = status
    },
    triggerDetailsModal (status) {
      this.showDetailsModal = status
    },
    onRight ({ reset }) {
      this.deletePayoutItem(reset)
    },
    deletePayoutItem (reset) {
      this.showLoader = true
      this.$axios.delete(`users/${this.$store.getters['user/getUserUuidState']}/payout/${this.payoutInfo.id}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        reset()
        this.onRefresh()
      }).catch((error) => {
        reset()
        console.error(error)
        let errorMessage = error.response.data.message ? error.response.data.message : this.$t('something.wrong.gateway')
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      }).finally(_ => {
        this.showLoader = false
        this.$emit('on-refresh')
      })
    },
    onRefresh (updatedInfo) {
      this.$emit('on-refresh', this.index, updatedInfo)
      this.triggerDetailsModal(false)
    },
    parseText (bankDetails) {
      return bankDetails.split(',').join('\n')
    },
    checkPaymentType (paymentId) {
      switch (paymentId) {
        case 2: return 'PayPal'
        case 3: return this.$t('bank')
        // case 4: return 'Zelle'
        case 5: return 'WeChat'
      }
    }
  }
}
</script>
<style lang="stylus">
.q-slide-item__right
  margin-top: 5px
  margin-bottom: 5px
  border-radius: 15px

.q-slide-item__content
  border-radius: 15px
</style>
