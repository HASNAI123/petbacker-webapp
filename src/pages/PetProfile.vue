<template>
  <div v-if="personalItem">
    <q-page class="row q-mb-xl" style="max-width: 1030px;margin-left: auto; margin-right: auto;">
      <q-scroll-observer @scroll="scrollHandler" ></q-scroll-observer>
      <div class="col-md-12 col-xs-12" style="position: relative;" ref="carousel">
        <q-carousel class="carousel text-center" style="overflow:hidden;" :arrows="personalItem.images.length > 1" :navigation="personalItem.images.length > 1" animated v-model="slide" autoplay swipeable infinite transition-prev="slide-right" transition-next="slide-left">
          <q-carousel-slide :name="index"  style="padding: 0px; overflow:hidden;" v-for="(image, index) in personalItem.images" :key="index">
            <q-img :src="image.filePath" class="responsive image-upload" style="height: 100%;weight: 100%;" v-if="image.contentType === 'image'" @click="$refs.lightbox.showImage(index)"></q-img>
          </q-carousel-slide>
        </q-carousel>

        <!-- upload photo button (called onUpload to upload photos)-->
        <q-btn color="rgba(200,200,200,0.5)" v-if="!disableEdit" class="text-capitalize updateBtn" style="margin-top: 15px;margin-right: 15px;" @click="openPetPhotosGallery"><span class="text-weight-bold text-18" style="color: #FFFFFF;">{{$t('pet.profile.update.photos')}}</span></q-btn>
        <input type="file" disable @change="imageUpload" accept=".jpg,.jpeg,.png" ref="selectedFile" style="display: none;">
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
      <div class="col-md-12 col-xs-12 q-mb-xl">
        <q-card class="shadow-0">
          <q-tabs ref="info-tabs" v-model="currentTab" dense active-color="primary" class="font-normal bg-white">
            <!--<q-tab name="Moments" class="text-weight-bold text-capitalize">Moments</q-tab>-->
            <q-tab name="Info" class="text-weight-bold text-capitalize">{{$t('pet.profile.info')}}</q-tab>
            <q-tab name="Reminders" class="text-weight-bold text-capitalize" v-if="!disableEdit">{{$t('reminder')}}</q-tab>
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
              <q-list>
                  <!-- Pet name -->
                  <q-item clickable v-ripple @click="openModal('name')">
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
                  <q-item clickable v-ripple @click="openModal('gender')">
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
                  <q-item clickable v-ripple @click="openModal('type')">
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

  <!-- Pet Size -->
  <q-separator/>
                  <q-item clickable v-ripple @click="openModal('size')">
                    <q-item-section class="text-weight-medium text-16">
                      {{$t('pet.profile.size')}}
                    </q-item-section>
                    <q-item-section class="text-right text-weight-bold text-16">
                      {{personalItem.weight}}
                    </q-item-section>
                    <q-item-section side v-if="!disableEdit">
                      <q-icon name="chevron_right" />
                    </q-item-section>
                  </q-item>
                  <q-separator/>
                  <!-- Pet Breed -->
                  <q-item clickable v-ripple @click="openModal('breed')">
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
                  <q-item clickable v-ripple @click="openModal('birthdate')">
                    <q-item-section class="text-weight-medium text-16">
                      {{$t('pet.profile.birthdate')}}
                    </q-item-section>
                    <q-item-section class="text-right text-weight-bold text-16">
                      {{getBirthdate(personalItem.birthDate)}}
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
                    <q-checkbox left-label class="full-width" :disable="disableEdit" v-model="petOtherInfo" @input="onEditCheckbox" :val="item.content"></q-checkbox>
                  </q-item >
                </q-list>
              </div>

              <!-- Vet Information -->
              <div class="col-md-12 col-xs-12 q-mt-lg">
                <p class="text-16 text-weight-bold q-ml-xs" >Vet information</p>
                <q-list separator>
                  <q-item class="col-md-12 col-xs-12 input" clickable v-ripple @click="openModal('vet')">
                    <q-item-section class="text-16 text-weight-medium">
                      {{$t('vet.name')}}
                    </q-item-section>

                    <q-item-section v-if="personalItem.vetInfo && personalItem.vetInfo.length > 0" class="text-capitalize text-right text-weight-bold text-16">
                      {{personalItem.vetInfo[0].name}}
                    </q-item-section>

                    <q-item-section side>
                      <q-icon name="chevron_right" />
                    </q-item-section>
                  </q-item >
                </q-list>
              </div>

              <p class="q-py-xl"><!-- SPACING --></p>
            </q-tab-panel>

            <!-- Reminders tab -->
            <q-tab-panel name="Reminders">
              <q-list style="min-height: 500px;">
                <!-- Add Reminder -->
                <q-card style="opacity: 0.65;" @click="addRemindersModal = true" class="clickable q-my-sm q-py-sm q-mx-xs">
                  <q-item>
                    <q-item-section>
                      <q-item-label lines="1">{{$t('add.reminders')}}</q-item-label>
                      <q-item-label caption lines="2">{{$t('remind.yourself.on.time.with.your.pets.schedule')}}</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-icon name="chevron_right" />
                    </q-item-section>
                  </q-item>
                </q-card>

                <card-reminder v-for="(reminder, index) in reminders"  :index="index" @remove-reminder="onRemoveReminder" @update-reminder="onUpdateReminder" @refresh-reminders="getReminders" :reminder="reminder" :key="reminder.id" class="q-my-sm clickable"></card-reminder>
              </q-list>
            </q-tab-panel>
          </q-tab-panels>

          <q-tabs ref="info-tabs" v-if="enableSticky && $q.platform.is.mobile" v-model="currentTab" dense active-color="primary" :class="{'sticky-header': enableSticky}" class="font-normal bg-white" style="box-shadow: 0 4px 4px 1px lightgrey;">
            <!--<q-tab name="Moments" class="text-weight-bold text-capitalize">Moments</q-tab>-->
            <q-tab name="Info" class="text-weight-bold text-capitalize">{{$t('pet.profile.info')}}</q-tab>
            <q-tab name="Reminders" class="text-weight-bold text-capitalize">Reminders</q-tab>
          </q-tabs>
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
    </q-page>

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

    <!-- Modals -->
    <q-dialog v-model="editModal" @hide="clearModalState" :maximized="$q.platform.is.mobile" :transition-show="$q.platform.is.mobile ? 'slide-left' : ''" :transition-hide="$q.platform.is.mobile ? 'slide-right' : ''">
      <q-card style="min-width: 400px; max-width: 500px; min-height: 500px; min-height: 600px;">
        <q-toolbar style="border-bottom: solid 1px lightgrey;">
          <q-btn flat dense v-close-popup icon="chevron_left" size="1.3em" style="margin-left: 0px;"></q-btn>
          <q-toolbar-title v-if="vetModal" class="font-title"><h6 class="q-my-none text-title">Vets</h6></q-toolbar-title>
        </q-toolbar>
        <!-- Label -->
        <q-card-section style="padding-bottom: 0px;">
          <div class="margin-bottom-20 text-weight-bold" style="font-size: 18px; margin-top:10px;">
            <p v-if="petModal.name" class="q-mx-md">{{ $t('vet.name.prompt')}}</p>
            <p v-else-if="petModal.type" style="margin-bottom: 0px;" class="q-mx-md">{{ $t('vet.type.prompt')}}</p>
            <p v-else-if="petModal.breed" class="q-mx-md">{{ $t('vet.breed.prompt')}}</p>
            <p v-else-if="petModal.size" class="q-mx-md">{{ $t('pet.profile.size')}}</p>
            <!-- <p v-else-if="vetModal" ></p> -->
          </div>
        </q-card-section>
        <!-- Input -->
        <q-card-section v-if="petModal.name" >
          <div class="row">
             <q-input class="input col-xs-11 q-mx-md" v-model="userInput" dense borderless></q-input>
          </div>
        </q-card-section>
        <q-card-section v-else-if="petModal.gender">
          <div class="row">
            <q-card v-for="(option, index) in genders" :ref="option" :key="index" :class="checkSelect(option, userInput) ? 'picked' : '' " class="col-md-3" @click="select($event, option, userInput, index)" style="margin-left: 20px;">
              <!--<img :src="getImgSrc(option.label, question.questionId)">-->
              <q-card-section class="item-content cursor-pointer text-center">
                <label style="font-size: 16px" class="text-weight-bold">{{ option }}</label>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
        <q-card-section v-else-if="petModal.type" style="padding: 0px;margin-bottom: 100px;">
          <div class="row col-xs-12 q-mx-md" >
            <q-card v-for="(option, index) in petTypes" :ref="option" :key="index" class="col-xs-5 width20 q-mt-lg justify-center" style="margin-left: 20px;" :class="checkSelect(option, userInput) ? 'picked' : '' " @click="select($event, option, userInput, index)">
              <img :src="getImgSrc('', index, false)">
              <q-card-section class="item-content cursor-pointer text-center">
                <label :for="option" style="font-size: 16px" class="text-weight-bold">{{ option }}</label>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
        <q-card-section v-else-if="petModal.size" style="padding: 0px; margin-bottom: 100px;">
  <div class="image-pair-container"> <!-- Add this container -->
    <q-card v-for="(option, index) in size" :key="option" :ref="option" :class="checkSelect(option, userInput) ? 'picked' : '' " class="col-xs-5 q-mt-lg justify-center"  @click="select($event, option, userInput, index)" style="margin-left: 20px;">
      <q-img :src="getPetSizeImg(index)" style="width:170px; height:170px;" placeholder-src="statics/images/graphic-placeholder.jpg" basic></q-img>
      <q-card-section class="item-content cursor-pointer text-center">
        <label :for="option" class="font-normal text-weight-bold">{{ option }}</label>
      </q-card-section>
    </q-card>
    </div>
