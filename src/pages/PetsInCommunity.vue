<template>
    <q-page class="q-mb-xl bg-grey-2">
      <q-pull-to-refresh @refresh="this.refresh" ref="pull-refresh">
        <div :style="{'max-width': $q.platform.is.mobile ? '100%' : '1030px'}" class="margin-auto">
            <q-infinite-scroll @load="onLoad" class="row q-py-sm justify-center">
                <div v-for="(pet, index) in petInfo" :key="index" class="col-xs-12 q-mb-md">
                  <!-- Listing card -->
                  <pet-card :petInfo="pet" class="col-md-3 col-xs-5" :index="index" @on-like="onLikePost" @on-unlike="onUnlikePost" @on-guest-interaction="triggerGuestModeModal" @on-block-moment="onBlockMoment"></pet-card>
                </div>
                <div v-if="petInfo.length === 0 && endOfPage">
                  <p style="margin-left: 100%;width: 100%;">No pets available!</p>
                </div>
                <template v-slot:loading>
                  <div class="text-center margin-auto">
                    <ComponentPreLoader></ComponentPreLoader>
                  </div>
                </template>
            </q-infinite-scroll>
            <q-page-sticky position="bottom" :offset="[18, 18]">
              <q-btn rounded :label="$t('add.pet')" color="primary" :ripple="false" class="q-px-lg" @click="toAddPets"></q-btn>
            </q-page-sticky>
        </div>
      </q-pull-to-refresh>
        <!-- Dialog Login/Sign Up Now -->
        <dialog-guestmode :trigger="guestModeModal" :message="guestModeMessage" @on-close="triggerGuestModeModal"></dialog-guestmode>
    </q-page>
</template>
<script>
export default {
  components: {
    'pet-card': () => import('components/Explore/petCards.vue'),
    'dialog-guestmode': () => import('components/DialogLoginSignUpNow.vue')
  },
  data () {
    return {
      petInfo: [],
      currentPage: 1,
      endOfPage: false,
      firstLoad: false,
      guestModeMessage: this.$t('guest.mode.create.listing'),
      guestModeModal: false
    }
  },
  created () {
    this.getPetsInCommunity(true)
  },
  methods: {
    refresh (done) {
      this.currentPage = 1
      this.getPetsInCommunity(false, done)
    },
    onUnlikePost (index) {
      this.petInfo[index].totalLikes = `${parseInt(this.petInfo[index].totalLikes) - 1}`
      this.petInfo[index].isLiked = 0
    },
    onLikePost (index) {
      this.petInfo[index].totalLikes = `${parseInt(this.petInfo[index].totalLikes) + 1}`
      this.petInfo[index].isLiked = 1
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
    onLoad (index, done) {
      if (this.endOfPage) {
        done()
        return
      }

      setTimeout(() => {
        this.getPetsInCommunity(false, done)
      }, 2000)
    },
    getPetsInCommunity (firstLoad = false, done) {
      if (this.$store.getters['cached/getPetsInCommunityCached'] && firstLoad) {
        this.petInfo = this.$store.getters['cached/getPetsInCommunityCached']
        this.currentPage += 1
        return
      }

      this.$axios.get(`users/walls?page=${this.currentPage}&per_page=12&countryid=${this.$store.getters['user/getUserMobileCountryId']}`
      ).then((response) => {
        if (firstLoad) {
          this.firstLoad = true
        }
        if (this.currentPage === 1) this.petInfo = []
        this.petInfo = this.petInfo.concat(response.data.wallInfo.items)
        this.currentPage += 1
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        if (done) {
          done()
        }
      })
    },
    onBlockMoment () {
      this.currentPage = 1
      this.getPetsInCommunity()
    }
  }
}
</script>
