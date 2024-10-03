<template>
  <q-page padding class="row justify-center">
    <div class="col-md-6 col-xs-11 bg-white animate-popup-down q-mb-xl q-pb-lg" v-if="preLoader">
        <h4 class="text-center">{{ $t(getServiceName(request.serviceId)) }}</h4>
        <div v-for="(questionForm, index) in questionLists" :key="questionForm.questionId" class="q-py-xs">
          <template v-if="questionForm.type === 'label'">
            <!--<p class="caption">{{ getQuestion(questionForm.id, index) }}</p>-->
            <p class="font-title q-ma-none q-mt-lg">{{ questionForm.content }}</p>
          </template>
          <template v-else-if="questionForm.type === 'personalItemSelector'" class="q-mb-lg">
            <q-select
              filled
              v-model="selectedPets"
              multiple
              :options="petOptions"
              label="Select Pets Here"
              class="full-width clickable"
              :readonly="true"
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
          <template v-else-if="questionForm.questionId === 90006" class="q-mb-lg">
            <q-input class="full-width" v-bind:class="(typeof(errors[index]) !== 'undefined') ? 'has-error' : ''" v-model.number="questionForm.reply" @change="onCheckError(index)" />
          </template>
          <template v-else-if="questionForm.type === 'radioButtonSelector'" >
            <q-select :class="(typeof(errors[index]) !== 'undefined') ? 'has-error' : ''" v-model="questionForm.reply" :options="questionToArray(questionForm.content)" class="full-width" @change="onCheckError(index)"></q-select>
          </template>
          <template v-else-if="questionForm.type === 'checkBoxSelector'">
            <q-select class="full-width" multiple :class="(typeof (errors[index]) !== 'undefined') ? 'has-error' : ''" v-model="questionForm.reply" :options="questionToArray(questionForm.content)" @input="onCheckError(index)"></q-select>
          </template>
          <template v-else-if="questionForm.type === 'inputBox'">
            <q-input class="full-width" v-bind:class="(typeof(errors[index]) !== 'undefined') ? 'has-error' : ''" v-model="questionForm.reply" @change="onCheckError(index)" />
          </template>
          <template v-else-if="questionForm.type === 'location' || questionForm.type === 'location_to' " >
            <q-input class="full-width clickable" v-bind:class="(typeof(errors[index]) !== 'undefined') ? 'has-error' : ''" @click.native="changeLocationModal = true" v-model="questionForm.reply" readonly @change="onCheckError(index)" />
            <q-dialog v-model="changeLocationModal">
              <q-card style="overflow: visible;max-width: 300px;border-radius: 20px;">
                <q-card-section>
                  <div class="protection-bulb">
                    <img src="statics/images/tip_icon.png" class="protection-bulb-image">
                  </div>
                  <div class="bg-white-self">
                    <div class="row justify-center column">
                      <div class="q-title q-mt-xl text-center protection-title text-weight-bold">{{$t('change.location.title')}}</div>
                    </div>
                    <div class="row text-justify q-mt-lg">
                      <div class="col-md-12 text-justify protection-desc">
                        <span>{{$t('change.location.description')}}</span>
                      </div>
                    </div>
                    <div class="row" style="margin-top: 30px;">
                      <div class="full-width q-mb-sm">
                        <q-btn color="primary" class="full-width text-capitalize" @click="$router.push(getServiceURL(request.requestInfo.serviceId))" :label="$t('create.request.now')" v-close-popup />
                      </div>
                      <div class="full-width q-mb-sm">
                        <q-btn flat class="full-width text-capitalize" :label="$t('chat.later')" dense v-close-popup />
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>
          </template>
          <template v-else-if="questionForm.type === 'numberBox'">
            <q-input class="full-width" v-bind:class="(typeof(errors[index]) !== 'undefined') ? 'has-error' : ''" v-model.number="questionForm.reply" @change="onCheckError(index)" />
          </template>
          <template v-else-if="questionForm.questionId === 90002 || questionForm.type === 'dateSelector'">
            <q-input filled class="clickable" readonly @click.native="$refs.qDate[0].show()" v-model="serviceStart" :rules="[serviceStart >= today || '* Required']">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-dialog ref="qDate" transition-show="scale" transition-hide="scale">
                    <q-date class="full-width" v-model="serviceStart" :options="checkDate" v-bind:class="(typeof(errors[index]) !== 'undefined') ? 'has-error' : ''" mask="YYYY-MM-DD" @input="onCheckError(index)"></q-date>
                  </q-dialog>
                </q-icon>
              </template>
            </q-input>
            <q-input filled class="clickable" readonly  @click.native="$refs.qTime[0].show()" v-model="serviceStartTime">
              <template v-slot:prepend>
                <q-icon name="fa fa-clock" class="cursor-pointer">
                  <q-dialog ref="qTime" transition-show="scale" transition-hide="scale">
                    <q-card style="min-width:350px;min-height:500px;">
                      <q-time class="full-width" v-model="serviceStartTime" mask="HH:mm"></q-time>
                      <q-card-actions align="right">
                        <q-btn label="OK" color="primary" flat v-close-popup />
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                </q-icon>
              </template>
            </q-input>
          </template>
          <template v-else>
            <q-input class="full-width" v-bind:class="(typeof(errors[index]) !== 'undefined') ? 'has-error' : ''" v-model.number="questionForm.reply" @change="onCheckError(index)" />
          </template>
        </div>
        <p class="q-my-xl"></p>

        <!-- Bottom Buttons -->
        <div class="fixed-bottom" style="z-index: 10;" v-if="$q.platform.is.mobile">
          <q-btn class="text-capitalize full-width q-pt-xs q-pb-md" :loading="editLoading" :disabled="editLoading" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" size="lg" :ripple="false" :label="$t('button.submit')" color="primary" @click="onSaveRequest"></q-btn>
        </div>
        <div class="q-mx-md q-mb-xl" v-else>
          <q-btn class="float-right q-my-lg q-mx-sm q-px-xl" :loading="editLoading" :disabled="editLoading" :label="$t('button.submit')" color="primary" @click="onSaveRequest"></q-btn>
          <q-btn class="float-right q-my-lg q-mx-sm" :label="$t('button.back')" @click="$router.go(-1)" v-if="$q.platform.is.desktop"></q-btn>
        </div>

        <!-- Prompt Dialog -->
        <dialog-prompt :trigger="promptModal" :message="promptMessage" :okButtonLabel="promptOkLabel" :cancelButtonLabel="promptCancelLabel" :persistent="promptPersistent" @on-ok="onPromptOk" @on-cancel="onPromptCancel" @on-close="triggerPromptDialog"></dialog-prompt>
    </div>
    <div v-else>
      <ComponentPreLoader></ComponentPreLoader>
    </div>
  </q-page>
