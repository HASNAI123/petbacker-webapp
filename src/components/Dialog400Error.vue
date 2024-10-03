<template>
    <q-dialog v-model="modal" :content-css="{width: 'auto', height: 'fit-content', background: 'transparent', boxShadow: 'none'}" @hide="onClose">
      <q-card style="overflow: visible;border-radius: 20px;">
        <q-card-section style="min-height: 150px;width: 260px;" class="q-pb-none q-pt-sm q-px-none">
          <div class="tip-bulb">
              <img src="statics/images/AlertIcon.png" class="tip-bulb-image">
          </div>
          <div class="bg-white q-my-lg">
              <div class="row justify-center">
                <div class="col-12 text-center q-pa-md tip-desc">
                  <span style="white-space: pre-wrap;">{{message}}</span>
                </div>
              </div>
              <div class='full-width q-px-md'>
                <q-btn class="full-width q-mb-md text-primary" flat v-if="learnMoreLink" @click="openUrl(learnMoreLink)">{{$t('chat.learnmore')}}</q-btn>
                <q-btn class="full-width" color="primary" :label="$t('ok')" v-if="learnMoreLink" @click="onOk(true)" ></q-btn>
                <q-btn class="full-width" color="primary" :label="$t('ok')" v-else @click="onClose" ></q-btn>
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
    },
    message: {
      type: String,
      required: true
    },
    learnMoreLink: {
      type: String,
      default: null
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
    onOk (status) {
      this.$emit('on-ok', true)
      this.onClose()
    },
    onClose () {
      this.$emit('on-close', false)
    }
  }
}
</script>
