<template>
    <q-card class="justify-center" v-scroll="scrolled">
        <q-toolbar :class="this.$q.platform.is.mobile ? 'fixed-top bg-white' : 'bg-white modal-header-desktop responsive'" style="z-index: 10;border-bottom: solid 1px lightgrey;">
            <q-btn flat round dense icon="chevron_left" style="font-size: 1.3em;" @click="confirmationClose"/>
            <q-toolbar-title class="text-header font-title q-pl-none">
              <h6 class="q-my-none font-normal" style="margin-left: 6%;">{{$t('create.stories.title')}}</h6>
            </q-toolbar-title>
            <q-btn :loading="postLoader" flat dense class="text-primary" @click="postStory">{{$t('post')}}</q-btn>
        </q-toolbar>

        <q-card-section avatar class="text-center q-mt-xl">
            <q-avatar style="height: 65px;width: 65px;" class="row margin-auto">
              <img :src="this.$store.getters['user/getUserAvatarImage']"  class="image-upload"/>
            </q-avatar>

            <div class="row text-center">
              <q-btn-dropdown icon="fas fa-globe-americas" size="11px" :label="privacyLevel" class="margin-auto input text-grey text-capitalize q-mt-sm">
                  <q-list>
                      <q-item clickable v-close-popup @click="privacyLevel = 'Public'">
                          <q-item-section>
                              <q-item-label>{{$t('moments.filters.public')}}</q-item-label>
                          </q-item-section>
                      </q-item>

                      <q-item clickable v-close-popup @click="privacyLevel = 'Friends Only'">
                          <q-item-section>
                              <q-item-label>{{$t('friends.only')}}</q-item-label>
                          </q-item-section>
                      </q-item>

                      <q-item clickable v-close-popup @click="privacyLevel = 'Only Me'">
                          <q-item-section>
                              <q-item-label>{{$t('only.me')}}</q-item-label>
                          </q-item-section>
                      </q-item>
                  </q-list>
              </q-btn-dropdown>
            </div>
        </q-card-section>

        <!-- Cover Image -->
        <q-card-section class="q-pb-none q-pt-sm">
            <div class="upload-image-box input" style="padding: 0px;" @click="uploadCoverImage">
                <img v-if="coverImageUrl !== null" :src="coverImageUrl" class="cover-image"/>
                <div class="justified text-center" v-if="coverUploading" ref="preLoader" :style="{'min-height': this.$q.platform.is.desktop ? '520px' : ''}">
                    <q-spinner color="primary" size="3em" style="margin-top: 20%;"></q-spinner>
                </div>
                <p v-else-if="coverImageUrl === null" class="text-center" style="margin-top: 85px;font-size: 16px;" >{{$t('add.cover.image')}}</p>
            </div>
        </q-card-section>

        <q-card-section class="q-mx-sm q-pt-none">
          <!-- Post Title -->
          <q-input flat v-model="storyTitle" input-class="font-title q-pb-none" :placeholder="$t('blog.title')" borderless @keyup.enter="$refs.inputSummary.focus()"></q-input>

          <!-- Post Summary -->
          <q-input flat v-model="storySummary" input-class="text-grey-8 text-weight-light q-qt-none" dense placeholder="Subtitle" ref="inputSummary" borderless @keyup.enter="$refs.editor.focus()"></q-input>
        </q-card-section>

        <q-separator inset class="q-mx-lg"></q-separator>

        <!-- Post Content -->
        <q-card-section class="q-mx-none">
          <q-editor
              @input="saveLastSelectionInfo"
              v-model="storyContent"
              min-height="2000px"
              class="q-pb-xl q-mb-xl"
              flat
              ref="editor"
              :placeholder="$t('stories.content.here')"
              :toolbar="[]"
            />
          <!-- <q-input v-model="storyContent" ref="editor" type="textarea" class="q-pb-xl q-mb-xl" flat borderless autogrow placeholder="Your Blog Content Here ..."></q-input> -->
        </q-card-section>
        <input type="file" disable @change="onFileChange" accept=".jpg,.jpeg,.png" ref="selectedFile" style="display: none;">

        <!-- Tool Bar -->
        <div class="row fixed-bottom bg-grey-1 q-pt-xs q-pb-md q-px-xs z-fab">
          <q-btn :loading="pictureUploading" icon="insert_photo" flat color="grey-6" class="col" @click="uploadImage"></q-btn>
          <q-btn icon="link" flat color="grey-6" class="col" @click="triggerAddLinksModal(true)"></q-btn>
          <q-btn icon="vertical_distribute" flat color="grey-6" class="col" @click="triggerAddSectionsModal(true)"></q-btn>
          <!-- <q-btn icon="more_horiz" flat color="grey-6" class="col"></q-btn> -->
        </div>

        <dialog-add-links :trigger="modalAddLink" @on-close="triggerAddLinksModal" @on-save="onLinkAttached"></dialog-add-links>

        <dialog-add-sections :trigger="modalAddSection" @on-close="triggerAddSectionsModal" @on-save="onSectionAttached"></dialog-add-sections>
    </q-card>
