import axios from 'axios'
import store from '../store'
import countries from '../assets/countries'
import underscore from 'underscore'
// const crypto = require('crypto-js')

export default async function createCheckoutSession (href, invoiceAmount, txnDesc, errorUrl, completeUrl, callbackUrl, referenceId) {
  const apiKey = process.env.TAZAPAY_API_KEY
  const signaturSecret = process.env.TAZAPAY_SIGNATURE_SECRET
  var concatString = apiKey + ':' + signaturSecret
  var encodedAuth = Buffer.from(concatString).toString('base64')
  var currencyCode = underscore.findWhere(countries, {'id': store.getters['user/getUserPrefferedCurrency'].toString()}).currencyCode

  var paymentMethods = await axios.get(`https://pbapi.forwen.com/v5${href}`, {
    headers: {
      'Authorization': store.getters['user/authorizationHeader']
    }
  }).then((response) => {
    return response.data.tazaData.payment_methods
  }).catch((error) => {
    return error
  })

  const requestBody = JSON.stringify({
    buyer: {
      ind_bus_type: 'Individual',
      email: store.getters['user/getUserEmail'],
      country: store.getters['geolocation/geopluginCountryCode'],
      first_name: store.getters['user/getUserName'],
      last_name: ' - ',
      business_name: 'Petbacker' // optional, can change later on
    },
    fee_paid_by: 'buyer',
    fee_percentage: 0,
    invoice_currency: currencyCode,
    invoice_amount: invoiceAmount,
    txn_description: txnDesc,
    payment_methods: paymentMethods,
    callback_url: callbackUrl,
    complete_url: completeUrl,
    error_url: errorUrl,
    reference_id: referenceId
  })

  const requestHeader = {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: 'Basic ' + encodedAuth
    }
  }

  try {
    const resp = await axios.post(`${process.env.TAZAPAY_API_URL}checkout`, requestBody, requestHeader)
    store.commit('user/updateTazapayToken', resp.data.data.token)
    return resp.data.data.token
  } catch (err) {
    return err
  }
}
