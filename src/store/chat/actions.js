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
        txn.executeSql('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, message_id INTEGER, href TEXT, content TEXT, contentType TEXT,is_deleted INTEGER, source INTEGER, read INTEGER, createdDate TEXT, job_id INTEGER, request_id INTEGER, response_id INTEGER, user_uuid TEXT, support_user_uuid TEXT, status INTEGER, unique (message_id))', [], (transaction, results) => {
          // indexed request messages table
          transaction.executeSql('CREATE INDEX IF NOT EXISTS idx_messages_request ON messages(user_uuid, request_id, response_id);', [], (transaction, results) => {
          }, (transaction, error) => {
            console.error(error)
          })

          // indexed job messages table
          transaction.executeSql('CREATE INDEX IF NOT EXISTS idx_messages_job ON messages(user_uuid, job_id);', [], (transaction, results) => {
          }, (transaction, error) => {
            console.error(error)
          })
          console.log('messages table created')
        }, (transaction, error) => {
          reject(error)
        })

        // message user table
        txn.executeSql('CREATE TABLE IF NOT EXISTS messagesUser (id INTEGER PRIMARY KEY, uuid TEXT, href TEXT,is_deleted INTEGER, avatarImage TEXT, username TEXT, unique (uuid))', [], (transaction, results) => {
          // indexed messagesUser messages table
          transaction.executeSql('CREATE INDEX IF NOT EXISTS idx_messages_user_uuid ON messagesUser(uuid);', [], (transaction, results) => {
          }, (transaction, error) => {
            console.error(error)
          })

          transaction.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS message_message_id ON messages(message_id)', [], (transaction, results) => {
          }, (transaction, error) => {
            console.error(error)
          })
          console.log('messagesUser table created')
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
 * Request Messaging Methods
 * - insertRequestMessages: insert new request message items into db
 * - getRequestMessages: get new request message item from db
 * - updateRequestMessage: update new message
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * - insertMessageUser: insert new message user info into db
 */