</template>

<script>
/* eslint-disable no-eval */
import moment from 'moment'
import formListings from 'assets/form-request-v3.json'
import services from 'assets/services.json'
import status from 'assets/request-status.json'

export default {
  components: {
    'pet-selection-view': () => import('components/ComponentPetSelection.vue'),
    'dialog-prompt': () => import('components/DialogPrompt.vue')
  },
  data () {
    return {
      questionLists: null,
      serviceStart: moment().format('YYYY-MM-DD'),
      serviceStartTime: moment().format('HH:mm'),
      request: null,
      editLoading: false,
      today: moment().format('YYYY/MM/DD'),
      errors: [],
      STATUS: status,
      changeLocationModal: false,
      preLoader: false,
      personalItems: [],
      selectedPets: [],
      petOptions: [],
      personalItemLoader: false,
      promptModal: false,
      promptMessage: '',
      promptOkLabel: 'Save and Exit',
      promptCancelLabel: 'Later',
      promptPersistent: false
    }
  },
  created () {
    this.getRequest(this.$route.params.requestId)
    this.getPersonalItems()
    window.scroll(0, 0)
  },
  mounted () {
    history.pushState(null, null, location.href)

    // detect browser back button
    window.addEventListener('popstate', this.backButtonDetected, false)
  },
  beforeDestroy () {
    window.removeEventListener('popstate', this.backButtonDetected)
  },
  methods: {
    backButtonDetected (event) {
      if (event) {
        this.triggerPromptDialog(true, this.$t('save.all.changes'), this.$t('save.and.leave'), this.$t('exit.without.save'), this.$t('proceed.with.exit'), true)
      }
    },
    onPromptOk () {
      this.onSaveRequest()
    },
    onPromptCancel () {
      this.triggerPromptDialog(false)
      this.$router.go(-1)
    },
    triggerPromptDialog (status, message = '', okLabel = null, cancelLabel = null, persistent = false) {
      this.promptMessage = message
      this.promptOkLabel = okLabel
      this.promptCancelLabel = cancelLabel
      this.promptPersistent = persistent
      this.promptModal = status
    },
    addPetsModal () {
      if (this.petOptions.length === 0) {
        this.$q.notify({
          progress: true,
          group: 'add-more-pets',
          color: 'negative',
          message: `Add more pets to select here!`,
          timeout: 2500
        })
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
    getRequest: function (requestId) {
      this.$axios.get('users/' + this.$store.state.user.uuid + '/requests/' + requestId + '?v=6', {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        // prevent edit
        if (response.data.requestInfo.status !== this.STATUS.REQUEST_STATUS_PENDING) {
          this.$router.go(-1)
          return
        }

        this.request = response.data.requestInfo
        this.serviceName = this.request.serviceName
        let questionLists = JSON.parse(this.request.requestDescriptionJson).question
        for (var index in questionLists) {
          if (questionLists[index].questionId === 90002) {
            if (moment.utc(questionLists[index].reply).local().diff(this.today) >= 0) {
              this.serviceStart = moment.utc(questionLists[index].reply).local().format('YYYY-MM-DD')
              this.serviceStartTime = moment.utc(questionLists[index].reply).local().format('HH:mm')
            } else {
              this.serviceStart = moment().local().format('YYYY-MM-DD')
              this.serviceStartTime = moment().local().format('HH:mm')
            }

            if (this.serviceStart === 'Invalid date') {
              this.serviceStart = moment().local().format('YYYY-MM-DD')
              this.serviceStartTime = moment().local().format('HH:mm')
            }
          }

          if (questionLists[index].type === 'checkBoxSelector') {
            questionLists[index].reply = questionLists[index].reply.split(/\s*,\s*/)
          }
        }

        // insert current selected pets in request
        for (let pet in this.request.personalItemsInfo.items) {
          let petModel = {
            'label': this.request.personalItemsInfo.items[pet].title,
            'value': this.request.personalItemsInfo.items[pet].id
          }
          this.selectedPets.push(petModel)
        }

        this.questionLists = questionLists
        this.isEditRequestLoaded = true
      }).catch((error) => {
        this.forceLogout(error)
        console.error(error)
      }).finally(() => {
        this.preLoader = true
      })
    },
    getPersonalItems () {
      this.personalItemLoader = true
      this.$axios.get(`users/${this.$store.state.user.uuid}/personal-items?v=6`, {
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
    checkDate (serviceStart) {
      return serviceStart >= this.today
    },
    getServiceURL (id) {
      for (let items in services) {
        if (services[items].id === id) {
          return services[items].link
        }
      }
      return '/services'
    },
    getServiceName (id) {
      for (let items in services) {
        if (services[items].id === id) {
          return services[items].name
        }
      }
      return ''
    },
    questionToArray: function (arrayObject) {
      let arrayVal = null

      if (Array.isArray(arrayObject)) {
        arrayVal = arrayObject
      } else {
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
          value: arrayVal[i]
        })
      }
      return newListing
    },
    // Convert some input into values that will be accepted by the server
    modelConversion: function () {
      let questionLists = this.questionLists

      for (var index in questionLists) {
        if (questionLists[index].questionId === 90002) {
          questionLists[index].reply = moment(this.serviceStart + ' ' + this.serviceStartTime).utc().format('YYYY-MM-DD HH:mmZ')
        } else if (questionLists[index].questionId === 90006) {
          questionLists[index].reply = questionLists[index].reply
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
      return {'question': questionLists}
    },
    onSaveRequest: function () {
      if (!this.formValidation()) {
        this.$q.notify({
          'message': this.$t('requests.petboarding.error.fill.correct.information')
        })
        return
      }
      this.editLoading = !this.editLoading

      let requestInfo = {
        'requestDescriptionJson': JSON.stringify(this.modelConversion()),
        'requiredTime': moment(this.serviceStart + ' ' + this.serviceStartTime).utc().format('YYYY-MM-DD HH:mmZ'),
        'requestImage': '',
        'serviceId': this.request.serviceId,
        'latitude': this.request.latitude,
        'longitude': this.request.longitude,
        'fullAddress': this.request.fullAddress,
        'preferredCurrency': this.$store.getters['user/getUserPrefferedCurrency']
      }

      this.$axios.put('users/' + this.$store.state.user.uuid + '/requests/' + this.$route.params.requestId, JSON.stringify({requestInfo: requestInfo}), {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.editLoading = !this.editLoading
        this.$q.notify({
          message: `Your request has been updated`,
          timeout: 2000,
          type: 'positive',
          position: 'top'
        })
        this.$router.replace({name: 'ViewRequest', params: {requestId: this.$route.params.requestId}})
      }).catch(e => {
        let errorMessage = `An error has occurred when updating your request`
        if (e.response.data.message) {
          errorMessage = e.response.data.message
        }
        this.editLoading = !this.editLoading
        this.$q.notify({
          message: errorMessage,
          timeout: 3000
        })
      })
    },
    formValidation: function () {
      let questionLists = this.questionLists
      let check = true
      for (let i in questionLists) {
        if (questionLists[i].type !== 'label' && Number(questionLists[i].required) === 1) {
          if ((questionLists[i].type === 'checkBoxSelector' || questionLists[i].type === 'radioButtonSelector') && questionLists[i].reply.length < 1) {
            this.errors[i] = 'Array Error at ' + questionLists[i - 1].content
            console.error(this.errors[i])
            check = false
          } else if (questionLists[i].type === 'dateSelector') {
            if (this.serviceStart === '') {
              this.errors[i] = 'Error at ' + questionLists[i - 1].content
              console.error(this.errors[i])
              check = false
            }
          } else if (questionLists[i].reply === '') {
            this.errors[i] = 'Error at ' + questionLists[i - 1].content
            console.error(this.errors[i])
            check = false
          }
        }
      }
      return check
    },
    getQuestion (questionID, index) {
      let formLang = this.getServiceName(this.request.requestInfo.serviceId) + '.' + this.$store.getters['user/getCurrentLanguage']
      let currentLangForm = JSON.parse(formListings[formLang].story)
      if (index < currentLangForm.question.length) {
        return currentLangForm.question[index].listingDisplay
      }

      return null
    },
    onCheckError: function (index) {
      let questionLists = this.questionLists
      if (questionLists[index].type === 'dateSelector') {
        this.$refs.qDate[0].hide()
      }

      if (questionLists[index].type !== 'label') {
        if (Array.isArray(questionLists[index].repy) && questionLists[index].reply.length > 0) {
          if (typeof (this.errors[index]) !== 'undefined') {
            this.errors.splice(index, 1)
          }
        } else if (questionLists[index].reply !== '') {
          if (typeof (this.errors[index]) !== 'undefined') {
            this.errors.splice(index, 1)
          }
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.protection-bulb
  position: absolute
  top: 0
  left: calc(50% - 35px)
  padding: 10px
  background:  #fff
  width: 70px
  border-radius: 50%
  margin-top: -35px

.protection-bulb-image
  width: 50px

.protection-desc
  font-size: 16px
  color: #111

.protection-title
  font-size 20px
  color: #444
</style>
