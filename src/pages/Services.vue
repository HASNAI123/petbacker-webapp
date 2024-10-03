<template>
  <q-page class="row justify-center">
    <div style="width: 100%; max-width: 1030px;">
      <div class="row justify-center">
        <p class="text-bold q-mt-md col-xs-11 col-md-10" :style="{'margin-left': $q.platform.is.desktop ? '30px' : '5px', 'font-size': $q.platform.is.desktop ? '20px' : '18px' }" size style="margin-bottom: 0px;" >{{$t('what.your.pets.need.today')}}</p>
      </div>
      <div v-if="$q.platform.is.mobile && serviceCards">
        <div class="row justify-center q-ml-md" >
            <q-card v-for="service in serviceCards" :key="service.id" @click="service.link === '/s' ? openNewTab($t('link.href.petbacker') + service.link) : $router.replace({path: service.link, query: $route.query})" class="card-hover col-xs-11" >
              <q-img :src="getHeaderImg(service)" basic>
                <div class="absolute-full text-subtitle2 text-center" style="background-color: rgba(0, 0, 0, 0.13);">
                  <p style="margin-top: 100px" class="font-title-large text-weight-bold text-left q-my-xs">{{ $t(service.name) }}</p>
                  <p class="font-small text-weight-light text-left q-my-xs">{{ getDescription(service.name) }}</p>
                </div >
              </q-img>
            </q-card>
            <!-- <q-card class="card-hover col-xs-11" rel="noreferrer noopener">
              <q-img :src="getHeaderImg('services.petboarding')" @click="openNewTab($t('services.explore.link'))" basic>
                <div class="absolute-full text-subtitle2 text-center" style="background-color: rgba(0, 0, 0, 0.1);">
                  <p style="margin-top: 100px" class="font-title-large text-weight-bold text-left q-my-xs">{{ $t('services.explore') }}</p>
                  <p class="font-small text-weight-light text-left q-my-xs">{{ $t('services.explore.description') }}</p>
                </div >
              </q-img>
            </q-card> -->
        </div>
      </div>
      <div v-else-if="$q.platform.is.desktop && serviceCards">
        <div class="row justify-center">
            <q-card v-for="service in serviceCards" :key="service.id" @click="service.link === '/s' ? openNewTab($t('link.href.petbacker') + service.link) : $router.replace({path: service.link, query: $route.query})" class="col-md-3 card-hover">
              <q-img :src="getHeaderImg(service)" basic>
                <div class="absolute-full text-subtitle2 text-center" style="background-color: rgba(0, 0, 0, 0.13);">
                  <p style="margin-top: 22%;" class="font-title-large text-weight-bold text-left q-my-xs q-ml-sm">{{ $t(service.name) }}</p>
                  <p class="font-small text-weight-light text-left q-my-xs q-ml-sm">{{ getDescription(service.name) }}</p>
                </div>
              </q-img>
            </q-card>
            <!-- <q-card class="col-md-3 card-hover" @click="openNewTab($t('services.explore.link'))" rel="noreferrer noopener">
              <q-img :src="getHeaderImg('services.petboarding')">
                <div class="absolute-full text-subtitle2 text-center" style="background-color: rgba(0, 0, 0, 0.1);">
                  <p style="margin-top: 22%;" class="font-title-large text-weight-bold text-left q-my-xs q-ml-sm">{{ $t('services.explore') }}</p>
                  <p class="font-small text-weight-light text-left q-my-xs q-ml-sm">{{ $t('services.explore.description') }}</p>
                </div >
              </q-img>
            </q-card> -->
        </div>
      </div>
      <p class="q-py-lg"><!-- SPACING --></p>
    </div>
  </q-page>
</template>

<script>
import services from 'assets/services.json'
import services2 from 'assets/services_2.json'
import formListings from 'assets/form-request-v3.json'

export default {
  data () {
    return {
      serviceCards: null,
      countries: [
        'MY',
        'SG',
        'GB'
      ]
    }
  },
  created () {
    this.checkCurrentLocation()
  },
  mounted () {
    this.sendImpression('Service Selection')
  },
  methods: {
    checkCurrentLocation () {
      if (typeof (this.$store.state.geolocation.data) === 'undefined' || this.$store.state.geolocation.data === null) {
        let data = {
          geoplugin_countryCode: 'MY'
        }
        this.$store.commit('geolocation/updateDataState', data)
      }

      if (this.countries.indexOf(this.$store.state.geolocation.data.geoplugin_countryCode) > -1) {
        this.serviceCards = services2
      } else {
        this.serviceCards = services
      }
    },
    openNewTab (link) {
      if (this.$q.platform.is.cordova) {
        this.$router.push({name: 'BackersNearby'})
      } else {
        window.open(link, '_blank')
      }
    },
    SendToService (link) {
      // if (this.$route.query._gac) {
      //   link = link + '?_gac=' + this.$route.query._gac
      // } else if (this.$route.query.gclid) {
      //   link = link + '?gclid=' + this.$route.query.gclid
      // }
      this.$router.push(link)
    },
    getHeaderImg (serviceInfo) {
      if (serviceInfo.id === 0) {
        return serviceInfo.header
      }

      return this.$_.findWhere(services, {'name': serviceInfo.name}).header
    },
    getDescription (serviceName) {
      if (serviceName === 'services.explore') {
        return this.$t('services.explore.description')
      }

      let service = serviceName + '.' + this.$store.getters['user/getCurrentLanguage']
      let description = formListings[service].serviceDescription

      return description
    }
  }
}
</script>

<style lang="stylus" scoped>
.card-hover
  margin-top: 15px
  margin-right: 15px
  border-radius: 10px
.card-hover:hover
  border-shadow: 2px solid lightgrey
  cursor: pointer
</style>
