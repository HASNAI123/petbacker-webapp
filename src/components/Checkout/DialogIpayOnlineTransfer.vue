<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" :transition-hide="$q.platform.is.mobile ? 'slide-right' : ''" :transition-show="$q.platform.is.mobile ? 'slide-left' : ''">
      <q-card style="min-width: 320px;min-height: 400px;">
        <q-toolbar class="bg-white fixed-top" style="border-bottom: solid 1px lightgrey;z-index: 5000;">
          <q-btn flat round dense v-close-popup size="lg" icon="chevron_left"/>
          <q-toolbar-title v-close-popup>
            <h6 class="q-my-none" :style="{'margin-left: 14%' : $q.platform.is.mobile}">Online Bank Transfer</h6>
          </q-toolbar-title>
        </q-toolbar>

        <q-card-section v-if="paymentOptions" class="q-mt-xl" style="heigth: 77px;">
          <div v-for="(bankOption, index) in paymentOptions" :key="index">
            <q-item @click.native="onSelection(bankOption.paymentLink)">
              <q-item-section avatar v-if="bankOption.imageLink">
                <q-img :src="bankOption.imageLink" class="image-upload" width="100px" style="max-width: 115px;" basic></q-img>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{bankOption.paymentName}}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon name="chevron_right"></q-icon>
              </q-item-section>
            </q-item>

            <q-separator class="q-my-sm"></q-separator>
          </div>
        </q-card-section>
        <q-card-section v-else class="text-center">
          <ComponentPreLoader></ComponentPreLoader>
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
    href: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      paymentOptions: null,
      modal: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value

      if (value && this.paymentOptions === null) {
        this.getPaymentOptions()
      }
    }
  },
  methods: {
    getPaymentOptions () {
      this.$axios.get(this.href, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.paymentOptions = response.data.paymentOptions.items
      }).catch(e => {
        console.error(e)
      })
    },
    onSelection (gatewayLink) {
      this.$q.loading.show({spinnerColor: 'primary', backgroundColor: 'white'})
      this.$axios.get(gatewayLink, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.openUrl(response.data.checkoutInfo.paymentUrl)
        this.onClose()
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        this.$q.loading.hide()
      })
    },
    onClose () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
