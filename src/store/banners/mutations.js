/*
export function someMutation (state) {
}
*/
export const updateRequestsBanners = (state, value) => {
  state.requestsPage = value
}
export const updateExploreBanners = (state, value) => {
  state.explorePage = value
}
export const updateClearAllState = (state) => {
  state.explorePage = null
  state.requestsPage = null
  state.exploreBanner = null
}
