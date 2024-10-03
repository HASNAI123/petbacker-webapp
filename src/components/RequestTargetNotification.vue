<template>
  <div class="q-pa-sm float-left full-width" style="background: #FFF9C4" v-if="$route.query.avatar && ($route.query.servname || $route.query.ownername || $route.query.sittername)">
    <img class='owner-img float-left' :src="`https://assets.petbacker.com/user-images/320/${$route.query.avatar}.jpg`">
    <div class="float-left owner-text q-ml-md">
      <p class="font-normal q-mt-xs q-mb-none" v-if="$route.query.ownername">Booking with <strong>{{$route.query.ownername}}</strong></p>
      <p class="font-normal q-mt-xs q-mb-none" v-else-if="$route.query.sittername">You are extending/rebooking with <strong>{{$route.query.sittername}}</strong></p>
      <p class="font-normal q-mt-xs q-mb-none" v-else-if="$route.query.servname">{{ $t('you.are.contacting') }}  <strong>{{$route.query.servname}}</strong></p>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.owner-img
  border-radius: 50%
  width: 35px
  height: 35px
  object-fit: cover
  margin-left 10px

.owner-text
  width 80%
  text-overflow: ellipsis
  overflow:hidden
  white-space:nowrap
  color: #000
  font-family: roboto light
</style>
