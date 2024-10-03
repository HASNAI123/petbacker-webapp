<template>
    <q-page class="q-mx-md q-pb-xl q-mb-xl">
        <div v-if="aboutMeInfo" class="q-pb-xl">
            <div v-for="questionForm in aboutMeInfo" :key="questionForm.questionId" class="q-py-xs">
                <template v-if="questionForm.type === 'label'">
                    <!--<p class="caption">{{ getQuestion(questionForm.id, index) }}</p>-->
                    <p class="font-normal q-ma-none q-mt-lg">{{ questionForm.content }}</p>
                </template>
                <template v-else-if="questionForm.type === 'radioButtonSelector'" >
                    <q-select v-model="questionForm.reply" :options="questionToArray(questionForm.content)" :error="showError && !questionForm.reply && Boolean(questionForm.required)" class="full-width"></q-select>
                </template>
                <template v-else-if="questionForm.type === 'checkBoxSelector'">
                    <q-select v-model="questionForm.reply" class="full-width" multiple :error="showError && !questionForm.reply && Boolean(questionForm.required)" :options="questionToArray(questionForm.content)"></q-select>
                </template>
                <template v-else-if="questionForm.type === 'inputBox'">
                    <q-input  v-model="questionForm.reply" class="full-width input" type="textarea" :error="showError && !questionForm.reply && Boolean(questionForm.required)" hide-bottom-space :placeholder="questionForm.content" borderless></q-input>
                </template>
                <template v-else-if="questionForm.type === 'numberBox'">
                    <q-input v-model.number="questionForm.reply" class="full-width" type="number" :error="showError && !questionForm.reply && Boolean(questionForm.required)"></q-input>
                </template>
                <template v-else>
                    <q-input class="full-width" v-model="questionForm.reply" :error="showError && !questionForm.reply && Boolean(questionForm.required)"></q-input>
                </template>
            </div>
        </div>
        <div class="col-xs-12 text-center" v-else>
          <ComponentPreLoader></ComponentPreLoader>
        </div>

        <!-- Dialog Error -->
        <dialog-error :trigger="errorModal" :message="errorMessage" @on-close="triggerErrorDialog"></dialog-error>

        <!-- Bottom Save Button -->
        <div class="fixed-bottom bg-primary" style="border-top-right-radius: 15px;border-top-left-radius: 15px;z-index: 4000;">
            <div class="q-pt-md q-pb-sm" @click="saveAboutMe">
                <div class="text-white text-center cursor-pointer font-header-title">
                    <p v-if="!showLoading" class="text-weight-bold font-title">{{$t('button.save')}}</p>
                    <span v-else>
                        <q-spinner size="2.3em"></q-spinner>
                    </span>
                </div>
            </div>
        </div>
    </q-page>
</template>
<script>
export default {
  components: {
    'dialog-error': () => import('components/Dialog400Error.vue')
  },
  data () {
    return {
      aboutMeInfo: null,
      showLoading: false,
      showError: false,
      errorModal: false,
      errorMessage: ''
    }
  },
  created () {
    this.getAboutMeForm()
  },
  methods: {
    triggerErrorDialog (status) {
      this.errorModal = status
    },
    getAboutMeForm () {
      this.$axios.get(`users/${this.$store.getters['user/getUserUuidState']}/about-me`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.data.aboutMeInfo.content_json) {
          console.log('inside content_json', response.data.aboutMeInfo.content_json)
          this.aboutMeInfo = this.convertForm(JSON.parse(response.data.aboutMeInfo.content_json).question)
        } else {
          this.aboutMeInfo = this.convertForm(JSON.parse(response.data.aboutMeInfo.questionnaire).question)
        }
        console.log(this.aboutMeInfo)
      }).catch((error) => {
        console.error(error)
      })
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

        // replaces "['" and "']"
        // at the start and end of string
        a = a.replace(/^(\[')|('])$/g, '')
        arrayVal = a.split(`','`)
      }

      return arrayVal
    },
    modelConversion () {
      let questionLists = this.aboutMeInfo

      for (var index in questionLists) {
        if (questionLists[index].type !== 'label') {
          if (questionLists[index].type === 'checkBoxSelector') {
            if (questionLists[index].reply) {
              console.log(index, questionLists[index].reply)
              questionLists[index].reply = questionLists[index].reply.join(', ')
            } else {
              questionLists[index].reply = ''
            }
          } else if (questionLists[index].type === 'radioButtonSelector') {
            if (questionLists[index].reply.label) {
              questionLists[index].reply = questionLists[index].reply.value
            } else {
              questionLists[index].reply = questionLists[index].reply
            }
          } else {
            questionLists[index].reply = questionLists[index].reply
          }
        }
      }

      return {'question': questionLists}
    },
    convertForm (questionLists) {
      // Convert questions to suite the v-for in template above
      for (let i in questionLists) {
        if (questionLists[i].type === 'checkBoxSelector') {
          // If already has a reply
          if (questionLists[i].reply) {
            questionLists[i].reply = questionLists[i].reply.split(', ')
          } else {
            questionLists[i].reply = []
          }
        } else if (questionLists[i].reply) {
          questionLists[i].reply = questionLists[i].reply
        } else {
          questionLists[i].reply = ''
        }
      }

      return questionLists
    },
    formCheck (questionList) {
      let errorMessage = {
        'inputBox': 'service.description.error',
        'location': 'form.request.error.required.location',
        'checkBoxSelector': 'form.request.error.required.checkbox',
        'radioButtonSelector': 'form.request.error.required.radio',
        'numberBox': 'form.request.error.number.emphasize',
        'dateSelector': 'form.request.date.greater.than.a.year'
      }

      for (let index in questionList) {
        if (Number(questionList[index].required) === 1 && questionList[index].type !== 'label') {
          if (questionList[index].reply === null || questionList[index].reply === '' || questionList[index].reply === ' ') {
            console.log(questionList[index])
            this.showLoading = false
            this.showError = true
            this.errorMessage = this.$t(errorMessage[questionList[index].type])
            this.triggerErrorDialog(true)
            return true
          }
        }
      }

      return false
    },
    saveAboutMe () {
      this.showLoading = true
      let status = this.formCheck(this.aboutMeInfo)

      if (status) {
        this.showLoading = false
        this.showError = true
        console.log('prompt error')
      } else {
        let innerJson = this.modelConversion()
        let aboutMeInfo = {
          'aboutMeInfo': {
            'aboutMeJson': JSON.stringify(innerJson)
          }
        }

        this.$axios.post(`users/${this.$store.getters['user/getUserUuidState']}/about-me`, aboutMeInfo, {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          this.$store.commit('user/updateAboutMe', response.data.aboutMeInfo.content)
          if (this.$route.query.redirect) {
            this.$router.replace({name: this.$route.query.redirect, params: {serviceId: this.$route.query.serviceId}})
          } else {
            this.$router.go(-1)
          }
        }).catch((error) => {
          console.error(error)
        }).finally(_ => {
          this.showLoading = false
        })
      }
    }
  }
}
</script>
