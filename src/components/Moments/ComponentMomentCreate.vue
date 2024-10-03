<template>
  <q-card class="justify-center" >
    <q-toolbar :class="this.$q.platform.is.mobile ? 'fixed-top bg-white' : 'bg-white modal-header-desktop responsive'" style="z-index: 10;border-bottom: solid 1px lightgrey;">
          <q-btn flat round dense icon="chevron_left" style="font-size: 1.3em;" @click="confirmationClose"/>
          <q-toolbar-title class="text-header font-title q-pl-none">
            <h6 class="q-my-none font-normal" style="margin-left: 3%;">{{$t('new.moment')}}</h6>
          </q-toolbar-title>
         <!--   Post button removed on top right -->
         <!--  <q-btn :loading="postLoader" flat dense class="text-primary" @click="onPost">{{$t('post')}}</q-btn> -->
      </q-toolbar>

      <q-card-section avatar class="text-center q-mt-xl">
          <!-- <q-avatar style="height: 65px;width: 65px;" class="row margin-auto">
            <img :src="this.$store.getters['user/getUserAvatarImage']"  class="image-upload"/>
          </q-avatar> -->

      </q-card-section>
      <div style="height: 62%; overflow:auto;">
      <!-- Moment Summary -->
      <q-card-section class="q-field--auto-height">
  <q-input type="textarea" rows="2" autogrow required v-model="momentSummary" :placeholder="$t('moment.what.on.your.mind')" class="input q-input--textarea q-input--dense q-input--auto-height" borderless @keyup.enter="$refs.inputSummary.focus()" />
</q-card-section>

      <!-- Post Content -->

      <q-card-section class="row  q-pa-none" >
        <q-card v-for="(image, index) in imageData" :key="index" class="col-xs-3 q-ma-sm" style="width: 100px; height: 100px;">
          <div v-if=" image.data.includes('video/mp4')|| image.data.includes('video/quicktime')" style="position: relative;height: 100px;max-height: 100px;">
            <video
              preload="auto"
              style="width: 100%;height: 100%;object-fit: cover;"
              poster="statics/images/Video.png"
              playsinline
              @error="onVideoError"
              :src="image.data"
            >
            </video>
            <div style="position: absolute; top: 0; left: 0; z-index: 1;">
            <q-icon name="fas fa-times-circle" color="red" size="23px" class="q-pa-xs" @click="removeImageFromList(index)"></q-icon>
           </div>
            <ComponentPreLoader style="position: absolute;top: 0px;left: 25%" v-if="videoLoader"></ComponentPreLoader>
          </div>
          <q-img v-else :src="image.data" class="responsive image-upload" style="height: 100%;width: 100%;">
            <q-icon name="fas fa-times-circle" color="red" size="23px" class="q-pa-xs" @click="removeImageFromList(index)"></q-icon>
          </q-img>
        </q-card>
        <q-btn icon="fas fa-plus" outline style="width: 100px; height: 100px; color:#ddd;" class="col-xs-3 q-ma-sm" :loading="pictureUploading" @click.stop="openModal()" />
        <input type="file" disable @change="onFileChange" accept=".jpg,.jpeg,.png" ref="selectedFile" style="display: none;">
      </q-card-section>
<br><br>
      </div>

      <!-- Tags Section -->
      <q-card-section  class=" q-mb-xl q-pb-lg ">
         <!--  <p @click="triggerTagsModal(true, 'tag-owners')" v-if="showTagOwnerSelection" class="font-normal q-my-none q-py-sm text-primary text-weight-bold" style="border-top: 1px solid lightgrey;border-bottom: 1px solid lightgrey;">{{tagOwnersLabel}}</p> -->
         <div @click="triggerTagsModal(true, 'tag-pets')" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
  <p class="font-normal q-my-none text-weight-bold" style=" white-space: nowrap;">{{$t('tag.pets')}}</p>
  <p class="text-right">{{ tagPetsLabel }} <q-icon name="keyboard_arrow_right"/></p>
</div>

