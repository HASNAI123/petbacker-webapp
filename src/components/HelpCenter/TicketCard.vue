<template>
    <q-card class="q-ma-md" style="border-radius: 11px;" @click="$router.push({name: 'ChatSupport', params: {ticketId: ticketInfo.id}})">
        <!-- Ticket Category / Status -->
        <q-item class="bg-primary text-white">
            <q-item-section>
                <q-item-label class="text-weight-bold font-normal">{{ticketInfo.helpdeskTicketCategory}}</q-item-label>
            </q-item-section>

            <ticket-status :status="ticketInfo.status"></ticket-status>
            <q-badge floating color="red" v-if="ticketInfo.newSupportMessage > 0">{{ticketInfo.newSupportMessage}}</q-badge>
        </q-item>

        <q-separator></q-separator>

        <!-- Ticket Subject / Created Time -->
        <q-item>
            <q-item-section>
                <q-item-label v-html="ticketInfo.subject" lines="1" class="font-normal text-weight-medium"></q-item-label>
            </q-item-section>

            <q-item-section side>
                <q-item-label caption lines="1">{{formatCreatedTime(ticketInfo.createdTime)}}</q-item-label>
            </q-item-section>
        </q-item>

        <q-separator class="full-width"></q-separator>

        <!-- Ticket Description -->
        <q-item>
            <q-item-section>
                <q-item-label v-html="ticketInfo.description" caption lines="2"></q-item-label>
            </q-item-section>

            <q-item-section side>
                <q-icon name="chevron_right" size="xs"></q-icon>
            </q-item-section>
        </q-item>

        <!-- <dialog-ticket-summary :trigger="summaryModal" :ticketInfo="ticketInfo" :formattedTime="formatCreatedTime(ticketInfo.createdTime)" :index="index" @on-close="triggerSummaryModal"></dialog-ticket-summary> -->
    </q-card>
</template>
<script>
import moment from 'moment'
export default {
  components: {
    'ticket-status': () => import('components/HelpCenter/TicketStatus.vue')
    //  'dialog-ticket-summary': () => import('components/HelpCenter/DialogTicketSummary.vue')
  },
  props: {
    ticketInfo: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      summaryModal: false
    }
  },
  methods: {
    triggerSummaryModal (status) {
      this.summaryModal = status
    },
    formatCreatedTime (createdTime) {
      return moment.utc(createdTime).local().format('D MMM YYYY')
    }
  }
}
</script>
