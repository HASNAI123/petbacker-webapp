<template>
    <div>
        <q-item class="q-px-sm input" clickable @click="onOpenDetails">
            <q-item-section avatar>
                <q-avatar style="width: 60px; height: 60px;borders: none;" rounded>
                    <q-img v-if="rewardInfo && rewardInfo.image" :src="rewardInfo.image" placeholder-src="statics/images/graphic-placeholder.jpg" class="image-upload" width="60px" height="60px"></q-img>
                    <q-skeleton v-else height="60px" width="60px"></q-skeleton>
                </q-avatar>
            </q-item-section>

            <q-item-section v-if="rewardInfo && rewardInfo.name">
                <q-item-label class="text-capitalize text-weight-bold font-normal">{{rewardInfo.name}}</q-item-label>
                <q-item-label v-if="rewardInfo.expiryDate && rewardInfo.redeem" caption>Valid until {{formatTime(rewardInfo.expiryDate)}}</q-item-label>
                <q-item-label v-else caption><q-icon name="fas fa-coins" class="q-mr-sm text-yellow"></q-icon>{{rewardInfo.redemptionPointValue}} points</q-item-label>
            </q-item-section>
            <q-item-section v-else>
                <q-skeleton height="20px" width="150px" class="q-my-xs"></q-skeleton>
                <q-skeleton height="15px" width="100%" class="q-my-xs"></q-skeleton>
            </q-item-section>

            <q-item-section side>
                <q-btn v-if="rewardInfo && rewardInfo.id" outline dense :loading="loader" color="positive" size="12px" @click.stop="onButtonTrigger" :label="rewardInfo.redeem ? 'Use Now' : 'Redeem'" class="text-capitalize q-px-sm" style="border-radius: 10px;"></q-btn>
                <q-skeleton v-else height="30px" width="70px" style="border-radius: 10px;"></q-skeleton>
            </q-item-section>
        </q-item>

        <!-- Prompt Dialog -->
        <dialog-prompt :trigger="promptModal" :title="promptTitle" :type="typeCode" :message="promptMessage" :persistent="promptPersistant" :okButtonLabel="okBtnLabel" :cancelButtonLabel="canceblBtnLabel" @on-ok="onPromptOk" @on-cancel="onPromptCancel" @on-close="triggerPromptDialog"></dialog-prompt>

        <!-- Details Dialog -->
        <dialog-rewards-details :rewardId="parseInt(rewardInfo.promoCodeId)" :trigger="rewardDetailsModal" @on-close="onTriggerRewardDetailsModal"></dialog-rewards-details>
    </div>
</template>
<script>
import moment from 'moment'
export default {
  components: {
    'dialog-rewards-details': () => import('components/Rewards/DialogRewardDetails.vue'),
    'dialog-prompt': () => import('components/DialogPrompt.vue')
  },
  props: {
    rewardInfo: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      rewardDetailsModal: false,
      promptModal: false,
      typeCode: -1,
      promptMessage: '',
      promptTitle: '',
      okBtnLabel: this.$t('ok'),
      canceblBtnLabel: this.$t('close'),
      promptPersistant: false,
      loader: false
    }
  },
  methods: {
    onPromptOk (status) {
      // redeem status confirmed
      if (status === -1) {
        this.onRedeem()
      } else if (status === 1) {
        this.$router.push({name: 'ChatSupportHelp'})
      } else if (status === 11) {
        this.onRedeem(true)
      }
    },
    onPromptCancel (status) {
      console.log('cancel')
    },
    triggerPromptDialog (status, message = '', title = null, okLabel = null, cancelLabel = null, typeCode = 0, persistent = false) {
      this.promptMessage = message
      this.promptTitle = title
      this.okBtnLabel = okLabel
      this.canceblBtnLabel = cancelLabel
      this.promptPersistant = persistent
      this.typeCode = typeCode
      this.promptModal = status
    },
    onButtonTrigger () {
      if (this.rewardInfo.redeem) {
        this.onTriggerRewardDetailsModal(true)
      } else {
        // prompt for confirmation
        this.triggerPromptDialog(true, `Redeem with ${this.rewardInfo.redemptionPointValue} points?`, 'Get This Reward', 'Redeem', 'Cancel', -1, true)
      }
    },
    onRedeem (override = false) {
      this.loader = true
      this.$axios.post(`rewards/${this.rewardInfo.promoCodeId}/redeem${override ? '?override=1' : ''}`, {}, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        console.log('response')
        this.$q.notify({name: `${this.rewardInfo.name} successfully redeemed!`, position: 'top', type: 'positive'})
      }).catch((error) => {
        console.log(error)

        if (error.response && error.response.data && error.response.data.message) {
          this.triggerPromptDialog(true, error.response.data.message, null, null, null, error.response.data.code)
        } else {
          this.triggerPromptDialog(true, this.$t('requests.error.title'), null, this.$t('email.support'), this.$t('chat.later'), 1)
        }
      }).finally(_ => {
        this.loader = false
      })
    },
    formatTime (expiryDate) {
      return `${moment.utc(expiryDate).local().format('DD MMMM YYYY')}`
    },
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
