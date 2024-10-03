<template>
  <q-page padding class="q-pb-xl" style="padding-bottom: 0px;" :style="visibility ? '' : 'display: none;'">
    <div class="row" style="max-width: 1030px;margin-left:auto; margin-right: auto;">

      <!-- Desktop -->
      <div class="row" v-if="$q.platform.is.desktop">
        <div class="col-md-5 gt-xs">
          <quote-detail :responseInfo="taskInfo" :priceInfo="priceInfo" :requestInfo="requestInfo" @refresh-price="getPriceInfo"></quote-detail>
        </div>
        <div class="col-md-7">
          <request-status :responseInfo="taskInfo" :priceInfo="priceInfo" :requestInfo="requestInfo" @get-response-info="getTaskInfo"></request-status>
          <chat-content class="gt-xs" :template="template" :responseInfo="taskInfo" :messageInfo="messageInfo" @sendMessage="getChatContents"></chat-content>
        </div>
      </div>

      <!-- Mobile -->
      <div class="col-xs-12 lt-lg" v-else-if="$q.platform.is.mobile || $q.platform.is.tablet">
        <request-status v-if="taskInfo" @close-quotemodal="triggerQuoteModal" :triggerQuoteDetails="openDetails" @refresh-price="getPriceInfo" :responseInfo="taskInfo" :priceInfo="priceInfo" :requestInfo="requestInfo" @get-response-info="getTaskInfo"></request-status>
        <chat-content-small ref="chat-small" @open-quote-details="triggerQuoteModal" :template="template" :responseInfo="taskInfo" :messageInfo="messageInfo" @refresh-content="refreshChat" @sendMessage="getChatContents" @load-content="loadMoreContents"></chat-content-small>
      </div>
    </div>
    <!-- <div v-if="loadFail" class="row full-width">
      <div class="col-xs-12 text-center" style="border: 1px solid lightgrey;">
        <h4><b>{{ $t('message.not.found.contact.support') }}</b></h4>
        <q-btn label="Contact Now!" @click="$router.replace('/chat/support')"></q-btn>
      </div>
    </div> -->

    <!-- Error Dialog -->
    <dialog-error :trigger="serverError" :statusCode="errorStatus" :message="errorMessage" @on-close="triggerServerError"></dialog-error>
  </q-page>
</template>

<script>
/* global bugsnagClient */

