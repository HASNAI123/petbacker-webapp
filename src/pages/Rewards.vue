<template>
  <div>
    <q-page style="min-height: 100%;">
      <div class="margin-auto" :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}" style="min-height: 80vh;">
        <!-- Header Image -->
        <div :style="{'min-height': $q.platform.is.mobile ? '190px;' : '330px'}">
          <img src="statics/images/rewards-header.jpg" height="190px" width="100%" style="object-fit:cover;" loading="lazy" decoding="async"/>
        </div>

        <!-- Summary -->
        <div class="text-center q-mt-md">
            <p class="q-my-none text-grey-5">You have</p>
            <p class="q-my-sm font-header-title-large text-yellow">
              {{formatDigits($store.getters['user/getCredits'])}} point(s) <q-icon name="fas fa-coins" class="q-ml-sm"></q-icon>
                <!-- {{formatDigits(points)}} point(s) <q-icon name="fas fa-coins" class="q-ml-sm"></q-icon> -->
            </p>
        </div>

        <q-list separator class="input q-mt-lg q-mx-lg">
            <q-item class="col-md-12 col-xs-12" clickable @click="onTriggerHistoryModal(true)">
                <q-item-section class="text-16 text-weight-medium">
                    View my point history
                </q-item-section>

                <q-item-section side>
                    <q-icon name="chevron_right" />
                </q-item-section>
            </q-item>

            <q-item class="col-md-12 col-xs-12" clickable @click="openUrl(`${$t('link.href.help.center')}/sponsors/what-are-credits-for`)">
                <q-item-section class="text-16 text-weight-medium">
                    Find out how to earn more points
                </q-item-section>

                <q-item-section side>
                    <q-icon name="chevron_right" />
                </q-item-section>
            </q-item >
        </q-list>

        <q-card class="q-mx-lg q-my-lg bg-primary" flat style="border-radius: 11px;height: 80px;" @click="$router.push({name: 'Referrals'})">
            <!-- Image -->
            <q-img src="statics/images/rewards_with_friends.jpeg" placeholder-src="statics/images/rewards_with_friends.jpeg" basic height="80px" class="image-upload">
                <h6 class="text-center font-normal text-white q-my-none q-pa-sm text-weight-bold text-uppercase">
                    Earn points when your <br/>friends sign up or book
                </h6>
            </q-img>
        </q-card>

        <!-- Browser Rewards -->
        <div class="q-mt-md">
            <h6 class="q-px-lg q-mb-md q-mt-sm">
                Browse Rewards
                <div class="float-right q-my-none text-primary" style="font-weight: 400;font-size: 14px;" @click="currentTab = 'rewards';onTriggerDialogRewards(true)">
                    {{$t('see.more')}}<q-icon name="chevron_right" size="16px;"></q-icon>
                </div>
            </h6>
            <div class="row no-wrap q-px-sm q-pl-md justify-left hide-scrollbar" style="height: 150px;overflow: auto;" >
                <!-- Reward Card -->
                <reward-card v-for="reward in rewards" :key="reward.id" :rewardInfo="reward"></reward-card>

                <!-- Browse all rewards -->
                <q-card class="col-4 q-mr-sm clickable q-ml-sm" style="max-height: 140px;border-radius: 11px;" flat bordered @click="currentTab = 'rewards';onTriggerDialogRewards(true)">
                    <!-- Content -->
                    <q-card-section class="q-pl-sm text-left">
                      <h6 class="q-my-none q-mt-md">Browse all rewards</h6>
                    </q-card-section>
                </q-card>
            </div>
        </div>

        <!-- My Rewards -->
        <div class="q-mt-md">
            <h6 class="q-px-lg q-mb-md q-mt-sm">
                My Rewards
                <div class="float-right q-my-none text-primary" style="font-weight: 400;font-size: 14px;" @click="currentTab = 'my-rewards';onTriggerDialogRewards(true)">
                    {{$t('see.more')}}<q-icon name="chevron_right" size="16px;"></q-icon>
                </div>
            </h6>
            <div class="row no-wrap q-px-sm q-pl-md justify-left hide-scrollbar" style="height: 230px;overflow: auto;" >
                <!-- My Reward Cards -->
                <reward-card v-for="reward in myRewards" :key="reward.id" :rewardInfo="reward"></reward-card>

                <!-- Browse all rewards -->
                <q-card class="col-4 q-mr-sm clickable q-ml-sm" style="max-height: 140px;border-radius: 11px;" flat bordered @click="currentTab = 'my-rewards';onTriggerDialogRewards(true)">
                    <!-- Content -->
                    <q-card-section class="q-pl-sm text-left">
                      <h6 class="q-my-none q-mt-md">Browse all my rewards</h6>
                    </q-card-section>
                </q-card>
            </div>
        </div>

        <p class="q-py-md"><!-- Spacing --></p>
      </div>
    </q-page>

    <!-- Browse Rewards Dialog -->
    <dialog-rewards :trigger="rewardsModal" :currentTab="currentTab" @on-close="onTriggerDialogRewards" @trigger-rewards-history="onTriggerHistoryModal"></dialog-rewards>

    <!-- Rewards History Dialog -->
    <dialog-rewards-history :trigger="rewardsHistoryModal" @on-close="onTriggerHistoryModal"></dialog-rewards-history>
  </div>
</template>
<script>
export default {
  components: {
    'reward-card': () => import('components/Rewards/RewardCard.vue'),
    'dialog-rewards': () => import('components/Rewards/DialogRewards.vue'),
    'dialog-rewards-history': () => import('components/Rewards/DialogRewardsHistory.vue')
  },
  data () {
    return {
      myRewards: [{}, {}, {}],
      rewards: [{}, {}, {}],
      rewardsModal: false,
      rewardsHistoryModal: false,
      currentTab: 'my-rewards',
      points: this.$store.getters['user/getPoints']
    }
  },
  created () {
    this.getBrowseRewards()
    this.getMyRewards()
  },
  methods: {
    onTriggerHistoryModal (status) {
      this.rewardsHistoryModal = status
    },
    onTriggerDialogRewards (status) {
      this.rewardsModal = status
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
    getBrowseRewards () {
      this.$axios.get(`rewards?page=1&per_page=5&sort_by=recent.asc,minimum_spend.desc&country_id=${this.$store.getters['user/getUserPrefferedCurrency']}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status === 204 || (response.data.rewardInfo.items && response.data.rewardInfo.items.length === 0)) {
          this.rewards = []
        } else {
          this.rewards = response.data.rewardInfo.items
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    getMyRewards () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/promocodes?per_page=5&page=1&country_id=${this.$store.getters['user/getUserPrefferedCurrency']}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        // this.points = response.data.promoCodeInfo.pointsBalance
        if (response.status === 204 || (response.data.promoCodeInfo.items && response.data.promoCodeInfo.items.length === 0)) {
          this.myRewards = []
        } else {
          this.myRewards = response.data.promoCodeInfo.items
        }

        this.$store.commit('user/updatePoints', response.data.promoCodeInfo.pointsBalance)
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>
