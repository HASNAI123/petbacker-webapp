<template>
  <q-page padding class="q-pb-xl" style="padding-bottom: 0px;" >
    <div class="row" style="max-width: 1030px;margin-left:auto; margin-right: auto;">

      <!-- Desktop -->
      <div class="row" v-if="$q.platform.is.desktop">
        <div class="col-md-5" v-if="requestInfo">
          <quote-detail :responseInfo="responseInfo" :priceInfo="priceInfo" :requestInfo="requestInfo" @refresh-price="getPriceInfo"></quote-detail>
        </div>
        <div class="col-md-7" v-if="messageInfo !== null && messageInfo.length > 0">
          <request-status :responseInfo="responseInfo" :priceInfo="priceInfo" :requestInfo="requestInfo" @get-response-info="getResponseInfo"></request-status>
          <chat-content class="gt-xs" :template="template" :responseInfo="responseInfo" :messageInfo="messageInfo" @sendMessage="getChatContents"></chat-content>
        </div>
      </div>

      <!-- Mobile -->
      <div class="col-xs-12 lt-lg" v-else-if="$q.platform.is.mobile || $q.platform.is.tablet">
        <request-status v-if="responseInfo" @close-quotemodal="triggerQuoteModal" :triggerQuoteDetails="openDetails" @refresh-price="getPriceInfo" :responseInfo="responseInfo" :priceInfo="priceInfo" :requestInfo="requestInfo" @get-response-info="getResponseInfo"></request-status>
        <chat-content-small ref="chat-small" @open-quote-details="triggerQuoteModal" :template="template" :responseInfo="responseInfo" :messageInfo="messageInfo" :priceInfo="priceInfo" @refresh-content="refreshChat" @sendMessage="getChatContents" @load-content="loadMoreContents"></chat-content-small>
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
      responseInfo: null,
      requestInfo: null,
      messageInfo: null,
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
      endOfPage: false,
      serverError: false,
      errorStatus: 0,
      errorMessage: ''
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
      if (this.$q.localStorage.getItem('messageTemplate')) {
        this.$q.localStorage.remove('messageTemplate')
        this.cacheMessageTemplate()
      }
    },
    langChange (newValue, oldValue) {
      if (this.$q.localStorage.getItem('messageTemplate')) {
        this.$q.localStorage.remove('messageTemplate')
        this.cacheMessageTemplate()
      }
    }
  },
  created () {
    this.getResponseInfoFromDb()
    this.getRequestInfo()
    this.getPriceInfo()

    if (this.$q.platform.is.cordova) {
      this.getChatContentsFromDb()
    } else {
      this.getChatContents()
    }

    // call API to cache message template
    if (this.$q.localStorage.has('messageTemplate') && this.$q.localStorage.getItem('messageTemplate').language !== this.langNameToId[this.$store.getters['user/getCurrentLanguage']]) {
      this.cacheMessageTemplate()
    } else if (!this.$q.localStorage.has('messageTemplate')) {
      this.cacheMessageTemplate()
    }

    this.$q.localStorage.set('expressCheckoutLinkSuccess', this.$route.fullPath) // used in EpressCheckout.vue
  },
  beforeDestroy () {
    clearTimeout(this.chatInterval)
    this.$emit('get-response-user-info', null)
  },
  methods: {
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
      this.getRequestInfo()
      this.getResponseInfo()
      this.getPriceInfo()
      this.getChatContents()
    },
    triggerQuoteModal (value) {
      this.openDetails = value
    },
    openQuoteModal (value) {
      this.openDetails = value
    },
    cacheMessageTemplate () {
      this.$axios.get(`/responsetemplates/requests?lang=${this.langToAPI(this.$store.getters['user/getCurrentLanguage'])}`)
        .then((response) => {
          this.$q.localStorage.set('messageTemplate', response.data.messageTemplateInfo)
          // this.$router.go()
        }).catch((error) => {
          console.error(error)
        })
    },
    getResponseInfoFromDb () {
      this.$store.dispatch('bookings/getOwnerBooking', {id: parseInt(this.$route.params.response)}).then((result) => {
        if (result.rows._array.length > 0) {
          let info = result.rows._array[0]
          this.responseInfo = {
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
            href: info.owner_href,
            serviceInfo: {
              userInfo: {
                id: info.sitter_uuid,
                avatarImage: info.avatarImage,
                username: info.username
              }
            },
            requestInfo: {
              id: this.$route.params.request,
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
            totalPrice: info.offer_amount,
            baseCurrencyId: info.offer_currency
          }
          this.$emit('get-response-user-info', this.responseInfo)
        }
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        this.getResponseInfo()
      })
    },
    getResponseInfo () {
      this.$axios.get('users/' + this.$store.state.user.uuid + '/requests/' + this.$route.params.request + '/responses/' + this.$route.params.response, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.responseInfo = response.data.responseInfo
        this.template = response.data.responseInfo.useTemplate
        this.$emit('get-response-user-info', this.responseInfo)

        this.$store.dispatch('bookings/insertBooking', {
          id: response.data.responseInfo.id,
          ownerHref: response.data.responseInfo.href,
          ownerUuid: this.$store.getters['user/getUserUuidState'],
          sitterHref: `/users/${response.data.responseInfo.serviceInfo.userInfo.id}/tasks/${response.data.responseInfo.id}`,
          sitterUuid: response.data.responseInfo.serviceInfo.userInfo.id,
          bookingRef: response.data.responseInfo.jobReference,
          offerCurrencyText: response.data.responseInfo.offerCurrencyText,
          offerCurrency: response.data.responseInfo.offerCurrency,
          offerAmount: response.data.responseInfo.offerAmount,
          acceptanceStatus: response.data.responseInfo.acceptanceStatus,
          bookStatus: response.data.responseInfo.bookStatus,
          completionStatus: response.data.responseInfo.completionStatus,
          ownerRating: response.data.responseInfo.userRating,
          sitterRating: response.data.responseInfo.applicantRating,
          serviceId: response.data.responseInfo.requestInfo.serviceId,
          petCount: response.data.responseInfo.requestInfo.petCount,
          requiredTime: response.data.responseInfo.requestInfo.requiredTime,
          duration: response.data.responseInfo.requestInfo.duration,
          unit: response.data.responseInfo.requestInfo.unit
        }).then((results) => {
          console.log('inserted:', results)
        })
      }).catch(error => {
        this.forceLogout(error)
        console.error(error)
      })
    },
    getPriceInfo () {
      this.$axios.get('users/' + this.$store.state.user.uuid + '/tasks/' + this.$route.params.response + '/checkprice', {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.priceInfo = response.data.priceInfo
      }).catch(error => {
        this.forceLogout(error)
        console.error(error)
      })
    },
    getRequestInfo () {
      this.$axios.get('users/' + this.$store.state.user.uuid + '/requests/' + this.$route.params.request, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.requestInfo = response.data.requestInfo
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
      this.$store.dispatch('chat/getRequestMessages', {requestId: parseInt(this.$route.params.request), responseId: parseInt(this.$route.params.response), pagination: (20 * pagination)}).then(async (result) => {
        let moreMessages = result.rows._array

        if (moreMessages.length === 0) {
          // cache no available, get new contents from api
          moreMessages = await this.loadMoreNewContents(pagination).catch((error) => {
            console.log('error', error)
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
        this.$axios.get(`users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}/messages?page=${pagination + 1}&per_page=20&v=6`, {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          // cache new data locally
          for (let message in response.data.messageInfo.items) {
            let messageInfo = response.data.messageInfo.items[message]
            messageInfo.responseId = this.$route.params.response
            messageInfo.requestId = this.$route.params.request

            if (messageInfo.contentType.toLowerCase() === 'title') {
              messageInfo.content = JSON.stringify(messageInfo.content)
            }

            this.$store.dispatch('chat/insertRequestMessages', messageInfo).then((result) => {
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
            reject(error.response.data.status)
          }
          reject(error)
        })
      })
    },
    getChatContentsFromDb () {
      this.$store.dispatch('chat/getRequestMessages', {requestId: parseInt(this.$route.params.request), responseId: parseInt(this.$route.params.response), pagination: 0}).then((result) => {
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
      //   // this.messageInfo.push(val)
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

      if (!this.$route.params.request || !this.$route.params.response) {
        return
      }

      this.$axios.get(`users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}/messages?page=1&per_page=20&v=6`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (this.$q.platform.is.cordova) {
          // just to match local cache with new info
          if (this.messageInfo && this.messageInfo.length > 0) {
            this.messageInfo[this.messageInfo.length - 1].responseId = this.$route.params.response
            this.messageInfo[this.messageInfo.length - 1].requestId = this.$route.params.request
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
                      requestId: this.$route.params.request,
                      responseId: this.$route.params.response
                    }
                  }
                }
              })
            }

            // cache new data locally
            for (let message in response.data.messageInfo.items) {
              let messageInfo = response.data.messageInfo.items[message]
              messageInfo.responseId = parseInt(this.$route.params.response)
              messageInfo.requestId = parseInt(this.$route.params.request)

              if (messageInfo.contentType.toLowerCase() === 'title') {
                messageInfo.content = JSON.stringify(messageInfo.content)
              }

              this.$store.dispatch('chat/insertMessageUser', messageInfo.userInfo)
              this.$store.dispatch('chat/insertRequestMessages', messageInfo)
            }

            console.log('new content available')
            this.refreshChatContent()
          }

          // check whether to refresh local cache
          if (this.$q.localStorage.has(`chat-version-${this.$route.params.request}-${this.$route.params.response}`) && response.data.hasOwnProperty('messageVersion')) {
            let localVersion = this.$q.localStorage.getItem(`chat-version-${this.$route.params.request}-${this.$route.params.response}`).version
            if (localVersion !== response.data.messageVersion) {
              this.$store.dispatch('chat/clear')
              console.info('chat cache hard refreshed!')
              this.$q.localStorage.set(`chat-version-${this.$route.params.request}-${this.$route.params.response}`, {version: response.data.messageVersion})
              this.refreshChatContent()
            }
          } else if (response.data.hasOwnProperty('messageVersion') && (this.$route.params.request && this.$route.params.response)) {
            this.$q.localStorage.set(`chat-version-${this.$route.params.request}-${this.$route.params.response}`, {version: response.data.messageVersion})
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
        if (!this.notified) {
          this.loadFail = true
        } else {
          this.endOfPage = true
          this.$refs['chat-small'].onPageEnd()
          console.log('empty content')
        }
        if (e.response && e.response.data) {
          this.triggerServerError(true, e.response.data.message, e.response.data.code)
        }
        this.forceLogout(e)
        console.error(e)
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
      this.$store.dispatch('chat/getRequestMessages', {requestId: parseInt(this.$route.params.request), responseId: parseInt(this.$route.params.response), pagination: 0}).then((result) => {
        result.rows._array = result.rows._array.reverse()
        let messages = []
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
          if (this.$refs['chat-small']) {
            this.$refs['chat-small'].resetPagination()
          }

          // scroll bottom
          if (document.documentElement.clientWidth < 558) {
            window.scrollTo(0, document.body.scrollHeight)
          }
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
