<template>
  <q-page padding class="row justify-center">
    <div class="col-md-9 col-xs-12">
      <div class="row">
        <div class="col-xs-12 text-center">
          <img src="statics/images/pet-sitter-300x200.png" alt="Pet sitter">
        </div>
        <div class="col-xs-12 text-center q-mb-xl">
          <h3 class="q-mt-none">{{ $t('review.tq') }}</h3>
          <p class="text-weight-light" style="font-size: 18px;">{{$t('remember.to.verify.your.email')}}</p>
          <p class="text-weight-light" style="font-size: 18px;">{{$t('share.on.social', {userCurrency: this.userCurrency})}}</p>
        </div>
      </div>
      <div class="col-md-12 text-center">
        <q-btn class="q-mb-sm q-mt-md q-mx-md" no-caps size="lg" round style="background: #4568b2;" @click="goTo('facebook-share')">
          <q-icon name="fab fa-facebook-f" style="color: white; height: 45px; width: 45px;"/>
        </q-btn>
        <q-btn class="q-mb-sm q-mt-md q-mx-md" no-caps size="lg" round style="background: #00aced;" @click="goTo('twitter')">
          <q-icon name="fab fa-twitter" style="color: white; height: 45px; width: 45px;"/>
        </q-btn>
        <q-btn class="q-mb-sm q-mt-md q-mx-md" size="lg" round style="background: #25D366;" @click="goTo('whatsapp')">
          <q-icon name="fab fa-whatsapp" style="color: white; height: 45px; width: 45px;"/>
        </q-btn>
      </div>
      <div class="col-md-12 text-center">
        <q-btn class="q-mb-sm q-mt-md q-mx-md primary text-grey-6 text-capitalize" flat style="width:250px;" size="lg" @click="onButtonNotNow">
          {{$t('button.not.now')}}
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import 'assets/fb-sdk.js'
import countries from '../assets/countries'

export default {
  data () {
    return {
      listingInfo: this.$q.cookies.get('globalStorageReviewListingInfo') || null,
      userCurrency: this.$_.findWhere(countries, {'id': this.$store.getters['user/getUserPrefferedCurrency'].toString()}).currencyCode
    }
  },
  mounted () {
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
  methods: {
    onButtonNotNow () {
      if (this.$q.platform.is.mobile) {
        this.$router.replace({name: 'MobileDashboard'})
      } else {
        this.$router.replace({name: 'Requests'})
      }
    },
    goTo (type) {
      switch (type) {
        case 'facebook-share':
          this.sendImpression('Shared', 'Facebook Share Button', 'Review/Testimonial')
          if (this.$q.platform.is.cordova) {
            window.facebookConnectPlugin.showDialog({
              method: 'share',
              href: this.$t('referral.link', {'referralCode': this.$store.getters['user/getUserReferralCode']}),
              caption: this.$t('social.share.message'),
              description: this.$t('social.share.message'),
              hashtag: '#PetBacker'
            }, (response) => {
              console.log(response)
            }, (error) => {
              console.error(error)
            })
          } else {
            window.FB.ui({
              method: 'share',
              href: this.$t('referral.link', {'referralCode': this.$store.getters['user/getUserReferralCode']}),
              quote: this.$t('social.share.message')
            }, function (response) {
            })
          }
          break
        case 'whatsapp':
          this.sendImpression('Shared', 'WhatsApp Share Button', 'Review/Testimonial')
          this.openUrl('https://wa.me/send?text=' + encodeURIComponent(`${this.$t('social.share.message')} ${this.$t('referral.link', {'referralCode': this.$store.getters['user/getUserReferralCode']})}`))
          break
        case 'twitter':
          this.sendImpression('Shared', 'Twitter Share Button', 'Review/Testimonial')
          this.openUrl('https://twitter.com/share?url=' + encodeURIComponent(this.$t('referral.link', {'referralCode': this.$store.getters['user/getUserReferralCode']})) + '&text=' + encodeURIComponent(this.$t('social.share.message')))
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.avatar responsive
  border-radius: 100px
  height: 50px
  width: 50px
  margin: 3px
  cursor: pointer

@media screen and (max-width: 560px)
  .img-height
    height: 108px

  .step-by-step
    min-height: 100vh
    min-width: 100vw

@media screen and (min-width: 561px)
  .step-by-step
    height: 100vh
    width: 100vw

.responsive-image
  height: 100px
  width: 100xp
</style>
