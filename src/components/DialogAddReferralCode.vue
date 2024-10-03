<template>
    <q-dialog v-model="modal" @hide="onClose">
      <q-card class="bg-white" style="width:300px;border-radius: 15px;overflow: visible;border-radius: 20px;">
        <q-card-section class="q-pb-none q-pt-sm q-px-none">
          <div class="tip-bulb">
            <img src="statics/images/logo-mid.jpg" class="tip-bulb-image">
          </div>
          <div class="q-px-lg q-my-lg text-center">
            <h6 class="q-my-md">{{$t('referral.code')}}</h6>
          </div>
          <div class="full-width q-px-sm q-my-md">
            <q-input clearable @clear="onClear" class="full-width q-px-sm" :error="onInvalid && (referralCode === null || referralCode === '')" hide-bottom-space flat outlined :placeholder="$t('enter.referral.code.here')" v-model="referralCode"></q-input>
          </div>
        </q-card-section>

        <q-card-section>
            <q-btn class="full-width" color="primary" :label="$t('add')" @click="addReferralCode"></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>
<script>
export default {
  props: {
    trigger: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      referralCode: this.$store.getters['user/getUserReferrerCode'],
      modal: false,
      onInvalid: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    }
  },
  beforeDestroy () {
    this.onClose()
  },
  methods: {
    onClear () {
      this.onInvalid = false
      this.$store.commit('user/updateUserReferrerState', null)
    },
    addReferralCode () {
      this.onInvalid = false
      if (this.referralCode === null || this.referralCode === '' || this.referralCode === ' ') {
        this.onInvalid = true
        return
      }

      this.$store.commit('user/updateUserReferrerState', this.referralCode)
      this.onClose()
    },
    onClose () {
      this.referralCode = this.$store.getters['user/getUserReferrerCode']
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
