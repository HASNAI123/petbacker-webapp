<template>
    <q-dialog v-model="modal" @hide="closePopUp" class="bg-white" :maximized="$q.platform.is.mobile" transition-show="slide-left" transition-hide="slide-right" style="z-index: 9999;">
        <q-card>
          <!-- Header -->
          <q-toolbar style="border-bottom: 1px solid lightgrey;z-index: 9999;" class="fixed-top bg-white">
            <q-btn flat round dense @click="closePopUp" size="lg" icon="chevron_left"></q-btn>
            <q-toolbar-title >
              <h6 class="q-my-none font-header-title" style="margin-left: 31%;">{{$t('pet.walks')}}</h6>
            </q-toolbar-title>
          </q-toolbar>

          <q-card-section class="q-px-none q-py-xl">
            <q-img v-if="imageUrl" :src="imageUrl"></q-img>
          </q-card-section>

          <!-- Bottom buttons -->
          <transition appear enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
            <div v-if="momentUrl !== ''" class="fixed-bottom bg-primary" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" @click="sharingDialog = true" >
              <div class="q-pa-md">
                <div class="text-white q-pb-sm text-center cursor-pointer font-header-title">
                  <q-btn class="col-xs-12 text-white font-normal text-capitalize" flat style="border-radius: 0px;" label="Share This Walk" :ripple="false"></q-btn>
                </div>
              </div>
            </div>
          </transition>
        </q-card>

        <!-- Share Dialog -->
        <q-dialog v-model="sharingDialog" auto-close position="bottom" class="moreOptions" transition-show="slide-up">
          <dialog-share :detail="`I have completed a dog walking at PetBacker!`" :shareLink="`${$t('link.href.petbacker')}${momentUrl}`"></dialog-share>
        </q-dialog>
    </q-dialog>
</template>
<script>
export default {
  components: {
    'dialog-share': () => import('components/DialogShare.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    walkId: {
      required: true
    },
    imageUrl: {
      required: true
    }
  },
  data () {
    return {
      modal: false,
      sharingDialog: false,
      momentUrl: ''
    }
  },
  watch: {
    trigger (value) {
      this.modal = value

      if (this.momentUrl === '' && value) {
        this.getShareUrl()
      }
    }
  },
  methods: {
    getShareUrl () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/dog-walks/${this.walkId}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.momentUrl = response.data.dogWalkInfo.shareUrl
      }).catch((error) => {
        console.error(error)
      })
    },
    closePopUp () {
      this.$emit('on-close', false)
    }
  }
}
</script>
