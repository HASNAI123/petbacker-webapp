<template>
  <q-card class="q-my-xs q-mx-xs q-py-sm clickable" @click.native="showDetailModal = true">
      <q-item v-if="reminderInfo">
          <q-item-section>
              <q-item-label class="font-normal text-weight-bold" lines="1">{{reminderName}}</q-item-label>
              <q-item-label lines="1">{{reminderInfo.title}}</q-item-label>
              <q-item-label caption lines="1">{{formatDate(reminderInfo.startDateTime)}}</q-item-label>
          </q-item-section>

          <q-item-section side>
              <q-icon name="chevron_right" />
          </q-item-section>
      </q-item>

      <!-- Dialog Reminder Card -->
      <dialog-reminderdetails v-if="reminder" :trigger="showDetailModal" :saveLoading="saveLoading" :prefilled="reminderInfo" @on-remove="onRemoveReminder" @on-close="closeDetailModal" @on-save="updateReminder"></dialog-reminderdetails>
  </q-card>
</template>
<script>
import moment from 'moment'

export default {
  components: {
    'dialog-reminderdetails': () => import('components/PetProfile/DialogReminderDetails.vue')
  },
  props: {
    reminder: {
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
      showDetailModal: false,
      reminderInfo: this.reminder,
      reminderName: null,
      showLoader: false,
      saveLoading: false
    }
  },
  created () {
    this.getName(this.reminder.type)
  },
  watch: {
    reminder (value) {
      console.log(value)
      this.reminderInfo = value
    }
  },
  methods: {
    getName (type) {
      switch (type) {
        case 1:
          this.reminderName = this.$t('vaccine')
          break
        case 2:
          this.reminderName = this.$t('birthday')
          break
        case 3:
          this.reminderName = this.$t('appointments')
          break
        case 4:
          this.reminderName = this.$t('other')
          break
        case 5:
          this.reminderName = this.$t('flea')
          break
      }
    },
    formatDate (date) {
      return moment(date).format('MMMM Do, YYYY')
    },
    closeDetailModal (status) {
      this.showDetailModal = status
    },
    saveReminder (reminderInfo) {
      // update reminder info
      this.$emit('update-reminder', this.index, reminderInfo)
      this.reminderInfo = reminderInfo
      this.getName(reminderInfo.type)
      this.closeDetailModal(false)
    },
    onRemoveReminder () {
      this.$emit('remove-reminder', this.index, this.reminder.id)
    },
    updateReminder (reminderInfo) {
      this.saveLoading = true
      this.$axios.put(`users/${this.$store.state.user.uuid}/personal-items/${this.$route.params.petId}/reminders/${this.reminder.id}`, JSON.stringify({remindersInfo: reminderInfo}), {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        // update reminder info
        this.$emit('update-reminder', this.index, reminderInfo)
        this.reminderInfo = reminderInfo
        this.getName(reminderInfo.type)
      }).catch(e => {
        console.error(e)
        if (e.response.data && e.response.data.message) {
          this.$q.dialog({
            title: this.$t('requests.error.title'),
            message: e.response.data.message
          })
        }
      }).finally(_ => {
        this.saveLoading = false
        this.closeDetailModal(false)
        this.$emit('refresh-reminders')
      })
    }
  }
}
</script>
<style lang="stylus">
.q-slide-item__right
  margin-top: 5px
  margin-bottom: 5px
  border-radius: 15px

.q-slide-item__content
  border-radius: 15px
</style>
