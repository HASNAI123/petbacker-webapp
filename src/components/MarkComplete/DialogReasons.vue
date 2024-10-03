<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" transition-show="slide-up" transition-hide="slide-down">
        <q-card :style="{'max-width: 355px;': $q.platform.is.desktop}">
            <!-- Header -->
            <q-toolbar style="border-bottom: solid 1px lightgrey;">
                <q-toolbar-title v-close-popup>
                    <h6 class="q-my-none font-title text-center" style="margin-left: 10%;">{{$t('review.manually.reason.title')}}</h6>
                </q-toolbar-title>
                <q-btn flat round dense icon="close" v-close-popup></q-btn>
            </q-toolbar>

            <q-card-section>
                <p>{{$t('review.manually.reason.describe')}}</p>
                <q-input v-model="reasons" placeholder="Owner not available to scan QR code and mark job as completed" type="textarea" class="input" borderless></q-input>
            </q-card-section>

            <!-- Mobile bottom button -->
            <div class="fixed-bottom bg-primary" style="border-top-right-radius: 15px;border-top-left-radius: 15px;">
                <div class="q-pa-md q-pb-lg" @click="onSubmit">
                    <div class="text-white text-center cursor-pointer font-header-title q-pt-sm">
                        <span>{{$t('button.submit')}}</span>
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
      required: true,
      default: false
    }
  },
  data () {
    return {
      modal: false,
      reasons: 'Owner not available to scan QR code and mark job as completed'
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    }
  },
  methods: {
    onSubmit () {
      this.$emit('on-submit', this.reasons)
      this.onClose()
    },
    onClose () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
