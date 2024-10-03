<!-- navigated from withdrawal page -->
<template>
  <q-dialog v-model="modal" :maximized="$q.platform.is.mobile" @hide="onClose" transition-show="slide-left" transition-hide="slide-right">
    <q-card :style="{minWidth: $q.platform.is.desktop ? '385px' : '', height: $q.platform.is.desktop ? '630px' : ''}">
      <q-toolbar class="q-pl-xs fixed-top bg-white" style="border-bottom: solid 1px lightgrey;z-index: 2000;">
        <q-btn flat round dense v-close-popup size="lg" icon="chevron_left"/>
        <q-toolbar-title v-close-popup>
          <h6 class="q-my-none" style="margin-left: 24%;">{{$t('payout.account')}}</h6>
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section v-if="payoutInfo" class="q-px-none q-mt-xl q-mb-xl">
        <payout-card v-for="(payout, index) in payoutInfo.items" :key="payout.id" :payoutInfo="payout" :index="index" @on-refresh="refreshPayoutDetails" @payout-info="getPayoutAccountInfo"></payout-card>

        <!-- Add New Payout -->
        <transition appear enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
          <q-card style="border-radius: 11px;margin-left:3%;margin-right:3%;margin-top:3%;opacity: 0.5;" @click="triggerPayoutTypeModel(true)">
              <q-card-section>
                  <q-item class="q-pa-none font-normal" dense >
                      <q-item-section>
                        <!-- Payout Type -->
                        <q-item-label class="font-header-title text-wrap" lines="1" >Add New Payout</q-item-label>

                        <!-- Payout Details -->
                        <q-item-label style="white-space: pre;" class="text-grey-8">Click here to add additional payout option</q-item-label>
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
      </q-card-section>
      <q-card-section class="text-center q-mt-lg" v-else>
        <ComponentPreLoader></ComponentPreLoader>
      </q-card-section>
    </q-card>

    <!-- Dialog Payout Type Selection -->
    <dialog-payout-type :trigger="payoutTypeModel" @on-close="triggerPayoutTypeModel" @on-select="onPayoutTypeSelected"></dialog-payout-type>

    <!-- Dialog Add Payout -->
    <dialog-add-payout :trigger="addPayoutModel" :type="payoutType" @on-close="triggerPayoutModel" @on-update="refreshPayoutDetails"></dialog-add-payout>

    <!-- Error Dialog -->
    <dialog-error :trigger="errorModal"  @on-ok="onErrorOk" :statusCode="errorStatusCode" :okButtonLabel="errorOkBtnLabel" :message="errorMessage" :learnMoreLink="learnMoreLink" @on-close="triggerErrorModal"></dialog-error>
  </q-dialog>
</template>
<script>
export default {
  components: {
    'payout-card': () => import('components/Payout/PayoutCard.vue'),
    'dialog-add-payout': () => import('components/Payout/DialogAddPayout.vue'),
    'dialog-payout-type': () => import('components/Payout/DialogPayoutType.vue'),
    'dialog-error': () => import('components/DialogError.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      payoutInfo: null,
      addPayoutModel: false,
      payoutTypeModel: false,
      payoutType: 2,
      excludePaypal: [
        106, // India
        159, // Malaysia
        199 // Singapore
      ],
      bank: [
        106, // India
        159, // Malaysia
        199, // Singapore
        70, // Europe
        31, // Brazil
        78, // UK
        49, // Colombia,
        198, // Sweden,
        226 // Turkey
      ],
      wechat: [96, 48],
      // zelle: [234],
      errorModal: false,
      errorMessage: '',
      errorOkBtnLabel: null,
      errorStatusCode: 0,
      learnMoreLink: null
    }
  },
  watch: {
    trigger (value) {
      this.modal = value

      if (this.modal) {
        this.getPayoutInfo()
      }
    }
  },
  methods: {
    onPayoutTypeSelected (type) {
      this.payoutType = type
      this.triggerPayoutTypeModel(false)
      this.triggerPayoutModel(true)
    },
    triggerPayoutTypeModel (status) {
      if (this.excludePaypal.indexOf(this.$store.getters['user/getUserPrefferedCurrency']) === -1 ||
    this.wechat.indexOf(this.$store.getters['user/getUserPrefferedCurrency']) > -1 ||
    this.bank.indexOf(this.$store.getters['user/getUserPrefferedCurrency']) > -1) {
        this.payoutTypeModel = status
      } else {
        this.errorMessage = this.$t('Unable to update information. Please contact our customer support for assistance')
        this.errorOkBtnLabel = this.$t('select.payout.account')
        this.errorStatusCode = 1
        this.triggerErrorModal(true)
      }
    },
    triggerErrorModal (status) {
      this.errorModal = status
    },
    onErrorOk (code) {
      if (code === 20) {
      // prompt user to select payout account
        this.triggerPayoutModal(true)
      } else if (code === 11) {
        this.onWithdrawal(true)
      }
    },
    triggerPayoutModel (status) {
      this.addPayoutModel = status
    },
    refreshPayoutDetails (index, updatedInfo) {
      this.getPayoutInfo()
      this.triggerPayoutModel(false)
    },
    onClose () {
      this.$emit('on-close', false)
    },
    getPayoutInfo () {
      this.$axios.get(`users/${this.$store.getters['user/getUserUuidState']}/payout`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.payoutInfo = response.data.payoutInfo
      }).catch((error) => {
        console.error(error)
        let errorMessage = error.response ? error.response.data.message : this.$t('something.wrong.gateway')
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      }).finally(_ => {
        this.showLoader = false
      })
    },
    getPayoutAccountInfo (index) {
      this.$emit('payout-info', this.payoutInfo.items[index])
    }
  }
}
</script>
