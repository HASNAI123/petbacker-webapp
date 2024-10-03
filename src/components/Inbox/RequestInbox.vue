<template>
    <div v-if="message">
        <q-item clickable :class="parseInt(message.read) === 0 || (showEdit && checkBoxSelection) ? 'unread-notification' : 'read-notification'" style="padding-left: 12px;" class="q-pt-md" @click="goToChat(message.requestInfo.id, message.requestInfo.taskId)">
            <q-item-section v-if="showEdit" thumbnail >
              <q-checkbox v-model="checkBoxSelection" :disable="message.requestInfo.acceptanceStatus === status.ACCEPTANCE_PARENT_ACCEPT && message.requestInfo.completionStatus === status.COMPLETION_NO_RESPONSE" @input="onEditSelected" class="q-ml-sm"></q-checkbox>
            </q-item-section>

            <!-- Avatar Image -->
            <q-item-section avatar>
              <q-avatar style="height: 55px; width: 55px;">
                <img v-if="message.userInfo" :src="message.userInfo.avatarImage" class="image-upload" :style="(showEdit && message.requestInfo.acceptanceStatus === status.ACCEPTANCE_PARENT_ACCEPT && message.requestInfo.completionStatus === status.COMPLETION_NO_RESPONSE) ? 'opacity: 0.5;' : ''"/>
              </q-avatar>
            </q-item-section>

            <!-- Content -->
            <q-item-section :style="(showEdit && message.requestInfo.acceptanceStatus === status.ACCEPTANCE_PARENT_ACCEPT && message.requestInfo.completionStatus === status.COMPLETION_NO_RESPONSE) ? 'opacity: 0.5;' : ''">
              <q-item-label ><strong>{{message.userInfo.username}}</strong></q-item-label>
              <q-item-label lines="1" caption>{{ message.content }}</q-item-label>
              <q-item-label>
                <template v-if="message.requestInfo.acceptanceStatus === status.ACCEPTANCE_NO_RESPONSE ||
                  message.requestInfo.acceptanceStatus === status.ACCEPTANCE_SITTER_ACCEPT">
                  <span class="text-warning"><b>{{ $t('requests.page.negotiation') }}</b></span>
                </template>
                <template v-else-if="message.requestInfo.acceptanceStatus === status.ACCEPTANCE_PARENT_REJECT ||
                  message.requestInfo.acceptanceStatus === status.ACCEPTANCE_PARENT_CANCEL_REQUEST ||
                  message.requestInfo.acceptanceStatus === status.ACCEPTANCE_PARENT_CANCEL_REQUEST_AFTER_BOOK">
                  <span class="text-negative"><b>{{ $t('inbox.message.status.you.declined') }}</b></span>
                </template>
                <template v-else-if="message.requestInfo.acceptanceStatus === status.ACCEPTANCE_SITTER_REJECT ||
                  message.requestInfo.acceptanceStatus === status.ACCEPTANCE_SITTER_REJECT_AFTER_BOOK">
                  <span class="text-negative"><b>{{ $t('inbox.message.status.declined') }}</b></span>
                </template>
                <template v-else-if="message.requestInfo.acceptanceStatus === status.ACCEPTANCE_PARENT_ACCEPT &&
                  message.requestInfo.completionStatus === status.COMPLETION_NO_RESPONSE">
                  <span class="text-info"><b>{{ $t('inbox.message.status.hired') }}</b></span>
                </template>
                <template v-else-if="message.requestInfo.acceptanceStatus === status.ACCEPTANCE_PARENT_ACCEPT &&
                  message.requestInfo.completionStatus === status.COMPLETION_PARENT_DEEMED_COMPLETE">
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
        <q-separator inset="item" />
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
    goToChat (requestId, responseId) {
      if (this.showEdit) {
        if (this.message.requestInfo.acceptanceStatus === this.status.ACCEPTANCE_PARENT_ACCEPT && this.message.requestInfo.completionStatus === this.status.COMPLETION_NO_RESPONSE) {
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

      this.$store.commit('user/decreaseUserUnreadMessageState')
      this.$router.push({name: 'Chat', params: {request: parseInt(requestId), response: parseInt(responseId)}})
    }
  }
}
</script>
