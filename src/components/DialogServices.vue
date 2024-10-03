<!-- -->
<template>
    <q-dialog v-model="modal" position="bottom" @hide="closePopUp" class="responsive-modal" transition-hide="slide-down" transition-show="slide-up">
        <q-card style="border-top-left-radius:11px;border-top-right-radius:11px;" v-touch-pan.down.prevent.mouse="onSwipe" class="q-pb-lg">
            <q-card-section class="q-pb-none">
                <div class="margin-auto text-center">
                    <hr class="q-my-none bg-grey-3" style="width: 30%;height: 5px;border:none;border-radius: 15px;" />
                </div>
            </q-card-section>

            <q-card-section class="q-py-xs">
                <h6 class="q-my-none text-left q-pl-sm">{{$t('broadcast.request')}}</h6>
                <p class="q-my-none text-left q-pl-sm">{{$t('broadcast.request.notify.description')}}</p>
            </q-card-section>

            <q-card-section class="q-pa-none">
                <q-list class="justify-between row q-mt-md">
                    <!-- Services -->
                    <div  class="text-center col-3" v-for="(service, index) in currentServices" :key="index" @click="toServiceCategory(service.id, service.link)">
                        <!-- Services Icons -->
                        <img v-if="index !== currentServices.length - 1 && index !== currentServices.length - 2" :src="service.icon" height="55px" width="55px" :alt="service.name" loading="lazy" decoding="async"/>
                        <p v-if="index !== currentServices.length - 1 && index !== currentServices.length - 2" style="font-size: 13px;">{{$t(service.shortName)}}</p>
                    </div>
                </q-list>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script>
import services from 'assets/services.json'
import reverseServices from 'assets/servies_reverse.json'
export default {
  props: {
    trigger: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      currentServices: services,
      orderedServices: services,
      reverseServices: reverseServices
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)

      if (value) {
        if (this.$route.name === 'MobileDashboard' && this.$store.getters['user/getUserCurrentMobileTab'] === 'services.explore') {
          // this.currentServices = this.reverseServices
          this.currentServices = this.orderedServices
        } else {
          this.currentServices = this.orderedServices
        }
      }
    }
  },
  created () {
  },
  methods: {
    toServiceCategory (serviceId, serviceLink) {
      if (this.$route.name === 'MobileDashboard' && this.$store.getters['user/getUserCurrentMobileTab'] === 'services.explore') {
        this.$router.push({name: 'BackersNearby', query: {category_id: serviceId}})
      } else {
        this.$router.push(serviceLink)
      }
    },
    onSwipe ({ evt, ...info }) {
      if (info.direction === 'down' && info.offset.y > 20) {
        this.modal = false
      }
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
