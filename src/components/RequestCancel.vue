<template>
    <!-- Cancel Request modal -->
    <q-dialog v-model="cancelRequest" @hide="cancelPage = 0" :persistent="$q.platform.is.mobile" :maximized="$q.platform.is.mobile" :content-css="{width: '300px', height: 'fit-content', background: 'transparent', boxShadow: 'none'}" :transition-show="$q.platform.is.mobile ? 'slide-left' : ''" :transition-hide="$q.platform.is.mobile ? 'slide-right' : ''" >
        <q-card :class="$q.platform.is.mobile ? '' : 'desktop'" id="cancelDialog">
          <q-toolbar>
            <q-btn flat round dense @click="cancelPage === 0 ? cancelRequest = false : (cancelPage-=2)" icon="keyboard_arrow_left" v-if="cancelPage !== 5 || cancelPage !== 6"/>
            <q-toolbar-title style="font-size: 18px;" :style="{'margin-left': cancelPage !== 6 ? '-10%':''}" class="text-weight-bold text-center">
              Cancel Booking
            </q-toolbar-title>
          </q-toolbar>
          <q-card-section>
            <p class="text-weight-medium label" v-if="cancelPage === 0">Why would you like to cancel ?</p>
            <!-- Cancel Request Title-->
            <p class="text-weight-medium text-justify label" v-if="cancelPage === 2">Your booking with this Backer will be cancelled. Your request will be cancelled as well and you will need to make a new request again. Your deposit for this booking will also be refunded back to your payment method.</p>
            <p class="text-weight-medium text-justify label" v-else-if="cancelPage === 4">May we know the reason you would like to cancel your request so that we may improve further?</p>
            <p class="text-weight-medium text-justify label" v-else-if="cancelPage === 6">Your booking and request has been cancelled.</p>
          </q-card-section>
          <q-card-section v-if="cancelPage === 0">
            <q-list>
              <q-item class="cancelOptions" clickable v-ripple @click.native="cancelPage = 2">
                <q-item-section>
                  <p class="options">I do not need this request anymore</p>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
              <q-item class="cancelOptions" clickable v-ripple @click.native="$router.push('/chat/support')">
                <q-item-section>
                  <p class="options">I would like to contact support</p>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section v-else-if="cancelPage === 2">
            <q-list>
              <q-item class="cancelOptions" clickable @click.native="incrementCancelPage">
                <q-item-section>
                  <p class="options">Yes, I would like to proceed</p>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
              <q-item class="cancelOptions" clickable @click.native="cancelRequest = false, cancelPage = 0">
                <q-item-section>
                  <p class="options">I will do this later</p>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
              <q-item class="cancelOptions" clickable @click.native="$router.push('/chat/support')">
                <q-item-section>
                  <p class="options">I would like to contact support</p>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section v-else-if="cancelPage === 4">
            <q-list>
              <q-item style="padding:0px; margin-bottom: 40px;">
                <q-input type="textarea" v-model="cancelMessage" placeholder="Type reason here" class="input" borderless dense style="width: 100%; height: 220px;" rows="12"/>
              </q-item>
              <q-item class="cancelOptions" clickable @click.native="cancelRequest = false, cancelPage = 0">
                <q-item-section>
                  <p class="options">I will do this later</p>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
              <q-item class="cancelOptions" clickable>
                <q-item-section @click.native="onCancelRequest(currentRequest)" v-if="cancelPage === 4">
                  <p class="options">Cancel this request</p>
                </q-item-section>
                <q-item-section side>
                  <q-icon style="font-size: 16px;" name="arrow_forward_ios"></q-icon>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section v-else-if="cancelPage === 6">
            <p class="text-weight-medium label">Thank you for supporting PetBacker</p>
            <q-btn dense color="primary" class="text-capitalize q-px-md text-weight-regular back-home-btn" @click="closeCancelModal">Go Back to Home</q-btn>
          </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
/* global bugsnagClient */
export default {
  props: {
    // to trigger open this modal
    cancelRequest: Boolean,
    // specify which request
    currentRequest: {
      type: Object
    }
  },
  data () {
    return {
      cancelPage: 0,
      cancelMessage: null
    }
  },
  methods: {
    incrementCancelPage () {
      this.cancelPage += 2
    },
    onCancelRequest (request) {
      if (request === -1) {
        console.error('[RequestCancel.vue] Current request is empty')
        return
      }

      let requestId = request.id
      let requestServiceName = request.serviceName

      let confirm = this.$t('confirmation')
      let message = this.$t('confirmation.cancel.request', {requestServiceName: requestServiceName})
      if (this.delete) {
        message = this.$t('confirmation.delete.request', {requestServiceName: requestServiceName})
      }
      let yes = this.$t('yes')
      let no = this.$t('no')
      this.$q.dialog({
        title: confirm,
        message: message,
        ok: yes,
        cancel: no
      }).onOk(() => {
        this.$axios.delete(`users/${this.$store.state.user.uuid}/requests/${requestId}`, {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then(response => {
          this.incrementCancelPage()
          if (this.cancelMessage !== null) {
            this.messageBox = 'Request [' + requestId + '] ' + 'has been cancelled' + '\nReason:\n' + this.cancelMessage
            this.sendSupportMessage()
          }
          this.messageBox = null
          this.modalMoreOptions = false
          this.getRequests()
          let message = this.$t('request.succesfully.cancelled', {requestServiceName: requestServiceName})
          if (this.delete) {
            message = this.$t('request.deleted', {requestServiceName: requestServiceName})
          }
          setTimeout(() => {
            this.$q.notify({
              message: message
            })
          }, 850)
          this.delete = false
        }).catch(error => {
          console.error(error)
          if (this.delete) {
            bugsnagClient.notify(new Error(requestServiceName + ' (' + requestId + ')  request failed to be deleted'))
            this.$q.notify({
              message: this.$t('request.deleted.failed', {requestServiceName: requestServiceName})
            })
          } else {
            this.$q.notify({
              message: this.$t('request.fail.cancelled', {requestServiceName: requestServiceName}),
              type: 'negative'
            })
            bugsnagClient.notify(new Error(requestServiceName + ' (' + requestId + ')  request failed to be cancelled'))
          }
        })
      }).onCancel(() => {
        if (this.delete) {
          this.delete = false
        }
      })
    }
  }
}
</script>
