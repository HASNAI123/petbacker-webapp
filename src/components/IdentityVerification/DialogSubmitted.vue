<template>
    <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal">
        <q-card class="q-pb-lg" style="overflow: visible;border-radius: 11px;">
            <q-card-section class="q-pb-xs text-center" style="width: 250px;">
                <div class="tip-bulb">
                    <img src="statics/images/logo-mid.jpg" class="tip-bulb-image">
                </div>
                <h6 class="q-my-none q-mb-md q-mt-lg text-secondary">{{$t('note')}}</h6>
                <p class="text-grey-8 q-my-lg" style="max-width: 220px;" v-if="type === 'verification'">{{$t('allow.2.7.days.to.verify.documents')}}</p>
                <p class="text-grey-8 q-my-lg" style="max-width: 220px;" v-else-if="type === 'update'">{{$t('documents.submitted.updated')}}</p>
            </q-card-section>
            <q-card-section>
              <q-btn :label="$t('got.it')" class="full-width" color="primary" :ripple="false" @click="closePopUp"></q-btn>
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
    type: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      imageInfo: null,
      loader: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)
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
