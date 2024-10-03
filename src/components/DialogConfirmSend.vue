<template>
    <!-- Confirm send message dialog -->
    <q-dialog v-model="trigger"  @hide="$emit('send-message', false)" round>
      <q-card style="min-width: 300px; overflow: visible" class="card-container">
        <img src="statics/images/tip_icon.png" style="margin-top: -37px; border-radius: 50%" class="protection-bulb"/>
        <q-card-section class="q-my-xl" style="max-width: 300px;">
          <p class="text-center" style="font-size: 18px;">{{$t('send.this.message')}}</p>
          <!--<p style="font-size: 16px; color: grey; margin-top: 30px;" class="text-justify">{{responseMessageDialog}}</p>-->
        </q-card-section>
        <q-card-actions class="row text-bottom action-buttons full-width">
          <q-btn @click="send(true)" style="font-size: 16px;width: 130px;" class="full-width text-capitalize text-weight-bold q-mx-xs" color="primary" dense>{{$t('send')}}</q-btn>
          <q-btn @click="send(false)" outline color="primary" style="font-size: 16px;width: 130px; margin-left: 6px;" class="full-width text-capitalize text-weight-bold q-mx-xs q-my-sm" v-close-popup dense>{{ $t('no') }}</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
export default {
  props: {
    messageDialog: {
      type: Boolean,
      required: true
    },
    responseMessageDialog: {
      type: String,
      required: true
    }
  },
  watch: {
    messageDialog () {
      this.trigger = this.messageDialog
    }
  },
  data () {
    return {
      trigger: false
    }
  },
  methods: {
    send (status) {
      this.$emit('send-message', status)
    }
  }
}
</script>

<style lang="stylus" scoped>
.protection-bulb
  position: absolute
  top: 0
  left: calc(50% - 35px)
  padding: 10px
  background:  #fff
  width: 70px
  border-radius: 50%
  margin-top: -35px;
.protection-bulb-image
  width: 50px
</style>
