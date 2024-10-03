<template>
    <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
        <q-card>
          <!-- Header -->
          <q-toolbar style="border-bottom: solid 1px lightgrey;">
            <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
              <q-toolbar-title v-close-popup>
                <h6 class="q-my-none header-title" style="margin-left: 35%;">{{$t('video')}}</h6>
              </q-toolbar-title>
          </q-toolbar>

          <!-- Listing Name -->
          <q-card-section>
            <p class="font-title text-weight-bold q-mb-sm">{{$t('add.youtube.video')}}</p>
            <p class="q-my-xs text-grey-5 q-my-sm q-mb-md"></p>
            <q-input type="textarea" placeholder="https://www.youtube.com/watch?v=eaS-su7MeCE" v-model="videoInfo" borderless dense class="input" :error="videoError && !videoInfo" hide-bottom-space :bottom-slots="false"></q-input>
          </q-card-section>

          <!-- Mobile Save Button -->
          <div class="fixed-bottom bg-primary" style="border-top-right-radius: 15px;border-top-left-radius: 15px;">
            <div class="q-pa-md q-pb-md" @click="onSave">
              <div class="text-white text-center cursor-pointer">
                <p v-if="!loader" class="text-weight-bold font-title" style="margin-top: 5px;">{{$t('button.save')}}</p>
                <span v-else>
                  <q-spinner size="3em"></q-spinner>
                </span>
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
      required: true
    },
    videoUrl: {
      type: String,
      required: true
    },
    loader: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modal: false,
      videoInfo: null,
      videoError: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value

      if (value) {
        this.videoInfo = this.videoUrl
      }
    }
  },
  methods: {
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    },
    onSave () {
      this.$emit('on-save', this.videoInfo)
    }
  }
}
</script>
<style lang="stylus">
.header-title
  margin-left: 28%
</style>
