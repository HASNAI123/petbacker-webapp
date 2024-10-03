<template>
  <q-page class="row justify-center" padding>
    <p style="font-size: 18px;" class="col-md-12 q-my-xs q-mb-sm text-center text-weight-bold">{{$t('request.sent.out')}}</p>
    <img src="statics/images/request_submitted_header.jpg" class="col-md-3 col-xs-12 q-my-lg" style="height: 100%;margin-top: 10px;margin-left: auto; margin-right: auto;"/>
    <div class="row">
      <q-card class="col-md-4" style="margin-left: auto; margin-right: auto;">
        <q-card-section class="q-pa-md">
          <!--
          <div class="text-center">
            <h5 class="q-my-sm">{{ $t('request.reference') }}: <strong>{{ $route.params.requestReference }}</strong></h5>
          </div>-->
          <p class="q-mt-sm q-mb-md text-weight-bold font-header-title">{{ $t('what.next') }}</p>

          <!-- Expect Quotes Back Soon -->
          <q-item class="row">
            <q-item-section class="col-2" style="position: relative;">
              <img src="statics/images/bubble-speech.jpg" :style="{'width': $q.platform.is.desktop ? '':'80%'}" style="position: absolute; top: 0px; right: 15px;" alt="Expect To Hear From Us Soon"/>
            </q-item-section>
            <q-item-section class="col-xs-10 col-md-10">
              <q-item-label class="text-weight-medium font-normal-bold">{{$t('expect.quotes.soon')}}</q-item-label>
              <q-item-label class="text-weight-light font-normal text-justify">
                <p style="line-height: 1.4;">
                  {{$t('expect.quotes.soon.details',{spamInboxToo: '(' + $t('check.spam.too') + ')'})}}
                  <span v-if="$q.platform.is.browser">{{$$t('download.app.avoid.missing.message')}}</span>
                </p>
              </q-item-label>
              <q-item-label v-if="$q.platform.is.browser"><q-btn dense color="primary" @click="trackClickEvent('Download App', 'Request Submitted Download App')" class="text-weight-regular text-capitalize q-px-md" style="font-size: 12px;">{{$t('button.download.app')}}</q-btn></q-item-label>
            </q-item-section>
          </q-item>

          <!-- Payment on PetBacker Benefits -->
          <q-item class="row">
            <q-item-section class="col-2" style="position: relative;">
              <img src="statics/images/protection-logo.jpg" :style="{'width': $q.platform.is.desktop ? '':'80%'}" style="position: absolute; top: 0px; right: 15px;" alt="PetBacker Insurances"/>
            </q-item-section>
            <q-item-section class="col-xs-10 col-md-10">
              <q-item-label class="text-weight-medium font-normal-bold">{{$t('pay.with.petbacker.benefit') + '!'}}</q-item-label>
                <q-item-label class="text-weight-light font-normal text-justify">
                  <ul class="q-pl-lg q-mt-none">
                    <li v-html="$t('chat.protectionmoney')" class="q-my-sm"></li>
                    <li v-html="$t('chat.satisfaction')" class="q-my-sm"></li>
                    <li v-html="$t('chat.dailyphoto')" class="q-my-sm"></li>
                    <li v-html="$t('chat.discount10')" class="q-my-sm"></li>
                  </ul>
                </q-item-label>
              <!-- <q-item-label class="text-weight-light text-justify"><p style="line-height: 1.4;">{{$t('protect.pet.free.details')}}</p></q-item-label> -->
              <q-item-label><q-btn dense color="primary" @click="trackClickEvent('Find Out More', 'Request Submitted Download App')" class="text-weight-regular text-capitalize q-px-md" style="font-size: 12px;">{{$t('find.out.more')}}</q-btn></q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card>

      <div class="col-md-12 col-xs-12 q-mt-lg q-mb-lg">
        <div style="display: block; margin-left: auto; margin-right: auto; max-width: 570px;" class="text-center">
          <q-btn color="primary" class="q-mb-lg q-mt-sm full-width text-weight-bold" style="font-size: 16px;height: 59px; border-radius: 10px;" @click="onGotIt">{{$t('got.it')}}</q-btn>
          <q-btn flat @click="onGotIt"><a class="text-weight-bold text-primary">{{$t('view.full.summary')}}</a></q-btn>
        </div>
      </div>
    </div>

    <!-- Dialog Update pets prompt -->
    <dialog-updatepets :trigger="updatePetsModal" :requestId="formResponseInfo ? formResponseInfo.requestInfo.id : null" @on-close="onTriggerUpdatePetsModal"></dialog-updatepets>

  </q-page>
</template>
<script>
import countries from 'assets/countries.json'

export default {
  components: {
    'dialog-updatepets': () => import('components/DialogUpdatePets.vue')
  },
  data () {
    return {
      modal: false,
      formResponseInfo: null,
      updatePetsModal: false
    }
  },
  created () {
    if (this.$q.localStorage.has('localStorageFormResponseInfo')) {
      this.formResponseInfo = this.$q.localStorage.getItem('localStorageFormResponseInfo')
      let serviceCountry = this.getCountryShortName(this.formResponseInfo.requestInfo.countryId)
      this.sendImpression('Request Submitted', serviceCountry)
    }
  },
  beforeDestroy () {
    if (this.$q.localStorage.has('localStorageFormResponseInfo')) {
      this.$q.localStorage.remove('localStorageFormResponseInfo')
    }
  },
  methods: {
    onTriggerUpdatePetsModal (status) {
      this.updatePetsModal = status
    },
    onGotIt () {
      this.onTriggerUpdatePetsModal(true)
    },
    trackClickEvent (category, label, action = 'Button Click') {
      let dataLayer = window.dataLayer || []
      dataLayer.push({'event': 'trackEvent', 'category': category, 'action': action, 'label': label})

      if (category === 'Download App') {
        this.openUrl(this.$t('petbacker.app.link'))
      } else if (category === 'Find Out More') {
        this.openUrl(`${this.$t('link.href.help.center')}/bookings/why-pay-for-your-booking-through-petbacker`)
      }
    },
    getCountryShortName (id) {
      let myArray = countries
      for (let i = 0; i < myArray.length; i++) {
        if (parseInt(myArray[i].id) === parseInt(id)) {
          return myArray[i].shortName
        }
      }
      return null
    }
  }
}
</script>
