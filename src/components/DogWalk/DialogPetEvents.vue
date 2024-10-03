<template>
    <q-dialog v-model="modal" @hide="closePopUp" class="bg-white" :maximized="$q.platform.is.mobile" transition-show="slide-up" transition-hide="slide-down" style="z-index: 9999;">
        <q-card style="border-radius: 15px;height: 100%;" class="q-pb-xl" :style="{'max-width: 355px;': $q.platform.is.desktop}">
          <!-- Header -->
          <q-toolbar style="border-bottom: 1px solid lightgrey;z-index: 9999;" class="fixed-top bg-white">
            <q-btn flat round dense @click="closePopUp" size="lg" icon="chevron_left"></q-btn>
            <q-toolbar-title >
              <h6 class="q-my-none font-header-title" v-if="type === 'poo'" style="margin-left: 31%;">{{$t('poo.event')}}</h6>
              <h6 class="q-my-none font-header-title" v-else-if="type === 'pee'" style="margin-left: 31%;">{{$t('pee.event')}}</h6>
            </q-toolbar-title>
          </q-toolbar>

          <q-card-section class="q-px-none q-py-xl">
            <div v-if="walkingPets" class="q-mx-md">
              <h6 class="q-my-sm" v-if="type === 'poo'">{{$t('which.pet.did.the.poo')}}</h6>
              <h6 class="q-my-sm" v-if="type === 'pee'">{{$t('which.pet.did.the.pee')}}</h6>

              <!-- My Pets -->
              <div>
                <pet-card v-for="(pet, index) in walkingPets.selectedPets" :personalItemInfo="pet" :index="index" :key="pet.id" @on-select="onSelected"></pet-card>
              </div>
            </div>
            <div v-else>
              <div class="text-center">
                <ComponentPreLoader></ComponentPreLoader>
              </div>
            </div>
          </q-card-section>

          <!-- Bottom buttons -->
          <transition appear enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
            <div class="fixed-bottom bg-primary" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" @click="onSaveEvent">
              <div class="q-pa-md">
                <div class="text-white q-pb-sm text-center cursor-pointer font-header-title">
                  <q-btn class="col-xs-12 text-white font-normal text-capitalize" v-if="type === 'poo'" flat style="border-radius: 0px;" :ripple="false" :label="$t('save.poo.event')"></q-btn>
                  <q-btn class="col-xs-12 text-white font-normal text-capitalize" v-else-if="type === 'pee'" flat style="border-radius: 0px;" :ripple="false" :label="$t('save.pee.event')"></q-btn>
                </div>
              </div>
            </div>
          </transition>

        </q-card>
    </q-dialog>
</template>
<script>
export default {
  components: {
    'pet-card': () => import('components/DogWalk/PersonalItemCard.vue')
  },
  props: {
    trigger: {
      type: Boolean
    },
    type: {
      type: String
    }
  },
  data () {
    return {
      modal: false,
      walkingPets: null,
      displaySelected: []
    }
  },
  created () {
    this.loadPets()
  },
  watch: {
    trigger (value) {
      this.modal = value
    }
  },
  beforeDestroy () {
    this.modal = false
    this.closePopUp()
  },
  methods: {
    loadPets () {
      if (this.$q.localStorage.has('dogWalkInfo')) {
        this.walkingPets = this.$q.localStorage.getItem('dogWalkInfo')
      }
    },
    onCheck (id) {
      this.$refs[`pet-${id}`][0].toggle()
    },
    onSelected (petInfo, petIndex) {
      let index = this.displaySelected.indexOf(petIndex)
      if (index > -1) {
        this.displaySelected.splice(index, 1)
      } else {
        this.displaySelected.push(petIndex)
      }
    },
    onSaveEvent () {
      for (let i in this.displaySelected) {
        if (this.walkingPets.selectedPets[this.displaySelected[i]] && this.walkingPets.selectedPets[this.displaySelected[i]][this.type]) {
          this.walkingPets.selectedPets[this.displaySelected[i]][this.type] += 1
        } else {
          this.walkingPets.selectedPets[this.displaySelected[i]][this.type] = 1
        }
      }
      this.saveState()
      this.closePopUp()
    },
    saveState () {
      this.$q.localStorage.set('dogWalkInfo', this.walkingPets)
      this.$emit('on-save', this.type, this.displaySelected.length)
    },
    closePopUp () {
      this.$emit('on-close', false)
      this.displaySelected = []
    }
  }
}
</script>
