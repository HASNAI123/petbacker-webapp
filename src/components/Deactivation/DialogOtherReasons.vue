<template>
    <q-dialog v-model="modal" @hide="onClose">
      <q-card style="overflow: visible; border-radius: 11px;">
        <q-card-section style="min-height: 150px;max-width: 320px;" class="q-px-none q-py-sm">
          <div class="tip-bulb">
              <img src="statics/images/logo-mid.jpg" class="tip-bulb-image">
          </div>
          <div class="bg-white q-mt-lg">
              <div class="row justify-center text-center q-pa-md tip-desc">
                <h6 class="q-my-none font-normal col-12">{{$t('write.in.brief')}}</h6>
                <q-input v-model="reason" type="textarea" :placeholder="$t('write.in.brief')" class="q-mt-md input col-12" dense borderless style="white-space: pre-wrap;" rows="6"></q-input>
              </div>
              <div class='full-width q-px-md'>
                <q-btn class="full-width text-capitalize q-my-sm" color="primary" @click="submit">{{$t('button.submit')}}</q-btn>
              </div>
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
      reason: null
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    }
  },
  methods: {
    submit () {
      if (this.reason === null || this.reason === '' || this.reason === ' ' || this.reason === '  ') {
        this.reason = null
        this.onClose()
        return
      }

      this.$emit('on-submit', this.reason)
      this.onClose()
    },
    onClose () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
