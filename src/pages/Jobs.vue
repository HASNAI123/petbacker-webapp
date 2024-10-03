<template>
  <jobs></jobs>
</template>
<script>
export default {
  components: {
    'jobs': () => import('components/Dashboard/Jobs.vue')
  }
}
</script>
