<template>
    <q-dialog
        v-model="modal"
        position="bottom"
        @hide="closePopUp"
        class="responsive-modal"
        transition-hide="slide-down"
        transition-show="slide-up"
    >
      <q-card style="border-top-left-radius:11px;border-top-right-radius:11px;" class="q-pb-lg q-pt-sm" >
          <q-card-section class="q-pa-none text-center q-pb-xs" style="width: 100%;">
              <q-btn :ripple="false" class="q-py-sm full-width text-capitalize font-normal" flat :label="$t('listing.edit.location.option')" @click="onClick('EditLocation')"></q-btn>
              <q-btn :ripple="false" class="q-py-sm full-width text-capitalize font-normal" flat :label="$t('listing.edit.info.option')" @click="onClick('EditInfo')"></q-btn>
              <q-btn :ripple="false" class="q-py-sm full-width text-capitalize font-normal" flat :label="$t('listing.preview.option')" @click="onClick('PreviewListing')"></q-btn>
              <div class="q-pa-sm"><q-separator/></div>
              <q-btn :ripple="false" flat class="full-width q-py-sm text-weight-bold text-capitalize" text-color="black" @click="closePopUp">{{$t('close')}}</q-btn>
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
      modal: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)
    }
  },
  methods: {
    onClick (type) {
      this.$emit('on-click', type)
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
