<template>
    <q-card :style="{'min-height': $q.platform.is.desktop ? '650px' : '', 'max-height': $q.platform.is.desktop ? '800px' : ''}">
        <q-toolbar :style="{'width': $q.platform.is.desktop ? '560px' : ''}" style="z-index: 5000;" class="borderline fixed-top bg-white">
          <q-btn flat round dense v-close-popup icon="chevron_left" size="1.3em"></q-btn>
          <q-toolbar-title v-close-popup class="font-title" >
            <h6 class="q-my-none text-title">{{ $route.query.sitter ? 'Owner\'s Pets' : $t('navbar.my.pets')}}</h6>
          </q-toolbar-title>
        </q-toolbar>

        <q-card-section class="row q-pt-xl" v-if="personalItems.length > 0">
            <q-card v-for="(pet, index) in personalItems" :key="index" :ref="pet.ID" :class="checkSelect(pet.ID) ? '' : 'picked' " @click="select(pet.ID, (pet.name || pet.title))" class="col-xs-5 col-md-3 q-mt-md justify-center pet-card" style="margin-left:20px;height: 100%;">
                <img :src="pet.image" :class="$q.platform.is.desktop ? 'petImgDesktop' : 'petImg'" class="image-upload" style="height: 200px;"/>
                <q-card-section class="item-content row cursor-pointer text-center q-px-xs q-py-sm">
                  <div class="col">
                    <p class="font-normal text-weight-bold q-mb-xs">{{ pet.breed }}</p>
                    <p class="text-label font-small text-weight-light q-mb-none" style="padding-bottom: 2px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{ pet.name || pet.weight }}</p>
                  </div>
                  <div class="col-1" v-if="checkSelect(pet.ID)">
                    <q-icon name="fas fa-check-circle" size="sm" class="text-primary float-right" style="top: 5px;"></q-icon>
                  </div>
                </q-card-section>
            </q-card>
            <!-- Add More Pets --> <!--
            <q-card ref="-1" class="col-xs-5 col-md-5 q-mt-lg clickable" @click="select(-1, 'Add Pets')" style="margin-left:27px;">
                <img src="statics/images/pets/add-pet.jpg" :class="$q.platform.is.desktop ? 'petImgDesktop' : 'petImg'">
                <q-card-section class="item-content text-center q-px-xs">
                    <p class="font-normal text-weight-bold q-mb-xs">Add Another Pet</p>
                    <p class="text-label font-small text-weight-light q-mb-xs">Tap here to add your pet</p>
                </q-card-section>
            </q-card>
            -->
        </q-card-section>

        <transition appear enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
          <div class="fixed-bottom bg-primary" v-if="$q.platform.is.mobile" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" v-close-popup>
            <div class="q-pa-md q-pb-lg">
              <div class="text-white q-pb-sm text-center cursor-pointer font-header-title">
                <span>{{$t('done')}}</span>
              </div>
            </div>
          </div>
        </transition>
    </q-card>
</template>
<script>
export default {
  props: {
    personalItems: {
      type: Array,
      required: true
    },
    selectedPets: {
      type: Array,
      required: true
    }
  },
  methods: {
    checkSelect (petId) {
      if (this.selectedPets.map(function (pet) { return pet.value }).indexOf(petId) > -1) {
        return true
      } else {
        return false
      }
    },
    select (petId, petTitle) {
      this.$refs[petId][0].$el.classList.toggle('picked')

      // add another pet
      if (petId === -1) {
        // TO DO PET FLOW
        return
      }

      // check if selected previously
      let index = this.selectedPets.map(function (pet) { return pet.value }).indexOf(petId)
      if (index !== -1) {
        // remove from selected array
        this.selectedPets.splice(index, 1)
        this.$emit('update-selected')
        return
      }

      // create a pet instance
      let pet = {
        'label': petTitle,
        'value': petId
      }
      this.selectedPets.push(pet)
      this.$emit('update-selected')
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
    height: 100%
    width: 100%

.picked
  opacity: 0.45

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
    margin-left: 32%

@media screen and (min-width: 530px)
  .text-title
    margin-left: 40%
</style>
