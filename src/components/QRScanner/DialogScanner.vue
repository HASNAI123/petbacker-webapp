<template>
  <q-dialog v-model="modal" @hide="closePopUp" :seamless="!visibility" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card :style="{backgroundColor: visibility ? 'black' : 'transparent'}" v-touch-pan.down.prevent.mouse="scrolled">
        <!-- Header -->
        <q-toolbar class="bg-white" style="z-index:2500;">
          <q-toolbar-title @click="closePopUp">
            <h6 class="q-my-none services-title font-header-title" style="margin-left: 39%;">{{$t('job.completed')}}</h6>
          </q-toolbar-title>
          <q-btn flat round dense icon="close" @click="closePopUp"></q-btn>
        </q-toolbar>

        <q-card-section class="text-center">
          <transition appear enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
            <div class="text-center" v-if="$q.platform.is.cordova">
              <div class="margin-auto" style="height:290px;width:290px;border: 1px solid #0082B4;margin-top:50%;">
                  <div v-if="loading" class="validation-pending text-center" style="z-index: 3000;background-color: transparent;">
                      <q-spinner color="primary" size="10em" style="margin-top:22%;" ></q-spinner>
                  </div>
              </div>
            </div>
            <div v-else class="bg-black" :class="{ 'fullscreen': fullscreen }" ref="wrapper" @fullscreenchange="onFullscreenChange">
                <qrcode-stream @decode="onDecode" :camera="camera" @init="logErrors">
                    <div class="text-center" style="margin-top:50%;z-index: 2000;" v-if="!loaded" >
                        <q-spinner color="primary" size="10em"></q-spinner>
                    </div>
                    <div v-else-if="validationPending" class="validation-pending text-center" style="z-index: 3000;">
                        <q-spinner color="primary" size="10em" style="margin-top:50%;"></q-spinner>
                    </div>
                    <div v-else class="margin-auto" style="height:290px;width:290px;border: 2px solid #0082B4;margin-top:50%;"></div>
                </qrcode-stream>
                <div class="margin-auto" style="height:290px;width:290px;border: 1px solid #0082B4;margin-top:50%;">
                    <div v-if="loading" class="validation-pending text-center" style="z-index: 3000;background-color: black;">
                        <q-spinner color="primary" size="10em" style="margin-top:22%;" ></q-spinner>
                    </div>
                </div>
                <div class="text-center" v-if="noStreamApiSupport">
                    <qrcode-capture ref="qrCapture" @detect="onScan" style="visibility:hidden;"/>
                    <div class="absolute-bottom">
                        <q-btn class="q-my-lg q-px-xl text-weight-bold" style="border-radius: 15px;" label="Scan User QR Code" size="lg" color="primary" @click="scanUserQR"></q-btn>
                    </div>
                </div>
            </div>
          </transition>
        </q-card-section>
      </q-card>
  </q-dialog>
