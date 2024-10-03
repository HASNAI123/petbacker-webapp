/*
export function someAction (context) {
}
*/
export const cacheExploreBanners = async ({commit}, banners) => {
  commit('updateExploreBanners', banners)
}
export const cacheRequestsBanners = async ({commit}, banners) => {
  commit('updateRequestsBanners', banners)
}

export const clearBannersCache = async ({commit}) => {
  commit('updateRequestsBanners', null)
  commit('updateExploreBanners', null)
}

export const clearExploreBannersCache = async ({commit}) => {
  commit('updateExploreBanners', null)
}
