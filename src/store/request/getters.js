// export const authorizationHeader = (state) => {
//   return 'RA ' + state.uuid + ':' + state.token
// }
export const getRequestGclidState = (state) => {
  return state.gclid
}
