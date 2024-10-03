<template>
  <q-dialog ref="" v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
    <q-card v-touch-pan.right.prevent.mouse="onSwipeRight">
      <!-- Header -->
      <q-toolbar style="border-bottom: 1px solid lightgrey;z-index: 6000;" class="fixed-top bg-white">
        <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
        <q-toolbar-title v-close-popup>
          <h6 class="q-my-none" style="margin-left: 22%;">Ticket Summary</h6>
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section class="q-pa-none q-mt-xl">
        <q-item>
          <q-item-section>
            <q-item-label class="q-py-sm">
                <big><strong>{{ ticketInfo.helpdeskTicketCategory }}</strong></big>
            </q-item-label>

            <!-- Status -->
            <ticket-status :status="ticketInfo.status" class="q-mb-sm"></ticket-status>

            <!-- Created Time -->
            <q-item-label class="q-py-xs header-description" caption>{{ formattedTime }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-card-section class="q-pa-none">
        <q-card class="q-ma-md q-pa-md" style="border-radius: 10px;">
          <h6 class="q-my-none q-mb-sm">{{ticketInfo.subject}}</h6>
          <div class="q-pa-md" style="border: solid 1px lightgrey;border-radius: 10px;">
            <p class="q-my-none">{{ticketInfo.description}}</p>
          </div>

          <q-card-actions class="q-mt-sm" v-if="ticketInfo.status !== 2">
            <q-btn label="View Reply" color="primary" rounded class="full-width" @click="$router.push({name: 'ChatSupport'})">
              <q-badge color="negative" floating v-if="ticketInfo.newSupportMessage > 0">{{ticketInfo.newSupportMessage}}</q-badge>
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  components: {
    'ticket-status': () => import('components/HelpCenter/TicketStatus.vue')
  },
  props: {
    trigger: {
      required: true,
      default: false
    },
    ticketInfo: {
      required: true,
      type: Object
    },
    formattedTime: {
      required: true,
      type: String,
      default: ''
    },
    index: {
      required: true,
      type: Number
    }
  },
  data () {
    return {
      modal: false,
      loader: true,
      ticketSummary: null
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    }
  },
  methods: {
    onSwipeRight ({ evt, ...info }) {
      if (info.direction === 'right' && info.offset.x > 100) {
        this.closePopUp()
      }
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    },
    getTicketInfo () {
      this.loader = true
      this.$axios.get(`helpdesk-tickets/${this.$route.params.ticketId}?uuid=${this.$store.state.user.uuid}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status !== 204) {
          this.ticketSummary = response.data.ticketInfo
        }
      }).catch((error) => {
        this.forceLogout(error)
        console.error(error)
      }).finally(_ => {
        this.loader = false
      })
    }
  }
}
</script>
