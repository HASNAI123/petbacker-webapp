<template>
  <q-page padding class="justify-center">
    <div v-if="preloaded" class="row">
        <div class="col-md-12 col-xs-12 q-mb-md">
          <img :src="$q.platform.is.mobile ? 'statics/images/campaign/summary-header-mobile.jpg' : 'statics/images/campaign/summary-header.jpg' " style="display:block;margin-left:auto;margin-right:auto;" :style="{'height': this.$q.platform.is.mobile ? 'auto;' : '', 'width' : this.$q.platform.is.mobile ? '100%' : ''} " />
        </div>
        <div class="col-12 q-my-lg">
          <div class="text-center margin-auto row" style="width: 410px;">
            <q-select :class="this.$q.platform.is.mobile ? 'q-ml-xs col-6 q-mr-sm' : 'q-ml-xl col-6 q-mr-md'" outlined input-debounce="100" style="padding:none;max-width: 190px;margin-bottom:5%;font-size:30px;padding: none" use-input @input="selected" :options="currency" v-model="country" label="Currency">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey q-pa-none">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input
              ref="input"
              v-model="userAmount"
              label="Donation Amount"
              outlined
              :rules="[val => !!val && val >= minimumAmount || `Donation value have to be minimum of ${this.userCurrency} ${this.minimumAmount}`]"
              style="max-width: 150px; font-size: 33px;"
              @input="checkValue"
              class="col-6 input-styling"
            >
            </q-input>
          </div>
        </div>
        <div class="col-md-4 col-xs-12 q-mb-xl q-mt-md margin-auto">
          <div class="text-center row">
            <div class="col-md-6 col-xs-12 q-my-md">
              <q-btn class="q-px-lg text-capitalize row" color="primary" :disable="disableDonate" size="lg" @click.native="onPaypal();paypalPaymentButtonLoading = true" :loading="paypalPaymentButtonLoading" :label="$t('credit.card.donation')" >
              </q-btn>
              <img src="statics/images/donate-now-payment.png" height="38px;" class="row margin-auto" />
            </div>
            <div class="col-md-6 cd-xs-12 margin-auto q-my-md">
              <q-btn class="q-px-lg text-capitalize row " color="primary" :disable="disableDonate" size="lg" @click.native="onBankTransfer();paypalPaymentButtonLoading = true" :loading="paypalPaymentButtonLoading" :label="$t('bank.transfer.donation')" >
              </q-btn>
            </div>
          </div>
        </div>
    </div>
  </q-page>
