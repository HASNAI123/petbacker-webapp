<template>
    <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
        <q-card >
          <!-- Header -->
          <q-toolbar class="bg-white fixed-top" style="border-bottom: 1px solid lightgrey;z-index: 2000;">
            <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
            <q-toolbar-title v-close-popup>
              <h6 class="q-my-none font-header-title" style="margin-left: 30%;">{{$t('services.title')}}</h6>
            </q-toolbar-title>
          </q-toolbar>

          <!-- Services Cards -->
          <q-card-section class="q-py-xl">
            <card-services v-for="service in services" :key="service.id" :serviceInfo="service" @selected-service="onSelected"></card-services>
          </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script>
import SERVICES from 'assets/services.json'
import DESCRIPTION from 'assets/form-listing-v5.json'
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
      services: []
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)
    }
  },
  created () {
    this.preparedServices()
  },
  methods: {
    preparedServices () {
      for (let i in SERVICES) {
        if (SERVICES[i].id !== 0) {
          this.services.push(SERVICES[i])
          this.services[i]['serviceDescription'] = DESCRIPTION[`${SERVICES[i].name}.${this.$store.getters['user/getCurrentLanguage']}`].serviceDescription
        }
      }
    },
    onSelected (ratesInfo, serviceId) {
      this.$emit('selected-service', serviceId)
    },
    closePopUp () {
      this.$emit('on-close', false)
    }
  }
}
</script>
