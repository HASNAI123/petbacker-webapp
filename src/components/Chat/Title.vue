<template>
    <div class="text-weight-bold q-my-none font-normal text-accent q-mx-sm">
        <q-card flat :bordered="visibilityStatus()" v-if="contentInfo.okBtn || contentInfo.cancelBtn" style="border-radius: 11px;">
            <!-- Text/Image content with buttons -->
            <!-- Image -->
            <q-img v-if="contentInfo.image && contentInfo.image !== ''" :src="contentInfo.image" width="86%" style="border-radius: 11px;max-height: 155px;" basic/>

            <!-- Content -->
            <q-card-section :class="{'q-pb-none': !visibilityStatus()}" v-if="(contentInfo.title && contentInfo.title !== '') || (contentInfo.subtitle && contentInfo.subtitle !== '')">
                <h6 class="font-normal q-my-none" v-if="contentInfo.title && contentInfo.title !== ''">{{contentInfo.title}}</h6>
                <p class="q-my-none text-weight-medium font-small text-grey-6" v-if="contentInfo.subtitle && contentInfo.subtitle !== ''">{{contentInfo.subtitle}}</p>
            </q-card-section>

            <!-- Buttons -->
            <q-card-actions align="center" class="q-pt-none" v-if="visibilityStatus() && displayButtons">
                <!-- Cancel Button -->
                <q-btn class="col-4" outline color="primary" :loading="cancelLoader" v-if="contentInfo.cancelBtn && ((contentInfo.cancelBtn.action.target === DISPLAY_SITTER && $route.name === 'JobChat') || (contentInfo.cancelBtn.action.target === DISPLAY_OWNER && $route.name === 'Chat'))"
                :label="contentInfo.cancelBtn.label" style="border-radius: 11px;" @click="onAction(contentInfo.cancelBtn.action, 'cancel-btn')"></q-btn>
                <!-- Okay Button -->
                <q-btn class="col" color="primary" :loading="okLoader" v-if="contentInfo.okBtn && ((contentInfo.okBtn.action.target === DISPLAY_SITTER && $route.name === 'JobChat') || (contentInfo.okBtn.action.target === DISPLAY_OWNER && $route.name === 'Chat'))"
                :label="contentInfo.okBtn.label" style="border-radius: 11px;" @click="onAction(contentInfo.okBtn.action, 'ok-btn')"></q-btn>
            </q-card-actions>
        </q-card>
        <div v-else @click="onAction(contentInfo.action)">
            <!-- Image -->
            <q-img v-if="contentInfo.image && contentInfo.image !== ''" :src="contentInfo.image" style="border-radius: 11px;max-height: 155px;" basic/>

            <!-- Basic Text Content -->
            <h6 class="font-normal q-my-none" v-if="contentInfo.title && contentInfo.title !== ''">{{contentInfo.title}} <span v-if="contentInfo.offerCurrency">{{contentInfo.offerCurrency}} {{contentInfo.offerAmount}}</span></h6>
            <p class="q-my-none text-weight-medium font-small text-grey-6" v-if="contentInfo.subtitle && contentInfo.subtitle !== ''">{{contentInfo.subtitle}}</p>
        </div>

        <!-- Time Stamp -->
        <span class="text-weight-light" style="font-size: 12px">{{timeStamp}}</span>
    </div>
</template>
<script>
export default {
  props: {
    messageId: {
      required: true
    },
    contentInfo: {
      required: true,
      type: Object
    },
    timeStamp: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      DISPLAY_SITTER: 1,
      DISPLAY_OWNER: 2,
      okLoader: false,
      cancelLoader: false,
      displayButtons: true
    }
  },
  created () {
    if (parseInt(this.contentInfo.status) === 1) {
      this.displayButtons = false
    }
  },
  methods: {
    visibilityStatus () {
      // check if hide is necessary for owner view
      if (this.contentInfo.okBtn.action.target === this.DISPLAY_SITTER && this.contentInfo.cancelBtn.action.target === this.DISPLAY_SITTER && this.$route.name === 'Chat') {
        return false
      }

      // check if hide is necessary for sitter view
      if (this.contentInfo.okBtn.action.target === this.DISPLAY_OWNER && this.contentInfo.cancelBtn.action.target === this.DISPLAY_OWNER && this.$route.name === 'JobChat') {
        return false
      }

      // hide button on action done
      if (parseInt(this.contentInfo.status) === 1) {
        this.displayButtons = false
        return false
      }

      return true
    },
    onAction (actionInfo = null, elementRef) {
      if (!actionInfo) {
        return
      }

      if (elementRef === 'ok-btn') {
        this.okLoader = true
      } else {
        this.cancelLoader = true
      }

      switch (actionInfo.type) {
        case 1: this.openUrl(this.$route.name === 'Chat' ? actionInfo.urls.owner : actionInfo.urls.sitter); break
        case 2: this.onGetRequest(this.$route.name === 'Chat' ? actionInfo.urls.owner : actionInfo.urls.sitter); break
        case 3: this.onPutRequest(this.$route.name === 'Chat' ? actionInfo.urls.owner : actionInfo.urls.sitter); break
      }
    },
    onGetRequest (requestUrl = null) {
      if (!requestUrl) {
        this.okLoader = false
        this.cancelLoader = false
        return
      }

      this.$axios.get(requestUrl, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        // update local db to title status to 1 (done)
        if (this.$route.name === 'JobChat') {
          this.contentInfo['status'] = 1
          let messageInfo = {
            'taskId': this.$route.params.taskId,
            'messageInfo': {
              'id': this.messageId,
              'content': this.contentInfo,
              'read': 1
            }
          }

          this.$store.dispatch('chat/updateJobMessage', messageInfo)
          this.displayButtons = false
        }
      }).catch((error) => {
        console.error(error)
        // show error message when necessary
      }).finally(_ => {
        this.okLoader = false
        this.cancelLoader = false
      })
    },
    onPutRequest (requestUrl = null) {
      if (!requestUrl) {
        this.okLoader = false
        this.cancelLoader = false
        return
      }

      this.$axios.put(requestUrl, null, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        // update local db to title status to 1 (done)
        if (this.$route.name === 'JobChat') {
          this.contentInfo['status'] = 1
          let messageInfo = {
            'taskId': this.$route.params.taskId,
            'messageInfo': {
              'id': this.messageId,
              'content': this.contentInfo,
              'read': 1
            }
          }

          this.$store.dispatch('chat/updateJobMessage', messageInfo)
          this.displayButtons = false
        }
      }).catch((error) => {
        console.error(error)
        // show error message when necessary
      }).finally(_ => {
        this.okLoader = false
        this.cancelLoader = false
      })
    }
  }
}
</script>
