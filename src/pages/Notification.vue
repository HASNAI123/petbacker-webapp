<template>
  <div class="justify-center">
    <pro-sys-msg-component v-if="selectedNotification" :notificationInfo="selectedNotification"/>
    <!-- <q-list v-if="type!==4" class="bg-white fixed-top z-fullscreen q-py-none" style="top: 50px; z-index: 20;" no-border>
      <q-item >
        <q-item-label>
          <q-item-tile label>
            <h4 class="emhasize strong text-center text-grey-7 q-my-none">{{ $t('navbar.notifications') }}</h4>
          </q-item-tile>
        </q-item-label>
      </q-item>
      <q-item-separator class="block q-ma-none"/>
    </q-list> -->
    <!-- <div :class="type===4?'row justify-center column q-pa-md':'row justify-center column q-pa-md'">
      <pro-sys-msg-component v-if="type === 1 || type === 5" :requestURL="requestURL"/>
      <activities v-else-if="type === 2 || type === 6" :type="type" :destinationId="destinationId"/>
      <ratings v-else-if="type === 3" :destinationId="destinationId"/>
      <booking v-else-if="type === 4" :destinationId="destinationId"/>
    </div> -->
    <div class="col-xs-12 text-center" v-else>
      <ComponentPreLoader></ComponentPreLoader>
    </div>
  </div>
</template>

<script>

export default {
  props: ['id'],
  components: {
    'pro-sys-msg-component': () => import('components/Notifications/ProSysMsgComponenet.vue')
    // 'booking': () => import('components/Notifications/Booking.vue'),
    // 'ratings': () => import('components/Notifications/Ratings.vue'),
    // 'activities': () => import('components/Notifications/Activities.vue')
  },
  data () {
    return {
      selectedNotification: null
    }
  },
  created () {
    this.getNotificationInfo()
  },
  methods: {
    getNotificationInfo () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/notifications/${this.$route.params.id || this.$route.query.id}?v=6`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.data) {
          this.selectedNotification = response.data
        }
      }).catch(error => {
        console.log(error)
        this.forceLogout(error)
        this.$router.go(-1)

        if (error.response && error.response.data) {
          this.$q.notify({message: error.response.data.message, type: 'negative', position: 'top'})
        }
      })
    }
  }
}
</script>
