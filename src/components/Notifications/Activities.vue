<template>
  <div>
    <div v-if="bLoadingFinished">
      <div v-if="notificationType === NOTIFICATION_TYPE.MOMENT_ACTIVITY" class="row justify-center column">
        <link-to-mobile/>
      </div>
      <div v-else-if="notificationType === NOTIFICATION_TYPE.PET_WALL_ACTIVITY" class="row justify-center column">
        <link-to-mobile/>
      </div>
      <div v-else-if="notificationType === NOTIFICATION_TYPE.PET_WALL_REMINDER" class="row justify-center column">
        <link-to-mobile/>
      </div>
    </div>
    <div v-else class="row justify-center q-py-lg">
      <ComponentPreLoader></ComponentPreLoader>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'

export default {
  props: ['destinationId', 'type'],
  watch: {
    destinationId: function () {
      this.bLoadingFinished = false
      this.getNotificationInfo()
    },
    type: function () {
      this.bLoadingFinished = false
      this.getNotificationInfo()
    }
  },
  components: {
    'link-to-mobile': () => import('components/Notifications/LinkToMobile')
  },
  data () {
    const NOTIFICATION_TYPE = {
      UNDEFINED: 0,
      MOMENT_ACTIVITY: 1,
      PET_WALL_ACTIVITY: 2,
      PET_WALL_REMINDER: 3
    }

    return {
      bLoadingFinished: false,
      notificationType: NOTIFICATION_TYPE.UNDEFINED,
      NOTIFICATION_TYPE: NOTIFICATION_TYPE,
      wallId: null
    }
  },
  mounted () {
    this.getNotificationInfo()
  },
  methods: {
    getNotificationInfo () {
      var arrDestinationIds = []
      if (this.destinationId) arrDestinationIds = this.destinationId.split(',')
      if (this.type === 2) {
        this.notificationType = this.NOTIFICATION_TYPE.MOMENT_ACTIVITY
        this.bLoadingFinished = true
        this.$q.notify('Moment Activity Notification is not completed yet...')
      } else if (this.type === 6) {
        if (arrDestinationIds.length > 1) {
          this.notificationType = this.NOTIFICATION_TYPE.PET_WALL_REMINDER
          this.bLoadingFinished = true
          this.$q.notify('Pet Wall Reminder Notification is not completed yet...')
        } else if (arrDestinationIds.length > 0) {
          this.wallId = arrDestinationIds[0]
          this.notificationType = this.NOTIFICATION_TYPE.PET_WALL_ACTIVITY
          this.handleProcessPetWallActivity()
        }
      }
    },
    handleProcessPetWallActivity () {
      let vm = this
      // CORS Protection ----
      vm.bLoadingFinished = true
      this.$q.notify('Pet Wall Activity Notification is not completed yet...')
    }
  }
}
</script>
