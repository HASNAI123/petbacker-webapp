import { Platform } from 'quasar'
/*
export function someAction (context) {
}
*/
// init
export const init = async () => {
  return new Promise((resolve, reject) => {
    if (Platform.is.cordova) {
      // create search table if do not exist
      window.db.transaction((txn) => {
        // search table
        txn.executeSql('CREATE TABLE IF NOT EXISTS jobSearch (id INTEGER PRIMARY KEY,content TEXT,filter_type TEXT,service_type INTEGER,status_type TEXT,keyword_filter TEXT,keyword_filter_type TEXT,status INTEGER,created_date DATETIMEDEFAULT CURRENT_TIMESTAMP)', [], (transaction, results) => {
          // indexed jobSearch table
          transaction.executeSql('CREATE INDEX IF NOT EXISTS idx_job_search ON jobSearch(filter_type, service_type, status_type, keyword_filter, keyword_filter_type);', [], (transaction, results) => {
          }, (transaction, error) => {
            reject(error)
          })
        }, (transaction, error) => {
          reject(error)
        })

        txn.executeSql('CREATE TABLE IF NOT EXISTS exploreSearch (id INTEGER PRIMARY KEY,content TEXT,search_type TEXT,search_keyword TEXT,search_filter TEXT,latitude TEXT,longitude TEXT,full_address TEXT,total_count INTEGER,created_date DATETIMEDEFAULT CURRENT_TIMESTAMP)', [], (transaction, results) => {
          // indexed exploreSearch table
          transaction.executeSql('CREATE INDEX IF NOT EXISTS idx_explore_search ON exploreSearch(search_type, search_keyword, search_filter, latitude, longitude);', [], (transaction, results) => {
          }, (transaction, error) => {
            reject(error)
          })
          resolve()
        }, (transaction, error) => {
          reject(error)
        })
        resolve()
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
 * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                Job Search Cache                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Job Search Methods
 * - getJobSearch: get cached job search results from db
 * - getJobSearchById: get cached job search results from db by id
 * - insertJobSearch: insert new cached job search results into db
 */
// get job search results from db
export const getJobSearch = async ({rootGetters}, payload) => {
  return new Promise((resolve, reject) => {
    window.db.transaction((txn) => {
      // check if cache exist when the required filterings
      txn.executeSql(`SELECT id, content, status_type FROM jobSearch WHERE filter_type = ? AND service_type = ? AND status_type = ? AND keyword_filter = ? AND keyword_filter_type = ?`,
        [payload.filterType, payload.serviceType ? payload.serviceType : '', payload.statusType ? payload.statusType : '', payload.searchKeyword ? payload.searchKeyword : '', payload.keywordFilter ? payload.keywordFilter : ''], (txn, results) => {
          console.log('get data from db')
          resolve(results.rows._array)
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

// get job search results by id from db
export const getJobSearchById = async ({rootGetters}, id) => {
  return new Promise((resolve, reject) => {
    window.db.transaction((txn) => {
      // check if cache exist when the required filterings
      txn.executeSql(`SELECT * FROM jobSearch WHERE id = ?`, [id], (txn, results) => {
        resolve(results.rows._array[0])
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

// insert new job search results into db
export const insertJobSearch = async ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    if (payload.items === null || payload.items.length === 0) {
      resolve()
      return
    }

    window.db.transaction((txn) => {
      // check if cache exist when the required filterings
      txn.executeSql(`SELECT id, content FROM jobSearch WHERE filter_type = ? AND service_type = ? AND status_type = ? AND keyword_filter = ? AND keyword_filter_type = ?`,
        [payload.filterType, payload.serviceType ? payload.serviceType : '', payload.statusType ? payload.statusType : '', payload.searchKeyword ? payload.searchKeyword : '', payload.keywordFilter ? payload.keywordFilter : ''], (txn, results) => {
          // insert new job search when cache do not exist locally
          if (results.rows.length === 0) {
            txn.executeSql(`INSERT INTO jobSearch (content, filter_type, service_type, status_type, keyword_filter, keyword_filter_type) VALUES (?,?,?,?,?,?)`,
              [JSON.stringify(payload.items), payload.filterType ? payload.filterType : '', payload.serviceType ? payload.serviceType : '', payload.statusType ? payload.statusType : '', payload.searchKeyword ? payload.searchKeyword : '', payload.keywordFilter ? payload.keywordFilter : ''], (transaction, results) => {
                commit('updateJobSearchCachedId', results.insertId)
                resolve(payload)
              }, (transaction, error) => {
                console.error(error)
                reject(error)
              })
          } else {
            // update cache if new data coming in is same as cached data
            if (results.rows._array[0].content !== JSON.stringify(payload.items)) {
              console.log('difference')
              txn.executeSql(`UPDATE jobSearch SET content = ? WHERE id = ?`, [JSON.stringify(payload.items), results.rows._array[0].id], (transaction, response) => {
                console.log(response)
                commit('updateJobSearchCachedId', results.rows._array[0].id)
                resolve(payload)
              }, (transaction, error) => {
                console.error(error)
                reject(error)
              })
            } else {
              console.log('same')
              // return cached search results
              resolve()
            }
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

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *              Explore Search Cache                 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Explore Search Methods
 * - getExploreSearch: get cached explore search results from db
 * - getExploreSearchById: get cached explore search results from db by id
 * - insertExploreSearch: insert new cached explore search results into db
 */
// get e search results from db
export const getExploreSearch = async ({rootGetters}, payload) => {
  return new Promise((resolve, reject) => {
    window.db.transaction((txn) => {
      // check if cache exist when the required filterings
      txn.executeSql(`SELECT id, content, total_count FROM exploreSearch WHERE search_type = ? AND search_keyword = ? AND search_filter = ? AND latitude = ? AND longitude = ?`,
        [payload.searchType ? payload.searchType : '', payload.searchKeyword ? payload.searchKeyword.toUpperCase() : '', payload.searchFilter, payload.searchLocation.location.latitude ? payload.searchLocation.location.latitude : '', payload.searchLocation.location.longitude ? payload.searchLocation.location.longitude : ''], (txn, results) => {
          console.log('get data from db')
          resolve(results.rows._array)
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

// get explore search results by id from db
export const getExploreSearchById = async ({rootGetters}, id) => {
  return new Promise((resolve, reject) => {
    console.log('search cache id: ' + id)
    window.db.transaction((txn) => {
      // check if cache exist when the required filterings
      txn.executeSql(`SELECT * FROM exploreSearch WHERE id = ?`, [id], (txn, results) => {
        console.log('get data id from db')
        resolve(results.rows._array[0])
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

// insert new explore search results into db
export const insertExploreSearch = async ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    if (payload.items === null || payload.items.length === 0) {
      resolve()
      return
    }

    window.db.transaction((txn) => {
      // check if cache exist when the required filterings
      txn.executeSql(`SELECT id, content FROM exploreSearch WHERE search_type = ? AND search_keyword = ? AND search_filter = ? AND latitude = ? AND longitude = ?`,
        [payload.searchType ? payload.searchType : '', payload.searchKeyword ? payload.searchKeyword.toUpperCase() : '', payload.searchFilter, payload.searchLocation.location.latitude ? payload.searchLocation.location.latitude : '', payload.searchLocation.location.longitude ? payload.searchLocation.location.longitude : ''], (txn, results) => {
          // insert new job search when cache do not exist locally
          if (results.rows.length === 0) {
            console.log('inserted new search data')
            txn.executeSql(`INSERT INTO exploreSearch (content, search_type, search_keyword, search_filter, latitude, longitude, full_address, total_count) VALUES (?,?,?,?,?,?,?,?)`,
              [JSON.stringify(payload.items), payload.searchType ? payload.searchType : '', payload.searchKeyword ? payload.searchKeyword.toUpperCase() : '', payload.searchFilter, payload.searchLocation.location.latitude ? payload.searchLocation.location.latitude : '', payload.searchLocation.location.longitude ? payload.searchLocation.location.longitude : '', payload.searchLocation.location.fullAddress ? payload.searchLocation.location.fullAddress : '', payload.totalCount], (transaction, results) => {
                commit('updateExploreSearchCachedId', results.insertId)
                resolve(payload.items)
              }, (transaction, error) => {
                console.error(error)
                reject(error)
              })
          } else {
            // update cache if new data coming in is same as cached data
            if (results.rows._array[0].content !== JSON.stringify(payload.items)) {
              console.log('difference')
              txn.executeSql(`UPDATE exploreSearch SET content = ?, total_count = ? WHERE id = ?`, [JSON.stringify(payload.items), payload.totalCount, results.rows._array[0].id], (transaction, response) => {
                console.log(response)
                resolve(payload.items)
              }, (transaction, error) => {
                console.error(error)
                reject(error)
              })
            } else {
              console.log('same')
              resolve()
            }
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

export const clearSearchCache = async ({commit}) => {
  commit('updateJobSearchCachedId', null)
  commit('updateExploreSearchCachedId', null)

  if (Platform.is.cordova) {
    window.db.transaction((txn) => {
      // drop tables
      txn.executeSql('DROP TABLE jobSearch', [])
      txn.executeSql('DROP TABLE exploreSearch', [])

      init()
    }, (transaction, error) => {
      console.error(error)
    })
  } else {
    init()
  }
}