</q-card-section>

        <q-card-section v-else-if="petModal.breed">
          <div class="row q-mx-md">
            <q-input class="input col-md-12 col-xs-12" v-model="userSearch" placeholder="Search pet breed here" borderless dense style="min-width: 88%;margin-bottom: 30px;"></q-input>
            <div class="col-md-12 col-xs-11 text-center" style="margin-left: 4%;" v-if="breedLoading">
              <ComponentPreLoader></ComponentPreLoader>
            </div>
            <q-card v-else v-for="(option, key) in filteredBreeds" :key="key" :ref="option.name" square class="col-md-12 col-xs-12" :class="checkSelect(option.name, userInput) ? 'picked' : '' " @click="select($event, option.name, userInput, key); saveInfo()" >
              <q-card-section>
                {{option.name}}
              </q-card-section>
              <q-separator />
            </q-card >
          </div>
        </q-card-section>
        <q-card-section v-else-if="petModal.birthDate">
          <div class="row">
            <q-date class="full-width" v-model="personalItem.birthDate" minimal :options="checkDate" mask="DD-MM-YYYY" ></q-date>
          </div>
        </q-card-section>
        <q-card-section v-else-if="vetModal">
          <div class="row">
            <card-vet v-for="(vet, index) in personalItem.vetInfo" :key="vet.id" :index="index" :vetInfo="vet" @on-remove-vet="onRemoveVet"></card-vet>

            <!-- <q-card class="col-md-2 q-mt-sm q-mx-xs justify-center" style="width: 160px;"  @click.native="select($event, 'Add Vet')">
              <img src="statics/images/pets/turtle.png">
                <q-card-section class="item-content cursor-pointer">
                  <p class="q-mb-xs text-weight-bold text-16">Not on the list?</p>
                  <p class="q-mb-xs text-grey-7 text-weight-light text-12">Click here to add your vet</p>
                </q-card-section>
            </q-card> -->
          </div>
       </q-card-section>
        <!-- Desktop -->
        <div class="row text-center q-my-lg q-px-lg gt-sm" @click="saveInfo" v-if="!petModal.breed">
          <div class="col-xs-12">
            <div class="full-width z999 text-white q-pa-md bg-primary cursor-pointer font1-3-rem" v-ripple style="height: 70px;border-radius:10px;">
              <p class="text-weight-bold text-16" style="margin-top: 6px;" >{{$t('button.save')}}</p>
            </div>
          </div>
        </div>
       <!-- Mobile -->
        <div class="row text-center fixed-bottom lt-lg" @click="saveInfo" v-if="!petModal.breed">
          <div class="col-xs-12">
            <div class="full-width z999 text-white q-pa-md bg-primary cursor-pointer font1-3-rem" v-ripple style="height: 70px;">
              <p class="text-weight-bold text-16" style="margin-top: 6px;" v-if="vetModal" >Add Another Vet</p>
              <p class="text-weight-bold text-16" style="margin-top: 6px;" v-else>{{$t('button.save')}}</p>
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- Add Vet Modal -->
    <!-- <q-dialog v-model="addVetModal" :maximized="$q.platform.is.desktop ? false : true">
      <q-card >
        <q-toolbar>
            <q-btn
              flat
              round
              dense
              v-close-popup
              icon="keyboard_arrow_left"
            />
            <q-toolbar-title v-close-popup>
              Back
            </q-toolbar-title>
        </q-toolbar>
        <q-card-section v-if="addVetModal">
          <p class="text-weight-bold text-18 q-my-md">What is the name of your vet?</p>
          <q-input class="input q-my-md q-mb-xl" v-model="vetDetails.name" dense borderless/>

          <p class="text-weight-bold text-18 q-my-md">Where is the location of the vet?</p>

          <p class="text-weight-bold text-18 q-my-md">What is the phone number of the vet?</p>
          <q-select input-debounce="100" use-input @filter="filterFn" dense @input="selected" :options="options" v-model="country" class="input q-my-md" borderless :label="$t('signup.country')">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{$t('no.result')}}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input v-model="vetDetails.contact" type="number" inverted color="neutral" borderless dense maxlength="12" class="input q-my-md text-black  q-mb-xl" :prefix="mobileCode" :label="$t('signup.phonenumber')"/>
        </q-card-section>
        <div class="col-xs-12 fixed-bottom" @click="saveInfo">
          <div class="full-width z999 text-white text-center q-pa-md bg-primary cursor-pointer text-weight-bold text-16">{{$t('button.save')}}</div>
        </div>
      </q-card>
    </q-dialog> -->
    <dialog-addvet ref="dialog-addvet" :trigger="addVetInfoModal" @on-close="triggerAddVetInfoModal" @on-add-vet="onAddVet"></dialog-addvet>

    <!-- Pet Photo Gallery Dialog -->
    <dialog-petphotogallery ref="uploadImages" :trigger="petGallery" :media="personalItem.images"
    @on-upload="onFileSelection"
    @on-close="closePetGallery"
    @on-remove="onRemove"></dialog-petphotogallery>

    <!-- Error Dialog -->
    <dialog-prompt :trigger="showPrompt" :message="promptMessage" :okButtonLabel="promptOkLabel" :cancelButtonLabel="promptCancelLabel" :persistent="promptPersistent" @on-ok="onPromptOk" @on-cancel="onPromptCancel" @on-close="closePromptModal"></dialog-prompt>

    <!-- Add Reminders Dialog -->
    <dialog-addreminders :trigger="addRemindersModal" :prefilled="currentReminderInfo" @on-close="closeAddReminders" @on-add-reminder="addReminder"></dialog-addreminders>

    <!-- Light Box Image -->
    <LightBox
      v-if="lightBoxImages.length > 0"
      :media="lightBoxImages"
      ref="lightbox"
      :show-caption="false"
      :show-light-box="false"
    ></LightBox>
  </div>
  <div class="col-md-12 col-xs-12 text-center" v-else>
    <ComponentPreLoader></ComponentPreLoader>
  </div>
