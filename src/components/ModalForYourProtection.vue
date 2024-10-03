<template>
    <q-dialog v-model="openModal" @hide="closeModal" :content-css="{width: '300px', height: 'fit-content', background: 'transparent', boxShadow: 'none'}" transition-show="slide-up" transition-hide="slide-down" >
        <q-card style="overflow: visible;border-radius: 20px;">
          <q-card-section>
            <div class="protection-bulb">
              <img src="statics/images/for-your-protection.jpg" class="protection-bulb-image">
            </div>
            <div class="bg-white-self">
              <div class="row justify-center column">
                <div class="q-title q-mt-sm text-center protection-title text-weight-bold"> {{$t('for.your.protection')}} </div>
              </div>
              <div class="row text-center q-mt-lg">
                <div class="col-md-12 protection-desc">
                  <span v-if="$route.name === 'JobChat'" v-html="$t('for.your.protection.job')"></span>
                  <span v-else v-html="$t('sufficient.balance.needed')"></span>
                </div>
                <br/>
              </div>
              <div class="row">
                <div class="full-width">
                  <q-btn color="primary" class="full-width text-weight-bold" :label="$t('chat.learnmore')" v-if="$route.name === 'JobChat'" @click.native="openUrl(`${$t('link.href.help')}/pet-service-providers/why-should-i-receive-payment-with-petbacker`)" />
                  <q-btn color="primary" class="full-width text-weight-bold" :label="$t('chat.booknow')"  v-if="$route.name === 'Chat'"  @click.native="$router.push({name: 'Checkout', params: {request: requestId, response: responseId}})" />
                  <q-btn outline class="full-width text-weight-bold q-mt-sm" color="primary" :ripple="false" v-if="$route.name === 'Chat'" :label="$t('chat.learnmore')" @click.native="openUrl(`${$t('link.href.help')}/pet-parents/why-pay-through-petbacker`)" />
                </div>
                <div class="full-width q-mt-sm">
                  <q-btn flat class="full-width" :label="$t('chat.later')" dense @click.native="closeModal" />
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
    requestId: Number,
    trigger: Boolean,
    responseId: Number
  },
  data () {
    return {
      openModal: false
    }
  },
  watch: {
    trigger (value) {
      this.openModal = value
    }
  },
  methods: {
    closeModal () {
      this.openModal = false
      this.$emit('trigger-updated', false)
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
  margin-top: -35px;

.protection-bulb-image
  width: 50px

.protection-desc
  font-size: 16px
  color: #111

.protection-title
  font-size 20px
  color: #444
</style>
