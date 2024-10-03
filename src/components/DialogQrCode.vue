<template>
    <q-dialog v-model="modal" @hide="closePopUp" maximized transition-show="slide-up" transition-hide="slide-down" style="z-index: 5000;">
        <q-card class="q-pa-none bg-white" v-touch-pan.down.prevent.mouse="onSwipe">
          <!-- Header -->
          <q-toolbar style="border-bottom: 1px solid lightgrey;">
            <q-toolbar-title @click="closePopUp">
              <h6 class="q-my-none services-title font-header-title" style="text-align: center;">{{$t('qr.code')}}</h6>
            </q-toolbar-title>
            <q-btn flat round dense icon="close" @click="closePopUp"></q-btn>
          </q-toolbar>
          <div class="qr-text">
            {{$t('please.ask.sitter.to.scan.the.qr.code')}}
          </div>
          <q-card-section style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);" v-if="$store.getters['user/getUserUuidState']">
            <qrcode-vue :value="`${$store.getters['user/getUserUuidState']}`" class="q-ma-md" size="280" level="H"></qrcode-vue>
          </q-card-section>
          <q-card-section v-else>
            <div class="row justify-center">
              <img src="statics/images/logo-mid.jpg" class="image-upload" width="25%"/>
              <div class="col-12 text-center q-pa-md tip-desc">
                <p class="q-my-none">{{$t('guest.mode.qr.code')}}</p>
              </div>
            </div>
            <div class='full-width q-px-md'>
              <q-btn class="full-width text-capitalize q-my-sm" color="primary" :label="$t('login.or.sign.up')" @click="onLoginSignUp" ></q-btn>
              <q-btn class="full-width text-capitalize q-my-sm" color="primary" flat :label="$t('button.not.now')" @click="closePopUp" ></q-btn>
            </div>
          </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script>
import QrcodeVue from 'qrcode.vue'
export default {
  components: {
    QrcodeVue
  },
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
      }, 0)
    }
  },
  methods: {
    onLoginSignUp () {
      this.$router.replace({name: 'Logout'})
      this.closePopUp()
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    },
    onSwipe ({ evt, ...info }) {
      if (info.direction === 'down' && info.offset.y > 26) {
        this.closePopUp()
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.qr-text
  text-align: center;
  font-size: 17px;
  font-weight: bold;
  margin-top: 60px;
</style>
