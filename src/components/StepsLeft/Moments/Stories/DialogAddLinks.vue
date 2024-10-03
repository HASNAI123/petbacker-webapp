<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="this.$q.platform.is.mobile" :persistent="this.$q.platform.is.mobile" :transition-show="this.$q.platform.is.mobile ? 'slide-left' : ''" :transition-hide="this.$q.platform.is.mobile ? 'slide-right' : ''">
        <q-card :style="{'min-height': this.$q.platform.is.desktop ? '600px' : '', 'max-height': this.$q.platform.is.desktop ? '800px' : ''}">
            <q-toolbar style="z-index: 5000;" class="borderline">
                <q-btn flat round dense v-close-popup icon="chevron_left" size="1.3em"/>
                <!-- Header Title -->
                <q-toolbar-title v-close-popup>
                    <h6 class="q-my-none font-normal" style="margin-left: 36%;">Links</h6>
                </q-toolbar-title>
            </q-toolbar>

            <q-card-section class="q-pa-none q-px-md" :style="{'min-height': this.$q.platform.is.desktop ? '520px' : ''}">
                <h6 class="text-center q-my-sm">
                    <q-icon name="link" color="grey"></q-icon>
                </h6>

                <div>
                    <q-input v-model="linkName" type="text" placeholder="Link Name, e.g. home page" flat borderless class="input q-my-md"></q-input>
                    <q-input v-model="link" type="url" placeholder="Place link address here, e.g. www.petbacker.com" flat borderless class="input q-my-md"></q-input>
                </div>
            </q-card-section>

            <div class="fixed-bottom bg-primary" v-if="$q.platform.is.mobile" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" @click="onSave">
                <div class="q-pa-md q-pb-lg">
                    <div class="text-white q-pb-sm text-center cursor-pointer font-header-title">
                        <span v-if="!showLoading">Add Link</span>
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
      default: false
    }
  },
  data () {
    return {
      modal: false,
      linkName: null,
      link: null,
      showLoading: false
    }
  },
  watch: {
    trigger (status) {
      this.modal = status
    }
  },
  methods: {
    onClose () {
      this.modal = false
      this.$emit('on-close', false)
    },
    onSave () {
      this.$emit('on-save', this.link, this.linkName)
      this.link = null
      this.linkName = null
      this.onClose()
    }
  }
}
</script>
