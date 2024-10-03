<template>
    <q-dialog v-model="modal" @hide="onClose">
      <q-card style="border-radius: 11px;">
        <q-card-section style="min-height: 150px;max-width: 320px;">
          <q-icon name="close" style="position: absolute;right: 16px;" class="text-grey" size="18px" @click="onClose"></q-icon>
          <div>
            <img src="statics/images/congratulations.png" width="45%" class="margin-auto q-mb-md"/>
            <h6 class="font-normal q-my-none" style="line-height: 1.5em;">{{$t('the.sitter.is.member')}}</h6>
            <p class="text-grey-6 q-my-none">{{$t('you.may.reserve.this.backer')}}</p>
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
      if (this.$q.localStorage.has(`chat-membership-${this.$route.params.request}-${this.$route.params.response}`)) {
        let todayTime = new Date()
        let createdTime = new Date(this.$q.localStorage.getItem(`chat-${this.$route.params.request}-${this.$route.params.response}`).createdTime)
        createdTime.setMonth(createdTime.getMonth() + 2)

        // if created Time is more than 2 months from the date created, remove cache
        if (todayTime.getTime() > createdTime.getTime()) {
          this.$q.localStorage.remove(`chat-membership-${this.$route.params.request}-${this.$route.params.response}`)
        }
      } else {
        this.modal = true
        let currentDateTime = `${new Date().toISOString().slice(0, 10)}`
        this.$q.localStorage.set(`chat-membership-${this.$route.params.request}-${this.$route.params.response}`, {membership: true, createdTime: currentDateTime})
      }
    },
    onClose () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
