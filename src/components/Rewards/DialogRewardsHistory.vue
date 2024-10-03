<template>
    <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
        <q-card>
            <!-- Header -->
            <q-toolbar style="border-bottom: 1px solid lightgrey;z-index: 6000;" class="fixed-top bg-white row">
              <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
            </q-toolbar>
             <q-card-section v-if="rewardHistory !== null" class="margin-auto q-mt-xl" :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}" style="min-height: 80vh;">
            <!-- <q-card-section class="margin-auto q-mt-xl" :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}" style="min-height: 80vh;"> -->
                <!-- Summary-->
                <div class="row q-my-md q-mb-lg">
                    <!-- My Wallet -->
                    <div class="col-12 text-center">
                        <p class="q-my-none text-grey-5">{{$t('profile.wallet')}}</p>
                        <p class="q-my-sm font-header-title-large text-yellow">
                          {{rewardHistory.balance}} point(s) <q-icon name="fas fa-coins" class="q-ml-sm"></q-icon>
                            <!-- {{rewardHistory ? rewardHistory.balance : $store.getters['user/getPoints']}} point(s) <q-icon name="fas fa-coins" class="q-ml-sm"></q-icon> -->
                        </p>
                    </div>
                </div>

                <div class="q-my-md">
                <!-- <div class="q-my-md" v-if="rewardHistory !== null"> -->
                    <h6 class="q-my-none q-mx-md">Rewards History</h6>
                    <!-- <p class="q-my-sm q-mx-md text-grey-8">{{$t('account.history.description')}}</p> -->
                    <q-list>
                        <q-item style="border-bottom: 1px solid lightgrey;">
                            <q-item-section>
                                <q-item-label class="text-weight-bold font-title">{{$t('date')}}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label class="text-weight-bold font-title">{{$t('amount')}}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label class="text-weight-bold font-title">{{$t('note')}}</q-item-label>
                            </q-item-section>
                        </q-item>

                        <!-- History Items -->
                        <q-infinite-scroll @load="onLoad" ref="infinite-scroll">
                            <transaction-card v-for="transaction in rewardHistoryItems" :key="transaction.id" :transaction="transaction"></transaction-card>
                            <template v-slot:loading>
                                <div class="row justify-center q-my-md">
                                    <ComponentPreLoader></ComponentPreLoader>
                                </div>
                            </template>
                        </q-infinite-scroll>
                    </q-list>
                </div>
                </q-card-section>
            <q-card-section class="text-center" v-else>
                <ComponentPreLoader></ComponentPreLoader>
            </q-card-section>

                <!-- <div class="text-center" v-else>
                  <ComponentPreLoader></ComponentPreLoader>
                </div>
            </q-card-section> -->
        </q-card>
    </q-dialog>
</template>
<script>
export default {
  components: {
    'transaction-card': () => import('components/Wallet/TransactionCard.vue')
  },
  props: {
    trigger: {
      default: false,
      type: Boolean,
      require: true
    }
  },
  data () {
    return {
      modal: false,
      rewardHistory: null,
      rewardHistoryItems: []
    }
  },
  watch: {
    trigger (status) {
      this.modal = status

      if (status === true && this.rewardHistoryItems.length === 0) {
        if (this.$store.getters['user/getUserUuidState'] !== null) {
          this.getRewardsHistory()
        }
      }
    }
  },
  methods: {
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    },
    onLoad (index, done) {
      setTimeout(() => {
        this.getRewardsHistory(index)
        done()
      }, 1500)
    },
    getRewardsHistory (index = 0) {
      if (this.$store.getters['cached/getRewardsHistoryCached'] && index === 0) {
        this.rewardHistory = this.$store.getters['cached/getRewardsHistoryCached']
        this.rewardHistoryItems = this.$store.getters['cached/getRewardsHistoryCached'].items
      }

      this.$axios.get(`users/${this.$store.state.user.uuid}/rewardstatement?per-page=20&page=${index + 1}&country_id=${this.$store.getters['user/getUserPrefferedCurrency']}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.rewardHistory = response.data.rewardsStatementInfo
        if (response.status === 204 || response.data.rewardsStatementInfo.items.length === 0) {
          if (this.$refs['infinite-scroll']) {
            this.$refs['infinite-scroll'].stop()
          }
        } else if (index === 0) {
          this.rewardHistoryItems = response.data.rewardsStatementInfo.items

          // cache rewards history
          if (JSON.stringify(this.$store.getters['cached/getRewardsHistoryCached']) !== JSON.stringify(response.data.rewardsStatementInfo)) {
            this.$store.dispatch('cached/cacheRewardsHistory', response.data.rewardsStatementInfo)
          }
        } else if (response.data.rewardsStatementInfo.items.length > 0) {
          this.rewardHistoryItems = this.rewardHistoryItems.concat(response.data.rewardsStatementInfo.items)
        } else {
          if (this.$refs['infinite-scroll']) {
            this.$refs['infinite-scroll'].stop()
          }
        }
      }).catch((error) => {
        console.log(error)
        if (this.$refs['infinite-scroll']) {
          this.$refs['infinite-scroll'].stop()
        }
      })
    }
  }
}
</script>
