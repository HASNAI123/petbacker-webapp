export const updateUserAccessState = (state) => {
  if (state.uuid !== null && state.token !== null) {
    state.access = true
  } else {
    state.access = false
  }
}

export const updateGuestAccessState = (state, value) => {
  state.access = value
}

export const updateUserReviewState = (state, value) => {
  state.reviewState = value
}

export const updateUserUuidState = (state, value) => {
  state.uuid = value
}

export const updateUserTokenState = (state, value) => {
  state.token = value
}

export const updateUserAvatarImageState = (state, value) => {
  state.avatarImage = value
}

export const updateUserEmailState = (state, value) => {
  state.email = value
}

export const updateUserPreferredCurrencyState = (state, value) => {
  state.preferredCurrency = value
}

export const updateUserMobileCountryIdState = (state, value) => {
  state.mobileCountryId = value
}

export const updateUserLanguageState = (state, value) => {
  state.language = value
}

export const updateUserMobileNumState = (state, value) => {
  state.mobileNum = value
}

export const updateuserMobileVerifiedState = (state, value) => {
  state.mobileVerified = value
}

export const updateUserBackUrlState = (state, value) => {
  state.backUrl = value
}

export const updateUserUsernameState = (state, value) => {
  state.username = value
}

export const updateUserCreatedDateState = (state, value) => {
  state.createdDate = value
}

export const updateUserFooterVisibilityState = (state, value) => {
  state.footerVisibility = value
}

export const updateUserNavbarVisibilityState = (state, value) => {
  state.navbarVisibility = value
}

export const updateUserAdminState = (state, value) => {
  state.admin = value
}

export const updateUserReferrerState = (state, value) => {
  state.referrer = value
}

export const updateUserReferralCodeState = (state, value) => {
  state.referralCode = value
}

export const updateUserUnreadRequestsMessageState = (state, value) => {
  state.unreadRequestsMessage = value
}

export const updateUserUnreadNotificationState = (state, value) => {
  state.unreadNotifications = value
}

export const updateUserUnreadJobsMessageState = (state, value) => {
  state.unreadJobsMessage = value
}

export const decreaseUserUnreadJobState = (state) => {
  state.unreadJobsMessage--
}

export const decreaseUserUnreadMessageState = (state) => {
  state.unreadRequestsMessage--
}

export const decreaseUserUnreadNotificationState = (state) => {
  state.unreadNotifications--
}

export const decreaseUserUnreadSupportMessageNotificationState = (state) => {
  state.unreadSupportMessage--
}

export const updateopenModalQuoteDetailsState = (state, value) => {
  state.openModalQuoteDetails = value
}

export const updateHideYellowBarInRequestPage = (state, value) => {
  state.hideYellowBarInRequestPage = value
}

export const updateLangChangeState = (state, value) => {
  state.langChange = value
}

export const updateMessageTabIndexState = (state, value) => {
  state.messagePageTabIndex = value
}

export const updateMessagePageNotificationPageIndex = (state, value) => {
  state.messagePageNotificationPageIndex = value
}

export const updateUserPushIdState = (state, value) => {
  state.pushid = value
}

export const updateUserCurrentPage = (state, value) => {
  state.currentPage = value
}

export const updateUserCurrentMobileTab = (state, value) => {
  state.currentMobileTab = value
}

export const updateCachedVersion = (state, value) => {
  state.cachedVersion = value
}

export const updateUserNotificationState = (state, value) => {
  state.enableNotifications = value
}

export const updateUserLatitude = (state, value) => {
  state.latitude = value
}

export const updateUserLongitude = (state, value) => {
  state.longitude = value
}

export const updateUnreadSupportMessage = (state, value) => {
  state.unreadSupportMessage = value
}

export const updateIdVerified = (state, value) => {
  state.idVerified = value
}

export const updateSelfieVerified = (state, value) => {
  state.selfieVerified = value
}

export const updateEmailVerified = (state, value) => {
  state.emailVerified = value
}

export const updateFacebookVerified = (state, value) => {
  state.facebookVerified = value
}

export const updateGoogleVerified = (state, value) => {
  state.googleVerified = value
}

export const updateCredits = (state, value) => {
  state.credits = value
}

export const updateBusinessVerified = (state, value) => {
  state.businessVerified = value
}

export const updateContactLine = (state, value) => {
  state.contactLine = value
}

export const updateContactWechat = (state, value) => {
  state.contactWechat = value
}

export const updateContactWhatsapp = (state, value) => {
  state.contactWhatsapp = value
}

export const updateProVerified = (state, value) => {
  state.proVerified = value
}

export const updateServiceProvider = (state, value) => {
  state.serviceProvider = value
}

export const updateUserExamCertified = (state, value) => {
  state.examCertified = value
}

export const updateSitterIntroVerified = (state, value) => {
  state.sitterIntroVerified = value
}

export const updateStrictJobAssignments = (state, value) => {
  state.strictJobAssignments = value
}

export const updateAlwaysRebroadcastPrivate = (state, value) => {
  state.alwaysRebroadcastPrivate = value
}

export const updatePoliceVerified = (state, value) => {
  state.policeVerified = value
}

export const updateNotificationSound = (state, value) => {
  state.notificationSound = value
}

export const updateReviewCount = (state, value) => {
  state.reviewCount = value
}

export const updateAboutMe = (state, value) => {
  state.aboutMe = value
}

export const updateFirstTimeRequest = (state, value) => {
  state.firstTimeRequest = value
}

export const updateListingApprovalStatus = (state, value) => {
  state.listingsApprovalStatus = value
}

export const updateThirdPartyVerified = (state, value) => {
  state.thirdPartyVerified = value
}

export const updateJobFilter = (state, value) => {
  state.jobFilter = value
}

export const updateTrainingCertified = (state, value) => {
  state.trainingCertified = value
}

export const updateGroomingCertified = (state, value) => {
  state.groomingCertified = value
}

export const updateVetCertified = (state, value) => {
  state.vetCertified = value
}

export const updatePoints = (state, value) => {
  state.points = value
}

export const updateTazapayToken = (state, value) => {
  state.tazapayToken = value
}

export const updateClearAllState = (state) => {
  state.access = false
  state.uuid = null
  state.token = null
  state.avatarImage = null
  state.email = null
  state.preferredCurrency = null
  state.mobileCountryId = null
  state.mobileNum = null
  state.mobileVerified = false
  state.username = null
  state.referrer = null
  state.referralCode = null
  state.hideYellowBarInRequestPage = null
  state.unreadRequestsMessage = 0
  state.unreadNotifications = 0
  state.unreadJobsMessage = 0
  state.unreadSupportMessage = 0
  state.openModalQuoteDetails = false
  state.messagePageTabIndex = 'tab-requests'
  state.messagePageNotificationPageIndex = 1
  state.currentPage = 'Requests'
  state.currentMobileTab = 'services.explore'
  state.jobFilter = 'All'
  state.footerVisibility = false
  state.navbarVisibility = true
  state.admin = false
  state.serviceProvider = false
  state.selfieVerified = 0
  state.idVerified = 0
  state.mobileVerified = 0
  state.emailVerified = 0
  state.examCertified = false
  state.sitterIntroVerified = false
  state.strictJobAssignments = false
  state.policeVerified = 0
  state.notificationSound = 'woof'
  state.credits = 0
  state.reviewCount = 0
  state.listingsApprovalStatus = 0
  state.trainingCertified = 0
  state.points = 0
}
