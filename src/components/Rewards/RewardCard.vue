<template>
    <q-card class="col-7 q-mr-sm clickable q-ml-sm" style="max-height: 140px;border-radius: 11px;" @click="onOpenDetails" flat bordered>
        <q-img v-if="rewardInfo && rewardInfo.image" :src="rewardInfo.image" placeholder-src="statics/images/graphic-placeholder.jpg" height="105px" basic class="image-upload"></q-img>
        <q-skeleton v-else height="105px"></q-skeleton>

        <!-- Content -->
        <q-card-section class="q-py-xs q-px-sm">
            <q-icon name="chevron_right" class="float-right" size="1.6em"></q-icon>
            <p v-if="rewardInfo && rewardInfo.name && (rewardInfo.redeem === 1)" class="q-my-none" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{rewardInfo.name}}</p>
            <p v-else-if="rewardInfo && (rewardInfo.redeem === 0)" class="q-my-none" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
              <q-icon name="fas fa-coins" class="q-ml-sm text-yellow"></q-icon>
              {{rewardInfo.redemptionPointValue}} points
            </p>
            <q-skeleton v-else height="15px" class="q-mt-xs"></q-skeleton>
        </q-card-section>

        <!-- Details Dialog -->
        <dialog-rewards-details :trigger="rewardDetailsModal" :rewardId="parseInt(rewardInfo.promoCodeId)" @on-close="onTriggerRewardDetailsModal"></dialog-rewards-details>
    </q-card>
</template>
<script>
export default {
  components: {
    'dialog-rewards-details': () => import('components/Rewards/DialogRewardDetails.vue')
  },
  props: {
    rewardInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      rewardDetailsModal: false
    }
  },
  methods: {
    onOpenDetails () {
      if (this.rewardInfo && this.rewardInfo.promoCodeId) {
        this.onTriggerRewardDetailsModal(true)
      }
    },
    onTriggerRewardDetailsModal (status) {
      this.rewardDetailsModal = status
    }
  }
}
</script>
