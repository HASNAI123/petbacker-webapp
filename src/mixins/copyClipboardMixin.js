export default {
  data () {
    return {
      copiedSuccessText: ''
    }
  },
  methods: {
    copyToClipboard (str) {
      const el = document.createElement('textarea')
      el.value = str
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    },
    onCopy (copyText) {
      try {
        this.copyToClipboard(copyText)
        this.$q.notify({
          message: this.copiedSuccessText,
          type: 'positive',
          timeout: 1200,
          position: 'top'
        })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
