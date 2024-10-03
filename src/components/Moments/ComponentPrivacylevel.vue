<template>
  <q-dialog v-model="privacyModal" maximized transition-show="slide-up" transition-hide="slide-down" >
    <q-card>
      <q-toolbar style="z-index: 5000;" class="borderline fixed-top bg-white" :class="{'q-pt-xl': $q.platform.is.ios}">
        <q-btn flat dense v-close-popup icon="chevron_left" size="lg" @click="closeModal" class="q-pl-none"/>
        <q-toolbar-title class="text-header font-title q-pl-none">
          <h6 class="q-my-none font-normal" style="margin-left: 3%;">{{ $t('visible.to') }}</h6>
        </q-toolbar-title>
           <q-btn :loading="postLoader" style="border: 1px solid #9b89b9; padding-left: 10px; padding-right:10px ; " flat dense class="text-primary" @click="closeModal">{{$t('Done')}}</q-btn>
      </q-toolbar>

      <q-card-section class="q-pa-none q-my-xl q-pt-xs q-pb-lg">
        <div class="d-flex section-privacy flex-column align-center q-mt-md q-radio">
  <q-radio dense v-model="privacyLevel" val="moments.filters.public" :label="$t('moments.filters.public')" @input="emitPrivacyLevel" /><br><br>
  <q-radio dense v-model="privacyLevel" val="friends.only" :label="$t('friends.only')" @input="emitPrivacyLevel" /><br><br>
  <q-radio dense v-model="privacyLevel" val="only.me" :label="$t('only.me')" @input="emitPrivacyLevel" /><br><br>
</div>

      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    selectedPrivacy: {
      type: String,
      default: 'only.me'
    },
    privacyModal: {
      type: Boolean,
      default: false
    },
    trigger: {
      type: Boolean,
      required: true
    }
  },
  mounted () {
    document.addEventListener('backbutton', this.closeModal)
  },
  beforeDestroy () {
    document.removeEventListener('backbutton', this.closeModal)
  },
  data () {
    return {
      privacyLevel: this.selectedPrivacy || 'public',
      publicPrivacyLevel: false,
      friendsPrivacyLevel: false,
      onlyMePrivacyLevel: false,
      postLoader: false
    }
  },
  methods: {
    closeModal () {
      this.$emit('close-modal')
      this.$emit('update:privacyLevel', this.privacyLevel)
    },
    onSelect () {
      this.$emit('update:selectedPrivacy', this.privacyLevel)
      this.privacyModal = false
    },
    emitPrivacyLevel () {
      console.log('Emitting privacy level:', this.privacyLevel)
      this.$emit('update:privacyLevel', this.privacyLevel)
    }

  },
  computed: {
    selectedPrivacyOption () {
      if (this.privacyLevel === 'public') {
        return 'Public'
      } else if (this.privacyLevel === 'friends') {
        return 'Friends Only'
      } else if (this.privacyLevel === 'onlyMe') {
        return 'Only Me'
      } else {
        return ''
      }
    }
  },
  watch: {
    selectedPrivacy (newValue) {
      this.privacyLevel = newValue || 'public'
    }
  }
}
</script>

<style lang="stylus">
.flex-column
  flex-direction column

.align-center
  align-items center

.q-mt-md
  margin-top 24px

.q-radio
  width 100%
.section-privacy
  margin-left: 10px
  padding-left: 15px

  .d-flex
  .section-privacy
    flex-direction column
    align-items center
    margin-top 24px

  .q-radio__inner-circle
    border-radius 0

  .q-radio__inner-circle:before
    border-radius 0

</style>
