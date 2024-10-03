<template>
    <q-dialog v-model="modal" @hide="closePopUp" maximized transition-show="slide-up" transition-hide="slide-down" style="z-index: 5000;">
        <q-card class="q-pa-none" style="background: #9c659c;" v-touch-pan.down.prevent.mouse="onSwipeDown">
          <q-card-section class="q-pa-none">
            <q-img src="statics/images/gif/start-screen-app-v3.gif" placeholder-src="statics/images/gif/start-screen-app-v3-placeholder.jpg" class="image-upload" height="100%" basic>
              <q-icon name="far fa-times-circle" class="text-white" size="sm" style="position: absolute; right: 20px;top: 20px;" @click="closePopUp"></q-icon>
            </q-img>
          </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script>
export default {
  props: {
    trigger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      modal: false
    }
  },
  created () {
    if (this.trigger) {
      this.modal = this.trigger
    }
  },
  watch: {
    trigger (value) {
      setTimeout(() => {
        this.modal = value
      }, 10)
    }
  },
  methods: {
    onSwipeDown ({ evt, ...info }) {
      if (info.direction === 'down' && info.offset.y > 100) {
        this.closePopUp()
      }
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
