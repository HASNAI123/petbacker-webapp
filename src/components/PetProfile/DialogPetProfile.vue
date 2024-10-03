<template>
  <div>
    <q-dialog v-model="modal" @hide="onClose" @before-show="getPetInfo" :maximized="$q.platform.is.mobile" :transition-show="$q.platform.is.mobile ? 'slide-left' : 'none'" :transition-hide="$q.platform.is.mobile ? 'slide-right' : 'none'">
        <q-card>
            <q-toolbar style="z-index: 5000;" class="borderline fixed-top bg-white">
                <q-btn flat dense v-close-popup icon="keyboard_arrow_left" size="1.3em" @click="onClose"></q-btn>
                <q-toolbar-title v-close-popup >
                    <h6 class="q-my-none pet-profile-title">{{$t('navbar.pet.profile')}}</h6>
                </q-toolbar-title>
                <q-item-section side @click="modalMoreOptions = true" class="clickable">
                    <q-icon name="fas fa-ellipsis-v" size="16px" style="margin-top: 5px;" class="q-mb-sm"/>
                </q-item-section>
            </q-toolbar>

            <q-card-section class="row q-pa-none q-mt-xl" v-if="personalItem">
                <div class="col-12" style="position: relative;" ref="carousel">
                    <q-carousel class="carousel text-center" style="overflow:hidden;" :arrows="false" :navigation="mediaInfo.length > 1" animated v-model="slide" autoplay swipeable infinite transition-prev="slide-right" transition-next="slide-left">
                    <q-carousel-slide :name="index"  style="padding: 0px; overflow:hidden;" v-for="(image, index) in mediaInfo" :key="index">
                        <q-img :src="image.filePath" class="responsive image-upload" style="height: 100%;weight: 100%;" v-if="image.contentType === 'image'"></q-img>
                    </q-carousel-slide>
                    </q-carousel>

                    <!-- upload photo button (called onUpload to upload photos)-->
                    <q-btn color="rgba(200,200,200,0.5)" v-if="disableEdit" class="text-capitalize updateBtn" style="margin-top: 15px;margin-right: 15px;" @click="openPetPhotosGallery"><span class="text-weight-bold text-18" style="color: #FFFFFF;">{{$t('view.photos')}}</span></q-btn>
                </div>
                <!--
                <div class="col-md-12 col-xs-12 q-mt-xs">
                    <div class="row q-ml-lg" :style="{'margin-left': $q.platform.is.desktop ? '153px' : ''}">
                    <div class="q-mx-sm text-center col-xs-3 col-md-3">
                        <p class="text-weight-bold value q-mb-xs q-mt-sm">0</p>
                        <p class="text-weight-light label">Bookings</p>
                    </div>
                    <q-separator vertical inset class="q-mx-xs" style="height: 40px; margin-top: 12px;"/>
                    <div class="q-mx-sm text-center col-xs-3 col-md-3">
                        <p class="text-weight-bold value q-mb-xs q-mt-sm">0</p>
                        <p class="text-weight-light label">Reviews</p>
                    </div>
                    <q-separator vertical inset class="q-mx-xs" style="height: 40px; margin-top: 12px;"/>
                    <div class="q-mx-sm text-center col-xs-3 col-md-3">
                        <p class="text-weight-bold value q-mb-xs q-mt-sm">0</p>
                        <p class="text-weight-light label">Followers</p>
                    </div>
                    </div>
                </div>
                -->
                <div class="col-12 q-mb-xl">
                  <q-card class="shadow-0">
                    <q-tabs ref="info-tabs" v-model="currentTab" dense active-color="primary" class="font-normal bg-white">
                        <!--<q-tab name="Moments" class="text-weight-bold text-capitalize">Moments</q-tab>-->
                        <q-tab name="Info" class="text-weight-bold text-capitalize">{{$t('pet.profile.info')}}</q-tab>
                        <!-- <q-tab name="Reminders" class="text-weight-bold text-capitalize" v-if="!disableEdit">Reminders</q-tab> -->
                    </q-tabs>
                    <q-tab-panels v-model="currentTab" animated class="inset-shadow" swipeable>
                      <!-- Moments tab -->
                      <q-tab-panel name="Moments">
                        <div style="min-height: 500px;" class="row" v-if="momentInfo">
                            <!-- Picture Cards -->
                            <q-card v-for="image in momentInfo.mediaInfo" :key="image.id" style="height:105px;max-height: 105px;width: 100%;max-width: 105px;" class="col-xs-3 q-ma-xs">
                              <q-img :src="image.filePath"
                                  class="responsive uploaded-images"
                                  style="object-fit: cover;height: 100%;width: 100%;"
                                  v-if="image.contentType === 'image'"
                              ></q-img>
                            </q-card>
                        </div>
                      </q-tab-panel>

                      <!-- Info tab -->
                      <q-tab-panel name="Info">
                        <!-- Pet Owner -->
                        <q-item v-if="userInfo" dense class="q-mt-sm q-mb-md q-pl-xs" clickable @click="$router.push({name: 'PublicProfile', params: {userId: userInfo.id}})">
                          <q-item-section avatar>
                            <q-avatar style="height: 70px; width: 70px;">
                                <img :src="userInfo.avatarImage" class="image-upload">
                            </q-avatar>
                          </q-item-section>

                          <q-item-section class="q-my-sm">
                            <q-item-label lines="1">
                              <h6 class="q-my-none text-left text-capitalize" style="font-size: 17px;line-height: 1.2em;">{{userInfo.username}}</h6>
                            </q-item-label>

                            <q-item-label>
                              <q-btn :label="$t('view.profile')" class="full-width" size="sm" dense color="primary"></q-btn>
                            </q-item-label>
                          </q-item-section>
                        </q-item>

                        <!-- Like, comment, share buttons -->
                        <q-btn-group flat class="text-grey full-width row q-mb-sm" v-if="$store.getters['user/getUserCurrentMobileTab'] !== 'mobile.navbar.jobs' && $store.getters['user/getUserCurrentMobileTab'] !== 'mobile.navbar.requests' && wallInfo">
                          <q-btn flat :icon="wallInfo.liked ? 'fas fa-heart' : 'far fa-heart'" :class="wallInfo.liked ? 'liked' : ''" :ripple="false" @click="onLikeButton" class="col q-pa-none">
                            <span class="text-capitalize q-ml-sm" @click.stop="$emit('trigger-like-dialog', true)">{{wallInfo.likes}}</span>
                          </q-btn>
                          <q-btn flat icon="far fa-comment-dots" :ripple="false" @click="$emit('trigger-comment-dialog', true)" class="col q-pa-none">
                            <span class="text-capitalize q-ml-sm">{{wallInfo.comments}}</span>
                          </q-btn>
                          <q-btn flat icon="fas fa-share" :ripple="false" @click="$emit('on-share', true)" class="col q-pa-none">
                            <span class="text-capitalize q-ml-xs">{{$t('share')}}</span>
                          </q-btn>
                        </q-btn-group>

                        <q-separator></q-separator>

                        <q-list>
                            <!-- Pet name -->
                            <q-item clickable v-ripple>
                                <q-item-section class="text-weight-medium text-16">
                                {{$t('pet.profile.name')}}
                                </q-item-section>
                                <q-item-section class="text-right text-weight-bold text-16">
                                {{personalItem.name}}
                                </q-item-section>
                                <q-item-section side v-if="!disableEdit">
                                <q-icon name="chevron_right" />
                                </q-item-section>
                            </q-item>
                            <q-separator/>

                            <!-- Gender -->
                            <q-item clickable v-ripple>
                                <q-item-section class="text-weight-medium text-16">
                                {{$t('pet.profile.gender')}}
                                </q-item-section>
                                <q-item-section class="text-right text-weight-bold text-16">
                                {{personalItem.gender}}
                                </q-item-section>
                                <q-item-section side v-if="!disableEdit">
                                <q-icon name="chevron_right" />
                                </q-item-section>
                            </q-item>

                            <!-- Pet Type -->
                            <q-separator/>
                            <q-item clickable v-ripple>
                                <q-item-section class="text-weight-medium text-16">
                                {{$t('pet.profile.type')}}
                                </q-item-section>
                                <q-item-section class="text-right text-weight-bold text-16">
                                {{personalItem.type}}
                                </q-item-section>
                                <q-item-section side v-if="!disableEdit">
                                <q-icon name="chevron_right" />
                                </q-item-section>
                            </q-item>
                            <q-separator/>

                            <!-- Pet Breed -->
                            <q-item clickable v-ripple>
                                <q-item-section class="text-weight-medium text-16">
                                {{$t('pet.profile.breed')}}
                                </q-item-section>
                                <q-item-section class="text-right text-weight-bold text-16">
                                {{personalItem.breed}}
                                </q-item-section>
                                <q-item-section side v-if="!disableEdit">
                                <q-icon name="chevron_right" />
                                </q-item-section>
                            </q-item>
                            <q-separator/>

                            <!-- Birth date -->
                            <q-item clickable v-ripple>
                                <q-item-section class="text-weight-medium text-16">
                                {{$t('pet.profile.birthdate')}}
                                </q-item-section>
                                <q-item-section class="text-right text-weight-bold text-16">
                                {{formatDate(personalItem.birthDate)}}
                                </q-item-section>
                                <q-item-section side v-if="!disableEdit">
                                <q-icon name="chevron_right" />
                                </q-item-section>
                            </q-item>
                            <q-separator/>
                        </q-list>

                        <!-- Other information -->
                        <div class="col-md-12 col-xs-12 q-mt-lg">
                            <p class="text-16 text-weight-bold q-ml-xs" >{{$t('pet.profile.otherinfo')}}</p>
                            <q-list separator>
                            <q-item tag="label" dense class="col-md-12 col-xs-12" clickable v-ripple v-for="(item, index) in otherInfo" :key="index" >
                                <q-item-section avatar class="text-weight-medium text-16">
                                    {{item.content}}
                                </q-item-section>
                                <q-checkbox left-label class="full-width" :disable="disableEdit" v-model="petOtherInfo" :val="item.content"></q-checkbox>
                            </q-item >
                            </q-list>
                        </div>
                      </q-tab-panel>
                    </q-tab-panels>
                  </q-card>
                </div>

                <!-- Desktop button -->
                <div class="col-xs-12 gt-sm q-mb-xl" v-if="!disableEdit">
                    <div class="full-width text-white q-pa-md bg-primary cursor-pointer text-center" @click="savePet()" v-ripple style="height: 70px;border-radius: 15px;">
                    <p v-if="!saveLoading" class="text-weight-bold text-16 text-center" style="margin-top: 5px;">{{$t('save.pet.info')}}</p>
                    <span v-else>
                        <q-spinner size="3em" ></q-spinner>
                    </span>
                    </div>
                </div>
            </q-card-section>
            <q-card-section v-else class="col-md-12 col-xs-12 text-center">
                <ComponentPreLoader></ComponentPreLoader>
            </q-card-section>

            <!-- Bottom Button will appear on mobile screen when profile edit -->
            <div class="row text-center fixed-bottom" v-if="profileEdited">
                <div class="col-xs-12 lt-lg" @click="savePet()">
                    <div class="full-width text-white q-pa-md bg-primary cursor-pointer" v-ripple style="height: 70px;z-index:6000;">
                    <p v-if="!saveLoading" class="text-weight-bold text-16" style="margin-top: 5px;">{{$t('save.pet.info')}}</p>
                    <span v-else>
                        <q-spinner size="3em"></q-spinner>
                    </span>
                    </div>
                </div>
            </div>

            <!-- More Options Dialog -->
            <q-dialog v-model="modalMoreOptions" auto-close position="bottom" class="moreOptions" transition-show="slide-up">
              <q-card style="width:400px;">
                <q-card-section >
                  <q-btn flat class="full-width q-py-xs text-weight-medium" @click="onBlock" text-color="red" no-caps><p>{{$t('block')}}</p></q-btn>
                  <q-btn flat class="full-width q-py-xs text-weight-medium" @click="triggerReportDialog(true, $t('report.this.post'), $t('why.are.you.reporting.this.post'), $t('button.submit'), $t('button.cancel'), 1, true)" text-color="red" no-caps><p>{{$t('report')}}</p></q-btn>
                  <q-btn flat class="full-width q-py-xs text-weight-medium" @click="$emit('on-share', true)" text-color="black" no-caps><p>{{$t('share')}}</p></q-btn>
                  <div><q-separator/></div>
                  <q-btn flat class="full-width q-py-xs text-weight-bold" text-color="black" id="closeBtn" no-caps>{{$t('close')}}</q-btn>
                </q-card-section>
              </q-card>
            </q-dialog>

            <!-- Block Dialog -->
            <dialog-block :trigger="blockModal" :type="'pet'" :momentId="wallInfo.id" :blockUserUuid="userInfo && userInfo.id ? userInfo.id : null" @on-close="triggerBlockModal" @on-block-moment="onBlockMoment"></dialog-block>

            <!-- Report Pet Dialog -->
            <dialog-report :trigger="promptModal" :type="typeCode" :title="promptTitle" :message="promptMessage" :persistent="promptPersistant" :okButtonLabel="okBtnLabel" :cancelButtonLabel="canceblBtnLabel" @on-ok="onPromptOk" @on-cancel="onPromptCancel" @on-close="triggerReportDialog"></dialog-report>

            <q-page-sticky position="bottom" :offset="[18, $route.name === 'MobileDashboard' ? -55 : 18]" v-if="$store.getters['user/getUserCurrentMobileTab'] !== 'mobile.navbar.jobs' && $store.getters['user/getUserCurrentMobileTab'] !== 'mobile.navbar.requests'">
              <q-btn rounded :label="$t('add.pet')" color="primary" :ripple="false" class="q-px-lg" @click="toAddPets"></q-btn>
            </q-page-sticky>
        </q-card>
    </q-dialog>

    <!-- Pet Photo Gallery Dialog -->
    <dialog-petphotogallery ref="uploadImages" :trigger="petGallery" :disableUpload="disableEdit" :media="mediaInfo" @on-close="closePetGallery"></dialog-petphotogallery>

    <!-- Error Dialog -->
    <dialog-error :trigger="showError" :message="'Please add one more photo before removing the last photo.'" @on-close="closeErrorModal"></dialog-error>
  </div>
