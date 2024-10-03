<template>
    <q-page class="row justify-center">
        <div class="col-md-6 col-sm-12" >
            <div :class="this.$q.platform.is.mobile ? 'q-pl-md' : ''">
              <h6 class="col-md-12 text-weight-bold q-mb-md">{{$t('petbacker.premium.protection.title')}}</h6>
            </div>
            <div class="border-1 q-pa-lg">
              <div class="row q-mb-md" >
                <p class="text-label col-xs-12 col-md-12 q-mb-xs">{{$t('plan.type')}}</p>
                <p class="text-label col-xs-12 col-md-12" style="color:black">{{productId === '14' ? 'Basic' : 'Plus'}}</p>
              </div>
              <div class="row q-mb-md">
                <p class="text-label col-xs-12 col-md-12 q-mb-xs">{{$t('validity.dates')}}</p>
                <p class="text-label col-xs-12 col-md-12" style="color:black">{{this.startDate}} - {{this.endDate}} - 1 {{$t('year')}}</p>
              </div>
              <div class="row q-mb-md">
                <p class="text-label col-xs-12 col-md-12 q-mb-xs">{{$t('pet.covered')}}</p>
                <p class="text-label col-xs-12 col-md-12" style="color:black">1 {{$t('pet')}}</p>
              </div>
              <q-card flat class="text-white q-pa-md q-mb-md" style="background-color:#6E8CA0;border-radius:15px;">
                <q-item>
                  <q-item-section>
                    <q-item-label style="font-size:18px;">{{$t('gross.premium')}}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label class="text-white q-mr-md" style="font-size:18px;">{{this.currency}} {{this.price}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator color="white" spaced inset/>
                <q-item class="text-weight-bold">
                  <q-item-section>
                    <q-item-label style="font-size:18px;">{{$t('total.payable.amount')}}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label class="text-white q-mr-md" style="font-size:18px;">{{this.currency}} {{this.price}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-card>
              <div class="row">
                  <div class="col-xs-12">
                      <q-checkbox v-model="checked" :label="$t('agree.terms.conditions')" />
                  </div>
              </div>
              <div class="col-xs-12 q-pt-md row" >
                  <div :class="$q.platform.is.mobile ? 'margin-auto' : 'col-md-4 q-mx-sm q-ml-lg'">
                    <q-btn size="lg" class="q-mt-xs text-white" style="background-color:#1A3386;border-radius:10px;" :title="!checked ? 'Please Accept Terms and Condtions' : ''" @click.native="onPaypal()" :class="!checked ? 'disable' : ''" :loading="paypalPaymentButtonLoading"  :label="$t('credit.debit.card')"></q-btn>
                    <div class="col-xs-12 col-md-12 q-pt-sm">
                        <img src="statics/images/donate-now-payment.png" alt="PayPal Logo" style="height: 28px;margin-left: 5%;">
                    </div>
                  </div>
                  <div :class="$q.platform.is.mobile ? 'margin-auto' : 'col-md-4'" v-if="payNowShow">
                    <q-btn size="lg" style="border-radius:10px;width:218px;"  color="primary" :title="!checked ? 'Please Accept Terms and Condtions' : ''" @click.native="onPayNow()" :loading="payNowButtonLoading" :class="!checked ? 'disable' : ''"  class="q-my-xs" :label="$t('paynow.payment')"></q-btn>
                    <div class="col-xs-12 col-md-12 q-pt-sm">
                    </div>
                  </div>
                  <div :class="$q.platform.is.mobile ? 'margin-auto' : 'col-md-4'" v-if="weChatShow">
                    <q-btn size="lg" style="border-radius:10px;width:218px;"  color="primary" :title="!checked ? 'Please Accept Terms and Condtions' : ''" @click.native="onWeChat()" :loading="weChatButtonLoading" :class="!checked ? 'disable' : ''"  class="q-my-xs" :label="$t('wechat.payment')"></q-btn>
                    <div class="col-xs-12 col-md-12 q-pt-sm">
                    </div>
                  </div>
                  <div :class="$q.platform.is.mobile ? 'margin-auto' : 'col-md-4'" v-if="boostShow">
                    <q-btn size="lg" style="border-radius:10px;width:218px;background-color:#F22E16;" :title="!checked ? 'Please Accept Terms and Condtions' : ''" @click.native="onBoost()" :loading="boostPaymentButtonLoading" :class="!checked ? 'disable' : ''"  class="q-my-xs text-white" :label="'Pay with ' + $t('boost')"></q-btn>
                    <div class="col-xs-12 col-md-12 q-pt-sm">
                    </div>
                  </div>
                  <div :class="$q.platform.is.mobile ? 'margin-auto' : 'col-md-3'" v-if="bankTransferShow">
                    <q-btn size="lg" style="border-radius:10px;width:218px;"  color="primary" :title="!checked ? 'Please Accept Terms and Condtions' : ''" @click.native="onBankTransfer()"  :loading="bankTransferButtonLoading" :class="!checked ? 'disable' : ''"  class="q-my-xs" :label="$t('checkout.bank.transfer')"></q-btn>
                    <div class="col-xs-12 col-md-12 q-pt-sm">
                    </div>
                  </div>
                  <!--<q-btn size="lg" color="primary" :title="!checked ? 'Please Accept Terms and Condtions' : ''" @click.native="onBharatPe()" v-if="bharatPeShow" :disabled="!checked || bharatPeButtonLoading" :loading="bharatPeButtonLoading" class="full-width q-my-xs" :label="$t('bharatpe.payment')"></q-btn>-->
              </div>
            </div>
            <br/>
            <div class="q-pa-md">
              <p style="font-size: 16px;font-weight:500;">{{$t('requests.petboarding.agreement.termsandcondition')}}</p>
              <div style="font-size: 15px;font-weight: 400;">
                <ol type="i">
                  <li>{{$t('premium.protection.policy.one')}}</li>
                  <br/>
                  <li>{{$t('premium.protection.policy.two')}}</li>
                  <br/>
                  <li>{{$t('premium.protection.policy.grace.period')}}</li>
                  <br/>
                  <li>{{$t('premium.protection.policy.three')}}</li>
                </ol>
              </div>
            </div>
        </div>
        <q-dialog v-model="handle400msgmodal" :content-css="{width: 'auto', height: 'fit-content', background: 'transparent', boxShadow: 'none'}">
            <q-card>
                <q-card-section>
                <div class="tip-bulb">
                    <img src="statics/images/logo-mid.jpg" class="tip-bulb-image">
                </div>
                <div class="bg-white-self">
                    <div class="row q-px-md column">
                    <div class="q-title q-pt-xl text-center tip-title"> {{  $t('app.footer.petbacker')}} </div>
                    </div>
                    <div class="row justify-center">
                        <div class="col-12 text-center q-pa-md tip-desc">
                            <span>{{msg400}}</span>
                        </div>
                    </div>
                    <div class='full-width q-px-md'>
                        <q-btn class="full-width" color="primary" :label="$t('ok')" @click.native="handle400msgmodal=false" />
                    </div>
                    <div class="row q-py-sm q-mx-auto">
                    </div>
                </div>
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
import country from 'assets/countries.json'
import moment from 'moment'
export default {
  data () {
    return {
      checked: false,
      currency: null,
      bankTransferButtonLoading: false,
      paypalPaymentButtonLoading: false,
      boostPaymentButtonLoading: false,
      payNowButtonLoading: false,
      bharatPeButtonLoading: false,
      weChatButtonLoading: false,
      bankTransferAvailOn: ['MYR', 'INR', 'SGD', 'TWD'],
      bankTransferShow: false,
      boostAvailableOn: ['MYR'],
      boostShow: false,
      weChatAvailableOn: ['HKD'],
      weChatShow: false,
      bharatPeAvailableOn: ['INR'],
      bharatPeShow: false,
      payNowAvailableOn: ['SGD'],
      payNowShow: false,
      handle400msgmodal: false,
      msg400: '',
      mobileView: this.$q.platform.is.mobile,
      price: 0,
      title: this.$t('petbacker.premium.protection.title'),
      productId: '14',
      supportedCurrency: ['MYR', 'SGD', 'USD', 'TWD', 'HKD'],
      pricing: {
        '14': {
          'USD': '20',
          'SGD': '20',
          'HKD': '200',
          'MYR': '80',
          'TWD': '80'
        },
        '15': {
          'USD': '50',
          'SGD': '50',
          'HKD': '500',
          'MYR': '200',
          'TWD': '200'
        }
      },
      startDate: moment().format('DD/MM/YYYY'),
      endDate: moment().add(1, 'Y').format('DD/MM/YYYY')
    }
  },
  created () {
    this.checkQuery()
    this.checkPaymentOptions()
    this.checkPrice()
  },
  methods: {
    checkTerms () {
      let vm = this
      this.$q.dialog({
        title: vm.$t('reminder'),
        message: vm.$t('accept.terms.condition.before.payment'),
        ok: vm.$t('ok')
      }).onOk(() => {
      })
    },
    checkQuery () {
      // country currency
      if (this.$route.query.country_id) {
        this.currency = this.$_.findWhere(country, {'id': this.$route.query.country_id}).currencyCode
      } else {
        this.currency = 'USD'
      }

      // product Id
      if (this.$route.query.product_id) {
        this.productId = this.$route.query.product_id
      }
    },
    checkPaymentOptions () {
      if (this.bankTransferAvailOn.includes(this.currency)) {
        this.bankTransferShow = true
      } else {
        this.bankTransferShow = false
      }

      if (this.boostAvailableOn.includes(this.currency)) {
        this.boostShow = true
      } else {
        this.boostShow = false
      }

      if (this.weChatAvailableOn.includes(this.currency)) {
        this.weChatShow = true
      } else {
        this.weChatShow = false
      }

      /*  if (this.bharatPeAvailableOn.includes(this.currency)) {
        this.bharatPeShow = true
      } else {
        this.bharatPeShow = false
      } */

      if (this.payNowAvailableOn.includes(this.currency)) {
        this.payNowShow = true
      } else {
        this.payNowShow = false
      }
    },
    checkPrice () {
      if (this.supportedCurrency.includes(this.currency)) {
        this.price = this.pricing[this.productId][this.currency]
      } else {
        this.currency = 'USD'
        this.price = this.pricing[this.productId][this.currency]
      }
    },
    createLocalStorage (paymentMethod) {
      if (this.$q.cookies.has('paymentType')) {
        this.$q.cookies.remove('paymentType')
        this.$q.cookies.remove('premiumCarePackage')
        this.$q.cookies.remove('globalStorageReviewInfoUrl')
      }

      let packageDetail = {}
      packageDetail.price = this.price
      packageDetail.title = this.title
      packageDetail.productId = this.productId
      packageDetail.currency = this.currency
      packageDetail.paymentMethod = paymentMethod
      packageDetail.startDate = this.startDate
      packageDetail.endDate = this.endDate
      this.$q.localStorage.set('premiumCarePackage', packageDetail)
    },
    onPayNow () {
      if (!this.checked) {
        this.checkTerms()
        return
      }
      this.payNowButtonLoading = !this.payNowButtonLoading
      this.createLocalStorage('PayNow')
      this.$router.replace({name: 'PayNow'})
    },
    onWeChat () {
      if (!this.checked) {
        this.checkTerms()
        return
      }
      this.weChatButtonLoading = !this.weChatButtonLoading
      this.createLocalStorage('WeChat')
      this.$router.replace({name: 'WeChat'})
    },
    onBharatPe () {
      if (!this.checked) {
        this.checkTerms()
      }
      this.bharatPeButtonLoading = !this.bharatPeButtonLoading
      this.createLocalStorage('onBharatPe')
      this.$router.replace({name: 'BharatPe'})
    },
    onBankTransfer () {
      if (!this.checked) {
        this.checkTerms()
        return
      }
      this.bankTransferButtonLoading = !this.bankTransferButtonLoading
      this.createLocalStorage('Bank Transfer')
      this.$router.replace({name: 'BankTransfer'})
    },
    onPaypal () {
      if (!this.checked) {
        this.checkTerms()
        return
      }

      this.createLocalStorage('Paypal')
      if (!this.$store.state.user.access) {
        let COOKIE_EXPIRATION = 1
        this.$q.cookies.set('premiumCarePackage', `${this.productId}:${this.currency}:${this.price}:${this.title}`, { expires: COOKIE_EXPIRATION })
        this.$q.cookies.set('globalStorageReviewInfoUrl', this.$route.fullPath, { expires: COOKIE_EXPIRATION })
        this.$q.cookies.set('paymentType', 'Paypal')
        this.$router.replace({name: 'Signup'})
        return
      }

      this.paypalPaymentButtonLoading = !this.paypalPaymentButtonLoading
      this.$axios.get(`users/${this.$store.state.user.uuid}/expresscheckout?currency=${this.currency}&price=${this.price}&item=${this.title}&payment_method_id=2&product_id=${this.productId}&is_web=1&redirect_success_url=https%3A%2F%2Fweb.petbacker.com%2Fsubscriptions%2Fpayment-success%3Fcurrency%3D${this.currency}%26success%3D1&redirect_cancelled_url=https%3A%2F%2Fweb.petbacker.com%2Fsubscriptions%2Fpremium-protection%3Fcountry_id%3D${this.$route.query.country_id}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        window.open(response.data.expressCheckoutInfo.paymentUrl, '_self')
        this.paypalPaymentButtonLoading = !this.paypalPaymentButtonLoading
      }).catch(error => {
        let errorMessage = error.response.data.message ? error.response.data.message : this.$t('something.wrong.gateway')
        this.paypalPaymentButtonLoading = !this.paypalPaymentButtonLoading
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      })
    },
    onBoost () {
      if (!this.checked) {
        this.checkTerms()
        return
      }
      this.createLocalStorage('Boost')
      if (!this.$store.state.user.access) {
        let COOKIE_EXPIRATION = 1
        this.$q.cookies.set('premiumCarePackage', `${this.productId}:${this.currency}:${this.price}:${this.title}:${this.$route.query.country_id}`, { expires: COOKIE_EXPIRATION })
        this.$q.cookies.set('globalStorageReviewInfoUrl', this.$route.fullPath, { expires: COOKIE_EXPIRATION })
        this.$q.cookies.set('paymentType', 'Boost')
        this.$router.replace({name: 'Signup'})
        return
      }

      this.boostPaymentButtonLoading = !this.boostPaymentButtonLoading
      let boostSprintf = `payments/boost/initiate?currency=%s&amount=%s&remark=%s&productid=${this.productId}&payment_method_id=6&redirectURL=%s`
      let boostUrl = boostSprintf.sprintf(
        this.currency,
        this.price,
        encodeURI(this.title),
        `${window.location.origin}/subscriptions/payment-success?currency=${this.currency}`
      )

      this.$axios.get(boostUrl, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.$q.cookies.set('boostPaymentId', response.data.paymentId)
        window.location.href = response.data.checkoutURI
      }).catch(error => {
        let errorMessage = error.response.data.message ? error.response.data.message : this.$t('something.wrong.gateway')
        this.boostPaymentButtonLoading = !this.boostPaymentButtonLoading
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      })
    }
  }
}
</script>
<style lang="stylus">
.text-label
 color: #6E8CA0
 font-weight: 600
 font-size: 18px
.disable
  opacity: 0.5
</style>
