<template>
    <q-dialog v-model="modal" @hide="closePopUp" :seamless="!visibility" :content-style="visibility ? '' : 'display: none;'" :maximized="$q.platform.is.mobile" transition-show="slide-up" transition-hide="slide-down">
        <q-card :style="{'max-width: 355px;': $q.platform.is.desktop}">
          <!-- Header -->
          <q-toolbar class="fixed-top bg-white" style="z-index: 2000;border-bottom: 1px solid lightgrey;">
            <q-toolbar-title @click="closePopUp">
              <h6 class="q-my-none services-title font-header-title" style="margin-left: 39%;">{{$t('job.completed')}}</h6>
            </q-toolbar-title>
            <q-btn flat round dense icon="close" @click="closePopUp"></q-btn>
          </q-toolbar>

          <q-card-section class="text-center q-pt-xl" v-if="jobMarkedCompleted">
            <h6 class="q-my-none q-mb-md font-normal q-mt-md">{{$t('time.to.show.how.happy.pet.was')}}</h6>

            <!-- Image Container -->
            <div v-if="responseInfo && parseInt(responseInfo.requestInfo.serviceId) === 19" style="height: 220px;max-height: 220px;position: relative;" class="bg-grey-3">
              <q-img class="image-upload" style="max-height: 220px;" :src="combinedImage.filePath" v-if="combinedImage"></q-img>
            </div>
            <div v-else style="height: 220px;max-height: 220px;position: relative;" class="bg-grey-3">
              <q-img class="image-upload" style="max-height: 220px;" :src="imageInfo.filePath" v-if="imageInfo"></q-img>
            </div>

            <!-- Rating -->
            <div class="text-center q-my-lg">
              <p class="q-my-none font-normal">{{$t('share.on.social', {userCurrency: (this.userCurrency ? this.userCurrency.currencyCode : 'USD')})}}</p>
            </div>

            <div class="col-md-12 text-center">
              <q-btn class="q-mb-sm q-mt-md q-mx-md" no-caps size="md" round style="background: #4568b2;" @click="goTo('facebook-share')">
                  <q-icon name="fab fa-facebook-f" style="color: white; height: 45px; width: 45px;"/>
              </q-btn>
              <q-btn class="q-mb-sm q-mt-md q-mx-md" no-caps size="md" round style="background: #00aced;" @click="goTo('twitter')">
                  <q-icon name="fab fa-twitter" style="color: white; height: 45px; width: 45px;"/>
              </q-btn>
              <q-btn class="q-mb-sm q-mt-md q-mx-md" size="md" round style="background: #25D366;" @click="goTo('whatsapp')">
                  <q-icon name="fab fa-whatsapp" style="color: white; height: 45px; width: 45px;"/>
              </q-btn>
              <q-btn class="q-mb-sm q-mt-md q-mx-md" size="md" round style="background: grey;" @click="goTo('share')">
                <q-icon name="far fa-clone" style="color: white; height: 45px; width: 45px;"/>
              </q-btn>
            </div>

            <div class="col-md-12 text-center">
              <q-btn class="q-mb-sm q-mt-md q-mx-md primary text-primary" flat @click="closePopUp">
                I will do it later
              </q-btn>
            </div>

          </q-card-section>

          <q-card-section class="text-center q-pt-xl" v-else>
            <h6 class="q-my-none q-mb-md font-normal q-mt-md">{{$t('time.to.show.how.happy.pet.was')}}</h6>

            <!-- Image Container -->
            <!-- Grooming before and after -->
            <div v-if="responseInfo && parseInt(responseInfo.requestInfo.serviceId) === 19" class="row">
              <!-- Before -->
              <div style="height: 220px;max-height: 220px;position: relative;border-right: 1.5px solid white;" :class="{'highlight-red': showError && !imageInfo}" class="bg-grey-3 col-6" @click="onFileSelectionLeft">
                <q-img class="image-upload" style="height: 100%;" :src="imageInfoLeft.filePath" v-if="imageInfoLeft"></q-img>
                <p class="q-my-none text-grey-6" style="position: absolute;top: 42%;left: 0%;" v-else-if="!leftLoader" v-html="$t('upload.photo.before.grooming')"></p>
                <div ref="uploadImagesLoader" style="position: absolute;top: 42%;left: 42%;" v-else>
                    <q-spinner size="40px" color="primary"></q-spinner>
                </div>
              </div>
              <!-- After -->
              <div style="height: 220px;max-height: 220px;position: relative;border-left: 1.5px solid white;" :class="{'highlight-red': showError && !imageInfo}" class="bg-grey-3 col-6" @click="onFileSelectionRight">
                <q-img class="image-upload" style="height: 100%;" :src="imageInfoRight.filePath" v-if="imageInfoRight"></q-img>
                <p class="q-my-none text-grey-6" style="position: absolute;top: 42%;left: 0%;" v-else-if="!rightLoader" v-html="$t('upload.photo.after.grooming')"></p>
                <div ref="uploadImagesLoader" style="position: absolute;top: 42%;left: 42%;" v-else>
                    <q-spinner size="40px" color="primary"></q-spinner>
                </div>
              </div>
              <canvas style="display: none;" height="330" width="490" ref="canvas"></canvas>
              <input type="file" disable @change="displayImageLeft" accept=".jpg,.jpeg,.png" ref="selectedFileLeft" style="display: none;">
              <input type="file" disable @change="displayImageRight" accept=".jpg,.jpeg,.png" ref="selectedFileRight" style="display: none;">
            </div>
            <div v-else>
              <div style="height: 220px;;max-height: 220px;position: relative;" :class="{'highlight-red': showError && !imageInfo}" class="bg-grey-3" @click="onFileSelection">
                <q-img class="image-upload" style="height: 100%;max-height: 220px;" :src="imageInfo.filePath" v-if="imageInfo"></q-img>
                <p class="q-my-none text-grey-7" style="position: absolute;top: 45%;left: 26%;" v-else-if="!loader">{{$t('tap.here.uploaded.photo')}}</p>
                <div ref="uploadImagesLoader" style="position: absolute;top: 42%;left: 42%;" v-else>
                    <q-spinner size="40px" color="primary"></q-spinner>
                </div>
              </div>
              <input type="file" disable @change="imageUpload" accept=".jpg,.jpeg,.png" ref="selectedFile" style="display: none;">
            </div>

            <!-- Rating -->
            <div class="text-center">
              <q-rating class="q-pb-md q-pt-lg primary" color="yellow-star" v-model="userRating" :max="5" size="35px"/>
            </div>

            <q-input type="textarea" borderless v-model="userReview" :placeholder="$t('what.about.experience')" class="full-width input" rows="5" :class="{'highlight-red': showError && !userReview}"></q-input>

            <div v-if="parseInt(responseInfo.completionStatus) !== 1 && scanRequired" class="q-mt-md">
              <q-btn color="primary" :ripple="false" :loading="saveReviewLoading" :label="$t('button.submit.review')" :disabled="saveReviewLoading" class="margin-auto row q-ma-sm q-px-md text-capitalize" @click.native="submitReviewScanner"></q-btn>
              <q-btn flat color="primary" :ripple="false" :loading="saveReviewLoading" :label="$t('submit.review.manually')" :disabled="saveReviewLoading" class="margin-auto row q-ma-sm q-mt-md text-capitalize" @click.native="triggerReasonModal(true)"></q-btn>
            </div>
            <div v-else class="q-mt-md">
              <q-btn color="primary" :ripple="false" :loading="saveReviewLoading" :label="$t('button.submit.review')" :disabled="saveReviewLoading" class="margin-auto row q-ma-sm q-px-md text-capitalize" @click.native="submitReviewManual"></q-btn>
            </div>
          </q-card-section>

          <!-- Dialog QR Scanner -->
          <dialog-scanner :trigger="scannerModal" @input="markJobComplete" @on-qr-scanner="qrScannerTriggered" @on-close="triggerScannerModal"></dialog-scanner>

          <!-- Dialog Manual Mark Complete Reason -->
          <dialog-reasons :trigger="reasonModal" @on-submit="onSubmitReason" @on-close="triggerReasonModal"></dialog-reasons>

          <!-- Prompt Dialog -->
          <dialog-prompt :trigger="promptModal" :type="typeCode" :message="promptMessage" :okButtonLabel="okBtnLabel" :cancelButtonLabel="canceblBtnLabel" @on-ok="onPromptOk" @on-cancel="onPromptCancel" @on-close="triggerPromptDialog"></dialog-prompt>
        </q-card>
    </q-dialog>
