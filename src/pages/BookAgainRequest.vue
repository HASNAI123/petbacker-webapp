<template>
  <q-page padding class="row justify-center bg-grey-1">
    <div ref="request-target" class="fixed-top" style="z-index: 100;" v-if="$route.query.avatar && ($route.query.sittername || $route.query.ownername)">
      <request-target-notification></request-target-notification>
    </div>
    <div class="col-md-7 col-xs-12 bg-white q-px-lg animate-popup-down" v-if="request !== null">
      <!-- Booking Info -->
      <div v-if="steps === 0">
        <h6 class="text-center q-my-none font-x-large" :class="$refs['request-target'] ? 'q-mt-xl q-pt-md' : 'q-mt-lg'">{{ request.serviceName }}</h6>
        <div v-for="(questionForm, index) in questionLists" :key="questionForm.questionId">
          <template v-if="questionForm.type === 'label' && (([109, 121, 90007, 90011].indexOf(questionForm.questionId) === -1 && $route.query.sitter) || !$route.query.sitter)">
            <p class="caption q-mt-lg q-mb-sm">{{ $route.query.sitter ? questionForm.listingDisplay : questionForm.content }}</p>
          </template>
          <template v-else-if="questionForm.type === 'personalItemSelector'" class="q-mb-lg">
            <q-select
              v-model="selectedPets"
              borderless
              multiple
              :options="petOptions"
              :label="$t('select.pet.title')"
              class="full-width clickable input"
              readonly
              :disable="personalItemLoader"
              :class="personalItemLoader ? '' : 'clickable'"
              @click.native="personalItemLoader ? '' : $refs.petSelection[0].show()"
            >
              <template v-slot:append>
                <q-spinner
                  color="primary"
                  size="2em"
                  v-if="personalItemLoader"
                />
                <q-dialog ref="petSelection" transition-show="slide-left" transition-hide="slide-right" :maximized="$q.platform.is.mobile" :persistent="$q.platform.is.mobile">
                  <pet-selection-view :personalItems="personalItems" :selectedPets="selectedPets" @update-selected="updateSelectedPet(questionForm)"></pet-selection-view>
                </q-dialog>
              </template>
            </q-select>
          </template>
          <template v-else-if="questionForm.questionId === 90002">
            <q-input class="input" type="input" readonly  @click.native="$refs.qDate[0].show()" v-model="serviceStartFormat" borderless hide-bottom-space>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer q-pa-sm">
                  <q-dialog ref="qDate" transition-show="scale" transition-hide="scale">
                    <q-date class="full-width" v-model="serviceStart" mask="YYYY-MM-DD" :options="checkDate" @input="onCheckError(index)"/>
                  </q-dialog>
                </q-icon>
              </template>
            </q-input>
            <q-input class="input" type="time" readonly  @click.native="$refs.qTime[0].show()" v-model="serviceStartTime" borderless style="margin-top: 20px;">
              <template v-slot:prepend>
                <q-icon name="access_time" class="cursor-pointer q-pa-sm">
                  <q-dialog ref="qTime" transition-show="scale" transition-hide="scale">
                    <q-card style="width: 350px;height:440px">
                      <q-time class="full-width" v-model="serviceStartTime" mask="HH:mm" @input="onCheckError(index)"/>
                    </q-card>
                  </q-dialog>
                </q-icon>
              </template>
            </q-input>
          </template>
          <template v-else-if="questionForm.questionId === 90006">
            <q-input class="input" readonly v-model="serviceEndFormat" @click.native="$refs['qDate-end'][0].show()" borderless>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer q-pa-sm">
                  <q-dialog ref="qDate-end" transition-show="scale" transition-hide="scale">
                    <q-date class="full-width" v-model="serviceEnd" :events="[MOMENT(serviceStart).format('YYYY-MM-DD')]" :options="checkEndDate" mask="YYYY-MM-DD" @input="onCheckError(index)">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup :label="$t('button.save')" color="primary" flat></q-btn>
                      </div>
                    </q-date>
                  </q-dialog>
                </q-icon>
              </template>
            </q-input>
            <q-input class="input" type="time" v-model="serviceEndTime" readonly @click.native="$refs['qTime-end'][0].show()" style="margin-top: 20px;" borderless>
              <template v-slot:prepend>
                  <q-icon name="access_time" class="cursor-pointer q-pa-sm">
                    <q-dialog ref="qTime-end" transition-show="scale" transition-hide="scale">
                      <q-time class="full-width" v-model="serviceEndTime" mask="HH:mm" @input="onCheckError(index)">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('button.save')" color="primary" flat></q-btn>
                        </div>
                      </q-time>
                    </q-dialog>
                  </q-icon>
              </template>
            </q-input>
          </template>
          <template v-else-if="questionForm.type === 'radioButtonSelector' && (([90012].indexOf(questionForm.questionId) === -1 && $route.query.sitter) || !$route.query.sitter)">
            <q-select radio v-bind:class="typeof(errors[index]) !== 'undefined' ? 'has-error' : ''" v-model="questionForm.reply" :options="questionToArray(questionForm.content)" class="full-width input" borderless @change="onCheckError(index)"></q-select>
          </template>
          <template v-else-if="questionForm.type === 'numberBox'">
            <q-input class="full-width" v-bind:class="typeof(errors[index]) !== 'undefined' ? 'has-error' : ''" v-model.number="questionForm.reply" @change="onCheckError(index)" />
          </template>
          <template v-else-if="questionForm.type === 'checkBoxSelector'">
            <q-select multiple class="full-width" v-bind:class="typeof(errors[index]) !== 'undefined' ? 'has-error' : ''" v-model="questionForm.reply" :options="questionToArray(questionForm.content)" @input="onCheckError(index)"></q-select>
          </template>
          <template v-else-if="questionForm.type === 'inputBox' && (([110].indexOf(questionForm.questionId) === -1 && $route.query.sitter) || !$route.query.sitter)">
            <q-input class="full-width" v-bind:class="typeof(errors[index]) !== 'undefined' ? 'has-error' : ''" v-model="questionForm.reply" @change="onCheckError(index)" />
          </template>
          <template v-else-if="(questionForm.type === 'location' || questionForm.type === 'location_to') && $route.query.sitter !== true">
            <google-autocomplete :place="questionForm.reply" v-model="questionForm.reply" @place-changed="onPlaceChanged($event, index)" class="col-12 input"></google-autocomplete>
          </template>
        </div>
        <p class="q-py-xl"><!-- Spacing --></p>
      </div>

      <!-- Booking Quote -->
      <div v-else-if="steps > 0">
        <h6 class="text-center q-my-none font-x-large" :class="$refs['request-target'] ? 'q-mt-xl q-pt-md' : 'q-mt-lg'">Booking Quote</h6>
        <q-item class="q-my-sm font-normal" style="border: 1px solid lightgrey; border-radius: 12px;" v-for="rate in serviceRates" :key="rate.ratesId" @click.native="onQuote(rate)">
          <q-item-section>
            <q-item-label lines="1" class="font-title">{{rate.ratesTitle}}</q-item-label>
            <q-item-label lines="1"><span class="text-weight-bold">{{getCurrency(rate.ratesCurrencyId)}}{{rate.ratesAmount}}</span>/{{rate.ratesUnit}}</q-item-label>
            <q-item-label lines="1" class="text-wrap" caption>{{rate.ratesDescription}}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <div :ref="'chevron' + rate.ratesId" style="display:block;">
              <q-item-label><q-icon name="chevron_right" size="1.5em"></q-icon></q-item-label>
            </div>
            <div :ref="rate.ratesId" style="display:none;">
              <q-spinner :size="25" ></q-spinner>
            </div>
          </q-item-section>
        </q-item>
      </div>

      <!-- Submit Button -->
      <transition appear enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown"  v-if="$q.platform.is.mobile && showBottomSubmit">
        <div class="fixed-bottom bg-primary" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" @click="onSubmit">
          <div class="q-pa-md q-pb-lg">
            <div class="text-white q-pb-sm text-center cursor-pointer font-header-title">
              <span v-if="!bookAgainLoading">{{$t('button.submit')}}</span>
              <span v-else><q-spinner size="1.5em"></q-spinner></span>
            </div>
          </div>
        </div>
      </transition>
      <div v-else-if="showBottomSubmit">
        <q-btn class="float-right q-my-lg q-mx-sm" :loading="bookAgainLoading" :disabled="bookAgainLoading" :label="$t('button.submit')" color="primary" @click.native="onSaveRequest"></q-btn>
        <q-btn class="float-right q-my-lg q-mx-sm" :label="$t('button.back')" @click.native="$router.go(-1)"/>
      </div>
    </div>
    <div v-else class="q-mt-lg">
      <ComponentPreLoader></ComponentPreLoader>
    </div>
  </q-page>
