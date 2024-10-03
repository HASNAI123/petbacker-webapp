<template>
  <q-item-section :side="side">
    <q-badge color="positive" class="text-white q-px-sm q-py-xs text-capitalize" v-if="status >= 4">
        {{$t('resolved')}}
    </q-badge>
    <q-badge color="warning" class="text-grey q-px-sm q-py-xs" v-if="status <= 3">
        {{$t('requests.page.pending')}}
    </q-badge>
  </q-item-section>
</template>
<script>
export default {
  props: {
    status: {
      type: Number,
      required: true
    },
    side: {
      default: true,
      type: Boolean
    }
  }
}
</script>
