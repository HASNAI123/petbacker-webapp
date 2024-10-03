<template>
  <q-page>
    <div  :style="{width: this.$q.platform.is.mobile ? '100%' : '1030px'}" class="margin-auto">
      <div class="row">
        <div class="col-md-12 col-xs-12 q-pa-sm text-left border-td bg-grey-4">{{$t('support_form_header_text')}}</div>
        <div class="col-md-12 col-xs-12 q-pa-sm border-td bg-grey-4">{{$t('type_of_enquiry')}}</div>
        <div @click="modalTypeofEnquiry = true" v-if="typeofEnquiry" class="col-md-12 col-xs-12  q-pa-sm border-td anchor-link">{{ typeofEnquiry.title }}</div>
        <div @click="modalTypeofEnquiry = true" v-else class="col-md-12 col-xs-12  q-pa-sm border-td anchor-link">{{$t('select_an_option')}}</div>
        <div class="col-md-12 col-xs-12 " v-if="typeofEnquiry" v-show="[2, 3].includes(typeofEnquiry.id)">
          <div class="q-pa-sm border-td bg-grey-4">{{$t('job_booking_ref')}}</div>
          <div @click="modalJobsDetailsOpen()" v-if="jobReference" class="q-pa-sm border-td"><p class="q-my-none anchor-link">{{ jobReference }} <q-icon class="fas fa-angle-right float-right" size="20px"></q-icon></p></div>
          <div @click="modalJobsDetailsOpen()" v-else class="q-pa-sm border-td"><p class="q-my-none anchor-link">{{$t('job_booking_ref')}} <q-icon class="fas fa-angle-right float-right" size="20px"></q-icon></p></div>
        </div>
        <div class="col-md-12 col-xs-12  q-pa-sm border-td bg-grey-4">{{$t('support.enquiry.title')}}</div>
        <input v-model="enquiryTitle" @input="validation(typeofEnquiry ? typeofEnquiry.id : null)" class="col-md-12 full-width q-pa-sm messagebox" rows="5" :placeholder="$t('support.enquiry.title.placeholder')"/>
        <div class="col-md-12 col-xs-12  q-pa-sm border-td bg-grey-4">{{$t('explain_issues_suggestions_here')}}</div>
        <textarea v-model="message" @input="validation(typeofEnquiry ? typeofEnquiry.id : null)" class="col-md-12 full-width q-pa-sm messagebox" rows="5" :placeholder="$t('type_a_message_here')"></textarea>
        <div class="col-md-12 col-xs-12  q-pa-sm border-td bg-grey-4">{{$t('upload_screenshots')}}</div>
        <div class="col-md-12 col-xs-12  q-pa-sm">
          <q-btn icon="camera_alt" style="width: 70px; height: 70px; float: left; color:#ddd;" :loading="pictureUploading" class="bg-primary" @click="onImageSelection"/>
          <!-- <div style="margin-left: 10px; float: left;" v-if="fileEvent"><div v-for="(image, index) in fileEvent.target.files" :key="index">{{image.name}}</div></div> -->
          <input type="file" multiple ref="fileInput" @change="fileEvent = $event, onSelectFile()" accept=".jpg,.jpeg,.png" style="display: none;">
          <div v-for="(image, index) in imageData" :key="index"  style="width: 70px; height: 70px; float: left; margin-left: 10px;">
            <img :src="image" style="width: 70px; height: 70px; float: left; margin-left: 10px;" class="image-upload"/>
            <div class="relative">
              <i style="position: absolute; cursor:pointer;" @click="removeImageFromList(index)" class="fa fa-times text-negative"></i>
            </div>
          </div>
        </div>
        <q-btn :disabled="disabled" :loading="loader" :class="disabled_look ? 'disabled_look' : ''" class="col-md-12 col-xs-12  q-mb-sm q-mt-md q-mx-md primary bg-primary text-white full-width" size="md" @click="submitEnquiry()">
          {{$t('button.submit')}}
        </q-btn>
      </div>

      <!-- Type of Enquiry Dialog Box -->
      <q-dialog v-model="modalTypeofEnquiry" auto-close position="bottom" >
        <q-card>
          <q-card-section>
            <q-btn class="full-width text-weight-bold q-my-sm" v-for="category in categories" :key="category.id" flat @click.native="typeofEnquiry = category, validation(category.id)" no-caps><p class="q-my-none">{{category.title}}</p></q-btn>
            <div id="line" ><hr/></div>
            <q-btn class="full-width text-weight-bold q-my-sm q-py-xs" flat text-color="secondary" id="closeBtn" no-caps><p class="q-my-none">{{$t('close')}}</p></q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Job Selection Dialog Box (to obtain reference number)  -->
      <q-dialog v-model="modalJobsDetails" auto-close :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
        <q-card>
          <q-toolbar class="bg-white fixed-top" style="z-index:6100;" v-if="$q.platform.is.mobile">
            <q-btn icon="chevron_left" size="1.4em" flat round dense></q-btn>
            <q-toolbar-title class="font-title" style="margin-left: 8%;">
              <h6 class="q-my-none font-normal">{{$t('job_booking_ref')}}</h6>
            </q-toolbar-title>
          </q-toolbar>

          <q-card-section class="q-pa-none">
            <q-list :class="$q.platform.is.mobile ? 'q-mt-xl' : 'q-mt-xs'">
              <q-item dense class="border-td q-py-sm" clickable v-for="item in jobsItems" :key="item.id" @click="onSelect(item)">

                <q-item-section avatar>
                  <q-avatar>
                    <img :src="item.requestInfo ? item.requestInfo.serviceIcon : item.serviceIcon" />
                  </q-avatar>
                </q-item-section>

                <q-item-section @mouseout="showByIndex = null">
                  <q-item-label>{{ item.requestInfo ? item.requestInfo.requestDescription : item.requestDescription }}</q-item-label>
                  <q-item-label >{{ item.requestInfo.requestorInfo.username }}</q-item-label>
                  <q-item-label caption>{{ item.requestInfo ? item.requestInfo.serviceName : item.serviceName }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label class="font-normal">
                    <div style="width: 25px;height: 25px;border-radius: 20px;" class="text-center rounded-borders">
                      <q-icon name="fas fa-check" class="text-positive" v-if="showByIndex === item.id"></q-icon>
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Support Enquiry Submitted Dialog Box -->
      <q-dialog v-model="modalSubmitted" :content-css="{height: 'fit-content', background: 'transparent', boxShadow: 'none'}">
        <q-card style="overflow: visible;border-radius: 10px;">
          <q-card-section style="min-height: 150px;width: 260px;" class="q-pb-none q-px-xs">
            <div class="tip-bulb">
              <img src="statics/images/logo-mid.jpg" class="tip-bulb-image">
            </div>
            <div class="bg-white">
                <h6 class="q-my-none q-mt-md text-center">{{ $t('note')}}</h6>
                <div class="col-12 text-justify q-pa-md tip-desc">
                  <span>{{$t('support.covid.schedule')}}</span>
                </div>
                <div class='full-width q-px-md'>
                  <q-btn class="full-width" color="primary" :label="$t('ok')" @click.native="modalSubmitted=false, $router.replace('/chat/support-help')" />
                </div>
                <div class="row q-py-sm q-mx-auto">
                </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="modalErrorMsg" auto-close>
        <q-card style="width:300px;">
          <q-card-section>
            <div class="row justify-center">
                <div class="col-12 text-center q-pa-md tip-desc">
                    <span>{{$t('service_description_error')}}</span>
                </div>
                </div>
                <div class='full-width q-px-md'>
                  <q-btn class="full-width" color="primary" :label="$t('ok')" @click.native="modalErrorMsg=false" />
                </div>
                <div class="row q-py-sm q-mx-auto">
                </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="modalNoJobs" auto-close>
        <q-card style="width:300px;">
          <q-card-section>
            <div class="row justify-center">
                <div class="col-12 text-center q-pa-md tip-desc">
                    <span>{{$t('no_jobs_booked_yet')}}</span>
                </div>
                </div>
                <div class='full-width q-px-md'>
                  <q-btn class="full-width" color="primary" :label="$t('close')" @click.native="modalNoJobs=false" />
                </div>
                <div class="row q-py-sm q-mx-auto">
                </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import chatMixin from '../mixins/chatMixin'
import ImageUploadMixin from '../mixins/imageUploadMixin.js'
import languages from 'assets/languages.json'

export default {
  mixins: [chatMixin, ImageUploadMixin],
  data () {
    return {
      categories: null,
      languageId: this.$_.findWhere(languages, {'value': this.$store.getters['user/getCurrentLanguage']}).id,
      images: [],
      imageData: [],
      fileEvent: null,
      modalTypeofEnquiry: false,
      modalJobsDetails: false,
      modalSubmitted: false,
      modalErrorMsg: false,
      modalNoJobs: false,
      jobReference: null,
      typeofEnquiry: null,
      jobsItems: [],
      showByIndex: null,
      message: '',
      messageBox: '',
      disabled: true,
      disabled_look: false,
      selectedIcon: '<i class="far fa-check-circle fa-2x" style="color:primary"></i>',
      notSelectedIcon: '<i class="far fa-circle fa-2x"></i>',
      showModalOnlyTypes: [5, 6, 7],
      enquiryTitle: null,
      submittedImages: [],
      loader: false
    }
  },
  created () {
    this.getSupportCategories()
  },
  mounted () {
    this.getJobReference()
    this.getRequestReference()

    // listen to ImageUploadMixin callback (image processing)
    this.$on('image-data', this.onSelectFileAndroid)

    this.$on('sendMessage', () => {
      this.fileEvent = null
      this.jobReference = null
      this.typeofEnquiry = null
      this.message = ''
    })
  },
  beforeDestroy () {
    this.$off('image-data')
  },
  methods: {
    onSelect (item) {
      this.jobReference = `#${item.jobReference ? item.jobReference : item.requestReference}`
      this.showByIndex = item.id
    },
    getSupportCategories () {
      if (this.$store.getters['cached/getSupportCategoriesCached']) {
        this.categories = this.$store.getters['cached/getSupportCategoriesCached']
      }

      this.$axios.get(`/helpdesk-tickets/categories?language_id=${this.languageId}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status !== 204) {
          this.categories = response.data.categoryInfo.items

          if (JSON.stringify(this.$store.getters['cached/getSupportCategoriesCached']) !== JSON.stringify(response.data.categoryInfo.items)) {
            this.$store.dispatch('cached/cacheSupportCategories', response.data.categoryInfo.items)
          }
        }
      }).catch(error => {
        this.forceLogout(error)
        console.log(error)
      })
    },
    onImageSelection () {
      if (this.$q.platform.is.cordova) {
        this.onFileSelection()
      } else {
        this.$refs['fileInput'].click()

        if (this.$q.platform.is.cordova) {
          this.$refs['fileInput'].click()
        }
      }
    },
    modalJobsDetailsOpen () {
      if (this.jobsItems.length === 0) {
        this.modalNoJobs = true
        return
      }
      this.modalJobsDetails = true
    },
    makeImageData () {
      this.imageData = []
      for (let index = 0; index < this.images.length; index++) {
        const image = this.images[index]
        this.imageData.push(image.url)
      }
    },
    removeImageFromList (index) {
      delete this.images.splice(index, 1)
      this.images = this.images
      this.makeImageData()
    },
    onSelectFileAndroid (imageBlobData) {
      this.images.push(imageBlobData)
      this.makeImageData()
    },
    onSelectFile () {
      const input = this.$refs.fileInput
      const files = input.files
      for (let index = 0; index < files.length; index++) {
        const image = files[index]
        this.images.push(image)
      }
      this.makeImageData()
    },
    validation (id) {
      if (![2, 3].includes(id)) {
        this.jobReference = null
      }

      if (this.countWords(this.message) < 1) {
        this.disabled_look = true
      } else {
        this.disabled_look = false
      }

      if ([2, 3].includes(id) && (this.jobReference || this.jobsItems.length === 0)) {
        this.disabled = false
      } else if (![null, 2, 3].includes(id)) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    countWords (str) {
      if (str.length > 0) {
        str = str.replace(/(^\s*)|(\s*$)/gi, '')
        str = str.replace(/[ ]{2,}/gi, ' ')
        str = str.replace(/\n /, '\n')
        return str.split(' ').length
      } else {
        return 0
      }
    },
    submitImages (ticketId) {
      if (this.images.length === 0) {
        return
      }

      for (let index = 0; index < this.images.length; index++) {
        let image = this.images[index]
        if (image.blob.type !== 'image/jpeg' && image.blob.type !== 'image/png') {
          let sorry = this.$t('sorry')
          let message = this.$t('only.jpeg.png')
          this.$q.dialog({
            title: sorry,
            message: message
          })
          return
        }

        let vm = this
        let formData = new FormData()
        formData.append('imagefile', image.blob, 'image.jpg')
        let imageUploadLink = 'imageupload?type=helpdesk'
        vm.$axios.post(imageUploadLink, formData).then((response) => {
          vm.imageLink = response.data.imageName
          vm.sendImage(true, ticketId)
        }).catch(e => {
          console.error(e)
        })
      }

      /* if (this.showModalOnlyTypes.includes(this.typeofEnquiry.id)) {
        this.modalSubmitted = true
      } else {
        this.$q.notify({message: this.$t('support_form_submitted_text'), type: 'positive', position: 'top'})
        this.$router.go(-1)
      } */
      this.$q.notify({message: this.$t('support_form_submitted_text'), type: 'positive', position: 'top'})
      this.$router.go(-1)

      this.loader = false
    },
    submitEnquiry () {
      if (this.countWords(this.message) < 1) {
        this.modalErrorMsg = true
        return
      }

      this.loader = true
      let payload = {
        'ticketInfo': {
          'uuid': this.$store.state.user.uuid,
          'subject': `${this.jobReference ? `${this.enquiryTitle || ''} (#${this.jobReference})` : (this.enquiryTitle || '')}`,
          'description': this.message,
          'categoryId': this.typeofEnquiry.id,
          'languageId': this.languageId,
          'source': this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5
        }
      }

      this.$axios.post(`helpdesk-tickets`, payload, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (this.images.length > 0) {
          // submit images
          this.submitImages(response.data.ticketInfo.id)
        } else {
          /* if (this.showModalOnlyTypes.includes(this.typeofEnquiry.id)) {
            this.modalSubmitted = true
          } else {
            this.$q.notify({message: this.$t('support_form_submitted_text'), type: 'positive', position: 'top'})
            this.$router.go(-1)
          } */
          this.$q.notify({message: this.$t('support_form_submitted_text'), type: 'positive', position: 'top'})
          this.$router.go(-1)
          this.loader = false
        }
      }).catch(error => {
        if (error.response && error.response.data && error.response.data.status === 409) {
          this.$q.notify({message: error.response.data.message, type: 'negative', position: 'bottom'})
          this.loader = false
          return
        }
        this.forceLogout(error)
      })
      // Type of Enquiry: {pass the type of inquiry selected}
      // Job/Booking Reference: {selected job reference}
      // Message: {message from the textfield}
    },
    getJobReference () {
      this.$axios.get(`/users/${this.$store.state.user.uuid}/tasks?category[]=1&category[]=3&page=1&per_page=40`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        // console.log(response)
        if ((response.status !== 204) && response.data.taskInfo) {
          this.jobsItems = this.jobsItems.concat(response.data.taskInfo.items)
        }
      }).catch(error => {
        this.forceLogout(error)
        console.log(error)
      })
    },
    getRequestReference () {
      this.$axios.get(`/users/${this.$store.state.user.uuid}/requests?status[]=0&status[]=1&page=1&per_page=20&v=6`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if ((response.status !== 204) && response.data.requestInfo) {
          this.jobItmes = this.jobsItems.concat(response.data.requestInfo.items)
        }
      }).catch(error => {
        this.forceLogout(error)
        console.log(error)
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.rounded-borders
  border: solid 2px $primary;
.border-td {
  border-top: 1px solid #aaa
  // border-bottom: 1px solid #aaa
  // padding 5px
}
.disabled_look {
  opacity 0.6
  cursor: not-allowed !important;
}

.relative {
  position: relative
}
.messagebox {
  border-left: none
  border-right: none
}
.messagebox:focus {
  outline none
}
</style>
