export default {
  beforeCreate () {
    // Hide footer
    this.$store.commit('user/updateUserFooterVisibilityState', false)
  },
  beforeDestroy () {
    // Show footer
    this.$store.commit('user/updateUserFooterVisibilityState', true)
  }
}
