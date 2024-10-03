export const authorizationHeader = (state) => {
  return 'RA ' + state.uuid + ':' + state.token
}

export const getMessageTabIndex = (state) => {
  return state.messagePageTabIndex
}

export const getUserName = (state) => {
  return state.username
}

export const getUserEmail = (state) => {
  return state.email
}

export const getUserPushIdState = (state) => {
  return state.pushid
}

export const getMessagePageNotificationPageIndex = (state) => {
  return state.messagePageNotificationPageIndex
}

export const getUnreadNotificationsCount = (state) => {
  return state.unreadNotifications
}

export const getUnreadRequestMessageCount = (state) => {
  return state.unreadRequestsMessage
}

export const getUnreadJobsMessageCount = (state) => {
  return state.unreadJobsMessage
}

export const getCurrentLanguage = (state) => {
  return state.language
}

export const getUserAccessState = (state) => {
  return state.access
}

export const getUserReferralCode = (state) => {
  return state.referralCode
}

export const getUserReferrerCode = (state) => {
  return state.referrer
}

export const getUserUuidState = (state) => {
  return state.uuid
}

export const getUserTokenState = (state) => {
  return state.token
}

export const getUserCurrentPage = (state) => {
  return state.currentPage
}

export const getUserCurrentMobileTab = (state) => {
  return state.currentMobileTab
}

export const getCachedVersion = (state) => {
  return state.cachedVersion
}

export const getUserPrefferedCurrency = (state) => {
  return state.preferredCurrency
}

export const getFooterVisibility = (state) => {
  return state.footerVisibility
}

export const getNavbarVisibility = (state) => {
  return state.navbarVisibility
}

export const getUserMobileCountryId = (state) => {
  return state.mobileCountryId
}

export const getUserMobileVerified = (state) => {
  return state.mobileVerified
}

export const getUserMobileNum = (state) => {
  return state.mobileNum
}

export const getUserNotificationsState = (state) => {
  return state.enableNotifications
}

export const getUserAdminState = (state) => {
  return state.admin
}

export const getUserAvatarImage = (state) => {
  return state.avatarImage
}

export const getUserUsername = (state) => {
  return state.username
}

export const getUserLatitude = (state) => {
  return state.latitude
}

export const getUserLongitude = (state) => {
  return state.longitude
}

export const getUnreadSupportMessage = (state) => {
  return state.unreadSupportMessage
}

export const getIdVerified = (state) => {
  return state.idVerified
}

export const getSelfieVerified = (state) => {
  return state.selfieVerified
}

export const getEmailVerified = (state) => {
  return state.emailVerified
}

export const getFacebookVerified = (state) => {
  return state.facebookVerified
}

export const getGoogleVerified = (state) => {
  return state.googleVerified
}

export const getCredits = (state) => {
  return state.credits
}

export const getBusinessVerified = (state) => {
  return state.businessVerified
}

export const getContactLine = (state) => {
  return state.contactLine
}

export const getContactWechat = (state) => {
  return state.contactWechat
}

export const getContactWhatsapp = (state) => {
  return state.contactWhatsapp
}

export const getProVerified = (state) => {
  return state.proVerified
}

export const getServiceProvider = (state) => {
  return state.serviceProvider
}

export const getUserExamCertified = (state) => {
  return state.examCertified
}

export const getSitterIntroVerified = (state) => {
  return state.sitterIntroVerified
}

export const getStrictJobAssignments = (state) => {
  return state.strictJobAssignments
}

export const getAlwaysRebroadcastPrivate = (state) => {
  return state.alwaysRebroadcastPrivate
}

export const getPoliceVerified = (state) => {
  return state.policeVerified
}

export const getNotificationSound = (state) => {
  return state.notificationSound
}

export const getReviewCount = (state) => {
  return state.reviewCount
}

export const getAboutMe = (state) => {
  return state.aboutMe
}

export const getFirstTimeRequest = (state) => {
  return state.firstTimeRequest
}

export const getListingApprovalStatus = (state) => {
  return state.listingsApprovalStatus
}

export const getThirdPartyVerified = (state) => {
  return state.thirdPartyVerified
}

export const getJobFilter = (state) => {
  return state.jobFilter
}

export const getTrainingCertified = (state) => {
  return state.trainingCertified
}

export const getGroomingCertified = (state) => {
  return state.groomingCertified
}

export const getVetCertified = (state) => {
  return state.vetCertified
}

export const getPoints = (state, value) => {
  return state.points
}
