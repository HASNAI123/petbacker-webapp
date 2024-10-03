<template>
    <q-dialog v-model="modal"
    :position="count < 3 ? 'bottom' : 'standard'"
    :maximized="count === 3"
    @hide="closePopUp"
    class="responsive-modal"
    transition-hide="slide-down"
    transition-show="slide-up"
    >
        <input type="file" disable @change="imageUpload" accept=".jpg,.jpeg,.png" ref="selectedFile" style="display:none;">
        <q-card style="border-top-left-radius:11px;border-top-right-radius:11px;" class="q-pb-lg" v-if="count === 0">
            <q-card-section class="q-pb-xs">
                <h6 class="q-my-none">{{$t('take.photo.id')}}</h6>
                <p class="text-grey-9">{{$t('required.by.law.to.ensure.secure')}}</p>
            </q-card-section>

            <q-card-section>
                <div class="text-center" >
                    <q-img src="statics/images/ID.png" style="width: 200px;border-radius: 11px;" ></q-img>
                </div>
            </q-card-section>

            <q-card-section>
                <q-btn class="full-width q-py-sm cursor-pointer" :label="$t('get.started')" color="primary" :loading="loader" :ripple="false" @click.native="triggerImageSelectionModal(true)"></q-btn>
            </q-card-section>
        </q-card>

        <q-card style="border-top-left-radius:11px;border-top-right-radius:11px;" class="q-pb-lg" v-if="count === 1">
            <q-card-section class="q-pb-xs">
                <h6 class="q-my-none">{{$t('photo.backside.id')}}</h6>
                <p class="text-grey-9">{{$t('ensure.birthday.clearly.show')}}</p>
            </q-card-section>

            <q-card-section>
                <div class="text-center" >
                    <q-img src="statics/images/ID-capture.png" style="width: 200px;border-radius: 11px;" ></q-img>
                </div>
            </q-card-section>

            <q-card-section>
                <q-btn class="full-width q-py-sm" :label="$t('get.started')" color="primary" :loading="loader" :ripple="false" @click="triggerImageSelectionModal(true)"></q-btn>
            </q-card-section>
        </q-card>

        <q-card style="border-top-left-radius:11px;border-top-right-radius:11px;" class="q-pb-lg" v-if="count === 2">
            <q-card-section class="q-pb-xs">
                <h6 class="q-my-none">{{$t('photos.of.your.id.clear')}}</h6>
                <p class="text-grey-9">{{$t('photo.of.id.should.not.be.blurry')}}</p>
            </q-card-section>

            <q-card-section class="row justify-center">
                <q-btn class="q-py-sm col-4 q-mx-xs" outline :label="$t('retake')" color="primary" :ripple="false" style="border-radius: 11px" @click="count = 0"></q-btn>
                <q-btn class="q-py-sm col-7 q-mx-xs" :label="$t('use.it')" color="primary" :ripple="false" style="border-radius: 11px" @click="count += 1"></q-btn>
            </q-card-section>
        </q-card>

        <q-card style="border-top-left-radius:11px;border-top-right-radius:11px;" class="q-pb-lg" v-if="count === 3">
            <!-- Header -->
            <q-toolbar v-if="count === 3">
                <q-btn flat round dense icon="chevron_left" size="1.3em" @click="count -= 1"></q-btn>
                <q-toolbar-title @click="count -= 1">
                  <h6 class="q-my-none header-title font-header-title">{{$t('verify.identity')}}</h6>
                </q-toolbar-title>
            </q-toolbar>

            <q-card-section class="q-pb-xs q-mt-lg">
                <h6 class="q-my-none font-title">{{$t('enter.details.verification')}}</h6>
            </q-card-section>

            <q-card-section>
              <q-input v-model="idInfo.fullName" hide-bottom-space borderless class="input q-my-md" :error="showError && idInfo.fullName === null" :label="$t('full.name.as.id')"></q-input>
              <q-input v-model="idInfo.icNumber" hide-bottom-space borderless class="input q-my-md" :error="showError && idInfo.icNumber === null" :label="$t('id.number')"></q-input>
              <q-input class="input q-my-md" hide-bottom-space readonly v-model="idInfo.dob" :error="showError && idInfo.dob === null" @click.native="$refs.qDate.show()" :label="$t('date.of.birth')" borderless>
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer" style="margin-right: 10px;">
                    <q-dialog ref="qDate" transition-show="scale" transition-hide="scale">
                      <q-date class="full-width" v-model="idInfo.dob" mask="YYYY-MM-DD" :options="checkDate" @input="$refs.qDate.hide()"></q-date>
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
    }
  },
  data () {
    return {
      count: 0,
      modal: false,
      idInfo: {
        fileName: null,
        IDBackFileName: null,
        fullName: null,
        icNumber: null,
        dob: null
      },
      loader: false,
      showError: false,
      imageSelectionModal: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)
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
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    },
    resetCount () {
      this.count = 0
    },
    onSubmit () {
      if (this.checkInvalid()) {
        this.showError = true
        return
      }

      this.$emit('on-id-submit', this.idInfo)
    },
    checkInvalid () {
      if (this.idInfo.fullName === '' || this.idInfo.fullName === null) {
        return true
      }

      if (this.idInfo.icNumber === '' || this.idInfo.icNumber === null) {
        return true
      }

      if (this.idInfo.dob === '' || this.idInfo.dob === null) {
        return true
      }

      return false
    },
    uploadImageData (imageBlobData) {
      let vm = this
      this.loader = true
      let formData = new FormData()
      formData.append('imagefile', imageBlobData, 'image.jpg')
      vm.$axios.post('imageupload?type=identity', formData)
        .then((response) => {
          if (vm.count === 0) {
            vm.idInfo.fileName = response.data.imageName
          } else if (vm.count === 1) {
            vm.idInfo.IDBackFileName = response.data.imageName
          }

          vm.count += 1
        }).catch(e => {
          console.error(e)
          vm.$q.notify(e.response.data.message)
        }).finally(_ => {
          vm.loader = false
        })
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

      let vm = this
      ImageTools.resize(image, function (blob, didItResize) {
        let formData = new FormData()
        formData.append('imagefile', blob, 'image.jpg')
        vm.$axios.post('imageupload?type=identity', formData)
          .then((response) => {
            if (vm.count === 0) {
              vm.idInfo.fileName = response.data.imageName
            } else if (vm.count === 1) {
              vm.idInfo.IDBackFileName = response.data.imageName
            }

            vm.count += 1
          }).catch(e => {
            console.error(e)
            vm.$q.notify(e.response.data.message)
          }).finally(_ => {
            vm.loader = false
          })
      })
    }
  }
}
</script>
<style lang="stylus">
.header-title
  margin-left: 20%
</style>
