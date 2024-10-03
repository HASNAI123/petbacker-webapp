<template>
    <q-dialog v-model="modal" @hide="closePopUp">
        <q-card style="overflow: visible; max-width: 305px;border-radius: 15px;">
          <q-card-section>
            <div class="protection-bulb">
              <img src="statics/images/for-your-protection.jpg" class="protection-bulb-image">
            </div>
            <div class="bg-white-self">
              <div class="row justify-center column">
                <p class="q-title q-my-xs text-center protection-title text-weight-bold"> {{$t('note')}} </p>
              </div>
              <div class="row text-justify q-mt-md">
                <div class="col-md-12 text-justify protection-desc">
                  <!-- <span>{{$t('trasaction.fees.note')}}</span> -->
                  <span>{{moreInfoText ? moreInfoText : $t('trasaction.fees.note')}}</span>
                </div>
              </div>
              <div class="row q-mt-lg">
                <div class="full-width q-mb-sm" v-if="quoteDescriptionLink && quoteDescriptionLink !== ' ' && quoteDescriptionLink !== ''">
                  <q-btn class="full-width text-weight-bold" color="primary" :label="$t('chat.learnmore')" @click="onLearnMore"></q-btn>
                </div>
                <div class="full-width q-mb-sm">
                  <q-btn class="full-width" flat :label="$t('close')" dense @click="closePopUp"/>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script>
export default {
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    moreInfoText: {
      type: String,
      required: true
    },
    quoteDescriptionLink: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      modal: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)
    }
  },
  methods: {
    closePopUp () {
      this.$emit('on-close', false)
    },
    onLearnMore () {
      this.openUrl(this.quoteDescriptionLink)
      this.closePopUp()
    }
  }
}
</script>
<style lang="stylus">
.protection-bulb
  position: absolute
  top: 0
  left: calc(50% - 35px)
  padding: 10px
  background:  #fff
  width: 70px
  border-radius: 50%
  margin-top: -35px

.protection-bulb-image
  width: 50px
</style>