</template>

<script>
/* global bugsnagClient */
/* eslint-disable no-eval */
import moment from 'moment'
import countries from 'assets/countries.json'
import languages from 'assets/languages.json'

export default {
  components: {
    'request-target-notification': () => import('components/RequestTargetNotification'),
    'pet-selection-view': () => import('components/ComponentPetSelection.vue'),
    'google-autocomplete': () => import('components/ComponentGmapAutocomplete.vue')
  },
  data () {
    return {
      steps: 0,
      questionLists: null,
      MOMENT: moment,
      today: moment().format('YYYY/MM/DD'),
      serviceStart: moment().add(1, 'days').format('YYYY-MM-DD'),
      serviceStartFormat: moment(this.serviceStart).format('Do MMMM, YYYY'),
      serviceStartTime: moment().format('HH:mm'),
      serviceEnd: null,
      serviceEndFormat: null,
      serviceEndTime: null,
      request: null,
      bookAgainLoading: false,
      errors: [],
      requestInfo: {
        budget: 0,
        budgetCurrency: 0,
        countryId: 0,
        fullAddress: '',
        isStory: 1,
        latitude: this.$route.query.lat || null,
        longitude: this.$route.query.lon || null,
        promoCode: '',
        reassignAllowed: 0,
        requestDescription: '',
        requestDescriptionJson: null,
        requestImage: '',
        requiredTime: null,
        serviceId: 0,
        serviceUserId: this.$route.params.serviceUserId !== 0 ? this.$route.params.serviceUserId : '',
        sourceServiceUserId: this.$route.params.serviceUserId !== 0 ? this.$route.params.serviceUserId : '',
        src: this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5
      },
      quotesInfo: {
        items: []
      },
      personalItemLoader: false,
      personalItems: [],
      selectedPets: [],
      petOptions: [],
      serviceRates: null,
      showBottomSubmit: true
    }
  },
  created () {
    console.log(this.$route)
    if (this.$route.query.sitter) {
      this.getTaskInfo()
    } else {
      this.getRequest()
    }
  },
  mounted () {
    if (this.$refs['request-target']) {
      this.$refs['request-target'].style.top = `${this.$parent.$parent.$parent.$refs.navbar.$el.clientHeight + 1}px`
    }

    if (document.querySelector('.pac-container')) {
      document.querySelector('.pac-container').remove()
    }

    this.getPersonalItems()

    // detect browser back button
    window.addEventListener('popstate', this.backButtonDetected, false)
  },
  beforeDestroy () {
    window.removeEventListener('popstate', this.backButtonDetected)
  },
  methods: {
    backButtonDetected (event) {
      if (this.steps === 0) {
        this.$router.go(-1)
      } else {
        this.steps -= 1
        this.showBottomSubmit = true
      }
    },
    onSubmit () {
      if (this.$route.query.sitter) {
        history.pushState(null, null, location.href)
        this.steps++
        this.showBottomSubmit = false
      } else {
        this.onSubmitRequestOwner()
      }
    },
    updateSelectedPet (questionForm) {
      let petIds = []
      let petTitle = []
      for (let pet in this.selectedPets) {
        petTitle.push(this.selectedPets[pet].label)
        petIds.push(this.selectedPets[pet].value)
      }
      questionForm.reply = petTitle.join(', ')
      questionForm.selectedIndex = petIds
    },
    getPersonalItems () {
      this.personalItemLoader = true
      this.$axios.get(`users/${this.$route.query.uuid || this.$store.getters['user/getUserUuidState']}/personal-items?v=6`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        let num = response.data.personalItemsInfo.items.length
        for (let i = 0; i < num; i++) {
          let pet = JSON.parse(response.data.personalItemsInfo.items[i].itemDescription.replace('\\', '')).question
          let personalPet = {
            ID: response.data.personalItemsInfo.items[i].id,
            type: pet[3].reply,
            weight: pet[7].reply,
            breed: pet[5].reply,
            image: response.data.personalItemsInfo.items[i].mediaInfo[0].filePath,
            name: pet[1].reply,
            title: response.data.personalItemsInfo.items[i].title
          }
          this.personalItems.push(personalPet)
        }
      }).catch((error) => {
        console.error(error)
      }).finally(() => {
        this.personalItemLoader = false
      })
    },
    getTaskInfo () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/tasks/${this.$route.query.taskId}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.serviceRates = response.data.taskInfo.serviceInfo.ratesInfo.items
        this.prefilledInfo(response.data.taskInfo.requestInfo)
      }).catch((error) => {
        console.error(error)
        this.forceLogout(error)
      })
    },
    getRequest () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/requests/${this.$route.params.requestId}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.prefilledInfo(response.data.requestInfo)
      }).catch((error) => {
        console.error(error)
        this.forceLogout(error)
      })
    },
    getCurrency (countryid) {
      let country = this.$_.findWhere(countries, {'id': countryid.toString()})

      if (!country) {
        country = {
          currencyCode: 'USD'
        }
      }

      return country.currencyCode
    },
    computeNights () {
      let startDate = moment(this.serviceStart).format('YYYY-MM-DD')
      console.log('start date', startDate)
      let endDate = moment(this.serviceEnd).format('YYYY-MM-DD')
      console.log('end date', endDate)
      return moment(endDate).diff(startDate, 'days').toString()
    },
    checkEndDate (serviceEnd) {
      return moment(serviceEnd).format('YYYY-MM-DD') > moment(this.serviceStart).format('YYYY-MM-DD')
    },
    prefilledInfo (requestInfo) {
      this.request = requestInfo
      this.requestInfo.countryId = this.request.countryId
      this.requestInfo.fullAddress = this.request.fullAddress
      this.requestInfo.latitude = this.request.latitude
      this.requestInfo.longitude = this.request.longitude
      this.requestInfo.serviceId = this.request.serviceId

      let questionLists = JSON.parse(this.request.requestDescriptionJson.replace('\\', '')).question
      for (var index in questionLists) {
        if (questionLists[index].type === 'location' || questionLists[index].type === 'location_to') {
          questionLists[index].reply = this.request.fullAddress
          questionLists[index].location = {
            latitude: this.request.latitude,
            longitude: this.request.longitude
          }
        }

        if (questionLists[index].type === 'checkBoxSelector') {
          questionLists[index].reply = questionLists[index].reply.split(/\s*,\s*/)
        }
      }

      if (moment.utc(requestInfo.requiredTime).local().add(requestInfo.duration, 'days').diff(this.today) >= 0) {
        this.serviceStart = moment.utc(requestInfo.requiredTime).local().add(requestInfo.duration, 'days').format('YYYY-MM-DD')
        this.serviceStartFormat = moment(this.serviceStart).format('Do MMMM, YYYY')
        this.serviceStartTime = moment.utc(requestInfo.requiredTime).local().format('HH:mm')
      } else {
        this.serviceStart = moment().add(1, 'days').format('YYYY-MM-DD')
        this.serviceStartFormat = moment(this.serviceStart).format('Do MMMM, YYYY')
        this.serviceStartTime = moment().format('HH:mm')
      }

      this.serviceEnd = moment(this.serviceStart).add(requestInfo.duration, 'days').format('YYYY-MM-DD')
      this.serviceEndFormat = moment(this.serviceEnd).format('Do MMMM, YYYY')
      this.serviceEndTime = moment.utc(requestInfo.requiredTime).local().format('HH:mm')

      // insert current selected pets in request
      for (let pet in this.request.personalItemsInfo.items) {
        let petModel = {
          'label': this.request.personalItemsInfo.items[pet].title,
          'value': this.request.personalItemsInfo.items[pet].id
        }
        this.selectedPets.push(petModel)
      }

      this.questionLists = questionLists
      console.log(this.questionLists)
    },
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
    checkDate (serviceStart) {
      return serviceStart >= this.today
    },
    // Convert some input into values that will be accepted by the server
    modelConversion: function () {
      let questionLists = this.questionLists

      for (var index in questionLists) {
        if (questionLists[index].questionId === 90002) {
          questionLists[index].reply = moment(this.serviceStart + ' ' + this.serviceStartTime).utc().format('YYYY-MM-DD HH:mmZ')
        } else if (questionLists[index].questionId === 90006) {
          questionLists[index].reply = this.computeNights()
        }

        if (questionLists[index].type === 'radioButtonSelector') {
          if (questionLists[index].reply.value) {
            questionLists[index].reply = questionLists[index].reply.value
          } else {
            questionLists[index].reply = questionLists[index].reply
          }
        } else if (questionLists[index].type === 'checkBoxSelector') {
          let temp = []
          for (let selection in questionLists[index].reply) {
            if (questionLists[index].reply[selection].label) {
              temp.push(questionLists[index].reply[selection].value)
            } else {
              temp.push(questionLists[index].reply[selection])
            }
          }

          questionLists[index].reply = temp.join(', ')
        }
      }
      return JSON.stringify({'question': questionLists})
    },
    formValidation: function () {
      let questionLists = this.questionLists
      let check = true
      for (let i in questionLists) {
        if (questionLists[i].type !== 'label' && Number(questionLists[i].required) === 1) {
          if ((questionLists[i].type === 'checkBoxSelector' || questionLists[i].type === 'radioButtonSelector') && questionLists[i].reply.length < 1) {
            this.errors[i] = 'Array Error at ' + questionLists[i - 1].content
            console.log(this.errors[i])
            check = false
          } else if (questionLists[i].type === 'dateSelector') {
            if (this.serviceStart === '') {
              this.errors[i] = 'Error at ' + questionLists[i - 1].content
              console.log(this.errors[i])
              check = false
            }
          } else if (questionLists[i].reply === '') {
            this.errors[i] = 'Error at ' + questionLists[i - 1].content
            console.log(this.errors[i])
            check = false
          }
        }
      }
      return check
    },
    onCheckError (index) {
      let questionLists = this.questionLists
      console.log('question', questionLists[index])
      if (questionLists[index].type === 'dateSelector' || (questionLists[index].type === 'numberBox' && questionLists[index].questionId === 90006)) {
        console.log('question id', questionLists[index].questionId)

        if (questionLists[index].questionId === 90002) {
          this.$refs.qDate[0].hide()
          this.$refs.qTime[0].hide()
          this.serviceStartFormat = moment(this.serviceStart).format('Do MMMM, YYYY')

          this.serviceEnd = moment(this.serviceStart).add(1, 'days').format('YYYY-MM-DD')
          this.serviceEndFormat = moment(this.serviceEnd).format('Do MMMM, YYYY')
        } else if (questionLists[index].questionId === 90006) {
          this.$refs['qTime-end'][0].hide()
          this.$refs['qDate-end'][0].hide()
          if (this.serviceEnd) {
            this.serviceEndFormat = moment(this.serviceEnd).format('Do MMMM, YYYY')
          }
        } else if (questionLists[index].questionId === 90018) {
          if (questionLists[index].reply === '') {
            questionLists[index].reply = []
          }
        }
      }

      if (questionLists[index].type !== 'label') {
        if (Array.isArray(questionLists[index].repy) && questionLists[index].reply.length > 0) {
          if (typeof (questionLists[index][index]) !== 'undefined') {
            questionLists[index].splice(index, 1)
          }
        } else if (questionLists[index].reply !== '') {
          if (typeof (questionLists[index][index]) !== 'undefined') {
            questionLists[index].splice(index, 1)
          }
        }
      }
    },
    onQuote (quoteInfo) {
      this.quotesInfo.items.push({
        'quoteAmount': quoteInfo.ratesAmount,
        'quoteCurrencyId': quoteInfo.ratesCurrencyId,
        'quoteDescription': quoteInfo.ratesDescription,
        'quoteTitle': quoteInfo.ratesTitle,
        'quoteType': 0,
        'quoteUnit': quoteInfo.ratesUnit,
        'quoteUnitServiceId': this.requestInfo.serviceId
      })
      this.onSubmitRequestSitter(quoteInfo.ratesId)
    },
    onSubmitRequestSitter (ratesId) {
      if (!this.formValidation()) {
        this.$q.notify({
          'message': this.$t('requests.petboarding.error.fill.correct.information')
        })
        return
      }

      // show loading
      this.bookAgainLoading = true
      this.$refs['chevron' + ratesId][0].style.display = 'none'
      this.$refs[ratesId][0].style.display = 'block'

      if (this.serviceStart !== '' && this.serviceStartTime !== '') {
        this.requestInfo.requiredTime = moment(this.serviceStart + ' ' + this.serviceStartTime).utc().format('YYYY-MM-DD HH:mmZ')
      } else {
        this.requestInfo.requiredTime = 0
        this.$q.notify({message: 'Something wrong with the Date and Time selection. Please Date and Time again'})
        this.bookAgainLoading = false
        return
      }

      // set user's preffered currency
      this.requestInfo.preferredCurrency = this.$store.getters['user/getUserPrefferedCurrency']

      // insert current language id
      this.requestInfo.language = this.$_.findWhere(languages, {'value': this.$store.state.user.language}).id

      this.requestInfo.requestDescriptionJson = this.modelConversion()

      this.$axios.post(`users/${this.$store.state.user.uuid}/tasks/${this.$route.query.taskId}/rebook`, {requestInfo: this.requestInfo, quotesInfo: this.quotesInfo}, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        history.pushState('MobileDashboard', 'MobileDashboard', this.$router.resolve({ name: 'MobileDashboard' }))
        history.pushState('ThankYou', 'ThankYou', this.$router.resolve({ name: 'ThankYou' }))
        this.$router.replace({ name: 'JobChat', params: {taskId: response.data.rebookInfo.jobId} })
        this.$q.notify({
          message: this.$t('requests.petboarding.success'),
          type: 'positive',
          position: 'top'
        })
      }).catch(e => {
        this.bookAgainLoading = false
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
            }]
          })
        }
      }).finally(_ => {
        this.$refs['chevron' + ratesId][0].style.display = 'block'
        this.$refs[ratesId][0].style.display = 'none'
      })
    },
    onSubmitRequestOwner () {
      if (!this.formValidation()) {
        this.$q.notify({
          'message': this.$t('requests.petboarding.error.fill.correct.information')
        })
        return
      }
      this.bookAgainLoading = true

      // this.requestInfo.requiredTime = moment(this.serviceStart).format('DD/MM/YYYY')
      if (this.serviceStart !== '' && this.serviceStartTime !== '') {
        this.requestInfo.requiredTime = moment(this.serviceStart + ' ' + this.serviceStartTime).utc().format('YYYY-MM-DD HH:mmZ')
      } else {
        this.requestInfo.requiredTime = 0
        this.$q.notify({message: 'Something wrong with the Date and Time selection. Please Date and Time again'})
        this.bookAgainLoading = false
        return
      }

      // set user's preffered currency
      this.requestInfo.preferredCurrency = this.$store.getters['user/getUserPrefferedCurrency']

      // insert current language id
      this.requestInfo.language = this.$_.findWhere(languages, {'value': this.$store.state.user.language}).id

      this.requestInfo.requestDescriptionJson = this.modelConversion()

      this.$axios.post(`users/${this.$store.state.user.uuid}/requests/direct`, {requestInfo: this.requestInfo}, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$q.localStorage.set('localStorageFormResponseInfo', response.data)
        this.$router.replace({ name: 'RequestSummary', params: {requestId: response.data.requestInfo.id} })

        this.$q.notify({
          message: this.$t('requests.petboarding.success'),
          type: 'positve',
          position: 'top'
        })
      }).catch(e => {
        this.bookAgainLoading = false
        let titleMessage = this.$t('requests.error.title')
        let remove = this.$t('remove.a.request')
        let close = this.$t('button.close')
        if (e.response.data.message) {
          this.$q.dialog({
            title: titleMessage,
            message: e.response.data.message,
            buttons: [{
              label: remove,
              handler () {
                if (this.$q.platform.is.mobile) {
                  this.$router.replace({name: 'MobileDashboard'})
                } else {
                  this.$router.replace({name: 'Requests'})
                }
              }
            },
            {
              label: close,
              handler () {}
            }
            ]
          })
        } else {
          let titleMessage = this.$t('requests.error.title')
          let message = this.$t('requests.petboarding.error.occurred')
          this.$q.dialog({
            title: titleMessage,
            message: message
          })
          let lang = this.$store.getters['user/getCurrentLanguage']
          let postForm = this.requestInfo
          let API = `users/${this.$store.state.user.uuid}/requests/direct`
          bugsnagClient.notify(e, {
            beforeSend: function (report) {
              report.metaData = {
                accountInfo: {
                  language: lang,
                  form: postForm,
                  post: API
                }
              }
            }
          })
        }
        console.log(e)
      })
    },
    onPlaceChanged (place, index) {
      let addressComponents = place.address_components
      let location = {}

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
          this.countryShortName = addressComponent.short_name
          this.requestInfo.countryId = this.getCountryId(this.countryShortName)

          location.country = addressComponent.long_name
        }
      }

      this.sendImpression('Enter Location')
      this.requestInfo.latitude = place.geometry.location.lat().toString()
      this.requestInfo.longitude = place.geometry.location.lng().toString()
      this.requestInfo.fullAddress = place.formatted_address.toString()
      location.latitude = place.geometry.location.lat().toString()
      location.longitude = place.geometry.location.lng().toString()
      this.questionLists[index].reply = place.formatted_address.toString()
      this.questionLists[index].location = location
    },
    getCountryId (countryName) {
      let countryId = this.$_.findWhere(countries, {'countryName': countryName})
      if (countryId) {
        return parseInt(countryId.id)
      } else {
        return this.$store.getters['user/getUserMobileCountryId'] || 234
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.q-map {
  border: none;
  border-bottom: 1px solid #bdbdbd;
  padding-bottom: 10px;
}

.q-map:focus {
  outline:none;
}
</style>
