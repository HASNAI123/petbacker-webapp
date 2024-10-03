<!-- the middle card in Your Quotes showing service + price + desc -->
<template>
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <q-card style="border-radius: 11px;" class="q-mx-xs q-py-sm q-my-xs" @click="openQuoteDetailModal">
          <q-card-section>
              <q-item class="q-pa-none font-normal">
                  <q-item-section>
                      <!-- Quote Name -->
                      <q-item-label class="font-header-title text-wrap" lines="1">
                        {{quoteItem.quoteTitle}}
                        <div v-if="this.quoteItem.quoteUnitServiceId !== this.quoteTypes[0].serviceId && !taskCompleted" class="float-right" @click.stop="onDelete">
                          <q-icon v-if="!showLoader" name="fas fa-trash" class="text-negative"></q-icon>
                          <q-spinner v-else size="1.3em"></q-spinner>
                        </div>
                      </q-item-label>

                      <!-- Quote Details -->
                      <q-item-label lines="1" class="text-wrap"><span class="text-weight-bold">{{getCurrency(quoteItem.quoteCurrencyId)}}</span>{{` ${quoteItem.quoteAmount} ${computeSuffixText(quoteItem.quantity1, quoteItem.quantity2, quoteItem.quantity3, quoteItem.quantity4)}`}}</q-item-label>

                      <!-- Quote Description -->
                      <q-item-label caption lines="1" class="text-wrap">{{quoteItem.quoteDescription}}</q-item-label>
                  </q-item-section>

                  <q-item-section side v-if="!taskCompleted">
                      <q-item-label caption>
                          <q-icon name="chevron_right" size="2em"></q-icon>
                      </q-item-label>
                  </q-item-section>
              </q-item>
          </q-card-section>

          <!-- Prompt Dialog -->
          <dialog-error :trigger="promptModal" :title="titleModal" :message="messageModal" :okButtonLabel="promptButtonLabel" :cancelButtonLabel="cancelButtonLabel" :statusCode="errorStatus" @on-close="triggerPromptModal" @on-ok="onOkPromptModal" @on-cancel="onCancelPromptModal"></dialog-error>

          <!-- Quote Details Dialog -->
          <dialog-quotedetails
          :trigger="quoteDetailModal"
          :id="quoteItem.id"
          :quoteTypes="quoteTypes"
          :quoteDescription="quoteItem.quoteDescription"
          :type="quoteItem.quoteUnitServiceId"
          :defaultUnit="quoteItem.quoteUnit"
          :defaultPrice="quoteItem.quoteAmount"
          :currency="quoteItem.quoteCurrencyId"
          :quantity1="quoteItem.quantity1"
          :quantity2="quoteItem.quantity2"
          :quantity3="quoteItem.quantity3"
          @on-close="closeQuoteDetail"
          @refresh="onRefresh"
          @on-error="triggerPromptModal"></dialog-quotedetails>
      </q-card>
    </transition>
</template>
<script>
import countries from 'assets/countries.json'
export default {
  components: {
    'dialog-quotedetails': () => import('components/JobQuote/DialogQuoteDetails.vue'),
    'dialog-error': () => import('components/DialogError.vue')
  },
  props: {
    quoteItem: {
      type: Object,
      required: true
    },
    quoteTypes: {
      type: Array,
      required: true
    },
    taskCompleted: {
      required: true,
      default: true
    }
  },
  data () {
    return {
      quoteDetailModal: false,
      showLoader: false,
      messageModal: this.$t('confirmation.delete.this'),
      titleModal: this.$t('reminder'),
      promptModal: false,
      errorStatus: 0,
      promptButtonLabel: this.$t('dialog.button.yes'),
      cancelButtonLabel: this.$t('close')
    }
  },
  methods: {
    triggerPromptModal (status, btnLabel = this.$t('dialog.button.yes'), message = this.$t('confirmation.delete.this'), title = this.$t('reminder'), errorStatus = -1, cancelBtnLabel = this.$t('close')) {
      this.promptModal = status
      this.errorStatus = errorStatus
      this.titleModal = title
      this.messageModal = message
      this.promptButtonLabel = btnLabel
      this.cancelButtonLabel = cancelBtnLabel
    },
    openQuoteDetailModal () {
      if (!this.taskCompleted) {
        this.quoteDetailModal = true
      }
    },
    onOkPromptModal (status) {
      if (status === -1) {
        this.deleteQuoteItem()
      } else {
        this.triggerPromptModal(false)
      }
    },
    onCancelPromptModal (status) {
      if (status === 11) {
        // TODO: override min quote
      } else {
        this.triggerPromptModal(false)
      }
    },
    onDelete () {
      this.triggerPromptModal(true)
    },
    deleteQuoteItem () {
      this.triggerPromptModal(false)
      this.showLoader = true
      this.$axios.delete(`/users/${this.$store.getters['user/getUserUuidState']}/tasks/${this.$route.params.taskId}/quotes/${this.quoteItem.id}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$emit('on-refresh', true)
      }).catch((error) => {
        console.error(error)
        let errorMessage = error.response.data ? error.response.data.message : this.$t('something.wrong.gateway')
        this.triggerPromptModal(true, this.$t('ok'), errorMessage, this.$t('note'), error.response.data.code || 0)
      }).finally(_ => {
        setTimeout(() => {
          this.showLoader = false
        }, 500)
      })
    },
    onRefresh () {
      this.$emit('on-refresh', true)
    },
    closeQuoteDetail (value) {
      this.quoteDetailModal = value
    },
    getCurrency (countryid) {
      for (let index in countries) {
        if (parseInt(countries[index].id) === countryid) {
          return countries[index].currencyCode
        }
      }
    },
    computeSuffixText (quantity1, quantity2, quantity3, quantity4) {
      if (this.quoteItem.quoteUnitServiceId === this.quoteTypes[0].serviceId) {
        return `x ${quantity1} ${this.quoteItem.quoteUnit}(s) x ${quantity2} Pet(s)`
      } else if (this.quoteItem.quoteUnitServiceId === 0) {
        return `x ${quantity3} ${this.quoteItem.quoteUnit}`
      } else {
        return `x ${quantity3} ${this.quoteItem.quoteUnit}(s)`
      }
    }
  }
}
</script>
