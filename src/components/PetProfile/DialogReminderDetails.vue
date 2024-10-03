<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" :persistent="$q.platform.is.mobile" transition-show="slide-left" transition-hide="slide-right">
        <q-card>
            <q-toolbar style="z-index: 5000;" class="borderline">
                <q-btn flat dense v-close-popup icon="chevron_left" size="1.3em"></q-btn>
                <q-toolbar-title v-close-popup >
                    <h6 class="q-my-none reminder-title">{{$t('reminder')}}</h6>
                </q-toolbar-title>
                <q-btn icon="delete" flat dense class="text-negative" @click="onRemove"></q-btn>
            </q-toolbar>

            <q-card-section class="justify-center">
                <q-select disable v-model="reminderType" :error="!typeValid" hide-bottom-space :options="options" :label="$t('reminder.type')" borderless class="input q-my-md"></q-select>
                <q-input v-model="title" :error="!titleValid" hide-bottom-space :label="$t('title')" borderless class="input q-my-md"></q-input>
                <q-input class="input col-md-12 col-xs-12" readonly v-model="reminderDate" @click.native="$refs.qDate.show()" label="Date" borderless>
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer" style="margin-right: 10px;">
                        <q-dialog ref="qDate" transition-show="scale" transition-hide="scale">
                          <q-date class="full-width" @input="$refs.qDate.hide()" v-model="reminderDate" mask="DD-MM-YYYY"></q-date>
                        </q-dialog>
                      </q-icon>
                    </template>
                </q-input>
            </q-card-section>

            <!-- Vaccine Sticker Picture -->
            <q-card-section class="justify-center" v-if="reminderType && reminderType.value === 1">
              <!-- Show Image -->
              <q-card flat bordered style="border-radius: 11px;" v-if="imageInfo" @click="$refs.lightbox.showImage(0)">
                <img :src="imageInfo.filePath" height="110px" class="image-upload"/>
              </q-card>

              <!-- Upload Image -->
              <q-input
                v-else
                type="file"
                stack-label
                v-model="vaccineImage"
                @change="imageUpload"
                accept=".jpg,.jpeg,.png"
                label="Upload Vaccine Sticker Image Here (Optional)"
                borderless
                class="input q-mt-none q-mb-md"
                hide-bottom-space>
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
              </q-input>
            </q-card-section>

            <!-- Vet Info -->
            <q-card-section class="justify-center" v-if="reminderType && reminderType.value === 1">
              <h6 class="q-my-none">Clinic Info</h6>
              <q-input v-model="vetInfo.name" readonly hide-bottom-space label="Clinic Name" borderless class="input q-my-md"></q-input>
              <q-input v-model="vetInfo.contact" readonly hide-bottom-space label="Clinic Contact Number" borderless class="input q-my-md"></q-input>
              <q-input v-model="vetInfo.address" readonly hide-bottom-space label="Clinic Address" borderless class="input q-my-md"></q-input>
            </q-card-section>

            <!-- Repeat Intervals -->
            <q-card-section class="justify-center" v-if="reminderType && (reminderType.value === 5 || reminderType.value === 4)">
              <h6 class="q-my-none">Repeat Intervals</h6>
              <q-select v-model="repeatInfo.type" transition-show="jump-down" transition-hide="jump-up" behavior="menu" :error="!typeValid" hide-bottom-space :options="repeatType" label="Repeat Type" borderless class="input q-my-md"></q-select>
              <q-input v-model="repeatInfo.frequency" :type="$q.platform.is.desktop ? 'number' : 'tel'" :error="!typeValid" hide-bottom-space label="Repeat Every" borderless class="input q-my-md"></q-input>
            </q-card-section>

            <!-- Bottom Button will appear on mobile screen -->
            <div class="row text-center fixed-bottom">
                <div class="col-xs-12 lt-lg" @click="checkValid">
                    <div class="full-width text-white q-pa-md bg-primary cursor-pointer" v-ripple style="height: 70px;z-index:6000;">
                        <p v-if="!saveLoading" class="text-weight-bold font-title" style="margin-top: 5px;">{{$t('button.save')}}</p>
                        <span v-else>
                            <q-spinner size="3em"></q-spinner>
                        </span>
                    </div>
                </div>
            </div>
        </q-card>

        <!-- Light Box Image -->
        <LightBox
          v-if="lightBoxImages.length > 0"
          :media="lightBoxImages"
          ref="lightbox"
          :show-caption="false"
          :show-light-box="false"
        ></LightBox>
      </q-dialog>
