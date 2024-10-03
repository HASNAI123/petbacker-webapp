<template>
    <q-page class="q-pb-xl q-mb-md">
        <!-- User Avatar -->
        <q-item>
            <q-item-section class="text-center">
                <q-item-label class="q-mt-md q-mb-none">
                  <q-avatar style="height: 80px; width: 80px;" class="bg-grey-3" @click="onFileSelection">
                    <q-spinner size="1.6em" v-if="imageLoader"></q-spinner>
                    <img :src="userAvatarImage" v-else class="image-upload">
                  </q-avatar>
                </q-item-label>

                <q-item-label class="q-my-none font-normal text-primary" @click="onFileSelection">{{$t('change.photo')}}</q-item-label>
                <input type="file" multiple disable @change="onFileChange" accept=".jpg,.jpeg,.png" ref="selectedFile" style="display: none;">
            </q-item-section>
        </q-item>

        <!-- User Info -->
        <q-item>
            <q-item-section class="q-mb-none">
                <!-- Username -->
                <q-item-label class="q-my-md">
                    <q-input v-model="userName" class="input" borderless :label="$t('username')"></q-input>
                </q-item-label>

                <!-- Email -->
                <q-item-label class="q-my-md" @click="$router.push({name: 'ConfirmEmail'})">
                    <q-input v-model="email" readonly class="input" borderless :label="$t('email')"></q-input>
                </q-item-label>

                <!-- Phone -->
                <q-item-label class="q-my-md" @click="$router.push({name: 'PromptPhone', params: {settings: 'yes'}})">
                    <q-input v-model="mobileNum" :prefix="`${parseMobileCountryId($store.getters['user/getUserMobileCountryId'])}`" readonly class="input" borderless :label="$t('signup.phone')"></q-input>
                </q-item-label>
            </q-item-section>
        </q-item>

        <!-- About Me -->
        <q-item class="input q-mx-md q-mb-md q-mt-none" @click.native="$router.push({name: 'AboutMe'})">
            <q-item-section>
                <q-item-label>{{$t('about.me.title')}}</q-item-label>
            </q-item-section>

            <q-item-section side>
                <q-item-label>
                    <q-icon name="chevron_right" size="20px"></q-icon>
                </q-item-label>
            </q-item-section>
        </q-item>

        <!-- My Bades -->
        <q-item class="input q-mx-md q-my-md" @click.native="$router.push({name: 'Badges'})">
            <q-item-section>
                <q-item-label>{{$t('profile.my.badges')}}</q-item-label>
            </q-item-section>

            <q-item-section side>
                <q-item-label>
                    <q-icon name="chevron_right" size="20px"></q-icon>
                </q-item-label>
            </q-item-section>
        </q-item>

        <!-- Edit Service Info -->
        <q-item class="input q-mx-md q-my-md" @click.native="$router.push({name: 'MyListings', params: {userId: $store.getters['user/getUserUuidState']}})">
            <q-item-section>
                <q-item-label>{{$t('edit.service.location.photos')}}</q-item-label>
            </q-item-section>

            <q-item-section side>
                <q-item-label>
                    <q-icon name="chevron_right" size="20px"></q-icon>
                </q-item-label>
            </q-item-section>
        </q-item>

        <!-- Communication Apps -->
        <q-item class="input q-mx-md q-my-md" @click.native="$router.push({name: 'Communications'})">
            <q-item-section>
                <q-item-label>{{$t('communication.apps')}}</q-item-label>
            </q-item-section>

            <q-item-section side>
                <q-item-label>
                    <q-icon name="chevron_right" size="20px"></q-icon>
                </q-item-label>
            </q-item-section>
        </q-item>

        <p class="q-py-sm"></p>

        <!-- Bottom Save Button -->
        <div class="fixed-bottom bg-primary" style="border-top-right-radius: 15px;border-top-left-radius: 15px;z-index: 4000;">
          <div class="q-pa-md q-pb-lg" @click="onSave">
            <div class="text-white text-center cursor-pointer font-header-title">
              <p v-if="!loader" class="q-my-none text-weight-bold font-title">{{$t('button.save')}}</p>
              <span v-else>
                <q-spinner size="1.5em"></q-spinner>
              </span>
            </div>
          </div>
        </div>
    </q-page>
