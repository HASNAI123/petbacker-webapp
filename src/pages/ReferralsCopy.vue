<template>
  <q-page class="row justify-center" padding>
    <img src="statics/images/referral_back_petbacker.jpg" class="absolute-top full-width" alt="" style="z-index: -1; min-height: 400px;">
    <div class="col-xs-12 text-center" v-if="referralInfo">
      <div class="row full-width q-pa-lg">
        <img class="avatar-img margin-auto" style="margin-top: 0px !important;" :src="$store.state.user.avatarImage" />
        <h4 class="q-my-sm text-white full-width referral-title">{{ $t('referrals.sharelove') }} {{ referralAmount }}</h4>
      </div>
      <div class="row bg-white text-center text-grey-14 border-lightgrey q-pa-lg margin-auto" style="z-index: 20; max-width: 900px;">
        <p class="q-ma-xl font-x-large">{{ $t('referrals.easystart1') }} {{ referralAmount }} {{ $t('referrals.easystart2') }}</p>
        <div class="relative-position col-xs-12 gt-sm">
          <input type="text" class="full-width q-pa-md" style="border: 1px solid lightgrey;border-radius: 3px;" />
          <!-- <button class="absolute-right" style="background: #ff5a5f;color: white;border: none;width: 35%;">{{ $t('send.invites') }}</button> -->
            <q-btn
              class="absolute-right"
              style="box-shadow: none; padding: 10px !important; background: ##ff5a5f;color: white; width: 35%;"
              size="lg"
              @click.native="onClickSendInvite()"
             > {{ $t('send.invites') }} </q-btn>
        </div>
        <q-btn class="full-width lt-md" size="lg" color="pink" style="background: #ff5a5f !important;" :label="$t('invite.friends.by.email')"/>
        <ComponentMiddleLine :title="$t('or')" />
        <q-btn class="full-width q-mt-md lt-md" size="lg" :label="$t('facebook')" style="background: #3B5998; color: white;"/>
        <q-btn class="full-width q-mt-md lt-md" size="lg" :label="$t('whatsapp')" style="background: green; color: white;"/>
        <q-btn class="full-width q-mt-md lt-md" size="lg" :label="$t('sms')"/>
        <div class="row full-width gutter-sm gt-sm">
          <div class="col-xs-3 q-mt-sm">
            <span class="font-large"> {{ $t('share.your.link') }} </span>
          </div>
        <div class="relative-position col-xs-5">
          <input type="text" :value="referralShareLink" class="full-width q-pa-sm" style="border: 1px solid lightgrey;border-radius: 3px;" />
          <q-btn
            class="absolute-right text-white"
            style="top: 17px; box-shadow: none; padding: 10px !important; background: #cccccc"
            v-clipboard:copy="referralShareLink"
            v-clipboard:success="onCopySuccess"
            v-clipboard:error="onCopyError"> {{ copyText }} </q-btn>
        </div>
        <div class="col-xs-2">
          <q-btn class="full-width" style="background: #0084ff; color: white;" @click.native="onClickMessenger()"> {{ $t('messenger') }} </q-btn>
        </div>
        <div class="col-xs-2">
          <q-btn class="full-width" style="background: #3B5998; color: white;" @click.native="onClickFacebook()"> {{ $t('facebook') }} </q-btn>
        </div>
        </div>
      </div>
      <div class="row q-pt-xl q-pb-lg">
        <p class="text-center font-x-large col-xs-12">
          {{ $t('referrals.yougot') }} <span class="currency">{{ currencySymbol(currencyId) + totalCommissions }}</span> {{ $t('referrals.intravel') }}
        </p>
        <div class="row full-width q-pa-md gt-sm" v-for="referral in referrals" :key="referral.email">
          <div class="col-xs-4 text-right">
            <img class="avatar" :src="referral.avatarImage" />
          </div>
          <div class="col-xs-4 q-mt-md">{{ referral.email }}</div>
          <div class="col-xs-4 q-mt-md text-left"> {{ currencySymbol(referral.currencyId) }} {{referral.amountSpent}} {{ $t('referrals.spent') }} </div>
        </div>
        <!-- <div class="row full-width q-pa-md" v-for="referral in referrals" :key="referral.email">
          <div class="col-xs-4 text-right">
            <img class="avatar" :src="referral.avatarImage" />
          </div>
          <div class="col-xs-4 q-mt-md">{{ referral.email }}</div>
          <div class="col-xs-4 q-mt-md text-left"> {{ currencySymbol(referral.currencyId) }} {{referral.amountSpent}} {{ $t('referrals.spent') }} </div>
        </div> -->
      </div>
    </div>
    <div class="col-xs-12 text-center" v-else>
      <ComponentPreLoader></ComponentPreLoader>
    </div>
  </q-page>
