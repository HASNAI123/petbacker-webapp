<template>
    <q-dialog v-model="modal" @hide="onClose" transition-show="slide-up" transition-hide="slide-down">
      <q-card style="border-radius: 11px;">
        <q-card-section style="min-height: 150px;max-width: 320px;">
          <q-icon name="close" style="position: absolute;right: 16px;" class="text-grey" size="18px" @click="onClose"></q-icon>
          <div>
            <q-icon name="fas fa-coins" class="q-ml-sm text-yellow margin-auto q-my-lg" size="5em"></q-icon>
            <h6 class="font-normal q-my-none q-px-lg text-center" style="line-height: 1.5em;">Get <span v-if="responseInfo" class="text-weight-bolder">{{responseInfo.offerPoints}}</span> points when you pay and complete this booking on PetBacker</h6>
            <q-separator inset class="q-my-md margin-auto" color="primary" style="max-width: 60px;"></q-separator>
            <p class="text-grey-6 q-my-none q-px-lg text-center">Complete more bookings to earn more points and benefits</p>
          </div>

          <div class="q-mt-md">
            <q-btn class="full-width text-capitalize q-my-sm" color="primary" label="What can I use points for?"></q-btn>
            <q-btn @click="$router.push(`${$route.path}/checkout`)" class="full-width text-capitalize q-my-sm" color="primary" outline>Continue to payment</q-btn>
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
      default: false,
      required: true
    },
    responseInfo: {
      require: true
    }
  },
  data () {
    return {
      modal: false
    }
  },
  watch: {
    trigger: {
      handler (value) {
        if (value && this.$route.name === 'Chat') {
          this.checkFirstTime()
        }
      },
      deep: true
    }
  },
  methods: {
    async checkFirstTime () {
      console.log('responseInfo', this.responseInfo)
      if (this.$q.localStorage.has(`chat-rewards-${this.$route.params.request}-${this.$route.params.response}`)) {
        let todayTime = new Date()
        let createdTime = new Date(this.$q.localStorage.getItem(`chat-${this.$route.params.request}-${this.$route.params.response}`).createdTime)
        createdTime.setMonth(createdTime.getMonth() + 2)

        // if created Time is more than 2 months from the date created, remove cache
        if (todayTime.getTime() > createdTime.getTime()) {
          this.$q.localStorage.remove(`chat-rewards-${this.$route.params.request}-${this.$route.params.response}`)
        }
      } else {
        this.modal = true
        let currentDateTime = `${new Date().toISOString().slice(0, 10)}`
        this.$q.localStorage.set(`chat-rewards-${this.$route.params.request}-${this.$route.params.response}`, {createdTime: currentDateTime})
      }
    },
    onClose () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
