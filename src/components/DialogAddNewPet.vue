<template>
    <q-dialog v-model="modal" @hide="onClose" class="bg-white" :maximized="$q.platform.is.mobile" transition-show="slide-left" transition-hide="slide-right" style="z-index: 3000;">
        <q-card :style="{'min-height': $q.platform.is.desktop ? '650px' : '', 'max-height': $q.platform.is.desktop ? '800px' : ''}">
            <q-toolbar :style="{'width': $q.platform.is.desktop ? '560px' : ''}" style="z-index: 5000;" class="borderline fixed-top bg-white">
              <q-btn flat round dense icon="chevron_left" size="1.4em" @click="backButtonDetected"></q-btn>
              <q-toolbar-title class="font-title">
                <h6 class="q-my-none text-title">{{$t('navbar.my.pets')}}</h6>
              </q-toolbar-title>
            </q-toolbar>
            <q-card-section>
                <div v-for="(question, num) in petForm" :key="question.questionId">
                    <div v-if="(question.questionId !== 101) && (question.type === 'label') && (num === count)" class="q-mb-sm text-weight-bold font-title" style="margin-top: 40px; margin-left: 18px;">
                        {{ question.content }}
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
                        <div class="col-md-12 col-xs-11 text-center" style="margin-left: 4%;" v-if="breedLoading">
                        <ComponentPreLoader></ComponentPreLoader>
                        </div>
                        <q-card v-else v-for="option in filteredBreeds" :key="option.id" :ref="option.name" square class="col-md-12 col-xs-11" :class="checkSelect(option.name, question) ? 'picked' : '' " @click="select($event, option.name, question)" style="margin-left: 15px; margin-right: 15px;">
                        <q-card-section >
                            {{option.name}}
                        </q-card-section>
                        <q-separator />
                        </q-card >
                    </div>
                    <div v-else-if="question.questionId === 8" class="row">
                        <q-card v-for="(option, index) in questionToArray(question.content)" :key="option.value" :ref="option.value" :class="checkSelect(option.value, question) ? 'picked' : '' " class="col-md-2 col-xs-5 q-mt-lg justify-center" @click="select($event, option.value, question)" style="margin-left: 20px;">
                            <q-img :src="getPetSizeImg(index)" :class="$q.platform.is.desktop ? 'petImgDesktop' : 'petImg'" placeholder-src="statics/images/graphic-placeholder.jpg" basic></q-img>
                            <q-card-section class="item-content cursor-pointer text-center">
                            <label :for="option.value" class="font-normal text-weight-bold">{{ option.label }}</label>
                            </q-card-section>
                        </q-card>
                    </div>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script>
