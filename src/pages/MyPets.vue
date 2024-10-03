<template>
  <q-page class="row scroll listing-content justify-center" padding>
    <div class="col-xs-12 col-md-9 col-xl-6 q-mb-xl">
      <div v-if="personalItemsLoader" class="col-md-12 col-xs-11 text-center">
        <ComponentPreLoader></ComponentPreLoader>
      </div>
      <div v-else>
        <q-linear-progress :value="percentage" style="display: none;" class="q-mt-md primary progress margin-auto progress-on-top fixed-top"></q-linear-progress>
        <div v-if="count === -2" class="row">
          <q-card v-for="(pet, index) in personalItems" :key="index" :ref="index"  class="col-xs-5 col-md-2 q-mt-md justify-center pet-card" @click="$router.push({name: 'PetProfile', params: {'petId': pet.ID}})" style="margin-left: 20px;">
            <q-img :src="getImgSrc(pet.image, count, pet.title)" :class="$q.platform.is.desktop ? 'petImgDesktop' : 'petImg'" placeholder-src="statics/images/graphic-placeholder.jpg" basic></q-img>
            <q-card-section class="item-content cursor-pointer text-center q-px-xs q-py-sm">
              <p class="font-normal text-weight-bold q-mb-xs">
  {{  pet.name  || pet.breed  }}
</p>
<p v-if="pet.name && pet.breed && pet.name !== pet.breed" class="text-label font-small text-weight-light q-mb-xs" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
  {{ pet.breed }}
</p>
<p v-else class="text-label font-small text-weight-light q-mb-xs" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
  {{ pet.type }}
