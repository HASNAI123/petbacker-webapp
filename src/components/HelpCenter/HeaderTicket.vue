<template>
    <q-card class="q-ma-md" style="border-radius: 11px;" @click="$router.push({name: 'ChatSupportHelp'})" v-if="ticketInfo">
        <q-item class="bg-primary text-white">
            <q-item-section>
                <q-item-label class="text-weight-bold font-normal">{{ticketInfo.helpdeskTicketCategory}}</q-item-label>
            </q-item-section>

            <ticket-status :status="ticketInfo.status"></ticket-status>
        </q-item>

        <q-separator />

        <q-item>
            <q-item-section>
                <q-item-label v-html="ticketInfo.description" caption lines="2"></q-item-label>
            </q-item-section>

            <q-item-section side>
                <q-icon name="chevron_right" size="xs"></q-icon>
            </q-item-section>
        </q-item>
    </q-card>
</template>
<script>
export default {
  components: {
    'ticket-status': () => import('components/HelpCenter/TicketStatus.vue')
  },
  data () {
    return {
      ticketInfo: null
    }
  },
  created () {
    if (this.$store.getters['cached/getSupportLatestTicketCached']) {
      this.ticketInfo = this.$store.getters['cached/getSupportLatestTicketCached']
    }
  },
  mounted () {
    this.getTicketInfo()
  },
  methods: {
    getTicketInfo () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        return
      }

      this.$axios.get(`helpdesk-tickets?uuid=${this.$store.state.user.uuid}&per_page=1&page=1`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status !== 204) {
    this.ticketInfo = response.data.ticketInfo.items[0]

    if (JSON.stringify(this.$store.getters['cached/getSupportLatestTicketCached']) !== JSON.stringify(response.data.ticketInfo.items[0])) {
      this.$store.dispatch('cached/cacheSupportLatestTicket', response.data.ticketInfo.items[0])
    }
  } else {
    this.$store.dispatch('cached/clearSupportTicketsCached')
  }
}).catch((error) => {
        this.forceLogout(error)
        console.error(error)
      })
    }
  }
}
</script>
