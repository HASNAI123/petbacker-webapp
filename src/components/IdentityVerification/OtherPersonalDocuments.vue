<template>
    <q-dialog v-model="modal"
    :position="count < 1 ? 'bottom' : 'standard'"
    :maximized="count === 1"
    @hide="closePopUp"
    class="responsive-modal"
    transition-hide="slide-down"
    transition-show="slide-up"
    >
        <input type="file" disable @change="imageUpload" accept=".jpg,.jpeg,.png" ref="selectedFile" style="display: none;">
        <q-card style="border-top-left-radius:11px;border-top-right-radius:11px;" v-if="count === 0" class="q-pb-lg" >
            <q-card-section class="q-pb-xs">
              <h6 class="q-my-none">{{$t('take.photo.of.document', {'documentType': $t(type)})}}</h6>

              <p class="text-grey-9" >{{$t('ensure.petbacker.is.secure')}}</p>
            </q-card-section>

            <q-card-section>
              <div class="text-center" v-if="type === 'Driving License'">
                  <q-img src="statics/images/ID.png" style="width: 200px;border-radius: 11px;" ></q-img>
              </div>
            </q-card-section>

            <q-card-section>
              <q-btn class="full-width q-py-sm" :label="$t('get.started')" color="primary" :loading="showLoading" :ripple="false" @click="triggerImageSelectionModal(true)"></q-btn>
            </q-card-section>
        </q-card>

        <q-card class="q-pb-lg" v-else-if="count === 1">
            <!-- Header -->
            <q-toolbar v-if="count === 1" style="border-bottom: 1px solid lightgrey;">
                <q-btn flat round dense icon="chevron_left" size="1.3em" @click="count -= 1"></q-btn>
                <q-toolbar-title @click="count -= 1">
                  <h6 class="q-my-none font-header-title" style="margin-left: 25%;">{{$t('verify.identity')}}</h6>
                </q-toolbar-title>
            </q-toolbar>

            <q-card-section class="q-pb-xs q-mt-lg">
                <h6 class="q-my-none font-title">{{$t('enter.details.verification')}}</h6>
            </q-card-section>

            <q-card-section>
              <q-input v-model="passportInfo.fullName" borderless dense class="input q-my-md" :error="showError && passportInfo.fullName === null" hide-bottom-space :label="$t('full.name')"></q-input>
              <q-input v-model="passportInfo.passportNum" borderless dense class="input q-my-md" :error="showError && passportInfo.passportNum === null" hide-bottom-space :label="$t('passport.number')"></q-input>
              <q-input class="input q-my-md" readonly v-model="passportInfo.dob" :error="showError && passportInfo.dob === null" @click.native="$refs.qDate.show()" hide-bottom-space :label="$t('date.of.birth')" borderless dense>
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer" style="margin-right: 10px;">
                    <q-dialog ref="qDate" transition-show="scale" transition-hide="scale">
                      <q-date class="full-width" v-model="passportInfo.dob" mask="YYYY-MM-DD" :options="checkDate" @input="$refs.qDate.hide()"></q-date>
                    </q-dialog>
                  </q-icon>
                </template>
              </q-input>
            </q-card-section>

            <!-- BUTTON BOTTOM will appear on mobile screen -->
            <div class="row text-center fixed-bottom lt-lg">
                <div class="col-xs-12" :disabled="showLoading" @click="onSubmit">
                    <div class="full-width z999 text-white q-pa-md bg-primary cursor-pointer font-header-title-large">
                        <span v-if="!showLoading">{{ $t('button.submit') }}</span>
                        <span v-else><q-spinner></q-spinner></span>
                    </div>
                </div>
            </div>
        </q-card>

        <!-- Image Selection Option -->
        <dialog-image-options :trigger="imageSelectionModal" @on-selected="uploadImageData" @on-close="triggerImageSelectionModal"></dialog-image-options>
    </q-dialog>
