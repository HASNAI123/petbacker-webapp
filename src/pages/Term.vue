<template>
  <q-page padding class="row justify-center">
    <div class="col-xs-12 col-sm-8 col-lg-6 text-center">
      <h4 class="text-left">{{ $t('terms.title') }}</h4>
      <p class="text-left text-justify" v-html="$t('terms.content')"></p>
      <q-btn class="q-mt-md float-right" color="primary" size="md" :label="$t('button.next')" @click="$router.push('verification')"/>
    </div>
  </q-page>
</template>
