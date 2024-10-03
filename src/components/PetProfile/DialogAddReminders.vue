<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" :persistent="$q.platform.is.mobile" :transition-show="$q.platform.is.mobile ? 'slide-left' : 'none'" :transition-hide="$q.platform.is.mobile ? 'slide-right' : 'none'">
        <q-card>
            <q-toolbar style="z-index: 5000;" class="borderline">
                <q-btn flat dense v-close-popup icon="keyboard_arrow_left" size="1.3em"></q-btn>
                <q-toolbar-title v-close-popup >
                    <h6 class="q-my-none add-reminder-title">{{$t('add.reminders')}}</h6>
                </q-toolbar-title>
            </q-toolbar>

            <q-card-section class="justify-center">
              <q-select v-model="reminderType" transition-show="jump-down" transition-hide="jump-up" behavior="menu" :error="!typeValid && !reminderType" hide-bottom-space :options="options" :label="$t('reminder.type')" borderless class="input q-my-md"></q-select>
              <q-input v-model="title" :error="!titleValid && !title" hide-bottom-space :label="$t('title')" borderless class="input q-my-md"></q-input>
              <q-input class="input col-md-12 col-xs-12" readonly v-model="reminderDate" @click.native="$refs.qDate.show()" :label="$t('date')" borderless>
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer" style="margin-right: 10px;">
                      <q-dialog ref="qDate" transition-show="scale" transition-hide="scale">
                        <q-date class="full-width" @input="$refs.qDate.hide()" v-model="reminderDate" mask="DD-MM-YYYY"></q-date>
                      </q-dialog>
                    </q-icon>
                  </template>
              </q-input>

              <!-- Upload Image -->
              <q-input
                v-if="reminderType && reminderType.value === 1"
                type="file"
                :loading="loader"
                stack-label
                v-model="vaccineImage"
                :error="!vaccineImage && !imageValid"
                @change="imageUpload"
                accept="image/png, image/jpeg, image/jpg"
                :label="$t('upload.vaccine.sticker')"
                borderless
                class="input q-my-md"
                hide-bottom-space>
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
              </q-input>

              <!-- Select Vet -->
              <q-select use-input
              v-model="vetInfo.selected"
              input-debounce="500"
              :label="$t('select.clinic')"
              ref="clinic-selection"
              :options="vetOptions"
              :option-label="(item) => item === null ? null : item.name"
              :option-value="(item) => item === null ? null : item"
              @filter="onFilter"
              @input="onVetSelected"
              behavior="menu"
              v-if="reminderType && reminderType.value === 1 && !addClinic"
              borderless
              class="input q-my-md"
              hide-bottom-space>
                <template v-slot:no-option>
                  <q-item clickable @click="vetInfo.selected = 'create'; addClinic = true">
                    <q-item-section class="text-grey">
                      {{$t('no.result.add.clinic')}}
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-card-section>

            <!-- Vet Info -->
            <q-card-section class="justify-center q-mb-xl" v-if="addClinic || displayVetInfo">
              <h6 class="q-my-none">{{$t('clinic.info')}}</h6>
              <q-input autofocus :readonly="displayVetInfo" v-model="vetInfo.name" :error="!vetInfoValid && !vetInfo.name" hide-bottom-space :label="$t('clinic.name')" borderless class="input q-my-md"></q-input>
              <q-input v-model="vetInfo.contact" :readonly="displayVetInfo" :error="!vetInfoValid && !vetInfo.contact" :type="$q.platform.is.desktop ? 'number' : 'tel'" hide-bottom-space :label="$t('clinic.contact.number')" borderless class="input q-my-md"></q-input>
              <q-input v-model="vetInfo.address" :readonly="displayVetInfo" :error="!vetInfoValid && !vetInfo.address" hide-bottom-space :label="$t('clinic.address')" borderless class="input q-my-md"></q-input>
            </q-card-section>

            <!-- Repeat Intervals -->
            <q-card-section class="justify-center" v-if="reminderType && (reminderType.value === 5 || reminderType.value === 4)">
              <h6 class="q-my-none">{{$t('repeat.intervals')}}</h6>
              <q-select v-model="repeatInfo.type" @input="onRepeatType" transition-show="jump-down" transition-hide="jump-up" behavior="menu" :error="!typeValid" hide-bottom-space :options="repeatType" :label="$t('repeat.type')" borderless class="input q-my-md"></q-select>
              <q-input v-model="repeatInfo.frequency" @input="onRepeatFrequency" :type="$q.platform.is.desktop ? 'number' : 'tel'" :error="!typeValid" hide-bottom-space :label="$t('repeat.every')" borderless class="input q-my-md"></q-input>
            </q-card-section>

            <!-- Bottom Button will appear on mobile screen -->
            <div class="row text-center fixed-bottom">
                <div class="col-xs-12 lt-lg" @click="checkValid">
                    <div class="full-width text-white q-pa-md bg-primary cursor-pointer" v-ripple style="height: 70px;z-index:6000;">
                      <p v-if="!saveLoading" class="text-weight-bold font-title" style="margin-top: 5px;">{{$t('add.reminder')}}</p>
                      <span v-else>
                          <q-spinner size="3em"></q-spinner>
                      </span>
                    </div>
                </div>
            </div>
        </q-card>

        <dialog-error :trigger="errorModal" :message="$t('please.wait.for.image.to.upload')" @on-close="triggerErrorModal"></dialog-error>
    </q-dialog>
