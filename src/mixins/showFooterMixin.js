export default {
  beforeCreate () {
    if (!this.$store.getters['user/getFooterVisibility ']) {
      this.$store.commit('user/updateUserFooterVisibilityState', true)
    }
  }
}
