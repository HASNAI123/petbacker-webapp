<template>
  <q-page padding class="row">
    <div class="col-xs-12 force-select" v-if="showJson">
      <p>{{ JSON.stringify(showJson) }}</p>
    </div>
  </q-page>
</template>

<script>
import showFooterMixin from '../mixins/showFooterMixin'
import services from 'assets/services.json'

export default {
  mixins: [showFooterMixin],
  data () {
    return {
      jsonForm: {},
      showJson: null,
      locales: ['en', 'zh_tw', 'zh_hk', 'zh_cn', 'pt', 'de', 'cs', 'sk', 'ja', 'it', 'id', 'fr', 'es', 'ko', 'th', 'ms', 'el'],
      staticFormLocale: {
        'en': 'en',
        'zh_tw': 'zh_tw',
        'zh_hk': 'zh_hk',
        'zh_cn': 'zh_cn',
        'pt': 'ptpt',
        'de': 'dede',
        'cs': 'cscz',
        'sk': 'sksk',
        'ja': 'jajp',
        'it': 'itit',
        'id': 'idid',
        'fr': 'frfr',
        'es': 'eses',
        'ko': 'ko_kr',
        'th': 'thth',
        'ms': 'msmy',
        'el': 'elel'
      }
    }
  },
  mounted () {
    let vm = this
    this.locales.forEach((locale) => {
      services.forEach(function (service) {
        if (service.id !== 0) {
          if (vm.$route.query.biz === '1') {
            vm.loadBizJson(service.id, service.name, locale)
          } else {
            vm.loadFormJson(service.id, service.name, locale)
          }
        }
      })
    })

    setTimeout(() => {
      this.showJson = this.jsonForm
    }, 18000)
  },
  methods: {
    loadBizJson (serviceId, serviceName, locale) {
      this.$axios.get(`bizservices?parentid=${serviceId}&lang=${locale}`)
        .then(response => {
          this.jsonForm[`${serviceName}.${this.staticFormLocale[locale]}`] = {
            'id': response.data.services.items[0].id,
            'story': response.data.services.items[0].story,
            'serviceName': response.data.services.items[0].serviceName,
            'serviceDescription': response.data.services.items[0].serviceDescription,
            'unitType': response.data.services.items[0].unitType
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    loadFormJson (serviceId, serviceName, locale) {
      this.$axios.get(`services/${serviceId}?lang=${locale}&v=6`)
        .then(response => {
          this.jsonForm[`${serviceName}.${this.staticFormLocale[locale]}`] = {
            'story': response.data.services.items[0].story,
            'serviceName': response.data.services.items[0].serviceName,
            'serviceDescription': response.data.services.items[0].serviceDescription
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>
