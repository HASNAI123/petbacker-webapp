<template>
    <q-dialog v-model="modal" :persistent="persistent" @hide="onClose" :content-css="{width: 'auto', height: 'fit-content', background: 'transparent', boxShadow: 'none'}">
      <q-card style="overflow: visible; border-radius: 11px;">
        <q-card-section style="min-height: 150px;min-width: 250px;max-width: 280px;" class="q-px-none q-py-sm">
          <div class="tip-bulb">
              <img src="statics/images/logo-mid.jpg" class="tip-bulb-image">
          </div>
          <div class="bg-white q-mt-lg">
              <div class="row justify-center">
                <div class="col-12 text-center q-pa-md tip-desc">
                  <h6 class="q-my-none q-mb-md" v-if="title">{{this.title}}</h6>
                  <span style="white-space: pre-wrap;">{{this.message}}</span>
                </div>
              </div>
              <div class='full-width q-px-md'>
                <q-btn class="full-width text-capitalize q-my-sm" color="primary"  v-if="learnMoreLink" @click="openUrl(learnMoreLink)">{{$t('chat.learnmore')}}</q-btn>
                <q-btn class="full-width text-capitalize q-my-sm" color="primary" v-else :label="okButtonLabel === null ? $t('ok') : okButtonLabel" @click="onOk" ></q-btn>
                <q-btn class="full-width text-capitalize q-my-sm" color="primary" v-if="(okButtonLabel && cancelButtonLabel !== null) && this.errorCode !== 0" flat :label="cancelButtonLabel" @click="onCancel"></q-btn>
                <q-btn class="full-width text-capitalize q-my-sm" color="primary" v-else-if="(okButtonLabel && cancelButtonLabel !== null) && this.errorCode === 0" flat :label="cancelButtonLabel" @click="onOk"></q-btn>
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
    },
    errorCode: {
      type: Number
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
      console.log('ooka clciked')
      this.$emit('on-ok', this.type)
      this.onClose()
    },
    onCancel () {
      console.log('cancaled clciked')
      this.$emit('on-cancel', this.type)
      this.onClose()
    },
    onClose () {
      console.log('close clciked')
      this.$emit('on-close', false)
    }
  }
}
</script>
