<template>
    <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-down" transition-show="slide-up">
        <q-card>
          <!-- Header -->
          <q-toolbar >
            <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
              <q-toolbar-title v-close-popup>
                <h6 class="q-my-none services-title font-header-title">{{$t('services.title')}}</h6>
              </q-toolbar-title>
            <!--<q-btn flat round dense icon="add" ></q-btn>-->
          </q-toolbar>

          <!-- Services Cards -->
          <q-card-section v-if="services !== null">
            <card-services v-for="service in services" :key="service.id" :serviceInfo="service" @selected-service="onSelected"></card-services>
          </q-card-section>
        </q-card>

    </q-dialog>
</template>
<script>
export default {
  components: {
    'card-services': () => import('components/JobQuote/Services/ServiceCard.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      services: null,
      testServiceInfo: null
    }
  },
  created () {
    this.getServices()
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)
    }
  },
  methods: {
    onSelected (ratesInfo, serviceId) {
      this.$emit('selected-service', ratesInfo, serviceId)
    },
    closePopUp () {
      this.$emit('on-close', false)
    },
    getServices () {
      this.$axios.get(`users/${this.$store.getters['user/getUserUuidState']}/services`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.services = response.data.serviceInfo.services
      }).catch((error) => {
        console.error(error)
        let errorMessage = error.response ? error.response.data.message : this.$t('requests.error.title')
        this.$q.notify({
          message: errorMessage,
          type: 'negative',
          actions: [
            { icon: 'fas fa-headset', color: 'primary', handler: () => { this.$router.push({name: 'ChatSupportHelp'}) } }
          ]
        })
      })
    }
  }
}
</script>
<style lang="stylus">
.services-title
  margin-left: 29%
</style>