export default {
  components: {
    'quote-detail': () => import('components/QuoteDetail.vue'),
    'request-status': () => import('components/RequestStatus.vue'),
    'chat-content': () => import('components/ChatContent.vue'),
    'chat-content-small': () => import('components/ChatContentSmall.vue'),
    'dialog-error': () => import('components/DialogError.vue')
  },
  data () {
    return {
      priceInfo: null,
      taskInfo: null,
      requestInfo: null,
      messageInfo: null,
      requestorInfo: null,
      chatInterval: null,
      template: 0,
      loadFail: false,
      notified: false,
      openDetails: false,
      langNameToId: {
        en: 1,
        zh_cn: 2,
        zh_tw: 7,
        thth: 8,
        frfr: 10
      },
      serverError: false,
      errorStatus: 0,
      errorMessage: '',
      visibility: true
    }
  },
  computed: {
    cachedVersion () {
      return this.$store.state.user.cachedVersion
    },
    langChange () {
      return this.$store.state.user.language
    }
  },
  watch: {
    // detect cached version change
    cachedVersion (newLang, oldLang) {
      console.log('Message Template Update!')
      // refresh cached message template
      if (this.$q.localStorage.getItem('messageTemplateJobs')) {
        this.$q.localStorage.remove('messageTemplateJobs')
        this.cacheMessageTemplate()
      }
    },
    langChange (newValue, oldValue) {
      if (this.$q.localStorage.getItem('messageTemplateJobs')) {
        this.$q.localStorage.remove('messageTemplateJobs')
        this.cacheMessageTemplate()
      }
    }
  },
  created () {
    this.getTaskInfoFromDb()
    this.getPriceInfo()

    // call API to cache message template
    if (this.$q.localStorage.has('messageTemplateJobs') && (this.$q.localStorage.getItem('messageTemplateJobs').language !== this.langNameToId[this.$store.getters['user/getCurrentLanguage']])) {
      this.cacheMessageTemplate()
    } else if (!this.$q.localStorage.has('messageTemplateJobs')) {
      this.cacheMessageTemplate()
    }

    if (this.$q.platform.is.cordova) {
      this.$root.$on('background-visibility', this.triggerBackgroundVisibility)
      this.getChatContentsFromDb()
    } else {
      this.getChatContents()
    }
  },
  beforeDestroy () {
    this.$root.$off('background-visibility', this.triggerBackgroundVisibility)
    clearTimeout(this.chatInterval)
    this.$emit('get-response-user-info', null)
  },
  methods: {
    triggerBackgroundVisibility (status) {
      this.visibility = status
    },
    triggerServerError (status, message = null, errorCode = null) {
      if (errorCode) {
        this.errorStatus = errorCode
      }

      if (message) {
        this.errorMessage = message
      }

      this.serverError = status
    },
    refreshChat () {
      clearTimeout(this.chatInterval)
      this.getTaskInfo()
      this.getPriceInfo()
      this.getChatContents()
    },
    triggerQuoteModal (value) {
      this.openDetails = value
    },
    cacheMessageTemplate () {
      this.$axios.get(`/responsetemplates/jobs?lang=${this.langToAPI(this.$store.getters['user/getCurrentLanguage'])}`)
        .then((response) => {
          this.$q.localStorage.set('messageTemplateJobs', response.data.messageTemplateInfo)
        }).catch((error) => {
          console.log(error)
        })
    },
    getPriceInfo () {
      this.$axios.get('users/' + this.$store.state.user.uuid + '/tasks/' + this.$route.params.taskId + '/quotes', {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.priceInfo = response.data.quotesInfo
      }).catch(error => {
        this.forceLogout(error)
        console.log(error)
      })
    },
    getTaskInfoFromDb () {
      this.$store.dispatch('bookings/getSitterBooking', {id: parseInt(this.$route.params.taskId)}).then((result) => {
        if (result.rows._array.length > 0) {
          let info = result.rows._array[0]
          this.taskInfo = {
            id: info.booking_id,
            jobReference: info.booking_reference,
            acceptanceStatus: info.acceptance_status,
            bookStatus: info.book_status,
            completionStatus: info.completion_status,
            applicantRating: info.sitter_rating,
            userRating: info.owner_rating,
            offerAmount: info.offer_amount,
            offerCurrency: info.offer_currency,
            offerCurrencyText: info.offer_currency_text,
            href: info.sitter_href,
            serviceInfo: {
              userInfo: {
                id: info.sitter_uuid,
                avatarImage: info.avatarImage,
                username: info.username
              }
            },
            requestInfo: {
              serviceId: info.service_id,
              petCount: info.pet_count,
              requiredTime: info.required_time,
              duration: info.duration,
              unit: info.unit,
              requestorInfo: {
                id: info.owner_uuid,
                mobileNum: 0
              }
            },
            whySeeingThis: '',
            whySeeingThisLink: ''
          }

          this.priceInfo = {
            items: [],
            totalAmount: info.offer_amount,
            currencyId: info.offer_currency
          }
          this.$emit('get-response-user-info', this.taskInfo)
        }
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        this.getTaskInfo()
      })
    },
    getTaskInfo () {
      this.$axios.get('users/' + this.$store.state.user.uuid + '/tasks/' + this.$route.params.taskId, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.taskInfo = response.data.taskInfo
        this.template = this.taskInfo.useTemplate
        this.requestInfo = this.taskInfo.requestInfo
        this.$emit('get-response-user-info', this.taskInfo)

        this.$store.dispatch('bookings/insertBooking', {
          id: parseInt(response.data.taskInfo.id),
          ownerHref: `/users/${response.data.taskInfo.requestInfo.requestorInfo.id}/request/${response.data.taskInfo.requestInfo.id}/responses/${parseInt(response.data.taskInfo.id)}`,
          ownerUuid: response.data.taskInfo.requestInfo.requestorInfo.id,
          sitterHref: response.data.taskInfo.href,
          sitterUuid: this.$store.getters['user/getUserUuidState'],
          bookingRef: response.data.taskInfo.jobReference,
          offerCurrencyText: response.data.taskInfo.offerCurrencyText,
          offerCurrency: response.data.taskInfo.offerCurrency,
          offerAmount: response.data.taskInfo.offerAmount,
          acceptanceStatus: response.data.taskInfo.acceptanceStatus,
          bookStatus: response.data.taskInfo.bookStatus,
          completionStatus: response.data.taskInfo.completionStatus,
          ownerRating: response.data.taskInfo.userRating,
          sitterRating: response.data.taskInfo.applicantRating,
          serviceId: response.data.taskInfo.requestInfo.serviceId,
          petCount: response.data.taskInfo.requestInfo.petCount,
          requiredTime: response.data.taskInfo.requestInfo.requiredTime,
          duration: response.data.taskInfo.requestInfo.duration,
          unit: response.data.taskInfo.requestInfo.unit
        }).then((results) => {
          console.log('inserted:', results)
        })
      }).catch(e => {
        this.forceLogout(e)
        console.error(e)
      })
    },
    loadMoreContents (pagination, done) {
      if (!this.$q.platform.is.cordova) {
        this.$refs['chat-small'].onPageEnd()
        done()
        return
      }

      if (this.endOfPage) {
        done()
        return
      }

      // loads local content first
      this.$store.dispatch('chat/getJobMessages', {taskId: parseInt(this.$route.params.taskId), pagination: (20 * pagination)}).then(async (result) => {
        console.log('lets check pagination', pagination)
        let moreMessages = result.rows._array

        if (moreMessages.length === 0) {
          // cache not available, get new contents from api
          moreMessages = await this.loadMoreNewContents(pagination).catch((error) => {
            if (error === 404) {
              done()
              return
            }
            console.error(error)
          })
        }

        // load cache content
        for (let index in moreMessages) {
          let message = moreMessages[index]
          let info = {
            'href': message.href,
            'id': message.message_id,
            'content': message.content,
            'contentType': message.contentType,
            'source': message.source,
            'read': message.read,
            'createdDate': message.createdDate,
            'userInfo': {
              'id': message.user_uuid,
              'avatarImage': message.avatarImage,
              'username': message.username
            }
          }
          this.messageInfo.unshift(info)
        }
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        done()
      })
    },
    // infinite load (only support on mobile apps)
    async loadMoreNewContents (pagination) {
      return new Promise((resolve, reject) => {
        this.$axios.get(`users/${this.$store.state.user.uuid}/tasks/${this.$route.params.taskId}/messages?page=${pagination + 1}&per_page=20&v=6`, {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          console.log('lets check the repsonse dat fro jobchat message', response)
          // cache new data locally
          for (let message in response.data.messageInfo.items) {
            let messageInfo = response.data.messageInfo.items[message]
            messageInfo.taskId = this.$route.params.taskId

            if (messageInfo.contentType.toLowerCase() === 'title') {
              messageInfo.content = JSON.stringify(messageInfo.content)
            }

            this.$store.dispatch('chat/insertJobMessages', messageInfo).then((result) => {
              //  console.log(result)
              //  info = info.concat(result.rows._array[0])
            }).catch((error) => {
              console.error(error)
              reject(error)
            })
          }
          resolve(response.data.messageInfo.items)
        }).catch((error) => {
          if (error.response && error.response.data.status === 404) {
            this.endOfPage = true
            this.$refs['chat-small'].onPageEnd()
            // resolve(error.response.data.status)
            resolve()
          } else {
            reject(error)
          }
        })
      })
    },
    getChatContentsFromDb () {
      console.log('get from db')
      this.$store.dispatch('chat/getJobMessages', {taskId: parseInt(this.$route.params.taskId), pagination: 0}).then((result) => {
        let messages = []
        if (result.rows.length > 0) {
          result.rows._array = result.rows._array.reverse()
        }

        for (let index in result.rows._array) {
          let message = result.rows._array[index]
          let info = {
            'href': message.href,
            'id': message.message_id,
            'content': message.content,
            'contentType': message.contentType,
            'source': message.source,
            'read': message.read,
            'createdDate': message.createdDate,
            'userInfo': {
              'id': message.user_uuid,
              'avatarImage': message.avatarImage,
              'username': message.username
            }
          }
          messages.push(info)
        }

        if (messages.length > 0) {
          this.messageInfo = messages
        } else {
          this.messageInfo = []
        }
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        // scroll bottom
        if (document.documentElement.clientWidth < 558) {
          window.scrollTo(0, document.body.scrollHeight)
        }

        this.getChatContents()
      })
    },
    getChatContents (val) {
      // if (val) {
      //   this.messageInfo.push(val)
      //   return
      // }
      // if (navigator.onLine === false) {
      //   if (this.notified === false) {
      //     let noInternet = this.$t('no.internet')
      //     this.$q.notify({
      //       message: noInternet
      //     })
      //     this.notified = true
      //   }
      //   return
      // } else if (navigator.onLine) {
      //   this.notified = false
      // }

      if (!this.$route.params.taskId) {
        return
      }

      this.$axios.get(`users/${this.$store.state.user.uuid}/tasks/${this.$route.params.taskId}/messages?page=1&per_page=20&v=6`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        console.log('check jobchat response', response)
        if (this.$q.platform.is.cordova) {
          // just to match local cache with new info
          if (this.messageInfo && this.messageInfo.length > 0) {
            this.messageInfo[this.messageInfo.length - 1].taskId = this.$route.params.taskId
           console.log('lets check deleted data', response.data.messageInfo)
            this.messageInfo[this.messageInfo.length - 1].userInfo.href = response.data.messageInfo.items[0].userInfo.href
          } else if (response.data.messageInfo.items === 0) {
            this.endOfPage = true
            return
          }

          if ((this.messageInfo.length === 0) || (response.data.messageInfo.items[0].id !== this.messageInfo[this.messageInfo.length - 1].id)) {
            if (response.data.messageInfo.items && response.data.messageInfo.items.length === 0) {
              console.log('messageInfo: ' + response.data.messageInfo.items)
              bugsnagClient.notify(new Error('Empty Message Content!'), {
                beforeSend: function (report) {
                  report.metaData = {
                    accountInfo: {
                      uuid: this.$store.getters['user/getUserUuidState'],
                      taskId: this.$route.params.taskId
                    }
                  }
                }
              })
            }

            // cache new data locally
            for (let message in response.data.messageInfo.items) {
              let messageInfo = response.data.messageInfo.items[message]
              messageInfo.taskId = parseInt(this.$route.params.taskId)

              if (messageInfo.contentType.toLowerCase() === 'title') {
                messageInfo.content = JSON.stringify(messageInfo.content)
              }

              this.$store.dispatch('chat/insertMessageUser', messageInfo.userInfo)
              this.$store.dispatch('chat/insertJobMessages', messageInfo)
            }

            console.log('new content available')
            this.refreshChatContent()
          }

          // check whether to refresh local cache
          if (this.$q.localStorage.has(`chat-version-${this.$route.params.taskId}`) && response.data.hasOwnProperty('messageVersion')) {
            let localVersion = this.$q.localStorage.getItem(`chat-version-${this.$route.params.taskId}`).version
            if (localVersion !== response.data.messageVersion) {
              this.$store.dispatch('chat/clear')
              console.info('chat cache hard refreshed!')
              this.$q.localStorage.set(`chat-version-${this.$route.params.taskId}`, {version: response.data.messageVersion})
              this.refreshChatContent()
            }
          } else if (response.data.hasOwnProperty('messageVersion') && (this.$route.params.taskId)) {
            this.$q.localStorage.set(`chat-version-${this.$route.params.taskId}`, {version: response.data.messageVersion})
          }
        } else {
          this.messageInfo = response.data.messageInfo.items
          let clientWidth = document.documentElement.clientWidth
          if (clientWidth < 768) {
            this.messageInfo = this.messageInfo.reverse()
          } else {
            this.messageInfo = this.messageInfo
          }
        }

        // check whether use template
        this.template = response.data.useTemplate

        // dynamically set intervals
        this.chatInterval = setTimeout(this.getChatContents, Math.floor(Math.random() * 8) * 1000)
      }).catch(e => {
        clearTimeout(this.chatInterval)
        this.endOfPage = true
        this.$refs['chat-small'].onPageEnd()
        console.log('empty content')
        if (e.response && e.response.data) {
          this.triggerServerError(true, e.response.data.message, e.response.data.code)
        }
        this.forceLogout(e)
        console.log(e)
        let lang = this.$store.getters['user/getCurrentLanguage']
        let errorThrow = e
        bugsnagClient.notify(new Error('Message Not Found!'), {
          beforeSend: function (report) {
            report.metaData = {
              accountInfo: {
                language: lang,
                error: errorThrow
              }
            }
          }
        })
      })
    },
    refreshChatContent () {
      this.$store.dispatch('chat/getJobMessages', {taskId: parseInt(this.$route.params.taskId), pagination: 0}).then((result) => {
        result.rows._array = result.rows._array.reverse()
        let messages = []

        for (let index in result.rows._array) {
          let message = result.rows._array[index]
          console.log('check this main message creation', message)
          let info = {
            'href': message.href,
            'id': message.message_id,
            'content': message.content,
            'contentType': message.contentType,
            'source': message.source,
            'read': message.read,
            'createdDate': message.createdDate,
            'userInfo': {
              'id': message.user_uuid,
              'avatarImage': message.avatarImage,
              'username': message.username
            }
          }
          messages.push(info)
        }
        if (messages.length > 0) {
          this.messageInfo = messages
          if (this.$refs['chat-small']) {
            this.$refs['chat-small'].resetPagination()
          }

          // scroll bottom
          /*  if (document.documentElement.clientWidth < 558) {
            window.scrollTo(0, document.body.scrollHeight)
          } */
        }
      }).catch((error) => {
        console.error(error)
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.container
  width: 1032px
  max-width: 1500px

@media only screen and (max-width: 600px)
  .quote-visible
    display: none
</style>
