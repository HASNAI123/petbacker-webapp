<template>
  <jobs-Help></jobs-Help>
</template>

<script>
export default {
  components: {
    'jobs-Help': () => import('components/JobsHelp')
  },
  created () {
    window.scrollTo(0, 0)
  }
}
</script>
