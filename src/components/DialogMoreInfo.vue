<template>
  <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
    <q-card>
        <!-- Header -->
        <q-toolbar style="border-bottom: solid 1px lightgrey;">
            <q-btn flat round dense class="font-header-title " icon="chevron_left" v-close-popup></q-btn>
        </q-toolbar>

        <q-card-section>
            <h6 class="q-my-none">{{title}}</h6>
            <p class="q-my-md text-grey-10 font-normal">{{content}}</p>
        </q-card-section>
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
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
