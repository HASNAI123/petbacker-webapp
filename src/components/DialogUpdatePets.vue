<template>
    <q-dialog v-model="modal" @hide="closePopUp" maximized transition-show="slide-up" transition-hide="slide-down" style="z-index: 500;">
        <q-card class="q-pa-none">
            <q-toolbar>
                <q-btn flat round @click="onRedirect" class="text-capitalize" icon="close"></q-btn>
            </q-toolbar>

            <q-card-section class="q-pt-none">
                <h5 class="text-weight-bold q-mt-md q-mb-sm">{{$t('update.your.pets')}}</h5>
                <p class="text-grey-6 q-my-sm font-normal">{{$t('update.pet.waiting.responses')}}</p>
                <p class="q-my-sm anchor-link" @click="onRedirect">{{$t('i.do.this.later')}}</p>
            </q-card-section>

            <!-- <q-card-section class="row no-wrap q-px-sm justify-left hide-scrollbar" style="height: 500px;overflow: auto;">
                <q-card class="col-12 q-ml-md" style="width: 315px;">
                    <q-img class="image-upload" height="350px" src="statics/images/graphic-placeholder.jpg" placeholder-src="statics/images/graphic-placeholder.jpg" basic></q-img>

                    <q-card-section>
                        <h6 class="q-my-none font-title text-weight-bold">Get the best matches for your pet</h6>
                        <p class="q-my-none">Increase the chances of getting the perfect Backer to take care of your pets</p>
                    </q-card-section>
                </q-card>

                <q-card class="col-12 q-ml-md" style="width: 315px;">
                    <q-img class="image-upload" height="350px" src="statics/images/graphic-placeholder.jpg" placeholder-src="statics/images/graphic-placeholder.jpg" basic></q-img>

                    <q-card-section>
                        <h6 class="q-my-none font-title text-weight-bold">Get the best matches for your pet</h6>
                        <p class="q-my-none">Increase the chances of getting the perfect Backer to take care of your pets</p>
                    </q-card-section>
                </q-card>

                <q-card class="col-12 q-ml-md" style="width: 315px;">
                    <q-img class="image-upload" height="350px" src="statics/images/graphic-placeholder.jpg" placeholder-src="statics/images/graphic-placeholder.jpg" basic></q-img>

                    <q-card-section>
                        <h6 class="q-my-none font-title text-weight-bold">Get the best matches for your pet</h6>
                        <p class="q-my-none">Increase the chances of getting the perfect Backer to take care of your pets</p>
                    </q-card-section>
                </q-card>
            </q-card-section> -->
            <q-card-section>
              <q-card>
                <q-img class="image-upload" height="350px" src="statics/images/update-pets.png" placeholder-src="statics/images/graphic-placeholder.jpg" basic></q-img>

                <q-card-section>
                    <h6 class="q-my-none font-title text-weight-bold">{{$t('get.the.best.matches')}}</h6>
                    <p class="q-my-none">{{$t('increase.the.chances')}}</p>
                </q-card-section>
              </q-card>
            </q-card-section>

            <div class="fixed-bottom bg-primary" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" @click="onNext">
                <div class="q-pa-md q-pb-lg">
                    <div class="text-white q-pb-sm text-center cursor-pointer font-header-title">
                        <span>{{$t('update.my.pets')}}</span>
                    </div>
                </div>
            </div>
        </q-card>
    </q-dialog>
</template>
<script>
export default {
  props: {
    trigger: {
      type: Boolean,
      default: false
    },
    requestId: {
      default: () => { return null }
    }
  },
  data () {
    return {
      modal: false,
      personalItems: []
    }
  },
  watch: {
    trigger (status) {
      if (status && this.checkPersonalItems()) {
        this.modal = true
      } else {
        this.modal = false
      }
    }
  },
  methods: {
    checkPersonalItems () {
      let status = false

      // handle guest login
      if (this.$store.getters['user/getUserUuidState'] === null) {
        return status
      }

      if (this.$store.getters['cached/getPersonalItemsCached'] && this.$store.getters['cached/getPersonalItemsCached'].hasOwnProperty('items') && this.$store.getters['cached/getPersonalItemsCached'].items.length > 0) {
        for (let pet of this.$store.getters['cached/getPersonalItemsCached'].items) {
          if (pet.mediaInfo && pet.mediaInfo.length > 0 && pet.mediaInfo[0].filePath.includes('outline')) {
            status = true
            break
          }
        }

        if (status === false) {
          this.onRedirect()
        }
      } else {
        this.onRedirect()
      }

      console.log('status', status)
      return status
    },
    onRedirect () {
      if (this.requestId) {
        this.$router.replace({ name: 'RequestSummary', params: {requestId: this.requestId} })
      } else {
        this.$router.replace({name: 'MobileDashboard'})
      }
    },
    onNext () {
      this.$router.push({name: 'MyPets'})
      this.closePopUp()
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