</p>

            </q-card-section>
          </q-card>
          <q-card ref="-1" class="col-xs-5 col-md-2 q-mt-md justify-center pet-card" @click="select($event, -1)" style="margin-left: 20px;">
            <q-img src="statics/images/pets/add-pet.jpg" :class="$q.platform.is.desktop ? 'petImgDesktop' : 'petImg'" placeholder-src="statics/images/graphic-placeholder.jpg" basic>
              <q-spinner v-if="createPetLoader" size="xl" style="position: absolute;left: 36%;top: 34%;" color="white"></q-spinner>
            </q-img>
            <q-card-section class="item-content cursor-pointer text-center q-px-xs q-py-sm">
              <p class="font-normal text-weight-bold q-mb-xs">{{$t('add.another.pet')}}</p>
              <p class="text-label font-small text-weight-light q-mb-xs" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{$t('add.another.pet.tap.here')}}</p>
            </q-card-section>
          </q-card>
        </div>
        <div v-else class="q-pb-xl">
          <div v-for="(question, num) in petForm" :key="question.questionId">
            <div v-if="(question.type === 'label') && (num === count)" class="q-mb-md text-weight-bold font-title" style="margin-top: 20px; margin-left: 18px;">
              {{ question.content }}
              <p v-if="question.contentDescription" style="font-weight: normal;" class="q-pr-md q-mt-sm font-normal">{{question.contentDescription}}</p>
              <span class="strong emphasize" v-if="String(question.required) !== '1'">({{ $t('optional') }})</span>
            </div>
            <div v-if="question.type !== 'label' && num === count + 1" class="form-container">
              <div v-if="question.questionId === 4" class="row">
                <q-card v-for="(option, index) in questionToArray(question.content)" :ref="option.value" :key="index" :class="checkSelect(option.value, question) ? 'picked' : '' " class="col-xs-5 col-md-2 q-mt-lg justify-center" @click="select($event, option, question)" style="margin-left: 20px;">
                  <q-img :src="getImgSrc(option.label, index, false)" :class="$q.platform.is.desktop ? 'petImgDesktop' : 'petImg'" placeholder-src="statics/images/graphic-placeholder.jpg" basic></q-img>
                  <q-card-section class="item-content cursor-pointer text-center">
                    <label :for="option.value" class="font-normal text-weight-bold">{{ option.label }}</label>
                  </q-card-section>
                </q-card>
              </div>
              <div v-else-if="question.questionId === 6" class="row form-container">
                <q-input class="input col-md-12 col-xs-11" v-model="userSearch" placeholder="Search pet breed here" borderless dense style="min-width: 88%;margin-bottom: 30px; margin-left: 15px; margin-right: 15px;"></q-input>
                <div class="col-md-12 col-xs-12 text-center" v-if="breedLoading">
                  <ComponentPreLoader></ComponentPreLoader>
                </div>
                <q-card v-else v-for="option in filteredBreeds" :key="option.id" :ref="option.name" square class="col-md-12 col-xs-11" :class="checkSelect(option.name, question) ? 'picked' : '' " @click="select($event, option.name, question)" style="margin-left: 15px; margin-right: 15px;">
                  <q-card-section >
                    {{option.name}}
                  </q-card-section>
                  <q-separator />
                </q-card >
              </div>
              <!-- <div v-else-if="question.questionId === 8" class="row">
                <q-card v-for="(option, index) in questionToArray(question.content)" :key="option.value" :ref="option.value" :class="checkSelect(option.value, question) ? 'picked' : '' " class="col-md-2 col-xs-5 q-mt-lg justify-center" @click="select($event, option.value, question)" style="margin-left: 20px;">
                  <q-img :src="getPetSizeImg(index)" :class="$q.platform.is.desktop ? 'petImgDesktop' : 'petImg'" placeholder-src="statics/images/graphic-placeholder.jpg" basic></q-img>
                  <q-card-section class="item-content cursor-pointer text-center">
                    <label :for="option.value" class="font-normal text-weight-bold">{{ option.label }}</label>
                  </q-card-section>
                </q-card>
              </div> -->
              <div v-else-if="question.type === 'inputBox'" class="row" style="margin-left: 4%;">
                <q-input v-model="question.reply" :placeholder="question.content" class="col-xs-11 col-md-12 input" :input-class="{'text-grey-6': question.reply === null || question.reply === ''}" borderless dense hide-bottom-space></q-input>
              </div>
              <div v-else-if="question.type === 'radioButtonSelector' || question.type === 'radioSelector'" class="row">
                <q-card v-for="(option, index) in questionToArray(question.content)" :ref="option.value" :key="index" :class="checkSelect(option.value, question) ? 'picked' : '' " class="col-xs-5 col-md-2 q-mt-lg justify-center" @click="select($event, option.value, question)" style="margin-left: 20px;">
                  <!--<img :src="getImgSrc(option.label, question.questionId)">-->
                  <q-card-section class="item-content cursor-pointer text-center">
                    <label :for="option" style="font-size: 16px" class="text-weight-bold">{{ option.label }}</label>
                    <q-badge floating v-if="checkSelect(option, question)" color="none" outline style="border: none;top: -10px; right: -10px;">
                      <q-icon name="fas fa-check-circle" size="sm" class="text-primary"></q-icon>
                    </q-badge>
                  </q-card-section>
                </q-card>
              </div>
              <div v-else-if="question.type === 'checkBoxSelector'" class="row form-container">
                <q-card v-for="(option) in questionToArray(question.content)" :key="option.value" :ref="option.value" square class="col-md-12 col-xs-11" :class="checkSelect(option.value, question) ? 'picked' : '' " @click="select($event, option.value, question)" style="margin-left: 15px; margin-right: 15px;">
                  <q-card-section >
                    {{option.label}}
                  </q-card-section>
                  <q-separator />
                </q-card >
              </div>
              <div v-else-if="question.type === 'dateSelector'" class="row">
                  <q-input class="input col-md-12 col-xs-11" readonly v-model="petInfo.birthdate" @click.native="$refs.qDate[0].show()" borderless dense style="margin-left: 18px;">
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer q-pa-sm">
                        <q-dialog ref="qDate" transition-show="scale" transition-hide="scale" style="max-height: 50vh;">
                          <q-date class="full-width" v-model="petInfo.birthdate" :options="checkDate" mask="YYYY-MM-DD" @input="onCheckError(num)"></q-date>
                        </q-dialog>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              <div v-else-if="question.type === 'imageSelector'" class="row" style="margin-left: 4%;">
                <!-- <div class="col-12">
                  <q-btn :label="$t('button.uploadimage')" :loading="imageUploadLoader" @click="onFileSelection" color="primary" class="q-px-md text-capitalize"></q-btn>
                </div>
                <input type="file" disable @change="imageUpload" multiple accept=".jpg,.jpeg,.png" ref="selectedFile" style="display: none;">
                <div class="row justify-center q-px-sm q-mt-md">
                  <q-card v-for="(image, index) in petInfo.media" :key="image.id" style="height:110px;max-height: 110px;width: 110px;max-width: 110px;" class="col-xs-3 q-ma-xs">
                      <q-img :src="image.filePath"
                        class="responsive uploaded-images"
                        style="object-fit: cover;height: 100%;width: 100%;"
                        v-if="image.contentType === 'image'"
                      ><q-icon name="fas fa-times-circle" color="red" size="25px" class="q-pa-sm" @click="onRemove(index)"></q-icon></q-img>
                  </q-card>
                </div> -->
                <div class="col-12">
                  <photo-gallery :media="petInfo.media"
                    @on-image-upload="onImageUploaded"
                    :showDeleteOption="showDeleteOption"
                    @on-remove-image="removeImageUploaded"></photo-gallery>
                </div>
              </div>
              <div v-else-if="question.type === 'vetSelector'" class="q-mx-md">
                <div class="justify-center">
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
                  :loading="loading"
                  @input="onVetSelected"
                  v-if="vetInfo.selected !== 'create'"
                  :error="!vetInfoValid && !vetInfo.selected"
                  behavior="menu"
                  borderless
                  class="input q-my-md"
                  hide-bottom-space>
                    <template v-slot:no-option>
                      <q-item clickable @click="onAddClinic">
                        <q-item-section class="text-grey">
                          No results. Click Here to Add Clinic.
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <!-- Vet Info -->
                <div class="justify-center q-mb-xl" v-if="addClinic || displayVetInfo">
                  <h6 class="q-my-none">Clinic Info</h6>
                  <q-input autofocus :readonly="displayVetInfo" v-model="vetInfo.name" :error="!vetInfoValid && !vetInfo.name" hide-bottom-space label="Clinic Name" borderless class="input q-my-md"></q-input>
                  <q-input v-model="vetInfo.contact" :readonly="displayVetInfo" :error="!vetInfoValid && !vetInfo.contact" :type="$q.platform.is.desktop ? 'number' : 'tel'" hide-bottom-space label="Clinic Contact Number" borderless class="input q-my-md"></q-input>
                  <q-input type="textarea" v-model="vetInfo.address" :readonly="displayVetInfo" :error="!vetInfoValid && !vetInfo.address" hide-bottom-space label="Clinic Address" borderless class="input q-my-md"></q-input>
                </div>
              </div>
            </div>
          </div>
          <p class="text-red text-italic text-bold q-my-md q-ml-md" v-if="error">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- BUTTON BOTTOM will appear on mobile screen -->
    <div class="row text-center fixed-bottom lt-lg" v-if="isEditRequestLoaded">
      <div class="col-xs-12" v-if="count === (petForm.length - 2)" :disabled="createPetLoader" @click="nextButtonClick">
        <div class="full-width z999 text-white q-pa-md bg-primary cursor-pointer font-header-title-large" :class="{'q-pb-lg': $q.platform.is.cordova}">
          <span v-if="!createPetLoader">{{ $t('button.submit') }}</span>
          <span v-else><q-spinner></q-spinner></span>
        </div>
      </div>
      <div class="col-xs-12" v-else-if="count < (petForm.length - 2)" @click="nextButtonClick" >
        <div class="full-width z999 text-white q-pa-md bg-primary cursor-pointer font-header-title-large" :class="{'custom-disabled' : !listCheck, 'q-pb-lg': $q.platform.is.cordova}">{{ $t('button.next') }}</div>
      </div>
    </div>
  </q-page>
