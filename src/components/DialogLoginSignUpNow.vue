<template>
    <q-dialog v-model="modal" :content-css="{width: 'auto', height: 'fit-content', background: 'transparent', boxShadow: 'none'}" @hide="onClose">
      <q-card style="overflow: visible; border-radius: 11px;">
        <q-card-section style="min-height: 150px;max-width: 280px;" class="q-px-none q-py-sm">
          <div class="tip-bulb">
              <img src="statics/images/logo-mid.jpg" class="tip-bulb-image">
          </div>
          <div class="bg-white q-mt-lg">
              <div class="row justify-center">
                <div class="col-12 text-center q-pa-md tip-desc">
                  <h6 class="q-my-none">PetBacker</h6>
                  <span style="white-space: pre-wrap;">{{message}}</span>
                </div>
              </div>
              <div class='full-width q-px-md'>
                <q-btn class="full-width text-capitalize q-my-sm" color="primary" :label="$t('login.or.sign.up')" @click="onOk" ></q-btn>
                <q-btn class="full-width text-capitalize q-my-sm" color="primary" flat :label="$t('button.not.now')" @click="onClose" ></q-btn>
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
    onOk () {
      this.$router.replace({name: 'Logout'})
      this.onClose()
    },
    onClose () {
      this.$emit('on-close', false)
    }
  }
}
</script>
