<!-- request modal that appears after choosing a service type-->
<template>
  <div>
    <q-page class="row scroll justify-center q-pb-xl" padding>
        <div class="listing-content relative-position col-xs-12 col-md-9 col-xl-6" :class="!$q.platform.is.mobile ? isEditRequestLoaded && this.$route.query.avatar && this.$route.query.servname ? 'mt72' : 'mt58' : ''" v-if="isEditRequestLoaded">
          <q-linear-progress :value="percentage" style="display: none;" class="q-mt-md primary progress margin-auto progress-on-top" :class="$q.platform.is.mobile ? 'fixed-top' : isEditRequestLoaded && $q.platform.is.desktop && $route.query.avatar && $route.query.servname ? 't-84' : 't-72'"></q-linear-progress>
          <div ref="request-target" class="fixed-top" style="z-index: 100;" v-if="$route.query.avatar && $route.query.servname">
            <request-target-notification></request-target-notification>
          </div>
          <!-- Listing Question -->
          <template v-if="count !== (questionLists.length)">
            <!-- Request Question-->
            <div v-for="(question, num) in questionLists" :key="question.questionId">
              <!-- first ques -->
              <div v-if="question.type === 'label' && num === count" class="margin-bottom-20 text-weight-bold font-title" :style="$route.query.avatar && $route.query.servname ? 'margin-top: 50px; margin-left: 18px;' : 'margin-top: 20px; margin-left: 18px;'">
                {{ question.content }}
                <span class="strong emphasize" v-if="String(question.required) !== '1'">({{ $t('optional') }})</span>
              </div>
              <div v-if="question.type !== 'label' && num === count + 1" class="form-container q-mb-xl">
                <!-- if add new pet -->
                <div v-if="question.questionId === 4" class="row">
                    <q-card v-for="(option, index) in questionToArray(question.content)" :ref="option.value" :key="index" :class="checkSelect(option.value, question) ? 'picked' : '' " class="col-xs-5 col-md-2 q-mt-lg justify-center" @click="select($event, option, question)" style="margin-left: 20px;">
                        <img :src="getImgSrc(option.label, index, false)">
                        <q-card-section class="item-content cursor-pointer text-center">
                          <label :for="option.value" class="font-normal text-weight-bold">{{ option.label }}</label>
                        </q-card-section>
                    </q-card>
                </div>
                <!-- if pet breed is 'others' -->
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
                <!-- size of pet -->
                <div v-else-if="question.questionId === 8" class="row">
                  <q-card v-for="(option, index) in questionToArray(question.content)" :key="index" :ref="option.value" :class="checkSelect(option.value, question) ? 'picked' : '' " class="col-md-2 col-xs-5 q-mt-lg justify-center" @click="select($event, option.value, question)" style="margin-left: 20px;">
                      <img :src="getPetSizeImg(index)" />
                      <q-card-section class="item-content cursor-pointer text-center">
                        <label :for="option.value" class="font-normal text-weight-bold">{{ option.label }}</label>
                      </q-card-section>
                  </q-card>
                </div>
                <!-- first quest design format -->
                <div v-else-if="question.type === 'personalItemSelector'" class="row">
                    <div v-if="personalItemsLoader" class="col-md-12 col-xs-12 text-center">
                      <ComponentPreLoader></ComponentPreLoader>
                    </div>
                    <div v-else class="row">
                      <!-- the whole mini cards in select ur pet slide -->
                      <q-card v-for="(pet, index) in personalItems" :key="index" :ref="index" :class="checkSelect(index, question) ? '' : 'picked' " class="col-xs-5 col-md-2 q-mt-md justify-center petCard" @click="select($event, index, question)" style="margin-left: 20px;">
                        <img :src="getImgSrc(pet.image, question.questionId, pet.title) " :class="$q.platform.is.desktop ? 'petImgDesktop' : 'petImg'">
                        <!-- single card design -->
                        <q-card-section class="row cursor-pointer text-center q-px-xs q-py-sm" style="line-height: 1.2em;">
                          <div class="col">
                            <p class="font-normal text-weight-bold q-mb-xs">{{ pet.breed }}</p>
                            <p class="text-label font-small text-weight-light q-mb-xs" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{ pet.name || pet.weight }}</p>
                          </div>
                          <div class="col-1" v-if="checkSelect(index, question)">
                            <q-icon name="fas fa-check-circle" size="sm" class="text-primary float-right" style="top: 10px;"></q-icon>
                          </div>
                        </q-card-section>
                      </q-card>
                      <!-- Add Another Pet button in select ur pet slide -->
                      <q-card ref="-1" class="col-xs-5 col-md-2 q-mt-md justify-center petCard" @click="select($event, -1, question)" style="margin-left: 20px;">
                        <img src="statics/images/pets/add-pet.jpg" :class="$q.platform.is.desktop ? 'petImgDesktop' : 'petImg'">
                        <q-card-section class="cursor-pointer text-center q-px-xs q-py-sm" style="line-height: 1.2em;">
                          <p class="font-normal text-weight-bold q-mb-xs">{{$t('add.another.pet')}}</p>
                          <p class="text-label font-small text-weight-light q-mb-xs" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{$t('add.another.pet.tap.here')}}</p>
                        </q-card-section>
                      </q-card>
                    </div>
                </div>
                <!-- second quest (ex: visit type)-->
                <div v-else-if="question.type === 'radioButtonSelector'" class="row">
                    <q-card v-for="(option, index) in questionToArray(question.content)" :ref="option.value" :key="index" :class="checkSelect(option.value, question) ? '' : 'picked' " class="col-xs-5 col-md-2 q-mt-lg justify-center" @click="select($event, option.value, question)" style="margin-left: 20px;">
                      <!--<img :src="getImgSrc(option.label, question.questionId)">-->
                      <q-card-section class="item-content cursor-pointer text-center">
                        <label :for="option" style="font-size: 16px" class="text-weight-bold">{{ option.value }}</label>
                        <q-badge floating v-if="checkSelect(option.value, question)" color="none" outline style="border: none;top: -10px; right: -10px;">
                          <q-icon name="fas fa-check-circle" size="sm" class="text-primary"></q-icon>
                        </q-badge>
                      </q-card-section>
                    </q-card>
                </div>
                <div v-else-if="question.type === 'checkBoxSelector'" class="row">
                    <q-card v-for="(option, index) in questionToArray(question.content)" :ref="option.value" :key="index" :class="checkSelect(option, question) ? '' : 'picked' " class="col-xs-5 col-md-2 q-mt-lg justify-center" @click="select($event, option.value, question)" style="margin-left: 20px;">
                      <q-card-section class="item-content cursor-pointer text-center">
                        <label :for="option" style="font-size: 16px" class="text-weight-bold">{{ option.value }}</label>
                        <q-badge floating v-if="checkSelect(option.value, question)" color="none" outline style="border: none;top: -10px; right: -10px;">
                          <q-icon name="fas fa-check-circle" size="sm" class="text-primary"></q-icon>
                        </q-badge>
                      </q-card-section>
                    </q-card>
                </div>
                <!-- quest on choosing start date n time of service -->
                <div v-else-if="question.questionId === 90002" class="row">
                  <q-input class="input col-md-12 col-xs-11" readonly placeholder="Select Date" v-model="serviceStartFormat" @click.native="$refs.qDate[0].show()" borderless dense style="margin-left: 18px;">
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer q-pa-sm">
                        <q-dialog ref="qDate" transition-show="scale" transition-hide="scale" style="max-height: 50vh;">
                          <q-date class="full-width" v-model="serviceStart" :options="checkDate" mask="YYYY-MM-DD" @input="onCheckError(num)"></q-date>
                        </q-dialog>
                      </q-icon>
                    </template>
                  </q-input>
                  <q-input class="input col-md-12 col-xs-11 service_time" readonly :label="serviceStartTime !== null ? '' : 'Select Time'" type="time" v-model="serviceStartTime" @click.native="$refs.qTime[0].show()"  mask="##:##" style="margin-top: 25px; margin-left: 18px;" borderless dense>
                    <template v-slot:prepend>
                        <q-icon name="access_time" class="cursor-pointer q-pa-sm">
                          <q-dialog ref="qTime" transition-show="scale" transition-hide="scale" style="max-height: 50vh;">
                            <q-time class="full-width" v-model="serviceStartTime" mask="HH:mm" @input="onCheckError(num)"></q-time>
                          </q-dialog>
                        </q-icon>
                    </template>
                  </q-input>
                </div>
                <!-- quest on choosing end date n time of service -->
                <div v-else-if="question.questionId === 90006" class="row">
                  <q-input class="input col-md-12 col-xs-11" placeholder="Select Date" readonly v-model="serviceEndFormat" @click.native="$refs.qDate[0].show()" borderless dense style="margin-left: 18px;">
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer q-pa-sm">
                        <q-dialog ref="qDate" transition-show="scale" transition-hide="scale">
                          <q-date class="full-width" v-model="serviceEnd" :events="[MOMENT(serviceStart).format('YYYY/MM/DD')]" :options="checkEndDate" mask="YYYY-MM-DD" @input="onCheckError(num)">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup :label="$t('button.save')" color="primary" flat></q-btn>
                            </div>
                          </q-date>
                        </q-dialog>
                      </q-icon>
                    </template>
                  </q-input>
                  <q-input class="input col-md-12 col-xs-11 service_time" placeholder="Select Time" :label="serviceEndTime !== null ? '' : 'Select Time'" type="time" v-model="serviceEndTime" readonly @click.native="$refs.qTime[0].show()"  mask="##:##" style="margin-top: 25px; margin-left: 18px;" borderless dense>
                    <template v-slot:prepend>
                        <q-icon name="access_time" class="cursor-pointer q-pa-sm">
                          <q-dialog ref="qTime" transition-show="scale" transition-hide="scale">
                            <q-time class="full-width" v-model="serviceEndTime" mask="HH:mm" @input="onCheckError(num)">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup :label="$t('button.save')" color="primary" flat></q-btn>
                              </div>
                            </q-time>
                          </q-dialog>
                        </q-icon>
                    </template>
                  </q-input>
                </div>
                <!-- quest whr they ask whr u want ur service to be -->
                <div v-else-if="question.type === 'location' || question.type === 'location_to'" class="row">
                  <google-autocomplete :className="'input'" :place="question.reply" v-model="question.reply" @place-changed="onPlaceChanged($event, num, question.type === 'location')" class="col-md-12 col-xs-11 input" style="margin-left:18px;"></google-autocomplete>
                </div>
                <!-- number of days part / any input field-->
                <div v-else-if="question.type === 'numberBox'" class="row">
                  <q-input class="input col-xs-11" v-model.number="question.reply" mask="###" style="margin-left:18px;" dense borderless></q-input>
                </div>
                <div v-else-if="question.type === 'inputBox'" class="row" style="height: 250px;">
                  <q-input
                    type="textarea"
                    v-model="question.reply"
                    class="col-xs-11 col-md-12 input"
                    dense
                    borderless
                    style="margin-left:18px;white-space: pre-wrap;"
                    rows="12"
                    :placeholder="question.content"
                  />
                </div>
              </div>
            </div>
            <!-- END of Request Question-->
            <p class="text-red text-italic text-bold" v-if="error">{{ error }}</p>
            <div class="row justify-center q-mt-lg" v-if="$q.platform.is.desktop">
              <q-btn class="q-mx-sm" v-if="count > 0 && count !== 6" @click.native="updateCurrentCount()">{{ $t('button.back') }}</q-btn>
              <q-btn class="q-mx-sm" color="primary" v-if="(count >= petLists.length) && !personalItemsLoader" @click.native="nextButtonClick()" v-bind:class="{'opacity-6': !listCheck}">{{ $t('button.next') }}</q-btn>
            </div>
          </template>
          <!-- END OF Listing Question -->
          <template v-else>
            <!--
            <div v-if="!$store.getters['user/getUserAccessState']">
              <div class="row">
                <p class="col-xs-11 text-weight-bold" style="font-size: 18px;min-width: 88%;margin-bottom: 25px; margin-left: 15px;">Almost done! We need your name and email to inform you when you receive responses from Backers.</p>
              </div>
              <div class="row">
                <q-input class="input col-md-12 col-xs-11" v-model="form.name" placeholder="Enter name here" borderless dense style="min-width: 88%;margin-bottom: 20px; margin-left: 15px; margin-right: 15px;" @keyup.enter="$refs.enterEmail.focus()" autofocus></q-input>
                <q-input class="input col-md-12 col-xs-11" :error="$v.form.$error" v-model="form.email" placeholder="Enter email here" ref="enterEmail" borderless dense style="min-width: 88%;margin-bottom: 20px; margin-left: 15px; margin-right: 15px; padding-bottom: 0px;" @keyup.enter="$refs.reEnterEmail.focus()" autofocus/>
                <div class="text-red-14 text-left text-weight-light" v-if="!$v.form.email.required && displayError"> {{ $t('vuelidate.please.enter.email') }} </div>
                <div class="text-red-14 text-left text-weight-light" v-if="!$v.form.email.email && displayError"> {{ $t('vuelidate.email.invalid') }} </div>

                <q-input class="input col-md-12 col-xs-11" :error="$v.form.$error" v-model="form.repeatEmail" ref="reEnterEmail" placeholder="Enter email again" borderless dense style="min-width: 88%;margin-bottom: 100px; margin-left: 15px; margin-right: 15px; padding-bottom: 0px;" autofocus/>
                <div class="text-red-14 text-left text-weight-light" v-if="!$v.form.email.required && displayError">{{ $t('vuelidate.repeat.email.empty') }}</div>
                <div class="text-red-14 text-left text-weight-light" v-if="!$v.form.repeatEmail.sameAsEmail && displayError">{{ $t('vuelidate.repeat.email.same') }}</div>

                <div class="row col-md-12 text-center" style="margin-top: 100px; ">
                  <p class="text-center col-xs-12 text-weight-medium" style="font-size: 16px;">{{ $t('already.have.account') }} <span class="anchor-link" @click="$q.localStorage.set('localStorageRequestInfo', {requestInfo: requestInfo}), $router.push('/login/email')">{{ $t("login") }} </span></p>
                  <div class="text-middle-line text-weight-medium" style="width: 80%;font-size: 16px; color: black;margin-left: auto; margin-right: auto;">
                    <span class="text-uppercase">{{ $t('or') }}</span>
                  </div>
                  <div class="col-xs-12">
                    <p class="text-center text-weight-medium" style="font-size: 16px; margin-top: 20px;">{{ $t('continue.with') }}</p>
                    <q-btn no-caps round  style="background-color: #3C5A99;height: 30px; width: 40px;margin-right: 15px;" @click.native="sendImpression('Login', 'FB'), onAuthFacebook()" :loading="fbloading" >
                      <q-icon name="fab fa-facebook-f" style="color:white;" alt="log in facebook"/>
                    </q-btn>
                    <q-btn no-caps style="height:30px; width:40px; margin-left: 15px;" @click.native="sendImpression('Login', 'G+'), onAuthGoogle()" round :loading="googleLoading" :disabled="googleLoading" >
                      <img src="statics/images/google_logo.png" style="height: 45px; width: 45px;" alt="log in google">
                    </q-btn>
                  </div>
                </div>
              </div>
            </div>
            -->
            <!-- Summary Page -->
            <!-- <div class="row text-center q-mb-xl">
              <p class="col-md-12 col-xs-12 emphasize strong font-xx-large">{{ $t('request.summary') }}</p>
              <p class="col-md-12 col-xs-12 font-weight-light font-normal" v-if="!sitterName">{{ $t('request.confirm.edit') }}</p>
              <p class="col-md-12 col-xs-12 font-weight-light font-normal" v-else>{{ $t('request.confirm.edit.direct', {username: sitterName}) }}</p>
              <p class="col-md-12 col-xs-12 anchor-normal font-header-title ">{{ $t('service.selected') }}</p>
              <p class="col-md-12 col-xs-12 emphasized strong font-normal">{{ requests.serviceName }}</p>
              <div v-for="(questionForm, index) in questionLists" :key="questionForm.questionId" class="col-md-12 col-xs-12 small-gutter">
                <div v-if="index > 5">
                  <div v-if="questionForm.type === 'label'">
                    <p class="anchor cursor-pointer font-header-title q-mb-none" @click="count = index">{{ questionForm.content }}</p>
                  </div>
                  <div v-if="questionForm.questionId === 90002">
                    <p class="label cursor-pointer font-normal" @click="count = index-1" >{{serviceStartFormat + ' - ' + MOMENT(serviceStartTime, 'HH:mm').format('hh:mma')}}</p>
                  </div>
                  <div v-else-if="questionForm.questionId === 90006">
                    <p class="label cursor-pointer font-normal" @click="count = index-1">{{serviceEndFormat + ' - ' + MOMENT(serviceEndTime, 'HH:mm').format('hh:mma')}}</p>
                  </div>
                  <div v-else class="auto">
                    <p class="label cursor-pointer font-normal" @click="count = index-1" v-html="replyConversion(questionForm.reply)"></p>
                  </div>
                </div>
              </div>
              <div class="col-md-12 q-mt-md" v-if="$q.platform.is.desktop">
                <q-btn class="q-mx-sm" v-if="count > 0" @click="count = 6">{{ $t('requests.page.editrequest') }}</q-btn>
                <q-btn class="q-mx-sm" color="primary" :loading="showLoading" @click="submitListing()">{{ $t('button.submit') }}</q-btn>
              </div>
            </div> -->
            <!-- END OF Summary Page -->
            <!-- Submitting Loader -->
            <div class="q-mb-xl">
              <h4 class="text-center text-weight-bold">{{Math.round(this.submitPercentage * 100)}}%</h4>
              <q-linear-progress size="18px" style="border-radius: 11px;" :value="submitPercentage" class="q-my-md"></q-linear-progress>
              <transition-group appear class="row text-center" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
                <p class="q-my-none col-12 q-my-sm text-grey-7 font-normal" key="request-submitting">{{$t('please.wait.while.request.being.submit')}}</p>
                <p class="q-my-none col-12 q-my-sm text-grey-7 font-normal" key="request-send-out" v-if="submitPercentage > 0.10">{{$t('your.request.is.being.sent.out')}}</p>
                <p class="q-my-none col-12 q-my-sm text-grey-7 font-normal" key="searching-backers" v-if="submitPercentage > 0.35">{{$t('searching.nearby.backers')}}</p>
                <p class="q-my-none col-12 q-my-sm text-grey-7 font-normal" key="matching-backers" v-if="submitPercentage > 0.66">{{$t('matching.suitable.backers')}}</p>
                <p class="q-my-none col-12 q-my-sm text-grey-7 font-normal" key="contacting-backers" v-if="submitPercentage > 0.80">{{$t('contacting.available.backers')}}</p>
              </transition-group>
            </div>
          </template>
        </div>
      <div v-else>
        <ComponentPreLoader></ComponentPreLoader>
      </div>
  </q-page>
    <!-- Dynamic Prompt Dialog -->
    <dialog-prompt :trigger="promptModal" :message="promptMessage" :okButtonLabel="promptOkLabel" :cancelButtonLabel="promptCancelLabel" :persistent="promptPersistent" @on-ok="onPromptOk" @on-cancel="onPromptCancel" @on-close="triggerPromptDialog"></dialog-prompt>

    <!-- BUTTON BOTTOM will appear on mobile screen -->
    <div class="row text-center fixed-bottom lt-lg" v-if="isEditRequestLoaded">
      <div class="col-xs-12" v-if="count === (questionLists.length - 2)" :disabled="showLoading" @click="submitRequest">
        <div class="full-width z999 text-white q-pa-md bg-primary cursor-pointer font-header-title-large" :class="{'q-pb-lg': $q.platform.is.cordova}">
          <span v-if="!showLoading">{{ $t('button.submit') }}</span>
          <span v-else><q-spinner></q-spinner></span>
        </div>
      </div>
      <div class="col-xs-12" v-else-if="count >= petLists.length && count < (questionLists.length)" @click="nextButtonClick" >
        <div class="full-width z999 text-white q-pa-md bg-primary cursor-pointer font-header-title-large" :class="{'custom-disabled' : !listCheck, 'q-pb-lg': $q.platform.is.cordova}">{{ $t('button.next') }}</div>
      </div>
    </div>