</template>
<script>
import { QrcodeStream, QrcodeCapture } from 'vue-qrcode-reader'
export default {
components: {
  QrcodeStream,
  QrcodeCapture
},
props: {
  trigger: {
    type: Boolean,
    required: true
  }
},
data () {
  return {
    modal: false,
    camera: 'auto',
    fullscreen: true,
    noStreamApiSupport: false,
    loaded: false,
    error: null,
    loading: false,
    visibility: true
  }
},
computed: {
  validationPending () {
    return this.camera === 'off'
  }
},
created () {
  this.setAppBackgroundColor('transparent')
  window.document.querySelector('#q-app').classList.remove('opaque-body')
},
watch: {
  trigger (status) {
    this.modal = status

    if (status) {
      window.QRScanner.prepare(this.scanNow)

      // start scanning
      window.QRScanner.scan(this.displayContent)
      window.QRScanner.show()

      setTimeout(() => {
        this.visibility = false
        this.$emit('on-qr-scanner', false)
      }, 220)
    } else {
      window.QRScanner.hide()
    }
  },
  fullscreen (status) {
    if (!status) {
      this.exitFullscreen()
    }
  }
},
beforeDestroy () {
  console.log('destroyed')
  this.setAppBackgroundColor('white')
  if (this.$q.platform.is.cordova) {
    this.visibility = true
    this.$emit('on-qr-scanner', true)
    window.QRScanner.destroy()
  } else {
    this.turnCameraOff()
  }
},
methods: {
  setAppBackgroundColor (color) {
    let appElement = document.getElementById('q-app')
    if (appElement) {
      appElement.style.backgroundColor = color
    }
  },
  scrolled ({ evt, ...info }) {
    if (info.direction === 'down' && info.offset.y > 26) {
      this.closePopUp()
    }
  },
  closePopUp () {
    this.visibility = true
    this.$emit('on-qr-scanner', true)
    window.QRScanner.hide()
    this.modal = false
    this.$emit('on-close', false)
  },
  scanUserQR () {
    this.$refs['qrCapture'].$el.click()
  },
  scanNow (err, status) {
    if (err) {
      // here we can handle errors and clean up any loose ends.
      console.error(err)
      console.error(err._message)
      this.$q.notify({ message: err._message, position: 'top', type: 'negative' })
    }

    if (status.authorized) {
      // camera is authorized to be used
    } else if (!status.authorized) {
      // The video preview will remain black, and scanning is disabled. We can
      // try to ask the user to change their mind, but we'll have to send them
      let a = confirm('Camera is required to scan QR code, please allowed in settings.\nPlease allowed it from device\'s settings.')
      if (a === true) {
        window.QRScanner.openSettings()
      } else {
        this.closePopUp()
      }
    } else {
      // we didn't get permission, but we didn't get permanently denied. (On
      // Android, a denial isn't permanent unless the user checks the "Don't
      // ask again" box.) We can ask again at the next relevant opportunity.
    }
  },
  displayContent (err, text) {
    if (err) {
      // an error occurred, or the scan was canceled (error code `6`)
      this.$q.notify({ message: err, position: 'top', type: 'negative' })
    } else {
      this.loading = true
      this.processData(text)
    }
  },
  onFullscreenChange (event) {
    // This becomes important when the user doesn't use the button to exit
    // fullscreen but hits ESC on desktop, pushes a physical back button on
    // mobile etc.
    this.fullscreen = document.fullscreenElement !== null
  },
  async logErrors (promise) {
    try {
      await promise
      this.loaded = true
    } catch (error) {
      this.loaded = true
      console.error(error)

      // fall back to normal camera capture instead
      if (error.name === 'StreamApiNotSupportedError') {
        this.noStreamApiSupport = true
        setTimeout(() => { this.$refs['qrCapture'].$el.click() }, 1500)
        return
      } else if (error.name === 'NotReadableError') {
        this.error = 'ERROR: is the camera already in use?'
        this.noStreamApiSupport = true
        setTimeout(() => { this.$refs['qrCapture'].$el.click() }, 1500)
        return
      }

      if (error.name === 'NotAllowedError') {
        this.error = 'ERROR: you need to grant camera access permisson'
      } else if (error.name === 'NotFoundError') {
        this.error = 'ERROR: no camera on this device'
      } else if (error.name === 'NotSupportedError' || error.name === 'InsecureContextError') {
        this.error = 'ERROR: secure context required (HTTPS, localhost)'
      } else if (error.name === 'OverconstrainedError') {
        this.error = 'ERROR: installed cameras are not suitable'
      } else {
        this.error = error
      }

      this.$q.notify({ progress: true, message: this.error, type: 'negative', position: 'top', timeout: 2000 })
    }
  },
  async onDecode (content) {
    this.loaded = false
    this.turnCameraOff()

    // pretend it's taking really long
    await this.timeout(1500)
    this.processData(content)
  },
  async onScan (promise) {
    this.loading = true
    try {
      const {
        content // decoded String or null
      } = await promise
      this.processData(content)
    } catch (error) {
      this.$q.notify({ progress: true, message: error, type: 'negative', position: 'top' })
    }
  },
  processData (content) {
    if (content) {
      let info = decodeURI(content)
      info = info.split(':')
      console.log(info)
      this.$emit('input', info[0])

      if (this.$q.platform.is.cordova) {
        this.visibility = true
        this.$emit('on-qr-scanner', true)
        window.QRScanner.hide()
        window.QRScanner.destroy()
      } else {
        this.turnCameraOff()
      }

      this.loading = false
      this.closePopUp()
    } else {
      this.$q.notify({ progress: true, message: 'QR code could not be detected, please ensure to scan QR code within 30cm', type: 'negative', position: 'top', timeout: 2000 })
      this.loaded = true

      if (this.$q.platform.is.cordova) {
        window.QRScanner.show()
        window.QRScanner.scan(this.displayContent)
      } else {
        this.turnCameraOn()
      }
    }
  },
  turnCameraOn () {
    this.camera = 'auto'
  },
  turnCameraOff () {
    this.camera = 'off'
  },
  exitFullscreen () {
    console.log('exit full screen intated')
    this.setBodyBackgroundColor()
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) { /* Firefox */
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) { /* IE/Edge */
      document.msExitFullscreen()
    }
  }
}
}
</script>
<style lang="stylus">
.fullscreen
 top: 10;
 bottom: 0;
 right: 0;
 left: 0;
.validation-pending
 width: 100%;
 height: 100%;
 background-color: rgba(255, 255, 255, .8);
</style>
