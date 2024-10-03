/*
export function someMutation (state) {
}
*/
export const updateBackersNearbyCached = (state, value) => {
  state.backersNearby = value
}
export const updatePetsInCommunityCached = (state, value) => {
  state.petsInTheCommunity = value
}
export const updateBlogCached = (state, value) => {
  state.blogs = value
}
export const updateRequestsCached = (state, value) => {
  state.requests = value
}
export const updateJobsCached = (state, value) => {
  state.jobs = value
}
export const updateRequestsInboxCached = (state, value) => {
  state.requestsInbox = value
}
export const updateJobsInboxCached = (state, value) => {
  state.jobsInbox = value
}
export const updateJobsInboxFullCached = (state, value) => {
  state.jobsInboxFull = value
}
export const updateMomentsPublicCached = (state, value) => {
  state.momentsPublic = value
}
export const updateMomentsRelatedCached = (state, value) => {
  state.momentsRelated = value
}
export const updateFavoritedListingsCached = (state, value) => {
  state.favoritedListings = value
}
export const updateTransactionHistory = (state, value) => {
  state.transactionHistory = value
}
export const updateServicesCached = (state, value) => {
  state.services = value
}
export const updateCurrenciesCached = (state, value) => {
  state.currencies = value
}
export const updatePersonalItemsCached = (state, value) => {
  state.personalItems = value
}
export const updateSupportTicketsCached = (state, value) => {
  state.supportTickets = value
}
export const updateSupportLatestTicketCached = (state, value) => {
  if (state.supportTickets && state.supportTickets.length > 0) {
    state.supportTickets[0] = value
  } else {
    state.supportTickets = value
  }
}
export const updateSupportCategoriesCached = (state, value) => {
  state.supportCategories = value
}
export const updateRewardsHistoryCached = (state, value) => {
  state.rewardsHistory = value
}
export const updateClearAlCached = (state) => {
  state.backersNearby = null
  state.petsInTheCommunity = null
  state.supportTickets = null
}
