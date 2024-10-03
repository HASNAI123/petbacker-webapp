<template>
  <div id="q-app" :class="$route.name + ' ' + $store.getters['user/getCurrentLanguage'] ">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
