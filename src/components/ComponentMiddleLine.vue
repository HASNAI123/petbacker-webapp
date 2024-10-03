<template>
  <div class="text-middle-line">
    <span class="lowercase">{{ title }}</span>
  </div>
</template>

<script>
export default {
  props: ['title']
}
</script>

<style lang="stylus" scoped>
div.text-middle-line
  width: 100%
  text-align: center
  border-bottom: 1px solid #c7c7c7
  line-height: 0.1em
  margin: 15px 0px
  color: #8e8e8e

.text-middle-line span
  background:#fff
  padding:0 10px
</style>