</template>

<script>
/* eslint-disable no-eval */
/* eslint-disable no-useless-escape */
/* eslint-disable vue/no-side-effects-in-computed-properties */
/* eslint-disable vue/no-async-in-computed-properties */
import ImageUploadMixin from '../mixins/imageUploadMixin.js'
import moment from 'moment'
export default {
  mixins: [ImageUploadMixin],
  components: {
    'photo-gallery': () => import('components/CreateListing/PhotoGallery.vue')
  },
  data () {
    return {
      displayError: false,
      isEditRequestLoaded: false,
      questionLists: [],
      user: null,
      count: -2,
      listCheck: false,
      showLoading: false,
      showDeleteOption: true,
      petInfo: {
        ID: null,
        type: null,
        weight: null,
        breed: null,
        gender: null,
        vetInfo: null,
        image: null,
        media: [],
        name: null,
        otherInformations: [],
        birthdate: 'Click to select date'
      },
      QUESTION_PET_TYPE_ID: [4, 104],
      petType: this.$route.query['pet-type[]'] || null,
      petLists: null,
      petBreeds: [],
      personalItems: [],
      selectedPets: [],
      breedLoading: true,
      dateError: false,
      requestLists: null,
      newPetCount: 0, // keep track of new pets created
      personalItemsLoader: false,
      petForm: null,
      oriPetForm: null,
      userSearch: '',
      petTypeInfo: null,
      createPetLoader: false,
      error: false,
      imageUploadLoader: false,
      vetInfoValid: true,
      vetInfo: {
        id: null,
        selected: null,
        name: null,
        contact: null,
        address: null
      },
      loader: false,
      addClinic: false,
      vetOptions: [],
      displayVetInfo: false,
      errorModal: false,
      saveLoading: false,
      loading: false
    }
  },
  created () {
    this.getPersonalItems()
    if (this.$store.getters['cached/getPersonalItemsCached'] && this.$store.getters['cached/getPersonalItemsCached'].items && this.$store.getters['cached/getPersonalItemsCached'].items.length === 0) {
      this.count = 0
      this.isEditRequestLoaded = true
    } else {
      this.count = -2
    }
  },
  mounted () {
    history.pushState(null, null, location.href)
    // detect browser back button
    window.addEventListener('popstate', this.backButtonDetected, false)

    // listen to ImageUploadMixin callback (image processing)
    this.$on('image-data', this.uploadImageData)
  },
  beforeDestroy () {
    window.removeEventListener('popstate', this.backButtonDetected)

    this.$off('image-data')
  },
  computed: {
    percentage () {
      if (this.petForm.length === 0) {
        return 0
      }

      let input = null
      if (this.count < this.petForm.length) {
        input = this.petForm[this.count + 1]
      }

      // Disable continue button until form is properly filled
      // but first check if the field is required or not
      if (input && Number(input.required) === 1) {
        if (Array.isArray(input.reply)) {
          if (input.reply.length < 1) {
            this.listCheck = false
          } else {
            this.listCheck = true
          }
        } else if (input.type === 'imageSelector') {
          if (this.petInfo.media.length < 1) {
            this.listCheck = false
          } else {
            this.listCheck = true
          }
        } else if (input.type === 'numberBox' && (parseInt(input.reply) < 1 || parseInt(input.reply) > 356)) {
          this.listCheck = false
        } else if (!input.reply) {
          this.listCheck = false
        } else {
          this.listCheck = true
        }
      } else {
        this.listCheck = true
      }
      this.error = false

      // return percentage
      if (this.count === -2) {
        this.$emit('percentage', 0)
        return 0
      }

      //  return to navbar
      this.$emit('percentage', (this.count / (this.petForm.length)))

      return (this.count / (this.petForm.length))
    },
    filteredBreeds () {
      var search = this.userSearch.toLowerCase()
      return this.petBreeds.filter(function (breed) {
        return breed.name.toLowerCase().includes(search)
      })
    }
  },
  methods: {
    checkDate (serviceStart) {
      return moment(serviceStart).format('YYYY-MM-DD') <= moment(this.today).format('YYYY-MM-DD')
    },
    onAddClinic () {
      this.$refs['clinic-selection'][0].$el.blur()
      this.vetInfoValid = true
      this.vetInfo.selected = 'create'
      this.vetInfo.name = null
      this.vetInfo.contact = null
      this.vetInfo.address = null
      this.displayVetInfo = false
      this.addClinic = true
    },
    onFilter (val, update) {
      if (val === '' || val === ' ') {
        update()
        return
      }

      if (val.length > 2) {
        this.getVets(val.toLowerCase(), update)
      } else {
        if (update) {
          update()
        }
      }
    },
    onVetSelected (vetInfo) {
      this.vetInfoValid = true
      this.$refs['clinic-selection'][0].$el.blur()
      this.vetInfo.name = vetInfo.name
      this.vetInfo.contact = vetInfo.contact
      this.vetInfo.address = vetInfo.address
      this.displayVetInfo = true
    },
    getVets (filterByName = null, update) {
      this.loading = true
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
        console.log(e)
        if (e.response && e.response.data) {
          this.$q.dialog({
            title: this.$t('requests.error.title'),
            message: e.response.data.message
          })
        }
      }).finally(_ => {
        this.loading = false
        if (update) {
          update()
        }
      })
    },
    // onClose () {
    //   this.modal = false
    //   this.$emit('on-close', false)

    //   this.vetInfo.name = null
    //   this.vetInfo.selected = null
    //   this.vetInfo.contact = null
    //   this.vetInfo.address = null
    //   this.displayVetInfo = false
    //   this.addClinic = false
    // },
    checkValid () {
      this.vetInfoValid = true

      if (this.loader) {
        this.triggerErrorModal(true)
      }

      if (this.vetInfo.selected === 'create' && (this.vetInfo.name === null || this.vetInfo.name === '' || this.vetInfo.name === ' ' || this.vetInfo.contact === null || this.vetInfo.contact === '' || this.vetInfo.name === ' ' || this.vetInfo.address === null || this.vetInfo.address === '' || this.vetInfo.address === ' ')) {
        this.vetInfoValid = false
      } else if (!this.vetInfo.selected) {
        this.vetInfoValid = false
      }

      // if both valid then submit to save
      if (this.vetInfoValid && !this.loader) {
        this.onSave()
      }
    },
    onSave () {
      let vetInfo = {
        name: null,
        contact: null,
        address: null
      }

      if (this.vetInfo.selected === 'create') {
        vetInfo = {
          name: this.vetInfo.name,
          contact: this.vetInfo.contact,
          address: this.vetInfo.address
        }
      } else if (this.vetInfo.selected && this.vetInfo.selected.id) {
        vetInfo = {
          id: this.vetInfo.selected.id,
          name: this.vetInfo.name,
          contact: this.vetInfo.contact,
          address: this.vetInfo.address
        }
      }
      this.$emit('on-add-vet', vetInfo)
    },
    onImageUploaded (imageInfo) {
      this.petInfo.media.push(imageInfo)
    },
    removeImageUploaded (index) {
      this.petInfo.media.splice(index, 1)
    },
    uploadImageData (imageBlobData) {
      let vm = this
      let formData = new FormData()
      vm.imageUploadLoader = true
      formData.append('imagefile', imageBlobData.blob, 'image.jpg')
      vm.$axios.post('imageupload', formData)
        .then((response) => {
          let mediaInfo = {
            'contentType': 'image',
            'fileName': response.data.imageName,
            'filePath': response.data.imagePath
          }
          vm.petInfo.media.push(mediaInfo)
          //  vm.$q.notify('Image successfully uploaded!')
        }).catch(e => {
          console.error(e)
          vm.$q.notify(e.response.data.message)
        }).finally(_ => {
          vm.imageUploadLoader = false
        })
    },
    onRemove (index) {
      this.petInfo.media.splice(index, 1)
    },
    onCheckError (index) {
      let questionLists = this.petForm
      if (questionLists[index].type === 'dateSelector') {
        this.$refs.qDate[0].hide()
      }
    },
    nextButtonClick () {
      console.log('Check the count', this.count)
      if (this.listCheck) {
        if (this.count === 0) {
          this.isEditRequestLoaded = false
          this.petInfo.name = this.petForm[1].reply
        } else if (this.count === 4 || this.count === 6) {
          this.isEditRequestLoaded = false
        } else if (this.count === 12) {
          //  this.petInfo.weight = value
          this.petInfo.ID = this.newPetCount

          console.log('check the other info in create', this.petForm[13].reply)
          this.petInfo.otherInformations = this.petForm[13].reply
          if (this.petForm[13].reply === undefined) {
            this.petInfo.otherInformations = []
          }
        } else if (this.count === 16) {
          if (this.vetInfo.name === null || this.vetInfo.name === '' || this.vetInfo.name === ' ' || this.vetInfo.contact === null || this.vetInfo.contact === '' || this.vetInfo.name === ' ' || this.vetInfo.address === null || this.vetInfo.address === '' || this.vetInfo.address === ' ') {
            this.petInfo.vetInfo = null
          } else {
            this.petInfo.vetInfo = this.vetInfo
          }

          //  new instance of a pet
          let pet = {
            ID: null,
            type: null,
            weight: null,
            breed: null,
            gender: null,
            vetInfo: null,
            image: null,
            media: [],
            name: null,
            otherInformations: [],
            birthdate: moment().format('YYYY-MM-DD')
          }

          //  duplicate info and push to display
          Object.assign(pet, this.petInfo)
          this.createNewPet(pet)

          // reset create pet form
          this.petForm = this.oriPetForm
        }

        if (this.count < (this.petForm.length - 2)) {
          this.count = this.count + 2
          this.$emit('current-count', this.count)
        }

        // scroll to top
        window.scrollTo(0, 0)
      } else {
        this.errorCheck()
      }
    },
    errorCheck () {
      // If no error occur then hide error text
      if (this.listCheck) {
        this.error = false
        return
      }

      let input = this.petForm[this.count + 1]
      let errorMessage = {
        'personalItemSelector': 'form.request.error.required.personal.items',
        'inputBox': 'form.request.error.required',
        'location': 'form.request.error.required.location',
        'checkBoxSelector': 'form.request.error.required.checkbox',
        'radioButtonSelector': 'form.request.error.required.radio',
        'numberBox': 'form.request.error.number.emphasize',
        'dateSelector': 'form.request.date.greater.than.a.year',
        'imageSelector': 'upload.one.photo.to.proceed'
      }

      if (Number(input.required) === 1) {
        if (this.dateError) {
          this.error = this.$t('please.select.a.date.in.the.future')
        } else {
          this.error = this.$t(errorMessage[input.type])
        }

        //  this.triggerPromptDialog(true, this.error, null, this.$t('dismiss'))
      }
    },
    backButtonDetected (event) {
      if (event.state) {
        history.pushState(null, null, location.href)
      }

      if (this.count === -2) {
        this.$router.replace({name: 'MobileDashboard'})
      } else {
        if (this.count === 0 || this.count === 6 || this.count === 10) {
          this.isEditRequestLoaded = false
        } else if (this.count === 2 || this.count === 8) {
          this.isEditRequestLoaded = true
        }

        this.count -= 2
      }
    },
    createNewPet (petDetails) {
      console.log('check the deatisl coming into new pet', petDetails)
      this.createPetLoader = true

      //  new pet
      let petDescription = JSON.stringify(this.createFormConversion(petDetails))
      let newPetForm = {
        'personalItemsInfo': {
          'title': petDetails.name,
          'itemDescription': petDescription,
          'media': this.petInfo.media
        }
      }

      this.$axios.post(`users/${this.$store.state.user.uuid}/personal-items?v=8`, newPetForm, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        //  new instance of a pet
        /* let pet = {
          ID: null,
          type: null,
          weight: null,
          breed: null,
          image: null
        } */
        let pet = {
          ID: null,
          type: null,
          weight: null,
          breed: null,
          gender: null,
          vetInfo: null,
          image: null,
          media: [],
          name: null,
          otherInformations: [],
          birthdate: moment().format('YYYY-MM-DD')
        }

        //  duplicate info and push to display
        Object.assign(pet, this.petInfo)
        pet.ID = response.data.wallInfo.personalItemId
        pet.title = response.data.wallInfo.title
        if (response.data.wallInfo && response.data.wallInfo.mediaInfo) {
          pet.image = response.data.wallInfo.mediaInfo[0].filePath
        }
        this.personalItems.unshift(pet)

        let cacheInfo = {
          items: this.personalItems,
          hide: false
        }

        if (this.$store.getters['cached/getPersonalItemsCached'] && this.$store.getters['cached/getPersonalItemsCached'].hasOwnProperty('hide')) {
          cacheInfo.hide = this.$store.getters['cached/getPersonalItemsCached'].hide
        }

        // update cached
        this.$store.dispatch('cached/cachePersonalItems', cacheInfo)
      }).catch((error) => {
        console.log(error)
      }).finally(_ => {
        this.isEditRequestLoaded = false
        this.createPetLoader = false
        this.count = -2
      })
    },
    createFormConversion (petDetails) {
      let form = this.petForm

      for (var index in form) {
        if (form[index].questionId === 2) {
          form[index].reply = petDetails.name
        } else if (form[index].questionId === 4) {
          form[index].reply = petDetails.type
        } else if (form[index].questionId === 6) {
          form[index].reply = petDetails.breed
        } else if (form[index].questionId === 10) {
          form[index].reply = petDetails.gender
        } else if (form[index].questionId === 12) {
          form[index].reply = petDetails.birthdate
        } else if (form[index].questionId === 14) {
          form[index].reply = petDetails.otherInformations
        } else if (form[index].questionId === 16) {
          form[index].reply = petDetails.vetInfo
        }
      }

      return {
        'question': form
      }
    },
    getPetSizeImg (petSize) {
      let size = null
      switch (petSize) {
        case 0: size = 'xs'; break
        case 1: size = 's'; break
        case 2: size = 'md'; break
        case 3: size = 'lg'; break
        case 4: size = 'xl'; break
        default: size = 'xs'
      }

      let petType = this.petInfo.type
      switch (petType) {
        case 'Σκύλος':
        case 'Chien':
        case 'สุนัข':
        case '狗':
        case 'Perro':
          petType = 'Dog'; break
        case 'Γάτα':
        case 'Chat':
        case 'แมว':
        case '貓':
        case 'Gato':
          petType = 'Cat'; break
        case 'Κουνέλι':
        case 'Lapin':
        case 'กระต่าย':
        case '兔子':
        case 'Conejo':
          petType = 'Rabbit'; break
        case 'Ινδικό Χοιρίδιο':
        case 'Guinea Pig':
        case 'Cochon d\'Inde':
        case 'หนูตะเภา':
        case '天竺鼠':
        case 'Conejillo de indias':
          petType = 'Guinea-Pig'; break
        case 'Κουνάβι':
        case 'Furet':
        case 'เฟอเรท':
        case '雪貂':
        case 'Hurón':
          petType = 'Ferret'; break
        case 'Πουλί':
        case 'Oiseau':
        case 'นก':
        case '鸟类':
        case 'Ave':
          petType = 'Bird'; break
        case 'Ερπετό':
        case 'Reptile':
        case 'สัตว์เลื้อยคลาน':
        case '爬虫类':
        case 'Reptil':
          petType = 'Reptile'; break
        case 'Άλλο':
        case 'Autres':
        case 'อื่นๆ':
        case '其他':
        case 'Otros':
          petType = 'Others'; break
      }

      return `statics/images/pet-sizes/${petType}-${size}.png`
    },
    checkSelect (label, item) {
      // empty reply
      if (item.reply === undefined || item.reply.length === 0) {
        return false
      } else if (item.type === 'checkBoxSelector' || item.questionId === 90049 || item.questionId === 90018) {
        if (item.reply.indexOf(label) > -1) {
          return true
        }
      } else if (item.reply === label) {
        return true
      }
      return false
    },
    // Convert string to array
    questionToArray (arrayObject) {
      if (arrayObject.length === 0) {
        return
      }
      let arrayVal = null

      if (Array.isArray(arrayObject)) {
        arrayVal = arrayObject
      } else {
        // arrayVal = eval(arrayObject)
        let a = arrayObject
        a = a.replace('[\'', '')
        a = a.replace('\']', '')
        a = a.replace(/','/g, ',')
        arrayVal = a.split(',')
      }

      let newListing = []
      for (let i = 0; i < arrayVal.length; i++) {
        newListing.push({
          label: arrayVal[i],
          value: arrayVal[i],
          id: i
        })
      }
      return newListing
    },
    getLanguage () {
      let ALLOWED_LANGUAGE = [
        'en',
        'zh_cn',
        'zh_tw',
        'ptpt',
        'dede',
        'sksk',
        'eses',
        'itit',
        'jajp',
        'cscz',
        'zh_hk',
        'frfr',
        'thth',
        'idid',
        'msmy',
        'elel'
      ]

      try {
        let locale = this.$store.getters['user/getCurrentLanguage']
        if (ALLOWED_LANGUAGE.indexOf(locale) > -1) {
          return locale
        }
        return 'en'
      } catch (e) {
        if (typeof (this.$route.query.lang) !== 'undefined') {
          console.error('An error has occured when getting lang. Query Variable is ' + this.$route.query.lang + ' locale is ' + this.$store.state.user.language)
        }
        return 'en'
      }
    },
    getPersonalItems () {
      this.personalItemsLoader = true
      this.$axios.get(`users/${this.$store.state.user.uuid}/personal-items?v=8`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.petForm = JSON.parse(response.data.personalItemsInfo.questionnaire).question
        this.oriPetForm = JSON.parse(response.data.personalItemsInfo.questionnaire).question

        console.log('check the media info')

        let num = response.data.personalItemsInfo.items.length
        for (let i = 0; i < num; i++) {
          let pet = JSON.parse(response.data.personalItemsInfo.items[i].itemDescription.replace('\\', '')).question
          console.log('check the media info coming', response.data.personalItemsInfo.items[i].mediaInfo)
          console.log('check pets incoming', response.data.personalItemsInfo)
          let personalPet = {
            ID: response.data.personalItemsInfo.items[i].id,
            type: pet[3].reply,
            gender: pet[9].reply,
            weight: '',
            breed: pet[5].reply,
            image: response.data.personalItemsInfo.items[i].mediaInfo[0].filePath,
            mediaInfo: response.data.personalItemsInfo.items[i].mediaInfo,
            name: pet[1].reply,
            title: response.data.personalItemsInfo.items[i].title
          }
          this.personalItems.push(personalPet)
        }

        if (this.count === -2 && response.data.personalItemsInfo.items.length === 0) {
          this.count = 0
          this.isEditRequestLoaded = true
        }

        // update cache
        let cacheInfo = {
          items: response.data.personalItemsInfo.items,
          hide: false
        }
        if (!this.$store.getters['cached/getPersonalItemsCached']) {
          this.$store.dispatch('cached/cachePersonalItems', cacheInfo)
        } else if (JSON.stringify(response.data.personalItemsInfo.items) !== this.$store.getters['cached/getPersonalItemsCached'].items) {
          if (this.$store.getters['cached/getPersonalItemsCached'] && this.$store.getters['cached/getPersonalItemsCached'].hasOwnProperty('hide')) {
            cacheInfo.hide = this.$store.getters['cached/getPersonalItemsCached'].hide
          }

          this.$store.dispatch('cached/cachePersonalItems', cacheInfo)
        }
      }).catch((error) => {
        console.log(error)
      }).finally(_ => {
        this.personalItemsLoader = false
      })
    },
    getImgSrc (file, index, title) {
      let temp = file.split('/')
      if (temp[temp.length - 1].substr(temp[temp.length - 1].length - 4) === '.jpg' && temp[temp.length - 1] !== '.jpg' && index === -2) {
        return file
      } else {
        if (index === -2) {
          if (title) {
            // set default pet photo to pet type (local storage)
            // this happens when pet has no images uploaded
            file = title
          } else {
            index = Number(file)
          }
        }
        let src = ''
        switch (index) {
          case 0: src = 'Dog'; break
          case 1: src = 'Cat'; break
          case 2: src = 'Rabbit'; break
          case 3: src = 'Guinea Pig'; break
          case 4: src = 'Ferret'; break
          case 5: src = 'Bird'; break
          case 6: src = 'Reptile'; break
          case 7: src = 'Turtle'; break
          default: src = file
        }

        switch (src) {
          case 'Σκύλος':
          case 'Chien':
          case 'สุนัข':
          case '狗':
          case 'Perro':
            src = 'Dog'; break
          case 'Γάτα':
          case 'Chat':
          case 'แมว':
          case '貓':
          case 'Gato':
            src = 'Cat'; break
          case 'Κουνέλι':
          case 'Lapin':
          case 'กระต่าย':
          case '兔子':
          case 'Conejo':
            src = 'Rabbit'; break
          case 'Ινδικό Χοιρίδιο':
          case 'Guinea Pig':
          case 'Cochon d\'Inde':
          case 'หนูตะเภา':
          case '天竺鼠':
          case 'Conejillo de indias':
            src = 'Guinea-Pig'; break
          case 'Κουνάβι':
          case 'Furet':
          case 'เฟอเรท':
          case '雪貂':
          case 'Hurón':
            src = 'Ferret'; break
          case 'Πουλί':
          case 'Oiseau':
          case 'นก':
          case '鸟类':
          case 'Ave':
            src = 'Bird'; break
          case 'Ερπετό':
          case 'Reptile':
          case 'สัตว์เลื้อยคลาน':
          case '爬虫类':
          case 'Reptil':
            src = 'Reptile'; break
          case 'Άλλο':
          case 'Autres':
          case 'อื่นๆ':
          case '其他':
          case 'Otros':
            src = 'Others'; break
        }

        src = src.toLowerCase().replace(' ', '-')
        src = 'statics/images/pets/' + src + '.png'
        return src
      }
    },
    convertForm (questionLists) {
      // Convert questions to suite the v-for in template above
      for (let i in questionLists) {
        if (i % 2 !== 0) {
          if (questionLists[i].type === 'checkBoxSelector') {
            // If already has a reply
            if (questionLists[i].reply) {
              // If the reply is not an array
              if (questionLists[i].reply.indexOf(',') !== -1) {
                questionLists[i].reply = questionLists[i].reply.split(', ')
              } else {
                // If reply is already an array
                questionLists[i].reply = [questionLists[i].reply]
              }
            } else {
              questionLists[i].reply = []
            }
          }
        }
      }

      return questionLists
    },
    breedInfo () {
      this.breedLoading = true

      // check for pet type id
      this.petInfo.ID = this.petInfo.ID.id + 1

      this.$axios.get(`/petinfo/${this.petInfo.ID}?lang=${this.$store.getters['user/getCurrentLanguage']}`).then(response => {
        this.petBreeds = response.data.petBreedInfo.items
      }).catch(e => {
        console.error(e)
      }).finally(_ => {
        this.breedLoading = false
      })
    },
    select (event, value, item) {
      // add another pet selected
      if (value === -1) {
        window.scrollTo(0, 0)
        this.count += 2
        this.isEditRequestLoaded = true
        return
      }

      this.$refs[value.value || value][0].$el.classList.toggle('picked')
      if (item.type === 'checkBoxSelector' || item.questionId === 90049 || item.questionId === 90018) {
        // deselect (check if previously selected)
        let index = -1
        if (item.reply && item.reply.length > 0) {
          index = item.reply.indexOf(value)
        }
        if (index > -1) {
          item.reply.splice(index, 1)
        } else {
          if (!item.reply) {
            item.reply = []
          }

          item.reply.push(value)
        }
        return
      } else if (item.reply === value || ((item.reply === value.value) && value.value)) {
        item.reply = ''
        return
      } else {
        item.reply = value
      }

      if (this.$refs[value.value || value][0].$el.classList.toString().indexOf('picked') > -1) {
        // selected options
        if (item.questionId === 90049 || item.questionId === 90018) {
          item.reply.push(value)
        } else {
          if (item.questionId === 4) {
            item.reply = value.value
          } else {
            item.reply = value
          }
        }

        switch (item.questionId) {
          case 4:
            // remove existing breed when reselect pet type
            let breedSection = this.$_.findWhere(this.petForm, {'questionId': 6})
            if (breedSection.reply && breedSection.reply.length > 0) {
              breedSection.reply = ''
            }

            this.petInfo.ID = value
            this.petInfo.type = value.value
            this.petInfo.title = value.value
            this.petInfo.image = 'statics/images/pets/' + value.value + '.png'

            this.petTypeInfo = this.petInfo.type
            switch (this.petTypeInfo) {
              case 'Σκύλος':
              case 'Chien':
              case 'สุนัข':
              case '狗':
              case 'Perro':
                this.petTypeInfo = 'Dog'; break
              case 'Γάτα':
              case 'Chat':
              case 'แมว':
              case '貓':
              case 'Gato':
                this.petTypeInfo = 'Cat'; break
              case 'Κουνέλι':
              case 'Lapin':
              case 'กระต่าย':
              case '兔子':
              case 'Conejo':
                this.petTypeInfo = 'Rabbit'; break
              case 'Ινδικό Χοιρίδιο':
              case 'Guinea Pig':
              case 'Cochon d\'Inde':
              case 'หนูตะเภา':
              case '天竺鼠':
              case 'Conejillo de indias':
                this.petTypeInfo = 'Guinea-Pig'; break
              case 'Κουνάβι':
              case 'Furet':
              case 'เฟอเรท':
              case '雪貂':
              case 'Hurón':
                this.petTypeInfo = 'Ferret'; break
              case 'Πουλί':
              case 'Oiseau':
              case 'นก':
              case '鸟类':
              case 'Ave':
                this.petTypeInfo = 'Bird'; break
              case 'Ερπετό':
              case 'Reptile':
              case 'สัตว์เลื้อยคลาน':
              case '爬虫类':
              case 'Reptil':
                this.petTypeInfo = 'Reptile'; break
              case 'Άλλο':
              case 'Autres':
              case 'อื่นๆ':
              case '其他':
              case 'Otros':
                this.petTypeInfo = 'Others'; break
            }

            // load pet's breed selections
            this.breedInfo()
            break

          case 6:
            this.petInfo.breed = value
            break

          case 10:
            this.petInfo.gender = value
            break
        }

        //  go next question
        if (item.questionId < 16) {
          this.count = this.count + 2
        }

        // show next button
        if (this.count === 6 || this.count === 10) {
          this.isEditRequestLoaded = true
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.progress-on-top
  width: 225px
  z-index: 100
  height: 5px !important

.listing-content
  min-height: 285px !important
  margin-bottom: 13px

.item-content
  line-height: 13px !important
  padding: none

.petImg
  object-fit: cover
  height: 73%
  width: 100%
  max-height: 149px

.petImgDesktop
  object-fit: cover
  height: 75%
  width: 100%
  max-height: 149px

.pet-card
  max-height: 90%

@media only screen and (min-width: 320px)
  .pet-card
    max-height: 45%
  .petImg
    object-fit: cover
    height: 73%
    width: 100%

@media only screen and (min-width: 370px)
  .pet-card
    max-height: 45%
  .petImg
    object-fit: cover
    height: 75%
    width: 100%

@media only screen and (min-width: 410px)
  .pet-card
    max-height: 48%
  .petImg
    object-fit: cover
    height: 78%
    width: 100%

@media only screen and (min-width: 750px)
  .pet-card
    max-height: 48%
  .petImg
    object-fit: cover
    height: 85%
    width: 100%

@media only screen and (min-width: 1024px)
  .pet-card
    max-height: 85%
  .petImg
    object-fit: cover
    max-height: 70%
    width: 100%

@media only screen and (min-width: 1300px)
  .pet-card
    max-height: 85%
  .petImgDesktop
    object-fit: cover
    height: 78%
    width: 100%

@media only screen and (min-width: 1600px)
  .pet-card
    max-height: 90%
  .petImgDesktop
    object-fit: cover
    height: 80%
    width: 100%

.form-container
  min-width: 100%

.picked
  opacity: 0.4
</style>
