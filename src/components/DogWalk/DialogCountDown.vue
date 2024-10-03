<template>
    <q-dialog v-model="modal" maximized @hide="closePopUp" transition-show="slide-up" transition-hide="slide-down">
        <q-card class="q-pa-none bg-primary text-white">
          <q-card-section class="q-py-md text-center text-weight-bold" style="top: 50%;left: 50%;transform: translate(-50%, -50%);">
            <h1 v-if="counter === 1">3</h1>
            <h1 v-else-if="counter === 2">2</h1>
            <h1 v-else-if="counter === 3">1</h1>
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
      counter: 1
    }
  },
  watch: {
    trigger (value) {
      this.modal = value

      if (value) {
        this.onCountDown()
      }
    }
  },
  methods: {
    onCountDown () {
      // start count down
      setTimeout(() => {
        this.closePopUp()
      }, 2550)
      setTimeout(() => {
        this.counter += 1
      }, 2000)
      setTimeout(() => {
        this.counter += 1
      }, 1000)
    },
    closePopUp () {
      this.$emit('on-close', false)
      this.counter = 1
    }
  }
}
</script>
