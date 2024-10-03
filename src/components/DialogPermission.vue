<template>
    <q-dialog v-model="modal" @hide="closePopUp" class="bg-white" transition-show="slide-up" transition-hide="slide-down" style="z-index: 5000;">
        <q-card style="overflow: visible;border-radius: 15px;max-width: 355px;">
          <q-card-section class="q-pb-none q-pt-sm q-px-lg">
            <div class="tip-bulb">
                <img :src="promptOptions.tip_image" class="tip-bulb-image">
            </div>
            <div class="bg-white q-my-xl">
              <p class="text1" v-if="promptOptions.text1" v-html="promptOptions.text1"></p>
              <img class="image q-my-sm " v-if="promptOptions.image" :src="promptOptions.image"/>
              <p class="text1" v-if="promptOptions.text2" v-html="promptOptions.text2"></p>
              <q-btn class="relative-bottom full-width q-mt-md" :label="$t('button.next')" color="primary" @click="onOk"></q-btn>
              <q-btn class="relative-bottom full-width q-mt-md" v-if="promptOptions.type !== 'location'" :label="$t('enable.later')" color="grey" flat @click="closePopUp"></q-btn> <br><br>
              <p class="text1" v-html="$t('change.later')"></p>
            </div>
          </q-card-section>
        </q-card>
        <!-- <q-card style="border-radius: 15px;max-width: 355px;" v-if="promptOptions.type === 'location'">
          <q-card-section>
            <div class="tip-bulb">
              <img src="/statics/images/logo-mid.jpg" class="tip-bulb-image">
            </div>
            <div class="bg-white q-my-lg">
              <p class="text1" v-if="promptOptions.text1" v-html="promptOptions.text1"></p>
              <img class="image q-my-sm " v-if="promptOptions.image" :src="promptOptions.image"/>
              <p class="text1" v-if="promptOptions.text2" v-html="promptOptions.text2"></p>
              <h6 class="q-my-none q-mb-sm">{{$t('before.enjoy.our.pawsome.app')}}</h6>
              <p class="q-my-md">{{$t('allow.permissions.with.app')}}</p>
              <p class="q-my-sm" v-html="$t('permissions.gps')"></p>
              <p class="q-my-sm" v-html="$t('permissions.push.notifications')"></p>
              <p class="q-my-sm" v-html="$t('permissions.allow')"></p>
              <q-btn class="relative-bottom full-width q-mt-md" :label="$t('i.understand')" color="primary" @click="closePopUp"></q-btn>
            </div>
          </q-card-section>
        </q-card> -->
    </q-dialog>
</template>
<script>
export default {
  props: {
    trigger: {
      type: Boolean,
      default: false
    },
    promptOptions: {
      type: Object,
      default (rawProps) {
        return { type: 'location', tip_image: 'statics/images/logo-mid.jpg', 'ok_btn_text': this.$t('i.understand') }
      }
    }
  },
  data () {
    return {
      modal: false
    }
  },
  mounted () {
    console.log(this.promptOptions)
    if (this.trigger) {
      this.modal = this.trigger
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
      console.log('check prommpt options', this.promptOptions.type)
      console.log('Type of promptOptions.type:', typeof this.promptOptions.type)
      localStorage.setItem('enableLater', true)
    },
    onOk () {
      this.modal = false
      this.$emit('on-ok', this.promptOptions.type)
    }
  }
}
</script>
<style>
.image {
  width: 100%
}
.text1, .text2 {
  font-size: 15px
}
</style>
