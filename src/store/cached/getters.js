/*
export function someGetter (state) {
}
*/
export const getBackersNearbyCached = (state) => {
  return state.backersNearby
}
export const getPetsInCommunityCached = (state) => {
  return state.petsInTheCommunity
}
export const getBlogCached = (state) => {
  return state.blogs
}
export const getRequestsCached = (state) => {
  return state.requests
}
export const getJobsCached = (state) => {
  return state.jobs
}
export const getRequestsInboxCached = (state) => {
  return state.requestsInbox
}
export const getJobsInboxCached = (state) => {
  return state.jobsInbox
}
export const getJobsInboxFullCached = (state) => {
  return state.jobsInboxFull
}
export const getMomentsPublicCached = (state) => {
  return state.momentsPublic
}
export const getMomentsRelatedCached = (state) => {
  return state.momentsRelated
}
export const getFavoritedListingsCached = (state) => {
  return state.favoritedListings
}
export const getTransactionHistory = (state) => {
  return state.transactionHistory
}
export const getServicesCached = (state) => {
  return state.services
}
export const getCurrenciesCached = (state) => {
  return state.currencies
}
export const getPersonalItemsCached = (state) => {
  return state.personalItems
}
export const getSupportTicketsCached = (state) => {
  return state.supportTickets
}
export const getSupportLatestTicketCached = (state) => {
  if (state.supportTickets && state.supportTickets.length > 0) {
    return state.supportTickets[0]
  }

  return null
}
export const getSupportCategoriesCached = (state) => {
  return state.supportCategories
}
export const getRewardsHistoryCached = (state) => {
  return state.rewardsHistory
}