</template>
<script>
import 'assets/fb-sdk.js'
import { required, email } from 'vuelidate/lib/validators'
import countries from 'assets/countries.json'

export default {
  methods: {
    currencySymbol (currencyId) {
      let index = this.countries.findIndex(p => p.id === currencyId.toString())
      return typeof (this.countries[index].symbol) !== 'undefined' ? this.countries[index].symbol : 'RM'
    },
    changeSendMail () {
      this.issent = false
      this.sendmail = 'Send Invites'
    },
    onRedeem () {
      window.location.href = 'mailto:angel@nuflit.com?Subject=I%20would%20like%20to%20redeem%20my%20credits'
    },
    onSMS () {
      let userAgent = navigator.userAgent || navigator.vendor || window.opera
      let link1 = ''
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        link1 = 'sms:&body=' + this.$t('referrals.bemyreferral', { 'referal': this.referralCode, 'commision': '35 percent', 'breakLine': '\n' })
      } else {
        link1 = 'sms:?body=' + this.$t('referrals.bemyreferral', { 'referal': this.referralCode, 'commision': '35 percent', 'breakLine': '\n' })
      }
      window.location.href = link1
    },
    onOpenMail () {
      let link = 'mailto:?subject=' + this.$t('referrals.email.subject') + '&body=' + this.$t('referrals.bemyreferral', { 'referal': this.referralCode, 'commision': '35%', 'breakLine': '%0D%0A' })
      window.location.href = link
    },
    onSendMail () {
      this.sendingmail = true
      let msg = this.$t('referrals.bemyreferral', { 'referal': this.referralCode, 'commision': '35%', 'breakLine': '\n' })
      let mailInfo = JSON.stringify({
        'emailInfo': {
          'senderName': this.$store.state.user.username,
          'senderEmail': this.$store.state.user.email,
          'recipients': this.emails,
          'title': 'Be my referral and join me!',
          'message': msg,
          'emailTemplate': 'referral'
        }
      })

      this.$axios.post('utility/sendemail', mailInfo, {headers: {'Authorization': this.$store.getters['user/authorizationHeader']}})
        .then((response) => {
          this.sendingmail = false
          this.emails = []
          this.onInputMail()
          this.notifymsg = 'Your email invites has been sent out!'
          this.issent = true
          this.sendmail = 'Invites Sent'
          setTimeout(this.changeSendMail, 2000)
        })
        .catch(e => {
          console.log(e)
          this.sendingmail = false
        })
    },
    onInputMail () {
      this.disablesend = false
      for (let index in this.emails) {
        this.email_item = this.emails[index]
        this.$v.email_item.$touch()
        this.disablesend = this.disablesend || this.$v.email_item.$error
      }
      if (this.emails.length === 0) {
        this.disablesend = true
      }
    },
    loadFbSdk () {
      // We don't want to load fb sdk twice
      if (window.FB) {
        return
      }

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
    onCopySuccess (event) {
      this.copyText = this.$t('copied')
      setTimeout(() => {
        this.copyText = this.$t('copy')
      }, 2000)
    },
    onCopyError (event) {
      this.copyText = 'Error'
    },
    onClickMessenger () {
      window.FB.ui({
        method: 'send',
        link: this.$t('referral.link', {'referralCode': this.$store.getters['user/getUserReferralCode']}),
        quote: this.$t('social.share.message')
      })
    },
    onClickFacebook () {
      window.FB.ui({
        method: 'share',
        href: this.$t('referral.link', {'referralCode': this.$store.getters['user/getUserReferralCode']}),
        quote: this.$t('social.share.message')
      }, function (response) {})
    },
    onClickSendInvite () {
      this.sendingmail = true
      let msg = this.$t('referrals.bemyreferral', { 'referal': this.referralCode, 'commision': '35%', 'breakLine': '\n' })
      let mailInfo = JSON.stringify({
        'emailInfo': {
          'senderName': this.$store.state.user.username,
          'senderEmail': this.$store.state.user.email,
          'recipients': this.emails,
          'title': 'Be my referral and join me!',
          'message': msg,
          'emailTemplate': 'referral'
        }
      })

      this.$axios.post('utility/sendemail', mailInfo, {headers: {'Authorization': this.$store.getters['user/authorizationHeader']}})
        .then((response) => {
          this.sendingmail = false
          this.emails = []
          this.onInputMail()
          this.notifymsg = 'Your email invites has been sent out!'
          this.issent = true
          this.sendmail = 'Invites Sent'
          setTimeout(this.changeSendMail, 2000)
        })
        .catch(e => {
          console.log(e)
          this.sendingmail = false
        })
    }
  },
  beforeMount () {
    this.loadFbSdk()
  },
  created () {
    let vm = this
    this.isloading = true

    vm.$axios.get(`users/${this.$store.state.user.uuid}/referral`, {headers: {'Authorization': this.$store.getters['user/authorizationHeader']}})
      .then((response) => {
        this.referralInfo = response.data.referralInfo
        this.currencyid = response.data.referralInfo.currencyId
        this.totalcommissions = response.data.referralInfo.totalCommissions
        this.referrals = response.data.referralInfo.items
        this.referralamount = response.data.referralInfo.referralAmount
      })
      .catch(e => {
        console.log(e)
      })
  },
  mounted () {
    this.$store.commit('user/updateUserReviewState', false)
  },
  computed: {
    email () {
      console.log(this.$store.state.user.email)
      return this.$store.state.user.email
    },
    totalCommissions () {
      return this.totalcommissions
    },
    currencyId () {
      return this.currencyid
    },
    referralCode () {
      return this.referralcode
    },
    referralAmount () {
      if (typeof this.referralamount === 'undefined') {
        return 'USD 10'
      }

      return this.referralamount
    }
  },
  data () {
    return {
      referrals: [],
      currencyid: 0,
      totalcommissions: 0,
      countries: countries,
      referralcode: '',
      isloading: true,
      sharelink: '',
      emails: [],
      email_item: '',
      disablesend: true,
      sendingmail: false,
      notifymsg: '',
      copybtn: 'copy',
      sendmail: 'Send Invites',
      issent: false,
      referralamount: '',
      referralShareLink: location.protocol + '//' + location.hostname + '/signup/referral?code=' + this.$store.state.user.referralCode,
      copyText: this.$t('copy'),
      referralInfo: null
    }
  },
  validations: {
    email_item: {required, email}
  }
}
</script>

