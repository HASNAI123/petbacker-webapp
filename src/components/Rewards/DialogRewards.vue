<template>
  <q-dialog v-model="modal" @hide="closePopUp" @show="updateLayout" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
    <q-card>
        <!-- Header -->
        <q-toolbar ref="rewards-navbar" style="border-bottom: 1px solid lightgrey;z-index: 6000;" class="fixed-top bg-white row">
          <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
          <q-toolbar-title >
            <h6 class="q-my-none font-header-title col-11" style="margin-left: 36%;">Rewards</h6>
          </q-toolbar-title>
          <p class="q-my-none text-yellow" @click="openRewardsHistory">
            {{formatDigits($store.getters['user/getCredits'])}}<q-icon name="fas fa-coins" class="q-ml-sm"></q-icon>
            <!-- {{formatDigits(points)}}<q-icon name="fas fa-coins" class="q-ml-sm"></q-icon> -->
          </p>
        </q-toolbar>

        <q-card-section class="q-px-none q-py-sm q-mt-xl scroll">
            <q-tabs v-model="tab" @input="refresh" ref="rewards-header" class="text-grey fixed-top bg-white" style="border-bottom: solid 1px lightgrey;z-index:1000;" active-color="primary" indicator-color="primary" align="justify" dense>
                <q-tab name="my-rewards" label="My Rewards" class="text-capitalize"></q-tab>
                <q-tab name="rewards" label="Browse" class="text-capitalize"></q-tab>
            </q-tabs>

            <q-tab-panels swipeable ref="rewards-tabs" class="q-mt-lg" v-model="tab" animated keep-alive style="height: 85vh;">
                <!-- My Rewards -->
                <q-tab-panel name="my-rewards" class="q-pa-none q-pt-md">
                    <q-infinite-scroll ref="my-rewards" @load="onLoadMyRewards" :offset="250" debounce="200">
                        <reward-card-small v-for="reward in myRewards" :key="reward.id" :rewardInfo="reward" class="q-mx-md q-my-sm"></reward-card-small>

                        <template slot="loading">
                            <div class="row justify-center q-my-md">
                                <q-spinner color="primary" name="dots" size="40px" />
                            </div>
                        </template>
                    </q-infinite-scroll>

                    <p class="q-py-lg"><!-- Spacing --></p>
                </q-tab-panel>

                <!-- Rewards -->
                <q-tab-panel name="rewards" class="q-pa-none q-pt-md">
                    <q-infinite-scroll ref="rewards" @load="onLoadRewards" :offset="250" debounce="200">
                        <reward-card-small v-for="reward in rewards" :key="reward.id" :rewardInfo="reward" class="q-mx-md q-my-sm"></reward-card-small>

                        <template slot="loading">
                            <div class="row justify-center q-my-md">
                                <q-spinner color="primary" name="dots" size="40px" />
                            </div>
                        </template>
                    </q-infinite-scroll>

                    <p class="q-py-lg"><!-- Spacing --></p>
                </q-tab-panel>
            </q-tab-panels>
        </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  components: {
    'reward-card-small': () => import('components/Rewards/RewardSmallCard.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    currentTab: {
      type: String
    }
  },
  data () {
    return {
      modal: false,
      tab: 'my-rewards',
      myRewards: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      rewards: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      rewardsIndex: 1,
      myRewardsIndex: 1,
      points: 0
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    },
    currentTab (value) {
      this.tab = value
    }
  },
  created () {
    if (this.$store.getters['cached/getRewardsHistoryCached']) {
      this.points = this.$store.getters['cached/getRewardsHistoryCached'].balance
    }
  },
  beforeDestroy () {
    this.closePopUp()
  },
  methods: {
    updateLayout () {
      this.$refs['rewards-header'].$el.style.top = `${this.$refs['rewards-navbar'].$el.clientHeight + 1}px`
      this.$refs['rewards-tabs'].$el.style.top = `${this.$refs['rewards-header'].$el.clientHeight - 36}px`
    },
    openRewardsHistory () {
      this.$emit('trigger-rewards-history', true)
    },
    refresh (tabName) {
      if (tabName === 'my-rewards') {
        this.rewardsIndex = 1
        this.onLoadRewards()
      } else if (tabName === 'rewards') {
        this.myRewardsIndex = 1
        this.onLoadMyRewards()
      }
    },
    formatDigits (balance) {
      if (typeof balance === 'number') {
        return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else if (typeof balance === 'string') {
        return balance.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else if (balance === null || balance === '' || balance === undefined) {
        return 0
      }
    },
    onLoadRewards (index, done) {
      this.$axios.get(`rewards?page=${this.rewardsIndex}&per_page=10&sort_by=recent.asc,minimum_spend.desc&country_id=${this.$store.getters['user/getUserPrefferedCurrency']}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status === 204 || (response.data.rewardInfo.items && response.data.rewardInfo.items.length === 0)) {
          if (done) {
            done(true)
          }

          if (this.rewardsIndex === 1) {
            this.rewards = []
          }
        } else if (this.rewardsIndex === 1) {
          this.rewards = response.data.rewardInfo.items
          this.rewardsIndex++
        } else {
          this.rewards = this.rewards.concat(response.data.rewardInfo.items)
          this.rewardsIndex++
        }

        if (response.data.rewardInfo && response.data.rewardInfo.items && response.data.rewardInfo.items.length < 10 && done) {
          done(true)
        }
      }).catch((error) => {
        console.log(error)
      }).finally(_ => {
        if (done) {
          done()
        }
      })
    },
    onLoadMyRewards (index, done) {
      console.log('index', this.myRewardsIndex)
      this.$axios.get(`users/${this.$store.state.user.uuid}/promocodes?per_page=10&page=${this.myRewardsIndex}&country_id=${this.$store.getters['user/getUserPrefferedCurrency']}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status === 204 || (response.data.promoCodeInfo.items && response.data.promoCodeInfo.items.length === 0)) {
          if (done) {
            done(true)
          }

          if (this.myRewardsIndex === 1) {
            this.myRewards = []
          }
        } else if (this.myRewardsIndex === 1) {
          this.myRewards = response.data.promoCodeInfo.items
          this.myRewardsIndex++
        } else {
          this.myRewards = this.myRewards.concat(response.data.promoCodeInfo.items)
          this.myRewardsIndex++
        }

        if (response.data.promoCodeInfo && response.data.promoCodeInfo.items && response.data.promoCodeInfo.items.length < 10 && done) {
          done(true)
        }
      }).catch((error) => {
        console.log(error)
      }).finally(_ => {
        if (done) {
          done()
        }
      })
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
