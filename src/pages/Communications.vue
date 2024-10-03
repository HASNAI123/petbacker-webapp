<template>
    <q-page class="q-pb-xl q-ma-md">
        <h6 class="q-my-sm">{{$t('communication.apps')}}</h6>
        <p class="text-grey-6">{{$t('communication.apps.description')}}</p>

        <!-- Communications Mediums -->
        <q-item class="q-px-none">
            <q-item-section class="q-mb-none">
                <!-- WeChat -->
                <q-item-label class="q-my-md">
                    <q-input v-model="wechat" class="input" borderless :label="$t('wechat.payment')"></q-input>
                </q-item-label>

                <!-- Email -->
                <q-item-label class="q-my-md">
                    <q-input v-model="whatsapp" class="input" borderless :label="$t('whatsapp')"></q-input>
                </q-item-label>

                <!-- Phone -->
                <q-item-label class="q-my-md">
                    <q-input v-model="line" class="input" borderless :label="$t('social.line')"></q-input>
                </q-item-label>
            </q-item-section>
        </q-item>

        <!-- Bottom Save Button -->
        <div class="fixed-bottom bg-primary" style="border-top-right-radius: 15px;border-top-left-radius: 15px;z-index: 4000;">
          <div class="q-pa-md q-pb-lg" @click="onSave">
            <div class="text-white text-center cursor-pointer font-header-title">
              <p v-if="!loader" class="q-my-none text-weight-bold font-title">{{$t('button.save')}}</p>
              <span v-else>
                <q-spinner size="1.5em"></q-spinner>
              </span>
            </div>
          </div>
        </div>
    </q-page>
</template>
<script>
export default {
  data () {
    return {
      loader: false,
      line: this.$store.getters['user/getContactLine'],
      wechat: this.$store.getters['user/getContactWechat'],
      whatsapp: this.$store.getters['user/getContactWhatsapp']
    }
  },
  methods: {
    onSave () {
      this.loader = true
      let info = {
        'accountInfo': {
          'contactLine': this.line,
          'contactWechat': this.wechat,
          'contactWhatsapp': this.whatsapp
        }
      }

      this.$axios.put(`/account/${this.$store.state.user.uuid}`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        // update user states
        this.$store.dispatch('user/updateUserStates', response)
        this.$q.notify({message: this.$t('communications.info.saved'), type: 'positive', position: 'top'})
      }).catch(error => {
        console.error(error)
        if (error.response && error.response.data) {
          this.$q.notify({
            message: error.response.data.message,
            type: 'negative',
            position: 'top'
          })
        }
      }).finally(_ => {
        this.loader = false
        this.$router.go(-1)
      })
    }
  }
}
</script>
