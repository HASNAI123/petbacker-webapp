<template>
  <div style="overflow-x: hidden;">
    <div>
      <div>
        <img class="back-img" src="https://storage.googleapis.com/petbacker/images/cms/headers/referral.jpg"/>
        <div class="referral-content" style="position: absolute;top: 70px; left: 0px;width: 100%;">
          <div class="avatar-content margin-auto">
              <img class="avatar-img image-upload" :src="$store.state.user.avatarImage" />
              <h6 class="referral-title" :style="$store.getters['user/getCurrentLanguage'] === 'idid' ? 'font-size: 21px !important; margin-top: 18px !important;' : ''">
                {{ $t('referrals.sharelove') }}
                <span v-if="refereeAmount">{{ refereeAmount }}</span>
              </h6>
              <div class="referral-code margin-auto" v-if="referralCode">
                <p class="font-normal">{{ $t('referrals.yourcode') }}</p>
              </div>
              <div v-if="referralCode" class="referral-mail margin-auto">
                <input :value="referralCode" class="text-center margin-auto text-white" style="background: none; outline: none; border: none;" readonly/>
              </div>
              <div v-else class="referral-mail margin-auto" style="font-weight:normal">
                <p v-if="$store.getters['user/getUserUuidState'] !== null">{{ $t('referral.code.generating.txt') }}</p>
                <p v-else>{{$t('guest.mode.messages.referral')}}</p>
              </div>
              <div class="referral-help margin-auto">
                <a class="term-link" href="https://www.petbacker.com/help-center/referral-program/where-do-i-add-a-referral-email-when-signing-up" target="_blank" rel="noreferrer noopener">{{ $t('referrals.howenter') }}</a>
              </div>
          </div>
        </div>
      </div>
      <div class="share-box margin-auto">
        <!-- PC page -->
        <div class="gt-md row justify-center" v-if="$q.platform.is.desktop">
          <div class="mg-top-10">
            <div class="row">
              <div class="width-1of1">
                <h3 class="font-title-large page-title text-center">
                  {{ $t('referrals.easystart1') }} <strong>{{ referralAmount }}</strong> {{ $t('referrals.easystart2') }}
                </h3>
              </div>
            </div>
          </div>
          <div class="row mg-top-40 full-width">
            <div class="col-8 no-padding">
              <q-input class="col-12 border pd-left-5 input-email send-mail" type="email" v-model="emails[0]" :placeholder="$t('enter.email.addresses')" @input="onInputMail()" />
            </div>
            <div class="col-4 no-padding">
              <q-btn class="col-12 back-red color-white send-mail" v-bind:class="{ 'back-green' : issent }" v-on:click="onSendMail()"
                :disabled="disablesend || sendingmail">{{ sendingmail ? '' : $t('send.invites') }}
                <q-spinner color="#fff" :size="10" v-if="sendingmail" ></q-spinner>
              </q-btn>
            </div>
          </div>
          <!-- <div class="row mg-top-10">
            <span>{{ $t('import.contacts') }} </span>
            <span class="pd-right-10 pd-left-10 border-right">
              <a class="link-mail" href="#" rel="noreferrer noopener">
                <img src="statics/images/gmail.png" class="mail-icon">{{ $t('gmail') }}</a>
            </span>
            <span class="pd-right-10 pd-left-10 border-right">
              <a class="link-mail" href="#" rel="noreferrer noopener">
                <img src="statics/images/yahmail.png" class="mail-icon">{{ $t('yahoo.mail') }}</a>
            </span>
            <span class="pd-right-10 pd-left-10">
              <a class="link-mail" href="#" rel="noreferrer noopener">
                <img src="statics/images/outmail.png" class="mail-icon">{{ $t('outlook') }}</a>
            </span>
            <span class="pd-right-10 pd-left-10">
              <a class="link-mail" href="#" rel="noreferrer noopener">
                <svg viewBox="0 0 24 24" role="img" aria-label="More Information" focusable="false" style="height:16px;width:16px;display:block;fill:currentColor;"
                  data-reactid="82">
                  <path fill-rule="evenodd" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11-4.925 11-11 11zm4.75-14c0 1.8-.821 2.929-2.352 3.886-.233.145-1 .585-1.137.67-.396.247-.511.38-.511.444v2a.75.75 0 0 1-1.5 0v-2c0-.74.42-1.218 1.216-1.716.169-.105.937-.545 1.136-.67C14.738 10.904 15.25 10.2 15.25 9a3.25 3.25 0 0 0-6.5 0 .75.75 0 0 1-1.5 0 4.75 4.75 0 0 1 9.5 0zM13 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
                    data-reactid="83"></path>
                </svg>
              </a>
            </span>
          </div> -->
          <div class="text-middle-line col-xs-12">
            <span>{{ $t('or') }}</span>
          </div>
          <div class="row mg-top-10 full-width">
            <div class="share-desc pd-top-10" style="width: 100px">
              {{ $t('share.your.link') }}
            </div>
            <div class="share-mail pd-left-10 inline-block">
              <div class="no-padding share-mail-input-contain inline-block">
                <q-input readonly class="col-12 share-mail-input" v-model="sharelink" />
              </div>
              <div class="no-padding share-mail-btn-contain inline-block">
                <q-btn class="share-mail-btn col-12 back-red color-white text-center" @click.native="onCopy(sharelink)">{{ this.$t('copy') }}</q-btn>
              </div>
            </div>
            <div class="face-btn-contain q-pl-md q-mt-sm">
              <q-btn class="msn-btn" v-on:click="goTo('facebook-send')">
                <span class="gt-xs">{{ $t('messenger') }}</span>
              </q-btn>
            </div>
            <div class="face-btn-contain q-pl-md q-mt-sm">
              <q-btn class="face-btn" v-on:click="goTo('facebook-share')">
                <span class="gt-xs">{{ $t('facebook') }}</span>
              </q-btn>
            </div>
          </div>
        </div>

        <!-- mobile page -->
        <div class="lt-lg row justify-center" v-else-if="$q.platform.is.mobile">
          <div class="lt-lg">
            <h3 class="font-title-large page-title text-center">
              {{ $t('referrals.easystart1') }} <strong>{{ referralAmount }}</strong> {{ $t('referrals.easystart2') }}
            </h3>
          </div>
          <div v-if="referralCode" class="text-center">
            <q-btn class="col-12 full-width back-red color-white height-60" v-on:click="onOpenMail()">{{ $t('invite.friends.by.email') }}</q-btn>
            <div class="text-middle-line col-xs-12">
              <span>{{ $t('or') }}</span>
            </div>
            <q-btn class="col-12 full-width face-btn color-white height-60 q-my-xs" v-on:click="goTo('facebook-share')">{{ $t('facebook') }}</q-btn>
            <q-btn class="col-12 full-width back-green color-white height-60 q-my-xs" v-on:click="goTo('whatsapp')">{{ $t('whatsapp') }}</q-btn>
            <q-btn class="col-12 full-width back-white color-black border height-60 q-my-xs" v-on:click="onSMS()">{{ $t('sms') }}</q-btn>
            <div class="full-width mg-top-10 text-center q-mt-md">
              <span class="col-12">
                {{ $t('select.copy.below') }}
              </span>
            </div>
            <div class="full-width mg-top-10 text-center">
              <span class="col-12 force-select">
                {{ sharelink }}
              </span>
              <q-btn class="share-mail-btn text-center q-ml-sm" style="border-radius:25px;" @click.native="onCopy(sharelink)">{{ this.$t('copy') }}</q-btn>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isloading" class="justify-center items-center text-center">
        <ComponentPreLoader></ComponentPreLoader>
      </div>
      <div class="page-content margin-auto q-mb-lg q-pb-lg" v-else>
          <h3 class="font-title-large page-title text-center mg-top-10" v-if="currencyId" v-html="$t('you.got.vouchers.potential', { referralAmount: referralInfo.referralCurrent, referralPotential: referralInfo.referralPotential })"></h3>
          <template v-if="referrals">
            <div v-if="$q.platform.is.desktop">
              <div class="item margin-auto mg-left-10 gt-sm q-mb-lg" v-for="(referral, index) in referrals" :key="index">
                  <div class="item-avatar">
                      <img class="item-avatar-img" :src="referral.avatarImage" />
                  </div>
                  <div class="item-mail mg-left-20">
                      <strong>{{referral.username}}</strong> ({{referral.email}}) <br>
                      <span class="text-grey-6">{{ parseReadableDate(referral.created_time) }}</span><br>
                  </div>
                  <div class="item-spacing">
                      &nbsp;
                  </div>
                  <div class="item-currency">
                      <span v-if="parseInt(referral.status) === 0">
                      {{ $t('pending.booking') }} <br>
                    </span>
                    <span v-else>
                      {{ $t('booked') }} <br>
                      <span class="text-grey-6">{{ $t('you.earned') }} {{ referralInfo.referralAmount }}</span>
                    </span>
                  </div>
              </div>
            </div>
            <q-item class="q-my-md q-px-none" v-for="(referral, index) in referrals" :key="index">
              <q-item-section avatar>
                <q-avatar style="width: 60px;height: 60px;">
                  <img class="image-upload" :src="referral.avatarImage" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label><strong>{{ referral.username }}</strong> ({{ referral.email }})</q-item-label>
                <q-item-label>{{ parseInt(referral.status) === 0 ? $t('pending.booking') : $t('booked') }}</q-item-label>
                <q-item-label v-if="parseInt(referral.status) === 1" class="text-positive">{{ $t('you.earned') }} {{ referralInfo.referralAmount }}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label>{{ parseReadableDate(referral.created_time) }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
      </div>
    </div>
    <q-dialog ref="notifymodal">
      <div class="padding-10">
        <h6>{{ notifymsg }}</h6>
        <div class="text-center mg-top-10">
          <q-btn class="primary" @click="$refs.notifymodal.close()">{{ $t('close') }}</q-btn>
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script>
/* global bugsnagClient */
import 'assets/fb-sdk.js'
import { required, email } from 'vuelidate/lib/validators'
import countries from 'assets/countries.json'
import moment from 'moment'

const copyToClipboard = str => {
  const el = document.createElement('textarea')
  el.value = str
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

export default {
  data () {
    return {
      referrals: [],
      currencyid: 0,
      totalcommissions: 0,
      countries: countries,
      referralcode: this.$store.getters['user/getUserReferralCode'],
      isloading: true,
      sharelink: this.$t('referral.link', {'referralCode': this.$store.getters['user/getUserReferralCode']}),
      emails: [''],
      email_item: '',
      disablesend: true,
      sendingmail: false,
      notifymsg: '',
      copybtn: this.$t('copy'),
      sendmail: this.$t('send.invites'),
      issent: false,
      referralamount: '',
      refereeamount: '',
      referralInfo: null
    }
  },
  created () {
    this.getInfo()

    if (this.referralcode === '' || this.referralcode === null || !this.referralcode) {
      this.getReferralCode()
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
  computed: {
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
      if (typeof this.referralamount === 'undefined' || this.referralamount === '') {
        return 'USD 4'
      }

      return this.referralamount
    },
    refereeAmount () {
      if (typeof this.refereeamount === 'undefined') {
        return 'USD 12'
      }

      return this.refereeamount
    }
  },
  methods: {
    parseReadableDate (date) {
      let newDate = moment(date)
      return newDate.format('Do MMM YY')
    },
    currencySymbol (currencyId) {
      let index = this.countries.findIndex(p => p.id === currencyId.toString())
      return typeof (this.countries[index].symbol) !== 'undefined' ? this.countries[index].symbol : 'RM'
    },
    goTo (type) {
      switch (type) {
        case 'facebook-send':
          if (this.$q.platform.is.cordova) {
            window.facebookConnectPlugin.showDialog({
              method: 'send',
              link: this.sharelink,
              caption: this.$t('social.share.message')
            }, (response) => {
              console.log(response)
            }, (error) => {
              console.error(error)
            })
          } else {
            window.FB.ui({
              method: 'send',
              href: this.sharelink,
              quote: this.$t('social.share.message'),
              hashtag: '#PetBacker'
            }, function (response) {})
          }
          break
        case 'facebook-share':
          if (this.$q.platform.is.cordova) {
            console.log(this.sharelink)
            window.facebookConnectPlugin.showDialog({
              method: 'share',
              href: this.sharelink,
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
              href: this.sharelink,
              quote: this.$t('social.share.message'),
              hashtag: '#PetBacker'
            }, function (response) {})
          }
          break
        case 'whatsapp':
          window.location.href = 'https://wa.me/send?text=' + this.$t('referrals.bemyreferral', { 'referal': this.referralCode, 'commision': '35%', 'breakLine': '%0D%0A' })
          break
      }
    },
    onCopy (copyText) {
      try {
        copyToClipboard(copyText)
        this.$q.notify({
          message: this.$t('copy.success'),
          type: 'positive',
          position: 'top',
          timeout: 1000
        })
        this.notifymsg = this.$t('copy.success')
        this.copybtn = this.$t('copied')
        setTimeout(this.changeCopy, 500)
      } catch (e) {
        bugsnagClient.notify(e)
        this.$q.notify({
          message: this.$t('copy.error'),
          type: 'negative',
          timeout: 1000
        })
      }
    },
    changeCopy () {
      this.copybtn = this.$t('copy')
    },
    changeSendMail () {
      this.issent = false
      this.sendmail = this.$t('send.invites')
    },
    onSMS () {
      let userAgent = navigator.userAgent || navigator.vendor || window.opera
      let smsLink = ''
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        smsLink = 'sms:&body=' + this.$t('referrals.bemyreferral', { 'referal': this.referralCode, 'commision': '35 percent', 'breakLine': '\n' })
      } else {
        smsLink = 'sms:?body=' + this.$t('referrals.bemyreferral', { 'referal': this.referralCode, 'commision': '35 percent', 'breakLine': '\n' })
      }
      window.location.href = smsLink
    },
    onOpenMail () {
      window.location.href = 'mailto:?subject=' + this.$t('referrals.email.subject') + '&body=' + this.$t('referrals.bemyreferral', { 'referal': this.referralCode, 'commision': '35%', 'breakLine': '%0D%0A' })
    },
    onSendMail () {
      console.log('onSendMail ' + this.email_item)
      this.emails = this.email_item.split(',')
      this.sendingmail = true
      let emailTitle = this.$t('referrals.email.subject')
      let msg = this.$t('referrals.bemyreferral', { 'referal': this.referralCode, 'commision': '35%', 'breakLine': '\n' })
      let mailInfo = JSON.stringify({
        'emailInfo': {
          'senderName': this.$store.state.user.username,
          'senderEmail': this.$store.state.user.email,
          'recipients': this.emails,
          'title': emailTitle,
          'message': msg,
          'emailTemplate': 'referral'
        }
      })

      this.$axios.post(`utility/sendemail`, mailInfo, {headers: {'Authorization': this.$store.getters['user/authorizationHeader']}})
        .then((response) => {
          this.sendingmail = false
          this.emails = []
          this.onInputMail()
          this.notifymsg = 'Your email invites has been sent out!'
          // this.$refs.notifymodal.open()
          this.issent = true
          this.sendmail = 'Invites Sent'
          setTimeout(this.changeSendMail, 2000)
          this.$q.notify({
            message: this.$t('email.sent.successful'),
            color: 'green'
          })
        })
        .catch(e => {
          this.sendingmail = false
          this.$q.notify({
            message: this.$t('email.not.valid'),
            color: 'red'
          })
        })
    },
    getInfo () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/referral`, {headers: {'Authorization': this.$store.getters['user/authorizationHeader']}})
        .then((response) => {
          this.referralInfo = response.data.referralInfo
          this.currencyid = response.data.referralInfo.currencyId
          this.totalcommissions = response.data.referralInfo.totalCommissions
          this.referrals = response.data.referralInfo.items
          this.referralamount = response.data.referralInfo.referralAmount
          this.refereeamount = response.data.referralInfo.refereeAmount
        }).catch(e => {
          console.error(e)
        }).finally(_ => {
          this.isloading = false
        })
    },
    getReferralCode () {
      this.$axios.get(`account/${this.$store.state.user.uuid}`, {headers: {'Authorization': this.$store.getters['user/authorizationHeader']}})
        .then((response) => {
          this.referralcode = response.data.accountInfo.referralCode
          this.sharelink = this.$t('referral.link', {'referralCode': response.data.accountInfo.referralCode})
          this.$store.commit('user/updateUserReferralCodeState', response.data.accountInfo.referralCode)
        }).catch(e => {
          console.erorr(e)
        })
    },
    onInputMail () {
      this.disablesend = false
      for (let index in this.emails) {
        this.email_item = this.emails[index]
        this.email_item = this.email_item.replace(/ /g, '')
        this.email_item = this.email_item.replace(/。/g, '.')
        this.email_item = this.email_item.replace(/·/g, '.')
        if (this.validEmail(this.email_item)) {
          // console.log('success')
        } else {
          // console.log('error')
          this.disablesend = true
        }
        console.log('onInputMail ' + this.email_item)
        this.disablesend = this.disablesend || this.email_item.$error
      }
      if (this.emails.length === 0) {
        this.disablesend = true
      }
    },
    validEmail: function (email) {
      let newEmail = email.split(',')
      let count = 0
      newEmail.forEach(function (value, key) {
        var re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        console.log(re.test(value))
        if (!re.test(value)) {
          count++
        }
      })
      if (count === 0) {
        return true
      } else {
        return false
      }
    }
  },
  validations: {
    email_item: {required, email}
  }
}
</script>

<style lang="stylus" scoped>
  .back-img
    height: 100%;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    filter:blur(10px);
    -o-filter:blur(10px);
    -ms-filter:blur(10px);
    -moz-filter:blur(10px);
    -webkit-filter:blur(10px);
    filter: saturate(200%) brightness(75%);
  .mg-left-20
    margin-left: 20px;
  .mg-top-40
    margin-top: 40px;
  .padding-10
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
  .referral-content
    z-index: 2;
  .avatar-content
    text-align: center;
    padding-left: 60px;
    padding-right: 60px;
    @media (max-width: 744px)
      padding-left: 10px;
      padding-right: 10px;
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
    margin-top: -125px;
    padding-left: 24px;
    padding-right: 24px;
    font-size: 14px;
    line-height: 1.43;
    color: #484848;
    background-color: #fff;
    @media (min-width: 744px)
      width: 696px;
  .page-title
    line-height: 1.1;
    text-rendering: optimizelegibility;
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
    height: 65px;
    width: 65px;
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
  .share-box
    border-radius: 15px;
    box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
    position: relative;
    top: -150px;
    margin-top: 50px;
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
  .back-red
    background-color: $negative;
  .back-white
    background-color: white;
  .back-purple
    background-color: $primary;
  .back-green
    background-color: $whatsapp-green;
  .color-white
    color: white;
  .color-black
    color: #484848;
  .border
    border: 1px solid #cccccc;
  .input-email
    min-height: 2.4rem;
  .mail-icon
    height: 18px;
    vertical-align: top;
    padding-top: 1px;
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
    background-color: $neutral;

  .msn-btn
    width: 100%;
    color: white;
    background-color: $facebook-messanger-blue;
  .face-btn
    width: 100%;
    color: white;
    background-color: $facebook-blue;
  .height-60
    height: 60px;
  .send-mail
    min-height: 60px;
</style>
