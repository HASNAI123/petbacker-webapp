/* eslint no-useless-escape: "off" */
/* eslint-disable no-eval */
/* eslint-disable quotes */
import moment from 'moment'
import ImageTools from 'assets/ImageTools'

export default {
  data () {
    return {
      mediatype: null,
      imageData: [],
      messages: [],
      galleryImages: [],
      imageLink: null,
      messageBox: null,
      modalImageGallery: false,
      MIN_WINDOW_WIDTH: 558,
      pictureUploading: false,
      USER_PETBACKER_ID: 'f2790e1e-98d7-11e6-9df5-42010af00a14',
      SUPPORT_CATEGORY: {
        BOOKING_CANCELLATION: 2,
        PAYMENT: 3,
        PET_URGENCY: 4,
        ACCOUNT: 5,
        SUGGESTION_BUGS: 6,
        OTHERS: 7
      }
    }
  },
  methods: {
    parseReadableDate (date, type) {
      if (type === 'date') {
        return moment(date).format('LL')
      } else if (type === 'time') {
        return moment(date).format('LT')
      } else if (type === 'date-time') {
        let dateFormat = moment(date).format('LL').split(', ')
        let timeFormat = moment(date).format('LT')
        return dateFormat[0] + ', ' + timeFormat
      } else if (!type) {
        return 'Type not specified'
      }

      return 'ERROR, check function!'
    },
    isEmptyOrSpaces (str) {
      return str === null || str.match(/^ *$/) !== null
    },
    linkifyText (message) {
      let filteredText = ''
      let replacePattern1 = /\bhttps?:\/\/\S+/gi
      let replacePatternText = message.content.match(replacePattern1)

      // Replace newline chars with <br> tag
      let messageContent = message.content.replace(/\n/g, '<br/>')

      // Only shows username of the other person chatting
      if (message.userInfo.id !== this.$store.state.user.uuid) {
        // If user is PETBACKER, we don't allow the name to be clickable
        if (message.userInfo.id === this.USER_PETBACKER_ID) {
          // filteredText = `
          // <div>
          //   <strong><a href="${this.responseServiceInfo.listingUrl ? this.responseServiceInfo.listingUrl.replace(/#_ga/g, '&_ga') : '#'}'" class="text-dark">
          //   [${message.userInfo.username}]</a></strong>
          //   ${messageContent.replace(replacePattern1, '<a href="' + replacePatternText + '" style="word-break:break-all;">' + replacePatternText + '</a>')}
          // </div>`
          filteredText = `${messageContent.replace(replacePattern1, '<a href="' + replacePatternText + '" style="word-break:break-all;">' + replacePatternText + '</a>')}`
        } else {
          // filteredText = `
          // <div>
          //   <strong><a href="${this.responseServiceInfo.listingUrl ? this.responseServiceInfo.listingUrl.replace(/#_ga/g, '&_ga') : '#'}'" class="text-dark">
          //   [${message.userInfo.username}]</a></strong>
          //   ${messageContent.replace(replacePattern1, '<a href="' + replacePatternText + '" style="word-break:break-all;">' + replacePatternText + '</a>')}
          // </div>`
          filteredText = `${messageContent.replace(replacePattern1, '<a href="' + replacePatternText + '" style="word-break:break-all;">' + replacePatternText + '</a>')}`
        }
      } else {
        // filteredText = messageContent.replace(replacePattern1, '<a href="' + replacePatternText + '" style="word-break:break-all;">' + replacePatternText + '</a>') + '</div>'
        var urlRegex = /(https?:\/\/[^\s]+)/gi
        filteredText = messageContent.replace(urlRegex, function (url) {
          return '<a href="' + url + '">' + url + '</a>'
        })
      }

      // URLs starting with http://, https://, or ftp://
      return filteredText
    },
    linkifySupportText (message) {
      let filteredText = ''
      if (!message.content) {
        return '...'
      }
      let replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim

      let messageContent = message.content.replace(/\n/g, '<br />')
      // Only shows username of the other person chatting
      if (message.userInfo.id !== this.$store.state.user.uuid) {
        filteredText = `
        <div>
            <strong>[${message.userInfo.username}]</strong>
            ${messageContent.replace(replacePattern1, '<a href="$1" target="_blank" style="word-break:break-all;">$1</a>')}
        </div>`
      } else {
        filteredText = messageContent.replace(replacePattern1, '<a href="$1" target="_blank" style="word-break:break-all;">$1</a>') + '</div>'
      }

      // URLs starting with http://, https://, or ftp://
      return filteredText
    },
    async sendMessage (loading, ticketId = 0, messageArray = [], meta = {}) {
      if (this.responeInfo && (this.responseInfo.acceptanceStatus === 2 || this.responseInfo.acceptanceStatus === 4 || this.responseInfo.acceptanceStatus === 5)) {
        this.$q.notify({
          message: this.$t('message.send.error.close'),
          type: 'negative'
        })
        return
      }

      if (this.$route.params.ticketId) {
        ticketId = this.$route.params.ticketId
      }

      let newMessageInfo = {
        'messageInfo': {
          'content': messageArray.length !== 0 ? messageArray : this.messageBox,
          'source': this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5,
          'contentType': 'text'
        }
      }

      let apiLink = `users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}/messages`

      switch (this.$route.name) {
        case 'ChatSupport': apiLink = `users/${this.$store.state.user.uuid}/support?ticket_id=${ticketId}`; break
        case 'Chat': apiLink = `users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}/messages`; break
        case 'JobChat': apiLink = `users/${this.$store.state.user.uuid}/tasks/${this.$route.params.taskId}/messages`; break
      }

      if (meta.apiLink) {
        apiLink = meta.apiLink
        this.resendTitle = 'resend||' + apiLink
      }
      if (messageArray.length === 0) {
        this.messageBox = null
      }
      await this.$axios.post(apiLink, newMessageInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        console.log('check jobchata response', response)
        // check whether to refresh local cache
        switch (this.$route.name) {
          case 'Chat':
            if (this.$q.localStorage.has(`chat-version-${this.$route.params.request}-${this.$route.params.response}`) && response.data.hasOwnProperty('messageVersion')) {
              let localVersion = this.$q.localStorage.getItem(`chat-version-${this.$route.params.request}-${this.$route.params.response}`).version
              if (localVersion !== response.data.messageVersion) {
                this.$store.dispatch('chat/clear')
                console.info('chat cache hard refreshed!')
                this.$q.localStorage.set(`chat-version-${this.$route.params.request}-${this.$route.params.response}`, {version: response.data.messageVersion})
              }
            } else if (response.data.hasOwnProperty('messageVersion') && (this.$route.params.request && this.$route.params.response)) {
              this.$q.localStorage.set(`chat-version-${this.$route.params.request}-${this.$route.params.response}`, {version: response.data.messageVersion})
            }
            break
          case 'JobChat':
            if (this.$q.localStorage.has(`chat-version-${this.$route.params.taskId}`) && response.data.hasOwnProperty('messageVersion')) {
              let localVersion = this.$q.localStorage.getItem(`chat-version-${this.$route.params.taskId}`).version
              if (localVersion !== response.data.messageVersion) {
                this.$store.dispatch('chat/clear')
                console.info('chat cache hard refreshed!')
                this.$q.localStorage.set(`chat-version-${this.$route.params.taskId}`, {version: response.data.messageVersion})
              }
            } else if (response.data.hasOwnProperty('messageVersion') && (this.$route.params.taskId)) {
              this.$q.localStorage.set(`chat-version-${this.$route.params.taskId}`, {version: response.data.messageVersion})
            }
            break
        }
        // this.$emit('sendMessage', response.data.messageInfo)
        this.$emit('sendMessage')
      }).catch(e => {
        // alert(e.response.data.status)
        var failedMessages = {failedMessages: []}

        // undefined means not sent to server due to network issue and for cache the chat
        if (e.response === undefined || e.response === 'undefined' || e.response.data.status !== 404) {
          if (this.$q.localStorage.getItem(this.resendTitle)) {
            failedMessages = this.$q.localStorage.getItem(this.resendTitle)
          }
          if (Array.isArray(newMessageInfo.messageInfo.content)) {
            for (let index = 0; index < newMessageInfo.messageInfo.content.length; index++) {
              const msg = newMessageInfo.messageInfo.content[index]
              failedMessages.failedMessages.push(msg)
            }
          } else {
            failedMessages.failedMessages.push(newMessageInfo.messageInfo.content)
          }
          this.$q.localStorage.set(this.resendTitle, failedMessages)
          /* switch (this.$route.name) {
            case 'Chat':
              if (this.$q.localStorage.getItem(`resend-${this.$route.params.request}-${this.$route.params.response}`)) {
                failedMessages = this.$q.localStorage.getItem(`resend-${this.$route.params.request}-${this.$route.params.response}`)
              }
              if (Array.isArray(newMessageInfo.messageInfo.content)) {
                for (let index = 0; index < newMessageInfo.messageInfo.content.length; index++) {
                  const msg = newMessageInfo.messageInfo.content[index]
                  failedMessages.failedMessages.push(msg)
                }
              } else {
                failedMessages.failedMessages.push(newMessageInfo.messageInfo.content)
              }
              this.$q.localStorage.set(`resend-${this.$route.params.request}-${this.$route.params.response}`, failedMessages)
              break
            case 'JobChat':
              if (this.$q.localStorage.getItem(`resend-${this.$route.params.taskId}-${this.$store.state.user.uuid}`)) {
                failedMessages = this.$q.localStorage.getItem(`resend-${this.$route.params.taskId}-${this.$store.state.user.uuid}`)
              }
              if (Array.isArray(newMessageInfo.messageInfo.content)) {
                for (let index = 0; index < newMessageInfo.messageInfo.content.length; index++) {
                  const msg = newMessageInfo.messageInfo.content[index]
                  failedMessages.failedMessages.push(msg)
                }
              } else {
                failedMessages.failedMessages.push(newMessageInfo.messageInfo.content)
              }
              this.$q.localStorage.set(`resend-${this.$route.params.taskId}-${this.$store.state.user.uuid}`, failedMessages)
              break
          } */
        } else {
          this.$q.localStorage.set(this.resendTitle, failedMessages)
        }
        setTimeout(() => {
          this.pictureUploading = false
        }, 2200)
        console.log(e)
        this.$q.notify({
          message: e.response.data.message,
          type: 'negative'
        })
        this.$emit('network-error')
      })
    },
    sendSupportMessage (ticketId = 0) {
      if (!this.messageBox) {
        return
      }

      let newMessageInfo = JSON.stringify({
        'messageInfo': {
          'content': this.messageBox,
          'source': this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5,
          'contentType': 'text'
        }
      })
      let newChatContent = JSON.stringify({
        'content': this.messageBox,
        'source': this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5,
        'contentType': 'text',
        'createdDate': moment(),
        'userInfo': {
          'id': this.$store.state.user.uuid
        }
      })

      this.messageBox = null

      if (this.$route.params.ticketId) {
        ticketId = this.$route.params.ticketId
      }

      if (document.documentElement.clientWidth < this.MIN_WINDOW_WIDTH) {
        this.messages.push(JSON.parse(newChatContent))
      } else {
        this.messages.unshift(JSON.parse(newChatContent))
      }

      this.$axios.post(`users/${this.$store.state.user.uuid}/support?ticket_id=${ticketId}`, newMessageInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$emit('sendMessage')
      }).catch(e => {
        console.log(e)
        this.$q.notify({
          message: this.$t('message.send.error.unexpected'),
          type: 'negative'
        })
      })
    },
    sendAdminMessage () {
      if (!this.messageBox) {
        return
      }

      let newMessageInfo = JSON.stringify({
        'messageInfo': {
          'content': this.messageBox,
          'source': this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5,
          'contentType': 'text'
        }
      })
      let newChatContent = JSON.stringify({
        'content': this.messageBox,
        'source': this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5,
        'contentType': 'text',
        'createdDate': moment(),
        'userInfo': {
          'id': this.$store.state.user.uuid
        }
      })

      this.messageBox = null

      if (document.documentElement.clientWidth < this.MIN_WINDOW_WIDTH) {
        this.messages.push(JSON.parse(newChatContent))
      } else {
        this.messages.unshift(JSON.parse(newChatContent))
      }

      this.$axios.post(`/users/${this.$store.state.user.uuid}/support/${this.$route.params.userId}`, newMessageInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$emit('sendMessage')
      }).catch(e => {
        console.log(e)
        this.$q.notify({
          message: this.$t('message.send.error.unexpected'),
          type: 'negative'
        })
      })
    },
    sendTicket (categoryId, subject = null, description = null, languageId = 1) {
      let payload = {
        'ticketInfo': {
          'uuid': this.$store.state.user.uuid,
          'subject': subject,
          'description': description,
          'categoryId': categoryId,
          'languageId': languageId,
          'source': this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5
        }
      }

      this.$axios.post(`helpdesk-tickets`, payload, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).catch(error => {
        this.forceLogout(error)
        console.log(error)
      })
    },
    sendImage (isSupport, ticketId = 0) {
      let newImageInfo = JSON.stringify({
        'messageInfo': {
          'content': this.imageLink,
          'source': this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5,
          'contentType': this.mediatype[0]
        }
      })

      console.log('check imagelink', this.imageLink)
      this.imageLink = null

      if (this.$route.params.ticketId) {
        ticketId = this.$route.params.ticketId
      }

      let apiLink = `users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}/messages`

      switch (this.$route.name) {
        case 'ChatSupport': apiLink = `users/${this.$store.state.user.uuid}/support?ticket_id=${ticketId}`; break
        case 'ChatSupportEnquiry': apiLink = `users/${this.$store.state.user.uuid}/support?ticket_id=${ticketId}`; break
        case 'ChatAdmin': apiLink = `users/${this.$store.state.user.uuid}/support/${this.$route.params.userId}`; break
        case 'Chat': apiLink = `users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}/messages`; break
        case 'JobChat': apiLink = `users/${this.$store.state.user.uuid}/tasks/${this.$route.params.taskId}/messages`; break
      }

      if (isSupport) {
        apiLink = `users/${this.$store.state.user.uuid}/support?ticket_id=${ticketId}`
      }

      this.$axios.post(apiLink, newImageInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        let newImageContent = JSON.stringify({
          'content': response.data.messageInfo.content,
          'source': this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5,
          'contentType': this.mediatype[0],
          'createdDate': moment(),
          'userInfo': {
            'id': this.$store.state.user.uuid
          }
        })

        if (document.documentElement.clientWidth < this.MIN_WINDOW_WIDTH) {
          this.messages.push(JSON.parse(newImageContent))
        } else {
          this.messages.unshift(JSON.parse(newImageContent))
        }

        this.$emit('sendMessage')
        setTimeout(() => {
          this.scrollToBottom()
        }, 100)
      }).catch(e => {
        console.log(e)
        this.$q.notify({
          message: `An error occurred sending image`,
          type: 'negative'
        })
      })
    },
    uploadImageData (imageBlobData) {
      let vm = this
      this.pictureUploading = true
      let formData = new FormData()
      this.mediatype = imageBlobData.type.split('/')
      console.log('check the mediatype', this.mediatype[0])
      if (this.mediatype[0] === 'image') {
        console.log('its an image')
        formData.append('imagefile', imageBlobData, 'image.jpg')
        vm.$axios.post('imageupload', formData)
          .then((response) => {
            console.log('check response', response)
            if (this.mediatype[0] === 'video') {
              console.log('thats the setting done for video')
              vm.imageLink = response.data.videoPath
            }
            if (this.mediatype[0] === 'image') {
              console.log('thats the setting done image')
              console.log('check the imagename going', response.data.imageName)
              vm.imageLink = response.data.imageName
              console.log('check the vm.imagelink for image', vm.imageLink)
            }
            if (this.$route.name === 'ChatSupportEnquiry') {
              vm.imageData.push(response.data.imagePath)
            } else {
              vm.sendImage(this.$route.name === 'ChatSupport')
            }
          }).catch(e => {
            console.error(e)
            vm.$q.notify(e.response.data.message)
          }).finally(() => {
            vm.pictureUploading = false
          })
      }
      if (this.mediatype[0] === 'video') {
        console.log('its an video')
        formData.append('imagefile', imageBlobData, 'video.mp4')
        vm.$axios.post('imageupload', formData)
          .then((response) => {
            console.log('check response', response)
            vm.imageLink = response.data.videoPath
            if (this.$route.name === 'ChatSupportEnquiry') {
              vm.imageData.push(response.data.imagePath)
            } else {
              vm.sendImage(this.$route.name === 'ChatSupport')
            }
          }).catch(e => {
            console.error(e)
            vm.$q.notify(e.response.data.message)
          }).finally(() => {
            vm.pictureUploading = false
          })
      }
    },
    onFileChange (e, isSupport = false) {
      if (!isSupport && (this.responseInfo.acceptanceStatus === 2 || this.responseInfo.acceptanceStatus === 4 || this.responseInfo.acceptanceStatus === 5)) {
        this.$q.notify({
          message: this.$t('image.send.error.close'),
          type: 'negative'
        })
        return
      }

      if (!e.target.files[0]) {
        console.log('empty')
        return
      } else if (this.$route.name === 'Chat' || this.$route.name === 'JobChat' || this.$route.name === 'ChatSupport') {
        this.pictureUploading = true
      }

      for (let index = 0; index < e.target.files.length; index++) {
        let image = e.target.files[index]
        if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
          this.$q.dialog({
            title: this.$t('sorry'),
            message: this.$t('only.jpeg.png')
          })
          return
        }

        let vm = this
        ImageTools.resize(image, function (blob, didItResize) {
          let formData = new FormData()
          formData.append('imagefile', blob, 'image.jpg')
          let imageUploadLink = 'imageupload'
          vm.$axios.post(imageUploadLink, formData)
            .then((response) => {
              vm.imageLink = response.data.imageName
              vm.sendImage(isSupport)
            })
            .catch(e => {
              console.log(e)
            })
        })
      }
    },
    // upload multiple files to support chat from enquiry page
    onFileChangeMultiple (images, isSupport) {
      if (images.length === 0) {
        return
      }

      for (let index = 0; index < images.length; index++) {
        let image = images[index]
        if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
          let sorry = this.$t('sorry')
          let message = this.$t('only.jpeg.png')
          this.$q.dialog({
            title: sorry,
            message: message
          })
          return
        }

        let vm = this
        ImageTools.resize(image, function (blob, didItResize) {
          let formData = new FormData()
          formData.append('imagefile', blob, 'image.jpg')
          let imageUploadLink = 'imageupload'
          vm.$axios.post(imageUploadLink, formData)
            .then((response) => {
              vm.imageLink = response.data.imageName
              vm.sendImage(isSupport)
            })
            .catch(e => {
              console.log(e)
            })
        })
      }
    },
    scrollToBottom () {
      if (document.documentElement.clientWidth < this.MIN_WINDOW_WIDTH) {
        console.log('Scroll bottom')
        window.scrollTo(0, document.body.scrollHeight)
      }
    }
  }
}
