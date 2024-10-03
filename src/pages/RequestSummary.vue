<template>
  <request-summary></request-summary>
</template>

<script>
export default {
  components: {
    'request-summary': () => import('components/RequestSummary')
  },
  created () {
    window.scrollTo(0, 0)
  }
}
</script>