<div @click="  triggerPrivacyModal()" style="display: flex; justify-content: space-between;">
    <p class="font-normal q-my-none text-weight-bold" >{{$t('visible.to')}}</p>
    <p class="text-right">{{ $t(this.privacyLevel) }} <q-icon name="keyboard_arrow_right"/></p>
  </div>
  <div style="display: flex; align-items: center;">
  <img src="statics/images/moment/logo.info.png" height="10%" width="10%" style="padding-bottom: 15px; margin-right: 10px;">
  <p>{{ $t('max.video') }}</p>
</div>

        </q-card-section>

        <!-- Moment Privacy Dialog -->
      <dialog-privacy  @close-modal="privacyModal = false" :privacyModal="privacyModal" :trigger="privacyModal"  ref="privacy-tags"  @on-close="privacyModal" @update:privacyLevel="onPrivacyLevelUpdate" > </dialog-privacy>

      <!-- Moment Tags Dialog -->
      <dialog-moment-tags ref="moment-tags" :trigger="tagsModal" :type="tagsType" @on-select="onTagged" @on-close="triggerTagsModal"></dialog-moment-tags>

      <!-- Prompt Dialog -->
      <dialog-prompt :trigger="promptModal" :message="promptMessage" @on-close="triggerPromptDialog"></dialog-prompt>

      <!-- Success Dialog -->
      <dialog-success  :successModal="successModal" :trigger="successModal" >  </dialog-success>

        <!-- Image Selection Option -->
     <dialog-image-source v-model="showModal" @option-selected="handleOptionSelected" @close-dialog="handleCloseDialog" ></dialog-image-source>

      <div class="fixed-bottom bg-primary" v-if="$q.platform.is.mobile" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" @click="onPost">
          <div class="q-pa-md">
            <div class="text-white q-pb-sm text-center cursor-pointer font-header-title">
              <span v-if="!postLoader">{{$t('post.moment')}}</span>
              <span v-else><q-spinner size="1.5em"></q-spinner></span>
            </div>
          </div>
      </div>
  </q-card>
