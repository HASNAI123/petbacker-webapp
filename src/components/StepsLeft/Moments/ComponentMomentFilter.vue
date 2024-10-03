<template>
    <div class="q-px-md q-py-sm bg-white">
      <!-- <p class="q-mb-xs text-weight-medium" style="font-size: 16px;">{{$t('moments.title.filter')}}</p> -->
      <q-btn-toggle
        v-model="model"
        :disable="disable"
        spread
        no-caps
        rounded
        class="toggle-styling"
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="[
          {label: $t('moments.filters.public'), value: 0},
          {label: $t('moments.filters.related.to.me'), value: 3}
        ]"
        @input="filterChange"
      />
    </div>
</template>
<script>
export default {
  props: {
    firstLoad: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      model: 0,
      disable: false
    }
  },
  watch: {
    firstLoad (value) {
      if (value) {
        this.disable = false
      } else {
        this.disable = true
      }
    }
  },
  methods: {
    filterChange (value) {
      this.$emit('filter-change', value)
    }
  }
}
</script>
<style lang="stylus">
.btn-styling
  color: $primary
  background: $primary

.toggle-styling
  border: 1px solid $primary
  box-shadow: none

.outer-borderline
  border: 1px solid lightgrey
  border-radius: 2px
</style>
