import { Platform } from 'quasar'
/*
export function someAction (context) {
}
*/
// init
export const init = async () => {
  return new Promise((resolve, reject) => {
    if (Platform.is.cordova) {
      // create messages table if do not exist
      window.db.transaction((txn) => {
        // messages table
        txn.executeSql('CREATE TABLE IF NOT EXISTS bookings (id INTEGER PRIMARY KEY, booking_id INTEGER, service_id INTEGER, pet_count INTEGER, required_time TEXT, duration INTEGER, unit INTEGER, owner_href TEXT, sitter_href TEXT, booking_reference TEXT, owner_uuid TEXT, sitter_uuid TEXT, offer_currency_text TEXT, offer_currency INTEGER, offer_amount INTEGER, acceptance_status INTEGER, book_status INTEGER, completion_status INTEGER, owner_rating INTEGER, sitter_rating INTEGER, UNIQUE(booking_id))', [], (transaction, results) => {
          // indexed bookings table
          transaction.executeSql('CREATE INDEX IF NOT EXISTS idx_bookings ON bookings(booking_id);', [], (transaction, results) => {
          }, (transaction, error) => {
            console.error(error)
          })

          // indexed bookings owner table
          transaction.executeSql('CREATE INDEX IF NOT EXISTS idx_bookings_owner ON bookings(owner_uuid, booking_id);', [], (transaction, results) => {
          }, (transaction, error) => {
            console.error(error)
          })

          // indexed bookings sitter table
          transaction.executeSql('CREATE INDEX IF NOT EXISTS idx_bookings_sitter ON bookings(sitter_uuid, booking_id);', [], (transaction, results) => {
          }, (transaction, error) => {
            console.error(error)
          })
          console.log('bookings table created')
          resolve()
        }, (transaction, error) => {
          reject(error)
        })
        //  resolve()
      }, (transaction, error) => {
        console.error(error)
        reject(error)
      })
    } else {
      resolve()
    }
  })
}

/**
 * Bookings Methods
 * - insertBooking: insert new booking into local db
 * - getBooking: get booking cache in local db
 * - updateBooking: update existing booking
 */
// insert new owner message
export const insertBooking = async ({rootGetters}, payload) => {
  return new Promise((resolve, reject) => {
    if (payload.id === null) {
      resolve()
      return
    }

    // try to open exiting table from db
    window.db.transaction((txn) => {
      if (payload.id) {
        // check if current booking id exist
        txn.executeSql(`SELECT booking_id FROM bookings WHERE booking_id = ${payload.id}`, [], (txn, results) => {
          console.log(`Bookings [${payload.id}]`, results.rows.length)
          if (results.rows.length === 0) {
            // insert new booking when id do not exist locally
            txn.executeSql(`INSERT INTO bookings (booking_id, service_id, pet_count, required_time, duration, unit, owner_href, sitter_href, booking_reference, owner_uuid, sitter_uuid, offer_currency_text, offer_currency, offer_amount, acceptance_status, book_status, completion_status, owner_rating, sitter_rating) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
              [payload.id, payload.serviceId, payload.petCount, payload.requiredTime, payload.duration, payload.unit, payload.ownerHref, payload.sitterHref, payload.bookingRef, payload.ownerUuid, payload.sitterUuid, payload.offerCurrencyText, payload.offerCurrency, payload.offerAmount, payload.acceptanceStatus, payload.bookStatus, payload.completionStatus, payload.ownerRating, payload.sitterRating], (transaction, results) => {
                resolve(results)
              }, (transaction, error) => {
                reject(error)
              })
          } else {
            // update booking if exist locally
            updateBooking(payload).then((result) => {
              resolve(result)
            }).catch((error) => {
              reject(error)
            })
          }
        }, (transaction, error) => {
          reject(error)
        })
      }
    }, (error) => {
      console.error(error)
      reject(error)
    })
  })
}

// get booking
export const getOwnerBooking = async ({rootGetters}, payload) => {
  return new Promise((resolve, reject) => {
    // try to open exiting table from db
    window.db.readTransaction((txn) => {
      txn.executeSql(`SELECT bookings.booking_id, bookings.pet_count, bookings.required_time, bookings.duration, bookings.unit, bookings.service_id, bookings.owner_href, bookings.sitter_href, bookings.booking_reference, bookings.owner_uuid, bookings.sitter_uuid, bookings.offer_currency_text, bookings.offer_currency, bookings.offer_amount, bookings.acceptance_status, bookings.book_status, bookings.completion_status, bookings.owner_rating, bookings.sitter_rating, messagesUser.uuid, messagesUser.avatarImage, messagesUser.username\
        FROM bookings, messagesUser\
        WHERE bookings.sitter_uuid = messagesUser.uuid AND bookings.booking_id = ${payload.id}\
        `, [], (transaction, results) => {
        resolve(results)
      }, (error) => {
        reject(error)
      })
    }, (error) => {
      console.error(error)
      reject(error)
    })
  })
}

export const getSitterBooking = async ({rootGetters}, payload) => {
  return new Promise((resolve, reject) => {
    // try to open exiting table from db
    window.db.readTransaction((txn) => {
      txn.executeSql(`SELECT bookings.booking_id, bookings.pet_count, bookings.required_time, bookings.duration, bookings.unit, bookings.service_id, bookings.owner_href, bookings.sitter_href, bookings.booking_reference, bookings.owner_uuid, bookings.sitter_uuid, bookings.offer_currency_text, bookings.offer_currency, bookings.offer_amount, bookings.acceptance_status, bookings.book_status, bookings.completion_status, bookings.owner_rating, bookings.sitter_rating, messagesUser.uuid, messagesUser.avatarImage, messagesUser.username\
        FROM bookings, messagesUser\
        WHERE bookings.owner_uuid = messagesUser.uuid AND bookings.booking_id = ${payload.id}\
        `, [], (transaction, results) => {
        resolve(results)
      }, (error) => {
        reject(error)
      })
    }, (error) => {
      console.error(error)
      reject(error)
    })
  })
}

// update booking
export const updateBooking = async (payload) => {
  return new Promise((resolve, reject) => {
    window.db.transaction((txn) => {
      txn.executeSql(`UPDATE bookings SET service_id = ?, pet_count = ?, required_time = ?, duration = ?, unit = ?, owner_href = ?, sitter_href = ?, booking_reference = ?, owner_uuid = ?, sitter_uuid = ?, offer_currency_text = ?, offer_currency = ?, offer_amount = ?, acceptance_status = ?, book_status = ?, completion_status = ?, owner_rating = ?, sitter_rating = ? WHERE booking_id = ?`,
        [payload.serviceId, payload.petCount, payload.requiredTime, payload.duration, payload.unit, payload.ownerHref, payload.sitterHref, payload.bookingRef, payload.ownerUuid, payload.sitterUuid, payload.offerCurrencyText, payload.offerCurrency, payload.offerAmount, payload.acceptanceStatus, payload.bookStatus, payload.completionStatus, payload.ownerRating, payload.sitterRating, payload.id], (transaction, results) => {
          resolve(results)
        }, (error) => {
          reject(error)
        })
    }, (error) => {
      console.error(error)
      reject(error)
    })
  })
}

// refresh table
export const clear = ({rootState}) => {
  if (Platform.is.cordova) {
    window.db.transaction((txn) => {
      // drop tables
      txn.executeSql('DROP TABLE bookings', [])

      init()
    }, (transaction, error) => {
      console.error(error)
    })
  } else {
    init()
  }
}