</template>
<script>
import ImageUploadMixin from '../../mixins/imageUploadMixin.js'
// import ImageTools from 'assets/ImageTools.js'
export default {
  mixins: [ImageUploadMixin],
  components: {
    'dialog-moment-tags': () => import('components/Moments/ComponentMomentTags.vue'),
    'dialog-prompt': () => import('components/DialogPrompt.vue'),
    'dialog-privacy': () => import('components/Moments/ComponentPrivacylevel.vue'),
    'dialog-success': () => import('components/Moments/ComponentSuccessfulPost.vue'),
    'dialog-image-source': () => import('components/ImageUpload/DialogPhotoSource.vue')
  },
  props: {
    momentInfo: {
      type: Object,
      default: null,
      require: false
    }
  },

  data () {
    return {
      tagOwnersLabel: this.$t('tag.owners'),
      tagPetsLabel: this.$t('tag.pets'),
      tagJobLabel: this.$t('tag.jobs'),
      tagSelection: 0,
      tagType: 1,
      media: [],
      imageData: [],
      privacyLevel: 'moments.filters.public',
      momentSummary: null,
      index: null,
      saved: false,
      postLoader: false,
      pictureUploading: false,
      tagsModal: false,
      tagsType: 'tag-owners',
      showTagOwnerSelection: true,
      showTagPetsSelection: true,
      showTagJobSelection: true,
      promptModal: false,
      promptMessage: this.$t('please.filled.up.everything.before.posting'),
      videoLoader: false,
      videoPlaying: false,
      privacyModal: false,
      successModal: false,
      posttype: null,
      shareurl: null,
      imagesource: null,
      showModal: false
    }
  },
  watch: {
    momentInfo (value) {
      if (value) {
        this.momentSummary = value.summary
        this.privacyLevel = value.privacy
        this.index = value.index
      }
    },
    // Watching For the Status of Modals to add back listeners
    privacyModal: function (newVal, oldVal) {
      if (!newVal && !this.tagsModal) {
        console.log('Adding event listener')
        document.addEventListener('backbutton', this.confirmationClose)
      } else {
        console.log('Removing event listener')
        document.removeEventListener('backbutton', this.confirmationClose)
      }
      console.log('privacyModal:', newVal, oldVal, 'tagsModal:', this.tagsModal)
    },
    tagsModal: function (newVal, oldVal) {
      if (!newVal && !this.privacyModal) {
        console.log('Adding event listener')
        document.addEventListener('backbutton', this.confirmationClose)
      } else {
        console.log('Removing event listener')
        document.removeEventListener('backbutton', this.confirmationClose)
      }
      console.log('tagsModal:', newVal, oldVal, 'privacyModal:', this.privacyModal)
    }

  },
  mounted () {
    if (this.momentInfo) {
      this.momentSummary = this.momentInfo.summary
      this.privacyLevel = this.momentInfo.privacy
      this.index = this.momentInfo.index
    }
    document.addEventListener('backbutton', this.confirmationClose)
    document.addEventListener('deviceready', onDeviceReady, false)

    function onDeviceReady () {
      if (window.VideoEditor && typeof window.VideoEditor.transcodeVideo === 'function') {
        console.log('VideoEditor is ready to use.')
        //  Device ready for filepath
        document.addEventListener('deviceready', () => {
          console.log('deviceready')
          if (window.FilePath) {
            console.log('window.FilePath is available')
          } else {
            console.log('window.FilePath is not available')
          }
        })

        // Check if OutputFileType is defined
        if (window.VideoEditor.outputFileType) {
        // Use the VideoEditor object and call its transcodeVideo method here
        // ...
        } else {
          console.warn('OutputFileType is not available.')
        }
      } else {
        console.warn('VideoEditor is not available or transcodeVideo method is not supported.')
      }
    }

    // listen to ImageUploadMixin callback (image processing)
    this.$on('image-data', this.onSelectFileAndroid)
  },
  beforeDestroy () {
    this.$off('image-data', this.onSelectFileAndroid)
    document.removeEventListener('backbutton', this.confirmationClose)
  },
  methods: {
    openModal () {
      this.showModal = true
    },
    handleCloseDialog () {
      console.log('Dialog closed.')
      this.showModal = false
      // Perform any necessary actions when the dialog is closed.
      // For example, reset any data or perform additional logic.
    },
    handleOptionSelected (selectedOption) {
      console.log('Selected Option:', selectedOption)
      this.imagesource = selectedOption // Save the selected option in the data property
      console.log('check the image source', this.imagesource)
      this.onFileSelection(this.imagesource)
      this.showModal = false // Close the modal if needed
    },
    handleBackButtonListener: function (privacyModal, tagsModal, status) {
      if (!privacyModal && !tagsModal && status) {
        console.log('Adding event listener')
        document.addEventListener('backbutton', this.confirmationClose)
      } else {
        console.log('Removing event listener')
        document.removeEventListener('backbutton', this.confirmationClose)
      }
    },
    onPrivacyLevelUpdate (value) {
      this.privacyLevel = value
    },
    onLoadStart () {
      this.videoLoader = true
    },
    onLoadedData (event) {
      this.videoLoader = false
      this.videoPlaying = true
      if (event.target.error) {
        console.error('thats the error', event.target.error.message)
      } else {
        console.log('loadeddata event triggered')
      }
    },
    // eslint-disable-next-line handle-callback-err
    onVideoError (event) {
      if (!event || !event.target) {
        console.error('No event or target found in onVideoError')
        return
      }
      console.error(event.target.error)
      console.log(event.target.src)
    },
    triggerPromptDialog (status, message) {
      if (message) {
        this.promptMessage = message
      }
      this.promptModal = status
    },
    onTagged (tagInfo) {
      if (tagInfo.selection.length === 0) {
        this.showTagOwnerSelection = true
        this.showTagPetsSelection = true
        this.showTagJobSelection = true

        this.tagOwnersLabel = this.$t('tag.owners')
        this.tagPetsLabel = this.$t('tag.pets')
        this.tagJobLabel = this.$t('tag.jobs')
        return
      }

      switch (tagInfo.type) {
        case 'tag-owners':
          this.tagType = 1
          this.tagOwnersLabel = this.$t('tag.owners.name', {backersName: tagInfo.display})
          this.showTagPetsSelection = false
          this.showTagJobSelection = false
          break
        case 'tag-pets':
          this.tagType = 2
          this.tagPetsLabel = this.$t('tag.pets.name', {petNames: tagInfo.display})
          this.showTagOwnerSelection = false
          this.showTagJobSelection = false
          break
        case 'tag-job':
          this.tagType = 5
          this.tagJobLabel = this.$t('tag.job.ref', {jobRef: tagInfo.display})
          this.showTagOwnerSelection = false
          this.showTagPetsSelection = false
          break
      }

      this.tagSelection = tagInfo.selection
    },
    triggerTagsModal (status, type) {
      if (type) {
        if (this.tagsType !== type) {
          this.$refs['moment-tags'].clearCache()
        }
        this.tagsType = type
      }
      this.tagsModal = status
    },
    triggerPrivacyModal () {
      this.privacyModal = !this.privacyModal
    },
    triggerSuccessModal () {
      this.successModal = true
    },
    onPost () {
      this.postLoader = true
      if (this.media.length === 0 || this.momentSummary == null) {
        setTimeout(() => {
          this.postLoader = false
        }, 800)
        this.triggerPromptDialog(true, this.$t('please.filled.up.everything.before.posting'))
        return
      }
      // need to await for image upload before post moment
      this.uploadImageData(this.media).then((mediaArray) => {
        this.postMoment(mediaArray)
      })
    },
    onFileChange () {
      const input = this.$refs.file
      const files = input.files
      for (let index = 0; index < files.length; index++) {
        const image = files[index]
        this.media.push(image)
      }
      this.makeImageData()
    },
    onImageSelection () {
      if (this.$q.platform.is.cordova) {
        this.mediaType = navigator.camera.MediaType.ALLMEDIA
        this.onFileSelection()
      } else {
        this.$refs['file'].click()

        if (this.$q.platform.is.cordova) {
          this.$refs['file'].click()
        }
      }
    },
    makeImageData () {
      this.imageData = []
      for (let index = 0; index < this.media.length; index++) {
        const media = this.media[index]

        if (media.blob.type.includes('video') > -1) {
          const reader = new FileReader()
          reader.onload = e => {
            this.imageData.push({data: reader.result, type: media.type, thumbnail: media.thumbnail})
          }

          reader.onerror = (e) => {
            console.error(reader.error)
          }

          reader.readAsDataURL(media.blob)
        } else {
          this.imageData.push({data: media.url, type: media.blob.type})
        }
      }
    },
    removeImageFromList (index) {
      delete this.media.splice(index, 1)
      this.media = this.media
      this.makeImageData()
    },
    onSelectFileAndroid (imageBlobData) {
      this.media.push(imageBlobData)
      this.makeImageData()
    },
    postMoment (momentImages) {
      this.postLoader = true

      let accessLevel = 0
      switch (this.privacyLevel) {
        case 'moments.filters.public': accessLevel = 0; break
        case 'friends.only': accessLevel = 1; break
        case 'only.me': accessLevel = 2; break
      }

      let moment = {
        'moment': {
          'access_level': accessLevel,
          'angry_count': 0,
          'comment_count': 0,
          'content_type': this.tagType,
          'detail': this.momentSummary || '',
          'is_archived': 0,
          'is_published': 0,
          'item_href': this.tagSelection,
          'laugh_count': 0,
          'liked': 0,
          'love_count': 0,
          'sad_count': 0,
          'shock_count': 0,
          'thumbs_up_count': 0,
          'title': this.momentSummary || '',
          'subtitle': this.momentSummary,
          'description': this.momentSummary
        },
        'media': momentImages
      }

      this.$axios.post('moments', JSON.stringify(moment), {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
      // if (this.storyInfo && this.$q.localStorage.has('storyDrafts')) {
      //   let draftFolder = this.$q.localStorage.getItem('storyDrafts').items
      //   draftFolder = draftFolder.splice(0, this.index - 1)
      //   this.$q.localStorage.set('storyDrafts', {items: draftFolder})
      // }

        this.$emit('on-post', response.data.moment)
        this.$emit('share', response.data.moment)
        console.log('from server', response.data.moment.description)
        console.log(response.data.moment)
        setTimeout(() => {
        /*   this.$q.notify({message: 'Job Updated Successfully!', type: 'positive', position: 'top'}) */
          this.$emit('on-close', false)
          this.posttype = false
          this.$emit('posted', this.posttype) // false is for new moment
        }, 600)
      }).catch(e => {
        console.error(e)
        if (e.response && e.response.data) {
          this.triggerPromptDialog(true, e.response.data.message)
        }
      }).finally(_ => {
        this.postLoader = false
      /*  this.successModal = true */
      })
    },
    readVideoFile () {
      let fileURL = 'file:///storage/emulated/0/DCIM/Camera/VID_20230118_212628.mp4'

      window.resolveLocalFileSystemURL(fileURL, function (fileEntry) {
        fileEntry.file(function (file) {
          var reader = new FileReader()
          reader.onloadend = function () {
            var blob = new Blob([new Uint8Array(this.result)], { type: 'video/mp4' })
            console.log(blob)
          }
          reader.readAsArrayBuffer(file)
        }, function (error) {
          console.log(error)
        })
      }, function (error) {
        console.log(error)
      })
    },
    confirmationClose () {
    // TODO: Save moments into drafts
    // if (this.media.length > 0 || this.momentSummary !== null) {
    //   if (this.index !== null && this.index > -1) {
    //     this.saveToDraft()
    //   } else {
    //     let confirmationTitle = this.$t('confirmation')
    //     let confirmationMessage = 'Any changes made to story will be loss if not saved, do you want to continue?'
    //     this.$q.dialog({
    //       title: confirmationTitle,
    //       message: confirmationMessage,
    //       ok: 'Saved To Draft',
    //       cancel: 'Contiue without saving'
    //     }).onOk(() => {
    //       this.saveToDraft()
    //     }).onCancel(() => {
    //       this.$emit('on-close', false)
    //     })
    //   }
    // } else {
    //   this.$emit('on-close', false)
    // }
      this.$emit('on-close', false)
    },
    enterClicked (e) {
      if (e.keyCode === 13) {
        this.$refs.editor.runCmd('insertHTML', '<br/>')
      }
    },
    saveToDraft () {
      let draftFolder = null
      if (this.$q.localStorage.has('storyDrafts')) {
        draftFolder = this.$q.localStorage.getItem('storyDrafts')
      }

      // local storage story struct (draft)
      let story = {
        media: this.media,
        summary: this.storySummary,
        content: this.storyContent,
        privacy: this.privacyLevel,
        type: 1
      }

      // save to local storage
      if (draftFolder === null) {
      // first draft saved
        story.index = 0

        draftFolder = []
        draftFolder.push(story)
        draftFolder = {items: draftFolder}
      } else if (this.index === null) {
      // new draft saved
        story.index = draftFolder.items.length
        draftFolder.items.push(story)
      } else {
      // override existing draft
        draftFolder.items[this.index] = story
      }

      this.$q.localStorage.set('storyDrafts', draftFolder)
      this.$emit('on-close', false)
    },
    uploadImageData (images) {
      return new Promise(async (resolve) => {
        let imagesArr = []
        let promises = []

        // upload all images one by one
        for (let image of images) {
          if (['image/jpeg', 'image/jpg', 'image/png', 'video/quicktime', 'video/mp4'].indexOf(image.blob.type) === -1) {
            let sorry = this.$t('sorry')
            let message = this.$t('only.jpeg.png')
            this.$q.dialog({
              title: sorry,
              message: message
            })
            this.postLoader = false
            return
          }

          let formName = 'image.jpg'
          if (['video/quicktime', 'video/mp4'].indexOf(image.blob.type) > -1) {
            formName = 'video.mov'
          }

          // upload image
          let formData = new FormData()
          formData.append('imagefile', image.blob, formName)
          if (image.thumbnail !== undefined) {
            formData.append('thumbnail', image.thumbnail, formName)
          }

          console.log('uploaded thumnail blob', image.thumbnail)
          let apiCall = this.$axios.post('imageupload?type=moment', formData).then((response) => {
            let image = {
              'content_type': response.data.contentType || 'image',
              'media_name': response.data.imageName || response.data.videoName,
              'media_filename': response.data.imagePath || response.data.videoPath,
              'is_archived': '0',
              'thumbnail_filename': response.data.thumbnailPath
            }
            imagesArr.push(image)
            console.log('image uploaded')
          }).catch(e => {
            console.log(e)
          })
          promises.push(apiCall)
        }

        // wait for all image uploads to be resolved
        Promise.all(promises).then(() => {
          resolve(imagesArr)
        })
      })
    }
  }
}
</script>
<style lang="stylus">

</style>
