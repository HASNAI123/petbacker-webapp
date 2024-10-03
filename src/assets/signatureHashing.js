// import store from '../store'
import { Cookies, Platform } from 'quasar'
const crypto = require('crypto-js')
export function createConcatHashedSignature (requestUrl) {
  if (requestUrl.includes('k=13674c3b66275a11')) {
    return '' // Skip signature generation
  }
  // Slice device UUID and ammend it with device time in GMT 0 format
  var uuid = Platform.is.cordova ? window.device.uuid : Cookies.get('device-uuid')

  // Generate a random UUID to overcome the scenario where no UUID is captured
  function generateUuid () {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let gUuid = ''

    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      gUuid += characters.charAt(randomIndex)
    }
    return gUuid
  }

  if (!uuid || uuid.length < 5) {
    var generatedUuid = generateUuid()
  }

  var concatUuid = !uuid || uuid.length < 5 ? generatedUuid.slice(-5) : uuid.slice(-5)
  const currentTime = new Date()
  const gmtTime = currentTime.toISOString().slice(0, 19).replace('T', ' ')
  var signature = gmtTime + concatUuid

  // Hash timeWithUuid with secret
  var year = currentTime.getFullYear().toString().slice(-3)
  var month = currentTime.getMonth() + 1
  if (month < 10) {
    month = '0' + month // Prepend '0' for months 1 - 9
  }
  const key = 'jt' + year + 's&f' + month + '2'

  // Encode the encrypted message into Base64
  const encryptedSignature = crypto.AES.encrypt(signature, key, { mode: crypto.mode.ECB }).toString()
  return Buffer.from(encryptedSignature).toString('base64')
}