// insert new request message
export const insertRequestMessages = async ({rootGetters}, payload) => {
  return new Promise((resolve, reject) => {
    if (payload.requestId === null || payload.responseId === null) {
      resolve()
      return
    }

    // try to open exiting table from db
    window.db.transaction((txn) => {
      if (payload.id) {
        // check if current message id exist
        txn.executeSql(`SELECT message_id FROM messages WHERE message_id = ${payload.id}`, [], (txn, results) => {
          // insert new message when id do not exist locally
          if (results.rows.length === 0) {
            txn.executeSql(`INSERT INTO messages (message_id, href, content, contentType, source, read, createdDate, user_uuid, request_id, response_id, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
              [payload.id, payload.href, payload.content, payload.contentType, payload.source, payload.read, payload.createdDate, payload.userInfo.id, payload.requestId, payload.responseId, payload.id > 0 ? 1 : 0], (transaction, results) => {
                resolve(results)
              }, (transaction, error) => {
                reject(error)
              })
          } else {
            resolve()
          }
        }, (transaction, error) => {
          reject(error)
        })
      } else {
        txn.executeSql(`INSERT INTO messages (message_id, href, content, contentType, source, read, createdDate, user_uuid, request_id, response_id, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
          [payload.id, payload.href, payload.content, payload.contentType, payload.source, payload.read, payload.createdDate, payload.userInfo.id, payload.requestId, payload.responseId, payload.id > 0 ? 1 : 0], (transaction, results) => {
            resolve(results)
          }, (transaction, error) => {
            reject(error)
          })
      }
    }, (transaction, error) => {
      console.error(error)
      reject(error)
    })
  })
}

// get request message
export const getRequestMessages = async ({rootGetters}, payload) => {
  return new Promise((resolve, reject) => {
    // try to open exiting table from db
    window.db.readTransaction((txn) => {
      // get messages from the chat
      // pagination should start from zero and offset every 20 until get nothing more
      txn.executeSql(`SELECT messages.id, messages.message_id, messages.href, messages.content, messages.contentType, messages.source, messages.read, messages.createdDate, messages.user_uuid, messages.request_id, messages.response_id, messagesUser.uuid, messagesUser.avatarImage, messagesUser.username\
        FROM messages, messagesUser\
        WHERE messages.user_uuid = messagesUser.uuid AND request_id = ${payload.requestId} AND response_id = ${payload.responseId}\
        ORDER BY message_id DESC\
        Limit 20 OFFSET ${payload.pagination}`, [], (transaction, results) => {
        resolve(results)
      }, (transaction, error) => {
        reject(error)
      })
    }, (transaction, error) => {
      console.error(error)
      reject(error)
    })
  })
}

// Get all local Database data

export const getAllData = async () => {
  return new Promise((resolve, reject) => {
    window.db.readTransaction((txn) => {
      txn.executeSql(`SELECT messages.id, messages.message_id, messages.href, messages.content, messages.contentType, messages.source, messages.read, messages.createdDate, messages.user_uuid, messages.request_id, messages.response_id, messagesUser.uuid, messagesUser.avatarImage, messagesUser.username
        FROM messages, messagesUser
        WHERE messages.user_uuid = messagesUser.uuid`, [], (transaction, results) => {
        resolve(results.rows)
      }, (transaction, error) => {
        reject(error)
      })
    }, (transaction, error) => {
      console.error(error)
      reject(error)
    })
  })
}

// Delete request message
export const deleteRequestMessage = async ({rootGetters}, payload) => {
  return new Promise((resolve, reject) => {
    // try to open existing table from db
    window.db.transaction((txn) => {
      // delete message from the chat
      txn.executeSql(`DELETE FROM messages WHERE id = ?`, [payload.messageId], (transaction, results) => {
        resolve(results)
      }, (transaction, error) => {
        reject(error)
      })
    }, (transaction, error) => {
      console.error(error)
      reject(error)
    })
  })
}

// update request message
// used when new message sent by current user
export const updateRequestMessage = async ({rootGetters}, payload) => {
  return new Promise((resolve, reject) => {
    window.db.transaction((txn) => {
      // update message upon after send (POST)
      txn.executeSql(`UPDATE messages SET status = ${payload.messageInfo.content.status}, read = ${payload.messageInfo.read}, content = ${payload.messageInfo.content} WHERE id = ${payload.id} AND request_id = ${payload.requestId} AND response_id = ${payload.responseId}`, [], (transaction, results) => {
        resolve(results)
      }, (transaction, error) => {
        reject(error)
      })
    }, (transaction, error) => {
      console.error(error)
      reject(error)
    })
  })
}

// insert new job message
export const insertJobMessages = async ({rootGetters}, payload) => {
  return new Promise((resolve, reject) => {
    if (payload.taskId === null) {
      resolve()
      return
    }

    // try to open exiting table from db
    window.db.transaction((txn) => {
      // check if current message id exist
      txn.executeSql(`SELECT message_id FROM messages WHERE message_id = ${payload.id}`, [], (txn, results) => {
        // insert new message when id do not exist locally
        if (results.rows.length === 0) {
          txn.executeSql(`INSERT INTO messages (message_id, href, content, contentType, source, read, createdDate, user_uuid, job_id, status) VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [payload.id, payload.href, payload.content, payload.contentType, payload.source, payload.read, payload.createdDate, payload.userInfo.id, payload.taskId, payload.id > 0 ? 1 : 0], (transaction, results) => {
              resolve(results)
            }, (transaction, error) => {
              reject(error)
            })
        } else {
          resolve()
        }
      }, (transaction, error) => {
        reject(error)
      })
    }, (transaction, error) => {
      console.error(error)
      reject(error)
    })
  })
}

// get job message
export const getJobMessages = async ({rootGetters}, payload) => {
  return new Promise((resolve, reject) => {
    // try to open exiting table from db
    console.log('check the payload of the message', payload)
    window.db.readTransaction((txn) => {
      // get messages from the chat
      // pagination should start from zero and offset every 20 until get nothing more
      txn.executeSql(`SELECT messages.id, messages.message_id, messages.href, messages.content, messages.contentType, messages.source, messages.read, messages.createdDate, messages.user_uuid, messages.request_id, messages.response_id, messagesUser.uuid, messagesUser.avatarImage, messagesUser.username\
        FROM messages, messagesUser\
        WHERE messages.user_uuid = messagesUser.uuid AND job_id = ${payload.taskId}\
        ORDER BY message_id DESC\
        Limit 20 OFFSET ${payload.pagination}`, [], (transaction, results) => {
        console.log('check result messages', results)
        resolve(results)
      }, (transaction, error) => {
        reject(error)
      })
    }, (transaction, error) => {
      console.error(error)
      reject(error)
    })
  })
}

// Delete job Message
export const deleteMessage = async ({rootGetters}, messageId) => {
  return new Promise((resolve, reject) => {
    // try to open existing table from db
    window.db.transaction((txn) => {
      // delete message with specific id
      txn.executeSql(`DELETE FROM messages WHERE message_id = ?`, [messageId], (transaction, results) => {
        resolve(results)
        console.log('check if delted', results)
      }, (transaction, error) => {
        reject(error)
      })
    }, (transaction, error) => {
      console.error(error)
      reject(error)
    })
  })
}

// insert new message user
export const insertMessageUser = async ({rootGetters}, payload) => {
  return new Promise((resolve, reject) => {
    // try to open existing table from db
    window.db.transaction((txn) => {
      // check if user exist already in table
      txn.executeSql(`SELECT uuid FROM messagesUser WHERE uuid = ? LIMIT 1`, [payload.id], (txn, results) => {
        // insert new user
        if (results.rows.length === 0) {
          txn.executeSql(`INSERT INTO messagesUser (uuid, href, avatarImage, username) VALUES (?,?,?,?)`, [payload.id, payload.href, payload.avatarImage, payload.username], (transaction, results) => {
            console.log('insert message user')
            resolve(results)
          }, (transaction, error) => {
            console.error(error)
            reject(error)
          })
        } else {
          resolve()
        }
      }, (transaction, error) => {
        console.error(error)
        reject(error)
      })
    }, (transaction, error) => {
      console.error(error)
      reject(error)
    })
  })
}

// update job message
// used when new message sent by current user
export const updateJobMessage = async ({rootGetters}, payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    window.db.transaction((txn) => {
      // update message upon after send (POST)
      txn.executeSql(`UPDATE messages SET status = ${payload.messageInfo.content.status}, read = ${payload.messageInfo.read}, content = '${JSON.stringify(payload.messageInfo.content)}' WHERE message_id = ${payload.messageInfo.id} AND job_id = ${payload.taskId}`, [], (transaction, results) => {
        console.log(results)
        resolve(results)
      }, (transaction, error) => {
        reject(error)
      })
    }, (transaction, error) => {
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
      txn.executeSql('DROP TABLE messagesUser', [])
      txn.executeSql('DROP TABLE messages', [])

      init()
    }, (transaction, error) => {
      console.error(error)
    })
  } else {
    init()
  }
}
