<template>
    <div @click="$router.push({name: 'StepsLeft'})" class="q-mx-md" v-if="(steps < 5) && $store.getters['user/getServiceProvider']">
      <h6 class="q-my-none font-normal-bold">{{ $t('steps.left.to.accept.jobs', {steps: 5 - steps}) }}</h6>
      <q-linear-progress size="10px" :value="(steps/5)" color="primary"></q-linear-progress>
      <p class="q-my-sm text-grey-9">{{$t('steps.left.details')}}</p>
    </div>
</template>
<script>
export default {
  data () {
    return {
      steps: 5,
      languagesSupported: ['en', 'zh_tw', 'zh_cn', 'zh_hk']
    }
  },
  mounted () {
    this.computeStepsLeft()
  },
  beforeDestroy () {
    this.steps = 0
  },
  methods: {
    computeStepsLeft () {
      // checks whether identifications verification done
      if (this.$store.getters['user/getIdVerified'] !== 1 || this.$store.getters['user/getSelfieVerified'] !== 1) {
        this.steps -= 1
      }

      // check whether profile got photo
      if (!this.$store.getters['user/getUserAvatarImage'].includes('https')) {
        this.steps -= 1
      }

      // check whether sitter intro verified done
      if (!this.$store.getters['user/getSitterIntroVerified'] && this.languagesSupported.indexOf(this.$store.getters['user/getCurrentLanguage']) > -1) {
        this.steps -= 1
      }

      // check whether enough review
      if (this.$store.getters['user/getReviewCount'] < 3) {
        this.steps -= 1
      }

      // check whether listing approved
      if (this.$store.getters['user/getListingApprovalStatus'] !== 1) {
        this.steps -= 1
      }
    }
  }
}
</script>
