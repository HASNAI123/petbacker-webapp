<template>
    <q-dialog v-model="modal" :content-css="{width: 'auto', height: 'fit-content', background: 'transparent', boxShadow: 'none'}" @hide="onClose">
      <q-card style="overflow: visible;">
        <q-card-section style="min-height: 150px;" class="q-pb-none">
          <div class="text-center">
              <img src="statics/images/congratulations.png" class="image-upload" width="50%"/>
          </div>
          <div class="bg-white q-my-lg">
              <div class="row justify-center">
                <div class="col-12 text-center q-pa-md tip-desc">
                  <h6 class="q-my-md">{{$t('upcoming.feature')}}</h6>
                  <span style="white-space: pre-wrap;">{{message}}</span>
                </div>
              </div>
              <div class='full-width q-px-md'>
                <q-btn class="full-width" color="primary" :label="$t('ok')" @click="onClose" />
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
    message: {
      type: String,
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
    }
  },
  methods: {
    onClose () {
      this.$emit('on-close', false)
    }
  }
}
</script>
