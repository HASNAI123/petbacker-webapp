export const updateRequestUtmSourceState = (state, value) => {
  state.utm_source = value
}
export const updateRequestUtmMediumState = (state, value) => {
  state.utm_medium = value
}
export const updateRequestUtmCampaignState = (state, value) => {
  state.utm_campaign = value
}
export const updateRequestUtmTermState = (state, value) => {
  state.utm_term = value
}
export const updateRequestUtmContentState = (state, value) => {
  state.utm_content = value
}
export const updateRequestGclidState = (state, value) => {
  state.gclid = value
}
export const updateRequestFbclidState = (state, value) => {
  state.fbclid = value
}

export const updateClearAllState = (state) => {
  state.utm_source = null
  state.utm_medium = null
  state.utm_campaign = null
  state.utm_term = null
  state.utm_content = null
  state.gclid = null
  state.fbclid = null
}
