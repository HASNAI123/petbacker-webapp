<template>
  <q-page class="row justify-center" padding>
    <div v-if="!this.$q.localStorage.getItem('accountInfoFacebook')" class="col-xs-12 col-sm-6 col-lg-5 text-center text-grey-14">
      <h4 class="q-mt-none">{{ $t('login.facebook.review') }}</h4>
      <q-btn class="full-width" size="lg" icon="fab fa-facebook-f" :loading="fbloading" color="primary" :label="$t('login.with.facebook')" @click.native="onAuthFacebook()" style="background: #4568b2 !important;"/>
    </div>
  </q-page>
</template>

<script>
import authFlowMixin from '../mixins/authFlowMixin'
export default {
  mixins: [authFlowMixin]
}
</script>
