/*
  CACHE DATA
*/
// explore page
export const cacheBackersNearby = async ({commit}, payload) => {
  commit('updateBackersNearbyCached', payload)
}
export const cachePetsInCommunity = async ({commit}, payload) => {
  commit('updatePetsInCommunityCached', payload)
}
export const cacheBlogs = async ({commit}, payload) => {
  commit('updateBlogCached', payload)
}

// requests page
export const cacheRequests = async ({commit}, payload) => {
  commit('updateRequestsCached', payload)
}

// jobs page
export const cacheJobs = async ({commit}, payload) => {
  commit('updateJobsCached', payload)
}

// inbox messages
export const cacheRequestsInbox = async ({commit}, payload) => {
  commit('updateRequestsInboxCached', payload)
}
export const cacheJobsInbox = async ({commit}, payload) => {
  commit('updateJobsInboxCached', payload)
}
export const cacheJobsInboxFull = async ({commit}, payload) => {
  commit('updateJobsInboxFullCached', payload)
}

// moments page
export const cacheMomentsPublic = async ({commit}, payload) => {
  commit('updateMomentsPublicCached', payload)
}
export const cacheMomentsRelated = async ({commit}, payload) => {
  commit('updateMomentsRelatedCached', payload)
}

// favorite listings page
export const cachedFavoritedListings = async ({commit}, payload) => {
  commit('updateFavoritedListingsCached', payload)
}

// transaction history (wallet)
export const cacheTransactionHistory = async ({commit}, payload) => {
  commit('updateTransactionHistory', payload)
}

// user services
export const cacheUserServices = async ({commit}, payload) => {
  commit('updateServicesCached', payload)
}

// currencies
export const cacheCurrencies = async ({commit}, payload) => {
  commit('updateCurrenciesCached', payload)
}

// personal items
export const cachePersonalItems = async ({commit}, payload) => {
  commit('updatePersonalItemsCached', payload)
}

// support tickets
export const cacheSupportTickets = async ({commit}, payload) => {
  commit('updateSupportTicketsCached', payload)
}
export const cacheSupportLatestTicket = async ({commit}, payload) => {
  commit('updateSupportLatestTicketCached', payload)
}
export const cacheSupportCategories = async ({commit}, payload) => {
  commit('updateSupportCategoriesCached', payload)
}

// rewards
export const cacheRewardsHistory = async ({commit}, payload) => {
  commit('updateRewardsHistoryCached', payload)
}

/*
  CLEAR CACHE DATA
*/
// explore
export const clearExplorePageCached = async ({commit}) => {
  commit('updateBackersNearbyCached', null)
  commit('updatePetsInCommunityCached', null)
  commit('updateBlogCached', null)
}

// requests page
export const clearRequestsPageCached = async ({commit}) => {
  commit('updateRequestsCached', null)
  commit('banners/updateRequestsBanners', null, { root: true })
}

// jobs page
export const clearJobsPageCached = async ({commit}) => {
  commit('updateJobsCached', null)
}

// inbox page
export const clearInboxPageCached = async ({commit}) => {
  commit('updateJobsInboxCached', null)
  commit('updateRequestsInboxCached', null)
}

// transaction history (wallet)
export const clearTransactionHistoryCached = async ({commit}) => {
  commit('updateTransactionHistory', null)
}

// favorite listings page
export const clearFavoritedListingsCached = async ({commit}) => {
  commit('updateFavoritedListingsCached', null)
}

// user services
export const clearUserServicesCached = async ({commit}) => {
  commit('updateServicesCached', null)
}

// moments
export const clearMomentsRelatedCached = async ({commit}) => {
  commit('updateMomentsRelatedCached', null)
}

// personal items
export const clearPersonalItemsCached = async ({commit}) => {
  commit('updatePersonalItemsCached', null)
}

// support tickets
export const clearSupportTicketsCached = async ({commit}) => {
  commit('updateSupportTicketsCached', null)
  commit('updateSupportLatestTicketCached', null)
}

// rewards
export const clearRewardsCached = async ({commit}) => {
  commit('updateRewardsHistoryCached', null)
}