</template>

<script>
/* global bugsnagClient */
require('vue-image-lightbox/dist/vue-image-lightbox.min.css')
import LightBox from 'vue-image-lightbox'
import moment from 'moment'
import ImageTools from 'assets/ImageTools.js'
import ImageUploadMixin from '../mixins/imageUploadMixin.js'
import { throttle } from 'quasar'

export default {
  mixins: [ImageUploadMixin],
  components: {
    LightBox,
    'dialog-petphotogallery': () => import('components/PetProfile/PetPhotosGallery.vue'),
    'dialog-addreminders': () => import('components/PetProfile/DialogAddReminders.vue'),
    'card-reminder': () => import('components/PetProfile/ReminderCard.vue'),
    'dialog-prompt': () => import('components/DialogPrompt.vue'),
    'card-vet': () => import('components/PetProfile/VetCard.vue'),
    'dialog-addvet': () => import('components/PetProfile/DialogAddVetInfo.vue')
  },
  data () {
    return {
      lightBoxImages: [],
      petGallery: false,
      slide: 0,
      input: 'input',
      currentTab: 'Info',
      petOtherInfo: [],
      otherInfo: [],
      petTypes: ['Dog', 'Cat', 'Rabbit', 'Guinea Pig', 'Ferret', 'Bird', 'Reptile', 'Others'],
      genders: ['Male', 'Female', 'Others'],
      size: ['1-5kg', '5-10kg', '10-20kg', '20-40kg', '40+kg'],
      personalItem: null,
      profileEdited: false,
      saveLoading: false,
      petModal: {
        name: false,
        gender: false,
        type: false,
        breed: false,
        size: false,
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
      serviceStart: moment().subtract(2, 'days').format('YYYY-MM-DD'),
      enableSticky: false,
      backButtonClicked: false,
      momentInfo: null,
      addRemindersModal: false,
      currentReminderInfo: null,
      showPrompt: false,
      disableEdit: false,
      promptMessage: '',
      promptOkLabel: 'Save and Exit',
      promptCancelLabel: this.$t('chat.later'),
      promptPersistent: false,
      addVetInfoModal: false,
      petForm: null
    }
  },
  created () {
    this.savePet = throttle(this.savePet, 1000)
    this.getPetInfo()
  },
  mounted () {
    // listen to ImageUploadMixin callback (image processing)
    this.$on('image-data', this.uploadImageData)
  },
  beforeDestroy () {
    this.$emit('show-edit-button', false)
    this.$off('image-data')
  },
  computed: {
    filteredBreeds () {
      var search = this.userSearch.toLowerCase()
      return this.petBreeds.filter(function (breed) {
        return breed.name.toLowerCase().includes(search)
      })
    }
  },
  methods: {
    triggerAddVetInfoModal (status) {
      this.addVetInfoModal = status
    },
    getPetSizeImg (petSize) {
      let size = 'xs'
      switch (petSize) {
        case 0: size = 'xs'; break
        case 1: size = 's'; break
        case 2: size = 'md'; break
        case 3: size = 'lg'; break
        case 4: size = 'xl'; break
        default: size = 'xs'
      }

      let petType = 'dog'
      console.log(this.petInfo)
      switch (this.personalItem.type) {
        case 'Σκύλος':
        case 'Chien':
        case 'สุนัข':
        case '狗':
        case 'Perro':
        case 'Dog':
          petType = 'dog'; break
        case 'Γάτα':
        case 'Chat':
        case 'แมว':
        case '貓':
        case 'Gato':
        case 'Cat':
          petType = 'cat'; break
        case 'Κουνέλι':
        case 'Lapin':
        case 'กระต่าย':
        case '兔子':
        case 'Conejo':
        case 'Rabbit':
          petType = 'rabbit'; break
        case 'Ινδικό Χοιρίδιο':
        case 'Guinea Pig':
        case 'Cochon d\'Inde':
        case 'หนูตะเภา':
        case '天竺鼠':
        case 'Conejillo de indias':
          petType = 'guinea-Pig'; break
        case 'Κουνάβι':
        case 'Furet':
        case 'เฟอเรท':
        case '雪貂':
        case 'Hurón':
        case 'Ferret':
          petType = 'ferret'; break
        case 'Πουλί':
        case 'Oiseau':
        case 'นก':
        case '鸟类':
        case 'Ave':
        case 'Bird':
          petType = 'bird'; break
        case 'Ερπετό':
        case 'Reptile':
        case 'สัตว์เลื้อยคลาน':
        case '爬虫类':
        case 'Reptil':
          petType = 'reptile'; break
        case 'Άλλο':
        case 'Autres':
        case 'อื่นๆ':
        case '其他':
        case 'Otros':
        case 'Others':
          petType = 'Others'; break
      }
      console.log('lets check the size', size)
      console.log('lets check the size', petType)
      return `statics/images/pets/${petType}.png`
    },

    onRemoveVet (index) {
      this.personalItem.vetInfo.splice(index, 1)
      if (this.personalItem.vetInfo.length) {
        this.vetModal = true
      } else {
        this.triggerAddVetInfoModal(true)
      }
    },
    onAddVet (vetInfo) {
      this.$refs['dialog-addvet'].triggerLoading(true)
      this.$axios.post(`users/${this.$store.state.user.uuid}/personal-items/${this.$route.params.petId}/vets`, {vetInfo: vetInfo}, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.personalItem.vetInfo.push(response.data.vetInfo)
      }).catch(e => {
        console.error(e)
        if (e.response && e.response.data) {
          this.$q.dialog({
            title: this.$t('requests.error.title'),
            message: e.response.data.message
          })
        }
      }).finally(_ => {
        this.$refs['dialog-addvet'].triggerLoading(false)
        this.vetModal = true
      })
    },
    onRemoveReminder (index, reminderId) {
      this.reminders.splice(index, 1)

      this.$axios.delete(`users/${this.$store.state.user.uuid}/personal-items/${this.$route.params.petId}/reminders/${reminderId}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.getReminders()
      }).catch(e => {
        console.error(e)
        if (e.response.data && e.response.data.message) {
          this.$q.dialog({
            title: this.$t('requests.error.title'),
            message: e.response.data.message
          })
        }
      })
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
    onUpdateReminder (index, reminderInfo) {
      this.reminders[index] = reminderInfo
      this.personalItem.reminders[index] = reminderInfo
    },
    onEditCheckbox (value) {
      if (value.length === 0) {
        this.profileEdited = false
      } else {
        console.log('check the value', value)
        console.log('chck the petingo array', this.petOtherInfo)
        this.profileEdited = true
      }
    },
    closePromptModal (value) {
      this.showPrompt = value
    },
    updateReminder (reminderInfo) {
      this.currentReminderInfo = reminderInfo
      this.addRemindersModal = true
    },
    closeAddReminders (value) {
      this.addRemindersModal = value
    },
    addReminder (reminderInfo) {
      this.addRemindersModal = false
      this.personalItem.reminders.unshift(reminderInfo)
      this.reminders.unshift(reminderInfo)

      this.$axios.post(`users/${this.$store.state.user.uuid}/personal-items/${this.$route.params.petId}/reminders`, JSON.stringify({remindersInfo: reminderInfo}), {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
      }).catch(e => {
        console.error(e)
        bugsnagClient.notify(e)
        if (e.response.data && e.response.data.message) {
          this.$q.dialog({
            title: this.$t('requests.error.title'),
            message: e.response.data.message
          })
        }
      }).finally(_ => {
        this.getReminders()
      })
    },
    triggerPromptDialog (status, message = null, okLabel = null, cancelLabel = null, persistent = false) {
      this.showPrompt = status
      this.promptMessage = message
      this.promptOkLabel = okLabel
      this.promptCancelLabel = cancelLabel
      this.promptPersistent = persistent
      this.promptModal = status
    },
    onPromptOk () {
      this.savePet()
    },
    onPromptCancel () {
      this.triggerPromptDialog(false)
      this.$router.go(-1)
    },
    backButtonDetected (event) {
      this.backButtonClicked = true
      if (this.profileEdited) {
        this.triggerPromptDialog(true, 'Do you want to save all changes before leaving?', 'Save and Exit', this.$t('proceed.with.exit'), true)
      } else {
        this.$router.go(-1)
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
    uploadImageData (imageBlobData) {
      let vm = this
      this.$refs['uploadImages'].updateLoader(true)
      let formData = new FormData()
      formData.append('imagefile', imageBlobData.blob, 'image.jpg')
      vm.$axios.post('imageupload', formData)
        .then((response) => {
          let mediaInfo = {
            'contentType': 'image',
            'fileName': response.data.imageName,
            'filePath': response.data.imagePath
          }
          vm.personalItem.images.push(mediaInfo)
          //  vm.$q.notify('Image successfully uploaded!')
        }).catch(e => {
          console.error(e)
          vm.$q.notify(e.response.data.message)
        }).finally(_ => {
          vm.$refs['uploadImages'].updateLoader(false)
          vm.updateImages()
        })
    },
    onDelete (personalItemId) {
      this.$q.dialog({
        title: this.$t('confirmation'),
        message: 'Are you sure you want to delete this pet?',
        ok: this.$t('dialog.button.yes'),
        cancel: this.$t('dialog.button.no')
      }).onOk(() => {
        this.$q.loading.show()
        this.$axios.delete(`users/${this.$store.state.user.uuid}/personal-items/${personalItemId}?v=8`, {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          this.$q.loading.hide()
          this.$q.notify({message: 'Pet successfully deleted!', position: 'top', type: 'positive'})
          this.$router.go(-1)
        }).catch(e => {
          bugsnagClient.notify(e)
          if (e.response && e.response.data) {
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
    imageUpload (e) {
      if (!e.target.files[0]) {
        this.$q.notify({
          message: this.$t('no.images.selected'),
          position: 'top'
        })
        return
      }

      this.$refs['uploadImages'].updateLoader(true)
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
            let mediaInfo = {
              'contentType': 'image',
              'fileName': response.data.imageName,
              'filePath': response.data.imagePath
            }
            vm.personalItem.images.push(mediaInfo)
            vm.$q.notify('Image successfully uploaded!')
          }).catch(e => {
            console.error(e)
            vm.$q.notify(e.response.data.message)
          }).finally(_ => {
            vm.$refs['uploadImages'].updateLoader(false)
            vm.updateImages()
          })
      })
    },
    formatDate (date) {
      return moment(date).format('MMMM Do, YYYY')
    },
    getBirthdate (birthDate) {
      let date = moment(birthDate, 'DD-MM-YYYY').format('DD-MM-YYYY')
      if (date === 'Invalid date') {
        date = 'Select Birthdate'
      }
      return date
    },
    onRemove (index) {
      if (this.personalItem.images.length > 1) {
        this.personalItem.images.splice(index, 1)
        this.$refs['uploadImages'].loadImage()
        this.updateImages()
      } else {
        this.showPrompt = true
        this.triggerPromptDialog(true, 'Please add one more photo before removing the last photo.')
      }
    },
    updateImages () {
      // save pet photos
      let petForm = JSON.stringify(this.createFormConversion(this.personalItem))

      // reinsert into correct format
      let imagesTemp = []
      for (let item in this.personalItem.images) {
        let mediaInfo = {
          'type': 'image',
          'filename': this.personalItem.images[item].fileName
        }
        imagesTemp.push(mediaInfo)
      }

      let info = {
        personalItemsInfo: {
          id: this.personalItem.ID,
          title: this.personalItem.name || '',
          itemDescription: petForm,
          media: imagesTemp
        }
      }
      this.$refs['uploadImages'].loadImage()

      // insert into light box images
      this.lightBoxImages = []
      for (let index in this.personalItem.images) {
        this.lightBoxImages.push({
          'src': this.personalItem.images[index].filePath,
          'thumb': this.personalItem.images[index].filePath
        })
      }

      this.$axios.put(`users/${this.$store.state.user.uuid}/personal-items/${this.$route.params.petId}?v=6`, JSON.stringify(info), {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        //  this.$q.notify('Image successfully updated!')
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
      })
    },
    savePet (reminderInfo = null) {
      this.saveLoading = true
      let petForm = JSON.stringify(this.createFormConversion(this.personalItem))

      // reinsert into correct format
      let imagesTemp = []
      for (let item in this.personalItem.images) {
        let mediaInfo = {
          'type': 'image',
          'filename': this.personalItem.images[item].fileName
        }
        imagesTemp.push(mediaInfo)
      }

      let info = {
        personalItemsInfo: {
          id: this.personalItem.ID,
          title: this.personalItem.name || '',
          itemDescription: petForm,
          media: imagesTemp,
          reminders: this.personalItem.reminders || []
        }
      }

      // redo reminder login to have current and newly added together
      if (reminderInfo) {
        info.personalItemsInfo.reminders.push(reminderInfo)
      }

      this.$axios.put(`users/${this.$store.state.user.uuid}/personal-items/${this.$route.params.petId}?v=8`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (reminderInfo === null) {
          if (!this.backButtonClicked) {
            this.$q.notify({message: 'Pet profile successfully updated!', position: 'top', type: 'positive'})
          }
          this.$router.go(-1)
        }
      }).catch(e => {
        bugsnagClient.notify(e)
        if (e.response && e.response.data) {
          this.$q.dialog({
            title: this.$t('requests.error.title'),
            message: e.response.data.message,
            buttons: [{
              label: this.$t('remove.a.request'),
              handler () {
                this.$router.replace({name: 'MobileDashboard'})
              }
            },
            {
              label: this.$t('button.close'),
              handler () {}
            }
            ]
          })
        } else {
          this.$q.dialog({
            title: this.$t('requests.error.title'),
            message: this.$t('requests.petboarding.error.occurred')
          })
        }
        console.error(e)
      }).finally(_ => {
        this.saveLoading = false
      })
    },
    getPetInfo () {
      console.log('functio getting triggered')
      this.$axios.get(`users/${this.$store.state.user.uuid}/personal-items/${this.$route.params.petId}?v=8`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        console.log('check the respoonse', response)
        if (response.data.personalItemsInfo.uuid !== this.$store.state.user.uuid) {
          // disable editing pet profile (view only)
          this.disableEdit = true
          this.$emit('show-edit-button', false)
        } else {
          // allow editing pet profile
          this.$emit('show-edit-button', true)
        }
        this.petForm = JSON.parse(response.data.personalItemsInfo.itemDescription.replace('\\', '')).question
        console.log('check the petform', this.petForm)
        let pet = this.petForm
        let personalPet = {
          ID: response.data.personalItemsInfo.id,
          images: response.data.personalItemsInfo.mediaInfo,
          title: response.data.personalItemsInfo.title,
          name: pet[1].reply,
          type: pet[3].reply,
          breed: pet[5].reply,
          weight: pet[7].reply,
          gender: pet[9].reply,
          birthDate: moment.utc(pet[11].reply).local().format('DD-MM-YYYY'),
          wallId: response.data.personalItemsInfo.wallId,
          reminders: response.data.personalItemsInfo.reminders,
          vetInfo: response.data.personalItemsInfo.vetInfo || null
        }
        this.reminders = response.data.personalItemsInfo.reminders
        this.personalItem = personalPet

        // checked box info
        for (let i = 0; i < pet.length; i++) {
          if (pet[i].type === 'switch') {
            let switchInfo = {
              'selected': pet[i].reply,
              'content': pet[i].content,
              'id': pet[i].questionId
            }
            if (pet[i].reply !== '') {
              console.log('checl pet info', pet[i].content)
              this.petOtherInfo.push(pet[i].content)
            }
            this.otherInfo.push(switchInfo)
          }

          if (pet[i].type === 'checkBoxSelector' && pet[i].questionId === 14) {
            this.petOtherInfo = pet[i].reply
            this.otherInfo = JSON.parse(pet[i].content.replace(/'/g, `"`)).map((item, index) => {
              console.log(item)
              return {
                'selected': this.petOtherInfo.indexOf(item) > -1,
                'content': item
              }
            })
            console.log('petotherinfo', this.petOtherInfo)
            console.log(this.petOtherInfo.indexOf('Vaccinated'))
          }
        }

        // insert into light box images
        this.lightBoxImages = []
        for (let index in response.data.personalItemsInfo.mediaInfo) {
          if (response.data.personalItemsInfo.mediaInfo[index].contentType === 'image') {
            this.lightBoxImages.push({
              'src': response.data.personalItemsInfo.mediaInfo[index].filePath,
              'thumb': response.data.personalItemsInfo.mediaInfo[index].filePath
            })
          }
        }
        //  this.getPetMoment()
      }).catch((error) => {
        console.log(error)
      })
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
    openModal (type) {
      if (this.disableEdit) {
        return
      }

      switch (type) {
        case 'name': this.petModal.name = true; this.userInput = this.personalItem.name; break
        case 'gender': this.petModal.gender = true; this.userInput = this.personalItem.gender; break
        case 'type': this.petModal.type = true; this.userInput = this.personalItem.type; break
        case 'size': this.petModal.size = true; this.userInput = this.personalItem.weight; console.log('check weight', this.personalItem.weight); console.log('check user input', this.userInput); break
        case 'breed': this.petModal.breed = true; this.userInput = this.personalItem.breed; this.breedInfo(); break
        case 'birthdate':
          this.petModal.birthDate = true
          if (this.personalItem.birthDate) {
            this.userInput = moment(this.personalItem.birthDate).format('DD-MM-YYYY')
          } else {
            this.userInput = moment(this.serviceStart)
          }
          break
        case 'vet':
          if (this.personalItem.vetInfo.length) {
            this.vetModal = true
          } else {
            this.triggerAddVetInfoModal(true)
          }
          break
      }
      this.editModal = true
    },
    saveInfo () {
      if (this.petModal.name) {
        this.personalItem.name = this.userInput
      } else if (this.petModal.gender) {
        this.personalItem.gender = this.userInput
      } else if (this.petModal.type) {
        // refresh pet breed when change pet type
        if (this.userInput !== this.personalItem.type) {
          this.personalItem.breed = ''
        }
        this.personalItem.type = this.userInput
      } else if (this.petModal.size) {
        console.log('check the user input', this.userInput)
        console.log('check the peronsla item', this.personalItem)
        // refresh pet breed when change pet type
        if (this.userInput !== this.personalItem.weight) {
          this.personalItem.weight = ''
        }
        this.personalItem.weight = this.userInput
      } else if (this.petModal.breed) {
        this.personalItem.breed = this.userInput
      } else if (this.addVetModal) {
        let vetInfo = {
          name: this.vetDetails.name,
          address: this.vetDetails.address,
          contact: this.vetDetails.contact
        }

        //  clear info
        this.vetDetails.name = ''
        this.vetDetails.address = null
        this.vetDetails.contact = null

        // push to display
        this.vets.push(vetInfo)
      } else if (this.petModal.birthDate) {
        console.log(this.personalItem.birthDate)
        //  this.personalItem.birthDate = moment(this.userInput).format()
      } else if (this.vetModal) {
        // this.personalItem.vet.name = this.vetDetails.name
        // this.personalItem.vet.contact = this.vetDetails.contact
        // this.personalItem.vet.address = this.vetDetails.address
        this.addVetInfoModal = true
      }

      // clear input
      this.userInput = null
      this.clearModalState(true)

      this.profileEdited = true
    },
    clearModalState (status = false) {
      if (this.vetModal && status === true) {
        this.editModal = true
      } else {
        this.editModal = false
      }
      this.petModal.name = false
      this.petModal.gender = false
      this.petModal.type = false
      this.petModal.breed = false
      this.petModal.size = false
      this.petModal.birthDate = false
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
      if (this.petModal.size) {
        console.log('its size modal')
        this.userinput = null
        console.log('check the value', value)
        console.log('check the index', index)
        console.log('check the item', item)
      }
      // add another pet
      if (value === 'Add Vet') {
        console.log('add vet')
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
          console.log('this 1')
        } else if (item.length > 0) {
          if (this.$refs[value][0]) {
            this.$refs[item][0].$el.classList.toggle('picked')
            console.log('this 2', item.length)
          }
          item = ''
        }

        // select
        if (index === 'vet') {
          this.vetDetails.name = item.name
          this.vetDetails.contact = item.contact
          this.vetDetails.address = item.address
        } else if (this.petModal.type) {
          item = value
        } else if (this.petModal.weight) {
          console.log('here check item', item)
          console.log('here check value', value)
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
    createFormConversion (petDetails) {
      let form = this.petForm

      for (var index in form) {
        if (form[index].questionId === 2) {
          form[index].reply = petDetails.name
        } else if (form[index].questionId === 4) {
          form[index].reply = petDetails.type
        } else if (form[index].questionId === 6) {
          form[index].reply = petDetails.breed
        } else if (form[index].questionId === 8 && form[index].type !== 'imageSelector') {
          form[index].reply = petDetails.weight
        } else if (form[index].questionId === 10) {
          form[index].reply = petDetails.gender
        } else if ((form[index].questionId === 12 || form[index].questionId === 14) && form[index].type === 'dateSelector') {
          form[index].reply = moment(petDetails.birthDate, 'DD-MM-YYYY').utc().format()
        } else if (form[index].questionId === 14 && form[index].type === 'checkBoxSelector') {
          form[index].reply = this.petOtherInfo
        } else if (form[index].type === 'switch') {
          if (this.petOtherInfo.includes(form[index].content)) {
            form[index].reply = true
          } else {
            form[index].reply = ''
          }
        } else if ((form[index].questionId > 14 && form[index].questionId < 23) && form[index].type === 'switch') {
          if (this.petOtherInfo.indexOf(form[index].questionId) > -1) {
            form[index].reply = '1'
          }
        }
      }

      return {
        'question': form
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.image-pair-container
    display: flex  // Display children in a row
    flex-wrap: wrap  // Wrap to the next row if space is insufficient

  .q-card
    // Add any necessary styles for the q-card element
.sticky-header
 position: fixed
 top: 10%
 width: 100%
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
  max-height: 100%
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

.text-title
  margin-left: 12%
  font-size: 18px

@media screen and (min-width: 320px)
  .text-title
    margin-left: 14%

@media screen and (min-width: 350px)
  .text-title
    margin-left: 22%

@media screen and (min-width: 370px)
  .text-title
    margin-left: 28%

@media screen and (min-width: 400px)
  .text-title
    margin-left: 38%

@media screen and (min-width: 530px)
  .text-title
    margin-left: 40%

.petCard
  max-height: 100%

@media only screen and (min-width: 320px)
  .petImg
    object-fit: cover
    height: 73%
    width: 100%

@media only screen and (min-width: 370px)
  .petImg
    object-fit: cover
    height: 75%
    width: 100%

@media only screen and (min-width: 410px)
  .petImg
    object-fit: cover
    height: 78%
    width: 100%

@media only screen and (min-width: 750px)
  .petImg
    object-fit: cover
    height: 85%
    width: 100%

@media only screen and (min-width: 1024px)
  .petImg
    object-fit: cover
    max-height: 70%
    width: 100%

@media only screen and (min-width: 1300px)
  .petImgDesktop
    object-fit: cover
    height: 78%
    width: 100%

@media only screen and (min-width: 1600px)
  .petImgDesktop
    object-fit: cover
    height: 80%
    width: 100%
</style>
