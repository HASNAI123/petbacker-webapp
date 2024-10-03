module.exports = (() => {
  const NOTIFICATION_TYPE = {
    'NEW_TASK': 0, //   receive new task
    'NEW_OFFER': 1, //  receive new offer
    'OFFER_ACCEPTED': 2, // offer accepted
    'OFFER_CANCELLED': 3, //    offer cancelled
    'OFFER_REJECTED': 4, // offer rejected
    'REQUEST_JOB_CLOSED': 5, // offer closed/ request completed
    'TASK_MESSAGE': 6, //   task message
    'REQUEST_MESSAGE': 7, //    req message
    'UPGRADE_MESSAGE': 8, //    app force upgrade message
    'CANCELLED_REQUEST': 9, //  cancel/decline request
    'CANCELLED_JOB': 10, // cancel/decline job
    'SUPPORT_MESSAGE': 11, //   support message
    'REQUEST_REVIEW': 12, //    request review
    'TASK_REVIEW': 13, //   task review
    'WALL_LIKE': 14, // wall like
    'WALL_COMMENT': 15, // wall comment
    'DOG_WALKING': 16, //   dog walking
    'VOUCHER_PROMOTION': 17, // voucher promotion
    'MOMENT_ACTIVITY': 18, //   moment activity
    'MOMENTS_ACTIVITY': 19, //  moments activity
    'ADD_MOMENT_ACTIVITY': 20, //   add moment
    'NOTIFICATIONS_LIST': 21, //    notifications list
    'NOTIFICATION_DETAIL': 22, //   notification detail
    'LINK': 23, //  web link
    'SUPPORT_CENTER': 24 // support center
  }

  var array = {
    'NOTIFICATION_TYPE': NOTIFICATION_TYPE
  }

  return {
    get: (type, name) => {
      if (!type || !name) {
        console.error('Please specified type and name')
        return new Error('Please specified type and name')
      }

      return array[type][name]
    }
  }
})()