</template>
<script>
export default {
  data () {
    return {
      country: this.$route.query.currency ? this.$route.query.currency.toUpperCase() : 'USD',
      mobileCode: null,
      preloaded: true,
      paypalPaymentButtonLoading: false,
      headerImg: 'statics/images/campaign/summary-header.jpg',
      bodyImg: '',
      footerImg: '',
      productID: 13,
      userAmount: 30,
      userCurrency: this.$route.query.currency ? this.$route.query.currency.toUpperCase() : 'USD',
      itemName: `Stray Animal Day`,
      pricing: {
        'USD': '20',
        'GBP': '20',
        'EUR': '20',
        'NZD': '20',
        'CAD': '20',
        'AUD': '20',
        'CNY': '200',
        'SGD': '20',
        'HKD': '200',
        'MYR': '40',
        'TWD': '400',
        'CHF': '20',
        'CZK': '200',
        'DKK': '40',
        'HUF': '4000',
        'ILS': '40',
        'JPY': '2000',
        'MXN': '200',
        'NOK': '200',
        'PHP': '400',
        'PLN': '40',
        'SEK': '200',
        'THB': '400'
      },
      currency: [
        'AUD',
        'CAD',
        'CHF',
        'CNY',
        'CZK',
        'DKK',
        'EUR',
        'GBP',
        'HKD',
        'HUF',
        'ILS',
        'JPY',
        'MXN',
        'MYR',
        'NOK',
        'NZD',
        'PHP',
        'PLN',
        'SEK',
        'SGD',
        'THB',
        'TWD',
        'USD'
      ],
      minimumAmount: null,
      disableDonate: false
    }
  },
  created () {
    this.minimumAmount = parseInt(this.pricing[this.userCurrency])
    this.userAmount = this.minimumAmount
    if (this.$q.cookies.has('strayDogDonation')) {
      this.userCurrency = this.$q.cookies.get('strayDogDonation').split(' ')[0]
      this.userAmount = this.$q.cookies.get('strayDogDonation').split(' ')[1]
      this.country = this.userCurrency
    }
  },
  methods: {
    onBankTransfer () {
      if (!this.$store.state.user.access) {
        let COOKIE_EXPIRATION = 1
        this.$q.cookies.set('strayDogDonation', `${this.userCurrency} ${this.userAmount}`, { expires: COOKIE_EXPIRATION })
        this.$q.cookies.set('globalStorageReviewInfoUrl', `${this.$route.path}/bank-transfer`, { expires: COOKIE_EXPIRATION })
        this.$q.cookies.set('donationType', `BankTransfer`, {expires: COOKIE_EXPIRATION})
        this.$router.replace({name: 'Signup'})
        return
      }

      if (!this.$q.cookies.has('strayDogDonation')) {
        this.$q.cookies.set('strayDogDonation', `${this.userCurrency} ${this.userAmount}`, { expires: 1 })
      }

      this.$router.push({name: 'CampaignsBankTransfer'})
    },
    selected (currecy) {
      this.country = currecy
      this.userCurrency = currecy
      if (this.pricing[this.userCurrency] === undefined) {
        this.$q.notify({
          message: `Oops! Country currency selected is not support by us, donate in USD instead.`,
          type: 'negative'
        })
        this.userAmount = this.pricing['USD']
        this.minimumAmount = parseInt(this.pricing['USD'])
        this.userCurrency = 'USD'
        this.country = 'USD'
      } else {
        this.userAmount = this.pricing[this.userCurrency]
        this.minimumAmount = parseInt(this.pricing[this.userCurrency])
      }
    },
    checkValue (value) {
      if (value >= this.minimumAmount) {
        this.disableDonate = false
      } else {
        this.disableDonate = true
      }
    },
    onPaypal () {
      if (!this.$store.state.user.access) {
        let COOKIE_EXPIRATION = 1
        this.$q.cookies.set('strayDogDonation', `${this.userCurrency} ${this.userAmount}`, { expires: COOKIE_EXPIRATION })
        this.$q.cookies.set('globalStorageReviewInfoUrl', this.$route.fullPath, { expires: COOKIE_EXPIRATION })
        this.$q.cookies.set('donationType', `Paypal`, {expires: COOKIE_EXPIRATION})
        this.$router.replace({name: 'Signup'})
        return
      }

      if (!this.$q.cookies.has('strayDogDonation')) {
        this.$q.cookies.set('strayDogDonation', `${this.userCurrency} ${this.userAmount}`, { expires: 1 })
      }
      this.$axios.get(`users/${this.$store.state.user.uuid}/expresscheckout?currency=${this.userCurrency}&price=${this.userAmount}&item=Stray%20Dog%20Day&payment_method_id=2&is_web=1&product_id=13&redirect_success_url=https%3A%2F%2Fweb.petbacker.com%2Fcampaigns%2Fstray-dog-day-2020%2Fpaymentsuccess%3Fcurrency%3D${this.userCurrency}%26uname%3Dchi04%26pname%3DStray+dog+promo%26amount%3D${this.userAmount}&redirect_cancelled_url=https%3A%2F%2Fweb.petbacker.com%2Fcampaigns%2Fstray-dog-day-2020%2Fpayment%3Fcurrency%3D${this.userCurrency}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        window.open(response.data.expressCheckoutInfo.paymentUrl, '_self')
        setTimeout(() => {
          this.paypalPaymentButtonLoading = !this.paypalPaymentButtonLoading
        }, 4500)
      }).catch(error => {
        if (error.response.data.code === 8 || error.response.data.message === 'Receiving country does not support the transaction currency.') {
          // try again for unsupported currency (try in USD)
          this.userCurrency = 'USD'
          this.onPaypal()
        } else {
          let errorMessage = error.response.data.message ? error.response.data.message : this.$t('something.wrong.gateway')
          this.paypalPaymentButtonLoading = !this.paypalPaymentButtonLoading
          this.$q.notify({
            message: errorMessage,
            type: 'negative'
          })
        }
      })
    }
  }
}
</script>