</template>
<script>
import ImageTools from 'assets/ImageTools.js'
import countries from 'assets/countries'
import ImageUploadMixin from '../../mixins/imageUploadMixin.js'
import ImageCropMixin from '../../mixins/imageCropMixin.js'
import clipboard from '../../mixins/copyClipboardMixin.js'
export default {
  components: {
    'dialog-scanner': () => import('components/QRScanner/DialogScanner.vue'),
    'dialog-prompt': () => import('components/DialogPrompt.vue'),
    'dialog-reasons': () => import('components/MarkComplete/DialogReasons.vue')
  },
  mixins: [ImageUploadMixin, ImageCropMixin, clipboard],
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    responseInfo: {
      required: true
    },
    scanRequired: {
      default: false
    }
  },
  data () {
    return {
      modal: false,
      loader: false,
      leftLoader: false,
      rightLoader: false,
      userRating: 5,
      userReview: null,
      saveReviewLoading: false,
      imageInfo: null,
      showError: false,
      jobMarkedCompleted: false,
      userCurrency: null,
      shareLink: this.$t('referral.link', {'referralCode': this.$store.getters['user/getUserReferralCode']}),
      detail: this.$t('social.share.message'),
      imageInfoLeft: null,
      imageInfoRight: null,
      combinedImage: null,
      promptModal: false,
      promptMessage: '',
      okBtnLabel: this.$t('ok'),
      canceblBtnLabel: this.$t('close'),
      promptPersistant: false,
      typeCode: 0,
      scannerModal: false,
      visibility: true,
      reasonModal: false
    }
  },
  mounted () {
    // listen to ImageUploadMixin callback (image processing)
    this.$on('image-data', this.uploadImageData)
    this.$on('canvas-data', this.onCombinedImages)

    this.userCurrency = this.$_.findWhere(countries, {'id': this.responseInfo.offerCurrency})
    if (this.userCurrency === null) {
      this.userCurrency = this.$_.findWhere(countries, {'id': this.$store.getters['user/getUserPrefferedCurrency']})
    }
  },
  destroyed () {
    this.$off('image-data', this.uploadImageData)
    this.$off('canvas-data', this.onCombinedImages)
  },
  watch: {
    trigger (value) {
      this.modal = value
    }
  },
  methods: {
    triggerReasonModal (status) {
      this.reasonModal = status
    },
    triggerScannerModal (status) {
      this.scannerModal = status
    },
    qrScannerTriggered (status) {
      this.visibility = status
      this.$root.$emit('background-visibility', status)
    },
    dataURIToBlob (dataURI) {
      const splitDataURI = dataURI.split(',')
      const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
      const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

      const ia = new Uint8Array(byteString.length)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }

      return new Blob([ia], { type: mimeString })
    },
    onCombinedImages (canvasData) {
      console.log('combined image data')
      let vm = this
      let file = this.dataURIToBlob(canvasData)
      console.log('file', file)
      let formData = new FormData()
      formData.append('imagefile', file, 'image.jpg')
      console.log(formData)
      vm.$axios.post('imageupload', formData, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
        }
      }).then((response) => {
        let mediaInfo = {
          'contentType': 'image',
          'fileName': response.data.imageName,
          'filePath': response.data.imagePath
        }
        vm.combinedImage = mediaInfo

        // mark job complete
        if (parseInt(vm.responseInfo.completionStatus) !== 1) {
          vm.markJobComplete()
        } else {
          vm.submitReview()
        }
      }).catch(e => {
        console.error(e)
        vm.$q.notify(e.response.data.message)
      }).finally(_ => {
        vm.loader = false
        vm.saveReviewLoading = false
      })
    },
    onSuccessLeft (imageData) {
      this.leftLoader = true
      // resolve and get file
      window.resolveLocalFileSystemURL(imageData, (fileEntry) => {
        fileEntry.file((file) => {
          let vm = this
          ImageTools.resize(file, function (blob, acceptableSize) {
            if (acceptableSize === false) {
              this.$q.dialog({
                message: this.$t('only.jpeg.png'),
                type: 'negative',
                position: 'bottom'
              })
            } else {
              const reader = new FileReader()
              reader.onload = (e) => {
                let mediaInfo = {
                  'contentType': 'image',
                  'fileName': 'image-grooming-before.jpg',
                  'filePath': reader.result
                }
                vm.imageInfoLeft = mediaInfo
                vm.leftLoader = false
              }
              reader.onerror = () => {
                console.error(reader.error)
              }
              reader.readAsDataURL(blob)
            }
          })
        }, (error) => {
          console.error(error)
        })
      })
    },
    onSuccessRight (imageData) {
      this.rightLoader = true

      // resolve and get file
      window.resolveLocalFileSystemURL(imageData, (fileEntry) => {
        fileEntry.file((file) => {
          let vm = this
          ImageTools.resize(file, function (blob, acceptableSize) {
            if (acceptableSize === false) {
              this.$q.dialog({
                message: this.$t('only.jpeg.png'),
                type: 'negative',
                position: 'bottom'
              })
            } else {
              const reader = new FileReader()
              reader.onload = (e) => {
                let mediaInfo = {
                  'contentType': 'image',
                  'fileName': 'image-grooming-after.jpg',
                  'filePath': reader.result
                }
                vm.imageInfoRight = mediaInfo
                vm.rightLoader = false
              }
              reader.onerror = () => {
                console.error(reader.error)
              }
              reader.readAsDataURL(blob)
            }
          })
        }, (error) => {
          console.error(error)
        })
      })
    },
    onFileSelectionLeft () {
      // open android image gallery
      if (this.$q.platform.is.cordova) {
        let imageQuality = 80
        if (this.mediaSource === 1) {
          imageQuality = 70
        }

        navigator.camera.getPicture(this.onSuccessLeft, (message) => {
          if (message !== 'No Image Selected') {
            this.$q.notify({
              message: message,
              position: 'top',
              type: 'negative',
              timeout: 1000
            })
          }
        }, {
          quality: imageQuality,
          destinationType: navigator.camera.DestinationType.FILE_URI,
          sourceType: this.mediaSource,
          encodingType: navigator.camera.EncodingType.JPEG,
          mediaType: navigator.camera.MediaType.PICTURE,
          correctOrientation: true
        })
        return
      }

      this.$refs['selectedFileLeft'].click()

      if (this.$q.platform.is.cordova) {
        this.$refs['selectedFileLeft'].click()
      }
    },
    displayImageLeft (e) {
      if (!e.target.files[0]) {
        this.$q.notify({
          message: this.$t('no.images.selected'),
          position: 'top'
        })
        return
      }

      this.loader = true
      let image = e.target.files[0]
      if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
        let sorry = this.$t('sorry')
        let message = this.$t('only.jpeg.png')
        this.$q.dialog({
          title: sorry,
          message: message
        })
        return
      }
      this.showError = false
      let vm = this
      ImageTools.resize(image, function (blob, didItResize) {
        let blobImage = new File([blob], image.name)
        let mediaInfo = {
          'contentType': 'image',
          'fileName': blobImage.name,
          'filePath': URL.createObjectURL(blobImage)
        }
        vm.imageInfoLeft = mediaInfo
        vm.loader = false
      })
    },
    onFileSelectionRight () {
      // open android image gallery
      if (this.$q.platform.is.cordova) {
        let imageQuality = 80
        if (this.mediaSource === 1) {
          imageQuality = 70
        }

        navigator.camera.getPicture(this.onSuccessRight, (message) => {
          if (message !== 'No Image Selected') {
            this.$q.notify({
              message: message,
              position: 'top',
              type: 'negative',
              timeout: 1000
            })
          }
        }, {
          quality: imageQuality,
          destinationType: navigator.camera.DestinationType.FILE_URI,
          sourceType: this.mediaSource,
          encodingType: navigator.camera.EncodingType.JPEG,
          mediaType: navigator.camera.MediaType.PICTURE,
          correctOrientation: true
        })
        return
      }

      this.$refs['selectedFileRight'].click()

      if (this.$q.platform.is.cordova) {
        this.$refs['selectedFileRight'].click()
      }
    },
    displayImageRight (e) {
      if (!e.target.files[0]) {
        this.$q.notify({
          message: this.$t('no.images.selected'),
          position: 'top'
        })
        return
      }

      this.loader = true
      let image = e.target.files[0]
      if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
        let sorry = this.$t('sorry')
        let message = this.$t('only.jpeg.png')
        this.$q.dialog({
          title: sorry,
          message: message
        })
        return
      }
      this.showError = false
      let vm = this
      ImageTools.resize(image, function (blob, didItResize) {
        let blobImage = new File([blob], image.name)
        let mediaInfo = {
          'contentType': 'image',
          'fileName': blobImage.name,
          'filePath': URL.createObjectURL(blobImage)
        }
        vm.imageInfoRight = mediaInfo
        vm.loader = false
      })
    },
    goTo (type) {
      switch (type) {
        case 'facebook-share':
          if (this.$q.platform.is.cordova) {
            window.facebookConnectPlugin.showDialog({
              method: 'share',
              href: this.shareLink,
              caption: this.detail ? this.detail : '',
              description: this.detail ? this.detail : '',
              hashtag: '#PetBacker'
            }, (response) => {
              console.log(response)
            }, (error) => {
              console.error(error)
            })
          } else {
            window.FB.ui({
              method: 'share',
              href: this.shareLink,
              quote: this.detail ? this.detail : '',
              hashtag: '#PetBacker'
            }, function (response) {})
          }
          this.onShared()
          break
        case 'whatsapp':
          this.openUrl(`https://wa.me/send?text=${this.detail ? encodeURIComponent(this.detail) : ''}${encodeURIComponent(` ${this.shareLink}`)}`)
          this.onShared()
          break
        case 'twitter':
          this.openUrl('http://twitter.com/share?url=' + encodeURIComponent(this.shareLink) + '&text=' + (this.detail ? encodeURIComponent(this.detail) : ''))
          this.onShared()
          break
        case 'share':
          if (navigator.share) {
            navigator.share({
              title: this.detail,
              text: this.detail,
              url: this.shareLink
            }).then(() => this.onShared()).catch((error) => {
              console.log('Error sharing', error)
            })
          } else {
            this.copy()
          }
          break
      }
    },
    onShared () {
      this.$emit('on-shared')
    },
    copy () {
      this.copiedSuccessText = this.$t('link.successfully.copied')
      this.onCopy(this.shareLink)
    },
    uploadImageData (imageBlobData) {
      let vm = this
      this.loader = true
      let formData = new FormData()
      formData.append('imagefile', imageBlobData.blob, 'image.jpg')
      vm.$axios.post('imageupload', formData)
        .then((response) => {
          let mediaInfo = {
            'contentType': 'image',
            'fileName': response.data.imageName,
            'filePath': response.data.imagePath
          }
          vm.imageInfo = mediaInfo
        }).catch(e => {
          console.error(e)
          vm.$q.notify(e.response.data.message)
        }).finally(_ => {
          vm.loader = false
        })
    },
    closePopUp () {
      this.modal = false
      this.saveReviewLoading = false
      this.$emit('on-close', false)
    },
    imageUpload (e) {
      if (!e.target.files[0]) {
        this.$q.notify({
          message: this.$t('no.images.selected'),
          position: 'top'
        })
        return
      }

      this.loader = true
      let image = e.target.files[0]
      if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
        let sorry = this.$t('sorry')
        let message = this.$t('only.jpeg.png')
        this.$q.dialog({
          title: sorry,
          message: message
        })
        return
      }
      this.showError = false
      let vm = this
      ImageTools.resize(image, function (blob, didItResize) {
        let formData = new FormData()
        formData.append('imagefile', blob, 'image.jpg')
        vm.$axios.post('imageupload', formData)
          .then((response) => {
            let mediaInfo = {
              'contentType': 'image',
              'fileName': response.data.imageName,
              'filePath': response.data.imagePath
            }
            vm.imageInfo = mediaInfo
          }).catch(e => {
            console.error(e)
            vm.$q.notify(e.response.data.message)
          }).finally(_ => {
            vm.loader = false
          })
      })
    },
    onPromptOk (type) {
      // prompt from scanning QR
      if (type === -1) {
        this.triggerScannerModal(true)
      }
    },
    onPromptCancel (type) {
      // prompt from scanning QR
      if (type === -1) {
        //  this.markJobComplete()
      }
    },
    markJobComplete (ownerUuid = null, manualMarkCompleteReason = '') {
      // check if owner uuid exist
      if (ownerUuid) {
        // check for invalid owner uuid
        if (this.responseInfo.requestInfo.requestorInfo.id !== ownerUuid) {
          this.triggerPromptDialog(true, this.$t('invalid.owner.qr.code'), this.$t('scan.again'), this.$t('submit.review.manually'), -1, true)
          return
        }

        // check whether to continue with this mark job complete or submit review only
        if (parseInt(this.responseInfo.completionStatus) === 1) {
          this.submitReview()
          return
        }
      }

      let payload = {
        'taskInfo': {
          'applicantRating': this.userRating,
          'applicantReview': this.userReview,
          'applicantReviewImage': this.imageInfo ? this.imageInfo.filePath : this.combinedImage.filePath,
          'coordinates': {
            'lattitude': this.$store.getters['user/getUserLatitude'] || this.$store.getters['geolocation/geopluginLatitude'],
            'longitude': this.$store.getters['user/getUserLongitude'] || this.$store.getters['geolocation/geopluginLongitude']
          },
          'applicantReason': manualMarkCompleteReason
        }
      }

      this.saveReviewLoading = true
      this.$axios.post(`users/${this.$store.state.user.uuid}/tasks/${this.responseInfo.id}/markcomplete`, payload, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.jobMarkedCompleted = true
        this.$q.notify({
          message: this.$t('review.sent'),
          type: 'positive',
          position: 'top'
        })

        if (this.userRating === 5) {
          setTimeout(() => {
            this.triggerInAppReview()
          }, 0)
        } else if (this.userRating === 4) {
          if (!this.$q.cookies.get('facebookReviewed')) {
            if (confirm(this.$t('enjoyed.experience'))) {
              this.$q.cookies.set('facebookReviewed', true, {'expires': 20})
              this.openUrl('https://www.facebook.com/petsbacker')
            }
          }
        }
      }).catch(e => {
        console.error(e)
        if (e.response && e.response.data) {
          this.$q.notify({
            message: e.response.data.message,
            position: 'bottom',
            type: 'negative'
          })
        } else {
          this.$q.notify({
            message: this.$t('failed.send.review'),
            position: 'bottom',
            type: 'negative'
          })
        }
      }).finally(_ => {
        this.saveReviewLoading = false
        this.$emit('on-mark-complete')
      })
    },
    triggerPromptDialog (status, message = '', okLabel = null, cancelLabel = null, typeCode = 0, persistent = false) {
      this.promptMessage = message
      this.okBtnLabel = okLabel
      this.canceblBtnLabel = cancelLabel
      this.promptPersistant = persistent
      this.typeCode = typeCode
      this.promptModal = status
    },
    submitReviewScanner () {
      this.showError = false
      if ((!this.imageInfo && parseInt(this.responseInfo.requestInfo.serviceId) !== 19) || (parseInt(this.responseInfo.requestInfo.serviceId) === 19 && (!this.imageInfoLeft || !this.imageInfoRight))) {
        this.showError = true
        this.saveReviewLoading = false
        this.triggerPromptDialog(true, this.$t('please.upload.photo.job.complete'), this.$t('ok'))
        return
      }
      if (!this.userReview || this.userReview === '') {
        this.showError = true
        this.saveReviewLoading = false
        this.triggerPromptDialog(true, this.$t('please.write.about'), this.$t('ok'))
        return
      }

      // trigger scanner dialog
      this.triggerPromptDialog(true, this.$t('please.scan.owners.qr.code'), this.$t('proceed.with.scanning'), this.$t('chat.later'), -1, true)
    },
    onSubmitReason () {
      this.submitReviewManual(this.reasonModal)
    },
    submitReviewManual (manualMarkReason = null) {
      this.saveReviewLoading = true
      this.showError = false
      if (!this.userReview || this.userReview === '' || (!this.imageInfo && parseInt(this.responseInfo.requestInfo.serviceId) !== 19) || (parseInt(this.responseInfo.requestInfo.serviceId) === 19 && (!this.imageInfoLeft || !this.imageInfoRight))) {
        this.showError = true
        this.saveReviewLoading = false
        this.triggerPromptDialog(true, this.$t('please.upload.photo.job.complete'), this.$t('ok'))
        return
      }

      if (!this.userReview || this.userReview === '') {
        this.showError = true
        this.saveReviewLoading = false
        this.triggerPromptDialog(true, this.$t('please.write.about'), this.$t('ok'))
        return
      }

      if (parseInt(this.responseInfo.requestInfo.serviceId) === 19) {
        this.processImages(this.imageInfoLeft.filePath, this.imageInfoRight.filePath)
        return
      }

      // mark job complete
      if (parseInt(this.responseInfo.completionStatus) !== 1) {
        this.markJobComplete(null, manualMarkReason)
      } else {
        this.submitReview()
      }
    },
    submitReview () {
      this.saveReviewLoading = true
      let info = JSON.stringify({
        'taskInfo': {
          'applicantRating': this.userRating,
          'applicantReview': this.userReview,
          'applicantReviewImage': this.imageInfo ? this.imageInfo.filePath : this.combinedImage.filePath
        }
      })

      this.$axios.put(`users/${this.$store.state.user.uuid}/tasks/${this.responseInfo.id}`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.jobMarkedCompleted = true
        this.$q.notify({
          message: this.$t('review.sent'),
          type: 'positive',
          position: 'top'
        })

        if (this.userRating === 5) {
          setTimeout(() => {
            this.triggerInAppReview()
          }, 0)
        } else if (this.userRating === 4) {
          if (!this.$q.cookies.get('facebookReviewed')) {
            if (confirm('Enjoy your experiece? Review us on our Facebook page!')) {
              this.$q.cookies.set('facebookReviewed', true, {'expires': 20})
              this.openUrl('https://www.facebook.com/petsbacker')
            }
          }
        }
      }).catch(e => {
        console.error(e)
        let errorMessage = this.$t('failed.send.review')
        if (e.reaponse.data && e.response.data.message) {
          errorMessage = e.response.data.message
        }
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      }).finally(_ => {
        this.saveReviewLoading = false
        this.$emit('on-mark-complete')
      })
    }
  }
}
</script>
<style lang="stylus">
.highlight-red
  border: solid 2px red;
</style>
