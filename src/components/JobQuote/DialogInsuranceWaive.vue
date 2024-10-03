<template>
    <q-dialog v-model="modal" @hide="onClose">
      <q-card style="overflow: visible;">
        <q-card-section style="min-height: 100px;">
          <div class="tip-bulb">
            <img src="statics/images/logo-mid.jpg" class="tip-bulb-image"/>
          </div>
          <div class="bg-white">
              <div class="row justify-center">
                <div class="col-12 text-center q-pa-md tip-desc">
                  <p class="q-my-sm font-header-title">{{$t('note')}}</p>
                  <p class="q-my-sm">{{$t('insurance.coverage.waived.confirmation')}}</p>
                </div>
              </div>
              <div class='full-width q-px-md'>
                <q-btn class="full-width q-my-xs text-primary" color="primary" @click="onRevise" label="Revise Quote"></q-btn>
                <q-btn class="full-width q-my-xs " color="primary" @click="onContinue" label="Proceed"></q-btn>
                <q-btn class="full-width q-my-xs " outline color="primary" @click="onClose" label="Cancel"></q-btn>
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
      modal: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    }
  },
  methods: {
    onRevise () {
      this.onClose()
      this.$emit('on-revise', true)
    },
    onContinue () {
      this.onClose()
      this.$emit('on-continue', true)
    },
    onClose () {
      this.$emit('on-close', false)
    }
  }
}
</script>