</template>
<script>
import ImageUploadMixin from '../../mixins/imageUploadMixin.js'
import ImageTools from 'assets/ImageTools.js'
export default {
  mixins: [ImageUploadMixin],
  components: {
    'dialog-add-links': () => import('components/Moments/Stories/DialogAddLinks.vue'),
    'dialog-add-sections': () => import('components/Moments/Stories/DialogAddSections.vue')
  },
  props: {
    storyInfo: {
      type: Object,
      default: null,
      require: false
    }
  },
  data () {
    return {
      privacyLevel: 'Public',
      storyTitle: null,
      storySummary: null,
      storyContent: '',
      addCoverImage: false,
      coverImageUrl: null,
      coverImageName: null,
      coverUploading: false,
      imageLink: null,
      index: null,
      saved: false,
      postLoader: false,
      keyboardStatus: false,
      pictureUploading: false,
      modalAddLink: false,
      modalAddSection: false,
      currentSelection: null,
      previousScrollPosition: 0
    }
  },
  watch: {
    storyInfo (value) {
      if (value) {
        this.storyTitle = value.title
        this.storySummary = value.summary
        this.storyContent = value.content
        this.coverImageUrl = value.coverImage.url
        this.coverImageName = value.coverImage.name
        this.privacyLevel = value.privacy
        this.index = value.index
      }
    }
  },
  created () {
    window.Keyboard.automaticScrollToTopOnHiding = true
    window.Keyboard.shrinkView(true)
    window.Keyboard.hideFormAccessoryBar(true)

    document.addEventListener('focusin', this.focusIn)
    document.addEventListener('focusout', this.focusOut)
  },
  beforeDestroy () {
    window.Keyboard.shrinkView(false)
    window.Keyboard.hideFormAccessoryBar(false)
    document.removeEventListener('focusin', this.focusIn)
    document.removeEventListener('focusout', this.focusOut)
    this.$off('image-data')
  },
  mounted () {
    if (this.storyInfo) {
      this.storyTitle = this.storyInfo.title
      this.storySummary = this.storyInfo.summary
      this.storyContent = this.storyInfo.content
      this.coverImageUrl = this.storyInfo.coverImage.url
      this.coverImageName = this.storyInfo.coverImage.name
      this.privacyLevel = this.storyInfo.privacy
      this.index = this.storyInfo.index
    }

    // listen to ImageUploadMixin callback (image processing)
    this.$on('image-data', (data) => {
      this.uploadImageData(data.blob)
      this.pictureUploading = true
    })
  },
  methods: {
    saveLastSelectionInfo () {
      this.currentSelection = {
        'node': window.getSelection().baseNode.parentNode,
        'offset': window.getSelection().baseOffset
      }
    },
    triggerAddSectionsModal (status) {
      this.modalAddSection = status
    },
    triggerAddLinksModal (status) {
      this.modalAddLink = status
    },
    focusIn () {
      this.keyboardStatus = true
    },
    focusOut () {
      setTimeout(() => {
        this.keyboardStatus = false
      }, 350)
    },
    postStory () {
      this.postLoader = true
      if (this.storyTitle === null || this.storySummary === null || this.coverImageUrl === null || this.storyContent === '') {
        setTimeout(() => {
          this.postLoader = false
        }, 800)
        this.$q.notify({message: 'Please fill up everything before posting.'})
        return
      }

      let story = {
        'moment': {
          'access_level': this.privacyLevel,
          'angry_count': 0,
          'comment_count': 0,
          'content_type': 6,
          'detail': this.storySummary,
          'is_archived': 0,
          'is_published': 0,
          'item_href': 0,
          'laugh_count': 0,
          'liked': 0,
          'love_count': 0,
          'sad_count': 0,
          'shock_count': 0,
          'thumbs_up_count': 0,
          'title': this.storyTitle,
          'subtitle': this.storySummary,
          'description': escape(this.storyContent)
        },
        'media': [
          {
            'content_type': 'image',
            'is_archived': 0,
            'media_filename': this.coverImageName
          }
        ]
      }

      this.$axios.post('moments', story, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (this.storyInfo && this.$q.localStorage.has('storyDrafts')) {
          let draftFolder = this.$q.localStorage.getItem('storyDrafts').items
          draftFolder = draftFolder.splice(0, this.index - 1)
          this.$q.localStorage.set('storyDrafts', {items: draftFolder})
        }

        this.$emit('on-post', response.data.moment)
        setTimeout(() => {
          this.$q.notify({message: this.$t('stories.successfully.posted'), type: 'positive', positive: 'top'})
          this.$emit('on-close', false)
        }, 600)
      }).catch(e => {
        console.error(e)
      }).finally(_ => {
        this.postLoader = false
      })
    },
    confirmationClose () {
      if (this.storyTitle !== null || this.storySummary !== null || this.storyContent !== '' || this.coverImageUrl !== null) {
        if (this.index !== null && this.index > -1) {
          this.saveToDraft()
        } else {
          let confirmationTitle = this.$t('confirmation')
          let confirmationMessage = this.$t('exit.stories.without.saving.prompt')
          this.$q.dialog({
            title: confirmationTitle,
            message: confirmationMessage,
            ok: this.$t('saved.to.draft'),
            cancel: this.$t('continue.without.saving')
          }).onOk(() => {
            this.saveToDraft()
          }).onCancel(() => {
            this.$emit('on-close', false)
          })
        }
      } else {
        this.$emit('on-close', false)
      }
    },
    saveToDraft () {
      let draftFolder = null
      if (this.$q.localStorage.has('storyDrafts')) {
        draftFolder = this.$q.localStorage.getItem('storyDrafts')
      }

      // local storage story struct (draft)
      let story = {
        coverImage: {
          url: this.coverImageUrl,
          name: this.coverImageName
        },
        title: this.storyTitle,
        summary: this.storySummary,
        content: this.storyContent,
        privacy: this.privacyLevel,
        type: 6
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
    uploadImage () {
      this.onFileSelection()
    },
    uploadCoverImage () {
      this.onFileSelection()
      this.addCoverImage = true
    },
    setCaretToEnd () {
      let el = this.$refs.editor.$refs.content
      let range = document.createRange()
      let sel = window.getSelection()

      range.setStart(el.childNodes[el.childNodes.length - 1], el.childNodes[el.childNodes.length - 1].length)
      range.collapse(true)

      sel.removeAllRanges()
      sel.addRange(range)
    },
    onLinkAttached (href, name) {
      // check for https
      if (href.indexOf('https://') === -1 && href.indexOf('http://') === -1) {
        href = 'https://' + href
      }

      // create link component
      let link = document.createElement('a')
      link.href = href
      link.appendChild(document.createTextNode(name))

      // check to append or replace
      if (this.currentSelection) {
        this.currentSelection.node.appendChild(link)
      } else {
        this.$refs.editor.$refs.content.appendChild(link)
        this.setCaretToEnd()
      }
    },
    onSectionAttached (iconName, sectionName) {
      console.log(iconName, sectionName)
      let icon = document.createElement('span')
      icon.className = iconName
      icon.style.color = 'lightgrey'
      icon.style.fontSize = '18px'
      icon.style.padding = '5px'

      let section = document.createElement('p')
      section.appendChild(icon)
      section.appendChild(document.createTextNode(sectionName))
      section.style.textAlign = 'center'
      section.style.fontSize = '18px'
      section.style.color = 'lightgrey'

      if (this.currentSelection) {
        this.currentSelection.node.appendChild(document.createElement('br'))
        this.currentSelection.node.appendChild(section)
        this.currentSelection.node.appendChild(document.createElement('br'))
        this.currentSelection.node.appendChild(document.createElement('br'))
      } else {
        this.$refs.editor.$refs.content.appendChild(document.createElement('br'))
        this.$refs.editor.$refs.content.appendChild(section)
        this.$refs.editor.$refs.content.appendChild(document.createElement('br'))
        this.$refs.editor.$refs.content.appendChild(document.createElement('br'))
      }
      this.setCaretToEnd()
    },
    scrolled (position) {
      console.log(position)
      if (this.keyboardStatus && (position < this.previousScrollPosition)) {
        this.closeKeyboard()
      }
      this.previousScrollPosition = position
    },
    closeKeyboard () {
      if (this.$refs['editor']) {
        this.$refs['editor'].blur()
      }
    },
    uploadImageData (imageBlobData) {
      if (this.addCoverImage) {
        this.coverUploading = true
      }

      let vm = this
      this.pictureUploading = true
      let formData = new FormData()
      formData.append('imagefile', imageBlobData, 'image.jpg')
      vm.$axios.post('imageupload', formData)
        .then((response) => {
          if (vm.addCoverImage) {
            vm.addCoverImage = false
            vm.coverUploading = false
            vm.coverImageUrl = response.data.imagePath
            vm.coverImageName = response.data.imageName
          } else {
            vm.imageLink = response.data.imagePath

            // new image element
            let newImage = document.createElement('img')
            newImage.src = response.data.imagePath

            // wrap image element inside div
            let newSection = document.createElement('div')
            newSection.append(document.createElement('br'))
            newSection.append(newImage)
            newSection.append(document.createElement('br'))

            if (this.currentSelection) {
              this.currentSelection.node.appendChild(newSection)
            } else {
              this.$refs.editor.$refs.content.appendChild(newSection)
            }

            vm.$refs.editor.$el.focus()
          }
        }).catch(e => {
          console.error(e)
          vm.$q.notify(e.response.data.message)
        }).finally(() => {
          vm.pictureUploading = false
        })
    },
    onFileChange (e) {
      if (!e.target.files[0]) {
        this.coverUploading = false
        return
      }

      if (this.addCoverImage) {
        this.coverUploading = true
      }

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

      let vm = this
      ImageTools.resize(image, function (blob, didItResize) {
        let formData = new FormData()
        formData.append('imagefile', blob, 'image.jpg')
        vm.$axios.post('imageupload', formData)
          .then((response) => {
            if (vm.addCoverImage) {
              vm.addCoverImage = false
              vm.coverUploading = false
              vm.coverImageUrl = response.data.imagePath
              vm.coverImageName = response.data.imageName
            } else {
              vm.imageLink = response.data.imagePath
              vm.$refs.editor.runCmd('insertImage', response.data.imagePath)
            }
          }).catch(e => {
            console.log(e)
          })
      })
    }
  }
}
</script>
<style lang="stylus">
.text-header
  margin-left: 17%

@media screen and (min-width: 360px)
    .text-header
      margin-left: 23%

@media screen and (min-width: 410px)
    .text-header
      margin-left: 25%

@media screen and (min-width: 600px)
    .text-header
      margin-left: 32%

.upload-image-box
  border-style: dashed
  height: 200px
  width: 100%
  color: lightgrey
  border-width: thin

.cover-image
  object-fit: cover
  height: 200px
  width: 100%
  border-radius: 8px

.q-editor__content img
  width: 100%
  height: 100%

.modal-header-desktop
  position: fixed
  max-width: 520px

input, textarea, [contenteditable]
  -webkit-user-select: text
  -moz-user-select: text
  -ms-user-select: text
  user-select: text
  caret-color: black
  white-space: pre
  display: block

blockquote
  background: #eee
  border-radius: 5px
  margin: 16px 0
  padding: 15px

blockquote::before
  content: '\201C'

blockquote::after
  content: '\201D'

</style>