</template>
<script>
import ImageTools from 'assets/ImageTools.js'
import ImageUploadMixin from '../../mixins/imageUploadMixin.js'
import LightBox from 'vue-image-lightbox'
import moment from 'moment'
export default {
  mixins: [ImageUploadMixin],
  components: {
    LightBox
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
    },
    saveLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modal: false,
      reminderType: null,
      title: null,
      date: null,
      MOMENT: moment,
      reminderDate: moment().local().format('DD-MM-YYYY'),
      options: [
        {label: this.$t('vaccine'), value: 1},
        // {label: this.$t('birthday'), value: 2},
        // {label: this.$t('appointments'), value: 3},
        {label: this.$t('other'), value: 4},
        {label: this.$t('flea'), value: 5}
      ],
      repeatType: [
        {label: 'Daily', value: 1},
        {label: 'Weekly', value: 2},
        {label: 'Monthly', value: 3},
        {label: 'Yearly', value: 4}
      ],
      titleValid: true,
      typeValid: true,
      id: null,
      repeatInfo: {
        type: null,
        frequency: null
      },
      vetInfo: {
        id: null,
        name: null,
        contact: null,
        address: null
      },
      vaccineImage: null,
      imageInfo: null,
      lightBoxImages: []
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)

      if (value === false) {
        this.reminderType = null
        this.title = null
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
    },
    prefilled (value) {
      if (value) {
        this.prefillInfo(value)
      }
    }
  },
  methods: {
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
      this.id = info.id
      this.imageInfo = info.mediaInfo
      this.lightBoxImages = []

      if (info.vetInfo) {
        this.vetInfo.name = info.vetInfo.name
        this.vetInfo.contact = info.vetInfo.contact
        this.vetInfo.address = info.vetInfo.address
      }

      if (info.isYearly) {
        this.repeatInfo.frequency = info.schedule
        this.repeatInfo.type = {label: 'Yearly', value: 4}
      } else if (info.isMonthly) {
        this.repeatInfo.frequency = info.schedule
        this.repeatInfo.type = {label: 'Monthly', value: 3}
      } else if (info.isWeekly) {
        this.repeatInfo.frequency = info.schedule
        this.repeatInfo.type = {label: 'Weekly', value: 2}
      } else if (info.schedule % 7 === 0) {
        this.repeatInfo.frequency = info.schedule / 7
        this.repeatInfo.type = {label: 'Weekly', value: 2}
      } else {
        this.repeatInfo.frequency = info.schedule
        this.repeatInfo.type = {label: 'Daily', value: 1}
      }

      // insert into light box images
      if (this.imageInfo) {
        this.lightBoxImages.push({
          'src': this.imageInfo.filePath,
          'thumb': this.imageInfo.filePath
        })
      }
      this.reminderDate = moment(info.nextReminderDatetime).local().format('DD-MM-YYYY')
    },
    onRemove () {
      this.$emit('on-remove')
      this.onClose()
    },
    onClose () {
      this.$emit('on-close', false)
    },
    checkValid () {
      if (this.reminderType === null) {
        this.typeValid = false
      }

      if (this.title === null || this.title === '' || this.title === ' ' || this.title === '  ' || this.title === '   ') {
        this.titleValid = false
      }

      // if both valid then submit to save
      if (this.titleValid && this.typeValid) {
        this.onSave()
      }
    },
    onSave () {
      // convert local time to UTC
      let parseToUTC = moment(this.reminderDate, 'DD-MM-YYYY').utc().format()

      let reminderInfo = {
        personalItemId: this.$route.params.petId,
        title: this.title,
        startDateTime: parseToUTC,
        endDateTime: '',
        type: this.reminderType.value,
        isWeekly: this.repeatInfo.type.value === 2 ? 1 : 0,
        isMonthly: this.repeatInfo.type.value === 3 ? 1 : 0,
        isYearly: this.repeatInfo.type.value === 4 ? 1 : this.reminderType.value === 1 ? 1 : 0,
        reminderDescription: '',
        schedule: this.repeatInfo.frequency
      }

      // schedule
      if (this.repeatInfo.type.value === 1) {
        // daily
        // reminderInfo.schedule = '1'
        reminderInfo.schedule = 1 * reminderInfo.schedule
      } else if (this.repeatInfo.type.value === 2) {
        // weekly
        // reminderInfo.schedule = '7'
        reminderInfo.schedule = 7 * reminderInfo.schedule
      }

      if (this.reminderType.value === 1 && this.imageInfo) {
        reminderInfo.mediaInfo = {
          fileName: this.imageInfo.fileName,
          contentType: 'image'
        }
      }

      if (this.vetInfo.id) {
        reminderInfo.vetInfo = {
          id: this.vetInfo.id,
          name: this.vetInfo.name,
          contact: this.vetInfo.name,
          address: this.vetInfo.address
        }
      }

      this.$emit('on-save', reminderInfo)
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

.reminder-title
  margin-left: 12%
  font-size: 18px

@media screen and (min-width: 320px)
  .reminder-title
    margin-left: 16%

@media screen and (min-width: 350px)
  .reminder-title
    margin-left: 22%

@media screen and (min-width: 370px)
  .reminder-title
    margin-left: 29%

@media screen and (min-width: 400px)
  .reminder-title
    margin-left: 34%

@media screen and (min-width: 530px)
  .reminder-title
    margin-left: 17%
</style>
