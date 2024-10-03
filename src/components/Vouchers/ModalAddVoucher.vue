<template>
    <q-dialog v-model="modal" @hide="onClose">
      <q-card style="background: white; width:300px; box-shadow: none;border-radius: 15px;">
        <q-card-section class="q-pa-none">
          <div class="q-px-lg text-center">
            <h6 class="q-my-md">{{  $t('enter.promo.code')}} </h6>
            <div class="font-normal text-center">{{ $t('enter.promocode.you.got')}}</div>
          </div>
          <div class="full-width q-px-md q-my-md">
            <q-input class="full-width q-px-sm" flat outlined :placeholder="$t('promo.code')" v-model="manualPromocode"></q-input>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-sm">
          <div class='full-width q-px-md'>
            <q-btn class="full-width" :loading="loader" color="primary" :label="$t('add')" :disable="manualPromocode === null || manualPromocode === ''" @click="addPromoCode(manualPromocode)" />
          </div>
          <div class='full-width q-px-md q-mt-sm'>
            <q-btn class="full-width close_button" flat :label="$t('close')" @click.native="onClose" />
          </div>
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
      modal: false,
      manualPromocode: null,
      loader: false
    }
  },
  watch: {
    trigger (status) {
      this.modal = status
    },
    manualPromocode (value) {
      if (value !== null && value !== '' && value !== ' ' && value !== '  ') {
        this.$emit('insert-promocode', value)
      }
    }
  },
  methods: {
    onClose () {
      this.$emit('on-close', false)
      this.manualPromocode = null
    },
    addPromoCode (manualPromocode) {
      this.loader = true
      this.$axios.post(`users/${this.$store.state.user.uuid}/promocodes`, {'promoCodeInfo': {'promoCodeRef': manualPromocode}}, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$emit('promocode-inserted', manualPromocode)
        this.$emit('on-close', false)
      }).catch(e => {
        if (e.response.data.message) {
          this.$emit('error', e.response.data.message)
        }
        this.onClose()
      }).finally(_ => {
        this.loader = false
      })
    }
  }
}
</script>
