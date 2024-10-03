export const geopluginCountryCode = (state) => {
  if (state.data && state.data.geoplugin_countryCode) {
    return state.data.geoplugin_countryCode
  }
  return null
}
export const geopluginLatitude = (state) => {
  console.log('geopluginLatitude', state.data)
  console.log('latest changes avaialble')
  if (state.data && state.data.geoplugin_latitude) {
    return state.data.geoplugin_latitude
  }
  return null
}
export const geopluginLongitude = (state) => {
  if (state.data && state.data.geoplugin_longitude) {
    return state.data.geoplugin_longitude
  }
  return null
}
