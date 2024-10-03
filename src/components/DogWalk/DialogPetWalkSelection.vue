<template>
    <q-dialog v-model="modal" @hide="closePopUp" class="bg-white" :maximized="$q.platform.is.mobile" transition-show="slide-up" transition-hide="slide-down" style="z-index: 9999;">
        <q-card ref="dog-walk" style="border-radius: 15px;height: 100%;" class="q-pb-xl" :style="{'max-width: 355px;': $q.platform.is.desktop}">
          <!-- Header -->
          <q-toolbar style="border-bottom: 1px solid lightgrey;z-index: 9999;" class="fixed-top bg-white">
            <q-btn flat round dense @click="decrement" size="lg" icon="chevron_left"></q-btn>
            <q-toolbar-title @click="decrement">
              <h6 class="q-my-none font-header-title" style="margin-left: 28%;" v-if="count === 0">{{$t('pet.walks')}}</h6>
              <h6 class="q-my-none font-header-title" :style="$store.getters['user/getCurrentLanguage'] !== 'frfr' ? 'margin-left: 24%;' : ''" v-else>{{$t('start.pet.walk')}}</h6>
            </q-toolbar-title>
          </q-toolbar>

          <q-card-section class="q-px-md q-py-xl q-mb-xl" v-if="count === 0">
            <div v-if="dogWalks !== null">
              <h6 class="q-my-xs"></h6>
              <q-separator>{{$t('completed.walks')}}</q-separator>
              <pet-walk-card v-for="walkInfo in dogWalks" :walkInfo="walkInfo" :key="walkInfo.id"></pet-walk-card>
              <div class="text-center" v-if="infiniteScrollLoader">
                <ComponentPreLoader></ComponentPreLoader>
              </div>
            </div>
            <div v-else>
              <div class="text-center">
                <ComponentPreLoader></ComponentPreLoader>
              </div>
            </div>
          </q-card-section>

          <q-card-section v-if="count === 1" class="q-px-none q-py-xl">
            <div v-if="personalItems" class="q-mx-md">
              <h6 class="q-my-sm">{{$t('which.pets.joining.for.walk')}}</h6>

              <!-- Get A Sitter -->
              <q-item class="q-mt-sm justify-center input" clickable v-if="dogWalkTasks === null || dogWalkTasks.length === 0" @click="$router.push({name: 'BackersNearby', query: {category_id: 16}})">
                <!-- Image -->
                <q-item-section avatar class="q-mr-sm">
                  <q-avatar>
                    <img src="statics/images/service-icons/dog-walking.png" class="image-upload"/>
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1" class="q-my-none font-normal text-weight-medium">{{$t('hire.pet.walker')}}</q-item-label>
                  <q-item-label lines="2" caption>{{$t('hire.pet.walker.description')}}</q-item-label>
                </q-item-section>

                <!-- Right Arrow -->
                <q-item-section side>
                  <q-icon name="chevron_right"></q-icon>
                </q-item-section>
              </q-item>

              <!-- Tasks -->
              <div v-if="dogWalkTasks && dogWalkTasks.length > 0">
                <pet-walk-task-card class="q-my-md" v-for="(taskInfo, index) in dogWalkTasks" :key="taskInfo.id" :index="index" :taskInfo="taskInfo" @remove-task="removeTask" @add-task="addTask" @on-select="onSelect"></pet-walk-task-card>
              </div>
              <div v-else-if="dogWalkTasks !== null">
                <div class="text-center">
                  <q-spinner-dots size="lg" color="primary"></q-spinner-dots>
                </div>
              </div>

              <h6 class="q-my-sm q-mt-md">{{$t('navbar.my.pets')}}</h6>
              <div v-if="personalItems">
                <!-- My Pets -->
                <pet-card v-for="myPetInfo in personalItems" :personalItemInfo="myPetInfo" :key="myPetInfo.id" @on-select="onSelect"></pet-card>

                <!-- Add Pet -->
                <q-item class="q-mt-sm justify-center input" clickable @click="triggerAddPetModal(true)">
                  <!-- Image -->
                  <q-item-section avatar style="height: 80px; width: 80px;" class="q-mr-sm bg-grey-3">
                    <q-icon name="fas fa-plus" size="45px" color="primary" class="text-center" style="left: 26%;"></q-icon>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label lines="1" class="q-my-none font-normal text-weight-medium">{{$t('add.another.pet')}}</q-item-label>
                    <q-item-label lines="2" caption>{{$t('add.another.pet.tap.here')}}</q-item-label>
                  </q-item-section>

                  <!-- Right Arrow -->
                  <q-item-section side>
                    <q-icon name="chevron_right"></q-icon>
                  </q-item-section>
                </q-item>
              </div>
            </div>
            <div v-else>
              <div class="text-center">
                <ComponentPreLoader></ComponentPreLoader>
              </div>
            </div>
          </q-card-section>

          <!-- Dialog Add Pet -->
          <dialog-add-pet :trigger="addPetModal" @on-close="triggerAddPetModal" @on-added="onAddPet"></dialog-add-pet>

          <!-- Bottom buttons -->
          <transition appear enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
            <div class="fixed-bottom bg-primary" v-if="$q.platform.is.mobile && ((showProceed && count === 1) || count === 0)" style="border-top-right-radius: 15px;border-top-left-radius: 15px;">
              <div class="q-pa-md">
                <div class="text-white q-pb-sm text-center cursor-pointer font-header-title">
                  <q-btn class="col-xs-12 text-white font-normal text-capitalize full-width" v-if="count === 0" flat style="border-radius: 0px;" :ripple="false" :label="$t('start.a.new.walk')" @click="onProceed"></q-btn>
                  <q-btn class="col-xs-12 text-white font-normal text-capitalize full-width" v-else-if="count === 1" flat style="border-radius: 0px;" :ripple="false" :label="$t('walk.pets.now')" @click="onWalkPets"></q-btn>
                </div>
              </div>
            </div>
          </transition>
        </q-card>
    </q-dialog>
