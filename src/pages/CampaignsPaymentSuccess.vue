<template>
  <q-page class="row justify-center text-center " padding >
    <q-card class="col-md-6 col-xs-12" :class="$q.platform.is.mobile ? 'q-pa-md' : 'q-pa-xl'">
      <q-card>
        <div class="q-pb-lg">
          <img class="responsive" src="statics/images/checked.png" style="height: 100px;" alt="success icon">
        </div>
        <h4>{{$t('thank.you.donation')}}</h4>
        <div class="col-md-12 text-center q-mb-lg" style="font-size: 16px;">
          <p class="q-my-lg">{{$t('donation.received')}}</p>
          <p class="q-my-lg" v-html="$t('voucher.after.donation')"></p>
          <p class="q-my-lg">{{$t('preferred.shelter.donation')}}</p>
          <q-input :style="{width: $q.platform.is.desktop ? '69.5%' : '100%'}" dense class="margin-auto q-my-sm" outlined v-model="shelterName">
            <template v-slot:before>
              <p style="font-size: 16px;padding-left: 11.5px;" class="q-ma-none">{{$t('shelter.name.donation')}}</p>
            </template>
          </q-input>
          <q-input :style="{width: $q.platform.is.desktop ? '70%' : '100%'}" dense class="margin-auto q-my-sm" outlined  v-model="shelterContact">
            <template  v-slot:before>
              <p style="font-size: 16px;" class="q-ma-none">{{$t('shelter.contact.donation')}}</p>
            </template>
          </q-input>
          <q-btn class="q-px-xl q-mt-md" size="lg" style="border-radius: 15px;" dense color="primary" :label="$t('button.submit')" @click="submitForm">
          </q-btn>
        </div>
        <p class="q-mt-xl q-mb-lg" v-html="$t('thank.you.again.donation')"></p>
        <q-btn class="q-mb-sm q-mt-md q-mx-md" no-caps size="lg" round style="background: #4568b2;" @click="goTo('facebook-share')">
          <q-icon name="fab fa-facebook-f" style="color: white; height: 45px; width: 45px;"/>
        </q-btn>
        <q-btn class="q-mb-sm q-mt-md q-mx-md" no-caps size="lg" round style="background: #00aced;" @click="goTo('twitter')">
          <q-icon name="fab fa-twitter" style="color: white; height: 45px; width: 45px;"/>
        </q-btn>
        <q-btn class="q-mb-sm q-mt-md q-mx-md" size="lg" round style="background: #25D366;" @click="goTo('whatsapp')">
          <q-icon name="fab fa-whatsapp" style="color: white; height: 45px; width: 45px;"/>
        </q-btn>
      </q-card>
    </q-card>
  </q-page>
</template>

<script>
import 'assets/fb-sdk.js'
import chatMixin from '../mixins/chatMixin.js'
export default {
  mixins: [chatMixin],
  data () {
    return {
      success: this.$route.query.success,
      type: this.$route.query.type,
      countdown: 5,
      countDownInterval: null,
      donatedAmount: this.$route.query.amount,
      userCurrency: this.$route.query.currency,
      shelterName: null,
      shelterContact: null
    }
  },
  mounted () {
    this.$q.cookies.remove('globalStorageReviewInfoUrl')
    this.$q.cookies.remove('strayDogDonation')
    this.$q.cookies.remove('donationType')
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.FB_APP_KEY,
        version: 'v7.0',
        cookie: true,
        xfbml: true
      })
      window.FB.AppEvents.logPageView()
    }
  },
  beforeDestroy () {
    clearInterval(this.countDownInterval)
  },
  methods: {
    submitForm () {
      this.messageBox = `I donated ${this.userCurrency}${this.donatedAmount} and would like my donation to go to ${this.shelterName} (${this.shelterContact})`
      this.sendSupportMessage()
      this.shelterName = null
      this.shelterContact = null
      this.$q.notify({
        message: `Your preferred shelter informations have been submitted. Look out for an email soon!`
      })
    },
    goTo (type) {
      switch (type) {
        case 'facebook-share':
          window.FB.ui({
            method: 'share',
            href: `https://www.petbacker.com/campaigns/stray-dog-day-2020`,
            quote: `I have donated ${this.userCurrency}${this.donatedAmount} to PetBacker Stray Animals Day Donation Drive, join me to help 600,000,000 stray animals in need!`,
            hashtag: '#StrayAnimalsDay #PetBacker'
          }, function (response) {
          })
          break
        case 'whatsapp':
          this.openUrl(`https://wa.me/send?text=I have donated ${this.userCurrency}${this.donatedAmount} to PetBacker Stray Animals Day Donation Drive, join me to help 600,000,000 stray animals in need! https://www.petbacker.com/campaigns/stray-dog-day-2020`)
          break
        case 'twitter':
          this.openUrl('https://twitter.com/share?url=' + encodeURIComponent(`https://www.petbacker.com/campaigns/stray-dog-day-2020`) + '&text=' + encodeURIComponent(`I have donated ${this.userCurrency}${this.donatedAmount} to PetBacker Stray Animals Day Donation Drive, join me to help 600,000,000 stray animals in need!`))
      }
    }
  }
}
</script>
