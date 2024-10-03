<template>
  <div></div>
</template>

<script>
export default {
  created () {
    this.logoutRequestToServer()
    this.$store.commit('user/updateClearAllState')
    this.$store.commit('request/updateClearAllState')
    this.$store.dispatch('cached/clearInboxPageCached')
    this.$store.dispatch('cached/clearJobsPageCached')
    this.$store.dispatch('cached/clearRequestsPageCached')
    this.$store.dispatch('banners/clearExploreBannersCache')
    this.$store.dispatch('cached/clearTransactionHistoryCached')
    this.$store.dispatch('cached/clearFavoritedListingsCached')
    this.$store.dispatch('cached/clearUserServicesCached')
    this.$store.dispatch('cached/clearMomentsRelatedCached')
    this.$store.dispatch('cached/clearPersonalItemsCached')
    this.$store.dispatch('cached/clearSupportTicketsCached')
    this.$store.dispatch('cached/clearRewardsCached')
    this.$store.dispatch('search/clearSearchCache')
    this.$store.dispatch('chat/clear')
    this.$store.dispatch('bookings/clear')
    delete this.$axios.defaults.headers.common['Authorization']
    this.removeCookies()
    this.$router.replace('/')
    /*  this.$q.localStorage.clear() */
    this.$q.localStorage.remove('uuid')
  },
  methods: {
    removeCookies () {
      let persistCookie = [
        'device-uuid',
        'hideDownloadAppBar'
      ]

      let cookies = this.$q.cookies.getAll()
      for (let key in cookies) {
        if (persistCookie.indexOf(key) < 0) {
          this.$q.cookies.remove(key)
        }
      }
    },
    logoutRequestToServer () {
      this.$axios.delete(`account/${this.$store.state.user.uuid}/logout`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        console.log(response.data)
      })
    }
  }
}
</script>