</template>

<script>
/* global bugsnagClient */
import moment from 'moment'

export default {
  components: {
    'dialog-petphotogallery': () => import('components/PetProfile/PetPhotosGallery.vue'),
    'card-reminder': () => import('components/PetProfile/ReminderCard.vue'),
    'dialog-error': () => import('components/Dialog400Error.vue'),
    'dialog-report': () => import('components/DialogReport.vue'),
    'dialog-block': () => import('components/DialogBlock.vue')
  },
  props: {
    trigger: {
      default: false,
      type: Boolean
    },
    userInfo: {
      default: null,
      type: Object
    },
    petInfo: {
      default: null,
      type: String
    },
    mediaInfo: {
      default: null,
      type: Array
    },
    wallInfo: {
      default: null,
      type: Object
    }
  },
  data () {
    return {
      modalMoreOptions: false,
      lightBoxImages: [],
      petGallery: false,
      slide: 0,
      input: 'input',
      currentTab: 'Info',
      petOtherInfo: [],
      otherInfo: [],
      petTypes: ['Dog', 'Cat', 'Rabbit', 'Guinea Pig', 'Ferret', 'Bird', 'Reptile', 'Others'],
      genders: ['Male', 'Female', 'Others'],
      personalItem: null,
      profileEdited: false,
      saveLoading: false,
      petModal: {
        name: false,
        gender: false,
        type: false,
        breed: false,
        birthDate: false
      },
      vetModal: false,
      userInput: null,
      editModal: false,
      userSearch: '',
      petBreeds: [],
      breedLoading: false,
      vetSearch: null,
      vets: [],
      addVetModal: false,
      mobileCode: null,
      country: null,
      options: null,
      reminders: null,
      vetDetails: {
        name: null,
        address: null,
        contact: null
      },
      enableSticky: false,
      backButtonClicked: false,
      momentInfo: null,
      currentReminderInfo: null,
      showError: false,
      disableEdit: true,
      modal: false,
      promptModal: false,
      blockModal: false,
      typeCode: 1,
      promptMessage: '',
      promptTitle: '',
      okBtnLabel: this.$t('ok'),
      canceblBtnLabel: this.$t('close'),
      promptPersistant: false,
      reportedReasons: ''
    }
  },
  computed: {
    filteredBreeds () {
      var search = this.userSearch.toLowerCase()
      return this.petBreeds.filter(function (breed) {
        return breed.name.toLowerCase().includes(search)
      })
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    }
  },
  methods: {
    onLikeButton () {
      if (this.wallInfo.liked) {
        this.$emit('on-unlike')
      } else {
        this.$emit('on-like')
      }
    },
    toAddPets () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.triggerGuestModeModal(true)
        return
      }

      this.$router.push({name: 'MyPets'})
    },
    triggerGuestModeModal (status) {
      this.guestModeModal = status
    },
    onClose () {
      this.modal = false
      this.$emit('on-close', false)
    },
    getReminders () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/personal-items/${this.$route.params.petId}/reminders`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.reminders = response.data.reminderInfo.items
      }).catch(e => {
        console.error(e)
        bugsnagClient.notify(e)
        if (e.response.data && e.response.data.message) {
          this.$q.dialog({
            title: this.$t('requests.error.title'),
            message: e.response.data.message
          })
        }
      })
    },
    closeErrorModal (value) {
      this.showError = value
    },
    updateReminder (reminderInfo) {
      this.currentReminderInfo = reminderInfo
      this.addRemindersModal = true
    },
    closeAddReminders (value) {
      this.addRemindersModal = value
    },
    backButtonDetected (event) {
      this.backButtonClicked = true
      if (event.state) {
        if (this.profileEdited) {
          this.savePet()
        }
      }
    },
    scrollHandler (info) {
      let carousel = this.$refs['carousel']
      if (info.position > carousel.clientHeight) {
        //  this.enableSticky = true
      } else if (info.position < carousel.clientHeight) {
        this.enableSticky = false
      }
    },
    openPetPhotosGallery () {
      this.$refs['uploadImages'].loadImage()
      this.petGallery = true
    },
    closePetGallery (value) {
      this.petGallery = value
    },
    onDelete (personalItemId) {
      this.$q.dialog({
        title: 'Confirmation',
        message: 'Are you sure you want to delete this pet?',
        ok: 'Yes',
        cancel: 'No'
      }).onOk(() => {
        this.$q.loading.show()
        this.$axios.delete(`users/${this.$store.state.user.uuid}/personal-items/${personalItemId}?v=6`, {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          this.$q.loading.hide()
          this.$q.notify('Pet successfully deleted!')
          this.$router.go(-1)
        }).catch(e => {
          bugsnagClient.notify(e)
          if (e.response.data.message) {
            this.$q.dialog({
              title: this.$t('requests.error.title'),
              message: e.response.data.message
            })
          } else {
            this.$q.dialog({
              title: this.$t('requests.error.title'),
              message: this.$t('requests.petboarding.error.occurred')
            })
          }
          console.error(e)
        }).finally(() => {
          this.$q.loading.hide()
        })
      }).onCancel(() => {})
    },
    formatDate (date) {
      let formattedDate = moment.utc(date).local().format('MMMM Do, YYYY')
      if (formattedDate === 'Invalid date') {
        formattedDate = ''
      }
      return formattedDate
    },
    getBirthdate (birthDate) {
      let date = moment(birthDate, 'DD-MM-YYYY').format('DD-MM-YYYY')
      if (date === 'Invalid date') {
        date = ''
      }
      return date
    },
    async getPetInfo () {
      if (this.personalItem !== null) {
        return
      }

      let pet = JSON.parse(this.petInfo.replace('\\', '')).question
      this.personalItem = {
        images: this.mediaInfo,
        name: pet[1].reply,
        type: pet[3].reply,
        breed: pet[5].reply,
        weight: pet[7].reply,
        gender: pet[9].reply,
        birthDate: ''
        /*  vet: {
        name: pet[23].reply,
        contact: pet[25].reply,
        address: pet[27].reply
        } */
      }

      if (pet[11].reply !== 'Invalid Date' && pet[11].reply !== '' && pet[11].reply !== ' ') {
        if (pet[11].reply.includes('/') || pet[11].reply.includes('-')) {
          this.personalItem.birthDate = pet[11].reply
        } else {
          this.personalItem.birthDate = moment.utc(pet[11].reply).local().format('DD-MM-YYYY')
        }
      }

      // checked box info
      for (let i = 0; i < pet.length; i++) {
        if (pet[i].type === 'switch') {
          let switchInfo = {
            'selected': pet[i].reply,
            'content': pet[i].content
          }

          if (pet[i].reply !== '') {
            this.petOtherInfo.push(pet[i].content)
          }

          this.otherInfo.push(switchInfo)
        }
      }
    },
    getPetMoment () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/wall/${this.personalItem.wallId}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.momentInfo = response.data.wallInfo
      }).catch((error) => {
        console.log(error)
      })
    },
    checkDate (birthDate) {
      return moment(birthDate).format('YYYY-MM-DD') < moment(this.today).format('YYYY-MM-DD')
    },
    selected (item) {
      this.country = item.label
      this.mobileCode = item.sublabel
    },
    onLocation (place) {
      let location = {}
      let addressComponents = place.address_components
      if (typeof addressComponents !== 'object' || !addressComponents.length) {
        throw new Error('Address Component is not complete with data ' + JSON.stringify(place))
      }

      for (var i = 0; i < addressComponents.length; i++) {
        var addressComponent = addressComponents[i]

        if (addressComponent.types[0] === 'locality') {
          location.city = addressComponent.long_name
        }

        if (addressComponent.types[0] === 'administrative_area_level_1') {
          location.state = addressComponent.long_name
        }

        if (addressComponent.types[0] === 'country') {
          location.country = addressComponent.long_name
        }
      }
      //    this.sendImpression('Enter Location')

      location.latitude = place.geometry.location.lat().toString()
      location.longitude = place.geometry.location.lng().toString()
      this.vetDetails.address = place.formatted_address.toString()
    },
    getPetTypeID () {
      switch (this.personalItem.type) {
        case 'Dog': return 1
        case 'Cat': return 2
        case 'Rabbit': return 3
        case 'Guinea Pig': return 4
        case 'Ferret': return 5
        case 'Bird': return 6
        case 'Reptile': return 7
        case 'Turtle': return 8
        default: return 'Invalid Pet Type'
      }
    },
    breedInfo () {
      this.breedLoading = true
      // check for pet id
      let petTypeID = this.getPetTypeID()
      this.$axios.get(`/petinfo/${petTypeID}?lang=${this.$store.getters['user/getCurrentLanguage']}`).then(response => {
        this.petBreeds = response.data.petBreedInfo.items
        this.breedLoading = false
      }).catch(e => {
        console.log(e)
      })
    },
    checkSelect (label, item) {
      // empty reply
      if (item === undefined || item.length === 0) {
        return false
      } else if (item === label) {
        return true
      }
      return false
    },
    select (event, value, item, index) {
      // add another pet
      if (value === 'Add Vet') {
        this.addVetModal = true
        return
      }

      this.$refs[value][0].$el.classList.toggle('picked')
      if (this.$refs[value][0].$el.classList.toString().indexOf('picked') > 0) {
        // prevent multiple select
        if (index === 'vet') {
          if (this.vetDetails.name.length > 0) {
            this.$refs[this.vetDetails.name][0].$el.classList.toggle('picked')
          }
          this.vetDetails.name = ''
          this.vetDetails.contact = null
          this.vetDetails.address = null
        } else if (item === null) {
          item = ''
        } else if (item.length > 0) {
          this.$refs[item][0].$el.classList.toggle('picked')
          item = ''
        }

        // select
        if (index === 'vet') {
          this.vetDetails.name = item.name
          this.vetDetails.contact = item.contact
          this.vetDetails.address = item.address
        } else if (this.petModal.type) {
          item = value
        }
        this.userInput = value
      } else {
        // deselect
        if (index === 'vet' && item.name === value) {
          this.vetDetails.name = ''
          this.vetDetails.contact = null
          this.vetDetails.address = null
        } else if (item === value) {
          item = ''
        }
      }
      //  console.log(this.personalItem.vet)
    },
    getImgSrc (file, index, title) {
      if (typeof file.fileName !== 'undefined' && file.fileName !== '') {
        return file.filePath
      } else {
        if (index === 90049) {
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
        src = src.toLowerCase().replace(' ', '-')
        src = 'statics/images/pets/' + src + '.png'
        return src
      }
    },
    onPromptCancel () {
      this.triggerReportDialog(false)
    },
    onPromptOk (message) {
      this.reportSubmit(message)
    },
    reportSubmit (reportReason) {
      let info = {
        'reportInfo': {
          'comment': reportReason
        }
      }

      this.$axios.post(`users/${this.$store.getters['user/getUserUuidState']}/report/${this.userInfo.id}`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$q.notify({
          message: this.$t('report.submitted.successful'),
          position: 'top'
        })
      }).catch((error) => {
        console.error(error)
        if (error.response) {
          this.$q.notify({
            message: error.response.data.message,
            position: 'top',
            timeout: 2000
          })
        }
      })
    },
    triggerReportDialog (status, title = '', message = '', okLabel = null, cancelLabel = null, typeCode = 0, persistent = false) {
      this.promptTitle = title
      this.promptMessage = message
      this.okBtnLabel = okLabel
      this.canceblBtnLabel = cancelLabel
      this.promptPersistant = persistent
      this.typeCode = typeCode
      this.promptModal = status
    },
    triggerBlockModal (status) {
      this.blockModal = status
    },
    onBlock () {
      this.triggerBlockModal(true)
    },
    onBlockMoment () {
      this.onClose()
      this.$emit('on-block-moment')
    }
  }
}
</script>

<style lang="stylus" scoped>
.pet-profile-title
  margin-left: 29%
.sticky-header
 position: fixed
 top: 10%
 width: 100%

.carousel
  height: 240px
  width: 100%
  margin-left: auto
  margin-right: auto

@media screen and (min-width: 661px)
  .width20
    width 20%
@media screen and (min-width: 1000px)
  .carousel
    height: 350px

.value
  font-size: 18px !important

.label
  font-size: 12px !important
  color: #798186

.text-18
  font-size: 18px

.text-16
  font-size: 16px

.updateBtn
  position: absolute
  background-color: rgba(200,200,200,0.6)
  top: 0
  right: 0
  border-radius: 6px

.picked
  opacity: 0.4
</style>
