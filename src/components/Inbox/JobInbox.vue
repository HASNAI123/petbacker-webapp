<template>
    <div v-if="message">
        <q-item clickable :class="parseInt(message.read) === 0 || (showEdit && checkBoxSelection) ? 'unread-notification' : 'read-notification'" style="padding-left: 12px;" class="q-pt-md" @click="goToChat(message.taskInfo.id)">
            <q-item-section v-if="showEdit" thumbnail >
              <q-checkbox v-model="checkBoxSelection" :disable="message.taskInfo.acceptanceStatus === status.ACCEPTANCE_PARENT_ACCEPT && message.taskInfo.completionStatus === status.COMPLETION_NO_RESPONSE" @input="onEditSelected" class="q-ml-sm"></q-checkbox>
            </q-item-section>

            <!-- Avatar -->
            <q-item-section avatar>
              <q-avatar style="height: 55px; width: 55px;">
                <img :src="message.userInfo.avatarImage" :style="(showEdit && message.taskInfo.acceptanceStatus === status.ACCEPTANCE_PARENT_ACCEPT && message.taskInfo.completionStatus === status.COMPLETION_NO_RESPONSE) ? 'opacity: 0.5;' : ''" class="image-upload"/>
              </q-avatar>
            </q-item-section>

            <!-- Content -->
            <q-item-section :style="(showEdit && message.taskInfo.acceptanceStatus === status.ACCEPTANCE_PARENT_ACCEPT && message.taskInfo.completionStatus === status.COMPLETION_NO_RESPONSE) ? 'opacity: 0.5;' : ''">
              <q-item-label><strong>{{message.userInfo.username}}</strong></q-item-label>
              <q-item-label lines="1" caption>{{ message.content }}</q-item-label>
              <q-item-label>
                <template v-if="message.taskInfo.acceptanceStatus === status.ACCEPTANCE_NO_RESPONSE ||
                  message.taskInfo.acceptanceStatus === status.ACCEPTANCE_SITTER_ACCEPT">
                  <span class="text-warning"><b>{{ $t('requests.page.negotiation') }}</b></span>
                </template>
                <template v-else-if="message.taskInfo.acceptanceStatus === status.ACCEPTANCE_PARENT_REJECT ||
                  message.taskInfo.acceptanceStatus === status.ACCEPTANCE_PARENT_CANCEL_REQUEST ||
                  message.taskInfo.acceptanceStatus === status.ACCEPTANCE_PARENT_CANCEL_AFTER_BOOK">
                  <span class="text-negative"><b>{{ $t('no.more') }}</b></span>
                </template>
                <template v-else-if="message.taskInfo.acceptanceStatus === status.ACCEPTANCE_SITTER_REJECT ||
                  message.taskInfo.acceptanceStatus === status.ACCEPTANCE_SITTER_REJECT_AFTER_BOOK">
                  <span class="text-negative"><b>{{ $t('inbox.message.status.you.declined') }}</b></span>
                </template>
                <template v-else-if="message.taskInfo.acceptanceStatus === status.ACCEPTANCE_PARENT_ACCEPT &&
                  message.taskInfo.completionStatus === status.COMPLETION_NO_RESPONSE">
                  <span class="text-info"><b>{{ $t('inbox.message.status.hired') }}</b></span>
                </template>
                <template v-else-if="message.taskInfo.acceptanceStatus === status.ACCEPTANCE_PARENT_ACCEPT &&
                  message.taskInfo.completionStatus === status.COMPLETION_PARENT_DEEMED_COMPLETE">
                  <span class="text-positive"><b>{{ $t('inbox.message.status.completed') }}</b></span>
                </template>
                <template v-else>
                  <span class="text-negative"><b>{{ $t('inbox.message.status.incomplete') }}</b></span>
                </template>
              </q-item-label>
            </q-item-section>

            <!-- Last Message Time -->
            <q-item-section side top>
              <q-item-label caption>{{parseHumanReadableDate(message.createdDate)}}</q-item-label>
            </q-item-section>
        </q-item>
        <q-separator inset="item"/>
    </div>
</template>
<script>
import requestStatus from 'assets/request-status.json'
import moment from 'moment'
export default {
  props: {
    message: {
      required: true,
      type: Object
    },
    showEdit: {
      required: true,
      type: Boolean,
      default: false
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      status: requestStatus,
      checkBoxSelection: false
    }
  },
  watch: {
    showEdit (status) {
      if (status === false) {
        this.checkBoxSelection = false
      }
    }
  },
  methods: {
    parseHumanReadableDate (date) {
      return moment(date).fromNow()
    },
    onEditSelected (status) {
      if (status) {
        this.$emit('on-selected', this.message.id, this.index)
      } else {
        this.$emit('on-deselected', this.message.id, this.index)
      }
    },
    goToChat (responseId) {
      if (this.showEdit) {
        if (this.message.taskInfo.acceptanceStatus === this.status.ACCEPTANCE_PARENT_ACCEPT && this.message.taskInfo.completionStatus === this.status.COMPLETION_NO_RESPONSE) {
          return
        }

        this.checkBoxSelection = !this.checkBoxSelection
        this.onEditSelected(this.checkBoxSelection)
        return
      }

      // emit event only when read status changes
      if (parseInt(this.message.read) === 0) {
        this.$emit('on-read', this.index)
      }

      this.$store.commit('user/decreaseUserUnreadJobState')
      this.$router.push({name: 'JobChat', params: {taskId: responseId}})
    }
  }
}
</script>
