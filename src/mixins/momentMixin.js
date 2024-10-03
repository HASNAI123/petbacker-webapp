export default {
  data () {
    return {
      moments: null,
      comments: null,
      commentBox: null,
      momentType: 0, // type 0: public, type 3: related to me
      tag: null, // tag to be sent on request header
      loaded: false, // prevent spam (stop when no more content to load)
      loader: true,
      isRefreshInProgress: false
    }
  },
  methods: {
    // get one moment post
    getMomentPost () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.moments = null
        return
      }

      this.$axios.get(`moments/${this.$route.params.momentId}?share=1`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.moments = []
        this.moments.push(response.data)
        this.tag = response.headers['tag']
        this.loaded = false
      }).catch((error) => {
        console.error(error)
        if (error.response.data && error.response.data.message) {
          this.$q.notify({message: error.response.data.message, position: 'top', timeout: 2000})
        }
        this.$router.go(-1)
      }).finally(_ => {
        /* this.getMoments(true) */
      })
    },
    // on page loads
    async getMoments (append = false, skipCache = false) {
      if (this.$store.getters['user/getUserUuidState'] === null && this.momentType === 3) {
        this.moments = null
        return
      }

      if (!skipCache) {
        if (this.$store.getters['cached/getMomentsPublicCached'] && this.momentType === 0) {
          if (append) {
            this.moments = this.moments.concat(this.$store.getters['cached/getMomentsPublicCached'])
          } else {
            this.moments = this.$store.getters['cached/getMomentsPublicCached']
          }
        } else if (this.$store.getters['cached/getMomentsRelatedCached'] && this.momentType === 3) {
          if (append) {
            this.moments = this.moments.concat(this.$store.getters['cached/getMomentsRelatedCached'])
          } else {
            this.moments = this.$store.getters['cached/getMomentsRelatedCached']
          }
        } else {
          this.moments = []
        }
      }

      this.$axios.get(`moments?refresh=1&type=${this.momentType}&auth=0&per_page=8`, {
        headers: {
          'Authorization': this.$store.getters['user/getUserUuidState'] ? this.$store.getters['user/authorizationHeader'] : 0
        }
      }).then((response) => {
        if (!this.tag) {
          this.tag = response.headers['tag']
        }

        this.loaded = false
        let requestType = response.config.url.split('&')[1]

        if (response.status !== 204) {
          // to make sure it is loaded on the correct filter and doesnt overlapped
          if (this.momentType === 0 && requestType === 'type=0' && this.moments.length === 0) {
            this.moments = response.data
          } else if (this.momentType === 3 && requestType === 'type=3' && this.moments.length === 0) {
            this.moments = response.data
          }

          if (requestType === 'type=0') {
            this.$store.dispatch('cached/cacheMomentsPublic', response.data)
          } else if (requestType === 'type=3') {
            this.$store.dispatch('cached/cacheMomentsRelated', response.data)
          }
        } else {
          this.moments = null
        }

        this.$emit('moments-loaded', response.status, requestType)
        if (skipCache) { // get fresh new cached moments above after block the moment
          if (this.momentType === 0) {
            this.moments = this.$store.getters['cached/getMomentsPublicCached']
          } else if (this.momentType === 3) {
            this.moments = this.$store.getters['cached/getMomentsRelatedCached']
          }
        }
      }).catch((error) => {
        this.forceLogout(error)
        console.error(error)
        if (error.response.data && error.response.data.message !== 'The user does not exist.') {
          this.$q.notify({message: error.response.data ? error.response.data.message : ''})
        }
      })
    },
    // Pull to refresh
    refresh (done) {
      setTimeout(() => {
        done()
      }, 2000)
      if (document.documentElement.scrollTop >= 200) {
        done()
        return
      }
      if (this.isRefreshInProgress) {
        return
      }
      this.isRefreshInProgress = true

      this.$axios.get(`moments?refresh=1&type=${this.momentType}&auth=0`, {
        headers: {
          'Authorization': this.$store.getters['user/getUserUuidState'] ? this.$store.getters['user/authorizationHeader'] : 0,
          'Tag': this.tag
        }
      }).then((response) => {
        if (response.status !== 204) {
          let requestType = response.config.url.split('&')[1]
          let currentMoments = this.moments
          currentMoments.splice.apply(currentMoments, [0, 0].concat(response.data))

          if (requestType === 'type=0') {
            this.$store.dispatch('cached/cacheMomentsPublic', currentMoments)

            // if user current view moment type is 0
            // update the content
            if (this.momentType === 0) {
              this.moments = currentMoments
            }
          } else if (requestType === 'type=3') {
            this.$store.dispatch('cached/cacheMomentsRelated', currentMoments)

            // if user current view moment type is 1
            // update the content
            if (this.momentType === 3) {
              this.moments = currentMoments
            }
          }
        } else {
          if (this.momentType === 0) {
            this.moments = this.$store.getters['cached/getMomentsPublicCached']
          } else if (this.momentType === 3) {
            this.moments = this.$store.getters['cached/getMomentsRelatedCached']
          }
        }
      }).catch((error) => {
        console.error(error)
        if (error.response.data && error.response.data.message !== 'The user does not exist.') {
          this.$q.notify({message: error.response.data ? error.response.data.message : ''})
        }
      }).finally(_ => {
        done()
        this.isRefreshInProgress = false
      })
    },
    // Infinite scroll
    loadMoreMoments () {
      if (this.loaded) {
        return
      }

      this.loader = true

      setTimeout(() => {
        this.getMoreMoments()
      }, 700)
    },
    getMoreMoments () {
      if (this.$store.getters['user/getUserUuidState'] === null && this.momentType === 3) {
        this.moments = null
        return
      }

      this.$axios.get(`moments?refresh=0&type=${this.momentType}&auth=0&per_page=10`, {
        headers: {
          'Authorization': this.$store.getters['user/getUserUuidState'] ? this.$store.getters['user/authorizationHeader'] : 0,
          'Tag': this.tag
        }
      }).then((response) => {
        if (response.status === 204) {
          this.loader = false
          if (this.$refs['infinite-scroll']) {
            this.$refs['infinite-scroll'].stop()
          }
        } else {
          this.moments = this.moments.concat(response.data)
        }

        if (this.$refs['infinite-scroll']) {
          this.$refs['infinite-scroll'].stop()
        }
      }).catch((error) => {
        console.error(error)
        if (error.response.data && error.response.data.message !== 'The user does not exist.') {
          this.$q.notify({message: error.response.data ? error.response.data.message : ''})
        }
      })
    },
    // like a post
    like (momentId) {
      this.$axios.post(`moments/${momentId}/like?type=1`, {}, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
      }).catch((error) => {
        console.error(error)
      })
    },
    // unlike a post
    unlike (momentId) {
      this.$axios.delete(`moments/${momentId}/like?type=1`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
      }).catch((error) => {
        console.error(error)
      })
    },
    // get all comments of a post
    async getComments (momentId) {
      return this.$axios.get(`moments/${momentId}/comments`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.comments = response.data.data
        return response.data.data
      }).catch((error) => {
        console.error(error)
        this.$q.notify({message: error.response.data.message, position: 'top'})
      })
    },
    // submit a comment to a post
    async submitComment (momentId) {
      let payload = {
        'commentInfo': {
          'comment': this.commentBox
        }
      }

      await this.$axios.post(`moments/${momentId}/comment`, payload, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        return response
      }).catch((error) => {
        console.error(error)
        this.$q.notify({message: error.response.data.message, position: 'top'})
      })
    }
  }
}
