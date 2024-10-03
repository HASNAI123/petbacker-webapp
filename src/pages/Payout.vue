<!-- payout page-->
<template>
  <div>
    <q-page v-if="payoutInfo !== null" class="margin-auto" :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}" style="height: 100%; min-height: 100%;">
      <payout-card v-for="(payout, index) in payoutInfo.items" :key="payout.id" :payoutInfo="payout" :index="index" @on-refresh="refreshPayoutDetails"></payout-card>
      <transition appear enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
        <q-card class="q-mb-xl" style="border-radius: 11px;margin-left:5%;margin-right:5%;margin-top:3%;" @click="triggerPayoutTypeModel(true)">
          <!-- payout card -->
          <q-card-section>
            <q-item class="q-pa-none font-normal" dense >
              <q-item-section>
                <!-- Payout Type -->
                <q-item-label class="font-header-title text-wrap text-capitalize " lines="1" >{{$t('add.new.payout')}}</q-item-label>

                <!-- Payout Details -->
                <q-item-label lines="2" class="text-black-8">{{$t('add.new.payout.descriptions')}}</q-item-label>
                <!-- <p>{{this.payoutType}}</p> -->
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
    </q-page>
    <div class="col-xs-12 text-center" v-else>
      <ComponentPreLoader></ComponentPreLoader>
    </div>

    <!-- Dialog Payout Type Selection, this one is the popup to show the diff types of payout methods -->
    <dialog-payout-type :trigger="payoutTypeModel" @on-close="triggerPayoutTypeModel" @on-select="onPayoutTypeSelected"></dialog-payout-type>

    <!-- Dialog Add Payout, this one to allow users to be redirected to the payout details page  -->
    <dialog-add-payout :trigger="addPayoutModel" :type="payoutType" @on-close="triggerPayoutModel" @on-update="refreshPayoutDetails"></dialog-add-payout>
  </div>
</template>
<script>
export default {
  components: {
    'payout-card': () => import('components/Payout/PayoutCard.vue'),
    'dialog-add-payout': () => import('components/Payout/DialogAddPayout.vue'),
    'dialog-payout-type': () => import('components/Payout/DialogPayoutType.vue')
  },
  data () {
    return {
      payoutInfo: null,
      addPayoutModel: false,
      payoutTypeModel: false,
      payoutType: 2
    }
  },
  created () {
    this.getPayoutInfo()
  },
  methods: {
    onPayoutTypeSelected (type) {
      this.payoutType = type
      this.triggerPayoutTypeModel(false)
      this.triggerPayoutModel(false)
      let paymentMethodIds = this.payoutInfo.items.map((item) => item.paymentMethodId)
      if (paymentMethodIds.includes(type)) {
        this.$q.dialog({
          title: this.$t('sorry'),
          message: this.$t('max.payment.error'),
          ok: this.$t('navbar.talk.support'),
          cancel: this.$t('ok'),
          noBackdropDismiss: true,
          noEscDismiss: true
        }).onOk(() => {
          this.$router.push({name: 'HelpCenter'})
        })
      } else {
        this.triggerPayoutModel(true)
      }
    },
    triggerPayoutTypeModel (status) {
      this.payoutTypeModel = status
    },
    triggerPayoutModel (status) {
      this.addPayoutModel = status
    },
    refreshPayoutDetails (index, updatedInfo) {
      this.payoutInfo.items[index] = updatedInfo
      this.triggerPayoutModel(false)
      this.getPayoutInfo()
    },
    getPayoutInfo () {
      this.$axios.get(`users/${this.$store.getters['user/getUserUuidState']}/payout`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status === 200) {
          this.payoutInfo = response.data.payoutInfo
        } else if (response.status === 204) {
          this.payoutInfo = []
        }
      }).catch((error) => {
        console.error(error)
        let errorMessage = error.response ? error.response.data.message : this.$t('something.wrong.gateway')
        this.$q.notify({
          message: errorMessage,
          position: top,
          type: 'negative'
        })
      }).finally(_ => {
        this.showLoader = false
      })
    }
  }
}
</script>
