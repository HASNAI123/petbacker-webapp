import { createCheckoutSession } from '../assets/tazapay-create-checkout.js'

var token = await createCheckoutSession()
  console.log(token)

const options = {
    clientToken: token, // Use the token obtained at step2.
    callbacks: {
      onPaymentSuccess: () => { console.log ("success") },
      onPaymentFail: () => { console.log ("fail") },
      onPaymentMethodSelected: () => { console.log ("onPaymentMethodSelected") }, // optional
      onPaymentCancel: () => { console.log ("onPaymentCancel") }, // optional
    },
    style: {}, // optional, for customising your integration,
    config: {
      redirectionTarget: "self" // optional -> "self" or "new_window"
    },
  };

  window.tazapay.checkout(options);