</div>
</template>

<script>
/* global bugsnagClient */
/* eslint-disable no-eval */
/* eslint-disable no-useless-escape */
/* eslint-disable vue/no-side-effects-in-computed-properties */
/* eslint-disable vue/no-async-in-computed-properties */
import moment from 'moment'
import services from 'assets/services.json'
import countries from 'assets/countries.json'
import formListing from 'assets/form-request-v3.json'
import createPetForm from 'assets/form-create-pet.json'
import authFlowMixin from '../mixins/authFlowMixin.js'
import { validationMixin } from 'vuelidate'
import { required, email, sameAs } from 'vuelidate/lib/validators'
import languages from 'assets/languages.json'

export default {
  mixins: [authFlowMixin, validationMixin],
  name: 'router-view',
  props: {
    userCount: Number
  },
  components: {
    'google-autocomplete': () => import('components/ComponentGmapAutocomplete'),
    RequestTargetNotification: () => import('components/RequestTargetNotification'),
    'dialog-prompt': () => import('components/DialogPrompt.vue')
  },
  data () {
    return {
      form: {
        name: null,
        email: null,
        repeatEmail: null
      },
      displayError: false,
      languageOptions: languages.filter(({active}) => active === true),
      isEditRequestLoaded: null,
      questionLists: [],
      user: null,
      input: 'input',
      // serviceStart: moment().format('YYYY-MM-DD'),
      serviceStart: null,
      // serviceStartFormat: moment(this.serviceStart).format('Do MMMM, YYYY'),
      serviceStartFormat: null,
      // serviceStartTime: moment().format('HH:mm'),
      serviceStartTime: null,
      serviceEnd: null,
      serviceEndFormat: null,
      serviceEndTime: null,
      count: 0,
      listCheck: false,
      showLoading: false,
      today: moment(),
      agreeAgreement: false,
      sendToAllProviders: false,
      sitterUuid: null,
      sitterServiceId: null,
      sitterName: null,
      error: false,
      serviceId: null,
      bizid: this.$route.query.ref || null,
      broadcast: this.$route.query.broadcast || null,
      requestInfo: {
        budget: 0,
        countryId: this.getCountryIdOnLoad(),
        promoCode: '',
        fullAddress: this.getFullAddress(),
        isStory: 1,
        latitude: this.$route.query.lat || null,
        longitude: this.$route.query.lon || null,
        requestDescription: '',
        requestDescriptionJson: null,
        requestImage: [],
        requiredTime: null,
        serviceId: null,
        src: this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5,
        adwordsInfo: {
          ga: this.$route.query._ga || '',
          gac: this.$route.query._gac || ''
        },
        serviceUserId: this.$route.query.serv || null,
        sourceServiceUserId: this.$route.query.serv || 0,
        referrer_domain: window.location.host,
        reassignAllowed: 0
      },
      petInfo: {
        ID: null,
        type: null,
        weight: null,
        breed: null,
        image: null,
        name: null
      },
      isLocationSet: false,
      requests: null,
      countryShortname: 'US',
      QUESTION_PET_TYPE_ID: [4, 104],
      petType: this.$route.query['pet-type[]'] || null,
      userStatus: 0,
      petLists: null,
      userSearch: '',
      petBreeds: [],
      personalItems: [],
      breedLoading: true,
      dateError: false,
      MOMENT: moment,
      requestLists: null,
      serviceType: null,
      newPetCount: 0, // keep track of new pets created
      newPets: [],
      personalItemsLoader: false,
      promptModal: false,
      promptMessage: '',
      promptOkLabel: null,
      promptCancelLabel: null,
      promptPersistent: false,
      submitPercentage: 0,
      interval: null,
      requestReference: null,
      onError: null
    }
  },
  computed: {
    percentage () {
      if (this.questionLists.length === 0) {
        return 0
      }

      let input = null
      if (this.count < this.questionLists.length) {
        input = this.questionLists[this.count + 1]
      }

      // temporarily store pet info
      if ((!this.$store.getters['user/getUserAccessState'] || this.$store.getters['user/getUserUuidState'] === null) && input.questionId === 90002) {
        // remove pre-existing pet info to ensure latest info
        if (this.$q.localStorage.getItem('localStoragePetInfo')) {
          this.$q.localStorage.remove('localStoragePetInfo')
        }

        this.$q.localStorage.set('localStoragePetInfo', {petsInfo: this.newPets})
      }

      // Form manipulation which occurs until end of question lists
      if (this.questionLists && (this.count < this.questionLists.length)) {
        if (this.serviceType !== 'services.dogwalking' && this.QUESTION_PET_TYPE_ID.indexOf(input.questionId) > -1) {
          if (this.petType !== null) {
            let petTypeIndex = parseInt(this.petType)
            let petTypeContent = this.questionToArray(input.content)

            if (petTypeIndex > petTypeContent.length) {
              // bugsnagClient.notify(new Error('Size of pet-type[] query string is larger than input content.'))
            } else {
              input.reply.push(petTypeContent[petTypeIndex - 1].value)
            }
          }
        }
        // Initialized date to today if reply is empty
        if (input.questionId === 90002) {
          if (this.serviceStart) {
            this.serviceStartFormat = moment(this.serviceStart).format('Do MMMM, YYYY')
            // this.serviceStartTime = moment().add(3, 'hours').format('HH:mm')
          }
        } else if (input.questionId === 90006) {
          if (this.serviceEnd) {
            this.serviceEndFormat = moment(this.serviceEnd).format('Do MMMM, YYYY')
            // this.serviceEndTime = moment().add(3, 'hours').format('HH:mm')
          }
        } else if (input.questionId === 90018) {
          if (input.reply === '') {
            input.reply = []
          }
        }

        // Initialized number with 1
        if (input.type === 'numberBox') {
          if (input.reply === '') {
            input.reply = 1
          }
        }
      }
      // Disable continue button until form is properly filled
      // but first check if the field is required or not
      if (input && Number(input.required) === 1) {
        if (input.type === 'dateSelector' || (input.type === 'numberBox' && input.questionId === 90006)) {
          let todayMoment = moment().format('YYYY-MM-DD')
          let userRequiredTimeMoment = moment(this.serviceStart).format('YYYY-MM-DD')
          if (input.questionId === 90002) {
            if (this.serviceStart === null || this.serviceStartTime === null) {
              this.listCheck = false
              this.dateError = true
              return (this.count / (this.questionLists.length))
            }
          }
          if (input.questionId === 90006) {
            if (this.serviceEnd === null || this.serviceEndTime === null) {
              this.listCheck = false
              this.dateError = true
              return (this.count / (this.questionLists.length))
            }
            userRequiredTimeMoment = moment(this.serviceEnd).format('YYYY-MM-DD')
          }

          if (moment(userRequiredTimeMoment).diff(todayMoment, 'days') > 364) {
            this.listCheck = false
            this.errorCheck()
            return (this.count / (this.questionLists.length))
          } else if (moment(userRequiredTimeMoment).diff(todayMoment, 'days') < 0) {
            this.listCheck = false
            this.dateError = true
            this.errorCheck(0)
            return (this.count / (this.questionLists.length))
          } else {
            this.listCheck = true
            this.dateError = false
          }
        } else if (Array.isArray(input.reply)) {
          if (input.reply.length < 1) {
            this.listCheck = false
          } else {
            this.listCheck = true
          }
        // input validation for no of days
        } else if (input.type === 'numberBox' && (parseInt(input.reply) < 1 || parseInt(input.reply) > 364)) {
          this.listCheck = false
        } else if (!input.reply) {
          this.listCheck = false
        } else {
          this.listCheck = true
        }
      }
      this.error = false

      // return percentage
      if (this.count === 0) {
        this.newPetCount++
        this.$emit('percentage', 0)
        return 0
      }

      //  return to navbar
      this.$emit('percentage', (this.count / (this.questionLists.length)))

      return (this.count / (this.questionLists.length))
    },
    langChange () {
      return this.$store.state.user.language
    },
    filteredBreeds () {
      var search = this.userSearch.toLowerCase()
      return this.petBreeds.filter(function (breed) {
        return breed.name.toLowerCase().includes(search)
      })
    }
  },
  watch: {
    userCount: function (value) {
      this.count = this.userCount

      // send data to google analytics
      //  this.sendData(this.count)
    },
    langChange (newValue, oldValue) {
      this.isEditRequestLoaded = false
      Object.assign(this.$data, this.$options.data.apply(this))
      this.onListingLoad()

      if (this.$store.getters['user/getUserAccessState']) {
        this.getPersonalItems()
        this.count = this.petLists.length
      }
    },
    $route (to, from) {
      this.isEditRequestLoaded = false
      Object.assign(this.$data, this.$options.data.apply(this))
      this.onListingLoad()

      // check for pets
      if (this.$store.getters['user/getUserAccessState']) {
        this.getPersonalItems()
        this.count = this.petLists.length
      }
    }
  },
  created () {
    this.onListingLoad()

    // check for pets
    if (this.$store.getters['user/getUserAccessState']) {
      this.getPersonalItems()
      this.count = this.petLists.length
    }

    // Adding request states to api call
    Object.keys(this.$store.state.request).forEach(key => {
      if (this.$store.state.request[key] !== null) {
        this.requestInfo[key] = this.$store.state.request[key]
      }
    })
  },
  mounted () {
    if (this.$refs['request-target']) {
      this.$refs['request-target'].style.top = `${this.$parent.$parent.$parent.$refs.navbar.$el.clientHeight + 1}px`
    }

    if (document.querySelector('.pac-container')) {
      document.querySelector('.pac-container').remove()
    }

    history.pushState(null, null, location.href)

    // detect browser back button
    window.addEventListener('popstate', this.backButtonDetected, false)

    if (this.$route.query._gac) {
      let _gac = this.$route.query._gac.split('.')
      let gclid = _gac[_gac.length - 1]
      this.requestInfo['gclid'] = gclid
    } else if (this.$route.query.gclid) {
      this.requestInfo['gclid'] = this.$route.query.gclid
    } else {
      this.requestInfo['gclid'] = this.$store.getters['request/getRequestGclidState']
    }
    this.$store.commit('request/updateRequestGclidState', this.requestInfo['gclid'])
  },
  beforeDestroy () {
    window.removeEventListener('popstate', this.backButtonDetected)
    clearInterval(this.interval)
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      username: {
        required
      },
      password: {
        required
      },
      repeatEmail: {
        sameAsEmail: sameAs('email')
      }
    }
  },
  methods: {
    triggerPromptDialog (status, message = null, okLabel = null, cancelLabel = null, persistent = null) {
      if (message) {
        this.promptMessage = message
      }

      if (okLabel) {
        this.promptOkLabel = okLabel
      }

      if (cancelLabel) {
        this.promptCancelLabel = cancelLabel
      }

      if (persistent) {
        this.promptPersistent = persistent
      }

      this.promptModal = status
    },
    onPromptOk () {
      this.triggerPromptDialog(false)
    },
    onPromptCancel () {
      if (this.count === 6) {
        this.$router.go(-1)
      } else {
        this.$router.replace({name: 'MobileDashboard'})
      }

      this.$emit('current-count', 6)
      setTimeout(() => {
        this.triggerPromptDialog(false)
      }, 0)
    },
    cancelRequest () {
      this.triggerPromptDialog(true, this.$t('few.steps.away.from.completing.your.request'), this.$t('button.continue'), this.$t('cancel.request'), true)
    },
    backButtonDetected (event) {
      if (this.count === 6) {
        this.triggerPromptDialog(true, this.$t('few.steps.away.from.completing.your.request'), this.$t('button.continue'), this.$t('cancel.request'), true)
      } else if (this.count === 0) {
        this.count = 6
      } else {
        this.count -= 2
      }
    },
    submitSignup () {
      let vm = this
      vm.signupLoading = !vm.signupLoading
      vm.form.email = vm.form.email.replace(/ /g, '')
      vm.form.repeatEmail = vm.form.repeatEmail.replace(/ /g, '')

      vm.displayError = !vm.displayError
      vm.$v.form.$touch()

      /**
       * Disable the form to be submitted if the user
       * has not completed the form
       */
      if (vm.$v.form.$error) {
        vm.signupLoading = !vm.signupLoading
        return null
      }

      vm.accountInfo.email = vm.form.email
      vm.accountInfo.password = vm.form.password
      vm.accountInfo.username = vm.form.username
      vm.accountInfo.language = this.$_.findWhere(languages, {'value': this.$store.state.user.language}).id
      let accountInfo = JSON.stringify({
        'accountInfo': vm.accountInfo
      })

      vm.$q.localStorage.set('globalStorageSignupAccountInfo', accountInfo)

      // If we don't have cached request, then user will go to the verification page
      /*  if (!vm.$q.localStorage.getItem('localStorageRequestInfo')) {
        vm.$router.push('/user/verification')
      } */

      vm.signupLoading = true
      if (typeof accountInfo !== 'string') {
        vm.$q.notify({
          message: vm.$t('register.error'),
          type: 'negative'
        })

        bugsnagClient.notify(new Error('Account Info is empty when trying to register new user with accountInfo' + JSON.stringify(accountInfo)))

        this.$router.replace('/')
        return
      }

      /**
       * Remove the accountInfo session to prevent from submitting again
       * in case user decided to reload the page
       */
      this.$q.localStorage.remove('globalStorageSignupAccountInfo')
      this.$axios.post(`/account`, accountInfo)
        .then((response) => {
          vm.$q.localStorage.set('globalStorageAccountInfo', response.data)
          vm._processLogin(
            response.data.accountInfo.id,
            response.data.accountInfo.token,
            response.data.accountInfo.avatarImage,
            response.data.accountInfo.email,
            response.data.accountInfo.preferredCurrency,
            response.data.accountInfo.mobileCountryId,
            response.data.accountInfo.language,
            response.data.accountInfo.mobileNum,
            response.data.accountInfo.username,
            response.data.accountInfo.createdDate,
            response.data.accountInfo.referralCode,
            response.data.accountInfo.idVerified,
            response.data.accountInfo.selfieVerified,
            response.data.accountInfo.emailVerified,
            response.data.accountInfo.facebookVerified,
            response.data.accountInfo.googleVerified,
            response.data.accountInfo.credits,
            response.data.accountInfo.businessVerified,
            response.data.accountInfo.contactLine,
            response.data.accountInfo.contactWechat,
            response.data.accountInfo.contactWhatsapp,
            response.data.accountInfo.proVerified,
            response.data.accountInfo.serviceProvider,
            response.data.accountInfo.examCertified,
            response.data.accountInfo.sitterIntroVerified
          )
        })
        .catch(e => {
          vm.signupLoading = !vm.signupLoading
          console.log(e)
          let errorMessage = e.response.data.message || vm.$t('signup.fail')
          vm.$q.notify({
            message: errorMessage,
            type: 'negative'
          })
          setTimeout(() => {
            vm.$router.replace('/')
          }, 2000)
        })
    },
    // Load the dynamic form based on questionnaire from the server
    onListingLoad () {
      this.questionLists = []
      let language = this.getLanguage()
      this.serviceType = this.getServiceName()
      let fullServiceName = this.serviceType + '.' + language
      let response = formListing[fullServiceName]

      // to get service name for display later
      this.requests = response

      // display service type on navbar (mobile view)
      this.$emit('service-name', this.requests.serviceName)

      let listingForm = JSON.parse(response.story.replace('\\', '')).question
      let petForm = createPetForm[language]

      // fall back en
      if (!petForm) {
        petForm = createPetForm['en']
      }
      petForm = JSON.parse(petForm.questionShort.replace('\\', '')).question
      this.sendImpression('Start Request', response.serviceName)

      // convert questions
      this.petLists = this.convertForm(petForm)
      for (let i = 0; i < this.petLists.length; i++) {
        this.questionLists.push(this.petLists[i])
      }
      this.requestLists = this.convertForm(listingForm)
      this.requestLists[1].reply = []
      for (let i = 0; i < this.requestLists.length; i++) {
        this.questionLists.push(this.requestLists[i])
      }

      this.isEditRequestLoaded = true
      // send data to google analytics
      //  this.sendData(this.count)
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
          if (questionLists[i].type === 'dateSelector') {
            if (questionLists[i].reply) {
              questionLists[i].reply = moment(questionLists[i].reply, 'DD/MM/YYYY').format('YYYY-MM-DD')
              this.serviceStart = questionLists[i].reply
            } else {
              questionLists[i].reply = ''
            }
          } else {
            if (!questionLists[i].reply) {
              questionLists[i].reply = ''
            }
          }
        }

        // Automatically assign values from GET uri if any
        if (questionLists[i].type === 'location' && this.$route.query.reqlocation !== undefined && this.$route.query.reqlocation !== '') {
          questionLists[i].reply = this.$route.query.reqlocation.replace(/--/g, ', ').replace(/-/g, ' ').replace(/~/g, '-')
        }
        // Prefilled location
        if (questionLists[i].type === 'location_to' || questionLists[i].type === 'location') {
          if (this.$store.state.geolocation.data) {
            console.log('geolocation data', this.$store.state.geolocation.data)
            questionLists[i].reply = this.$store.state.geolocation.data.geoplugin_city + ', ' + this.$store.state.geolocation.data.geoplugin_region + ', ' + this.$store.state.geolocation.data.geoplugin_countryName

            this.requestInfo.latitude = this.$store.state.geolocation.data.geoplugin_latitude
            this.requestInfo.longitude = this.$store.state.geolocation.data.geoplugin_longitude
            this.requestInfo.fullAddress = this.$store.state.geolocation.data.geoplugin_city + ', ' + this.$store.state.geolocation.data.geoplugin_region + ', ' + this.$store.state.geolocation.data.geoplugin_countryName
            this.countryShortName = this.$store.state.geolocation.data.geoplugin_countryCode
            this.requestInfo.countryId = this.getCountryId()
            console.log('geolocation data', this.$store.state.geolocation.data)
          }

          if (this.requestInfo.countryId === 234) {
            this.requestInfo.countryId = this.$store.getters['user/getUserMobileCountryId']
          }

          // update user mobile country id
          this.$store.commit('user/updateUserMobileCountryIdState', parseInt(this.requestInfo.countryId))
        }
        if (questionLists[i].type === 'dateSelector' && this.$route.query.start_date !== undefined && this.$route.query.start_date !== '') {
          let startDate = moment(this.$route.query.start_date, 'DD-MM-YYYY')
          // Ensure user choose a date either today or above todays date
          if (startDate.diff(this.today, 'days') >= 0) {
            this.serviceStart = moment(this.$route.query.start_date, 'DD-MM-YYYY', true).format('YYYY-MM-DD')
          }
        }
        if (questionLists[i].type === 'numberBox' && this.$route.query.end_date !== undefined && this.$route.query.end_date !== '') {
          let startDate = moment(this.$route.query.start_date, 'DD-MM-YYYY')
          // Ensure user choose a date either today or above todays date
          if (startDate.diff(this.today, 'days') >= 0) {
            let endDate = moment(this.$route.query.end_date, 'DD-MM-YYYY')
            let diffDays = endDate.diff(startDate, 'days')
            if (diffDays < 1) {
              questionLists[i].reply = 1
            } else {
              questionLists[i].reply = diffDays
            }
          }
        }
      }

      return questionLists
    },
    checkUserStatus () {
      if (this.$store.getters['user/getUserAccessState']) {
        this.userStatus = '1' // log in user
      } else {
        this.userStatus = '0' // non-log in user
      }
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
    checkSelect (label, item) {
      // empty reply
      if (item.reply === undefined || item.reply.length === 0) {
        return false
      } else if (item.type === 'checkBoxSelector' || item.type === 'personalItemSelector' || item.questionId === 90018) {
        if (item.reply.indexOf(label) > -1) {
          return true
        }
      } else if (item.reply === label) {
        return true
      }
      return false
    },
    select (event, value, item) {
      // add another pet selected
      if (value === -1) {
        this.count = 0
        this.$emit('current-count', this.count)
        return
      }

      this.$refs[value.value || value][0].$el.classList.toggle('picked')
      if (item.type === 'checkBoxSelector' || item.type === 'personalItemSelector' || item.questionId === 90018) {
        // deselect (check if previously selected)
        let index = item.reply.indexOf(value)
        if (index > -1) {
          item.reply.splice(index, 1)
          this.newPets.splice(index, 1)
        } else {
          item.reply.push(value)
          this.newPets.push(this.personalItems[value || value.value])
        }
        return
      } else if (item.reply === value) {
        item.reply = ''
        return
      } else {
        item.reply = value
      }

      if (this.$refs[value.value || value][0].$el.classList.toString().indexOf('picked') > -1) {
        // selected options
        if (item.type === 'personalItemSelector' || item.questionId === 90018) {
          item.reply.push(value)
          this.newPets.push(this.personalItems[value || value.value])
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
            let breedSection = this.$_.findWhere(this.petLists, {'questionId': 6})
            if (breedSection.reply.length > 0) {
              breedSection.reply = ''
            }

            this.petInfo.ID = value
            this.petInfo.type = value.value
            this.petInfo.title = value.value
            this.petInfo.image = 'statics/images/pets/' + value.value + '.png'

            // load pet's breed selections
            this.breedInfo()
            break

          case 6:
            this.petInfo.breed = value
            break

          case 8:
            this.petInfo.weight = value
            this.petInfo.ID = this.newPetCount

            //  new instance of a pet
            let pet = {
              ID: null,
              type: null,
              weight: null,
              breed: null,
              image: null,
              title: null
            }

            //  duplicate info and push to display
            Object.assign(pet, this.petInfo)
            this.createNewPet(pet)

            //  reset create pet form
            this.questionLists[1].reply = ''
            this.questionLists[3].reply = ''
            this.questionLists[5].reply = ''
            break
        }

        //  go next question
        if (item.questionId < 9) {
          this.count = this.count + 2
          this.$emit('current-count', this.count)
        }
      }
    },
    createNewPet (petDetails) {
      // set default pet name to pet type
      if (!petDetails.name) {
        petDetails.name = petDetails.breed
      }

      //  new pet
      let petDescription = JSON.stringify(this.createFormConversion(petDetails))
      let newPetForm = {
        'personalItemsInfo': {
          'title': petDetails.type,
          'itemDescription': petDescription,
          'media': [
            {
              'type': 'image',
              'filename': ''
            }
          ]
        }
      }

      // store pet info in local storage for non-login users
      if (!this.$store.getters['user/getUserAccessState'] || this.$store.getters['user/getUserUuidState'] === null) {
        //  new instance of a pet
        let pet = {
          ID: null,
          type: null,
          weight: null,
          breed: null,
          image: null
        }

        //  duplicate info and push to display
        Object.assign(pet, this.petInfo)
        this.personalItems.push(pet)

        // update cached
        let cacheInfo = {
          items: this.personalItems,
          hide: false
        }

        if (this.$store.getters['cached/getPersonalItemsCached'] && this.$store.getters['cached/getPersonalItemsCached'].hasOwnProperty('hide')) {
          cacheInfo.hide = this.$store.getters['cached/getPersonalItemsCached'].hide
        }

        this.$store.dispatch('cached/cachePersonalItems', cacheInfo)
        return
      }

      this.$axios.post(`users/${this.$store.state.user.uuid}/personal-items?v=6`, newPetForm, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        //  new instance of a pet
        let pet = {
          ID: null,
          type: null,
          weight: null,
          breed: null,
          image: null
        }

        //  duplicate info and push to display
        Object.assign(pet, this.petInfo)
        pet.ID = response.data.wallInfo.personalItemId
        pet.mediaInfo = response.data.wallInfo.mediaInfo
        this.personalItems.push(pet)

        // cache personal items
        let cacheInfo = {
          items: this.personalItems,
          hide: false
        }

        if (this.$store.getters['cached/getPersonalItemsCached'] && this.$store.getters['cached/getPersonalItemsCached'].hasOwnProperty('hide')) {
          cacheInfo.hide = this.$store.getters['cached/getPersonalItemsCached'].hide
        }

        this.$store.dispatch('cached/cachePersonalItems', cacheInfo)

        // default select new pet added
        this.questionLists[this.petLists.length + 1].reply.push(this.personalItems.length - 1)
      }).catch((error) => {
        console.log(error)
      })
    },
    createFormConversion (petDetails) {
      let language = this.getLanguage()
      let form = createPetForm[language]

      // fall back en
      if (!form) {
        form = createPetForm['en']
      }
      form = JSON.parse(form.masterForm.replace('\\', '')).question

      for (var index in form) {
        if (form[index].questionId === 2) {
          form[index].reply = petDetails.name
        } else if (form[index].questionId === 4) {
          form[index].reply = petDetails.type
        } else if (form[index].questionId === 6) {
          form[index].reply = petDetails.breed
        } else if (form[index].questionId === 8) {
          form[index].reply = petDetails.weight
        } else if (form[index].questionId === 10) {
          // default set pet gender as others
          form[index].reply = 'Others'
        }
      }

      return {
        'question': form
      }
    },
    getPersonalItems () {
      this.personalItemsLoader = true
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
            mediaInfo: response.data.personalItemsInfo.items[i].mediaInfo,
            name: pet[1].reply,
            title: response.data.personalItemsInfo.items[i].title
          }

          this.personalItems.push(personalPet)

          // default select all available pets
          this.questionLists[this.petLists.length + 1].reply.push(i)
        }

        // jump to add pets when personal items empty
        if (this.personalItems.length === 0) {
          this.count = 0
        } else {
          // cache personal items
          let cacheInfo = {
            items: this.personalItems,
            hide: false
          }

          if (this.$store.getters['cached/getPersonalItemsCached'] && this.$store.getters['cached/getPersonalItemsCached'].hasOwnProperty('hide')) {
            cacheInfo.hide = this.$store.getters['cached/getPersonalItemsCached'].hide
          }

          this.$store.dispatch('cached/cachePersonalItems', cacheInfo)
        }
      }).catch((error) => {
        console.error(error)
      }).finally(() => {
        this.personalItemsLoader = false
      })
    },
    getPetSizeImg (petSize) {
      //  console.log(petSize)
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
    getImgSrc (file, index, title) {
      let temp = []
      if (file) {
        temp = file.split('/')
      }

      if (index === 90049 && temp.length > 0 && temp[temp.length - 1].substr(temp[temp.length - 1].length - 4) === '.jpg' && temp[temp.length - 1] !== '.jpg') {
        return file
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
    checkDate (serviceStart) {
      if (serviceStart) {
        return moment(serviceStart).format('YYYY-MM-DD') >= moment(this.today).format('YYYY-MM-DD')
      } else {
        return moment().format('YYYY-MM-DD') >= moment(this.today).format('YYYY-MM-DD')
      }
    },
    checkEndDate (serviceEnd) {
      // for daycare allowed same end and start day
      if (this.serviceId === 8) {
        return moment(serviceEnd).format('YYYY-MM-DD') >= moment(this.serviceStart).format('YYYY-MM-DD')
      } else {
        return moment(serviceEnd).format('YYYY-MM-DD') > moment(this.serviceStart).format('YYYY-MM-DD')
      }
    },
    nextButtonClick () {
      if (this.listCheck) {
        this.count = this.count + 2
        this.$emit('current-count', this.count)

        // scroll to top
        window.scrollTo(0, 0)
      } else {
        this.errorCheck()
      }
    },
    updateCurrentCount () {
      this.count = this.count - 2
      this.$emit('current-count', this.count)
    },
    getListingQuestions (fullServiceName) {
      for (let i = 0; i < this.localFormListing.length; i++) {
        if (fullServiceName === Object.keys(this.localFormListing[i])) {
          return this.localFormListing[i]
        }
      }
      return null
    },
    // Some reply maybe in array for better readability
    // convert it to normal string to show at the end
    replyConversion (value) {
      if (value === '') {
        return '-'
      }
      if (Array.isArray(value)) {
        if (value[0].ID === undefined) {
          let temp = ''
          for (let i = 0; i < value.length; i++) {
            if (i > 0) {
              temp = temp + ', '
            }
            if (Number.isInteger(value[i])) {
              temp = temp + (this.personalItems[value[i]].name || this.personalItems[value[i]].breed)
            } else {
              temp = temp + value[i]
            }
          }
          return temp
        }
        return value.toString().replace(',', ', ')
      } else {
        return value
      }
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

      if (Array.isArray(arrayVal)) {
        arrayVal = arrayVal.map((item, index) => {
          return {
            'label': item,
            'value': item,
            'id': index
          }
        })
      }

      return arrayVal
    },
    computeNights () {
      let startDate = moment(this.serviceStart).format('YYYY-MM-DD')
      let endDate = moment(this.serviceEnd).format('YYYY-MM-DD')
      return moment(endDate).diff(startDate, 'days').toString()
    },
    getRandomInt (max) {
      return Math.floor(Math.random() * Math.floor(max))
    },
    showSubmissionLoader () {
      this.listCheck = true
      this.nextButtonClick()

      this.interval = setInterval(() => {
        if (this.onError) {
          this.onError = false
          clearInterval(this.interval)
          this.count = this.count - 2
          this.$emit('current-count', this.count)
          this.submitPercentage = 0
          return
        }

        this.submitPercentage = Math.min(1, this.submitPercentage + Math.min(0.18, Math.random()))

        if (this.submitPercentage === 1) {
          clearInterval(this.interval)

          setTimeout(() => {
            this.$emit('current-count', 8)

            // User still hasn't verify/add phone number
            if (!this.$store.state.user.mobileNum || (this.$store.state.user.mobileVerified !== 1)) {
              this.$router.replace('/user/prompt-phone')
              return
            }

            // User still hasn't verify email
            if (!this.$store.state.user.email) {
              this.$router.replace('/user/confirm-email')
              return
            }

            history.pushState('ThankYou', 'ThankYou', this.$router.resolve({ name: 'ThankYou' }))
            this.$router.push({ name: 'RequestSubmitted', params: {requestReference: this.requestReference} })
            console.log(window.history.length)
          }, 500)
        }
      }, 250 + Math.random() * 1000)
    },
    // Submit Form
    // Will check if user is logged in or not
    submitRequest () {
      if (!this.listCheck && (this.count < (this.questionLists.length))) {
        this.errorCheck()
        return
      }

      // We don't want to submit the form is loading is still true,
      // because it means the request is still in progress
      if (this.showLoading === true) {
        return
      }
      this.showLoading = !this.showLoading // show loading animation

      this.requestInfo.requiredTime = moment(this.serviceStart + ' ' + this.serviceStartTime).utc().format('YYYY-MM-DD HH:mmZ')

      this.requestInfo.serviceId = this.serviceId
      this.requestInfo.requestDescriptionJson = this.modelConversion()

      // set user's preffered currency
      this.requestInfo.preferredCurrency = this.$store.getters['user/getUserPrefferedCurrency']

      // set current to default 0
      this.requestInfo.budgetCurrency = 0
      this.requestInfo.offerCurrency = 0

      // Check before Submitting if all location info are not null
      if (!this.requestInfo.latitude && !this.requestInfo.longitude && !this.requestInfo.fullAddress) {
        console.log('All three properties are empty.')
      }

      // insert current language id
      let languageId = this.$_.findWhere(this.languageOptions, {'value': this.$store.state.user.language}).id
      this.requestInfo.language = languageId

      // Remove direct request if we have brodcast
      if (this.broadcast === '1' || this.broadcast === 1) {
        this.requestInfo.reassignAllowed = 1
      }

      if (this.bizid) {
        this.requestInfo.bizid = this.bizid
      }

      // Insert promocode into request if exist from url query
      if (this.$route.query.promo) {
        this.requestInfo.promoCode = this.$route.query.promo
      }

      // Check if country id set
      if (!this.requestInfo.countryId) {
        this.requestInfo.countryId = this.$store.getters['user/getUserMobileCountryId']
      }

      // User is not logged in
      if (!this.$store.state.user.access || this.$store.getters['user/getUserUuidState'] === null) {
        this.$q.localStorage.set('localStorageRequestInfo', {requestInfo: this.requestInfo})
        this.$router.replace({name: 'Index', query: {redirect: 1}})
        return
      }

      this.showSubmissionLoader()
      // submit form
      if (this.$store.state.user.access) {
        this.sendImpression('Request Submitting', this.getCountryShortName(this.requestInfo.countryId))
        console.log('Form before subitting', this.requestInfo)
        console.log(' Stringified Form before subitting', JSON.stringify(this.requestInfo))
        this.$axios.post(`users/${this.$store.state.user.uuid}/requests/direct?v=6`, JSON.stringify({requestInfo: this.requestInfo}), {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          this.$q.localStorage.set('localStorageFormResponseInfo', response.data)
          this.requestReference = response.data.requestInfo.requestReference
        }).catch(e => {
          let lang = this.$store.getters['user/getCurrentLanguage']
          let postForm = this.requestInfo
          this.onError = true
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
          this.showLoading = !this.showLoading
          if (e.response.data.message) {
            let requestTitle = this.$t('requests.error.title')
            this.$q.dialog({
              title: requestTitle,
              message: e.response.data.message,
              ok: {
                label: 'Contact Support',
                flat: true
              },
              cancel: {
                label: 'its okay',
                flat: true
              }
            }).onOk(data => {
              this.$router.push({name: 'ChatSupportHelp'})
            }).onCancel(() => {
            })
          } else {
            let requestTitle = this.$t('requests.error.title')
            let message = this.$t('requests.petboarding.error.occurred')
            this.$q.dialog({
              title: requestTitle,
              message: message
            })
          }
          this.showLoading = false
          console.log(e)
        })
      }
    },
    // Convert some input into values that will be accepted by the server
    modelConversion () {
      let questionLists = this.questionLists
      let language = this.getLanguage()
      let fullServiceName = this.getServiceName() + '.' + language
      let requestDetails = JSON.parse(formListing[fullServiceName].story).question
      requestDetails[1].selectedIndex = []
      requestDetails[1].reply = ''

      for (var index in questionLists) {
        if (questionLists[index].type !== 'label' && index > 6) {
          if (questionLists[index].type === 'checkBoxSelector') {
            if (Array.isArray(questionLists[index].reply)) {
              requestDetails[index - 6].reply = questionLists[index].reply.join(', ')
            } else {
              requestDetails[index - 6].reply = questionLists[index].reply
            }
          } else if (questionLists[index].type === 'personalItemSelector') {
            for (let count = 0; count < questionLists[index].reply.length; count++) {
              requestDetails[1].selectedIndex.push(this.personalItems[questionLists[index].reply[count]].ID)
              requestDetails[1].reply = requestDetails[1].reply + this.personalItems[questionLists[index].reply[count]].title
              if (count < questionLists[index].reply.length - 1) {
                requestDetails[1].reply = requestDetails[1].reply + ', '
              }
            }
            requestDetails[1].selectedIndex = requestDetails[1].selectedIndex
          } else if (questionLists[index].questionId === 90002) {
            requestDetails[index - 6].reply = moment(this.serviceStart + ' ' + this.serviceStartTime).utc().format('YYYY-MM-DD HH:mmZ')
            console.log('insert time: ' + requestDetails[index - 6].reply)
          } else if (questionLists[index].questionId === 90006) {
            requestDetails[index - 6].reply = this.computeNights()
          } else if (questionLists[index].questionId === 90018) {
            requestDetails[index - 6].reply = questionLists[index].reply.toString()
          } else {
            requestDetails[index - 6].reply = questionLists[index].reply
          }
        }
      }

      return JSON.stringify({'question': requestDetails})
    },
    getServiceName () {
      for (let i = 0; i < services.length; i++) {
        let service = services[i]
        if (('/services/' + this.$route.params.uri) === service.link) {
          this.serviceId = service.id
          return service.name
        } else if (('/services/' + this.$route.params.uri) === service.alternativeLink) {
          this.serviceId = service.id
          return service.name
        }
      }
      return null
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
        let locale = this.$store.state.user.language
        if (ALLOWED_LANGUAGE.indexOf(locale) > -1) {
          return locale
        }
        return 'en'
      } catch (e) {
        if (typeof (this.$route.query.lang) !== 'undefined') {
          console.error('An error has occured when getting lang. Query Variable is ' + this.$route.query.lang + ' locale is ' + this.$store.state.user.language)
        }
        let lang = this.$store.getters['user/getCurrentLanguage']
        bugsnagClient.notify(new Error(e), {
          beforeSend: function (report) {
            report.metaData = {
              accountInfo: {
                language: lang
              }
            }
          }
        })
        return 'en'
      }
    },
    getCountryId (countryName) {
      let countryId = this.$_.findWhere(countries, {'countryName': countryName})
      if (countryId) {
        return parseInt(countryId.id)
      } else {
        return this.$store.getters['user/getUserMobileCountryId'] || 234
      }
    },
    getCountryShortName (id) {
      let countryId = id
      if (typeof id === 'number') {
        countryId = countryId.toString()
      }

      let countryName = this.$_.findWhere(countries, {'id': countryId})
      if (countryName) {
        return countryName.countryName
      } else {
        return 'United States'
      }
    },
    onCheckError (index) {
      let questionLists = this.questionLists
      if (questionLists[index].type === 'dateSelector') {
        this.$refs.qDate[0].hide()
        this.$refs.qTime[0].hide()
        if (questionLists[index].questionId === 90002) {
          // this.serviceEnd = moment(this.serviceStart).add(1, 'days').format('YYYY-MM-DD')
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
    errorCheck (count) {
      // If no error occur then hide error text
      if (this.listCheck) {
        this.error = false
        return
      }

      let input = this.questionLists[this.count + 1]
      let errorMessage = {
        'personalItemSelector': 'form.request.error.required.personal.items',
        'inputBox': 'form.request.error.required',
        'location': 'form.request.error.required.location',
        'checkBoxSelector': 'form.request.error.required.checkbox',
        'radioButtonSelector': 'form.request.error.required.radio',
        'numberBox': 'form.request.error.number.emphasize',
        'dateSelector': 'form.request.date.greater.than.a.year'
      }

      if (Number(input.required) === 1) {
        if (this.dateError) {
          this.error = this.$t('please.select.a.date.in.the.future')
        } else {
          this.error = this.$t(errorMessage[input.type])
        }

        this.triggerPromptDialog(true, this.error, null, this.$t('dismiss'))
      }
    },
    onPlaceChanged (place, index, locationFrom = false) {
      //    this.sendImpression('Enter Location')
      this.isLocationSet = false
      let addressComponents = place.address_components
      let location = {}

      if (typeof addressComponents !== 'object' || !addressComponents.length) {
        throw new Error('Address Component is not complete with data ' + JSON.stringify(place))
      }

      addressComponents.map(addressComponent => {
        if (addressComponent.types[0] === 'locality') {
          location.city = addressComponent.long_name
        }

        if (addressComponent.types[0] === 'administrative_area_level_1') {
          location.state = addressComponent.long_name
        }

        if (addressComponent.types[0] === 'country') {
          location.country = addressComponent.long_name
          this.countryShortName = addressComponent.short_name
          this.requestInfo.countryId = this.getCountryId(this.countryShortName)

          // update user mobile country id
          this.$store.commit('user/updateUserMobileCountryIdState', parseInt(this.requestInfo.countryId))
        }
      })

      // update form with request location info
      if (locationFrom) {
        this.requestInfo.latitude = place.geometry.location.lat().toString()
        this.requestInfo.longitude = place.geometry.location.lng().toString()
        this.requestInfo.fullAddress = place.formatted_address.toString()
      }

      location.latitude = place.geometry.location.lat().toString()
      location.longitude = place.geometry.location.lng().toString()
      this.questionLists[index].reply = place.formatted_address.toString()
      this.questionLists[index].location = location
      this.isLocationSet = true
      this.listCheck = true
    },
    getFullAddress () {
      if (this.$route.query.reqlocation) {
        return this.$route.query.reqlocation.replace(/--/g, ', ').replace(/-/g, ' ').replace(/~/g, '-')
      }
      return null
    },
    getCountryIdOnLoad () {
      let countryId = null
      if (this.$route.query.country_id) {
        countryId = parseInt(this.$route.query.country_id)
      }

      if (this.$route.query.country) {
        let country = this.$route.query.country.replace(/--/g, '').replace(/-/g, '').replace(/~/g, '').replace(/\s/g, '')
        for (let i = 0; i < countries.length; i++) {
          if (countries[i].shortName.toLowerCase().replace(/\s/g, '') === country.toLowerCase()) {
            countryId = parseInt(countries[i].id)
            break
          }
        }
      }

      if (countryId === null) {
        countryId = this.$store.getters['user/getUserMobileCountryId'] || 234
      }

      return countryId
    },
    sendData (index) {
      if (index < this.questionLists.length) {
        //  let currentQuestion = this.questionLists[index]
        //  this.sendImpression('Request In Progress', this.requests.serviceName + ' - ' + currentQuestion.questionId)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.petImg
  object-fit: cover
  height: 73%
  width: 100%
  min-height: 120px
  max-height: 149px

.petImgDesktop
  object-fit: cover
  height: 75%
  width: 100%
  max-height: 149px

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

.listing-content
  min-height: 285px !important
  margin-bottom: 13px

.layout-content > .layout-view:first-child
  overflow: initial !important

.label
  margin-bottom: 13px
  padding-left: 0px

.anchor-normal
  color: $grey
  font-weight: bold

.anchor
  color: $grey
  font-weight: bold

.anchor:visited
  text-decoration: underline

.anchor:hover
  color: $primary

.list
  background: white !important
  border: 1px solid #f6f3f3 !important

.progress
  height: 15px !important
  border-radius: 0px !important
  z-index: 3
  top: 43px

.custom-disabled
  cursor: not-allowed !important
  background: var(--q-color-primary) !important
  opacity: 0.8

.border-top-lightgrey
  border-top: 1px solid lightgrey !important

.font-large
  font-size: large !important

.item
  margin: 0px !important

.margin-bottom-20
  margin-bottom: 20px

input[type='checkbox']
  display:none

input[type='checkbox'] + label
  cursor:pointer

input[type='checkbox'] + label:before
  background: #fff
  height: 21px
  border:1px solid #bcc4d1
  content: ' '
  display: inline-block
  width: 21px
  vertical-align: middle
  margin-right: 10px
  position:relative
  top:-1px

input[type='checkbox']:checked + label:before
  color: transparent
  text-align: center
  line-height: 21px
  background: #6c5493
  content: '✔'
  text-shadow: 0 0 0 white

.z999
  z-index: 9999 !important

.opacity-6
  opacity: 0.6

.form-container
  min-width: 100%

.progress-on-top
  width: 225px
  z-index: 100
  height: 5px !important

.mt72
  margin-top 72px !important
.mt58
  margin-top 38px !important
.t-72
  top -42px !important
  position inherit
.t-84
  top -84px !important
  position inherit

</style>
