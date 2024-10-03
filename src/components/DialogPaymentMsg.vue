<template>
    <q-dialog v-model="modal" :persistent="persistent" @hide="onClose" :content-css="{width: 'auto', height: 'fit-content', background: 'transparent', boxShadow: 'none'}">
      <q-card style="overflow: visible; border-radius: 11px;">
        <q-card-section style="min-height: 150px;min-width: 250px;max-width: 280px;" class="q-px-none q-py-sm">
          <div class="tip-bulb">
              <img src="statics/images/AlertIcon.png" class="tip-bulb-image">
          </div>
          <div class="bg-white q-mt-lg">
              <div class="row justify-center">
                <div class="col-12 text-center q-pa-md tip-desc">
                  <h6 class="q-my-none q-mb-md" v-if="title">{{title}}</h6>
                  <span style="white-space: pre-wrap;">{{message}}</span>
                </div>
              </div>
              <div class='full-width q-px-md'>
                <q-btn class="full-width text-capitalize q-my-sm" color="primary"  :label="okButtonLabel === null ? $t('ok') : okButtonLabel" @click="onOk" ></q-btn>
                <q-btn class="full-width text-capitalize q-my-sm" color="primary"  flat :label="cancelButtonLabel === null ? $t('close') : cancelButtonLabel" @click="onCancel"></q-btn>
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
    title: {
      type: String,
      default: null
    },
    persistent: {
      type: Boolean,
      default: false
    },
    okButtonLabel: {
      type: String,
      default: null
    },
    cancelButtonLabel: {
      type: String,
      default: null
    },
    message: {
      type: String,
      required: true
    },
    learnMoreLink: {
      type: String,
      default: null
    },
    type: {
      type: Number,
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
    onOk () {
      this.$emit('on-ok')
      this.onClose()
    },
    onCancel () {
      this.$emit('on-cancel', this.type)
      this.onClose()
    },
    onClose () {
      this.$emit('on-close', false)
    }
  }
}
</script>