import createPetForm from 'assets/form-create-pet.json'
export default {
  props: {
    trigger: {
      required: true,
      default: false
    }
  },
  data () {
    return {
      modal: false,
      displayError: false,
      isEditRequestLoaded: null,
      questionLists: [],
      user: null,
      count: 0,
      listCheck: false,
      showLoading: false,
      petInfo: {
        ID: null,
        type: null,
        weight: null,
        breed: null,
        image: null,
        name: null
      },
      QUESTION_PET_TYPE_ID: [4, 104],
      petType: this.$route.query['pet-type[]'] || null,
      petLists: null,
      petBreeds: [],
      selectedPets: [],
      breedLoading: true,
      dateError: false,
      requestLists: null,
      newPetCount: 0, // keep track of new pets created
      personalItems: [],
      personalItemsLoader: false,
      petForm: null,
      userSearch: '',
      petTypeInfo: null,
      createPetLoader: false
    }
  },
  created () {
    this.loadCreatePetForm()
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
    trigger (status) {
      this.modal = status
    }
  },
  beforeDestroy () {
    this.modal = false
    this.onClose()
  },
  methods: {
    onClose () {
      this.modal = false
      this.$emit('on-close', false)
      this.count = 0
    },
    backButtonDetected () {
      if (this.count === 0) {
        this.onClose()
      } else {
        this.count -= 2
      }
    },
    createNewPet (petDetails) {
      this.createPetLoader = true

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

      this.$q.loading.show()
      this.$axios.post(`users/${this.$store.state.user.uuid}/personal-items?v=8`, newPetForm, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        //  new instance of a pet
        let pet = {
          'title': response.data.wallInfo.title,
          'itemDescription': response.data.wallInfo.itemDescription,
          'mediaInfo': response.data.wallInfo.mediaInfo,
          'personalItemId': response.data.wallInfo.personalItemId,
          'id': response.data.wallInfo.personalItemId
        }

        this.$emit('on-added', pet)
        this.onClose()
      }).catch((error) => {
        console.log(error)
      }).finally(_ => {
        this.createPetLoader = false
        this.$q.loading.hide()
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
    checkSelect (label, item) {
      // empty reply
      if (item.reply === undefined || item.reply.length === 0) {
        return false
      } else if (item.questionId === 90049 || item.questionId === 90018) {
        if (item.reply.indexOf(label) > -1) {
          return true
        }
      } else if (item.reply === label) {
        return true
      }
      return false
    },
    loadCreatePetForm () {
      let language = this.getLanguage()
      this.petForm = createPetForm[language]

      // fall back en
      if (!this.petForm) {
        this.petForm = createPetForm['en']
      }
      this.petForm = this.convertForm(JSON.parse(this.petForm.questionShort.replace('\\', '')).question)
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

      let petType = 'Dog'
      console.log(this.petInfo)
      switch (this.petInfo.type) {
        case 'Σκύλος':
        case 'Chien':
        case 'สุนัข':
        case '狗':
        case 'Perro':
        case 'Dog':
          petType = 'Dog'; break
        case 'Γάτα':
        case 'Chat':
        case 'แมว':
        case '貓':
        case 'Gato':
        case 'Cat':
          petType = 'Cat'; break
        case 'Κουνέλι':
        case 'Lapin':
        case 'กระต่าย':
        case '兔子':
        case 'Conejo':
        case 'Rabbit':
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
        case 'Ferret':
          petType = 'Ferret'; break
        case 'Πουλί':
        case 'Oiseau':
        case 'นก':
        case '鸟类':
        case 'Ave':
        case 'Bird':
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
        case 'Others':
          petType = 'Others'; break
      }

      return `statics/images/pet-sizes/${petType}-${size}.png`
    },
    getImgSrc (file, index, title) {
      let temp = file.split('/')
      if (temp[temp.length - 1].substr(temp[temp.length - 1].length - 4) === '.jpg' && temp[temp.length - 1] !== '.jpg' && index === 90049) {
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
      this.$refs[value.value || value][0].$el.classList.toggle('picked')

      // add another pet selected
      if (value === -1) {
        window.scrollTo(0, 0)
        this.count = 0
        return
      }

      if (item.questionId === 90049 || item.questionId === 90018) {
        // deselect (check if previously selected)
        let index = item.reply.indexOf(value)
        if (index > -1) {
          item.reply.splice(index, 1)
          this.newPets.splice(index, 1)
        } else {
          item.reply.push(value)
          this.newPets.push(this.personalItems[value])
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
        if (item.questionId === 90049 || item.questionId === 90018) {
          //  console.log('Push: ' + value)
          item.reply.push(value)
          this.newPets.push(this.personalItems[value])
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
            this.petForm[1].reply = ''
            this.petForm[3].reply = ''
            this.petForm[5].reply = ''
            break
        }

        //  go next question
        if (item.questionId < 7) {
          this.count = this.count + 2
        }
      }
    }
  }
}
</script>
<style lang="stylus">
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

@media only screen and (min-width: 320px)
  .pet-card
    max-height: 70%
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
    height: 80%
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
    height: 100%
    width: 100%

.picked
  opacity: 0.45

.text-title
  margin-left: 12%
  font-size: 18px
</style>
