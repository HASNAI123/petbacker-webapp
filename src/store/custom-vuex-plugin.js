export default (store) => {
  // store.subscribe((mutation) => {
  //   //  console.log(mutation)
  // })
  store.subscribeAction((action) => {
    let actionType = action.type.split('/')[0]
    if ((actionType === 'cached') && window.db) {
      setTimeout(() => {
        store.dispatch('user/update')
      }, 2)
    }
  })
}
