<template>
    <q-page padding class="row justify-center">
      <div style="min-width: 1029px;max-width: 1030px;">
        <div class="title col-md-12" id="header-title" style="padding-bottom: -10px;">
          <h4><strong>{{$t('notifications.promotions')}}</strong></h4>
        </div>
        <div class="items-start col-md-12" v-if="this.items != null">
            <!-- Promo Cars -->
            <q-card class="q-ma-sm cards center-align" v-for="item in this.items" :key="item.id">
              <img :src="item.imageLink" />
              <q-card-section id="title">
                <p style="margin-bottom: 0px"><strong>{{item.name}}</strong></p>
              </q-card-section>
              <q-card-section id="summary">
                <p>{{item.summary}}</p>
              </q-card-section>
              <q-separator/>
              <q-card-actions>
                <q-btn color="primary" style="left: 183px" @click="viewPromo(item.id, item.name, item.price, item.currency, item.description)">{{$t('view.promo')}}</q-btn>
              </q-card-actions>
            </q-card>
        </div>
      </div>
        <!-- View Promo Modal -->
        <q-dialog v-model="viewDetails" :maximized="$q.platform.is.mobile" :transition-show="this.transitionShow" :transition-hide="this.transitionHide">
          <q-card>
                <q-toolbar class="modal-header primary">
                  <q-btn flat round dense v-close-popup style="color: black;" icon="keyboard_arrow_left" />
                  <q-toolbar-title style="color: black; text-align: center;" >
                    {{this.productName}}
                  </q-toolbar-title>
                </q-toolbar>
                <q-card-section>
                    <div v-html="this.description"></div>
                </q-card-section>
                <q-card-section style="padding: 0px">
                    <div class="text-center mg-top-10">
                      <q-btn class="full-width get-now" color="primary" @click="onPaypal" :loading="paypalPaymentButtonLoading">GET THIS NOW</q-btn>
                    </div>
                </q-card-section>
          </q-card>
        </q-dialog>
    </q-page>
</template>

<script>
import languages from 'assets/languages.json'
import countriesDetails from 'assets/countries.json'
import { setTimeout } from 'timers'

export default {
  data () {
    return {
      viewDetails: false,
      currency: 'MYR',
      price: 0,
      productID: -1,
      productName: null,
      description: null,
      paypalPaymentButtonLoading: false,
      items: null,
      transitionShow: null,
      transitionHide: null,
      tempHtml: []
    }
  },
  created () {
    this.getInfo()
    if (this.$store.getters['user/getUserAccessState'] && this.$q.cookies.get('globalStorageReviewListingInfo')) {
      let product = this.$q.cookies.get('globalStorageReviewListingInfo')
      this.productName = product.productName
      this.price = product.price
      this.productID = product.productID
      this.currency = product.currency

      //  clear temp storage
      this.$q.cookies.remove('globalStorageReviewInfoUrl')
      this.$q.cookies.remove('globalStorageReviewListingInfo')

      this.onPaypal()
    }
  },
  methods: {
    getContent (htmlContent) {
      let temp = document.createElement('div')
      temp.innerHTML = htmlContent
      return temp.querySelector('div[id = "content"]').innerHTML
    },
    getSummary (htmlContent) {
      let temp = document.createElement('div')
      temp.innerHTML = htmlContent
      return temp.querySelector('div[id = "summary"]').getElementsByTagName('p')[0].innerHTML
    },
    getImageSrc (htmlContent) {
      let temp = document.createElement('div')
      temp.innerHTML = htmlContent
      return temp.querySelector('div[id = "hero"]').getElementsByTagName('img')[0].currentSrc
    },
    viewPromo (productID, productName, price, countryID, description) {
      this.productID = productID
      this.productName = productName
      this.price = price
      this.currency = this.getCountryCurrency(countryID)
      this.description = this.getContent(description)

      if (this.$q.platform.is.mobile) {
        this.transitionShow = 'slide-left'
        this.transitionHide = 'slide-right'
      }

      this.viewDetails = true
    },
    getCountryCurrency (countryID) {
      for (let country in countriesDetails) {
        if (countryID.toString() === countriesDetails[country].id) {
          return countriesDetails[country].currencyCode
        }
      }

      return 'INVALID COUNTRY ID'
    },
    getLanguageID () {
      for (let language in languages) {
        if (this.$store.getters['user/getCurrentLanguage'] === languages[language].value) {
          return languages[language].id
        }
      }
    },
    getInfo () {
      this.$axios.get(`products?language_id=${this.getLanguageID()}&country_id=${this.$store.getters['user/getUserMobileCountryId']}&product_type_id=3`
      ).then(response => {
        this.items = response.data.question
      }).catch(error => {
        console.log(error)
      })
    },
    onPaypal () {
      if (!this.$store.getters['user/getUserAccessState']) {
        let productInfo = {
          'productName': this.productName,
          'price': this.price,
          'productID': this.productID,
          'currency': this.currency
        }

        this.$q.cookies.set('globalStorageReviewInfoUrl', '/products/subscriptions')
        this.$q.cookies.set('globalStorageReviewListingInfo', productInfo)
        this.$router.replace('/')
        return
      }
      let itemName = this.productName.split(' ').join('+')
      this.paypalPaymentButtonLoading = !this.paypalPaymentButtonLoading
      this.$axios.get(`users/${this.$store.state.user.uuid}/expresscheckout?item=${itemName}&payment_method_id=2&price=${this.price}&product_id=${this.productID}&currency=${this.currency}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        //  open paypal page
        window.open(response.data.expressCheckoutInfo.paymentUrl, '_self')
        setTimeout(() => {
          this.paypalPaymentButtonLoading = !this.paypalPaymentButtonLoading
        }, 2500)
      }).catch(error => {
        let errorMessage = error.response.data.message ? error.response.data.message : this.$t('something.wrong.gateway')
        this.paypalPaymentButtonLoading = !this.paypalPaymentButtonLoading
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
div.title
    display: block
    padding-left: 10px
    margin-bottom: 0px
.title h4
    margin-bottom: 15px

.cards
    width: 300px
    display: inline-block

.modal-header
    background-color: white !important
.get-now
    height: 55px

/* Mobile Display */
@media only screen and (max-width: 767px)
  #header-title
    display: none
  .cards
    display: block
    margin-top: 30px

</style>
