<template>
    <q-dialog v-model="modal" @hide="onClose" :content-css="{width: 'auto', height: 'fit-content', background: 'transparent', boxShadow: 'none'}">
      <q-card style="overflow: visible; border-radius: 11px;">
        <q-card-section style="min-height: 150px;max-width: 280px;" class="q-px-none q-py-sm">
          <div class="tip-bulb">
              <img src="statics/images/logo-mid.jpg" class="tip-bulb-image">
          </div>
          <div class="bg-white q-mt-lg">
              <div class="row justify-center">
                <div class="col-12 text-center q-pa-md tip-desc">
                  <h6 class="q-my-none text-capitalize" v-if="title">{{title}}</h6>
                  <span style="white-space: pre-wrap;" v-if="message && message.includes('href')" v-html="message"></span>
                  <span style="white-space: pre-wrap;" v-else>{{message}}</span>
                </div>
              </div>
              <div class='full-width q-px-md'>
                <q-btn class="full-width text-capitalize q-my-sm text-primary" flat v-if="learnMoreLink" @click="openUrl(learnMoreLink)">{{$t('chat.learnmore')}}</q-btn>
                <q-btn class="full-width text-capitalize q-my-sm" color="primary" v-if="statusCode === 1 && $route.name !== 'FavoritedListings' && $route.name !== 'Listing'" @click="$router.push({name: 'ChatSupportHelp'})">Contact Support</q-btn>
                <q-btn class="full-width text-capitalize q-my-sm" color="primary" v-else-if="statusCode === 2 && $route.name !== 'FavoritedListings' && $route.name !== 'Listing'" @click="onUpdate">Update Now</q-btn>
                <q-btn class="full-width text-capitalize q-my-sm" color="primary" v-else :label="okButtonLabel === null ? $t('i.understand') : okButtonLabel" @click="onOk(statusCode)" ></q-btn>
                <q-btn class="full-width text-capitalize q-my-sm" color="primary" flat :label="cancelButtonLabel === null ? $t('close') : cancelButtonLabel" @click="onCancel"></q-btn>
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
    title: {
      type: String,
      default: null
    },
    okButtonLabel: {
      default: null
    },
    cancelButtonLabel: {
      default: null
    },
    statusCode: {
      type: Number

    },
    message: {
      required: true
    },
    learnMoreLink: {
      type: String,
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
    onUpdate () {
      window.open(this.$t('petbacker.app.link'))
    },
    onOk (status) {
      // redirect user to settings page to change settings
      if (status === 12) {
        this.$router.push({name: 'Settings'})
      } else if (status === 8) {
        this.$router.replace({name: 'StepsLeft'})
      } else if (status === 9) {
        this.$router.replace({name: 'Sponsor'})
      } else if (status === 30) {
        this.$router.replace({name: 'ChatSupportHelp'})
      } else if (status === 31) {
        this.$router.replace({name: 'ChatSupportHelp'})
      } else {
        this.$emit('on-ok', status)
      }

      this.onClose()
    },
    onCancel () {
      this.$emit('on-cancel', this.statusCode)
      this.onClose()
    },
    onClose () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
