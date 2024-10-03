<template>
  <request-Help></request-Help>
</template>

<script>
export default {
  components: {
    'request-Help': () => import('components/RequestHelp')
  },
  created () {
    window.scrollTo(0, 0)
  }
}
</script>
