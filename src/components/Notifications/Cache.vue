<template>
  <div class="full-width q-px-md">
    <div class="row justify-center">
      <img :src="icon"/>
    </div>
    <div class="row justify-center q-py-md ">
      <span class="q-headline justify-center">{{title}}</span>
    </div>
    <div class="row justify-center">
      <span style="text-align: center; max-width: 330px;">{{detail}}</span>
    </div>
    <div class="row justify-center">
      <q-btn outline class="q-mt-lg q-mx-auto" style="color: goldenrod;" :label="'View Booking'" @click="handleClickToRedirect" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    destinationId: { type: String, required: true },
    icon: { type: String, required: true },
    title: { type: String, required: true },
    detail: { type: String, required: true },
    type: {type: Number, required: true}
  },
  data () {
    return {
      bLoadingFinished: false
    }
  },
  methods: {
    handleClickToRedirect () {
      if (this.type === 2 || this.type === 6) this.handleActivityRouting()
      else if (this.type === 3) this.handleActivityRating()
      else if (this.type === 4) this.handleBookingRouting()
    },
    handleActivityRating () {
      let vm = this
      var arrDestinationIds = []
      if (vm.destinationId) arrDestinationIds = vm.destinationId.split(',')
      if (arrDestinationIds.length > 1) {
        if (arrDestinationIds[1].includes('-')) {
          vm.$q.notify('Review Listing Notification is not completed yet...')
          vm.bLoadingFinished = true
        } else {
          vm.$router.push('/chat/request/' + arrDestinationIds[0] + '/response/' + arrDestinationIds[1])
        }
      } else if (arrDestinationIds.length > 0) {
        this.bLoadingFinished = true
      }
    },
    handleBookingRouting () {
      var arrDestinationIds = [], vm = this
      if (this.destinationId) arrDestinationIds = this.destinationId.split(',')
      if (arrDestinationIds.length > 1 && parseInt(arrDestinationIds[0]) > 0 && parseInt(arrDestinationIds[1]) > 0) {
        vm.$router.push('/chat/request/' + arrDestinationIds[0] + '/response/' + arrDestinationIds[1])
      } else if (arrDestinationIds.length > 0 && parseInt(arrDestinationIds[0]) > 0) {
        this.$q.notify('Booking Parent Notification is not completed yet...')
        // act according to this http://gl.forwen.com/petbacker-vue/webapp/issues/76#note_2345
      } else if (arrDestinationIds.length > 0 && arrDestinationIds[0].includes('jobs')) {
        this.$q.notify('Reminder Job Missed Notification is not completed yet...')
      } else if (arrDestinationIds.length > 0 && arrDestinationIds[0].includes('wallet')) {
        this.$q.notify('Payout Notification is not completed yet...')
      } else if (arrDestinationIds.length > 1 && arrDestinationIds[0].includes('inbox')) {
        if (arrDestinationIds[1].includes('request')) {
          vm.$router.push('/messages')
        } else if (arrDestinationIds[1].includes('job')) {
          this.$q.notify('Reminder Job Message Missed Notification is not completed yet...')
        }
      }
    },
    handleActivityRouting () {
      var arrDestinationIds = []
      if (this.destinationId) arrDestinationIds = this.destinationId.split(',')
      if (this.type === 2) {
        this.$q.notify('Moment Activity Notification is not completed yet...')
      } else if (this.type === 6) {
        if (arrDestinationIds.length > 1) {
          this.$q.notify('Pet Wall Reminder Notification is not completed yet...')
        } else if (arrDestinationIds.length > 0) {
          this.$q.notify('Pet Wall Activity Notification is not completed yet...')
        }
      }
    }
  }
}
</script>