</template>
<script>
import ImageTools from 'assets/ImageTools.js'
import moment from 'moment'
export default {
  components: {
    'dialog-image-options': () => import('components/ImageUpload/DialogSelection.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    showLoading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    }
  },
  data () {
    return {
      modal: false,
      showError: false,
      count: 0,
      passportInfo: {
        fullName: null,
        dob: null,
        passportNum: null,
        documentType: 9,
        fileName: null
      },
      imageSelectionModal: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    }
  },
  methods: {
    triggerImageSelectionModal (status) {
      this.imageSelectionModal = status
    },
    checkDate (serviceStart) {
      let today = moment()
      return moment(serviceStart).format('YYYY-MM-DD') <= moment(today).format('YYYY-MM-DD')
    },
    uploadImageData (imageBlobData) {
  let vm = this
  console.log('upload image started')
  vm.$emit('on-loading', true)
  let formData = new FormData()
  formData.append('imagefile', imageBlobData, 'image.jpg')
  vm.$axios.post('imageupload?type=identity', formData)
    .then((response) => {
      console.log('check response fro documents upload', response)

      if (vm.type === 'Passport') {
        vm.passportInfo.fileName = response.data.imageName
        vm.count++
      } else {
        let form = {
          'accountInfo': {
            'documentType': vm.getTypeId(),
            'fileName': response.data.imageName
          }
        }

        vm.$emit('on-document-submit', form)
      }
    }).catch(e => {
      console.error(e)
      vm.$emit('on-loading', false)
      vm.$q.notify(e.response.data.message)
      this.modal = false
    }).finally(_ => {
      vm.$emit('on-loading', false)
      this.modal = false
      this.$axios.get(`/account/${this.$store.state.user.uuid}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        // Handle the response her
        this.$emit('pending-documents', response.data.accountInfo.otherDocuPending)
        this.$emit('verified-documents', response.data.accountInfo.otherDocuVerified)
      }).catch((error) => {
        // Handle the error here
        console.log(error)
      })
    })
},
    checkInvalid () {
      if (this.passportInfo.fullName === '' || this.passportInfo.fullName === null) {
        return true
      }

      if (this.passportInfo.passportNum === '' || this.passportInfo.passportNum === null) {
        return true
      }

      if (this.passportInfo.dob === '' || this.passportInfo.dob === null) {
        return true
      }

      return false
    },
    onSubmit () {
      this.showError = false
      if (this.checkInvalid()) {
        this.showError = true
        return
      }
      this.$emit('on-document-submit', {accountInfo: this.passportInfo})
    },
    closePopUp () {
      console.log('close the dialog emitted')
      this.modal = false
      this.$emit('on-close', false)
      this.count = 0
    },
    getTypeId () {
      console.log('lets check typoe for other documents', this.type)
      switch (this.type) {
        case 'training.cert': return 3
        case 'grooming.cert': return 4
        case 'vet.cert': return 5
        case 'driving.license': return 8
        case 'passport': return 9
        case 'document': return 10
        case 'payout.verify': return 11
        case 'Other Documents' : return 12
        default: return 0
      }
    },
    imageUpload (e) {
      if (!e.target.files[0]) {
        this.$q.notify({
          message: this.$t('no.images.selected'),
          position: 'top'
        })
        return
      }

      this.$emit('on-loading', true)
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
        vm.$axios.post('imageupload?type=identity', formData)
          .then((response) => {
            if (vm.type === 'Passport') {
              vm.passportInfo.fileName = response.data.imageName
              vm.count++
            } else {
              let form = {
                'accountInfo': {
                  'documentType': vm.getTypeId(),
                  'fileName': response.data.imageName
                }
              }

              vm.$emit('on-document-submit', form)
            }
          }).catch(e => {
            console.error(e)
            vm.$emit('on-loading', false)
            vm.$q.notify(e.response.data.message)
          }).finally(_ => {
            vm.$emit('on-loading', false)
          })
      })
    }
  }
}
</script>
