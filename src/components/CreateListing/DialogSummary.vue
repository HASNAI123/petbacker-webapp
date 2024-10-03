<template>
  <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
    <q-card>
        <!-- Header -->
        <q-toolbar style="border-bottom: solid 1px lightgrey;">
            <q-btn flat round dense class="font-header-title " icon="chevron_left" v-close-popup></q-btn>
        </q-toolbar>

        <q-card-section>
            <h6 class="q-my-none">{{title}}</h6>
            <q-input v-model="info" input-style="white-space: pre-wrap;" :placeholder="placeholder" type="textarea" borderless class="input" rows="16" dense></q-input>
        </q-card-section>

        <div class="fixed-bottom bg-primary" v-if="$q.platform.is.mobile" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" @click="onSave">
            <div class="q-pa-md q-pb-lg">
                <div class="text-white q-pb-sm text-center cursor-pointer font-header-title">
                    <span v-if="!loader">{{$t('button.save')}}</span>
                    <span v-else><q-spinner size="1.5em"></q-spinner></span>
                </div>
            </div>
        </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  props: {
    trigger: {
      type: Boolean,
      default: false,
      required: true
    },
    title: {
      required: true,
      default: null
    },
    content: {
      required: true,
      default: null
    },
    placeholder: {
      type: String,
      default: ''
    },
    loader: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modal: false,
      info: null
    }
  },
  watch: {
    trigger (value) {
      this.modal = value

      if (value) {
        this.info = this.content
      }
    }
  },
  methods: {
    onSave () {
      this.$emit('on-save', this.info)
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
