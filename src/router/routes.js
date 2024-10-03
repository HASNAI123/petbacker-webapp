/* eslint-disable */
export default [{
  path: '/',
  component: () => import('layouts/default.vue'),
  children: [{
      path: '',
      component: () => import('pages/Index.vue'),
      name: 'Index'
    },
    // Sign Up
    {
      path: 'signup',
      component: () => import('pages/Signup.vue'),
      name: 'Signup'
    },
    {
      path: 'signup/referral',
      component: () => import('pages/ReferralSignup.vue'),
      name: 'ReferralSignup'
    },
    {
      path: 'signup/email',
      component: () => import('pages/SignupEmail.vue'),
      name: 'SignupEmail'
    },
    {
      path: 'r/:code',
      component: () => import('pages/ReferralSignup.vue'),
      name: 'AlternativeReferralSignup'
    },
    // Login
    {
      path: 'login/email',
      component: () => import('pages/LoginEmail.vue'),
      name: 'LoginEmail'
    },
    {
      path: 'login/facebook',
      component: () => import('pages/LoginFacebook.vue'),
      name: 'LoginFacebook'
    },
    {
      path: 'oauth/facebook/login',
      component: () => import('pages/OAuthFacebook.vue'),
      name: 'OAuthFacebook'
    },
    // mobile phone dashboard
    {
      path: 'dashboard',
      component: () => import('pages/MobileDashboard.vue'),
      name: 'MobileDashboard',
      meta: {
        requiresAuth: true
      }
    },
    // Verify
    {
      path: 'user/confirm-email',
      component: () => import('pages/ConfirmEmail.vue'),
      name: 'ConfirmEmail'
    },
    {
      path: 'user/prompt-phone',
      component: () => import('pages/PromptPhone.vue'),
      name: 'PromptPhone',
      props: { settings: 'yes' },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'user/verify-phone',
      component: () => import('pages/VerifyPhone.vue'),
      name: 'VerifyPhone',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'user/verification',
      component: () => import('pages/Verification.vue'),
      name: 'Verification'
    },
    {
      path: 'thank-you',
      component: () => import('pages/ThankYou.vue'),
      name: 'ThankYou',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'forgot-password',
      component: () => import('pages/ForgotPassword.vue'),
      name: 'ForgotPassword'
    },
    {
      path: 'user/term',
      component: () => import('pages/Term.vue'),
      name: 'Term'
    },
    {
      path: 'requests',
      component: () => import('pages/Requests.vue'),
      name: 'Requests',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'requests/:requestId',
      component: () => import('pages/RequestSummary.vue'),
      name: 'RequestSummary',
      meta: {
        requiresAuth: true
      }
    },
    // Moment
    {
      path: 'moments',
      component: () => import('pages/Moments.vue'),
      name: 'Moments',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'moments/:momentId',
      component: () => import('pages/MomentPost.vue'),
      name: 'MomentPost',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'moments/:userId/profile',
      component: () => import('pages/MomentsProfile.vue'),
      name: 'MomentsProfile',
      meta: {
        requiresAuth: true
      }
    },
    // Job Center
    {
      path: 'jobs',
      component: () => import('pages/Jobs.vue'),
      name: 'Jobs',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'jobs/calendar',
      component: () => import('pages/JobCalendar.vue'),
      name: 'JobCalendar',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'jobs/:taskId',
      component: () => import('pages/JobSummary.vue'),
      name: 'JobSummary',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'jobs/:taskId/quotes',
      component: () => import('pages/JobQuote.vue'),
      name: 'JobQuote',
      meta: {
        requiresAuth: true
      }
    },
    // profiles
    // (User)
    {
      path: 'profile',
      component: () => import('pages/Profile.vue'),
      name: 'Profile',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'profile/wallet',
      component: () => import('pages/AccountHistory.vue'),
      name: 'AccountHistory',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'profile/documents',
      component: () => import('pages/IdentityVerification.vue'),
      name: 'IdentityVerification',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'profile/badges',
      component: () => import('pages/Badges.vue'),
      name: 'Badges',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'profile/certificates',
      component: () => import('pages/Certificates.vue'),
      name: 'Certificates',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'profile/steps-left',
      component: () => import('pages/StepsLeft.vue'),
      name: 'StepsLeft',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'profile/rewards',
      component: () => import('pages/Rewards.vue'),
      name: 'Rewards',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'profile/:userId',
      component: () => import('pages/PublicProfile.vue'),
      name: 'PublicProfile',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'profile/:userId/listings',
      component: () => import('pages/MyListings.vue'),
      name: 'MyListings',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'profile/:userId/edit',
      component: () => import('pages/EditProfile.vue'),
      name: 'EditProfile',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'profile/communications',
      component: () => import('pages/Communications.vue'),
      name: 'Communications',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'profile/about-me',
      component: () => import('pages/AboutMe.vue'),
      name: 'AboutMe',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'settings/blocked-accounts',
      component: () => import('pages/BlockedAccounts.vue'),
      name: 'BlockedAccounts',
      meta: {
        requiresAuth: true
      }
    },
    // Settings
    {
      path: 'settings',
      component: () => import('pages/Settings.vue'),
      name: 'Settings',
      meta: {
        requiresAuth: true
      }
    },
    // Edit Listing
    {
      path: 'profile/listings/:listingId/edit',
      component: () => import('pages/EditListing.vue'),
      name: 'EditListing',
      meta: {
        requiresAuth: true
      }
    },
    // Payout
    {
      path: 'payout',
      component: () => import('pages/Payout.vue'),
      name: 'Payout',
      meta: {
        requiresAuth: true
      }
    },
    // Dog Walking
    {
      path: 'dog-walk',
      component: () => import('pages/DogWalk.vue'),
      name: 'DogWalk',
      meta: {
        requiresAuth: true
      }
    },
    // (Pet)
    {
      path: 'pets',
      component: () => import('pages/MyPets.vue'),
      name: 'MyPets',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'pets/:petId',
      component: () => import('pages/PetProfile.vue'),
      name: 'PetProfile',
      meta: {
        requiresAuth: true
      }
    },
    // Referrals
    {
      path: 'referrals',
      component: () => import('pages/Referrals.vue'),
      name: 'Referrals',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'referrals/copy',
      component: () => import('pages/ReferralsCopy.vue'),
      name: 'ReferralsCopy',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'referrals/welcome',
      component: () => import('pages/ReferralsWelcome.vue'),
      name: 'ReferralsWelcome',
      meta: {
        requiresAuth: true
      }
    },
    // Explore
    {
      path: 'explore/backers-nearby',
      component: () => import('pages/BackersNearby.vue'),
      name: 'BackersNearby',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'explore/backers-nearby/:listingId',
      component: () => import('pages/Listing.vue'),
      name: 'Listing',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'explore/pets-in-community',
      component: () => import('pages/PetsInCommunity.vue'),
      name: 'PetsInCommunity',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'explore/blogs',
      component: () => import('pages/Blogs.vue'),
      name: 'Blogs',
      meta: {
        requiresAuth: true
      }
    },
    // Favorited Listings
    {
      path: 'favorited-listings',
      component: () => import('pages/FavoritedListings.vue'),
      name: 'FavoritedListings',
      meta: {
        requiresAuth: true
      }
    },
    // Create Listing
    {
      path: 'create-listing/:serviceId',
      component: () => import('pages/CreateListing.vue'),
      name: 'CreateListing',
      meta: {
        requiresAuth: true
      }
    },
     // Create Listing
     {
      path: 'listing/:listingId/share',
      component: () => import('pages/ShareListing.vue'),
      name: 'ShareListing',
      meta: {
        requiresAuth: true
      }
    },
    // Requests/Jobs
    {
      path: 'requests/:requestId/edit',
      component: () => import('pages/EditRequest.vue'),
      name: 'EditRequest',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'requests/:requestId/view',
      component: () => import('pages/ViewRequest.vue'),
      name: 'ViewRequest',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'job/:taskId/view',
      component: () => import('pages/ViewRequest'),
      name: 'ViewJob',
      meta: {
        requiresAuth: true
      }
    },
    // Rebooking
    {
      path: 'rebooking',
      component: () => import('pages/Rebooking.vue'),
      name: 'Rebooking',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'requests/:requestId/book/:serviceUserId',
      component: () => import('pages/BookAgainRequest.vue'),
      name: 'BookAgainRequest',
      meta: {
        requiresAuth: true
      }
    },
    // Inbox
    {
      path: 'messages',
      component: () => import('pages/Messages.vue'),
      name: 'Messages',
      meta: {
        requiresAuth: true
      }
    },
    // Chat
    {
      path: 'chat/job/:taskId',
      component: () => import('pages/ChatJob.vue'),
      name: 'JobChat',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'chat/request/:request/response/:response',
      component: () => import('pages/Chat.vue'),
      name: 'Chat',
      meta: {
        requiresAuth: true
      }
    },
    // Services
    {
      path: 'services',
      component: () => import('pages/Services.vue'),
      name: 'Services'
    },
    {
      path: 'services/:uri',
      component: () => import('pages/CreateRequest.vue'),
      name: 'CreateRequest'
    },
    {
      path: 'request-submitted/:requestReference',
      component: () => import('pages/RequestSubmitted.vue'),
      name: 'RequestSubmitted',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'services/form/json',
      component: () => import('pages/ServiceFormJson.vue'),
      name: 'ServiceFormJson',
      meta: {
        requiresAuth: true
      }
    },
    // Sponsor (Rapid Pro)
    {
      path: 'sponsor',
      component: () => import('pages/Sponsor.vue'),
      name: 'Sponsor',
      meta: {
        requiresAuth: true
      }
    },
    // Subscription Products
    // (premium-protection)
    {
      path: 'products/subscriptions',
      component: () => import('pages/Subscription.vue'),
      name: 'Subscription'
    },
    {
      path: 'subscriptions/premium-protection',
      component: () => import('pages/PremiumProtection.vue'),
      name: 'PremiumProtection'
    },
    {
      path: 'subscriptions/payment-success',
      component: () => import('pages/SubscriptionPaymentSuccess.vue'),
      name: 'SubscriptionPaymentSuccess'
    },
    // Campaigns
    // (stray dog day)
    {
      path: 'campaigns/stray-dog-day-2020/payment',
      component: () => import('pages/Campaigns.vue'),
      name: 'Campaigns'
    },
    {
      path: 'campaigns/stray-dog-day-2020/payment/bank-transfer',
      component: () => import('pages/CampaignsBankTransfer.vue'),
      name: 'CampaignsBankTransfer',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'campaigns/stray-dog-day-2020/paymentsuccess',
      component: () => import('pages/CampaignsPaymentSuccess.vue'),
      name: 'CampaignsPaymentSuccess',
      meta: {
        requiresAuth: true
      }
    },
    // Review
    {
      path: 'request/:request/response/:response/review',
      component: () => import('pages/ReviewVerified.vue'),
      name: 'ReviewVerified',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'request/:request/response/:response/review/thank-you',
      component: () => import('pages/ReviewVerifiedThankYou.vue'),
      name: 'ReviewVerifiedThankYou',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'listings/:serviceUserId/reviews',
      component: () => import('pages/Review.vue'),
      name: 'Review'
    },
    {
      path: 'listings/:serviceUserId/reviews/thank-you',
      component: () => import('pages/ReviewThankYou.vue'),
      name: 'ReviewThankYou',
      meta: {
        requiresAuth: true
      }
    },
    // Boostopia
    {
      path: 'product/:productId/checkout',
      component: () => import('pages/ProductCheckout.vue'),
      name: 'ProductCheckout',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'product/:productId/success-payment',
      component: () => import('pages/ProductPaymentSuccess.vue'),
      name: 'ProductPaymentSuccess',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'boostopia',
      component: () => import('pages/Boostopia.vue'),
      name: 'Boostopia'
    },
    {
      path: 'boostopia/paymentsuccess',
      component: () => import('pages/BoostopiaPaymentSuccess.vue'),
      name: 'BoostopiaPaymentSuccess',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'resources/lockdown-movement',
      component: () => import('pages/DocumentDisplay.vue'),
      name: 'DocumentDisplay',
      meta: {
        requiresAuth: true
      }
    },
    // chekckout
    {
      path: 'chat/request/:request/response/:response/checkout',
      component: () => import('pages/Checkout.vue'),
      name: 'Checkout',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'expresscheckout',
      component: () => import('pages/ExpressCheckout.vue'),
      name: 'ExpressCheckout',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'expresscheckout/boost',
      component: () => import('pages/ExpressCheckoutBoost.vue'),
      name: 'ExpressCheckoutBoost',
      meta: {
        requiresAuth: true
      }
    },
    // Notificaitons
    {
      path: 'notification/:id',
      component: () => import('pages/Notification.vue'),
      name: 'Notification',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'notifications',
      component: () => import('pages/Messages.vue'),
      name: 'Notifications',
      meta: {
        requiresAuth: true
      }
    },
    // Service User Rules
    {
      path: 'service-user-rules',
      component: () => import('pages/ServiceUserRules.vue'),
      name: 'ServiceUserRules',
      meta: {
        requiresAuth: true
      }
    },
    // Support
    {
      path: 'help-center',
      component: () => import('pages/HelpCenter.vue'),
      name: 'HelpCenter',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'request-help',
      component: () => import('pages/RequestHelp.vue'),
      name: 'RequestHelp',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'jobs-help',
      component: () => import('pages/JobsHelp.vue'),
      name: 'JobsHelp',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'chat/support-enquiry',
      component: () => import('pages/ChatSupportEnquiry.vue'),
      name: 'ChatSupportEnquiry',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'chat/support-help',
      component: () => import('pages/ChatSupportHelp.vue'),
      name: 'ChatSupportHelp',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'chat/support/:ticketId',
      component: () => import('pages/ChatSupport.vue'),
      name: 'ChatSupport',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'chat/support/:userId',
      component: () => import('pages/ChatSupport.vue'),
      name: 'ChatAdmin',
      meta: {
        requiresAuth: true
      }
    },
    // FAQ
    {
      path: 'faq',
      component: () => import('pages/Faq.vue'),
      name: 'Faq',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'faq/listings',
      component: () => import('pages/ListingsFaq.vue'),
      name: 'ListingsFaq',
      meta: {
        requiresAuth: true
      }
    },
    // Payment methods
    {
      path: 'bank-transfer',
      component: () => import('pages/BankTransfer.vue'),
      name: 'BankTransfer'
    },
    {
      path: 'wechat-payment',
      component: () => import('pages/WeChat.vue'),
      name: 'WeChat',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'bharatpe-payment',
      component: () => import('pages/BharatPe.vue'),
      name: 'BharatPe',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'paynow-payment',
      component: () => import('pages/PayNow.vue'),
      name: 'PayNow',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'logout',
      component: () => import('pages/Logout.vue'),
      name: 'Logout'
    }
  ]
},
{ // Always leave this as last one
  path: '*',
  component: () => import('pages/404.vue'),
  name: '404'
}
]