</template>
<script>
import ImageTools from 'assets/ImageTools.js'
import ImageUploadMixin from '../../mixins/imageUploadMixin.js'
import moment from 'moment'
export default {
  mixins: [ImageUploadMixin],
  components: {
    'dialog-error': () => import('components/Dialog400Error.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    media: {
      type: Array
    },
    prefilled: {
      type: Object,
      default: () => { return null }
    }
  },
  data () {
    return {
      modal: false,
      reminderType: null,
      title: null,
      date: null,
      MOMENT: moment,
      saveLoading: false,
      reminderDate: moment().local().format('DD-MM-YYYY'),
      options: [
        {label: this.$t('vaccine'), value: 1},
        // {label: this.$t('birthday'), value: 2},
        // {label: this.$t('appointments'), value: 3},
        {label: this.$t('flea'), value: 5},
        {label: this.$t('other'), value: 4}
      ],
      repeatType: [
        {label: this.$t('daily'), value: 1},
        {label: this.$t('weekly'), value: 2},
        {label: this.$t('monthly'), value: 3},
        {label: this.$t('yearly'), value: 4}
      ],
      titleValid: true,
      typeValid: true,
      vetInfoValid: true,
      imageValid: true,
      repeatInfo: {
        type: null,
        frequency: ''
      },
      vetInfo: {
        id: null,
        selected: null,
        name: null,
        contact: null,
        address: null
      },
      imageInfo: null,
      vaccineImage: null,
      loader: false,
      addClinic: false,
      vetOptions: [],
      displayVetInfo: false,
      errorModal: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)

      if (value && this.vetOptions.length === 0) {
        this.getVets()
      }

      if (value === false) {
        this.reminderType = null
        this.title = null
        this.addClinic = false
        this.imageInfo = null
        this.titleValid = true
        this.typeValid = true
        this.vetInfoValid = true
        this.imageValid = true
        this.vetInfo = {
          selected: null,
          name: null,
          contact: null,
          address: null
        }
        this.displayVetInfo = false
        this.reminderDate = moment().local().format('DD-MM-YYYY')
        this.repeatInfo.frequency = ''
        this.repeatInfo.type = null
      }

      if (value && this.prefilled) {
        this.prefillInfo(this.prefilled)
      }
    },
    title (value) {
      if (value !== null && value !== '' && value !== ' ') {
        this.titleValid = true
      }
    },
    reminderType (value) {
      if (value !== null) {
        this.typeValid = true
      }
      this.addClinic = false
    },
    prefilled (value) {
      if (value) {
        this.prefillInfo(value)
      }
    }
  },
  methods: {
    onRepeatFrequency (frequency) {
      this.repeatInfo.frequency = frequency
      console.log(frequency)
    },
    onRepeatType (type) {
      this.repeatInfo.type = type
      console.log(type)
    },
    triggerErrorModal (status) {
      this.errorModal = status
    },
    onFilter (val, update) {
      if (val === '' || val === ' ') {
        update()
        console.log(this.vetOptions)
        return
      }

      if (val.length > 2) {
        const needle = val.toLowerCase()
        this.getVets(needle, update)
      } else {
        if (update) {
          update()
        }
      }
    },
    onVetSelected (vetInfo) {
      this.$refs['clinic-selection'].blur()
      this.vetInfo.name = vetInfo.name
      this.vetInfo.contact = vetInfo.contact
      this.vetInfo.address = vetInfo.address
      this.displayVetInfo = true
    },
    getVets (filterByName = null, update) {
      this.$axios.get(`vets${filterByName !== null ? `?name=${encodeURI(filterByName)}&` : '?'}per_page=6&page=1`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status === 204) {
          this.vetOptions = []
        } else {
          this.vetOptions = response.data.vetsInfo.items
        }
      }).catch(e => {
        console.error(e)
        if (e.response && e.response.data) {
          this.$q.dialog({
            title: this.$t('requests.error.title'),
            message: e.response.data.message
          })
        }
      }).finally(_ => {
        if (update) {
          update()
        }
      })
    },
    prefillInfo (info) {
      switch (info.type) {
        case 1:
          this.reminderType = {
            label: this.$t('vaccine'),
            value: 1
          }
          break
        case 2:
          this.reminderType = {
            label: this.$t('birthday'),
            value: 2
          }
          break
        case 3:
          this.reminderType = {
            label: this.$t('appointments'),
            value: 3
          }
          break
        case 4:
          this.reminderType = {
            label: this.$t('other'),
            value: 4
          }
          break
        case 5:
          this.reminderType = {
            label: this.$t('flea'),
            value: 5
          }
          break
      }
      this.title = info.title
    },
    onClose () {
      this.$emit('on-close', false)
    },
    checkValid () {
      this.titleValid = true
      this.typeValid = true
      this.vetInfoValid = true
      this.imageValid = true

      if (this.loader) {
        this.triggerErrorModal(true)
      }

      if (this.vetInfo.selected === 'create' && (this.vetInfo.name === null || this.vetInfo.name === '' || this.vetInfo.name === ' ' || this.vetInfo.contact === null || this.vetInfo.contact === '' || this.vetInfo.name === ' ' || this.vetInfo.address === null || this.vetInfo.address === '' || this.vetInfo.address === ' ')) {
        this.vetInfoValid = false
      }

      if (this.reminderType === null) {
        this.typeValid = false
      }

      // if (this.reminderType.value === 1 && this.vaccineImage === null) {
      //   this.imageValid = false
      // }

      if (this.title === null || this.title === '' || this.title === ' ' || this.title === '  ' || this.title === '   ') {
        this.titleValid = false
      }

      // if both valid then submit to save
      if (this.titleValid && this.typeValid && this.vetInfoValid && this.imageValid && !this.loader) {
        this.onSave()
      }
    },
    onSave () {
      // convert local time to UTC
      let parseToUTC = moment(this.reminderDate, 'DD-MM-YYYY').utc().format()

      let isMonthly = 0
      let isYearly = 0
      if (this.repeatInfo.type) {
        switch (this.repeatInfo.type.value) {
          case 2: this.repeatInfo.frequency = this.repeatInfo.frequency * 7; break
          case 3: isMonthly = 1; break
          case 4: isYearly = 1; break
        }
      } else if (this.reminderType.value === 1) {
        isYearly = 1
      }

      let reminderInfo = {
        personalItemId: this.$route.params.petId,
        title: this.title,
        startDateTime: parseToUTC,
        endDateTime: '',
        type: this.reminderType.value,
        isMonthly: isMonthly,
        isYearly: isYearly,
        reminderDescription: '',
        schedule: this.repeatInfo.frequency
      }

      // schedule
      if (this.repeatInfo.type === 1) {
        // daily
        reminderInfo.schedule = '1'
      } else if (this.repeatInfo.type === 2) {
        // weekly
        reminderInfo.schedule = '7'
      }

      if (this.reminderType.value === 1 && this.imageInfo) {
        reminderInfo.mediaInfo = {
          fileName: this.imageInfo.fileName,
          contentType: this.imageInfo.contentType
        }
      }

      if (this.vetInfo.selected === 'create') {
        reminderInfo.vetInfo = {
          name: this.vetInfo.name,
          contact: this.vetInfo.contact,
          address: this.vetInfo.address
        }
      } else if (this.vetInfo.selected && this.vetInfo.selected.id) {
        reminderInfo.vetInfo = {
          id: this.vetInfo.selected.id,
          name: this.vetInfo.name,
          contact: this.vetInfo.contact,
          address: this.vetInfo.address
        }
      }

      this.$emit('on-add-reminder', reminderInfo)
    },
    uploadImageData (imageBlobData) {
      let vm = this
      this.loader = true
      let formData = new FormData()
      formData.append('imagefile', imageBlobData, 'image.jpg')
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
    }
  }
}
</script>
<style lang="stylus">
.uploaded-images
  object-fit: cover

.add-reminder-title
  margin-left: 12%
  font-size: 18px

@media screen and (min-width: 320px)
  .add-reminder-title
    margin-left: 16%

@media screen and (min-width: 350px)
  .add-reminder-title
    margin-left: 22%

@media screen and (min-width: 370px)
  .add-reminder-title
    margin-left: 24%

@media screen and (min-width: 400px)
  .add-reminder-title
    margin-left: 26%

@media screen and (min-width: 530px)
  .add-reminder-title
    margin-left: 17%
</style>