</template>
<script>
import countries from 'assets/countries.json'
import imageUploadMixin from '../mixins/imageUploadMixin.js'
import ImageTools from 'assets/ImageTools'
export default {
  mixins: [imageUploadMixin],
  data () {
    return {
      userAvatarImage: null,
      userName: this.$store.getters['user/getUserUsername'],
      email: this.$store.getters['user/getUserEmail'],
      mobileNum: this.$store.getters['user/getUserMobileNum'],
      loader: false,
      imageLoader: false
    }
  },
  mounted () {
    this.userAvatarImage = this.$store.getters['user/getUserAvatarImage']
    // listen to ImageUploadMixin callback (image processing)
    this.$on('image-data', (data) => {
      this.uploadImageData(data.blob)
      this.pictureUploading = true
    })
  },
  beforeDestroy () {
    this.$off('image-data')
  },
  methods: {
    onFileChange (e) {
      this.imageLoader = true
      if (!e.target.files[0]) {
        console.log('empty')
        return
      }

      let image = e.target.files[0]
      if (image.type !== 'image/jpeg' && image.type !== 'image/jpg' && image.type !== 'image/png') {
        this.$q.dialog({
          title: this.$t('sorry'),
          message: this.$t('only.jpeg.png')
        })
        return
      }

      let vm = this
      ImageTools.resize(image, function (blob, didItResize) {
        let formData = new FormData()
        formData.append('imagefile', blob, 'image.jpg')
        let imageUploadLink = 'imageupload'
        vm.$axios.post(imageUploadLink, formData)
          .then((response) => {
            let mediaInfo = {
              'contentType': 'image',
              'fileName': response.data.imageName,
              'filePath': response.data.imagePath
            }

            vm.updateProfilePicture(mediaInfo)
          })
          .catch(e => {
            console.log(e)
          })
      })
    },
    uploadImageData (imageBlobData) {
      let vm = this
      this.imageLoader = true

      let formData = new FormData()
      formData.append('imagefile', imageBlobData, 'image.jpg')

      vm.$axios.post('imageupload', formData)
        .then((response) => {
          let mediaInfo = {
            'contentType': 'image',
            'fileName': response.data.imageName,
            'filePath': response.data.imagePath
          }
          vm.updateProfilePicture(mediaInfo)
        }).catch(e => {
          console.error(e)
          vm.$q.notify({
            message: e.response.data.message,
            type: 'negative',
            position: 'top'
          })
        })
    },
    updateProfilePicture (mediaInfo) {
      let info = {
        'accountInfo': {
          'avatarImage': mediaInfo.fileName
        }
      }

      this.$axios.put(`/account/${this.$store.state.user.uuid}`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        // update user states
        this.$store.dispatch('user/updateUserStates', response)
      }).catch(error => {
        console.error(error)
        this.$q.notify({
          message: error.response.data.message,
          type: 'negative',
          position: 'top'
        })
      }).finally(_ => {
        for (let index = 1; index < 5; index++) { // trying to load uploaded iamge as it is giving 403 for a while after upload
          setTimeout(() => {
            this.userAvatarImage = this.$store.getters['user/getUserAvatarImage'] + '?v=' + index
          }, 1000 * index)
        }
        setTimeout(() => {
          this.imageLoader = false
        }, 1250)
      })
    },
    parseMobileCountryId (countryId) {
      return this.$_.findWhere(countries, {'id': countryId.toString()}).mobileCode
    },
    onSave () {
      this.loader = true
      let info = {
        'accountInfo': {
          'username': this.userName
        }
      }

      this.$axios.put(`/account/${this.$store.state.user.uuid}`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        // update user states
        this.$store.dispatch('user/updateUserStates', response)
      }).catch(error => {
        console.error(error)
        this.$q.notify({
          message: error.response.data.message,
          type: 'negative',
          position: 'top'
        })
      }).finally(_ => {
        this.loader = false
        this.$router.go(-1)
      })
    }
  }
}
</script>
