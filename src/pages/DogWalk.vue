<template>
    <q-page>
        <div>
          <!-- Google Maps -->
          <div ref="map" style="width: 100%;height: 28vh;" class="map-style" v-if="!finishWalking"></div>
          <img ref="staticmap" :src="imageData" id="pratik" alt="" style="position: absolute; z-index:1" v-if="finishWalking">
          <div class="row justify-center absolute-top q-mt-md">
            <q-item v-for="index in petInfo.selectedPets.length > 3 ? 3 : petInfo.selectedPets.length" :key="petInfo.selectedPets[index - 1].id" dense class="q-pa-none" style="border-radius: 25px;z-index: 3000;" clickable @click="petDetailsModal = true">
              <q-item-section thumbnail class="q-mr-sm" :class="{'q-pr-none': petInfo.selectedPets.length > 3}" :style="{marginLeft: petInfo.selectedPets.length > 3 ? '-11px;' : '-16px'}">
                <q-avatar style="width: 55px;height: 55px;">
                  <img :src="petInfo.selectedPets[index - 1].mediaInfo[0].filePath" class="image-upload"/>
                </q-avatar>
              </q-item-section>

              <q-item-section side v-if="index === (petInfo.selectedPets.length - 1) && petInfo.selectedPets.length > 3">
                <q-item-label>+ {{petInfo.selectedPets.length - 3}}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>

        <!-- <div class="fixed-top text-right" style="z-index: 10000; top: 8px; right:8px;">
          <q-icon name="refresh" @click="mapImage" size="md"></q-icon>
        </div> -->
        <div class="fixed-bottom bg-white justify-center" style="height: 66vh;">
          <p class="fade"><!-- To add fade effect --></p>
          <!-- Landing Welcome (Start Walking) -->
          <div class="row" v-if="walkedTime.seconds === 0 && startWalking === false">
            <!-- Start/Pause Walking -->
            <div class="text-center col-12 q-my-md absolute-bottom bottom-margin">
              <q-btn :icon="startWalking ? 'fas fa-pause' : 'fas fa-play'" class="q-pa-sm" color="primary" size="lg" round @click="triggerTracking"></q-btn>
              <p class="q-my-none q-mt-md font-header-title-large text-secondary">{{startWalking ? 'Stop Walk' : this.$t('start.walking')}}</p>
            </div>

            <h6 class="col-12 absolute-bottom font-normal text-center font-normal q-px-xl" v-if="petInfo.taskId.length > 0">
              {{$t('dog.walk.location.recorded.for.pet.owner')}}
              <p class="q-my-none"><a style="text-decoration: none;" href="https://www.petbacker.com">{{$t('chat.learnmore')}}</a></p>
            </h6>
          </div>

          <!-- Dog Walking (Done) -->
          <div class="row" v-else-if="finishWalking" ref="dog-walk-done">
            <h6 class="q-my-none col-12 text-center text-weight-bold" v-html="$t('completed.walk.at.petbacker', {username: $store.getters['user/getUserName']})"></h6>
            <!-- Distance -->
            <div class="col-6 text-center text-clamp10 q-px-xs">
              <!-- <q-img src="statics/images/dog-walking/distance_icon.png" style="height: 42px; width: 42px;"></q-img> -->
              {{walkedDistance}}<span class="font-normal">km</span>
              <p class="font-normal">Total distance walked</p>
            </div>

            <!-- Time -->
            <div class="col-6 text-center text-clamp10 q-px-xs">
              <!-- <q-img src="statics/images/dog-walking/duration_icon.png" style="height: 42px; width: 42px;"></q-img> -->
              <span v-if="walkedTime.hours !== '00' && walkedTime.hours !== 0">{{walkedTime.hours}}<span class="font-normal">h</span> </span>{{walkedTime.minutes}}<span class="font-normal">min</span> {{walkedTime.seconds}}<span class="font-normal">sec</span>
              <p class="font-normal">Total time walked</p>
            </div>

            <div class="col-12 q-px-xl" v-if="petWithEvents.length > 0">
              <h6 class="col-12 q-my-xs font-normal text-left q-pl-md font-normal">Achievements</h6>

              <!-- Achivements -->
              <q-item  v-for="pet in petWithEvents" :key="pet.id">
                <!-- Pet Image -->
                <q-item-section thumbnail style="margin-left: 0px;">
                  <img :src="pet.mediaInfo[0].filePath" :alt="pet.title" class="image-upload" style="width: 55px; height: 55px;border-radius: 7px" />
                </q-item-section>

                <!-- Description -->
                <q-item-section>
                  <q-item-label>{{ pet.title }}</q-item-label>
                  <q-item-label>{{ pet.poo ? `${$t('poo.count', {pooCount: pet.poo})}` : '' }}{{ pet.pee ? `${pet.poo ? ', ' : ' '}${$t('pee.count', {peeCount: pet.pee})}` : '' }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div class="absolute-bottom bg-primary" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" v-if="!loading && showShareWalkButton && finishWalking">
              <div class="q-pa-md">
                <div class="text-white q-pb-sm text-center cursor-pointer font-header-title">
                  <q-btn :loading="loading" class="col-xs-12 text-white font-normal text-capitalize" flat style="border-radius: 0px;" @click="sharingDialog = true" :ripple="false" label="Share This Walk"></q-btn>
                </div>
              </div>
            </div>
          </div>

          <!-- Dog Walking (In Progress) -->
          <div class="row" v-else>
            <div class="row col-12">
              <!-- Distance -->
              <div class="col-6 text-center text-clamp10 q-px-xs">
                <!-- <q-img src="statics/images/dog-walking/distance_icon.png" style="height: 42px; width: 42px;"></q-img> -->
                {{walkedDistance}}<span class="font-normal">km</span>
                <p class="font-normal">Total distance walked</p>
              </div>

              <!-- Time -->
              <div class="col-6 text-center text-clamp10 q-px-xs">
                <!-- <q-img src="statics/images/dog-walking/duration_icon.png" style="height: 42px; width: 42px;"></q-img> -->
                <span v-if="walkedTime.hours !== '00' && walkedTime.hours !== 0">{{walkedTime.hours}}<span class="font-normal">h</span> </span>{{walkedTime.minutes}}<span class="font-normal">min</span> {{walkedTime.seconds}}<span class="font-normal">sec</span>
                <p class="font-normal">Total time walked</p>
              </div>
            </div>

            <div class="row col-12">
              <!-- Start/Pause Walking -->
              <div class="text-center col-6 q-my-md" style="padding-left: 15%;">
                <q-btn :icon="startWalking ? 'fas fa-pause' : 'fas fa-play'" class="q-pa-sm" color="primary" size="lg" round @click="triggerTracking"></q-btn>
                <p class="text-clamp5 q-my-none q-mt-md font-header-title-large text-secondary">{{startWalking ? this.$t('pause.walk') : this.$t('start.walk')}}</p>
              </div>

              <!-- Stop Walking -->
              <div class="text-center col-6 q-my-md" style="padding-right: 15%;">
                <q-btn icon="fas fa-stop" class="q-pa-sm" color="primary" size="lg" @click="onStopWalking" round></q-btn>
                <p class="text-clamp5 q-my-none q-mt-md font-header-title-large text-secondary">{{this.$t('end.walk')}}</p>
              </div>
            </div>

            <h6 class="col-12 q-my-md font-normal text-center font-normal">Record a poo or pee event</h6>
            <div class="row col-12">
              <!-- Poop Button -->
              <div class="col-6 text-center" style="padding-left: 25%;">
                <q-btn icon="fas fa-poop" round color="primary" :ripple="false" @click="onTriggerPetEventsModal(true, 'poo')" size="18px" class="q-px-none"></q-btn>
                <p class="q-my-none q-mt-sm">{{$t('poo.count', {pooCount: poopCount})}}</p>
              </div>

              <!-- Pee Button -->
              <div class="col-6 text-center" style="padding-right: 25%;">
                <q-btn icon="fas fa-tint" round color="primary" :ripple="false" @click="onTriggerPetEventsModal(true, 'pee')" size="18px" class="q-px-none"></q-btn>
                <p class="q-my-none q-mt-sm">{{$t('pee.count', {peeCount: peeCount})}}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Canvas for cropping screenshot -->
        <canvas style="display: none;" ref="dog-walk-canvas"></canvas>

        <!-- Prompt Dialog -->
        <dialog-prompt :trigger="promptModal" :message="promptMessage" :title="promptTitle" :okButtonLabel="okButtonLabel" :cancelButtonLabel="cancelButtonLabel" @on-ok="handleOnOk" @on-close="triggerPromptDialog"></dialog-prompt>

        <!-- Share Dialog -->
        <q-dialog v-model="sharingDialog" auto-close  position="bottom" class="moreOptions" transition-show="slide-up">
          <dialog-share :detail="`I have completed a dog walking at PetBacker!`" :shareLink="`${$t('link.href.petbacker')}${shareUrl}`"></dialog-share>
        </q-dialog>

        <!-- Pet Details Dialog -->
        <dialog-petdetails :trigger="petDetailsModal" @on-close="onClosePetDetailsModal"></dialog-petdetails>

        <!-- Pet Events Dialog -->
        <dialog-pet-events :trigger="petEventsModal" :type="petEventType" @on-save="onSavePetEvent" @on-close="onTriggerPetEventsModal"></dialog-pet-events>

        <!-- Dialog Count Down -->
        <dialog-countdown :trigger="countdownModal" @on-close="triggerCountDownModal"></dialog-countdown>
    </q-page>
</template>
<script>
import moment from 'moment'
import ImageTools from 'assets/ImageTools.js'

export default {
  components: {
    'dialog-petdetails': () => import('components/DogWalk/DialogPetDetails.vue'),
    'dialog-pet-events': () => import('components/DogWalk/DialogPetEvents.vue'),
    'dialog-countdown': () => import('components/DogWalk/DialogCountDown.vue'),
    'dialog-share': () => import('components/DialogShare.vue'),
    'dialog-prompt': () => import('components/DialogPrompt.vue')
  },
  data () {
    return {
      promptModal: false,
      promptMessage: '',
      promptTitle: '',
      okButtonLabel: 'OK',
      cancelButtonLabel: 'Back To Walk',
      sharingDialog: false,
      countdownModal: false,
      petInfo: null,
      gMap: null,
      coordinates: [],
      path: null,
      marker: null,
      startWalking: false,
      pauseTime: {
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      gpsConfig: {
        enableHighAccuracy: true,
        // timeout: Infinity,
        timeout: 10000, // 10 seconds
        maximumAge: 0
      },
      gpsId: null,
      walkTimerInterval: null,
      walkedTime: {
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      startTime: null,
      walkedDistance: 0,
      poopMarker: null,
      peeMarker: null,
      peeCount: 0,
      poopCount: 0,
      petDetailsModal: false,
      petEventsModal: false,
      petEventType: 'pee',
      currentCoordinates: {
        latitude: null,
        longitude: null
      },
      shareImage: null,
      screenShotImage: {
        width: screen.width,
        height: screen.height
      },
      finishWalking: false,
      showShareWalkButton: false,
      shareUrl: '',
      loading: false,
      showRefresh: 0,
      play_accuracy_error: true,
      imageData: null,
      peeMarkers: [],
      poopMarkers: [],
      peeMarkers2: [],
      poopMarkers2: [],
      dialogPromptFor: null
    }
  },
  computed: {
    petWithEvents () {
      if (this.$q.localStorage.has('dogWalkInfo')) {
        return this.$q.localStorage.getItem('dogWalkInfo').selectedPets.filter(pet => {
          if (pet.pee || pet.poo) {
            return true
          }
        })
      } else {
        return []
      }
    }
  },
  preFetch ({ store }) {
    store.dispatch('user/cacheGeoLocation')
  },
  created () {
    this.onCreated()
  },
  mounted () {
    history.pushState(null, null, location.href)

    // detect browser back button
    window.addEventListener('popstate', this.backButtonDetected, false)
    // this.$root.$on('start-walk', this.startWalk)
    // this.$root.$on('pause-walk', this.pauseWalk)
  },
  beforeDestroy () {
    navigator.geolocation.clearWatch(this.gpsId)
    clearInterval(this.walkTimerInterval)

    if (this.startWalking) {
      this.triggerTracking()
    }
    // cordova.plugins.notification.local.clear(1)
    window.removeEventListener('popstate', this.backButtonDetected)
    this.$root.$off('start-walk', this.startWalk)
    this.$root.$off('pause-walk', this.pauseWalk)
  },
  destroyed () {
    if (this.$q.localStorage.has('dogWalkInfo')) {
      this.$q.localStorage.remove('dogWalkInfo')
    }
  },
  methods: {
    backButtonDetected (event) {
      if (this.walkedTime.hours !== 0 && this.walkedTime.minutes !== 0 && this.walkedTime.seconds !== 0 && !this.finishWalking) {
        if (event.state) {
          history.pushState(null, null, location.href)
        }
        this.dialogPromptFor = 'backButton'
        this.triggerPromptDialog(true, this.$t('do you want to put dog walk in background?'), this.$t('background walking'), this.$t('put in background'), this.$t('stay here'))
      }
    },
    async mapImage () {
      let path = []
      path.push('color:0x512DA8') // near to #9B89B9 for staticmap
      path.push('weight:3')
      for (let index = 0; index < this.coordinates.length; index++) {
        const coordinate = this.coordinates[index]
        path.push(coordinate.latitude + ',' + coordinate.longitude)
      }
      let size = this.$refs.map.clientWidth + 'x' + this.$refs.map.clientHeight
      let markers = []
      for (let index = 0; index < this.poopMarkers.length; index++) {
        const marker = this.poopMarkers[index]
        markers.push(marker)
      }
      for (let index = 0; index < this.peeMarkers.length; index++) {
        const marker = this.peeMarkers[index]
        markers.push(marker)
      }

      // const lastCoordinate = this.coordinates[this.coordinates.length - 1]
      // markers.push(`icon:${encodeURIComponent(`path:${google.maps.SymbolPath.CIRCLE}|fillOpacity:1|fillColor:#3083b7|strokeColor:#3083b7|scale:6`)}|${lastCoordinate.latitude},${lastCoordinate.longitude}`)
      if (markers.length > 0) {
        this.imageData = `https://maps.googleapis.com/maps/api/staticmap?size=${size}&path=${path.join('|')}&sensor=false&key=${process.env.GOOGLE_MAPS_KEY}&markers=${markers.join('&markers=')}`
      } else {
        this.imageData = `https://maps.googleapis.com/maps/api/staticmap?size=${size}&path=${path.join('|')}&sensor=false&key=${process.env.GOOGLE_MAPS_KEY}`
      }
    },
    onCreated () {
      this.getCurrentLocation()
      this.getDogWalkInfo()
    },
    triggerPromptDialog (status, message = null, title = null, okBtnLabel = null, cancelBtnLabel = null) {
      if (message) {
        this.promptMessage = message
      }

      if (title) {
        this.promptTitle = title
      }

      if (okBtnLabel) {
        this.okButtonLabel = okBtnLabel
      }

      if (cancelBtnLabel) {
        this.cancelButtonLabel = cancelBtnLabel
      }

      this.promptModal = status
    },
    triggerCountDownModal (status) {
      this.countdownModal = status
    },
    onTriggerPetEventsModal (status, eventType = null) {
      if (eventType) {
        this.petEventType = eventType

        if (this.petInfo.selectedPets.length === 1) {
          switch (eventType) {
            case 'poo':
              this.onPoop(1)
              if (this.petInfo.selectedPets[0]['poo']) {
                this.petInfo.selectedPets[0]['poo'] += 1
              } else {
                this.petInfo.selectedPets[0]['poo'] = 1
              }
              this.$q.localStorage.set('dogWalkInfo', this.petInfo)
              break
            case 'pee':
              this.onPee(1)
              if (this.petInfo.selectedPets[0]['pee']) {
                this.petInfo.selectedPets[0]['pee'] += 1
              } else {
                this.petInfo.selectedPets[0]['pee'] = 1
              }
              this.$q.localStorage.set('dogWalkInfo', this.petInfo)
              break
          }
          return
        }
      }

      this.petEventsModal = status
    },
    onClosePetDetailsModal (status) {
      this.petDetailsModal = status
    },
    getDogWalkInfo () {
      if (this.$q.localStorage.has('dogWalkInfo')) {
        this.petInfo = this.$q.localStorage.getItem('dogWalkInfo')

        if (this.petInfo.trackDistance) {
          this.walkedDistance = parseFloat(this.petInfo.trackDistance).toFixed(2)
        }

        if (this.petInfo.walkDuration) {
          this.walkedTime = this.petInfo.walkDuration
          this.pauseTime = {
            hours: parseInt(this.petInfo.walkDuration.hours),
            minutes: parseInt(this.petInfo.walkDuration.minutes),
            seconds: parseInt(this.petInfo.walkDuration.seconds)
          }
        }

        if (this.petInfo.peeCount) {
          this.peeCount = this.petInfo.peeCount
        }

        if (this.petInfo.pooCount) {
          this.poopCount = this.petInfo.pooCount
        }

        if (this.petInfo.coordinates) {
          this.coordinates = this.petInfo.coordinates
        }
      }
    },
    onStopWalking () {
      this.dialogPromptFor = 'stopWalking'
      this.triggerPromptDialog(true, this.$t('dog.walk.end.shared'), this.$t('confirm.end.walk'), this.$t('end.walk'), this.$t('back.to.walk'))
    },
    async stopWalking () {
      // clear all intervals and tracking
      await this.mapImage()
      navigator.geolocation.clearWatch(this.gpsId)
      clearInterval(this.walkTimerInterval)

      this.finishWalking = true

      // screenshot current view
      await new Promise(resolve => setTimeout(resolve, 1000))
      await this.screenShot()
      await new Promise(resolve => setTimeout(resolve, 1100))
      this.showShareWalkButton = true

      this.loading = true
      this.$emit('on-loading', this.loading)
    },
    async screenShot () {
      return new Promise((resolve, reject) => {
        navigator.screenshot.URI((error, res) => {
          if (error) {
            reject(error)
          } else {
            // create image instance
            this.screenShotImage = new Image()

            // crop image after loaded
            this.screenShotImage.onload = () => {
              this.cropScreenShot()
              resolve()
            }
            this.screenShotImage.src = res.URI
          }
        }, 100)
      })
    },
    /**
     * Crop navbar on screenshot
     */
    cropScreenShot () {
      let canvas = this.$refs['dog-walk-canvas']
      let context = canvas.getContext('2d')
      // canvasHeight is for removing below blank space
      let canvasHeight = 0
      if (this.petWithEvents.length > 0) {
        canvasHeight = 1550
      } else {
        canvasHeight = 1250
      }
      // compute ratio and crop height
      let ratio = Math.floor(this.screenShotImage.height / 540)
      let cropHeight = (60 * ratio)

      // set canvas width and height
      canvas.width = this.screenShotImage.width
      // canvas.height = (this.screenShotImage.height - cropHeight - canvasHeight)
      canvasHeight = (this.$refs['dog-walk-done'].getBoundingClientRect().bottom - this.$refs['staticmap'].getBoundingClientRect().top) * (ratio)
      if (screen.height < 768) {
        canvasHeight = (this.$refs['dog-walk-done'].getBoundingClientRect().bottom - this.$refs['staticmap'].getBoundingClientRect().top) * (ratio + 1) + 120
      }
      canvas.height = (canvasHeight - cropHeight)

      // crop image on canvas
      // context.drawImage(this.screenShotImage, 0, cropHeight, this.screenShotImage.width, this.screenShotImage.height, 0, 0, this.screenShotImage.width, this.screenShotImage.height)
      context.drawImage(this.screenShotImage, 0, cropHeight, this.screenShotImage.width, (canvasHeight), 0, 0, this.screenShotImage.width, (canvasHeight))

      // make image blob with base64 encoding
      let imageBlob = this.dataURItoBlob(canvas.toDataURL('image/jpeg').split(';base64,')[1])

      // resize and upload screenshot
      let vm = this
      ImageTools.resize(imageBlob, function (blob, didItResize) {
        let formData = new FormData()
        formData.append('imagefile', blob, 'image.jpg')
        vm.$axios.post('imageupload?type=moment', formData)
          .then((response) => {
            let mediaInfo = {
              'contentType': 'image',
              'fileName': response.data.imageName,
              'filePath': response.data.imagePath
            }

            vm.shareImage = mediaInfo
            console.log(vm.shareImage)
          }).catch(e => {
            console.error(e)
            vm.$q.notify(e.response.data.message)
          }).finally(_ => {
            vm.loader = false
            vm.submitDogWalkInfo()
          })
      })
    },
    dataURItoBlob (dataURI, contentType = 'image/jpg', sliceSize = 512) {
      const byteCharacters = atob(dataURI)
      const byteArrays = []

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize)

        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }

      const blob = new Blob(byteArrays, {type: contentType})
      return blob
    },
    submitDogWalkInfo () {
      let dogWalkInfo = {
        'dogWalkInfo': {
          'coordinates': this.coordinates,
          'screenshot': this.shareImage,
          'personalItems': this.$q.localStorage.getItem('dogWalkInfo').selectedPets,
          'poopCount': this.poopCount,
          'peeCount': this.peeCount,
          'totalDistance': this.walkedDistance,
          'totalTime': this.walkedTime
        }
      }

      this.$axios.put(`users/${this.$store.state.user.uuid}/dog-walks/${this.petInfo.id}`, dogWalkInfo, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$q.notify({message: this.$t('dog.walk.info.successfully.saved'), type: 'positive', position: 'top'})
        this.shareUrl = response.data.dogWalkInfo.shareUrl

        // remove cache in pet walks if exist
        if (this.$q.localStorage.has('petWalks')) {
          let petWalks = this.$q.localStorage.getItem('petWalks')

          if (petWalks[this.petInfo.id]) {
            delete petWalks[this.petInfo.id]
            this.$q.localStorage.set('petWalks', petWalks)
          }
        }
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        this.loading = false
        this.$emit('on-loading', this.loading)
        this.$q.loading.hide()
      })
    },
    onSavePetEvent (eventType, petCount) {
      switch (eventType) {
        case 'poo': this.onPoop(petCount); break
        case 'pee': this.onPee(petCount); break
      }
    },
    // add pee pin in maps
    onPee (petCount) {
      let peePin = {
        url: 'statics/images/dog-walking/dog_pee_pin.png',
        scaledSize: new google.maps.Size(50, 60)
      }
      var lastCoordinate = this.coordinates[this.coordinates.length - 1]

      this.peeMarker = new google.maps.Marker({
        map: this.gMap,
        animation: google.maps.Animation.DROP,
        // position: this.gMap.getCenter(),
        position: new google.maps.LatLng(lastCoordinate.latitude, lastCoordinate.longitude),
        icon: peePin
      })
      this.peeCount += (1 * petCount)
      this.peeMarkers2.push(lastCoordinate.latitude + ',' + lastCoordinate.longitude)
      this.peeMarkers.push('icon:https://storage.googleapis.com/petbacker/resources/dog_pee_pin_2.ico|' + lastCoordinate.latitude + ',' + lastCoordinate.longitude)
    },
    // add poo pin in maps
    onPoop (petCount) {
      let poopPin = {
        url: 'statics/images/dog-walking/dog_poop_pin.png',
        scaledSize: new google.maps.Size(50, 60)
      }
      var lastCoordinate = this.coordinates[this.coordinates.length - 1]
      this.poopMarker = new google.maps.Marker({
        map: this.gMap,
        animation: google.maps.Animation.DROP,
        // position: this.gMap.getCenter(),
        position: new google.maps.LatLng(lastCoordinate.latitude, lastCoordinate.longitude),
        icon: poopPin
      })
      this.poopCount += (1 * petCount)
      this.poopMarkers2.push(lastCoordinate.latitude + ',' + lastCoordinate.longitude)
      this.poopMarkers.push('icon:https://storage.googleapis.com/petbacker/resources/dog_poop_pin_2.ico|' + lastCoordinate.latitude + ',' + lastCoordinate.longitude)
    },
    updateTime () {
      const seconds = moment().diff(moment(this.startTime), 'seconds')
      this.walkedTime = this.formatTime(seconds)
    },
    formatTime (secs) {
      const minutes = Math.floor((secs + this.pauseTime.seconds) / 60)
      const hours = Math.floor((minutes + this.pauseTime.minutes) / 60)

      return {hours: this.pad(hours + this.pauseTime.hours), minutes: this.pad(((minutes + this.pauseTime.minutes) % 60)), seconds: this.pad(((secs + this.pauseTime.seconds) % 60))}
    },
    pad (num) {
      return ('0' + num).slice(-2)
    },
    triggerTracking () {
      if (this.startWalking) {
        this.startWalking = false
        this.pauseWalk()
      } else {
        this.startWalking = true
        if (this.petInfo.started === false) {
          this.submitStartWalk()
          setTimeout(this.startWalk, 3009)
          this.triggerCountDownModal(true)
        } else {
          this.startWalk()
        }
      }
    },
    pauseWalk () {
      // pause dog walk
      navigator.geolocation.clearWatch(this.gpsId)
      clearInterval(this.walkTimerInterval)

      // save pause time to be added later when resume dog walking
      this.pauseTime = {
        hours: parseInt(this.walkedTime.hours),
        minutes: parseInt(this.walkedTime.minutes),
        seconds: parseInt(this.walkedTime.seconds)
      }

      // save to cache
      if (this.$q.localStorage.has('petWalks')) {
        let petWalks = this.$q.localStorage.getItem('petWalks')

        let dogWalkInfo = {
          'id': this.petInfo.id,
          'coordinates': this.coordinates,
          'selectedPets': this.$q.localStorage.getItem('dogWalkInfo').selectedPets,
          'pooCount': this.poopCount,
          'poopMarkers': this.poopMarkers2,
          'peeCount': this.peeCount,
          'peeMarkers': this.peeMarkers2,
          'trackDistance': this.walkedDistance,
          'walkDuration': this.pauseTime,
          'taskId': this.$q.localStorage.getItem('dogWalkInfo').taskId,
          'started': this.petInfo.started
        }
        petWalks[this.petInfo.id] = dogWalkInfo

        this.$q.localStorage.set('petWalks', petWalks)
        console.log('save')
        console.log(petWalks)
      }
      // cordova.plugins.notification.local.update({
      //   id: 1,
      //   title: 'Petbacker',
      //   text: 'Dog walk is paused',
      //   // actions: [
      //   //   { id: 'start', title: 'Start', type: 'button' }
      //   // ],
      //   sticky: true,
      //   foreground: true
      // })
    },
    startWalk () {
      // start dog walk
      // initialized gps tracking
      this.initializedTracking()
      // check if notification is already present or scheduled
      /* cordova.plugins.notification.local.isPresent(notifId, function (present) {
        if (present) {
          // if notification is already present or scheduled
          console.log('Notification is already present or scheduled with id: ' + notifId)
          // update the notification
          cordova.plugins.notification.local.update({
            id: notifId,
            title: 'Petbacker',
            text: 'Dog walk is running',
            // actions: [
            //   { id: 'pause', title: 'Pause', type: 'button' }
            // ],
            sticky: true,
            foreground: true
          })
        } else {
          // if notification is not present or not yet scheduled, schedule the notification
          console.log('Notification is not yet present or scheduled with id: ' + notifId)
          cordova.plugins.notification.local.schedule({
            id: notifId,
            title: 'Petbacker',
            text: 'Dog walk is running',
            // actions: [
            //   { id: 'pause', title: 'Pause', type: 'button' }
            // ],
            sticky: true,
            foreground: true
          })
        }
      }) */
      // start time tracking
      this.startTime = moment()
      this.walkTimerInterval = setInterval(this.updateTime, 1000)
    },
    submitStartWalk () {
      let dogWalkInfo = {
        'dogWalkInfo': {
          'personalItems': this.petInfo.selectedPets,
          'taskId': this.petInfo.taskId || null
        }
      }

      this.$axios.post(`users/${this.$store.state.user.uuid}/dog-walks`, dogWalkInfo, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.petInfo.id = response.data.dogWalkInfo.id

        // update walk status
        this.petInfo.started = true
        this.$q.localStorage.set('dogWalkInfo', this.petInfo)

        // check for existing pet walks and cache pet walks to pause/resume in the future
        let petWalks = {}
        if (this.$q.localStorage.has('petWalks')) {
          petWalks = this.$q.localStorage.getItem('petWalks')
        }

        // constructure cache structure
        petWalks[this.petInfo.id] = {
          'id': this.petInfo.id,
          'coordinates': this.coordinates,
          'selectedPets': this.petInfo.selectedPets,
          'pooCount': this.poopCount,
          'peeCount': this.peeCount,
          'trackDistance': this.walkedDistance,
          'walkDuration': this.walkedTime,
          'taskId': this.petInfo.taskId,
          'started': this.petInfo.started
        }

        this.$q.localStorage.set('petWalks', petWalks)
      }).catch((error) => {
        console.error(error)
      })
    },
    showErrorNotification (error) {
      switch (error.code) {
        case 1:
          this.$q.notify({message: 'User denied the request for Geolocation.', position: 'bottom', type: 'negative'})
          break
        case 2:
          this.$q.notify({message: 'Location information is unavailable.', position: 'bottom', type: 'negative'})
          break
        case 3:
          this.$q.notify({message: 'Please wait we are trying to get your location.', position: 'bottom', type: 'negative'})
          break
        default:
          this.$q.notify({message: 'An unknown error occurred.', position: 'bottom', type: 'negative'})
          break
      }
    },
    getCurrentLocation () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentCoordinates.latitude = position.coords.latitude
        this.currentCoordinates.longitude = position.coords.longitude
        setTimeout(this.loadMap, 0)
        this.showRefresh = 0
      }, (error) => {
        console.error(error)
        this.showErrorNotification(error)
        this.showRefresh = 1
        setTimeout(this.getCurrentLocation, 6000)
        // alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n')
        /* if (this.currentCoordinates.latitude === null || this.currentCoordinates.longitude === null) {
          this.currentCoordinates.latitude = parseFloat(this.$store.getters['user/getUserLatitude'])
          this.currentCoordinates.longitude = parseFloat(this.$store.getters['user/getUserLongitude'])
        }
        setTimeout(this.loadMap, 0) */
      }, {
        enableHighAccuracy: true,
        timeout: 500,
        maximumAge: 0
      })
    },
    async loadMap () {
      try {
        /* global google */
        const mapElement = this.$refs['map']
        // cache coordinates array length
        // const coordinatesLength = this.coordinates.length

        this.gMap = new google.maps.Map(mapElement, {
          center: {lat: this.currentCoordinates.latitude, lng: this.currentCoordinates.longitude},
          zoom: 18,
          disableDefaultUI: true,
          draggable: false,
          scrollwheel: false,
          disableDoubleClickZoom: true,
          zoomControl: false
        })

        // add current start coordinates
        // if (coordinatesLength > 0) {
        // const currentCoords = this.coordinates[coordinatesLength - 1]
        this.coordinates.push({latitude: this.currentCoordinates.latitude, longitude: this.currentCoordinates.longitude})
        // }

        // cache map center position
        const mapCenter = this.gMap.getCenter()

        // add marker to current location
        this.marker = new google.maps.Marker({
          position: mapCenter,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillOpacity: 1,
            fillColor: '#3083b7',
            strokeColor: '#3083b7',
            scale: 6
          },
          map: this.gMap
        })
        console.log(this.petInfo.coordinates)
        // set current location as start path
        let coordinates = []
        if (this.petInfo && this.petInfo.coordinates && this.petInfo.coordinates.length) {
          coordinates = this.petInfo.coordinates.map(item => {
            return { lat: item.latitude, lng: item.longitude }
          })
        }
        this.path = new google.maps.Polyline({
          // predraw tracking traces when available from cache
          path: coordinates,
          geodesic: true,
          strokeColor: '#9B89B9',
          strokeOpacity: 1.0,
          strokeWeight: 3
        })
        if (this.petInfo && this.petInfo.peeMarkers && this.petInfo.peeMarkers.length) {
          let peePin = {
            url: 'statics/images/dog-walking/dog_pee_pin.png',
            scaledSize: new google.maps.Size(50, 60)
          }
          this.peeMarkers2 = this.petInfo.peeMarkers
          this.petInfo.peeMarkers.forEach(marker => {
            let coord = marker.split(',')
            this.peeMarker = new google.maps.Marker({
              map: this.gMap,
              animation: google.maps.Animation.DROP,
              position: new google.maps.LatLng(coord[0], coord[1]),
              icon: peePin
            })
          })
        }
        if (this.petInfo && this.petInfo.poopMarkers && this.petInfo.poopMarkers.length) {
          let pooPin = {
            url: 'statics/images/dog-walking/dog_poo_pin.png',
            scaledSize: new google.maps.Size(50, 60)
          }
          this.poopMarkers2 = this.petInfo.poopMarkers
          this.petInfo.poopMarkers.forEach(marker => {
            let coord = marker.split(',')
            this.pooMarker = new google.maps.Marker({
              map: this.gMap,
              animation: google.maps.Animation.DROP,
              position: new google.maps.LatLng(coord[0], coord[1]),
              icon: pooPin
            })
          })
        }

        this.path.setMap(this.gMap)
      } catch (error) {
        console.error(error)
      }
    },
    initializedTracking () {
      //  this.$q.notify({message: 'initialized tracking', position: 'top'})
      this.gpsId = navigator.geolocation.watchPosition((position) => {
        // const { latitude, longitude } = position.coords
        console.table(position.coords)
        const lastCoords = this.coordinates.slice(-1)[0] || { latitude: 0, longitude: 0 }
        const distanceBetween = this.distance(lastCoords, position.coords)
        console.log(lastCoords, position.coords)
        console.log(`distance: ${distanceBetween}`)

        if (position.coords.accuracy > 100) { // check if the accuracy of the received position is greater than 100 meters
          if (this.play_accuracy_error) { // check if the flag is true to play the error sound
            // show a notification with warning message to the user
            this.$q.notify({
              message: 'GPS signal is lost or Weak GPS, path may be inaccurate!',
              type: 'negative',
              position: 'bottom'
            })
            // play an audio sound
            const sound = new Audio('/statics/sounds/gps_signal_is_lost.mp3')
            sound.play()
            // set the flag to false so that the sound is played only once per 5 minutes
            this.play_accuracy_error = false
            setTimeout(() => {
              // set the flag back to true after 5 minutes, so that the sound can be played again if needed
              this.play_accuracy_error = true
            }, 5 * 60 * 1000)
          }
        }

        if ((position.coords.accuracy <= 100 && distanceBetween <= 0.59) || !this.coordinates.length) {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude

          this.coordinates.push({ latitude, longitude, distance: distanceBetween })
          console.log('inserted: ' + distanceBetween, {latitude, longitude})
          let currentPosition = new google.maps.LatLng(latitude, longitude)

          // update gmap to reflect latest location
          this.gMap.panTo(currentPosition)

          // update marker
          this.marker.setPosition(currentPosition)

          // update path
          const currentPath = this.path.getPath()
          currentPath.push(currentPosition)

          // update distance travelled
          this.walkedDistance = (+this.walkedDistance + distanceBetween).toFixed(2)

          try {
            const bounds = new google.maps.LatLngBounds()

            this.coordinates.forEach(coord => {
              const { latitude, longitude } = coord
              bounds.extend({ lat: parseFloat(latitude), lng: parseFloat(longitude) })
            })

            this.gMap.fitBounds(bounds)

            if (this.gMap.getZoom() > 18) {
              this.gMap.setZoom(18)
            }
          } catch (error) {
            console.error(error)
          }
        }
      }, (error) => {
        console.error(error)
        this.showErrorNotification(error)
      }, this.gpsConfig)
    },
    /**
     * Compute straight line distance following curvature of the earth
     */
    distance (position1, position2) {
      let p = 0.017453292519943295
      let c = Math.cos
      let a = 0.5 - c((position2.latitude - position1.latitude) * p) / 2 + c(position1.latitude * p) * c(position2.latitude * p) * (1 - c((position2.longitude - position1.longitude) * p)) / 2

      return 12742 * Math.asin(Math.sqrt(a))
    },
    handleOnOk () {
      if (this.dialogPromptFor === 'stopWalking') {
        this.stopWalking()
      }
      if (this.dialogPromptFor === 'backButton') {
        cordova.plugins.backgroundMode.enable()
        cordova.plugins.backgroundMode.moveToBackground()
        this.triggerPromptDialog(false)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.fade
  position: absolute;
  top: -88px;
  display: block;
  width: 100%;
  height: 89px;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.99));
.bottom-margin {
  margin-bottom: 150px;
}
.top-fixed {
    z-index: 99999;
    text-align: center;
    top: 10px;
    font-size: 22px;
}
.text-clamp10{
  p{
    font-size: clamp(0.25rem, 5vw, 1.125rem);
  }
    font-size: clamp(1.5rem, 10vw, 3.125rem);
}
.text-clamp5{
  font-size: clamp(1rem, 5vw, 1.5rem);
}
</style>