</template>
<script>
import { debounce } from 'quasar'
export default {
  components: {
    'pet-walk-card': () => import('components/DogWalk/PetWalkCard.vue'),
    'pet-card': () => import('components/DogWalk/PersonalItemCard.vue'),
    'pet-walk-task-card': () => import('components/DogWalk/PetWalkTaskCard.vue'),
    'dialog-add-pet': () => import('components/DialogAddNewPet.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modal: false,
      personalItems: null,
      selectedPets: [],
      petIds: [],
      dogWalks: null,
      showProceed: false,
      count: 0,
      dogWalkPagination: 1,
      infiniteScrollLoader: false,
      loaded: false,
      dogWalkTasks: [],
      tasksId: [],
      tasksInfo: [],
      addPetModal: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value

      if (value) {
        setTimeout(() => {
          if (this.$refs['dog-walk']) {
            this.$refs['dog-walk'].$el.addEventListener('scroll', this.scrollEvent)
          }
        }, 1000)

        if (this.personalItems === null) {
          this.getPersonalItems()
        }

        if (this.dogWalks === null) {
          this.getDogWalks()
        }
      } else {
        if (this.$refs['dog-walk']) {
          this.$refs['dog-walk'].$el.removeEventListener('scroll', this.scrollEvent)
        }
      }
    },
    tasksId (value) {
      if (value.length > 0) {
        this.showProceed = true
      } else {
        if (this.selectedPets.length === 0) {
          this.showProceed = false
        }
      }
    }
  },
  created () {
    this.scrollEvent = debounce(this.scrollEvent, 350)
  },
  beforeDestroy () {
    this.modal = false
    this.closePopUp()
  },
  methods: {
    onAddPet (petInfo) {
      this.getPersonalItems()

      // let cacheInfo = {
      //   items: this.personalItems,
      //   hide: false
      // }

      // if (this.$store.getters['cached/getPersonalItemsCached'] && this.$store.getters['cached/getPersonalItemsCached'].hasOwnProperty('hide')) {
      //   cacheInfo.hide = this.$store.getters['cached/getPersonalItemsCached'].hide
      // }

      // this.$store.dispatch('cached/cachePersonalItems', cacheInfo)
    },
    triggerAddPetModal (status) {
      this.addPetModal = status
    },
    scrollEvent () {
      if (this.count === 0) {
        if (this.$refs['dog-walk'].$el.scrollTop >= (this.$refs['dog-walk'].$el.clientHeight - 200)) {
          this.loadMore()
        }
      }
    },
    loadMore () {
      if (this.loaded || this.infiniteScrollLoader) {
        return
      }

      this.infiniteScrollLoader = true
      setTimeout(() => {
        this.getDogWalks()
      }, 700)
    },
    onProceed () {
      this.count++
      this.getDogWalkTasks()
    },
    onSelect (petInfo) {
      let index = this.petIds.indexOf(petInfo.id)
      if (index > -1) {
        this.selectedPets.splice(index, 1)
        this.petIds.splice(index, 1)
      } else {
        this.selectedPets.push(petInfo)
        this.petIds.push(petInfo.id)
      }

      if (this.selectedPets.length > 0) {
        this.showProceed = true
      } else {
        if (this.tasksId.length === 0) {
          this.showProceed = false
        }
      }
    },
    onCheck (id) {
      this.$refs[`pet-${id}`][0].toggle()
    },
    addTask (id, index) {
      this.tasksId.push(id)
      this.tasksInfo.push(index)
    },
    removeTask (id, index) {
      let taskIndex = this.tasksId.indexOf(id)
      if (taskIndex > -1) {
        this.tasksId.splice(taskIndex, 1)
      }

      let i = this.tasksInfo.indexOf(index)
      if (i > -1) {
        this.tasksInfo.splice(i, 1)
      }
    },
    onWalkPets () {
      // save dog walk info in local storage
      let dogWalkInfo = {
        'petIds': this.petIds,
        'selectedPets': this.selectedPets,
        'started': false,
        'taskId': this.tasksId
      }
      this.$q.localStorage.set('dogWalkInfo', dogWalkInfo)

      this.$router.push({name: 'DogWalk'})
    },
    checkSelect (index) {
      // empty reply
      if (this.$_.findWhere(this.selectedPets, {'index': index})) {
        return true
      }

      return false
    },
    decrement () {
      if (this.count === 0) {
        this.closePopUp()
        return
      }

      if (this.count === 1 && this.dogWalks === null) {
        this.closePopUp()
        return
      }

      this.count--
    },
    closePopUp () {
      this.$emit('on-close', false)

      if (this.dogWalks) {
        this.count = 0
      }

      this.loaded = false
      this.infiniteScrollLoader = false

      if (this.dogWalks && this.dogWalks.length > 15) {
        this.dogWalks.splice(15, (this.dogWalks.length - 15))
      }

      if (this.dogWalkPagination > 1) {
        this.dogWalkPagination = 2
      } else {
        this.dogWalkPagination = 1
      }
    },
    getDogWalks () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/dog-walks?per_page=15&page=${this.dogWalkPagination}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (this.dogWalkPagination === 1) {
          if (response.status === 204) {
            this.onProceed()
            this.$refs['dog-walk'].$el.removeEventListener('scroll', this.scrollEvent)
          } else {
            this.dogWalks = response.data.dogWalkInfo.items
          }
        } else if (response.status === 204) {
          this.loaded = true
        } else {
          this.dogWalks = this.dogWalks.concat(response.data.dogWalkInfo.items)
        }
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        this.dogWalkPagination++
        this.infiniteScrollLoader = false
      })
    },
    getDogWalkTasks () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/dog-walks-tasks`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status !== 204) {
          this.dogWalkTasks = response.data.dogWalkTasksInfo.items
        } else {
          this.dogWalkTasks = null
        }
      }).catch((error) => {
        console.error(error)
      })
    },
    getPersonalItems () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/personal-items?v=6&dogWalk=1`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.personalItems = response.data.personalItemsInfo.items
        let cacheInfo = {
          items: this.personalItems,
          hide: false
        }

        // update cache
        if (!this.$store.getters['cached/getPersonalItemsCached']) {
          this.$store.dispatch('cached/cachePersonalItems', cacheInfo)
        } else if (JSON.stringify(response.data.personalItemsInfo.items) !== this.$store.getters['cached/getPersonalItemsCached'].items) {
          if (this.$store.getters['cached/getPersonalItemsCached'] && this.$store.getters['cached/getPersonalItemsCached'].hasOwnProperty('hide')) {
            cacheInfo.hide = this.$store.getters['cached/getPersonalItemsCached'].hide
          }

          this.$store.dispatch('cached/cachePersonalItems', cacheInfo)
        }
      }).catch((error) => {
        console.error(error)
      })
    }
  }
}
</script>