<style lang="stylus" scoped>
  .back-img
    //background-image: url("/assets/referral_back.jpg");
    background-image: url('https://storage.googleapis.com/petbacker/images/cms/headers/referral.jpg');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    padding-bottom: 30px;
  .margin-auto
    margin-left: auto;
    margin-right: auto;
  .mg-left-10
    margin-left: 10px;
  .mg-left-5
    margin-left: 5px;
  .mg-left-15
    margin-left: 15px;
  .mg-left-20
    margin-left: 20px;
  .mg-top-40
    margin-top: 40px;
  .mg-top-50
    margin-top: 50px;
  .mg-top-10
    margin-top: 10px;
  .mg-top-5
    margin-top: 5px;
  .mg-bot-10
    margin-bottom: 10px;
  .pd-top-5
    padding-top: 5px;
  .pd-top-10
    padding-top: 10px;
  .pd-top-15
    padding-top: 15px;
  .pd-left-5
    padding-left: 5px;
  .pd-right-5
    padding-right: 5px;
  .pd-left-10
    padding-left: 10px;
  .pd-right-10
    padding-right: 10px;
  .padding-10
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
  .text-center
    text-align: center;
  .min-width-140
    min-width: 140px;
  .referral-content
    padding-left: 24px;
    padding-right: 24px;
    @media (min-width: 744px)
      width: 696px;
  .avatar-content
    text-align: center;
    padding-left: 60px;
    padding-right: 60px;
    @media (max-width: 744px)
      padding-left: 20px;
      padding-right: 20px;
  .avatar-img
    height: 114px;
    width: 114px;
    margin-top: 48px;
    border-radius: 50%;
    border: 2px solid #fff;
  .referral-desc
    font-size: 18px;
    color: #fff;
    line-height: 1.43;
  .term-link
    color: #fff;
    text-decoration: underline;
    font-size: 18px;
  .referral-code
    margin-top: 30px;
    color: #fff;
  .referral-mail
    margin-top: 20px;
    font-size: 32px;
    font-weight: bold;
    color: #fff;
    @media (max-width: 744px)
      font-size: 20px;
  .referral-help
    margin-top: 20px;
  .page-content
    margin-top: -90px;
    padding-left: 24px;
    padding-right: 24px;
    font-size: 14px;
    line-height: 1.43;
    color: #484848;
    background-color: #fff;
    @media (min-width: 744px)
      width: 696px;
  .page-title
    font-size: 24px;
    font-weight: normal;
    line-height: 1.1;
    text-rendering: optimizelegibility;
    margin-bottom: 24px;
  .my-row
    display: table;
  .my-col-md-4
    position: relative;
    min-height: 1px;
    padding-left: 12px;
    padding-right: 12px;
    @media (min-width: 744px)
      width: 33.33333%;
      float: left;
  .icon-share
    vertical-align: top;
    margin-top: 5px;
    width: 25%;
    float: left;
  .icon-desc
    width: 65%;
    float: left;
  .currency
    color: #00a699;
  .item
    width: 100%;
    display: table;
    padding-bottom: 10px;
  .item-avatar
    width: 10%;
    float: left;
    @media (max-width: 744px)
      width: 30%;
  .item-avatar-img
    height: 50px;
    width: 50px;
    border-radius: 50%;
    border: 2px solid #fff;
  .item-mail
    width: 60%;
    vertical-align: top;
    float: left;
    overflow-wrap: break-word;
  .item-currency
    width: 20%;
    color: #767676;
    vertical-align: top;
    float: left;
    @media (max-width: 744px)
      width: 50%;
  .item-spacing
    width: 0%;
    vertical-align: top;
    float: left;
    @media (max-width: 744px)
      width: 30%;
  .page-help
    color: #008489;
    font-size: 14px;
    line-height: 1.43;
  .share-box
    position: relative;
    top: -150px;
    @media (min-width: 743px)
      padding: 45px;
    background-color: #fff;
    border: 1px solid #dce0e0;
    @media (min-width: 1128px)
      width: 1080px;
    @media (max-width: 1128px) and (min-width: 744px)
      width: 696px;
    @media (max-width: 743px)
      margin-left: 10px;
      margin-right: 10px;
      padding: 15px;
  .col-8
    width: 66.6%;
  .col-4
    width: 33.3%;
  .col-12
    width: 100%;
  .back-red
    background-color: #ff5a5f;
  .back-white
    background-color: white;
  .back-purple
    background-color: #3B5998;
  .back-green
    background-color: green;
  .color-white
    color: white;
  .color-black
    color: #484848;
  .border
    border: 1px solid #cccccc;
  .input-email
    min-height: 2.4rem;
  .link-mail
    color: #484848;
  .mail-icon
    height: 18px;
    vertical-align: top;
    padding-top: 1px;
  .border-right
    border-right: 1px solid #cccccc;
  .share-desc
    @media (min-width: 1128px)
      width: 16.6%;
    @media (max-width: 1128px)
      width: 20%;
  .share-mail
    @media (min-width: 1128px)
      width: 33.3%;
    @media (max-width: 1128px)
      width: 46.6%;
  .face-btn-contain
    @media (min-width: 1128px)
      width: 25%;
    @media (max-width: 1128px)
      width: 16.6%;
  .share-mail-input-contain
    @media (min-width: 1128px)
      width: 75%;
    @media (max-width: 1128px)
      width: 66.6%;
  .share-mail-btn-contain
    height: 100%;
    @media (min-width: 1128px)
      width: 22%;
    @media (max-width: 1128px)
      width: 30%;
  .share-mail-input
    min-height: 2.4rem;
    border-left: 1px dotted green;
    border-top: 1px dotted green;
    border-bottom: 1px dotted green;
  .border-green
    border: 1px solid green;
  .share-mail-btn
    color: #484848;
    background-color: #cccccc;

  .align-top
    vertical-align: top;
  .msn-btn
    width: 100%;
    color: white;
    background-color: #0084ff;
  .face-btn
    width: 100%;
    color: white;
    background-color: #3B5998;
  .separator
    position: relative;
    padding: 16px;
    text-align: center;

  .separator::before
    content: '';
    position: absolute;
    border-bottom: 1px solid #e4e4e4;
    top: 50%;
    right: 100%;
    width: 5000px;

  .separator::after
    content: '';
    position: absolute;
    border-bottom: 1px solid #e4e4e4;
    top: 50%;
    left: 100%;
    width: 5000px;
  .height-60
    height: 60px;
  button
    border-radius: 4px;
    padding: 0rem !important;
  .send-mail
    min-height: 60px;
  .back-green
    background-color: green !important;
  .bg-blue-nuflit
    background: #0EA7C7 !important
</style>
